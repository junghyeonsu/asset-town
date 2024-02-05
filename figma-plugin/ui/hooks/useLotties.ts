import { useQuery } from "@tanstack/react-query";
import type { SanityRequest } from "@asset-town/types";

import { client } from "../sanityClient";

const getLotties = () =>
  client.fetch(`
    *[_type == "lottie"] {
      _id,
      _type,
      title,
      description,
      "gif": gif.asset->{
        _id,
        _type,
        _createdAt,
        _updatedAt,
        url,
        originalFilename,
        uploadId,
        assetId,
        extension,
        path,
        mimeType,
      },
      "svg": svg.asset->{
        _id,
        _type,
        _createdAt,
        _updatedAt,
        url,
        originalFilename,
        uploadId,
        assetId,
        extension,
        mimeType,
        path
      },
      "lottie": lottie.asset->{
        _id,
        _type,
        _createdAt,
        _updatedAt,
        url,
        originalFilename,
        uploadId,
        assetId,
        extension,
        mimeType,
        path
      },
    }
`);

export const useLottiesQuery = () => {
  return useQuery<SanityRequest[], Error, SanityRequest[]>({
    queryKey: ["lotties"],
    queryFn: getLotties,
    retry: false,
    refetchOnWindowFocus: false,
  });
};
