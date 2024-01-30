/**
 * NOTE: sanity cdn url format:
 * https://cdn.sanity.io/files/<projectId>/<dataset>/<assetId>.<extension>
 * @example https://cdn.sanity.io/files/abc123/production/1234567890.json
 *
 * NOTE: r2 cdn url format:
 * https://<cdnDomain>/<_type>/<assetId>.<extension>
 * @example https://cdn.yourproject.com/lottie/1234567890.json
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
  _type: string;
  name: string;
  description: string;
  lottie: SanityAsset;
  preview: SanityAsset;
}

export const putLottieFromBucket = async (request: Request, env: Env): Promise<Response> => {
  const asset = await request.json<SanityRequest>();
  const lottie = await fetch(asset.lottie.url).then((response) => response.json());
  const path = `${asset._type}/${asset.lottie.assetId}.${asset.lottie.extension}`;

  try {
    await env.ASSET_TOWN_CDN_BUCKET.put(path, JSON.stringify(lottie), {
      customMetadata: {
        ...asset.lottie,
      },
    });

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
  const path = `${asset._type}/${asset.lottie.assetId}.${asset.lottie.extension}`;

  try {
    await env.ASSET_TOWN_CDN_BUCKET.delete(path);

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
