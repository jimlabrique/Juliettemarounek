"use client";

import Image from "next/image";
import { useCallback, useEffect, useRef, useState } from "react";
import type { PointerEvent, TouchEvent as ReactTouchEvent } from "react";
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
  const galleryRef = useRef<HTMLElement | null>(null);
  const stillTouchStartRef = useRef<{ x: number; y: number; index: number } | null>(
    null,
  );
  const dialogTouchStartRef = useRef<{ x: number; y: number } | null>(null);
  const swipeStartRef = useRef<{ x: number; y: number } | null>(null);
  const ignoreNextClickRef = useRef(false);
  const ignoreNextClickTimeoutRef = useRef<number | undefined>(undefined);
  const stillsCount = stills?.length ?? 0;
  const activeStill = activeIndex === null ? undefined : stills?.[activeIndex];

  const isMobileViewport = () =>
    typeof window !== "undefined" &&
    window.matchMedia("(max-width: 767px)").matches;

  const openStill = useCallback((index: number) => {
    setActiveIndex(index);
  }, []);

  const ignoreNextDialogClickBriefly = useCallback(() => {
    ignoreNextClickRef.current = true;

    if (ignoreNextClickTimeoutRef.current !== undefined) {
      window.clearTimeout(ignoreNextClickTimeoutRef.current);
    }

    ignoreNextClickTimeoutRef.current = window.setTimeout(() => {
      ignoreNextClickRef.current = false;
      ignoreNextClickTimeoutRef.current = undefined;
    }, 450);
  }, []);

  useEffect(() => {
    return () => {
      if (ignoreNextClickTimeoutRef.current !== undefined) {
        window.clearTimeout(ignoreNextClickTimeoutRef.current);
      }
    };
  }, []);

  useEffect(() => {
    const gallery = galleryRef.current;

    if (!gallery) {
      return;
    }

    const getStillTile = (target: EventTarget | null) => {
      if (!(target instanceof Element)) {
        return null;
      }

      return target.closest<HTMLElement>("[data-still-index]");
    };
    const getStillIndex = (tile: HTMLElement | null) => {
      if (!tile?.dataset.stillIndex) {
        return null;
      }

      const index = Number(tile.dataset.stillIndex);

      return Number.isInteger(index) ? index : null;
    };
    const handleTouchStart = (event: TouchEvent) => {
      if (!isMobileViewport()) {
        return;
      }

      const index = getStillIndex(getStillTile(event.target));
      const touch = event.touches[0];

      if (index === null || !touch) {
        return;
      }

      stillTouchStartRef.current = {
        x: touch.clientX,
        y: touch.clientY,
        index,
      };
    };
    const handleTouchEnd = (event: TouchEvent) => {
      if (!isMobileViewport()) {
        return;
      }

      const index = getStillIndex(getStillTile(event.target));
      const start = stillTouchStartRef.current;
      const touch = event.changedTouches[0];
      stillTouchStartRef.current = null;

      if (index === null || !start || start.index !== index || !touch) {
        return;
      }

      const deltaX = Math.abs(touch.clientX - start.x);
      const deltaY = Math.abs(touch.clientY - start.y);

      if (deltaX > 22 || deltaY > 22) {
        return;
      }

      event.preventDefault();
      event.stopPropagation();
      ignoreNextDialogClickBriefly();
      openStill(index);
    };
    const handleTouchCancel = () => {
      stillTouchStartRef.current = null;
    };
    const handleClick = (event: MouseEvent) => {
      if (!isMobileViewport()) {
        return;
      }

      const index = getStillIndex(getStillTile(event.target));

      if (index === null) {
        return;
      }

      event.preventDefault();
      event.stopPropagation();
      ignoreNextDialogClickBriefly();
      openStill(index);
    };

    gallery.addEventListener("touchstart", handleTouchStart, {
      passive: true,
    });
    gallery.addEventListener("touchend", handleTouchEnd, {
      passive: false,
    });
    gallery.addEventListener("touchcancel", handleTouchCancel);
    gallery.addEventListener("click", handleClick);

    return () => {
      gallery.removeEventListener("touchstart", handleTouchStart);
      gallery.removeEventListener("touchend", handleTouchEnd);
      gallery.removeEventListener("touchcancel", handleTouchCancel);
      gallery.removeEventListener("click", handleClick);
    };
  }, [ignoreNextDialogClickBriefly, openStill]);

  const showPreviousStill = useCallback(() => {
    if (!stillsCount) {
      return;
    }

    setActiveIndex((currentIndex) =>
      currentIndex === null
        ? null
        : (currentIndex - 1 + stillsCount) % stillsCount,
    );
  }, [stillsCount]);

  const showNextStill = useCallback(() => {
    if (!stillsCount) {
      return;
    }

    setActiveIndex((currentIndex) =>
      currentIndex === null ? null : (currentIndex + 1) % stillsCount,
    );
  }, [stillsCount]);

  useEffect(() => {
    if (activeIndex === null || !stills?.length) {
      return;
    }

    const previousOverflow = document.body.style.overflow;
    const closeGallery = () => setActiveIndex(null);
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
  }, [activeIndex, showNextStill, showPreviousStill, stills]);

  const handleDialogClick = () => {
    if (ignoreNextClickRef.current) {
      ignoreNextClickRef.current = false;
      if (ignoreNextClickTimeoutRef.current !== undefined) {
        window.clearTimeout(ignoreNextClickTimeoutRef.current);
        ignoreNextClickTimeoutRef.current = undefined;
      }
      return;
    }

    setActiveIndex(null);
  };

  const handlePointerDown = (event: PointerEvent<HTMLDivElement>) => {
    if (!event.isPrimary) {
      return;
    }

    swipeStartRef.current = { x: event.clientX, y: event.clientY };
  };

  const handlePointerCancel = () => {
    swipeStartRef.current = null;
  };

  const handlePointerUp = (event: PointerEvent<HTMLDivElement>) => {
    const start = swipeStartRef.current;
    swipeStartRef.current = null;

    if (!start) {
      return;
    }

    const deltaX = event.clientX - start.x;
    const deltaY = event.clientY - start.y;
    const isHorizontalSwipe =
      Math.abs(deltaX) > 48 && Math.abs(deltaX) > Math.abs(deltaY) * 1.25;

    if (!isHorizontalSwipe) {
      return;
    }

    event.preventDefault();
    event.stopPropagation();
    ignoreNextDialogClickBriefly();

    if (deltaX < 0) {
      showNextStill();
    } else {
      showPreviousStill();
    }
  };

  const handleDialogTouchStart = (event: ReactTouchEvent<HTMLDivElement>) => {
    if (!isMobileViewport()) {
      return;
    }

    const touch = event.touches[0];

    if (!touch) {
      return;
    }

    dialogTouchStartRef.current = { x: touch.clientX, y: touch.clientY };
  };

  const handleDialogTouchEnd = (event: ReactTouchEvent<HTMLDivElement>) => {
    if (!isMobileViewport()) {
      return;
    }

    const start = dialogTouchStartRef.current;
    const touch = event.changedTouches[0];
    dialogTouchStartRef.current = null;

    if (!start || !touch) {
      return;
    }

    const deltaX = touch.clientX - start.x;
    const deltaY = touch.clientY - start.y;
    const isHorizontalSwipe =
      Math.abs(deltaX) > 48 && Math.abs(deltaX) > Math.abs(deltaY) * 1.25;

    if (!isHorizontalSwipe) {
      return;
    }

    event.preventDefault();
    event.stopPropagation();
    ignoreNextDialogClickBriefly();

    if (deltaX < 0) {
      showNextStill();
    } else {
      showPreviousStill();
    }
  };

  const handleDialogTouchCancel = () => {
    dialogTouchStartRef.current = null;
  };

  if (!stills?.length) {
    return null;
  }

  return (
    <>
      <section
        ref={galleryRef}
        className="-mx-5 mt-20 grid grid-cols-2 gap-0 md:mx-[calc(-6.6vw)] md:mt-28"
      >
        {stills.map((still, index) => (
          <button
            key={`${still.url}-${index}`}
            type="button"
            data-still-index={index}
            aria-label={`Open ${getStillAlt(still, projectTitle, index)}`}
            onClick={() => {
              if (!isMobileViewport()) {
                openStill(index);
              }
            }}
            className="group relative aspect-[4/3] w-full cursor-zoom-in touch-manipulation overflow-hidden bg-zinc-950"
          >
            <SanityImage
              image={still}
              alt={getStillAlt(still, projectTitle, index)}
              sizes="50vw"
              className="pointer-events-none object-cover transition duration-500 ease-out group-hover:opacity-80"
            />
          </button>
        ))}
      </section>
      {activeStill?.url && activeIndex !== null ? (
        <div
          role="dialog"
          aria-modal="true"
          aria-label={`${projectTitle} still ${activeIndex + 1}`}
          onClick={handleDialogClick}
          onPointerDown={handlePointerDown}
          onPointerCancel={handlePointerCancel}
          onPointerUp={handlePointerUp}
          onTouchStart={handleDialogTouchStart}
          onTouchEnd={handleDialogTouchEnd}
          onTouchCancel={handleDialogTouchCancel}
          className="fixed inset-0 z-[80] flex cursor-zoom-out touch-pan-y items-center justify-center bg-black/90 p-5 md:p-[6.6vw]"
        >
          <Image
            src={getOptimizedSanityImageUrl(activeStill)}
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
