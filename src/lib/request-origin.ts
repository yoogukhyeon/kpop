/** Next may expose an internal request URL behind a proxy; browsers send the public Host. */
export function sameRequestOrigin(origin: string | null, requestUrl: string, host: string | null): boolean {
  if (!origin) return false;
  try {
    const source = new URL(origin);
    if (!["http:", "https:"].includes(source.protocol) || source.origin !== origin) return false;
    return source.origin === new URL(requestUrl).origin || source.host === host;
  } catch { return false; }
}
