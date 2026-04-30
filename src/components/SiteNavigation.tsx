"use client";

import { useEffect, useState } from "react";
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
  const isProjectRoute = pathname.startsWith("/work/");
  const [isProjectMenuHidden, setIsProjectMenuHidden] = useState(false);
  const shouldHideProjectMenu = isProjectRoute && isProjectMenuHidden;

  useEffect(() => {
    if (!isProjectRoute) {
      return;
    }

    let frameId: number | undefined;
    const isMobileViewport = () => window.matchMedia("(max-width: 767px)").matches;
    const getScrollTop = () =>
      window.scrollY ||
      document.documentElement.scrollTop ||
      document.body.scrollTop ||
      0;
    const updateMenuVisibility = () => {
      setIsProjectMenuHidden(getScrollTop() > 2);
    };
    const scheduleMenuVisibilityUpdate = () => {
      if (frameId !== undefined) {
        window.cancelAnimationFrame(frameId);
      }

      frameId = window.requestAnimationFrame(updateMenuVisibility);
    };
    const hideMenuOnMobileScroll = () => {
      if (isMobileViewport()) {
        setIsProjectMenuHidden(true);
      }
    };

    scheduleMenuVisibilityUpdate();
    window.addEventListener("scroll", scheduleMenuVisibilityUpdate, {
      passive: true,
    });
    document.addEventListener("scroll", scheduleMenuVisibilityUpdate, {
      capture: true,
      passive: true,
    });
    window.addEventListener("touchmove", hideMenuOnMobileScroll, {
      passive: true,
    });

    return () => {
      if (frameId !== undefined) {
        window.cancelAnimationFrame(frameId);
      }

      window.removeEventListener("scroll", scheduleMenuVisibilityUpdate);
      document.removeEventListener("scroll", scheduleMenuVisibilityUpdate, {
        capture: true,
      });
      window.removeEventListener("touchmove", hideMenuOnMobileScroll);
    };
  }, [isProjectRoute]);

  return (
    <header aria-label={logoText} className="pointer-events-none absolute inset-x-0 top-0 z-50 text-[var(--cream)]">
      <nav
        aria-label="Main navigation"
        className={`font-menu fixed inset-x-5 top-[var(--site-menu-top)] flex items-center justify-between text-[12px] font-medium uppercase leading-none tracking-normal transition-[opacity,transform] duration-300 ease-out md:inset-x-[6.6vw] md:grid md:grid-cols-4 md:text-[16px] ${
          shouldHideProjectMenu
            ? "pointer-events-none -translate-y-4 opacity-0"
            : "pointer-events-auto translate-y-0 opacity-100"
        }`}
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
              className={`transition-opacity duration-300 ease-out hover:opacity-60 ${
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
          className="pointer-events-none fixed bottom-4 left-4 hidden h-auto w-[265px] md:block"
        />
      ) : null}
      <Link
        href="/"
        aria-label="Home"
        className="pointer-events-auto fixed bottom-4 right-4 hidden h-auto w-[66px] md:block"
      >
        <StaticSvg src="/brand/svg/picto.svg" alt="" ariaHidden className="pointer-events-none h-auto w-full" />
      </Link>
    </header>
  );
}
