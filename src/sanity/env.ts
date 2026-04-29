export const apiVersion = "2026-04-27";
export const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET || "production";
export const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID || "";
export const studioProjectId = projectId || "placeholder";
export const hasSanityConfig = Boolean(projectId && dataset);
