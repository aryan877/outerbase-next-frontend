/**
 * YOU PROBABLY DON'T NEED TO EDIT THIS FILE, UNLESS:
 * 1. You want to modify request context (see Part 1)
 * 2. You want to create a new middleware or type of procedure (see Part 3)
 *
 * tl;dr - this is where all the tRPC server stuff is created and plugged in.
 * The pieces you will need to use are documented accordingly near the end
 */

/**
 * 1. CONTEXT
 *
 * This section defines the "contexts" that are available in the backend API
 *
 * These allow you to access things like the database, the session, etc, when
 * processing a request
 *
 */
import type { SignedInAuthObject, SignedOutAuthObject } from '@clerk/nextjs/api';
import { getAuth } from '@clerk/nextjs/server';
import { type CreateNextContextOptions } from '@trpc/server/adapters/next';

interface AuthContext {
  auth: SignedInAuthObject | SignedOutAuthObject;
}
/**
 * This helper generates the "internals" for a tRPC context. If you need to use
 * it, you can export it from here
 *
 * Examples of things you may need it for:
 * - testing, so we dont have to mock Next.js' req/res
 * - trpc's `createSSGHelpers` where we don't have req/res
 * @see https://create.t3.gg/en/usage/trpc#-servertrpccontextts
 */
const createInnerTRPCContext = ({ auth }: AuthContext) => {
  return {
    auth,
  };
};

/**
 * This is the actual context you'll use in your router. It will be used to
 * process every request that goes through your tRPC endpoint
 * @link https://trpc.io/docs/context
 */
export const createTRPCContext = async (opts: CreateNextContextOptions) => {
  return createInnerTRPCContext({ auth: getAuth(opts.req) });
};

/**
 * 2. INITIALIZATION
 *
 * This is where the trpc api is initialized, connecting the context and
 * transformer
 */
import { initTRPC, TRPCError } from '@trpc/server';

const t = initTRPC.context<typeof createTRPCContext>().create({
  errorFormatter({ shape }) {
    return shape;
  },
});

// Middleware to check if the user is signed in; otherwise, it throws an UNAUTHORIZED error.
const isAuthed = t.middleware(({ next, ctx }) => {
  // Check if a user is signed in by verifying the existence of a userId in the authentication context.
  if (!ctx.auth.userId) {
    throw new TRPCError({ code: 'UNAUTHORIZED' });
  }

  // If the user is signed in, continue processing the request with the updated authentication context.
  return next({
    ctx: {
      auth: ctx.auth,
    },
  });
});

/**
 * 3. ROUTER & PROCEDURE (THE IMPORTANT BIT)
 *
 * These are the pieces you use to build your tRPC API. You should import these
 * a lot in the /src/server/api/routers folder
 */

/**
 * This is how you create new routers and subrouters in your tRPC API
 * @see https://trpc.io/docs/router
 */
export const createTRPCRouter = t.router;

/**
 * Public (unauthed) procedure
 *
 * This is the base piece you use to build new queries and mutations on your
 * tRPC API. It does not guarantee that a user querying is authorized, but you
 * can still access user session data if they are logged in
 */

// Procedure accessible to the public without requiring sign-in
export const publicProcedure = t.procedure;

// Procedure that can be called by both administrators and basic members.
// User must be signed in to access this procedure.
export const protectedProcedure = t.procedure.use(isAuthed);

// Procedure exclusively available to administrators based on organization role.
// export const protectedAdminProcedure = t.procedure.use(isAdmin);
