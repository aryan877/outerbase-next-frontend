import { Category, FoodItem } from '@/types/types';
import slugify from 'slugify';
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
  addCategory: protectedProcedure
    .input(z.object({ name: z.string(), description: z.string() }))
    .mutation(async (opts) => {
      const category_name = opts.input.name;
      const category_description = opts.input.description;
      const category_slug = slugify(category_name);

      const response = await fetch(
        `${process.env.OUTERBASE_COMMANDS_ROOT_DOMAIN}/create-food-category`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            category_name,
            category_description,
            category_slug,
          }),
        }
      );

      if (!response.ok) {
        throw new Error('Failed to create food category');
      }

      return { success: true };
    }),
  addCategoryItem: protectedProcedure
    .input(
      z.object({
        name: z.string(),
        description: z.string(),
        price: z.number(),
        category: z.string(),
      })
    )
    .mutation(async (opts) => {
      const food_item_name = opts.input.name;
      const food_item_description = opts.input.description;
      const food_item_price = opts.input.price;
      const food_item_category = opts.input.category;
      const food_item_slug = slugify(food_item_name);

      const response = await fetch(`${process.env.OUTERBASE_COMMANDS_ROOT_DOMAIN}/add-food-item`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          food_item_name,
          food_item_description,
          food_item_price,
          food_item_category,
          food_item_slug,
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to add food item');
      }

      return { success: true };
    }),
  deleteCategory: protectedProcedure
    .input(z.object({ categoryid: z.number() }))
    .mutation(async (opts) => {
      const categoryid = opts.input.categoryid;
      console.log(categoryid, 'ehhe');

      const response = await fetch(
        `${process.env.OUTERBASE_COMMANDS_ROOT_DOMAIN}/delete-food-category`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            categoryid,
          }),
        }
      );

      if (!response.ok) {
        throw new Error('Failed to delete food category');
      }

      return { success: true };
    }),
  deleteCategoryItem: protectedProcedure
    .input(
      z.object({
        fooditemid: z.number(),
      })
    )
    .mutation(async (opts) => {
      const fooditemid = opts.input.fooditemid;

      const response = await fetch(
        `${process.env.OUTERBASE_COMMANDS_ROOT_DOMAIN}/delete-category-item`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            fooditemid,
          }),
        }
      );
      if (!response.ok) {
        throw new Error('Failed to delete food item');
      }
      return { success: true };
    }),
});
