import { visionTool } from "@sanity/vision";
import { defineConfig } from "sanity";
import { structureTool } from "sanity/structure";
import { schemaTypes } from "./schemas";
import { sanityConfig } from "./src/env";

export default defineConfig({
  name: "default",
  title: "hello-sanity",

  ...sanityConfig,

  plugins: [structureTool(), visionTool()],

  schema: {
    types: schemaTypes,
  },
});
