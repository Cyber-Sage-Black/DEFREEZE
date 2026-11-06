import { NextResponse } from 'next/server';

let serverSettingsCache = {
  bank_name: 'Guaranty Trust Bank (GTBank)',
  account_number: '0739182390',
  account_name: 'DEFREEZE INITIATIVE',
  amount: '₦15,000',
  total_spots: 25,
};

export async function GET() {
  return NextResponse.json(serverSettingsCache);
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    serverSettingsCache = {
      ...serverSettingsCache,
      ...body,
    };
    return NextResponse.json({ success: true, settings: serverSettingsCache });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
