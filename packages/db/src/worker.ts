import { drizzle } from "drizzle-orm/node-postgres";
import { Pool } from "pg";

import * as schema from "./schema";

let pool: Pool | undefined;

export const createWorkerDb = (connectionString: string) => {
  if (!pool) {
    pool = new Pool({ connectionString });
  }
  return drizzle(pool, { schema });
};
