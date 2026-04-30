import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { ProjectStillsGallery } from "@/components/ProjectStillsGallery";
import { ProjectVideoPlayer } from "@/components/ProjectVideoPlayer";
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
  const projectDetails = [
    { label: "Role", value: project.role },
    { label: "Client", value: project.client },
    { label: "Year", value: project.year },
  ].filter((detail) => detail.value);

  return (
    <main className="brand-page max-w-full overflow-x-hidden px-5 pb-40 pt-[145px] md:overflow-x-visible md:px-[6.6vw] md:pt-[150px]">
      <h1 className="font-display static mb-10 text-[52px] uppercase leading-[0.95] tracking-normal text-[var(--cream)] md:text-[92px] lg:text-[120px]">
        {project.title}
      </h1>
      <section className="grid gap-5">
        <ProjectVideoPlayer
          projectTitle={project.title}
          videos={videos}
          fallbackPoster={project.posterImage || project.thumbnail}
        />
        <div className="font-menu flex min-w-0 flex-col gap-5 text-[12px] font-semibold uppercase leading-none tracking-normal text-[var(--cream)] md:flex-row md:items-start md:justify-between md:text-[16px]">
          {projectDetails.length > 0 ? (
            <dl className="grid min-w-0 max-w-full gap-2 whitespace-normal md:flex md:overflow-x-auto md:whitespace-nowrap md:gap-x-9 md:[scrollbar-width:none] md:[&::-webkit-scrollbar]:hidden">
              {projectDetails.map((detail) => (
                <div key={detail.label} className="flex min-w-0 flex-wrap gap-x-2 gap-y-1 md:mr-0 md:flex-nowrap md:shrink-0">
                  <dt className="shrink-0 text-[var(--muted-cream)]">{detail.label}</dt>
                  <dd className="min-w-0 break-words">{detail.value}</dd>
                </div>
              ))}
            </dl>
          ) : null}
          {project.fullFilmUrl ? (
            <Link
              href={project.fullFilmUrl}
              target="_blank"
              rel="noreferrer"
              className="inline-flex shrink-0 self-start border-b border-[var(--cream)] pb-1 transition-opacity hover:opacity-65"
            >
              Watch full film
            </Link>
          ) : null}
        </div>
      </section>
      {project.credits ? (
        <p className="font-editorial mt-16 whitespace-pre-line text-[24px] leading-[1.12] text-[var(--cream)] md:mt-24">
          {project.credits}
        </p>
      ) : null}
      <ProjectStillsGallery projectTitle={project.title} stills={project.stills} />
    </main>
  );
}
