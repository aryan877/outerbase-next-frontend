import z from 'zod';
import { createTRPCRouter, protectedProcedure } from '../trpc';

export const addressRouter = createTRPCRouter({
  addUserAddress: protectedProcedure
    .input(
      z.object({
        flatNumber: z.string(),
        landmark: z.string(),
        phoneNumber: z.string(),
        pincode: z.string(),
        state: z.string(),
        street: z.string(),
        latitude: z.number(),
        longitude: z.number(),
        googleAddress: z.string(),
      })
    )
    .mutation(async (opts) => {
      try {
        const addressInput = opts.input;
        const userid = opts.ctx.auth.userId;
        const flat_number = addressInput.flatNumber;
        const landmark = addressInput.landmark;
        const phone_number = addressInput.phoneNumber;
        const pincode = addressInput.pincode;
        const state = addressInput.state;
        const street = addressInput.street;
        const latitude = addressInput.latitude;
        const longitude = addressInput.longitude;
        const google_formatted_address = addressInput.googleAddress;

        // Create a request body JSON object with itemid and quantity
        const requestBody = JSON.stringify({
          userid,
          flat_number,
          phone_number,
          pincode,
          state,
          street,
          latitude,
          longitude,
          google_formatted_address,
          landmark,
        });

        const response = await fetch(
          `${process.env.OUTERBASE_COMMANDS_ROOT_DOMAIN}/add-user-address`,
          {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: requestBody,
          }
        );

        if (!response.ok) {
          throw new Error('Failed to add user address');
        }

        const data = await response.json();

        return data;
      } catch (error) {
        console.error('Error adding user address:', error);
        throw new Error('Failed to add user address');
      }
    }),
  getUserAddresses: protectedProcedure.query(async (opts) => {
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
        throw new Error('Failed to get list of addresses');
      }
      const data = await response.json();

      return data;
    } catch (error) {
      console.error('Error getting list of addresses:', error);
      throw new Error('Failed to get list of addresses');
    }
  }),
  getUserAddressById: protectedProcedure
    .input(z.object({ orderid: z.string() }))
    .query(async (opts) => {
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
          throw new Error('Failed to get address by id');
        }
        const data = await response.json();

        return data;
      } catch (error) {
        console.error('Error getting address by id:', error);
        throw new Error('Failed to get address by id');
      }
    }),
});
