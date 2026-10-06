import "server-only";
import { createClient, type SupabaseClient } from "@supabase/supabase-js";

// Server-only Supabase clients. `publicDb` uses the publishable key and is
// limited by RLS (read catalog, insert pending submissions). `adminDb` uses the
// secret key and bypasses RLS — only for the admin page and seeding.

// Accepts both our names and the NEXT_PUBLIC_* names from Supabase's "Connect" snippet.
const url = (process.env.SUPABASE_URL ?? process.env.NEXT_PUBLIC_SUPABASE_URL)?.replace(/\/rest\/v1\/?$/, "");
const publishableKey = process.env.SUPABASE_PUBLISHABLE_KEY ?? process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY;
const secretKey = process.env.SUPABASE_SECRET_KEY;

export const supabaseConfigured = () => Boolean(url && publishableKey);

/** Cache tag on every public DB read; the admin "refresh" button revalidates it. */
export const DB_CACHE_TAG = "db";

const options = { auth: { persistSession: false, autoRefreshToken: false } };
// Public reads go through Next's data cache (daily, tagged) so pages stay static.
// Data changes weekly and every change runs `npm run refresh`, so a long TTL is safe.
const publicOptions = {
  ...options,
  global: {
    fetch: (input: RequestInfo | URL, init?: RequestInit) =>
      fetch(input, { ...init, next: { revalidate: 86400, tags: [DB_CACHE_TAG] } } as RequestInit),
  },
};
let publicClient: SupabaseClient | undefined;
let adminClient: SupabaseClient | undefined;

export function publicDb(): SupabaseClient {
  if (!url || !publishableKey) throw new Error("Supabase is not configured (SUPABASE_URL / SUPABASE_PUBLISHABLE_KEY)");
  return (publicClient ??= createClient(url, publishableKey, publicOptions));
}

export function adminDb(): SupabaseClient {
  if (!url || !secretKey) throw new Error("Supabase admin is not configured (SUPABASE_SECRET_KEY)");
  return (adminClient ??= createClient(url, secretKey, options));
}
