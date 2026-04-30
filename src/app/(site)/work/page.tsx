import Link from "next/link";
import { SanityImage } from "@/components/SanityImage";
import { getProjects } from "@/sanity/data";
import type {
  ProjectSummary,
  SanityImage as SanityImageType,
} from "@/sanity/types";

export const revalidate = 60;

function getWorkThumbnail(project: ProjectSummary): SanityImageType | undefined {
  return project.thumbnail ?? project.workStill ?? project.posterImage;
}

function getWorkTitleParts(project: ProjectSummary) {
  const parentheticalParts = Array.from(
    project.title.matchAll(/\(([^()]+)\)/g),
    (match) => match[1].trim(),
  ).filter(Boolean);
  const title =
    project.title
      .replace(/\s*\([^()]*\)/g, "")
      .replace(/\s{2,}/g, " ")
      .trim() || project.title;
  const subtitle = [project.year, ...parentheticalParts]
    .filter(Boolean)
    .join(" / ");

  return { title, subtitle };
}

export default async function WorkPage() {
  const projects = await getProjects();
  const projectsWithImages = projects
    .map((project) => ({ project, image: getWorkThumbnail(project) }))
    .filter(
      (item): item is { project: ProjectSummary; image: SanityImageType } =>
        Boolean(item.image?.url),
    );

  return (
    <main className="brand-page relative h-dvh snap-y snap-mandatory overflow-y-auto overflow-x-hidden">
      <div>
        {projectsWithImages.map(({ project, image }, projectIndex) => {
          const preloadImage = projectIndex === 0;
          const titleParts = getWorkTitleParts(project);

          return (
            <Link
              key={project._id}
              href={`/work/${project.slug}`}
              aria-label={`Open ${project.title}`}
              className="group relative block h-dvh min-h-[560px] snap-start overflow-hidden bg-zinc-950"
            >
              <SanityImage
                image={image}
                alt={`${project.title} thumbnail`}
                preload={preloadImage}
                sizes="100vw"
                className="object-cover transition duration-700 ease-out group-hover:scale-[1.015] group-hover:opacity-70 group-focus-visible:scale-[1.015] group-focus-visible:opacity-70"
              />
              <span className="pointer-events-none absolute inset-x-5 top-1/2 z-10 flex -translate-y-1/2 flex-col items-center text-center text-[var(--cream)] opacity-0 transition-opacity duration-300 ease-out group-hover:opacity-100 group-focus-visible:opacity-100 md:inset-x-[6.6vw]">
                <span className="font-display text-[18px] font-medium uppercase leading-none md:text-[28px] lg:text-[36px]">
                  {titleParts.title}
                </span>
                {titleParts.subtitle ? (
                  <span className="font-menu mt-2 text-[11px] font-medium uppercase leading-none md:mt-3 md:text-[13px] lg:text-[15px]">
                    {titleParts.subtitle}
                  </span>
                ) : null}
              </span>
            </Link>
          );
        })}
      </div>
      {projectsWithImages.length === 0 ? (
        <p className="font-menu mx-auto flex h-dvh max-w-sm items-center justify-center px-5 text-center text-[18px] font-semibold uppercase leading-tight text-[var(--muted-cream)] md:text-[24px]">
          No work published yet.
        </p>
      ) : null}
    </main>
  );
}
