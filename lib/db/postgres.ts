import { Pool } from "pg";

// В dev-режиме с DEV_BYPASS_AUTH=true база не нужна — создаём заглушку.
const isBypass =
  process.env.DEV_BYPASS_AUTH === "true" && !process.env.DATABASE_URL;

if (!isBypass && !process.env.DATABASE_URL) {
  throw new Error("DATABASE_URL is not set");
}

// Singleton pool — переиспользуем соединения между запросами в рамках процесса.
// В Next.js dev-режиме модули перезагружаются при hot-reload,
// поэтому кладём pool на globalThis чтобы избежать утечки соединений.
const globalForPg = globalThis as unknown as { pgPool?: Pool };

export const pool: Pool =
  globalForPg.pgPool ??
  new Pool({
    connectionString: process.env.DATABASE_URL || "postgresql://localhost/dev_stub",
    max: 10,
    idleTimeoutMillis: 30_000,
    connectionTimeoutMillis: 5_000,
    ssl: { rejectUnauthorized: false },
  });

if (process.env.NODE_ENV !== "production") {
  globalForPg.pgPool = pool;
}
