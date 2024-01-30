import { Controls, Player } from "@lottiefiles/react-lottie-player";
import * as React from "react";
import { Lottie, useLottiesQuery } from "./hooks/useLotties";

import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";

import { Button } from "./components/ui/button";
import { useToast } from "./components/ui/use-toast";

/**
 * @param url - https://cdn.sanity.io/files/{projectId}/{dataset}/{assetId}.{extension}
 * @returns https://{cdn-domain}/{_type}/{assetId}.{extension}
 */
function changeToCloudflareCDN({ _type, lottie }: Lottie) {
  const { assetId, extension } = lottie;
  const isDev = import.meta.env.MODE === "dev";
  const cdnDomain = isDev ? import.meta.env.VITE_ALPHA_CDN_DOMAIN : import.meta.env.VITE_PROD_CDN_DOMAIN;
  return `https://${cdnDomain}/${_type}/${assetId}.${extension}`;
}

function copyLink({ url }: { url: string }) {
  try {
    navigator.clipboard.writeText(url);
  } catch (error) {
    console.error(error);
    if (!url) return;
    const input = document.createElement("input");
    input.style.position = "fixed";
    input.style.top = "0";
    input.style.left = "0";
    input.style.opacity = "0";
    document.body.appendChild(input);
    input.value = url;
    input.focus();
    input.select();
    const result = document.execCommand("copy");
    document.body.removeChild(input);
    if (!result) {
      console.error("copy failed");
    }
  }
}

export const App = () => {
  const { data, isPending, error } = useLottiesQuery();
  const { toast } = useToast();

  if (isPending) return <div>loading...</div>;
  if (error) return <div>error: {error.message}</div>;

  console.log("data", data);

  return (
    <div className="grid grid-cols-3 break-words gap-3 p-2">
      {data?.map((obj) => {
        const { lottie, name, description } = obj;
        return (
          <Card
            className="flex flex-col justify-between hover:ring-2 ring-orange-400 hover:bg-gray-100 transition-all"
            key={lottie.url}
          >
            <div>
              <CardHeader>
                <CardTitle>{name}</CardTitle>
                <CardDescription>{description}</CardDescription>
              </CardHeader>
              <CardContent>
                <Player autoplay loop src={lottie.url} style={{ height: "100px", width: "100px" }}>
                  <Controls visible={false} buttons={["play", "repeat", "frame", "debug", ""]} />
                </Player>
              </CardContent>
            </div>
            <CardFooter>
              <Button
                className="w-[100%]"
                onClick={() => {
                  const url = changeToCloudflareCDN(obj);
                  copyLink({ url });
                  toast({
                    title: "클립보드에 주소를 복사했습니다.",
                    description: `${url}`,
                    duration: 1000,
                  });
                }}
              >
                주소 복사하기
              </Button>
            </CardFooter>
          </Card>
        );
      })}
    </div>
  );
};
