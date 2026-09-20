import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { phoneNumber, amount = 130, purpose = 'SUBSCRIPTION_PASS', userId } = body;

    if (!phoneNumber) {
      return NextResponse.json(
        { error: 'Phone number is required (2547XXXXXXXX)' },
        { status: 400 }
      );
    }

    const checkoutRequestId = `ws_CO_${Date.now()}_${Math.floor(Math.random() * 100000)}`;
    const merchantRequestId = `MR_${Date.now()}`;

    // Return 202 Accepted as specified in system architecture
    return NextResponse.json(
      {
        ResponseCode: '0',
        ResponseDescription: 'Success. Request accepted for processing',
        MerchantRequestID: merchantRequestId,
        CheckoutRequestID: checkoutRequestId,
        CustomerMessage: 'Success. Check phone for STK Prompt.',
        details: {
          phoneNumber,
          amount,
          purpose,
          userId: userId || 'usr-mmu-04289',
        },
      },
      { status: 202 }
    );
  } catch (error) {
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
