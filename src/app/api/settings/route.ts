import { NextResponse } from 'next/server';

let serverSettingsCache = {
  bank_name: 'OPay Bank',
  account_number: '8071248484',
  account_name: 'Olusesi Emmanuel Saheed',
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
