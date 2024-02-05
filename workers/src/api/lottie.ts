/**
 * NOTE: sanity cdn url format:
 * https://cdn.sanity.io/files/<projectId>/<dataset>/<assetId>.<extension>
 * @example https://cdn.sanity.io/files/abc123/production/1234567890.json
 *
 * NOTE: r2 cdn url format:
 * https://<cdnDomain>/<_type>/<documentId>/<assetId>.<extension>
 * @example https://cdn.yourdomain.com/lottie/1234567890/123456.json
 * @example https://cdn.yourdomain.com/lottie/1234567890/123211.svg
 * @example https://cdn.yourdomain.com/lottie/1234567890/122131.gif
 */

interface SanityAsset {
  url: string;
  originalFilename: string;
  uploadId: string;
  assetId: string;
  extension: string;
  mimeType: string;
  path: string;
  _id: string;
  _type: string;
  _createdAt: string;
  _updatedAt: string;
}

interface SanityRequest {
  _id: string;
  _type: string;
  title: string;
  description: string;
  lottie: SanityAsset;
  svg: SanityAsset;
  gif: SanityAsset;
}

export const putLottieFromBucket = async (request: Request, env: Env): Promise<Response> => {
  const asset = await request.json<SanityRequest>();

  try {
    if (asset.lottie) {
      const lottie = await fetch(asset.lottie.url).then((response) => response.json());
      const lottiePath = `${asset._type}/${asset._id}/${asset.lottie._id}.${asset.lottie.extension}`;

      await env.ASSET_TOWN_CDN_BUCKET.put(lottiePath, JSON.stringify(lottie), {
        customMetadata: {
          ...asset.lottie,
        },
      });
    }

    if (asset.svg) {
      const svg = await fetch(asset.svg.url).then((response) => response.text());
      const svgPath = `${asset._type}/${asset._id}/${asset.svg._id}.${asset.svg.extension}`;

      await env.ASSET_TOWN_CDN_BUCKET.put(svgPath, JSON.stringify(svg), {
        customMetadata: {
          ...asset.svg,
        },
      });
    }

    if (asset.gif) {
      const gif = await fetch(asset.gif.url).then((response) => response.text());
      const gifPath = `${asset._type}/${asset._id}/${asset.gif._id}.${asset.gif.extension}`;

      await env.ASSET_TOWN_CDN_BUCKET.put(gifPath, JSON.stringify(gif), {
        customMetadata: {
          ...asset.gif,
        },
      });
    }

    return new Response(JSON.stringify({ message: "Put Success!!!" }), {
      headers: {
        "Content-Type": "application/json",
        "Access-Control-Allow-Origin": "*",
      },
      status: 200,
    });
  } catch {
    return new Response(JSON.stringify({ message: "Put Failed!!!" }), {
      headers: {
        "Content-Type": "application/json",
        "Access-Control-Allow-Origin": "*",
      },
      status: 500,
    });
  }
};

export const deleteLottieFromBucket = async (request: Request, env: Env): Promise<Response> => {
  const asset = await request.json<SanityRequest>();

  const lottiePath = `${asset._type}/${asset._id}/${asset.lottie.assetId}.${asset.lottie.extension}`;
  const svgPath = `${asset._type}/${asset._id}/${asset.svg.assetId}.${asset.svg.extension}`;
  const gifPath = `${asset._type}/${asset._id}/${asset.svg.assetId}.${asset.gif.extension}`;

  try {
    await env.ASSET_TOWN_CDN_BUCKET.delete(lottiePath);
    await env.ASSET_TOWN_CDN_BUCKET.delete(svgPath);
    await env.ASSET_TOWN_CDN_BUCKET.delete(gifPath);

    return new Response(JSON.stringify({ message: "Delete Success!!!" }), {
      headers: {
        "Content-Type": "application/json",
        "Access-Control-Allow-Origin": "*",
      },
      status: 200,
    });
  } catch {
    return new Response(JSON.stringify({ message: "Delete Failed!!!" }), {
      headers: {
        "Content-Type": "application/json",
        "Access-Control-Allow-Origin": "*",
      },
      status: 500,
    });
  }
};
