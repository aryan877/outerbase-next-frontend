import { Order } from '@/types/types';
import { capitalizeFirstLetter } from '@/utils/strings';
import { clerkClient } from '@clerk/nextjs';
import z from 'zod';
import { createTRPCRouter, protectedProcedure } from '../trpc';

export const orderRouter = createTRPCRouter({
  createOrder: protectedProcedure
    .input(
      z.object({
        myCartItems: z.any().array(),
      })
    )
    .mutation(async (opts) => {
      try {
        const user = await clerkClient.users.getUser(opts.ctx.auth.userId);

        const total_price = opts.input.myCartItems.reduce((acc, item) => {
          const itemPrice = item.price * item.quantity;
          return acc + itemPrice;
        }, 0);

        // Add tax (15%)
        const tax = total_price * (Number(process.env.NEXT_PUBLIC_TAX_PERCENTAGE) / 100);

        const total_price_with_tax = total_price + tax;

        const orderItemsString = opts.input.myCartItems.map((item) => JSON.stringify(item));

        const order: Order = {
          userid: user.id,
          delivery_address: '123 Main Street, City, Country',
          total_price: total_price_with_tax.toFixed(2),
          email: user.emailAddresses[0]?.emailAddress as string,
          phone_number: '7983060620',
          first_name: capitalizeFirstLetter(user.firstName as string) as string,
          order_items: orderItemsString,
        };

        // Create a request body JSON object
        const requestBody = JSON.stringify(order);

        const response = await fetch(
          `${process.env.OUTERBASE_COMMANDS_ROOT_DOMAIN}/create-order-entry`,
          {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: requestBody,
          }
        );

        if (!response.ok) {
          throw new Error('Failed to create order');
        }

        const data = await response.json();

        return { success: true, orderid: data.response.items[0][0].orderid as number };
      } catch (error) {
        console.error('Error creating order:', error);
        throw new Error('Failed to create order');
      }
    }),
  getOrders: protectedProcedure.query(async (opts) => {
    try {
      const userid = opts.ctx.auth.userId;
      const url = `${
        process.env.OUTERBASE_COMMANDS_ROOT_DOMAIN
      }/get-orders-list?userid=${encodeURIComponent(userid)}`;

      const response = await fetch(url, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });
      if (!response.ok) {
        throw new Error('Failed to get list of orders');
      }
      const data = await response.json();

      return data;
    } catch (error) {
      console.error('Error getting list of orders:', error);
      throw new Error('Failed to get list of orders');
    }
  }),
  getOrderById: protectedProcedure.input(z.object({ orderid: z.string() })).query(async (opts) => {
    try {
      const url = `${
        process.env.OUTERBASE_COMMANDS_ROOT_DOMAIN
      }/get-order-by-id?orderid=${encodeURIComponent(opts.input.orderid)}`;

      const response = await fetch(url, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });
      if (!response.ok) {
        throw new Error('Failed to get order by id');
      }
      const data = await response.json();

      return data;
    } catch (error) {
      console.error('Error getting order by id:', error);
      throw new Error('Failed to get order by id');
    }
  }),
});
