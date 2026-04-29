import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { ProjectVideoPlayer } from "@/components/ProjectVideoPlayer";
import { SanityImage } from "@/components/SanityImage";
import { getProject, getProjectSlugs } from "@/sanity/data";
import type { Project, ProjectVideo } from "@/sanity/types";

type ProjectPageProps = {
  params: Promise<{ slug: string }>;
};

export const revalidate = 60;

export async function generateStaticParams() {
  return getProjectSlugs();
}

export async function generateMetadata({
  params,
}: ProjectPageProps): Promise<Metadata> {
  const { slug } = await params;
  const project = await getProject(slug);

  if (!project) {
    return {};
  }

  const image = project.thumbnail?.url || project.posterImage?.url;

  return {
    openGraph: {
      title: `${project.title} | JULIETTEMAROUNEK`,
      images: image ? [{ url: image }] : undefined,
    },
  };
}

function getProjectVideos(project: Project): ProjectVideo[] {
  const videos = project.videos?.filter((item) => item.video?.url) ?? [];

  if (videos.length > 0) {
    return videos;
  }

  if (!project.mainVideo?.url) {
    return [];
  }

  return [
    {
      video: project.mainVideo,
      posterImage: project.posterImage || project.thumbnail,
    },
  ];
}

export default async function ProjectPage({ params }: ProjectPageProps) {
  const { slug } = await params;
  const project = await getProject(slug);

  if (!project) {
    notFound();
  }

  const videos = getProjectVideos(project);

  return (
    <main className="brand-page px-5 pb-40 pt-[145px] md:px-[6.6vw] md:pt-[150px]">
      <h1 className="font-display static mb-10 text-[52px] uppercase leading-[0.95] tracking-normal text-[var(--cream)] md:text-[92px] lg:text-[120px]">
        {project.title}
      </h1>
      <section className="grid gap-7 lg:grid-cols-[minmax(0,1fr)_360px] lg:gap-[3vw]">
        <div>
          <ProjectVideoPlayer
            projectTitle={project.title}
            videos={videos}
            fallbackPoster={project.posterImage || project.thumbnail}
          />
        </div>
        <aside className="flex flex-col self-start lg:min-h-[calc((83.8vw-360px)*9/16)]">
          <dl className="font-menu grid gap-5 text-[16px] font-semibold uppercase leading-tight tracking-normal text-[var(--cream)] md:text-[22px]">
            <div>
              <dt className="text-[var(--muted-cream)]">Role</dt>
              <dd>{project.role}</dd>
            </div>
            <div>
              <dt className="text-[var(--muted-cream)]">Client</dt>
              <dd>{project.client}</dd>
            </div>
            <div>
              <dt className="text-[var(--muted-cream)]">Year</dt>
              <dd>{project.year}</dd>
            </div>
          </dl>
          {project.fullFilmUrl ? (
            <Link
              href={project.fullFilmUrl}
              target="_blank"
              rel="noreferrer"
              className="font-menu mt-8 inline-flex self-start border-b border-[var(--cream)] pb-1 text-[16px] font-semibold uppercase leading-none tracking-normal transition-opacity hover:opacity-65 md:text-[20px] lg:mb-[42px] lg:mt-auto"
            >
              Watch full film
            </Link>
          ) : null}
        </aside>
      </section>
      {project.credits ? (
        <p className="font-editorial mt-10 whitespace-pre-line text-[24px] leading-[1.12] text-[var(--cream)]">
          {project.credits}
        </p>
      ) : null}
      {project.stills?.length ? (
        <section className="mt-10 grid gap-5 sm:grid-cols-2">
          {project.stills.map((still, index) => (
            <div
              key={`${still.url}-${index}`}
              className="relative aspect-[4/3] overflow-hidden rounded-[18px] bg-zinc-950"
            >
              <SanityImage
                image={still}
                alt={`${project.title} still ${index + 1}`}
                sizes="(min-width: 640px) 50vw, 100vw"
                className="object-cover"
              />
            </div>
          ))}
        </section>
      ) : null}
    </main>
  );
}
