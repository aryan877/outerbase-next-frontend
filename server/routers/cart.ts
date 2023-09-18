import z from 'zod';
import { createTRPCRouter, protectedProcedure } from '../trpc';

export const cartRouter = createTRPCRouter({
  addItemToCart: protectedProcedure
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

        // Create a request body JSON object with itemid and quantity
        const requestBody = JSON.stringify({ itemid, quantity, userid });

        const response = await fetch('https://zestful-tomato.cmd.outerbase.io/add-item-to-cart', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: requestBody,
        });

        if (!response.ok) {
          throw new Error('Failed to add item to cart');
        }

        const data = await response.json();

        return data;
      } catch (error) {
        console.error('Error adding item to cart:', error);
        throw new Error('Failed to add item to cart');
      }
    }),
});
