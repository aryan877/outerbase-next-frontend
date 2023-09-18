import { cartRouter } from './routers/cart';
import { categoryRouter } from './routers/category';
import { createTRPCRouter } from './trpc';

export const appRouter = createTRPCRouter({
  category: categoryRouter,
  cart: cartRouter,
});

export type AppRouter = typeof appRouter;
