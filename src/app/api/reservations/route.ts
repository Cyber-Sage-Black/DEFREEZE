import { NextResponse } from 'next/server';
import { supabase, isSupabaseConfigured } from '@/lib/supabase';

export async function GET() {
  if (isSupabaseConfigured && supabase) {
    try {
      const { data, error } = await supabase
        .from('reservations')
        .select('*')
        .order('created_at', { ascending: false });
      if (!error && data) {
        return NextResponse.json(data);
      }
    } catch (e) {
      console.warn('API get reservations failed:', e);
    }
  }

  return NextResponse.json([]);
}

export async function POST(req: Request) {
  try {
    const body = await req.json();

    if (body.action === 'confirm' && body.id) {
      if (isSupabaseConfigured && supabase) {
        const { error } = await supabase
          .from('reservations')
          .update({
            status: 'confirmed',
            confirmed_at: new Date().toISOString(),
          })
          .eq('id', body.id);
        if (error) throw error;
      }
      return NextResponse.json({ success: true, id: body.id, status: 'confirmed' });
    }

    // Otherwise create reservation
    if (isSupabaseConfigured && supabase) {
      const { data, error } = await supabase
        .from('reservations')
        .insert({
          full_name: body.full_name,
          phone: body.phone,
          email: body.email,
          gender: body.gender,
          questionnaire: body.questionnaire,
          receipt_url: body.receipt_url,
          status: 'pending',
        })
        .select()
        .single();
      if (error) throw error;
      return NextResponse.json({ success: true, reservation: data });
    }

    return NextResponse.json({ success: true, reservation: body });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
