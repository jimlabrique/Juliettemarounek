export type SanityImage = {
  alt?: string;
  url?: string;
  width?: number;
  height?: number;
  lqip?: string;
};

export type SanityFile = {
  url?: string;
  mimeType?: string;
};

export type ProjectVideo = {
  title?: string;
  video?: SanityFile;
  posterImage?: SanityImage;
};

export type SocialLink = {
  label: string;
  url: string;
};

export type SiteSettings = {
  logoText: string;
  heroVideo?: SanityFile;
  heroFallbackImage?: SanityImage;
  contactEmail?: string;
  socialLinks: SocialLink[];
};

export type ProjectSummary = {
  _id: string;
  title: string;
  slug: string;
  thumbnail?: SanityImage;
  workStill?: SanityImage;
  posterImage?: SanityImage;
  role?: string;
  client?: string;
  year?: string;
};

export type Project = ProjectSummary & {
  mainVideo?: SanityFile;
  videos?: ProjectVideo[];
  stills?: SanityImage[];
  credits?: string;
  fullFilmUrl?: string;
};

export type AboutPage = {
  bio: string;
  portrait?: SanityImage;
  contactEmail?: string;
};
