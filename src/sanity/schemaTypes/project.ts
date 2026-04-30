import { defineField, defineType } from "sanity";

const imageField = [
  defineField({
    name: "alt",
    title: "Alt text",
    type: "string",
  }),
];

export const project = defineType({
  name: "project",
  title: "Project",
  type: "document",
  fields: [
    defineField({
      name: "title",
      title: "Title",
      type: "string",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "slug",
      title: "Slug",
      type: "slug",
      options: {
        source: "title",
        maxLength: 96,
      },
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "manualOrder",
      title: "Manual order",
      type: "number",
      description: "Lower numbers appear first on the Work page.",
      initialValue: 100,
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "published",
      title: "Published",
      type: "boolean",
      initialValue: true,
    }),
    defineField({
      name: "thumbnail",
      title: "Thumbnail",
      type: "image",
      description: "Use the hotspot to choose what stays visible on mobile project covers.",
      options: {
        hotspot: true,
      },
      fields: imageField,
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "mainVideo",
      title: "Main video (legacy fallback)",
      type: "file",
      options: {
        accept: "video/mp4,video/webm",
      },
      description: "Used when the Videos field below is empty.",
    }),
    defineField({
      name: "videos",
      title: "Videos",
      type: "array",
      of: [
        defineField({
          name: "videoItem",
          title: "Video",
          type: "object",
          fields: [
            defineField({
              name: "title",
              title: "Title",
              type: "string",
            }),
            defineField({
              name: "video",
              title: "Video file",
              type: "file",
              options: {
                accept: "video/mp4,video/webm",
              },
              validation: (Rule) => Rule.required(),
            }),
            defineField({
              name: "posterImage",
              title: "Poster image",
              type: "image",
              options: {
                hotspot: true,
              },
              fields: imageField,
            }),
          ],
          preview: {
            select: {
              title: "title",
              media: "posterImage",
            },
            prepare({ title }) {
              return {
                title: title || "Untitled video",
              };
            },
          },
        }),
      ],
      validation: (Rule) =>
        Rule.custom((videos, context) => {
          const document = context.document as { mainVideo?: unknown };

          if (document.mainVideo || (Array.isArray(videos) && videos.length > 0)) {
            return true;
          }

          return "Add at least one video.";
        }),
    }),
    defineField({
      name: "posterImage",
      title: "Video poster / fallback image",
      type: "image",
      options: {
        hotspot: true,
      },
      fields: imageField,
    }),
    defineField({
      name: "stills",
      title: "Stills",
      type: "array",
      of: [
        {
          type: "image",
          options: {
            hotspot: true,
          },
          fields: imageField,
        },
      ],
    }),
    defineField({
      name: "role",
      title: "Role",
      type: "string",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "client",
      title: "Client",
      type: "string",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "year",
      title: "Year",
      type: "string",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "credits",
      title: "Short credits",
      type: "text",
      rows: 3,
    }),
    defineField({
      name: "fullFilmUrl",
      title: "Watch full film URL",
      type: "url",
      validation: (Rule) => Rule.uri({ scheme: ["http", "https"] }),
    }),
  ],
  orderings: [
    {
      title: "Manual order",
      name: "manualOrderAsc",
      by: [{ field: "manualOrder", direction: "asc" }],
    },
  ],
  preview: {
    select: {
      title: "title",
      subtitle: "client",
      media: "thumbnail",
    },
  },
});
