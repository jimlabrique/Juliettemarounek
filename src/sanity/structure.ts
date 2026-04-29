import type { StructureResolver } from "sanity/structure";

export const structure: StructureResolver = (S) =>
  S.list()
    .title("Content")
    .items([
      S.listItem()
        .title("Site settings")
        .child(
          S.document()
            .schemaType("siteSettings")
            .documentId("siteSettings")
            .title("Site settings"),
        ),
      S.listItem()
        .title("About page")
        .child(
          S.document()
            .schemaType("aboutPage")
            .documentId("aboutPage")
            .title("About page"),
        ),
      S.divider(),
      S.documentTypeListItem("project").title("Projects"),
    ]);
