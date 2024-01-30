import { defineCliConfig } from "sanity/cli";
import { sanityConfig } from "./src/env";

export default defineCliConfig({
  api: {
    ...sanityConfig,
  },
});
