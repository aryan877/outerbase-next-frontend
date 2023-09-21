import { addressRouter } from './routers/address';
import { cartRouter } from './routers/cart';
import { categoryRouter } from './routers/category';
import { orderRouter } from './routers/order';
import { stripeRouter } from './routers/stripe';
import { createTRPCRouter } from './trpc';

export const appRouter = createTRPCRouter({
  category: categoryRouter,
  cart: cartRouter,
  order: orderRouter,
  address: addressRouter,
  stripe: stripeRouter,
});

export type AppRouter = typeof appRouter;
