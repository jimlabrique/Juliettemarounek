import Link from "next/link";

export default function NotFound() {
  return (
    <main className="brand-page grid min-h-screen place-items-center px-5 text-center">
      <div>
        <h1 className="font-menu text-[18px] font-semibold uppercase tracking-normal md:text-[24px]">
          Page not found
        </h1>
        <Link
          href="/work"
          className="font-menu mt-6 inline-flex border-b border-[var(--cream)] pb-1 text-[14px] font-semibold uppercase tracking-normal transition-opacity hover:opacity-65"
        >
          Back to work
        </Link>
      </div>
    </main>
  );
}
