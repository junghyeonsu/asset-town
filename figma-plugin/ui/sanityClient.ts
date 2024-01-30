import { createClient } from "@sanity/client";

export const client = createClient({
  projectId: import.meta.env.VITE_SANITY_STUDIO_PROJECT_ID,
  dataset: import.meta.env.VITE_SANITY_STUDIO_DATASET,
  useCdn: true, // set to `false` to bypass the edge cache
  apiVersion: "2024-01-30", // use current date (YYYY-MM-DD) to target the latest API version
});
