import { NextResponse } from 'next/server';
import { createAdminClient } from '@supabase/server/core';

export async function GET() {
  try {
    const admin = createAdminClient();
    const { data, error } = await admin
      .from('registrations')
      .select('id, payment_status');

    let total = 25;
    try {
      const download = await admin.storage.from('organizers').download('data/settings.json');
      if (download.data) {
        const text = await download.data.text();
        const settings = JSON.parse(text);
        if (settings?.total_spots && typeof settings.total_spots === 'number') {
          total = settings.total_spots;
        }
      }
    } catch {}

    if (error) {
      console.error('Error fetching registrations for spots:', error);
      return NextResponse.json({
        total,
        confirmedCount: 0,
        remaining: total,
      });
    }

    const confirmedCount = (data || []).filter(
      (r) => r.payment_status === 'confirmed'
    ).length;
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
