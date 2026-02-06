import { appRouter } from "@MindGrid/api/routers/index";
import { createAuth } from "@MindGrid/auth/worker";
import { createWorkerDb } from "@MindGrid/db/worker";
import { fetchRequestHandler } from "@trpc/server/adapters/fetch";
import { Elysia } from "elysia";
import { CloudflareAdapter } from "elysia/adapter/cloudflare-worker";

type WorkerEnv = {
  CORS_ORIGIN: string;
  BETTER_AUTH_SECRET: string;
  BETTER_AUTH_URL: string;
  NODE_ENV?: "development" | "production" | "test";
  DATABASE_URL?: string;
  HYPERDRIVE?: {
    connectionString: string;
  };
};

type Runtime = {
  db: ReturnType<typeof createWorkerDb>;
  auth: ReturnType<typeof createAuth>;
};

let runtime: Runtime | null = null;

const getRuntime = (workerEnv: WorkerEnv) => {
  if (runtime) {
    return runtime;
  }
  const connectionString =
    workerEnv.HYPERDRIVE?.connectionString ?? workerEnv.DATABASE_URL ?? "";
  if (!connectionString) {
    throw new Error("Missing DATABASE_URL or HYPERDRIVE binding for Postgres.");
  }
  const db = createWorkerDb(connectionString);
  const auth = createAuth({
    db,
    env: {
      CORS_ORIGIN: workerEnv.CORS_ORIGIN,
      BETTER_AUTH_SECRET: workerEnv.BETTER_AUTH_SECRET,
      BETTER_AUTH_URL: workerEnv.BETTER_AUTH_URL,
      NODE_ENV: workerEnv.NODE_ENV ?? "production",
    },
  });
  runtime = { db, auth };
  return runtime;
};

const corsHeaders = (workerEnv: WorkerEnv) => ({
  "Access-Control-Allow-Origin": workerEnv.CORS_ORIGIN ?? "*",
  "Access-Control-Allow-Methods": "GET,POST,OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type,Authorization",
  "Access-Control-Allow-Credentials": "true",
});

const withCors = (response: Response, workerEnv: WorkerEnv) => {
  const headers = new Headers(response.headers);
  Object.entries(corsHeaders(workerEnv)).forEach(([key, value]) => {
    headers.set(key, value);
  });
  return new Response(response.body, {
    status: response.status,
    statusText: response.statusText,
    headers,
  });
};

export default new Elysia({ adapter: CloudflareAdapter })
  .options("/*", ({ env }) => {
    const workerEnv = env as WorkerEnv;
    return new Response(null, { status: 204, headers: corsHeaders(workerEnv) });
  })
  .all("/api/auth/*", async ({ request, set, env }) => {
    const workerEnv = env as WorkerEnv;
    const { auth } = getRuntime(workerEnv);
    if (["POST", "GET"].includes(request.method)) {
      const response = await auth.handler(request);
      return withCors(response, workerEnv);
    }
    set.status = 405;
    return "Method Not Allowed";
  })
  .all("/trpc/*", async (context) => {
    const workerEnv = context.env as WorkerEnv;
    const { db, auth } = getRuntime(workerEnv);
    const response = await fetchRequestHandler({
      endpoint: "/trpc",
      router: appRouter,
      req: context.request,
      createContext: async () => {
        const session = await auth.api.getSession({
          headers: context.request.headers,
        });
        return { db, session };
      },
    });
    return withCors(response, workerEnv);
  })
  .get("/", () => "OK")
  .compile();
