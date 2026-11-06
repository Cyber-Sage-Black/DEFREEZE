import { NextResponse } from 'next/server';
import { supabase, isSupabaseConfigured } from '@/lib/supabase';

const DEFAULT_SETTINGS = {
  bank_name: 'Guaranty Trust Bank (GTBank)',
  account_number: '0739182390',
  account_name: 'DEFREEZE INITIATIVE',
  amount: '₦15,000',
  total_spots: 25,
};

export async function GET() {
  if (isSupabaseConfigured && supabase) {
    try {
      const { data, error } = await supabase
        .from('admin_settings')
        .select('*')
        .eq('id', 'default')
        .single();
      if (!error && data) {
        return NextResponse.json({
          bank_name: data.bank_name,
          account_number: data.account_number,
          account_name: data.account_name,
          amount: data.amount,
          total_spots: data.total_spots ?? 25,
        });
      }
    } catch (e) {
      console.warn('API get settings failed:', e);
    }
  }

  return NextResponse.json(DEFAULT_SETTINGS);
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    if (isSupabaseConfigured && supabase) {
      const { error } = await supabase.from('admin_settings').upsert({
        id: 'default',
        bank_name: body.bank_name,
        account_number: body.account_number,
        account_name: body.account_name,
        amount: body.amount,
        total_spots: body.total_spots,
        updated_at: new Date().toISOString(),
      });
      if (error) throw error;
    }

    return NextResponse.json({ success: true, settings: body });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
