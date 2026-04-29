/* eslint-disable @next/next/no-img-element */

type StaticSvgProps = {
  src: string;
  alt: string;
  className?: string;
  ariaHidden?: boolean;
};

export function StaticSvg({ src, alt, className = "", ariaHidden = false }: StaticSvgProps) {
  return <img src={src} alt={alt} aria-hidden={ariaHidden} className={className} />;
}
