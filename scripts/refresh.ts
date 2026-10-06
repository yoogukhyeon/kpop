// Tells the live site to drop cached DB data (run after `npm run db:seed`).
// Usage: npm run refresh   (uses ADMIN_PASSWORD and NEXT_PUBLIC_SITE_URL from .env/.env.local)

const site = process.env.NEXT_PUBLIC_SITE_URL || "https://sidequestday.com";
const password = process.env.ADMIN_PASSWORD;
if (!password) throw new Error("Set ADMIN_PASSWORD in .env.local");

async function main() {
  const res = await fetch(`${site}/admin/revalidate`, {
    method: "POST",
    headers: { Authorization: `Basic ${Buffer.from(`admin:${password}`).toString("base64")}` },
  });
  console.log(`${site}/admin/revalidate → HTTP ${res.status} ${await res.text()}`);
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});

export {};
