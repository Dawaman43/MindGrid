import type { Context as ElysiaContext } from "elysia";

import { auth } from "@MindGrid/auth";
import { db } from "@MindGrid/db";

export type CreateContextOptions = {
  context: ElysiaContext;
  dbOverride?: typeof db;
  authOverride?: typeof auth;
};

export async function createContext({ context, dbOverride, authOverride }: CreateContextOptions) {
  const resolvedAuth = authOverride ?? auth;
  const resolvedDb = dbOverride ?? db;
  const session = await resolvedAuth.api.getSession({
    headers: context.request.headers,
  });
  return {
    db: resolvedDb,
    session,
  };
}

export type Context = Awaited<ReturnType<typeof createContext>>;
