import { StaticSvg } from "@/components/StaticSvg";

type BrandLogoProps = {
  className?: string;
};

export function BrandLogo({ className = "" }: BrandLogoProps) {
  return (
    <StaticSvg
      src="/brand/svg/logo-juliette-marounek.svg"
      alt="JULIETTE MAROUNEK"
      className={`pointer-events-none select-none ${className}`}
    />
  );
}
