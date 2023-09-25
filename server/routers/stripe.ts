import { stripe } from '@/lib/stripe';
import { Order } from '@/types/types';
import z from 'zod';
import { createTRPCRouter, protectedProcedure } from '../trpc';

export const stripeRouter = createTRPCRouter({
  createIntent: protectedProcedure
    .input(
      z.object({
        orderid: z.string(),
      })
    )
    .query(async (opts) => {
      try {
        const orderid = opts.input.orderid;
        const orderFetchUrl = `${
          process.env.OUTERBASE_COMMANDS_ROOT_DOMAIN
        }/get-order-by-id?orderid=${encodeURIComponent(orderid)}`;

        const orderResponse = await fetch(orderFetchUrl, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          },
        });

        if (!orderResponse.ok) {
          throw new Error('Failed to fetch order with id');
        }

        const orderData = await orderResponse.json();

        if (!orderData.response.items[0]) {
          throw new Error('Failed to fetch order with id');
        }

        const order = orderData.response.items[0] as Order;

        if (order.payment_status) {
          throw new Error('Order amount has been paid, refuse payment collection');
        }

        const intentCreationRequestBody = {
          stripekey: process.env.STRIPE_SECRET_KEY,
          ordertotal: order.total_price,
          currency: process.env.NEXT_PUBLIC_CURRENCY,
        };

        // const intentCreationResponse = await fetch(
        //   `${process.env.OUTERBASE_COMMANDS_ROOT_DOMAIN}/create-stripe-pi`,
        //   {
        //     method: 'POST',
        //     headers: {
        //       'Content-Type': 'application/json',
        //     },
        //     body: JSON.stringify(intentCreationRequestBody),
        //   }
        // );

        const paymentIntent = await stripe.paymentIntents.create({
          amount: Math.round(order.total_price * 100),
          currency: String(process.env.NEXT_PUBLIC_CURRENCY).toLowerCase(),
          automatic_payment_methods: {
            enabled: true,
          },
        });

        // if (!intentCreationResponse.ok) {
        //   throw new Error('Failed to create intent');
        // }

        // const paymentIntent = await intentCreationResponse.json();

        const updateIntentRequestBody = {
          orderid,
          // intentid: paymentIntent.response.id as string,
          intentid: paymentIntent.id as string,
        };

        const intentUpdationResponse = await fetch(
          `${process.env.OUTERBASE_COMMANDS_ROOT_DOMAIN}/update-order-payment-intent`,
          {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify(updateIntentRequestBody),
          }
        );

        if (!intentUpdationResponse.ok) {
          throw new Error('Failed to update intent order');
        }

        return {
          // clientSecret: paymentIntent.response.client_secret as string,
          clientSecret: paymentIntent.client_secret as string,
        };
      } catch (error) {
        console.error('Failed to create payment intent:', error);
        throw new Error('Failed to create payment intent');
      }
    }),
});
