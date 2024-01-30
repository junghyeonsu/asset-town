const sanityProjectId = process.env.SANITY_STUDIO_PROJECT_ID;
const sanityDataset = process.env.SANITY_STUDIO_DATASET;

if (!sanityProjectId) {
  throw new Error("Missing SANITY_STUDIO_PROJECT_ID environment variable");
}

if (!sanityDataset) {
  throw new Error("Missing SANITY_STUDIO_DATASET environment variable");
}

export const sanityConfig = {
  projectId: sanityProjectId,
  dataset: sanityDataset,
};
