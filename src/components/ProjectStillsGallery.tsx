"use client";

import Image from "next/image";
import { useEffect, useState } from "react";
import {
  getOptimizedSanityImageUrl,
  SanityImage,
} from "@/components/SanityImage";
import type { SanityImage as SanityImageType } from "@/sanity/types";

type ProjectStillsGalleryProps = {
  projectTitle: string;
  stills?: SanityImageType[];
};

function getStillAlt(
  still: SanityImageType,
  projectTitle: string,
  index: number,
) {
  return still.alt || `${projectTitle} still ${index + 1}`;
}

export function ProjectStillsGallery({
  projectTitle,
  stills,
}: ProjectStillsGalleryProps) {
  const [activeIndex, setActiveIndex] = useState<number | null>(null);
  const activeStill = activeIndex === null ? undefined : stills?.[activeIndex];

  useEffect(() => {
    if (activeIndex === null || !stills?.length) {
      return;
    }

    const previousOverflow = document.body.style.overflow;
    const closeGallery = () => setActiveIndex(null);
    const showPreviousStill = () => {
      setActiveIndex((currentIndex) =>
        currentIndex === null
          ? null
          : (currentIndex - 1 + stills.length) % stills.length,
      );
    };
    const showNextStill = () => {
      setActiveIndex((currentIndex) =>
        currentIndex === null ? null : (currentIndex + 1) % stills.length,
      );
    };
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        closeGallery();
      }

      if (event.key === "ArrowLeft") {
        event.preventDefault();
        showPreviousStill();
      }

      if (event.key === "ArrowRight") {
        event.preventDefault();
        showNextStill();
      }
    };

    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", handleKeyDown);

    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [activeIndex, stills]);

  if (!stills?.length) {
    return null;
  }

  return (
    <>
      <section className="-mx-5 mt-20 grid grid-cols-2 gap-0 md:mx-[calc(-6.6vw)] md:mt-28">
        {stills.map((still, index) => (
          <button
            key={`${still.url}-${index}`}
            type="button"
            aria-label={`Open ${getStillAlt(still, projectTitle, index)}`}
            onClick={() => setActiveIndex(index)}
            className="group relative aspect-[4/3] w-full overflow-hidden bg-zinc-950"
          >
            <SanityImage
              image={still}
              alt={getStillAlt(still, projectTitle, index)}
              sizes="50vw"
              className="object-cover transition duration-500 ease-out group-hover:opacity-80"
            />
          </button>
        ))}
      </section>
      {activeStill?.url && activeIndex !== null ? (
        <div
          role="dialog"
          aria-modal="true"
          aria-label={`${projectTitle} still ${activeIndex + 1}`}
          onClick={() => setActiveIndex(null)}
          className="fixed inset-0 z-[80] flex cursor-zoom-out items-center justify-center bg-black/90 p-5 md:p-[6.6vw]"
        >
          <Image
            src={getOptimizedSanityImageUrl(activeStill.url)}
            alt={getStillAlt(activeStill, projectTitle, activeIndex)}
            width={activeStill.width ?? 1600}
            height={activeStill.height ?? 1200}
            sizes="100vw"
            placeholder={activeStill.lqip ? "blur" : "empty"}
            blurDataURL={activeStill.lqip}
            className="h-auto max-h-full w-auto max-w-full cursor-default object-contain"
            onClick={(event) => event.stopPropagation()}
          />
        </div>
      ) : null}
    </>
  );
}
