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
          orderid: orderid,
          stripekey: process.env.STRIPE_SECRET_KEY,
          ordertotal: order.total_price,
          currency: process.env.NEXT_PUBLIC_CURRENCY,
          upstashurl: process.env.UPSTASH_ENDPOINT,
          upstashkey: process.env.UPSTASH_REDIS_REST_TOKEN,
        };

        const intentCreationResponse = await fetch(
          `${process.env.OUTERBASE_COMMANDS_ROOT_DOMAIN}//create-stripe-payment-intent`,
          {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify(intentCreationRequestBody),
          }
        );

        if (!intentCreationResponse.ok) {
          throw new Error('Failed to create intent');
        }

        const paymentIntentDataResponse = await fetch(
          `${process.env.UPSTASH_ENDPOINT}/get/${orderid}`,
          {
            method: 'GET',
            headers: {
              'Content-Type': 'application/json',
              Authorization: `Bearer ${process.env.UPSTASH_REDIS_REST_TOKEN}`,
            },
          }
        );

        const paymentIntentJSON = await paymentIntentDataResponse.json();
        const paymentIntent = JSON.parse(paymentIntentJSON.result);

        const updateIntentRequestBody = {
          orderid,
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
          clientSecret: paymentIntent.client_secret as string,
        };
      } catch (error) {
        console.error('Failed to create payment intent:', error);
        throw new Error('Failed to create payment intent');
      }
    }),
});

// createIntentBackup: protectedProcedure
//   .input(
//     z.object({
//       orderid: z.string(),
//     })
//   )
//   .query(async (opts) => {
//     try {
//       const orderid = opts.input.orderid;
//       const orderFetchUrl = `${
//         process.env.OUTERBASE_COMMANDS_ROOT_DOMAIN
//       }/get-order-by-id?orderid=${encodeURIComponent(orderid)}`;

//       const orderResponse = await fetch(orderFetchUrl, {
//         method: 'GET',
//         headers: {
//           'Content-Type': 'application/json',
//         },
//       });

//       if (!orderResponse.ok) {
//         throw new Error('Failed to fetch order with id');
//       }

//       const orderData = await orderResponse.json();

//       if (!orderData.response.items[0]) {
//         throw new Error('Failed to fetch order with id');
//       }

//       const order = orderData.response.items[0] as Order;

//       if (order.payment_status) {
//         throw new Error('Order amount has been paid, refuse payment collection');
//       }

//       const paymentIntent = await stripe.paymentIntents.create({
//         amount: Math.round(order.total_price * 100),
//         currency: String(process.env.NEXT_PUBLIC_CURRENCY).toLowerCase(),
//         automatic_payment_methods: {
//           enabled: true,
//         },
//       });

//       const updateIntentRequestBody = {
//         orderid,
//         intentid: paymentIntent.id as string,
//       };

//       const intentUpdationResponse = await fetch(
//         `${process.env.OUTERBASE_COMMANDS_ROOT_DOMAIN}/update-order-payment-intent`,
//         {
//           method: 'POST',
//           headers: {
//             'Content-Type': 'application/json',
//           },
//           body: JSON.stringify(updateIntentRequestBody),
//         }
//       );

//       if (!intentUpdationResponse.ok) {
//         throw new Error('Failed to update intent order');
//       }

//       return {
//         clientSecret: paymentIntent.client_secret as string,
//       };
//     } catch (error) {
//       console.error('Failed to create payment intent:', error);
//       throw new Error('Failed to create payment intent');
//     }
//   }),
