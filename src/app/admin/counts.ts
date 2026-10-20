import "server-only";
import { eventReviewReason } from "@/lib/catalog-quality";
import { listAllEvents } from "@/lib/data";
import { seoulToday } from "@/lib/site";
import { adminDb } from "@/lib/supabase";

/** Work waiting in each admin section (tab badges and the home dashboard). */
export async function adminCounts() {
  const db = adminDb();
  const today = seoulToday();
  const [cafes, reported, hidden, total, events] = await Promise.all([
    db.from("cafe_submissions").select("id", { count: "exact", head: true }).eq("status", "pending"),
    db.from("birthday_messages").select("id", { count: "exact", head: true }).gt("reports", 0).eq("hidden", false),
    db.from("birthday_messages").select("id", { count: "exact", head: true }).eq("hidden", true),
    db.from("birthday_messages").select("id", { count: "exact", head: true }),
    listAllEvents(),
  ]);
  const upcoming = events.filter((e) => e.endDate >= today);
  return {
    pendingCafes: cafes.count ?? 0,
    reportedMessages: reported.count ?? 0,
    hiddenMessages: hidden.count ?? 0,
    totalMessages: total.count ?? 0,
    eventsDue: upcoming.filter((e) => eventReviewReason(e, today)).length,
    upcomingEvents: upcoming.length,
  };
}
