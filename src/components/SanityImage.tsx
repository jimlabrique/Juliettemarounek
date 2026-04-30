import Image from "next/image";
import { createImageUrlBuilder } from "@sanity/image-url";
import { dataset, studioProjectId } from "@/sanity/env";
import type { CSSProperties } from "react";
import type { SanityImage as SanityImageType } from "@/sanity/types";

type SanityImageProps = {
  image?: SanityImageType;
  alt: string;
  className?: string;
  fetchPriority?: "auto" | "high" | "low";
  hotspotMode?: "all" | "mobile";
  loading?: "eager" | "lazy";
  preload?: boolean;
  sizes?: string;
};

const imageBuilder = createImageUrlBuilder({
  projectId: studioProjectId,
  dataset,
});

function getSanityImageSource(image: SanityImageType) {
  if (!image.asset?._ref && !image.asset?._id) {
    return undefined;
  }

  return {
    asset: image.asset,
    crop: image.crop,
    hotspot: image.hotspot,
  };
}

function getHotspotObjectPosition(image?: SanityImageType) {
  if (!image?.hotspot) {
    return undefined;
  }

  return `${Math.round(image.hotspot.x * 100)}% ${Math.round(image.hotspot.y * 100)}%`;
}

export function getOptimizedSanityImageUrl(
  imageOrUrl: SanityImageType | string,
  width = 2400,
) {
  const url = typeof imageOrUrl === "string" ? imageOrUrl : imageOrUrl.url;

  if (!url) {
    return "";
  }

  if (!url.startsWith("https://cdn.sanity.io/images/")) {
    return url;
  }

  if (typeof imageOrUrl !== "string") {
    const source = getSanityImageSource(imageOrUrl);

    if (source) {
      return imageBuilder.image(source).width(width).auto("format").url();
    }
  }

  const imageUrl = new URL(url);

  imageUrl.searchParams.set("w", String(width));
  imageUrl.searchParams.set("auto", "format");

  return imageUrl.toString();
}

export function SanityImage({
  image,
  alt,
  className,
  fetchPriority,
  hotspotMode,
  loading,
  preload,
  sizes = "100vw",
}: SanityImageProps) {
  if (!image?.url) {
    return null;
  }

  const eagerLoading = preload ? undefined : loading;
  const imageFetchPriority = preload ? undefined : fetchPriority;
  const hotspotObjectPosition = getHotspotObjectPosition(image);
  const hotspotClassName =
    hotspotMode && hotspotObjectPosition
      ? hotspotMode === "mobile"
        ? "object-[var(--sanity-object-position)] md:object-center"
        : "object-[var(--sanity-object-position)]"
      : "";

  return (
    <Image
      src={getOptimizedSanityImageUrl(image)}
      alt={image.alt || alt}
      fill
      fetchPriority={imageFetchPriority}
      loading={eagerLoading}
      preload={preload}
      sizes={sizes}
      placeholder={image.lqip ? "blur" : "empty"}
      blurDataURL={image.lqip}
      style={
        hotspotObjectPosition
          ? ({ "--sanity-object-position": hotspotObjectPosition } as CSSProperties)
          : undefined
      }
      className={[className, hotspotClassName].filter(Boolean).join(" ")}
    />
  );
}
