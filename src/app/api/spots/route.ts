import { NextResponse } from 'next/server';
import { createAdminClient } from '@supabase/server/core';

export async function GET() {
  try {
    const admin = createAdminClient();
    const { data, error } = await admin
      .from('registrations')
      .select('id, payment_status');

    if (error) {
      console.error('Error fetching registrations for spots:', error);
      return NextResponse.json({
        total: 25,
        confirmedCount: 0,
        remaining: 25,
      });
    }

    const confirmedCount = (data || []).filter(
      (r) => r.payment_status === 'confirmed'
    ).length;
    const total = 25;
    const remaining = Math.max(0, total - confirmedCount);

    return NextResponse.json({
      total,
      confirmedCount,
      remaining,
      timestamp: new Date().toISOString(),
    });
  } catch (err: any) {
    console.error('Error in /api/spots:', err);
    return NextResponse.json({
      total: 25,
      confirmedCount: 0,
      remaining: 25,
      error: err.message,
    });
  }
}
