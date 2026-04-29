"use client";

import { useState } from "react";
import { VideoFrame } from "@/components/VideoFrame";
import type { ProjectVideo, SanityImage } from "@/sanity/types";

type ProjectVideoPlayerProps = {
  projectTitle: string;
  videos: ProjectVideo[];
  fallbackPoster?: SanityImage;
};

function getVideoTitle(video: ProjectVideo, index: number) {
  return video.title || `Video ${index + 1}`;
}

export function ProjectVideoPlayer({
  projectTitle,
  videos,
  fallbackPoster,
}: ProjectVideoPlayerProps) {
  const [activeIndex, setActiveIndex] = useState(0);
  const activeVideo = videos[activeIndex] ?? videos[0];

  if (!activeVideo) {
    return null;
  }

  const activeTitle = getVideoTitle(activeVideo, activeIndex);
  const activePoster = activeVideo.posterImage || fallbackPoster;

  return (
    <div className="grid gap-4">
      <VideoFrame
        key={`${activeVideo.video?.url}-${activeIndex}`}
        video={activeVideo.video}
        poster={activePoster}
        label={`${projectTitle} ${activeTitle}`}
        autoPlay
        className="aspect-video w-full overflow-hidden rounded-[18px]"
        controls
        mediaClassName="object-cover"
        priorityPoster
      />
      {videos.length > 1 ? (
        <div className="font-menu flex items-center gap-6 overflow-x-auto whitespace-nowrap text-[14px] font-semibold uppercase leading-none tracking-normal text-[var(--cream)] [scrollbar-width:none] md:text-[16px] [&::-webkit-scrollbar]:hidden">
          {videos.map((video, index) => {
            const title = getVideoTitle(video, index);
            const isActive = index === activeIndex;

            return (
              <button
                key={`${video.video?.url}-${index}`}
                type="button"
                aria-pressed={isActive}
                onClick={() => setActiveIndex(index)}
                className={`shrink-0 py-1 text-left transition-opacity hover:opacity-70 focus:outline-none focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--cream)] ${
                  isActive
                    ? "text-[var(--cream)]"
                    : "text-[var(--muted-cream)]"
                }`}
              >
                <span>{title}</span>
              </button>
            );
          })}
        </div>
      ) : activeVideo.title ? (
        <h2 className="font-menu text-[14px] font-semibold uppercase leading-none tracking-normal text-[var(--muted-cream)] md:text-[16px]">
          {activeVideo.title}
        </h2>
      ) : null}
    </div>
  );
}
