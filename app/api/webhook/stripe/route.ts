import { stripe } from '@/lib/stripe';
import { headers } from 'next/headers';
import { NextResponse } from 'next/server';
import Stripe from 'stripe';

const webhookSecret = process.env.STRIPE_MARK_PAID_WEBHOOK_KEY;

export async function POST(req: Request, res: NextResponse) {
  console.log(req.url);
  const body = await req.text();
  const signature = headers().get('Stripe-Signature') as string;

  try {
    const event = stripe.webhooks.constructEvent(body, signature, webhookSecret as string);

    if (event.type === 'payment_intent.succeeded') {
      const intent = event.data.object as Stripe.PaymentIntent;
      // const orderId = intent.metadata.orderId;
      const intentid = intent.id;

      //outerbase command temp
      const requestBody = JSON.stringify({ intentid });

      const paymentUpdationResponse = await fetch(
        `${process.env.OUTERBASE_COMMANDS_ROOT_DOMAIN}/update-order-payment-status`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: requestBody,
        }
      );

      if (!paymentUpdationResponse.ok) {
        throw new Error('Failed to update payment status');
      }

      return NextResponse.json({ received: true }, { status: 200 });
    }
  } catch (error) {
    console.error('Error:', error);
    return NextResponse.json({ error: `Webhook Error: ${error}` }, { status: 400 });
  }

  return NextResponse.json({ received: false }, { status: 400 });
}
