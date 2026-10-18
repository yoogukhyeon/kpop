// Applies supabase/schema.sql to the database (idempotent; safe to re-run).
// Usage: npm run db:migrate   (reads POSTGRES_URL_NON_POOLING or SUPABASE_DB_URL from .env)

import { readFileSync, readdirSync } from "node:fs";
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
    const filename = process.argv[2] ?? "supabase/schema.sql";
    const sqlPath = path.resolve(__dirname, "..", filename);
    if (!sqlPath.startsWith(path.resolve(__dirname, "../supabase") + path.sep) || !sqlPath.endsWith(".sql")) throw new Error("Migration must be a SQL file inside supabase/");
    await client.query("BEGIN");
    try {
      await client.query(readFileSync(sqlPath, "utf8"));
      if (!process.argv[2]) {
        const directory = path.resolve(__dirname, "../supabase/migrations");
        for (const migration of readdirSync(directory).filter((file) => file.endsWith(".sql")).sort()) {
          await client.query(readFileSync(path.join(directory, migration), "utf8"));
        }
      }
      await client.query("COMMIT");
    } catch (error) {
      await client.query("ROLLBACK");
      throw error;
    }
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
