import { Router } from "itty-router";

import { handleOptions } from "./helper";
import { deleteLottieFromBucket, putLottieFromBucket } from "./api/lottie";

const router = Router();

router.put("/api/v1/lottie", putLottieFromBucket);
router.delete("/api/v1/lottie", deleteLottieFromBucket);

router.options("*", handleOptions);

export default {
  fetch: (request: Request, ...extra: unknown[]) => {
    if (request.method === "OPTIONS") {
      return handleOptions(request);
    }

    return router
      .handle(request, ...extra)
      .then((response: Response) => {
        response.headers.set("Access-Control-Allow-Origin", "*");
        return response;
      })
      .catch((error: unknown) => {
        console.error("error: ", error);
        return new Response(JSON.stringify({ error: "Internal Server Error" }), {
          headers: {
            "Content-Type": "application/json",
            "Access-Control-Allow-Origin": "*",
          },
          status: 500,
        });
      });
  },
};
