import { useQuery } from "@tanstack/react-query";
import { client } from "../sanityClient";

export interface Asset {
  url: string;
  assetId: string;
  extension: string;
}

export interface Lottie {
  _type: string;
  title: string;
  description: string;
  lottie: Asset;
  svg: Asset;
  gif: Asset;
}

const getLotties = () =>
  client.fetch(`
    *[_type == "lottie"] {
      _type,
      title,
      description,
      "lottie": lottie.asset->{
        url,
        assetId,
        extension,
      },
      "svg": svg.asset->{
        url,
        assetId,
        extension,
      },
      "gif": gif.asset->{
        url,
        assetId,
        extension,
      }
    }
`);

export const useLottiesQuery = () => {
  return useQuery<Lottie[], Error, Lottie[]>({
    queryKey: ["lotties"],
    queryFn: getLotties,
    retry: false,
    refetchOnWindowFocus: false,
  });
};
