import { revalidatePath, revalidateTag } from "next/cache";
import { isAdminAuthorized } from "@/lib/admin-auth";
import { DB_CACHE_TAG } from "@/lib/supabase";

// POST /admin/revalidate (Basic auth, same password as /admin): drops cached DB
// reads and regenerates pages. Used by `npm run refresh` after db:seed.
export async function POST(req: Request) {
  // Middleware already guards /admin/*; re-check so the route is safe on its own.
  if (!isAdminAuthorized(req.headers.get("authorization"))) return new Response("Unauthorized", { status: 401 });
  revalidateTag(DB_CACHE_TAG);
  revalidatePath("/", "layout");
  return Response.json({ revalidated: true, at: new Date().toISOString() });
}
