import { stripe } from '@/lib/stripe';
import { headers } from 'next/headers';
import { NextResponse } from 'next/server';
import Stripe from 'stripe';

const webhookSecret = process.env.STRIPE_MARK_PAID_WEBHOOK_KEY;
const mailgundomain = process.env.MAILGUN_DOMAIN;
const mailgunapikey = process.env.MAILGUN_API_KEY;
const restaurantname = process.env.RESTAURANT_NAME;
const fromemail = process.env.FROM_EMAIL;

export async function POST(req: Request, res: NextResponse) {
  const body = await req.text();
  const signature = headers().get('Stripe-Signature') as string;

  try {
    const event = stripe.webhooks.constructEvent(body, signature, webhookSecret as string);

    if (event.type === 'payment_intent.succeeded') {
      const intent = event.data.object as Stripe.PaymentIntent;
      // const orderId = intent.metadata.orderId;
      const intentid = intent.id;

      //outerbase command temp
      const requestBody = JSON.stringify({
        intentid,
        mailgundomain,
        mailgunapikey,
        restaurantname,
        fromemail,
        tax_percentage: process.env.NEXT_PUBLIC_TAX_PERCENTAGE,
      });

      const paymentUpdationResponse = await fetch(
        `${process.env.OUTERBASE_COMMANDS_ROOT_DOMAIN}/update-order-status-and-notify`,
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
