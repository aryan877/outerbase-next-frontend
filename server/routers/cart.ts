import z from 'zod';
import { createTRPCRouter, protectedProcedure } from '../trpc';

export const cartRouter = createTRPCRouter({
  modifyItemsInCart: protectedProcedure
    .input(
      z.object({
        itemid: z.number(),
        quantity: z.number(),
      })
    )
    .mutation(async (opts) => {
      try {
        const userid = opts.ctx.auth.userId;
        const itemid = opts.input.itemid;
        const quantity = opts.input.quantity;

        console.log(userid, itemid, quantity);

        // Create a request body JSON object with itemid and quantity
        const requestBody = JSON.stringify({ itemid, quantity, userid });

        const response = await fetch(
          `${process.env.OUTERBASE_COMMANDS_ROOT_DOMAIN}/modify-cart-items`,
          {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: requestBody,
          }
        );

        if (!response.ok) {
          throw new Error('Failed to modify items in cart');
        }

        const data = await response.json();

        return data;
      } catch (error) {
        console.error('Error modifying items in cart:', error);
        throw new Error('Failed to modify items in cart');
      }
    }),
  getCartItems: protectedProcedure.query(async (opts) => {
    try {
      const userid = opts.ctx.auth.userId;
      const url = `${
        process.env.OUTERBASE_COMMANDS_ROOT_DOMAIN
      }/get-cart-items-unpopulated?userid=${encodeURIComponent(userid)}`;

      const response = await fetch(url, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });
      if (!response.ok) {
        throw new Error('Failed to get cart items');
      }
      const data = await response.json();

      return data;
    } catch (error) {
      console.error('Error getting cart items:', error);
      throw new Error('Failed to get cart items');
    }
  }),
  getCartItemsPopulated: protectedProcedure.query(async (opts) => {
    try {
      const userid = opts.ctx.auth.userId;
      const url = `${
        process.env.OUTERBASE_COMMANDS_ROOT_DOMAIN
      }/get-cart-items-populated?userid=${encodeURIComponent(userid)}`;
      const response = await fetch(url, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });
      if (!response.ok) {
        throw new Error('Failed to get cart items populated');
      }
      const data = await response.json();

      return data;
    } catch (error) {
      console.error('Error getting cart items populated:', error);
      throw new Error('Failed to get cart items populated');
    }
  }),
});
