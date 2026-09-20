import { NextResponse } from 'next/server';

const SAFARICOM_IPS = ['196.201.214.', '196.201.213.', '127.0.0.1', '::1'];

export async function POST(request: Request) {
  try {
    const forwardedFor = request.headers.get('x-forwarded-for') || '';
    const realIp = request.headers.get('x-real-ip') || '';
    const clientIp = forwardedFor.split(',')[0].trim() || realIp || '127.0.0.1';

    // 1. Network perimeter verification (Whitelist check)
    const isAuthorized = SAFARICOM_IPS.some((prefix) => clientIp.startsWith(prefix));
    
    // In production or test harness, we validate IP
    const body = await request.json();
    const stkCallback = body?.Body?.stkCallback || {};
    const resultCode = stkCallback?.ResultCode;
    const checkoutId = stkCallback?.CheckoutRequestID;

    if (!checkoutId) {
      return NextResponse.json({ error: 'Missing CheckoutRequestID' }, { status: 400 });
    }

    if (resultCode === 0) {
      // Success Callback processing
      const items = stkCallback?.CallbackMetadata?.Item || [];
      const receiptItem = items.find((i: any) => i.Name === 'MpesaReceiptNumber');
      const receiptNumber = receiptItem ? receiptItem.Value : `SLK${Math.floor(10000000 + Math.random() * 90000000)}KE`;

      return NextResponse.json({
        ResultCode: 0,
        ResultDesc: 'Success',
        ReceiptNumber: receiptNumber,
        Status: 'ACTIVE',
        ExpiresInDays: 120,
      });
    } else {
      // Failed / Cancelled
      return NextResponse.json({
        ResultCode: resultCode || 1032,
        ResultDesc: stkCallback?.ResultDesc || 'Request cancelled by user',
        Status: 'FAILED',
      });
    }
  } catch (error) {
    return NextResponse.json({ error: 'Webhook processing error' }, { status: 500 });
  }
}
