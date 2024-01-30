import { useQuery } from "@tanstack/react-query";
import { client } from "../sanityClient";

export interface Lottie {
  _type: string;
  name: string;
  description: string;
  lottie: {
    url: string;
    assetId: string;
    extension: string;
  };
}

const getLotties = () =>
  client.fetch(`
    *[_type == "lottie"] {
      _type,
      "name": Name,
      "description": Description,
      "lottie": LottieFile.asset->{
        url,
        assetId,
        extension,
      },
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
