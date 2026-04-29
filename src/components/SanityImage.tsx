import Image from "next/image";
import type { SanityImage as SanityImageType } from "@/sanity/types";

type SanityImageProps = {
  image?: SanityImageType;
  alt: string;
  className?: string;
  fetchPriority?: "auto" | "high" | "low";
  loading?: "eager" | "lazy";
  preload?: boolean;
  sizes?: string;
};

export function SanityImage({
  image,
  alt,
  className,
  fetchPriority,
  loading,
  preload,
  sizes = "100vw",
}: SanityImageProps) {
  if (!image?.url) {
    return null;
  }

  const eagerLoading = preload ? undefined : loading;
  const imageFetchPriority = preload ? undefined : fetchPriority;

  return (
    <Image
      src={image.url}
      alt={image.alt || alt}
      fill
      fetchPriority={imageFetchPriority}
      loading={eagerLoading}
      preload={preload}
      sizes={sizes}
      placeholder={image.lqip ? "blur" : "empty"}
      blurDataURL={image.lqip}
      className={className}
    />
  );
}
