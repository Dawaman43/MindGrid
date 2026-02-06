import * as schema from "@MindGrid/db/schema/auth";
import { betterAuth } from "better-auth";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import { expo } from "@better-auth/expo";

import type { AuthEnv } from "./index";
import type { db as dbType } from "@MindGrid/db";

export const createAuth = (options: { db: typeof dbType; env: AuthEnv }) => {
  const nodeEnv = options.env.NODE_ENV ?? "development";
  return betterAuth({
    secret: options.env.BETTER_AUTH_SECRET,
    baseURL: options.env.BETTER_AUTH_URL,
    database: drizzleAdapter(options.db, {
      provider: "pg",
      schema: schema,
    }),
    trustedOrigins: [
      options.env.CORS_ORIGIN,
      "mybettertapp://",
      ...(nodeEnv === "development"
        ? ["exp://", "exp://**", "exp://192.168.*.*:*/**", "http://localhost:8081"]
        : []),
    ],
    emailAndPassword: {
      enabled: true,
    },
    advanced: {
      defaultCookieAttributes: {
        sameSite: "none",
        secure: true,
        httpOnly: true,
      },
    },
    plugins: [expo()],
  });
};
