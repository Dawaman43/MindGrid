import type { Context as ElysiaContext } from "elysia";

import { auth } from "@MindGrid/auth";
import { db } from "@MindGrid/db";

export type CreateContextOptions = {
  context: ElysiaContext;
};

export async function createContext({ context }: CreateContextOptions) {
  const session = await auth.api.getSession({
    headers: context.request.headers,
  });
  return {
    db,
    session,
  };
}

export type Context = Awaited<ReturnType<typeof createContext>>;
