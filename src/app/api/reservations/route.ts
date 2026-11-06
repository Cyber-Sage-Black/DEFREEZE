import { NextResponse } from 'next/server';
import { createAdminClient } from '@supabase/server/core';

export async function GET() {
  try {
    const admin = createAdminClient();
    const { data, error } = await admin
      .from('registrations')
      .select('*')
      .order('submitted_at', { ascending: false });

    if (error) {
      console.error('Error in /api/reservations GET:', error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    // Map database fields to application Reservation structure
    const reservations = (data || []).map((r) => {
      let receiptUrl = '/images/defreeze-flyer-ice.jpg';
      let learningGoals: string | undefined = undefined;

      if (r.payment_reference) {
        if (r.payment_reference.includes('| Goal:')) {
          const parts = r.payment_reference.split('| Goal:');
          receiptUrl = parts[0]?.trim() || receiptUrl;
          learningGoals = parts[1]?.trim();
        } else if (
          r.payment_reference.startsWith('data:') ||
          r.payment_reference.startsWith('http') ||
          r.payment_reference.startsWith('/')
        ) {
          receiptUrl = r.payment_reference;
        }
      }

      return {
        id: r.id,
        full_name: r.full_name || 'Anonymous Attendee',
        email: r.email || '',
        phone: r.phone || '',
        gender: 'Not specified',
        payment_reference: r.payment_reference,
        receipt_url: receiptUrl,
        status: (r.payment_status === 'confirmed' ? 'confirmed' : 'pending') as 'confirmed' | 'pending',
        created_at: r.submitted_at || new Date().toISOString(),
        confirmed_at: r.reviewed_at,
        learning_goals: learningGoals,
        questionnaire: {
          stuckArea: 'Personal & Career Growth',
          biggestObstacle: 'Overthinking & self-doubt',
          growthGoal: 'Break free into massive action with my circle',
          readinessScore: 9,
        },
      };
    });

    return NextResponse.json(reservations);
  } catch (err: any) {
    console.error('Error fetching reservations:', err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const admin = createAdminClient();

    // 1. Prepare payment_reference containing receipt and optional learning goals
    let paymentRefText = body.receipt_url || 'receipt-uploaded';
    if (body.learning_goals) {
      paymentRefText = `${paymentRefText} | Goal: ${body.learning_goals}`;
    }

    const { data, error } = await admin
      .from('registrations')
      .insert({
        full_name: body.full_name,
        phone: body.phone,
        email: body.email,
        payment_reference: paymentRefText,
        payment_status: 'pending',
      })
      .select()
      .single();

    if (error) {
      console.error('Supabase registration insert error:', error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    // 2. Also record their goals / questionnaire in topic_suggestions for admin youth collated review
    if (body.learning_goals || body.questionnaire?.growthGoal) {
      try {
        const topicText = body.learning_goals
          ? `[Program Goal] ${body.learning_goals} (Stuck: ${body.questionnaire?.stuckArea || 'Growth'})`
          : `[Mindset Goal] ${body.questionnaire?.growthGoal}`;

        await admin.from('topic_suggestions').insert({
          participant_name: body.full_name,
          topic: topicText,
        });
      } catch (topicErr) {
        console.warn('Failed to insert into topic_suggestions:', topicErr);
      }
    }

    return NextResponse.json({
      success: true,
      reservation: {
        id: data.id,
        full_name: data.full_name,
        phone: data.phone,
        email: data.email,
        payment_reference: data.payment_reference,
        status: data.payment_status,
        created_at: data.submitted_at,
      },
    });
  } catch (err: any) {
    console.error('Error in /api/reservations POST:', err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

export async function PATCH(req: Request) {
  try {
    const body = await req.json();
    const { id } = body;

    if (!id) {
      return NextResponse.json({ error: 'Missing reservation id' }, { status: 400 });
    }

    const admin = createAdminClient();

    // 1. Try RPC confirm_defreeze_payment if it exists
    const { error: rpcError } = await admin.rpc('confirm_defreeze_payment', {
      p_registration_id: id,
    });

    if (rpcError) {
      // Direct table update fallback
      const { data, error } = await admin
        .from('registrations')
        .update({
          payment_status: 'confirmed',
          reviewed_at: new Date().toISOString(),
          reviewed_by: '00000000-0000-0000-0000-000000000000', // admin placeholder uuid
        })
        .eq('id', id)
        .select()
        .single();

      if (error) {
        // If uuid format issue on reviewed_by, update without reviewed_by
        const { error: secondErr } = await admin
          .from('registrations')
          .update({
            payment_status: 'confirmed',
            reviewed_at: new Date().toISOString(),
          })
          .eq('id', id);

        if (secondErr) {
          throw secondErr;
        }
      }
    }

    return NextResponse.json({ success: true, id, status: 'confirmed' });
  } catch (err: any) {
    console.error('Error confirming payment in /api/reservations PATCH:', err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

export async function PUT(req: Request) {
  try {
    const body = await req.json();
    const { id, learning_goals } = body;

    if (!id || !learning_goals) {
      return NextResponse.json({ error: 'Missing id or learning_goals' }, { status: 400 });
    }

    const admin = createAdminClient();

    // 1. Read existing payment_reference
    const { data: reg } = await admin
      .from('registrations')
      .select('full_name, payment_reference')
      .eq('id', id)
      .single();

    if (reg) {
      const currentRef = reg.payment_reference || '';
      const updatedRef = currentRef.includes('| Goal:')
        ? currentRef.split('| Goal:')[0] + ' | Goal: ' + learning_goals
        : currentRef + ' | Goal: ' + learning_goals;

      await admin
        .from('registrations')
        .update({ payment_reference: updatedRef })
        .eq('id', id);

      // Record in topic_suggestions as well
      await admin.from('topic_suggestions').insert({
        participant_name: reg.full_name || 'Attendee',
        topic: `[Learning Goal] ${learning_goals}`,
      });
    }

    return NextResponse.json({ success: true });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
