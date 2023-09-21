import z from 'zod';
import { createTRPCRouter, protectedProcedure } from '../trpc';

export const addressRouter = createTRPCRouter({
  addUserAddress: protectedProcedure
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

        const response = await fetch(
          `${process.env.OUTERBASE_COMMANDS_ROOT_DOMAIN}/add-item-to-cart`,
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
});
