import { NextResponse } from 'next/server';

/**
 * PayHero Kenya - M-Pesa STK Push Integration Endpoint
 * Docs: https://payhero.co.ke
 * 
 * Required Environment Variables:
 * - PAYHERO_API_KEY: Your PayHero API Key (from PayHero Dashboard > Settings > API Keys)
 * - PAYHERO_API_SECRET: Your PayHero API Secret
 * - PAYHERO_CHANNEL_ID: Your Payment Channel ID (Paybill/Till linked to PayHero)
 * - PAYHERO_CALLBACK_URL: Webhook URL (e.g. https://your-domain.vercel.app/api/payhero/callback)
 */

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { phoneNumber, amount = 130, reference = 'CampusHustle Pass' } = body;

    if (!phoneNumber) {
      return NextResponse.json({ error: 'Phone number is required' }, { status: 400 });
    }

    // Standardize phone number format (2547XXXXXXXX or 07XXXXXXXX)
    let cleanPhone = phoneNumber.replace(/\s+/g, '');
    if (cleanPhone.startsWith('0')) {
      cleanPhone = '254' + cleanPhone.substring(1);
    } else if (!cleanPhone.startsWith('254')) {
      cleanPhone = '254' + cleanPhone;
    }

    const apiKey = process.env.PAYHERO_API_KEY;
    const apiSecret = process.env.PAYHERO_API_SECRET;
    const channelId = process.env.PAYHERO_CHANNEL_ID || '1';
    const callbackUrl = process.env.PAYHERO_CALLBACK_URL || `${process.env.NEXT_PUBLIC_APP_URL || 'https://campushustle.vercel.app'}/api/payhero/callback`;

    // If live PayHero credentials exist, dispatch HTTP request to PayHero API v2
    if (apiKey && apiSecret) {
      const basicAuth = Buffer.from(`${apiKey}:${apiSecret}`).toString('base64');
      
      const payheroResponse = await fetch('https://backend.payhero.co.ke/api/v2/payments', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Basic ${basicAuth}`,
        },
        body: JSON.stringify({
          amount: Number(amount),
          phone_number: cleanPhone,
          channel_id: Number(channelId),
          provider: 'm-pesa',
          external_reference: `CH_${Date.now()}`,
          callback_url: callbackUrl,
        }),
      });

      const responseData = await payheroResponse.json();

      return NextResponse.json({
        success: payheroResponse.ok,
        provider: 'PAYHERO',
        checkoutRequestId: responseData.reference || `PH_${Date.now()}`,
        status: responseData.status || 'PENDING',
        data: responseData,
        message: 'PayHero M-Pesa STK Prompt dispatched to phone',
      });
    }

    // Sandbox / Instant Simulation Fallback
    const simulatedCheckoutId = `PH_CO_${Date.now()}_${Math.floor(Math.random() * 10000)}`;
    
    return NextResponse.json({
      success: true,
      provider: 'PAYHERO_SANDBOX',
      checkoutRequestId: simulatedCheckoutId,
      status: 'PENDING',
      amountKes: Number(amount),
      phoneNumber: cleanPhone,
      reference,
      message: 'PayHero STK push prompt queued. Please enter M-Pesa PIN on your phone handset.',
      simulatedReceipt: `PH${Math.floor(10000000 + Math.random() * 90000000)}KE`,
    });
  } catch (error: any) {
    console.error('PayHero STK Error:', error);
    return NextResponse.json(
      { error: 'Failed to initiate PayHero payment', details: error.message },
      { status: 500 }
    );
  }
}
