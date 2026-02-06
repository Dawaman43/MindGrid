type Env = {
  ORIGIN_URL: string;
  CORS_ORIGIN?: string;
};

const defaultHeaders = (env: Env) => ({
  "Access-Control-Allow-Origin": env.CORS_ORIGIN ?? "*",
  "Access-Control-Allow-Methods": "GET,POST,PUT,PATCH,DELETE,OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type,Authorization",
  "Access-Control-Allow-Credentials": "true",
});

export default {
  async fetch(request: Request, env: Env) {
    if (request.method === "OPTIONS") {
      return new Response(null, {
        status: 204,
        headers: defaultHeaders(env),
      });
    }

    const origin = new URL(env.ORIGIN_URL);
    const url = new URL(request.url);
    const target = new URL(url.pathname + url.search, origin);
    const response = await fetch(new Request(target, request));
    const headers = new Headers(response.headers);
    const corsHeaders = defaultHeaders(env);
    Object.entries(corsHeaders).forEach(([key, value]) => {
      headers.set(key, value);
    });

    return new Response(response.body, {
      status: response.status,
      statusText: response.statusText,
      headers,
    });
  },
};
