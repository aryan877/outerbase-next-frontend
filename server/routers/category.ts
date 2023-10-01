import { Category, FoodItem } from '@/types/types';
import z from 'zod';
import { s3 } from '..';
import { createTRPCRouter, protectedProcedure } from '../trpc';
export const categoryRouter = createTRPCRouter({
  listCategories: protectedProcedure.query(async () => {
    try {
      const response = await fetch(
        `${process.env.OUTERBASE_COMMANDS_ROOT_DOMAIN}/get-food-categories`,
        {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          },
        }
      );

      if (!response.ok) {
        throw new Error('Failed to fetch categories');
      }

      const data = await response.json();

      data.response.items.forEach(async (item: Category) => {
        if (item.image) {
          const s3Params = {
            Bucket: process.env.BUCKET_NAME,
            Key: item.image,
            Expires: 3600,
          };
          const presignedUrl = s3.getSignedUrl('getObject', s3Params);
          item.image = presignedUrl;
        } else {
          item.image = null;
        }
      });

      return data;
    } catch (error) {
      console.error('Error listing categories:', error);
      throw new Error('Failed to list categories');
    }
  }),
  listCategoryItems: protectedProcedure
    .input(z.object({ slug: z.string() }))
    .query(async (opts) => {
      try {
        const slug = opts.input.slug;
        const url = `${
          process.env.OUTERBASE_COMMANDS_ROOT_DOMAIN
        }/get-category-items?slug=${encodeURIComponent(slug)}`;

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

        data.response.items.forEach(async (item: FoodItem) => {
          if (item.image) {
            const s3Params = {
              Bucket: process.env.BUCKET_NAME,
              Key: item.image,
              Expires: 3600,
            };

            const presignedUrl = s3.getSignedUrl('getObject', s3Params);
            item.image = presignedUrl;
          } else {
            item.image = null;
          }
        });

        return data;
      } catch (error) {
        console.error('Error listing category items:', error);
        throw new Error('Failed to list category item');
      }
    }),
});
