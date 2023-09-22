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
        const url = `${
          process.env.OUTERBASE_COMMANDS_ROOT_DOMAIN
        }/get-order-by-id?orderid=${encodeURIComponent(orderid)}`;

        const response = await fetch(url, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          },
        });

        if (!response.ok) {
          throw new Error('Failed to fetch order with id');
        }

        const data = await response.json();

        if (!data.response.items[0]) {
          throw new Error('Failed to fetch order with id');
        }

        const order = data.response.items[0] as Order;

        if (order.payment_status) {
          throw new Error('Order amount has been paid, refuse payment collection');
        }

        const paymentIntent = await stripe.paymentIntents.create({
          amount: Math.round(order.total_price * 100),
          currency: String(process.env.NEXT_PUBLIC_CURRENCY).toLowerCase(),
          automatic_payment_methods: {
            enabled: true,
          },
        });

        // Create a request body JSON object
        const requestBody = JSON.stringify({ orderid, intentid: paymentIntent.id });

        const intentUpdationResponse = await fetch(
          `${process.env.OUTERBASE_COMMANDS_ROOT_DOMAIN}/update-order-payment-intent`,
          {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: requestBody,
          }
        );

        if (!intentUpdationResponse.ok) {
          throw new Error('Failed to update intent order');
        }

        return {
          clientSecret: paymentIntent.client_secret,
        };
      } catch (error) {
        console.error('Failed to create payment intent:', error);
        throw new Error('Failed to create payment intent');
      }
    }),
});
