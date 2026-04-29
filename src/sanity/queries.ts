const imageFields = `
  alt,
  "url": asset->url,
  "width": asset->metadata.dimensions.width,
  "height": asset->metadata.dimensions.height,
  "lqip": asset->metadata.lqip
`;

const fileFields = `
  "url": asset->url,
  "mimeType": asset->mimeType
`;

export const siteSettingsQuery = `
  *[_type == "siteSettings"][0]{
    logoText,
    heroVideo{${fileFields}},
    heroFallbackImage{${imageFields}},
    contactEmail,
    socialLinks[]{label, url}
  }
`;

export const workProjectsQuery = `
  *[_type == "project" && published == true]
  | order(coalesce(manualOrder, 9999) asc, year desc, title asc){
    _id,
    title,
    "slug": slug.current,
    thumbnail{${imageFields}},
    "workStill": stills[0]{${imageFields}},
    posterImage{${imageFields}},
    role,
    client,
    year
  }
`;

export const projectSlugsQuery = `
  *[_type == "project" && published == true && defined(slug.current)][]{
    "slug": slug.current
  }
`;

export const projectBySlugQuery = `
  *[_type == "project" && published == true && slug.current == $slug][0]{
    _id,
    title,
    "slug": slug.current,
    thumbnail{${imageFields}},
    mainVideo{${fileFields}},
    videos[]{
      title,
      video{${fileFields}},
      posterImage{${imageFields}}
    },
    posterImage{${imageFields}},
    stills[]{${imageFields}},
    role,
    client,
    year,
    credits,
    fullFilmUrl
  }
`;

export const aboutPageQuery = `
  *[_type == "aboutPage"][0]{
    bio,
    portrait{${imageFields}},
    contactEmail
  }
`;
