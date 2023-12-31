import { capitalizeFirstLetter } from '@/utils/strings';
import { clerkClient } from '@clerk/nextjs';
import z from 'zod';
import { createTRPCRouter, protectedProcedure } from '../trpc';

export const orderRouter = createTRPCRouter({
  createOrder: protectedProcedure
    .input(
      z.object({
        addressid: z.number(),
      })
    )
    .mutation(async (opts) => {
      try {
        const user = await clerkClient.users.getUser(opts.ctx.auth.userId);

        const userid = opts.ctx.auth.userId;

        // // Create a request body JSON object
        const requestBody = JSON.stringify({
          userid,
          email: user.emailAddresses[0]?.emailAddress as string,
          first_name: capitalizeFirstLetter(user.firstName as string) as string,
          addressid: opts.input.addressid,
          tax_percentage: Number(process.env.NEXT_PUBLIC_TAX_PERCENTAGE),
        });

        const response = await fetch(
          `${process.env.OUTERBASE_COMMANDS_ROOT_DOMAIN}/create-order-entry-cart`,
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

        const resetCartResponse = await fetch(
          `${process.env.OUTERBASE_COMMANDS_ROOT_DOMAIN}/reset-cart`,
          {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              userid,
            }),
          }
        );

        if (!resetCartResponse.ok) {
          throw new Error('Failed to resetCart');
        }

        const data = await response.json();

        return { success: true, orderid: data.response.items[0][0].orderid as number };
      } catch (error) {
        console.error('Error creating order:', error);
        throw new Error('Failed to create order');
      }
    }),
  getOrders: protectedProcedure
    .input(
      z.object({
        page: z.number(),
      })
    )
    .query(async (opts) => {
      try {
        const userid = opts.ctx.auth.userId;
        const page = opts.input.page;
        const url = `${
          process.env.OUTERBASE_COMMANDS_ROOT_DOMAIN
        }/get-orders-list?userid=${encodeURIComponent(userid)}&page=${page}`;

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
  getOrderCount: protectedProcedure.query(async (opts) => {
    try {
      const userid = opts.ctx.auth.userId;
      const url = `${
        process.env.OUTERBASE_COMMANDS_ROOT_DOMAIN
      }/get-user-order-count?userid=${encodeURIComponent(userid)}`;

      const response = await fetch(url, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });
      if (!response.ok) {
        throw new Error('Failed to get order count');
      }
      const data = await response.json();

      return data;
    } catch (error) {
      console.error('Error getting order count:', error);
      throw new Error('Failed to get order count');
    }
  }),
  sendOrderQuery: protectedProcedure
    .input(
      z.object({
        query: z.string(),
        phoneNumber: z.string(),
        orderid: z.string(),
        queryType: z.string(),
      })
    )
    .mutation(async (opts) => {
      try {
        const user = await clerkClient.users.getUser(opts.ctx.auth.userId);
        const requestBody = JSON.stringify({
          query: opts.input.query,
          email: user.emailAddresses[0]?.emailAddress as string,
          first_name: capitalizeFirstLetter(user.firstName as string) as string,
          orderid: opts.input.orderid,
          phone_number: opts.input.phoneNumber,
          slackwebhook: process.env.CUSTOMER_QUERIES_CHANNEL_WEBHOOK as string,
          query_type: opts.input.queryType,
        });

        const response = await fetch(
          `${process.env.OUTERBASE_COMMANDS_ROOT_DOMAIN}/send-customer-query-slack`,
          {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: requestBody,
          }
        );

        if (!response.ok) {
          throw new Error('Failed to send query to slack');
        }
      } catch (error) {
        console.error('Error sending query to slack:', error);
        throw new Error('Failed to send query to slack');
      }
    }),
  sendOrderReview: protectedProcedure
    .input(z.object({ rating: z.number(), review: z.string(), orderid: z.string() }))
    .mutation(async (opts) => {
      try {
        const user = await clerkClient.users.getUser(opts.ctx.auth.userId);
        const requestBody = JSON.stringify({
          stars: String(opts.input.rating),
          email: user.emailAddresses[0]?.emailAddress as string,
          first_name: capitalizeFirstLetter(user.firstName as string) as string,
          orderid: opts.input.orderid,
          review: String(opts.input.review),
          notion_integration_key: process.env.NOTION_INTEGRATION_KEY,
          notion_database_id: process.env.NOTION_DATABASE_ID,
          mailgundomain: process.env.MAILGUN_DOMAIN,
          mailgunapikey: process.env.MAILGUN_API_KEY,
          restaurantname: process.env.NEXT_PUBLIC_RESTAURANT_NAME,
          fromemail: process.env.FROM_EMAIL,
        });

        const response = await fetch(
          `${process.env.OUTERBASE_COMMANDS_ROOT_DOMAIN}/send-customer-review-notion`,
          {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: requestBody,
          }
        );

        if (!response.ok) {
          throw new Error('Failed to send review to notion db');
        }
      } catch (error) {
        console.error('Error sending review to notion db:', error);
        throw new Error('Failed to send review to notion db');
      }
    }),
});

//discarded code

// const url = `${
//   process.env.OUTERBASE_COMMANDS_ROOT_DOMAIN
// }/get-cart-items-populated?userid=${encodeURIComponent(userid)}`;

// const cartItemsResponse = await fetch(url, {
//   method: 'GET',
//   headers: {
//     'Content-Type': 'application/json',
//   },
// });

// if (!cartItemsResponse.ok) {
//   throw new Error('Failed to get cart items');
// }

// const cartData = await cartItemsResponse.json();

// const cartItems = cartData.response.items;

// const total_price = cartItems.reduce((acc: number, item: CartItem & FoodItem) => {
//   const itemPrice = item.price * item.quantity;
//   return acc + itemPrice;
// }, 0);

// // Add tax (15%)
// const tax = total_price * (Number(process.env.NEXT_PUBLIC_TAX_PERCENTAGE) / 100);

// const total_price_with_tax = total_price + tax;

// const orderItemsString = cartItems.map((item: CartItem) => JSON.stringify(item));

// //read the address using the id
// const getAddressByIdUrl = `${
//   process.env.OUTERBASE_COMMANDS_ROOT_DOMAIN
// }/get-address-by-id?addressid=${encodeURIComponent(opts.input.addressid)}`;

// const addressResponse = await fetch(getAddressByIdUrl, {
//   method: 'GET',
//   headers: {
//     'Content-Type': 'application/json',
//   },
// });
// if (!addressResponse.ok) {
//   throw new Error('Failed to get order by id');
// }

// const addressData = await addressResponse.json();

// const address = addressData.response.items[0] as Address;

// const order: Order = {
//   //body
//   userid: user.id,
//   email: user.emailAddresses[0]?.emailAddress as string,
//   first_name: capitalizeFirstLetter(user.firstName as string) as string,
//   //order data
//   total_price: total_price_with_tax.toFixed(2),
//   order_items: orderItemsString,
//   //address_related_properties_below
//   phone_number: address.phone_number as string,
//   google_formatted_address: (address.google_formatted_address as string) || '',
//   landmark: (address.landmark as string) || '',
//   flat_number: address.flat_number as string,
//   street: address.street as string,
//   pincode: address.pincode as string,
//   state: address.state as string,
//   delivery_phone_number: address.phone_number as string,
//   latitude: address.latitude as number,
//   longitude: address.longitude as number,
// };
