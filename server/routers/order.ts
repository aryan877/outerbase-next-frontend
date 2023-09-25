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

        // // Create a request body JSON object
        const requestBody = JSON.stringify({
          userid,
          email: user.emailAddresses[0]?.emailAddress as string,
          first_name: capitalizeFirstLetter(user.firstName as string) as string,
          addressid: opts.input.addressid,
          tax_percentage: Number(process.env.NEXT_PUBLIC_TAX_PERCENTAGE),
        });
        console.log(requestBody);

        const response = await fetch(
          `${process.env.OUTERBASE_COMMANDS_ROOT_DOMAIN}/create-order-entry-from-cart`,
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
