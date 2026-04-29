"use client";

import { useState } from "react";
import { SanityImage } from "@/components/SanityImage";
import type { SanityFile, SanityImage as SanityImageType } from "@/sanity/types";

type VideoFrameProps = {
  video?: SanityFile;
  poster?: SanityImageType;
  label: string;
  autoPlay?: boolean;
  controls?: boolean;
  loop?: boolean;
  className?: string;
  mediaClassName?: string;
  priorityPoster?: boolean;
};

export function VideoFrame({
  video,
  poster,
  label,
  autoPlay = true,
  controls = false,
  loop = true,
  className = "",
  mediaClassName = "object-cover",
  priorityPoster = false,
}: VideoFrameProps) {
  const [isReady, setIsReady] = useState(false);
  const showVideo = !autoPlay || isReady;

  return (
    <div className={`relative overflow-hidden bg-black ${className}`}>
      {poster?.url ? (
        <SanityImage
          image={poster}
          alt={label}
          preload={priorityPoster}
          className={`object-cover ${mediaClassName}`}
        />
      ) : null}
      {video?.url ? (
        <video
          aria-label={label}
          autoPlay={autoPlay}
          muted
          loop={loop}
          playsInline
          controls={controls}
          poster={poster?.url}
          preload={autoPlay ? "auto" : "metadata"}
          onCanPlay={() => setIsReady(true)}
          className={`absolute inset-0 h-full w-full transition-opacity duration-500 ${mediaClassName} ${
            showVideo ? "opacity-100" : "opacity-0"
          }`}
        >
          <source src={video.url} type={video.mimeType || "video/mp4"} />
        </video>
      ) : null}
    </div>
  );
}
