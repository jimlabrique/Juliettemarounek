import type { Metadata } from "next";
import { SanityImage } from "@/components/SanityImage";
import { StaticSvg } from "@/components/StaticSvg";
import { getAboutPage, getSiteSettings } from "@/sanity/data";

export const revalidate = 60;

export const metadata: Metadata = {
  title: "About",
};

export default async function AboutPage() {
  const [about, settings] = await Promise.all([getAboutPage(), getSiteSettings()]);
  const email = about.contactEmail || settings.contactEmail;
  const bioParagraphs = about.bio
    .split("\n")
    .map((paragraph) => paragraph.trim())
    .filter(Boolean);

  return (
    <main className="brand-page px-5 pb-36 pt-32 md:px-[6.6vw] md:pt-[24vh]">
      <section className="grid items-start gap-10 lg:grid-cols-[minmax(0,58%)_minmax(0,1fr)] lg:gap-[3vw]">
        {about.portrait?.url ? (
          <div className="relative aspect-[1000/534] min-w-0 overflow-hidden bg-zinc-950">
            <SanityImage
              image={about.portrait}
              alt="JULIETTEMAROUNEK portrait"
              preload
              sizes="(min-width: 1024px) 55vw, 100vw"
              className="object-cover object-[center_12%]"
            />
          </div>
        ) : null}
        <div className="flex h-full min-w-0 flex-col lg:pt-2">
          <h1 className="sr-only">About</h1>
          <div className="font-editorial max-w-[820px] min-w-0 space-y-[1.35em] text-[20px] leading-[1.08] tracking-normal text-[var(--cream)] md:text-[21px] lg:text-[clamp(22px,1.25vw,27px)]">
            {bioParagraphs.map((paragraph) => (
              <p key={paragraph}>{paragraph}</p>
            ))}
          </div>
          {email ? (
            <a
              href={`mailto:${email}`}
              className="font-menu mt-10 inline-flex self-start items-center gap-2 text-[14px] font-black uppercase leading-none tracking-normal text-[var(--cream)] transition-opacity hover:opacity-65 md:text-[16px] lg:mt-auto lg:translate-y-[3px] xl:text-[20px]"
            >
              <StaticSvg
                src="/pictograms/svg/picto-about-mark.svg"
                alt=""
                ariaHidden
                className="h-[1em] w-[1.14em] shrink-0"
              />
              Drop a message
            </a>
          ) : null}
        </div>
      </section>
    </main>
  );
}
