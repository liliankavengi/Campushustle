import { NextResponse } from 'next/server';

/**
 * PayHero Kenya - Webhook Callback Listener
 * When a student enters their M-Pesa PIN, PayHero dispatches instant JSON payload:
 * {
 *   "status": "SUCCESS",
 *   "amount": 130,
 *   "phone": "2547XXXXXXXX",
 *   "mpesa_reference": "QKD7XXXXXX",
 *   "external_reference": "CH_...",
 *   "channel_id": 1
 * }
 */

export async function POST(request: Request) {
  try {
    const payload = await request.json();
    console.log('[PayHero Callback Received]:', payload);

    const {
      status,
      amount,
      phone,
      mpesa_reference,
      external_reference,
      reference,
    } = payload;

    const isSuccess = status === 'SUCCESS' || status === 'COMPLETED';
    const mpesaReceipt = mpesa_reference || reference || `PH${Math.floor(10000000 + Math.random() * 90000000)}KE`;

    return NextResponse.json({
      status: 'OK',
      processed: true,
      isSuccess,
      mpesaReceipt,
      amountReceivedKes: amount || 130,
      phone,
      timestamp: new Date().toISOString(),
    });
  } catch (error: any) {
    console.error('PayHero Callback Error:', error);
    return NextResponse.json(
      { error: 'Invalid PayHero callback data', details: error.message },
      { status: 400 }
    );
  }
}
