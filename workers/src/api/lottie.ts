import type { SanityRequest } from "@asset-town/types";

const SANITY_USER_AGENT = "Sanity.io webhook delivery";

/**
 * NOTE: sanity cdn url format:
 * https://cdn.sanity.io/files/<projectId>/<dataset>/<assetId>.<extension>
 * @example https://cdn.sanity.io/files/abc123/production/1234567890.json
 *
 * NOTE: r2 cdn url format:
 * https://<cdnDomain>/<dataset>/<documentType>/<documentId>/<assetId>.<extension>
 * @example https://cdn.yourdomain.com/development/lottie/1234567890/123456.json
 * @example https://cdn.yourdomain.com/production/lottie/1234567890/123211.svg
 * @example https://cdn.yourdomain.com/production/lottie/1234567890/122131.gif
 */
export const putLottieFromBucket = async (request: Request, env: Env): Promise<Response> => {
  if (request.headers.get("user-agent") !== SANITY_USER_AGENT) {
    return new Response(JSON.stringify({ message: "Unauthorized" }), {
      headers: {
        "Content-Type": "application/json",
        "Access-Control-Allow-Origin": "*",
      },
      status: 401,
    });
  }

  const asset = await request.json<SanityRequest>();
  console.log("asset", asset);

  const dataset = request.headers.get("sanity-dataset");

  if (asset.lottie) {
    const lottie = await fetch(asset.lottie.url, {
      headers: {
        "Content-Type": "application/json",
      },
    }).then((response) => response.json());
    const lottiePath = `${dataset}/${asset._type}/${asset._id}/${asset.lottie.assetId}.${asset.lottie.extension}`;

    console.log("lottiePath", lottiePath);

    try {
      await env.ASSET_TOWN_CDN_BUCKET.put(lottiePath, JSON.stringify(lottie), {
        httpMetadata: {
          contentType: asset.lottie.mimeType,
        },
        customMetadata: {
          ...asset.lottie,
        },
      });
    } catch {
      return new Response(JSON.stringify({ message: "Lottie Put Failed!!!" }), {
        headers: {
          "Content-Type": "application/json",
          "Access-Control-Allow-Origin": "*",
        },
        status: 500,
      });
    }
  }

  if (asset.svg) {
    const svg = await fetch(asset.svg.url, {
      headers: {
        "Content-Type": "image/svg+xml",
      },
    }).then((response) => response.text());
    const svgPath = `${dataset}/${asset._type}/${asset._id}/${asset.svg.assetId}.${asset.svg.extension}`;

    console.log("svgPath", svgPath);

    try {
      await env.ASSET_TOWN_CDN_BUCKET.put(svgPath, svg, {
        httpMetadata: {
          contentType: asset.svg.mimeType,
        },
        customMetadata: {
          ...asset.svg,
        },
      });
    } catch {
      return new Response(JSON.stringify({ message: "SVG Put Failed!!!" }), {
        headers: {
          "Content-Type": "application/json",
          "Access-Control-Allow-Origin": "*",
        },
        status: 500,
      });
    }
  }

  if (asset.gif) {
    const gif = await fetch(asset.gif.url, {
      headers: {
        "Content-Type": "image/gif",
      },
    }).then((response) => response.blob());
    const gifPath = `${dataset}/${asset._type}/${asset._id}/${asset.gif.assetId}.${asset.gif.extension}`;

    console.log("gifPath", gifPath);

    try {
      await env.ASSET_TOWN_CDN_BUCKET.put(gifPath, gif, {
        httpMetadata: {
          contentType: asset.gif.mimeType,
        },
        customMetadata: {
          ...asset.gif,
        },
      });
    } catch {
      return new Response(JSON.stringify({ message: "GIF Put Failed!!!" }), {
        headers: {
          "Content-Type": "application/json",
          "Access-Control-Allow-Origin": "*",
        },
        status: 500,
      });
    }
  }

  return new Response(JSON.stringify({ message: "Put Success!!!" }), {
    headers: {
      "Content-Type": "application/json",
      "Access-Control-Allow-Origin": "*",
    },
    status: 200,
  });
};

export const deleteLottieFromBucket = async (request: Request, env: Env): Promise<Response> => {
  if (request.headers.get("user-agent") !== SANITY_USER_AGENT) {
    return new Response(JSON.stringify({ message: "Unauthorized" }), {
      headers: {
        "Content-Type": "application/json",
        "Access-Control-Allow-Origin": "*",
      },
      status: 401,
    });
  }

  const asset = await request.json<SanityRequest>();
  console.log("asset", asset);

  const dataset = request.headers.get("sanity-dataset");

  if (asset.lottie) {
    try {
      const lottiePath = `${dataset}/${asset._type}/${asset._id}/${asset.lottie.assetId}.${asset.lottie.extension}`;
      console.log("lottiePath", lottiePath);

      await env.ASSET_TOWN_CDN_BUCKET.delete(lottiePath);
    } catch {
      return new Response(JSON.stringify({ message: "Lottie Delete Failed!!!" }), {
        headers: {
          "Content-Type": "application/json",
          "Access-Control-Allow-Origin": "*",
        },
        status: 500,
      });
    }
  }

  if (asset.svg) {
    try {
      const svgPath = `${dataset}/${asset._type}/${asset._id}/${asset.svg.assetId}.${asset.svg.extension}`;
      console.log("svgPath", svgPath);

      await env.ASSET_TOWN_CDN_BUCKET.delete(svgPath);
    } catch {
      return new Response(JSON.stringify({ message: "SVG Delete Failed!!!" }), {
        headers: {
          "Content-Type": "application/json",
          "Access-Control-Allow-Origin": "*",
        },
        status: 500,
      });
    }
  }

  if (asset.gif) {
    try {
      const gifPath = `${dataset}/${asset._type}/${asset._id}/${asset.gif.assetId}.${asset.gif.extension}`;
      console.log("gifPath", gifPath);

      await env.ASSET_TOWN_CDN_BUCKET.delete(gifPath);
    } catch {
      return new Response(JSON.stringify({ message: "GIF Delete Failed!!!" }), {
        headers: {
          "Content-Type": "application/json",
          "Access-Control-Allow-Origin": "*",
        },
        status: 500,
      });
    }
  }

  return new Response(JSON.stringify({ message: "Delete Success!!!" }), {
    headers: {
      "Content-Type": "application/json",
      "Access-Control-Allow-Origin": "*",
    },
    status: 200,
  });
};
