import { ImageResponse } from "next/og";
import { BrandMark } from "@/lib/brand-image";

// 512×512 PNG logo referenced by the Organization structured data.
export const dynamic = "force-static";

export function GET() {
  return new ImageResponse(<BrandMark size={512} />, { width: 512, height: 512 });
}
