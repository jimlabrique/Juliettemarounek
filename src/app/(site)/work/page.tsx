import Link from "next/link";
import { BrandLogo } from "@/components/BrandLogo";
import { SanityImage } from "@/components/SanityImage";
import { getProjects } from "@/sanity/data";
import type {
  ProjectSummary,
  SanityImage as SanityImageType,
} from "@/sanity/types";

export const revalidate = 60;

function getWorkThumbnails(project: ProjectSummary): SanityImageType[] {
  const primary = project.thumbnail ?? project.workStill ?? project.posterImage;
  const secondary = project.workStill ?? project.posterImage ?? primary;

  return [primary, secondary].filter(
    (image): image is SanityImageType => Boolean(image?.url),
  );
}

export default async function WorkPage() {
  const projects = await getProjects();

  return (
    <main className="brand-page overflow-hidden pb-32 pt-[145px] md:pt-[150px]">
      <BrandLogo className="mx-auto h-auto w-[92vw] max-w-none" />
      <div className="mt-20 grid gap-0 md:mt-24 md:grid-cols-2 md:[&>a:first-child>div]:rounded-tr-[18px] md:[&>a:nth-child(2)>div]:rounded-tl-[18px] lg:mt-[9.5vh]">
        {projects.map((project, projectIndex) =>
          getWorkThumbnails(project).map((image, index) => {
            const preloadImage = projectIndex === 0;

            return (
              <Link
                key={`${project._id}-${index}`}
                href={`/work/${project.slug}`}
                aria-label={`Open ${project.title}`}
                className="group block"
              >
                <div className="relative aspect-[4/3] overflow-hidden bg-zinc-950">
                  <SanityImage
                    image={image}
                    alt={`${project.title} thumbnail ${index + 1}`}
                    preload={preloadImage}
                    sizes="(min-width: 768px) 50vw, 100vw"
                    className="object-cover transition duration-500 group-hover:scale-[1.015]"
                  />
                </div>
                <span className="sr-only">{project.title}</span>
              </Link>
            );
          }),
        )}
      </div>
      {projects.length === 0 ? (
        <p className="font-menu mx-auto mt-24 max-w-sm px-5 text-center text-[18px] font-semibold uppercase leading-tight text-[var(--muted-cream)] md:text-[24px]">
          No work published yet.
        </p>
      ) : null}
    </main>
  );
}
