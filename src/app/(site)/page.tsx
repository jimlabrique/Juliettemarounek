import Link from "next/link";
import { BrandLogo } from "@/components/BrandLogo";
import { StaticSvg } from "@/components/StaticSvg";
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
      <div className="pointer-events-none absolute bottom-1 left-0 right-3 z-20 flex items-end justify-between md:hidden">
        <StaticSvg
          src="/brand/svg/director-typo.svg"
          alt="Director / Art Director"
          className="h-auto w-[190px] -translate-x-[20px] translate-y-[8px]"
        />
        <Link
          href="/"
          aria-label="Home"
          className="pointer-events-auto h-auto w-[46px]"
        >
          <StaticSvg src="/brand/svg/picto.svg" alt="" ariaHidden className="h-auto w-full" />
        </Link>
      </div>
    </main>
  );
}
