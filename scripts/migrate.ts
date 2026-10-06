// Applies supabase/schema.sql to the database (idempotent; safe to re-run).
// Usage: npm run db:migrate   (reads POSTGRES_URL_NON_POOLING or SUPABASE_DB_URL from .env)

import { readFileSync } from "node:fs";
import path from "node:path";
import { Client } from "pg";

async function main() {
  const raw = process.env.POSTGRES_URL_NON_POOLING ?? process.env.SUPABASE_DB_URL;
  if (!raw) throw new Error("Set POSTGRES_URL_NON_POOLING (or SUPABASE_DB_URL) in .env");

  // Supabase's pooler presents a certificate chain node-postgres can't verify by
  // default; the connection is still TLS-encrypted.
  const url = new URL(raw);
  url.searchParams.delete("sslmode");
  const client = new Client({ connectionString: url.toString(), ssl: { rejectUnauthorized: false } });

  await client.connect();
  try {
    // A query without parameters uses the simple protocol, so the whole file runs as one batch.
    await client.query(readFileSync(path.join(__dirname, "../supabase/schema.sql"), "utf8"));
    const { rows } = await client.query(
      "select table_name from information_schema.tables where table_schema = 'public' order by 1",
    );
    console.log("public tables:", rows.map((r) => r.table_name).join(", "));
  } finally {
    await client.end();
  }
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
