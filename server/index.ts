import S3 from 'aws-sdk/clients/s3';
import { addressRouter } from './routers/address';
import { cartRouter } from './routers/cart';
import { categoryRouter } from './routers/category';
import { orderRouter } from './routers/order';
import { stripeRouter } from './routers/stripe';
import { createTRPCRouter } from './trpc';

// Create an S3 client
export const s3 = new S3({
  apiVersion: '2006-03-01',
  accessKeyId: process.env.ACCESS_KEY,
  secretAccessKey: process.env.SECRET_KEY,
  region: process.env.REGION,
  signatureVersion: 'v4',
});

export const appRouter = createTRPCRouter({
  category: categoryRouter,
  cart: cartRouter,
  order: orderRouter,
  address: addressRouter,
  stripe: stripeRouter,
});

export type AppRouter = typeof appRouter;
