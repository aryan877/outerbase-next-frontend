import z from 'zod';
import { createTRPCRouter, protectedProcedure } from '../trpc';
export const categoryRouter = createTRPCRouter({
  listCategories: protectedProcedure.query(async () => {
    try {
      const response = await fetch('https://zestful-tomato.cmd.outerbase.io/get-categories', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error('Failed to fetch categories');
      }

      const data = await response.json();

      return data;
    } catch (error) {
      console.error('Error listing categories:', error);
      throw new Error('Failed to list categories');
    }
  }),
  listCategoryItems: protectedProcedure
    .input(z.object({ slug: z.string().min(4) }))
    .query(async (opts) => {
      try {
        const slug = opts.input.slug;
        const url = `https://zestful-tomato.cmd.outerbase.io/get-category-items?slug=${encodeURIComponent(
          slug
        )}`;
        const response = await fetch(url, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          },
        });
        if (!response.ok) {
          throw new Error('Failed to fetch category items');
        }
        const data = await response.json();
        return data;
      } catch (error) {
        console.error('Error listing category items:', error);
        throw new Error('Failed to list category item');
      }
    }),
});
