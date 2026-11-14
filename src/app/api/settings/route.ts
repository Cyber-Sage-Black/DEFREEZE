import { NextResponse } from 'next/server';
import { createAdminClient } from '@supabase/server/core';

const BUCKET_NAME = 'organizers';
const DATA_FILE = 'data/settings.json';
const FALLBACK_DATA_FILE = 'settings.json';

const DEFAULT_SETTINGS = {
  bank_name: 'OPay Bank',
  account_number: '8071248484',
  account_name: 'Olusesi Emmanuel Saheed',
  amount: '₦5,000',
  total_spots: 25,
};

let serverSettingsCache = { ...DEFAULT_SETTINGS };

async function getStoredSettings(admin: any) {
  try {
    let download = await admin.storage.from(BUCKET_NAME).download(DATA_FILE);
    if (!download.data && !download.error) {
      download = await admin.storage.from(BUCKET_NAME).download(FALLBACK_DATA_FILE);
    }
    if (download.error && !download.data) {
      download = await admin.storage.from(BUCKET_NAME).download(FALLBACK_DATA_FILE);
    }

    if (download.data) {
      const text = await download.data.text();
      const parsed = JSON.parse(text);
      if (parsed && typeof parsed === 'object') {
        serverSettingsCache = {
          ...DEFAULT_SETTINGS,
          ...parsed,
        };
        return serverSettingsCache;
      }
    }
  } catch (err) {
    console.warn('Storage read for settings failed, falling back to cache:', err);
  }
  return serverSettingsCache;
}

async function saveStoredSettings(admin: any, settings: typeof DEFAULT_SETTINGS) {
  try {
    const payload = JSON.stringify(settings, null, 2);
    await Promise.all([
      admin.storage.from(BUCKET_NAME).upload(DATA_FILE, payload, {
        contentType: 'application/json',
        upsert: true,
      }),
      admin.storage.from(BUCKET_NAME).upload(FALLBACK_DATA_FILE, payload, {
        contentType: 'application/json',
        upsert: true,
      }),
    ]);
  } catch (err) {
    console.error('Storage write error for settings:', err);
  }
}

export async function GET() {
  try {
    const admin = createAdminClient();
    const settings = await getStoredSettings(admin);
    return NextResponse.json(settings);
  } catch (err: any) {
    console.error('Error in /api/settings GET:', err);
    return NextResponse.json(serverSettingsCache);
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const admin = createAdminClient();

    // Clean / normalize amount if user typed just digits like "5000"
    let formattedAmount = body.amount ?? serverSettingsCache.amount;
    if (typeof formattedAmount === 'string') {
      const trimmed = formattedAmount.trim();
      if (/^\d+$/.test(trimmed)) {
        const num = parseInt(trimmed, 10);
        formattedAmount = `₦${num.toLocaleString()}`;
      } else if (/^[\d,]+$/.test(trimmed)) {
        const cleanDigits = trimmed.replace(/,/g, '');
        const num = parseInt(cleanDigits, 10);
        formattedAmount = `₦${num.toLocaleString()}`;
      }
    }

    const updatedSettings = {
      ...serverSettingsCache,
      ...body,
      amount: formattedAmount,
    };

    serverSettingsCache = updatedSettings;
    await saveStoredSettings(admin, updatedSettings);

    return NextResponse.json({ success: true, settings: updatedSettings });
  } catch (err: any) {
    console.error('Error in /api/settings POST:', err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
