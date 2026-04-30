import { BrandLogo } from "@/components/BrandLogo";
import { VideoFrame } from "@/components/VideoFrame";
import { getSiteSettings } from "@/sanity/data";

export const revalidate = 60;

export default async function HomePage() {
  const settings = await getSiteSettings();

  return (
    <main className="brand-page relative h-dvh min-h-[560px] overflow-hidden">
      <VideoFrame
        video={settings.heroVideo}
        poster={settings.heroFallbackImage}
        label="JULIETTEMAROUNEK hero film"
        className="h-full w-full"
        priorityPoster
      />
      <BrandLogo className="absolute left-[4vw] top-[var(--site-logo-top)] z-10 h-auto w-[92vw] max-w-none" />
    </main>
  );
}
