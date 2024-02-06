import type { SanityAsset, SanityRequest } from "@asset-town/types";
import { Controls, Player } from "@lottiefiles/react-lottie-player";
import * as React from "react";
import { useLottiesQuery } from "./hooks/useLotties";
import { LinkIcon } from "lucide-react";

import { Card, CardContent } from "@/components/ui/card";

import { ResizeIcon } from "./components/ResizeIcon";
import { Button } from "./components/ui/button";
import { useToast } from "./components/ui/use-toast";
import { copyClipboard } from "./lib/utils";
import { Tooltip } from "@radix-ui/react-tooltip";
import { TooltipContent, TooltipTrigger } from "./components/ui/tooltip";

/**
 * @param url - https://cdn.sanity.io/files/{projectId}/{dataset}/{assetId}.{extension}
 * @returns https://{cdn-domain}/${dataset}/{documentType}/${documentId}/{assetId}.{extension}
 */
function changeToCloudflareCDN({ type, id, asset }: { type: string; id: string; asset: SanityAsset }) {
  const { assetId, extension } = asset;
  const cdnDomain = import.meta.env.VITE_CDN_DOMAIN;
  const mode = import.meta.env.MODE;
  const dataset = mode === "dev" ? "development" : "production";
  return `https://${cdnDomain}/${dataset}/${type}/${id}/${assetId}.${extension}`;
}

const LottieCard = React.memo((props: SanityRequest) => {
  const { toast } = useToast();
  const { lottie, title, _id, _type } = props;
  const [isHover, setIsHover] = React.useState(false);

  const handleMouseEnter = () => {
    setIsHover(true);
  };

  const handleMouseLeave = () => {
    setIsHover(false);
  };

  return (
    <Card
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      className="relative flex flex-col items-center justify-center min-h-44 flex-1 max-w-56 p-2 hover:ring-2 ring-orange-400 transition-all"
      key={title}
    >
      {isHover && (
        <div className="absolute w-full h-full top-0 right-0 bg-gray-900 bg-opacity-20 z-10 animate-in p-2">
          <Tooltip delayDuration={0}>
            <TooltipTrigger asChild>
              <Button className="absolute bottom-2 right-2">
                <LinkIcon
                  onClick={() => {
                    const url = changeToCloudflareCDN({ type: _type, id: _id, asset: lottie });
                    copyClipboard({ url });
                    toast({
                      title: "클립보드에 주소를 복사했습니다.",
                      description: `${url}`,
                      duration: 2000,
                    });
                  }}
                />
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              <p>JSON CDN URL 복사하기</p>
            </TooltipContent>
          </Tooltip>
        </div>
      )}

      <CardContent>
        <Player autoplay loop src={lottie?.url} style={{ height: "100px", width: "100px" }}>
          <Controls visible={false} buttons={["play", "repeat", "frame", "debug", ""]} />
        </Player>
      </CardContent>
    </Card>
  );
});

export const App = () => {
  const { data, isPending, error } = useLottiesQuery();

  console.log({ data, isPending, error });

  if (isPending) return <div>loading...</div>;
  if (error) return <div>error: {error.message}</div>;

  return (
    <div className="flex flex-wrap break-words gap-2 p-2">
      <ResizeIcon />
      {data?.map((obj) => (
        <LottieCard key={obj._id} {...obj} />
      ))}
    </div>
  );
};
