import { defineField, defineType } from "sanity";

export const siteSettings = defineType({
  name: "siteSettings",
  title: "Site settings",
  type: "document",
  fields: [
    defineField({
      name: "logoText",
      title: "Logo text",
      type: "string",
      initialValue: "JULIETTEMAROUNEK",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "heroVideo",
      title: "Home hero video",
      type: "file",
      options: {
        accept: "video/mp4,video/webm",
      },
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "heroFallbackImage",
      title: "Home fallback image",
      type: "image",
      options: {
        hotspot: true,
      },
      fields: [
        defineField({
          name: "alt",
          title: "Alt text",
          type: "string",
        }),
      ],
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "contactEmail",
      title: "Contact email",
      type: "string",
      validation: (Rule) => Rule.email(),
    }),
    defineField({
      name: "socialLinks",
      title: "Social links",
      type: "array",
      of: [
        defineField({
          name: "socialLink",
          title: "Social link",
          type: "object",
          fields: [
            defineField({
              name: "label",
              title: "Label",
              type: "string",
              validation: (Rule) => Rule.required(),
            }),
            defineField({
              name: "url",
              title: "URL",
              type: "url",
              validation: (Rule) => Rule.required().uri({ scheme: ["http", "https"] }),
            }),
          ],
        }),
      ],
    }),
  ],
  preview: {
    prepare: () => ({ title: "Site settings" }),
  },
});
