import { SiteNavigation } from "@/components/SiteNavigation";
import { getSiteSettings } from "@/sanity/data";

export const revalidate = 60;

export default async function SiteLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const settings = await getSiteSettings();

  return (
    <>
      <SiteNavigation logoText={settings.logoText} />
      {children}
    </>
  );
}
