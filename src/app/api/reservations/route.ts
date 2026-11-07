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
      let gender = 'Not specified';
      let questionnaire = {
        stuckArea: 'Personal & Career Growth',
        biggestObstacle: 'Overthinking & self-doubt',
        growthGoal: 'Break free into massive action with my circle',
        readinessScore: 9,
      };

      if (r.payment_reference) {
        if (r.payment_reference.startsWith('{')) {
          try {
            const parsed = JSON.parse(r.payment_reference);
            if (parsed.receipt) receiptUrl = parsed.receipt;
            if (parsed.goal) learningGoals = parsed.goal;
            if (parsed.gender) gender = parsed.gender;
            if (parsed.questionnaire) questionnaire = parsed.questionnaire;
          } catch {}
        } else if (r.payment_reference.includes('| Goal:')) {
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
        gender,
        payment_reference: r.payment_reference,
        receipt_url: receiptUrl,
        status: (r.payment_status === 'confirmed' ? 'confirmed' : 'pending') as 'confirmed' | 'pending',
        created_at: r.submitted_at || new Date().toISOString(),
        confirmed_at: r.reviewed_at,
        learning_goals: learningGoals,
        questionnaire,
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

    // 1. Prepare structured JSON for payment_reference (with string fallback)
    const paymentMeta = {
      receipt: body.receipt_url || '',
      goal: body.learning_goals || '',
      gender: body.gender || 'Not specified',
      questionnaire: body.questionnaire || null,
    };
    const paymentRefText = JSON.stringify(paymentMeta);

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
          ? `[Learning Goal] ${body.learning_goals}${body.email ? ` (Email: ${body.email})` : ''}`
          : `[Mindset Goal] ${body.questionnaire?.growthGoal}`;

        await admin.from('topic_suggestions').insert({
          participant_name: body.full_name || 'Attendee',
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
    const { id, learning_goals, email, full_name, phone } = body;

    if (!learning_goals) {
      return NextResponse.json({ error: 'Missing learning_goals' }, { status: 400 });
    }

    const admin = createAdminClient();
    const isUuid = id && /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(id);

    let reg: any = null;

    // 1. Try finding by UUID if valid
    if (isUuid) {
      const { data } = await admin
        .from('registrations')
        .select('*')
        .eq('id', id)
        .single();
      reg = data;
    }

    // 2. If not found by UUID, try lookup by email (latest first)
    if (!reg && email) {
      const { data } = await admin
        .from('registrations')
        .select('*')
        .ilike('email', email.trim())
        .order('submitted_at', { ascending: false })
        .limit(1);
      if (data && data.length > 0) {
        reg = data[0];
      }
    }

    // 3. If still not found by email, try lookup by full_name
    if (!reg && full_name && full_name !== 'Attendee') {
      const { data } = await admin
        .from('registrations')
        .select('*')
        .ilike('full_name', full_name.trim())
        .order('submitted_at', { ascending: false })
        .limit(1);
      if (data && data.length > 0) {
        reg = data[0];
      }
    }

    // 4. If registration exists, update payment_reference with the learning goal
    if (reg) {
      let updatedRef = '';
      if (reg.payment_reference && reg.payment_reference.startsWith('{')) {
        try {
          const parsed = JSON.parse(reg.payment_reference);
          parsed.goal = learning_goals;
          updatedRef = JSON.stringify(parsed);
        } catch {
          updatedRef = `${reg.payment_reference} | Goal: ${learning_goals}`;
        }
      } else if (reg.payment_reference) {
        updatedRef = reg.payment_reference.includes('| Goal:')
          ? reg.payment_reference.split('| Goal:')[0] + ' | Goal: ' + learning_goals
          : reg.payment_reference + ' | Goal: ' + learning_goals;
      } else {
        updatedRef = JSON.stringify({ receipt: '', goal: learning_goals });
      }

      await admin
        .from('registrations')
        .update({ payment_reference: updatedRef })
        .eq('id', reg.id);
    } else if (email || full_name) {
      // 5. If no registration record was found at all, CREATE one so attendee's goal and data are preserved!
      const fallbackRef = JSON.stringify({ receipt: '', goal: learning_goals });
      const { data: createdReg } = await admin
        .from('registrations')
        .insert({
          full_name: full_name || 'Attendee',
          email: email || '',
          phone: phone || '',
          payment_reference: fallbackRef,
          payment_status: 'pending',
        })
        .select()
        .single();
      reg = createdReg;
    }

    // 6. ALWAYS insert into topic_suggestions for the Youth Insights tab!
    const participantLabel = reg?.full_name || full_name || 'Attendee';
    const emailLabel = reg?.email || email || '';
    const topicLabel = emailLabel
      ? `[Learning Goal] ${learning_goals} (Email: ${emailLabel})`
      : `[Learning Goal] ${learning_goals}`;

    await admin.from('topic_suggestions').insert({
      participant_name: participantLabel,
      topic: topicLabel,
    });

    return NextResponse.json({
      success: true,
      registration_id: reg?.id,
    });
  } catch (err: any) {
    console.error('Error in /api/reservations PUT:', err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
