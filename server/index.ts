import { categoryRouter } from './routers/category';
import { createTRPCRouter } from './trpc';

export const appRouter = createTRPCRouter({
  category: categoryRouter,
});

export type AppRouter = typeof appRouter;
