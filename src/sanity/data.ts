import { cache } from "react";
import { client } from "./client";
import { hasSanityConfig } from "./env";
import {
  aboutPageQuery,
  projectBySlugQuery,
  projectSlugsQuery,
  siteSettingsQuery,
  workProjectsQuery,
} from "./queries";
import type { AboutPage, Project, ProjectSummary, SiteSettings } from "./types";

const fallbackSettings: SiteSettings = {
  logoText: "JULIETTEMAROUNEK",
  socialLinks: [],
};

const fallbackAbout: AboutPage = {
  bio: "Director / Art Director.",
};

const sanityFetchOptions = {
  next: { revalidate: 60 },
};

async function fetchSanity<T>(
  query: string,
  params: Record<string, string> = {},
): Promise<T | null> {
  if (!hasSanityConfig) {
    return null;
  }

  return client.fetch<T>(query, params, sanityFetchOptions);
}

export const getSiteSettings = cache(async (): Promise<SiteSettings> => {
  const settings = await fetchSanity<Partial<SiteSettings>>(siteSettingsQuery);

  return {
    ...fallbackSettings,
    ...settings,
    socialLinks: settings?.socialLinks ?? [],
  };
});

export const getProjects = cache(async (): Promise<ProjectSummary[]> => {
  return (await fetchSanity<ProjectSummary[]>(workProjectsQuery)) ?? [];
});

export const getProjectSlugs = cache(async (): Promise<{ slug: string }[]> => {
  return (await fetchSanity<{ slug: string }[]>(projectSlugsQuery)) ?? [];
});

export const getProject = cache(async (slug: string): Promise<Project | null> => {
  return fetchSanity<Project>(projectBySlugQuery, { slug });
});

export const getAboutPage = cache(async (): Promise<AboutPage> => {
  const about = await fetchSanity<AboutPage>(aboutPageQuery);

  return {
    ...fallbackAbout,
    ...about,
  };
});
