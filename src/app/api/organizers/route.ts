import { NextResponse } from 'next/server';
import { createAdminClient } from '@supabase/server/core';
import crypto from 'crypto';

export async function GET() {
  try {
    const admin = createAdminClient();
    const { data, error } = await admin
      .from('organiser_profiles')
      .select('*')
      .order('created_at', { ascending: true });

    if (error) {
      console.error('Error fetching organiser_profiles:', error);
      return NextResponse.json([]);
    }

    const organizers = (data || []).map((o) => {
      let roleLabel = o.role;
      if (o.role === 'super_admin') roleLabel = 'Founder & Lead Curator';
      else if (o.role === 'operations_admin') roleLabel = 'Game Mechanics & Operations Lead';

      return {
        id: o.user_id,
        name: o.full_name,
        role: roleLabel,
        bio: 'Dedicated young leader designing safe, electric spaces for ambitious minds to unfreeze and step boldly into action.',
        image_url: '/images/defreeze-logo.png',
        instagram: 'https://instagram.com',
        twitter: 'https://x.com',
        linkedin: 'https://linkedin.com',
        created_at: o.created_at,
      };
    });

    return NextResponse.json(organizers);
  } catch (err: any) {
    console.error('Error in /api/organizers GET:', err);
    return NextResponse.json([]);
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const admin = createAdminClient();

    // Map role string
    let dbRole = 'operations_admin';
    if (body.role?.toLowerCase().includes('founder') || body.role?.toLowerCase().includes('lead curator')) {
      dbRole = 'super_admin';
    }

    // Ensure valid user_id UUID
    let userId = body.id;
    const isUuid = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(userId || '');
    if (!isUuid) {
      userId = crypto.randomUUID();
    }

    const { data, error } = await admin
      .from('organiser_profiles')
      .upsert({
        user_id: userId,
        full_name: body.name,
        role: dbRole,
      })
      .select()
      .single();

    if (error) {
      console.error('Error saving organiser_profile:', error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({
      success: true,
      organizer: {
        id: data.user_id,
        name: data.full_name,
        role: body.role || data.role,
        bio: body.bio || '',
        image_url: body.image_url || '/images/defreeze-logo.png',
        instagram: body.instagram || '',
        twitter: body.twitter || '',
        linkedin: body.linkedin || '',
        whatsapp: body.whatsapp || '',
      },
    });
  } catch (err: any) {
    console.error('Error in /api/organizers POST:', err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

export async function DELETE(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json({ error: 'Missing id parameter' }, { status: 400 });
    }

    const admin = createAdminClient();
    const { error } = await admin
      .from('organiser_profiles')
      .delete()
      .eq('user_id', id);

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ success: true, id });
  } catch (err: any) {
    console.error('Error in /api/organizers DELETE:', err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
