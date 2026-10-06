import type { NextConfig } from "next";

// Security headers are a trust signal for browsers, scanners and affiliate reviewers.
// (HSTS is already sent by Vercel.)
const securityHeaders = [
  { key: "X-Content-Type-Options", value: "nosniff" },
  { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
  { key: "X-Frame-Options", value: "SAMEORIGIN" },
  { key: "Permissions-Policy", value: "camera=(), microphone=(), geolocation=(), interest-cohort=()" },
];

const nextConfig: NextConfig = {
  poweredByHeader: false,
  // Middleware handles trailing slashes itself so legacy URLs get a direct 410.
  skipTrailingSlashRedirect: true,
  async headers() {
    return [{ source: "/:path*", headers: securityHeaders }];
  },
};

export default nextConfig;
