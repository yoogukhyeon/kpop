// Submits every URL in the live sitemap to IndexNow (shared by Bing, Naver,
// Yandex, Seznam…) so new and changed pages get crawled quickly.
// Google doesn't use IndexNow — submit the sitemap in Search Console instead.
// Usage: npm run indexnow   (after a production deploy)

const SITE = process.env.NEXT_PUBLIC_SITE_URL || "https://sidequestday.com";
const KEY = "27f4b1d8bfaef18280e66477fec25e66"; // must match public/<KEY>.txt

async function main() {
  const xml = await (await fetch(`${SITE}/sitemap.xml`)).text();
  const urls = [...xml.matchAll(/<loc>([^<]+)<\/loc>/g)].map((m) => m[1]);
  const host = new URL(SITE).host;
  // IndexNow accepts up to 10,000 URLs per request.
  for (let i = 0; i < urls.length; i += 10000) {
    const res = await fetch("https://api.indexnow.org/indexnow", {
      method: "POST",
      headers: { "Content-Type": "application/json; charset=utf-8" },
      body: JSON.stringify({ host, key: KEY, keyLocation: `${SITE}/${KEY}.txt`, urlList: urls.slice(i, i + 10000) }),
    });
    console.log(`IndexNow: ${urls.slice(i, i + 10000).length} URLs → HTTP ${res.status}`);
  }
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});

export {};
