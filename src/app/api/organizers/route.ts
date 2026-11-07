import { NextResponse } from 'next/server';
import { createAdminClient } from '@supabase/server/core';
import crypto from 'crypto';

const BUCKET_NAME = 'organizers';
const DATA_FILE = 'data/organizers.json';

const DEFAULT_ORGANIZERS = [
  {
    id: '8d5d2038-6806-45f5-b9fe-9c76d145f8c4',
    name: 'Emmanuel Olusesi',
    role: 'Founder & Lead Curator',
    bio: 'Dedicated young leader designing safe, electric spaces for ambitious minds to unfreeze and step boldly into action.',
    image_url: '/images/defreeze-logo.png',
    instagram: 'https://instagram.com',
    twitter: 'https://x.com',
    linkedin: 'https://linkedin.com',
    whatsapp: '+2348143708860',
    created_at: '2026-10-31T02:51:29.353556+00:00',
  },
];

async function getStoredOrganizers(admin: any) {
  try {
    const download = await admin.storage.from(BUCKET_NAME).download(DATA_FILE);
    if (download.data) {
      const text = await download.data.text();
      const parsed = JSON.parse(text);
      if (Array.isArray(parsed) && parsed.length > 0) {
        return parsed;
      }
    }
  } catch (err) {
    console.warn('Storage read failed, falling back to default:', err);
  }
  return DEFAULT_ORGANIZERS;
}

async function saveStoredOrganizers(admin: any, organizers: any[]) {
  try {
    await admin.storage.from(BUCKET_NAME).upload(DATA_FILE, JSON.stringify(organizers, null, 2), {
      contentType: 'application/json',
      upsert: true,
    });
  } catch (err) {
    console.error('Storage write error:', err);
  }
}

export async function GET() {
  try {
    const admin = createAdminClient();
    const stored = await getStoredOrganizers(admin);
    return NextResponse.json(stored);
  } catch (err: any) {
    console.error('Error in /api/organizers GET:', err);
    return NextResponse.json(DEFAULT_ORGANIZERS);
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const admin = createAdminClient();

    // Ensure valid user_id UUID
    let userId = body.id;
    const isUuid = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(userId || '');
    if (!isUuid) {
      userId = crypto.randomUUID();
    }

    let finalImageUrl = body.image_url || '/images/defreeze-logo.png';

    // Handle uploaded base64 picture -> Save as real image file in Supabase Storage
    if (body.image_url && typeof body.image_url === 'string' && body.image_url.startsWith('data:image/')) {
      try {
        const matches = body.image_url.match(/^data:image\/([a-zA-Z0-9+]+);base64,(.+)$/);
        if (matches && matches[2]) {
          let ext = matches[1].toLowerCase();
          if (ext === 'jpeg') ext = 'jpg';
          const buffer = Buffer.from(matches[2], 'base64');
          const fileName = `headshots/${userId}-${Date.now()}.${ext}`;

          const uploadRes = await admin.storage.from(BUCKET_NAME).upload(fileName, buffer, {
            contentType: `image/${ext === 'jpg' ? 'jpeg' : ext}`,
            upsert: true,
          });

          if (!uploadRes.error) {
            const { data: publicUrlData } = admin.storage.from(BUCKET_NAME).getPublicUrl(fileName);
            if (publicUrlData?.publicUrl) {
              finalImageUrl = publicUrlData.publicUrl;
            }
          } else {
            console.warn('Image upload to bucket failed:', uploadRes.error);
          }
        }
      } catch (uploadErr) {
        console.error('Error uploading organizer image:', uploadErr);
      }
    }

    // Build the complete organizer record
    const updatedRecord = {
      id: userId,
      name: body.name || 'Organizer',
      role: body.role || 'Curator',
      bio: body.bio || '',
      image_url: finalImageUrl,
      instagram: body.instagram || '',
      twitter: body.twitter || '',
      linkedin: body.linkedin || '',
      whatsapp: body.whatsapp || '',
      created_at: body.created_at || new Date().toISOString(),
    };

    // Update persistent JSON list in Supabase Storage
    const existingList = await getStoredOrganizers(admin);
    const existingIndex = existingList.findIndex((o: any) => o.id === userId);
    let newList;
    if (existingIndex >= 0) {
      newList = [...existingList];
      newList[existingIndex] = updatedRecord;
    } else {
      newList = [...existingList, updatedRecord];
    }
    await saveStoredOrganizers(admin, newList);

    // Also sync organiser_profiles table in PostgreSQL if possible
    try {
      let dbRole = 'operations_admin';
      if (body.role?.toLowerCase().includes('founder') || body.role?.toLowerCase().includes('lead curator') || body.role?.toLowerCase().includes('super')) {
        dbRole = 'super_admin';
      }
      await admin.from('organiser_profiles').upsert({
        user_id: userId,
        full_name: body.name,
        role: dbRole,
      });
    } catch (dbErr) {
      console.warn('DB organiser_profiles sync error (non-fatal):', dbErr);
    }

    return NextResponse.json({
      success: true,
      organizer: updatedRecord,
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
    const existingList = await getStoredOrganizers(admin);
    const filtered = existingList.filter((o: any) => o.id !== id);
    await saveStoredOrganizers(admin, filtered);

    try {
      await admin.from('organiser_profiles').delete().eq('user_id', id);
    } catch {}

    return NextResponse.json({ success: true, id });
  } catch (err: any) {
    console.error('Error in /api/organizers DELETE:', err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
