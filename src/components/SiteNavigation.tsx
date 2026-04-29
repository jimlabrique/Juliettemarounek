"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { StaticSvg } from "@/components/StaticSvg";

const navItems = [
  { href: "/", label: "HOME" },
  { href: "/work", label: "WORK" },
  { href: "/about", label: "ABOUT" },
  { href: "/contact", label: "CONTACT" },
];

type SiteNavigationProps = {
  logoText: string;
};

export function SiteNavigation({ logoText }: SiteNavigationProps) {
  const pathname = usePathname();
  const isWorkRoute = pathname === "/work" || pathname.startsWith("/work/");

  return (
    <header aria-label={logoText} className="pointer-events-none absolute inset-x-0 top-0 z-50 text-[var(--cream)]">
      <nav
        aria-label="Main navigation"
        className="font-menu pointer-events-auto absolute left-5 right-5 top-7 grid grid-cols-4 items-center text-[14px] font-semibold uppercase leading-none tracking-normal md:left-[6.6vw] md:right-[4.9vw] md:top-[72px] md:text-[24px]"
      >
        {navItems.map((item, index) => {
          const isActive =
            item.href === "/"
              ? pathname === item.href
              : pathname === item.href || pathname.startsWith(`${item.href}/`);

          return (
            <Link
              key={item.href}
              href={item.href}
              aria-current={isActive ? "page" : undefined}
              className={`transition-colors duration-200 hover:text-[var(--cream)] ${
                isActive ? "text-[var(--cream)]" : "text-[var(--muted-cream)]"
              } ${index === 0 ? "justify-self-start" : ""} ${
                index === 1 || index === 2 ? "justify-self-center" : ""
              } ${index === 3 ? "justify-self-end" : ""}`}
            >
              {item.label}
            </Link>
          );
        })}
      </nav>
      {!isWorkRoute ? (
        <StaticSvg
          src="/brand/svg/director-typo.svg"
          alt="Director / Art Director"
          className="pointer-events-none fixed bottom-[3.8vh] left-5 h-auto w-[190px] md:left-[4.2vw] md:w-[265px]"
        />
      ) : null}
      <Link
        href="/"
        aria-label="Home"
        className="pointer-events-auto fixed bottom-[3.5vh] right-5 block h-auto w-[46px] md:right-[2.4vw] md:w-[66px]"
      >
        <StaticSvg src="/brand/svg/picto.svg" alt="" ariaHidden className="pointer-events-none h-auto w-full" />
      </Link>
    </header>
  );
}
