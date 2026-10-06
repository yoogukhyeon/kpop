import { SitePage, sitePageMetadata } from "@/components/SitePage";

type Props = { params: Promise<{ locale: string }> };

export async function generateMetadata({ params }: Props) {
  return sitePageMetadata((await params).locale, "terms");
}

export default async function Page({ params }: Props) {
  return <SitePage locale={(await params).locale} slug="terms" />;
}
