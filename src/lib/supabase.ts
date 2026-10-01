import "server-only";
import { createClient, type SupabaseClient } from "@supabase/supabase-js";

// Server-only Supabase clients. `publicDb` uses the publishable key and is
// limited by RLS (read catalog, insert pending submissions). `adminDb` uses the
// secret key and bypasses RLS — only for the admin page and seeding.

const url = process.env.SUPABASE_URL?.replace(/\/rest\/v1\/?$/, "");
const publishableKey = process.env.SUPABASE_PUBLISHABLE_KEY;
const secretKey = process.env.SUPABASE_SECRET_KEY;

export const supabaseConfigured = () => Boolean(url && publishableKey);

const options = { auth: { persistSession: false, autoRefreshToken: false } };
let publicClient: SupabaseClient | undefined;
let adminClient: SupabaseClient | undefined;

export function publicDb(): SupabaseClient {
  if (!url || !publishableKey) throw new Error("Supabase is not configured (SUPABASE_URL / SUPABASE_PUBLISHABLE_KEY)");
  return (publicClient ??= createClient(url, publishableKey, options));
}

export function adminDb(): SupabaseClient {
  if (!url || !secretKey) throw new Error("Supabase admin is not configured (SUPABASE_SECRET_KEY)");
  return (adminClient ??= createClient(url, secretKey, options));
}
