import { getSiteSettings } from "@/sanity/data";

export const revalidate = 60;

export default async function ContactPage() {
  const settings = await getSiteSettings();
  const email = settings.contactEmail || "marounek.studio@gmail.com";

  return (
    <main className="brand-page grid min-h-screen place-items-center px-5 pb-36 pt-28">
      <section className="text-center">
        <h1 className="sr-only">Contact</h1>
        <a
          href={`mailto:${email}`}
          className="font-display block max-w-[96vw] whitespace-nowrap text-center text-[clamp(18px,5.2vw,84px)] uppercase leading-none tracking-normal text-[var(--cream)] transition-opacity hover:opacity-70"
        >
          {email}
        </a>
        {settings.socialLinks.length ? (
          <ul className="font-menu mt-10 flex flex-wrap justify-center gap-6 text-[14px] font-semibold uppercase leading-none text-[var(--muted-cream)] md:text-[18px]">
            {settings.socialLinks.map((link) => (
              <li key={link.url}>
                <a href={link.url} target="_blank" rel="noreferrer" className="transition hover:text-[var(--cream)]">
                  {link.label}
                </a>
              </li>
            ))}
          </ul>
        ) : null}
      </section>
    </main>
  );
}
