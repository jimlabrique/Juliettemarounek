import { SanityImage } from "@/components/SanityImage";
import { StaticSvg } from "@/components/StaticSvg";
import { getAboutPage, getSiteSettings } from "@/sanity/data";

export const revalidate = 60;

export default async function AboutPage() {
  const [about, settings] = await Promise.all([getAboutPage(), getSiteSettings()]);
  const email = about.contactEmail || settings.contactEmail;
  const bioParagraphs = about.bio
    .split("\n")
    .map((paragraph) => paragraph.trim())
    .filter(Boolean);

  return (
    <main className="brand-page px-5 pb-36 pt-32 md:px-[3.2vw] md:pt-[22vh]">
      <section className="grid items-start gap-10 lg:grid-cols-[minmax(368px,1fr)_repeat(11,minmax(0,0.25fr))] lg:gap-0">
        {about.portrait?.url ? (
          <div className="relative aspect-[1000/534] min-w-0 overflow-hidden bg-zinc-950 lg:col-span-3">
            <SanityImage
              image={about.portrait}
              alt="JULIETTEMAROUNEK portrait"
              preload
              sizes="(min-width: 1280px) 38vw, (min-width: 1024px) 46vw, 100vw"
              className="object-cover object-[center_12%]"
            />
          </div>
        ) : null}
        <div className="flex h-full min-w-0 flex-col lg:col-span-8 lg:col-start-5 lg:pt-2">
          <h1 className="sr-only">About</h1>
          <div className="font-editorial min-w-0 max-w-[46rem] space-y-[1.35em] text-[20px] leading-[1.08] tracking-normal text-[var(--cream)] lg:text-[20px] xl:text-[21px]">
            {bioParagraphs.map((paragraph) => (
              <p key={paragraph}>{paragraph}</p>
            ))}
          </div>
          {email ? (
            <a
              href={`mailto:${email}`}
              className="font-menu mt-10 inline-flex self-start items-center gap-1.5 text-[12px] font-black uppercase leading-none tracking-normal text-[var(--cream)] transition-opacity hover:opacity-65 md:text-[13px] lg:mt-auto lg:translate-y-[3px] xl:text-[14px]"
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
