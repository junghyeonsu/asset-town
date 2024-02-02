import { GIFEncoder, applyPalette, quantize } from "gifenc";

import { getFile } from "@sanity/asset-utils";
import { Button, Stack } from "@sanity/ui";

import { ComponentType } from "react";
import { useClient, useFormValue, type FileValue, type ObjectInputProps, type ObjectSchemaType } from "sanity";
import { sanityConfig } from "../env";

import { Controls, Player } from "@lottiefiles/react-lottie-player";
import React from "react";
import type { AnimationItem } from "lottie-web";

async function encodeGif(
  canvas: HTMLCanvasElement,
  animation: AnimationItem,
  fps: number,
  transparent: boolean,
): Promise<Blob> {
  const context = canvas.getContext("2d");
  const width = canvas.width;
  const height = canvas.height;

  const delay = (1 / fps) * 1000;
  const format = transparent ? "rgba4444" : "rgb444";

  const gif = GIFEncoder();

  for (let i = 0; i < animation.totalFrames; i++) {
    animation.goToAndStop(i, true);

    const data = context?.getImageData(0, 0, width, height).data;
    const palette = quantize(data, 256, { format });
    const bitmap = applyPalette(data, palette, format);

    // https://github.com/mattdesl/looom-tools/blob/a9f455eeab3e43af6775e903cfafe6e9568dea4d/site/components/gifworker.js#L60
    let transparentIndex = 0;
    if (transparent) {
      // biome-ignore lint/suspicious/noExplicitAny: <explanation>
      transparentIndex = palette.findIndex((p: any) => p[3] === 0);
    }

    gif.writeFrame(bitmap, width, height, { palette, delay, transparent, transparentIndex });

    await new Promise((resolve) => setTimeout(resolve, 0));
  }

  gif.finish();
  return new Blob([gif.bytesView()], { type: "image/gif" });
}

export const CustomLottiePlayerInput: ComponentType<ObjectInputProps<FileValue, ObjectSchemaType>> = (props) => {
  const gitPlayerRef = React.useRef<Player | null>(null);
  const gitLottieRef = React.useRef<AnimationItem | null>(null);
  const svgPlayerRef = React.useRef<Player | null>(null);
  const svgLottieRef = React.useRef<AnimationItem | null>(null);

  const [isGifLoading, setIsGifLoading] = React.useState(false);
  const [isSvgLoading, setIsSvgLoading] = React.useState(false);

  const client = useClient({ apiVersion: "2021-08-29" });
  const docId = useFormValue(["_id"]);

  const value = props.value;
  if (!value) return props.renderDefault(props);

  const { asset } = value;
  if (!asset) return props.renderDefault(props);

  const file = getFile(asset, sanityConfig);
  const url = file.asset.url;

  const extractGif = async () => {
    const canvas = gitPlayerRef.current?.container?.querySelector("canvas") as HTMLCanvasElement | null;
    const animation = gitLottieRef.current;
    const animationFrame = animation?.frameRate;

    if (!canvas || !animation || !animationFrame) return;
    setIsGifLoading(true);

    const blob = await encodeGif(canvas, animation, animationFrame, true);

    await client.assets
      .upload("image", blob, { contentType: "image/gif" })
      .then((imageAsset) => {
        return client
          .patch(docId as string)
          .set({
            gif: {
              _type: "image",
              asset: {
                _ref: imageAsset._id,
                _type: "reference",
              },
            },
          })
          .commit();
      })
      .catch((error) => {
        console.error("Upload failed:", error.message);
      })
      .finally(() => {
        setIsGifLoading(false);
      });
  };

  const extractSvg = async () => {
    const svg = svgPlayerRef.current?.container?.innerHTML;
    const animation = svgLottieRef.current;
    const animationFrame = animation?.frameRate;

    if (!svg || !animation || !animationFrame) return;
    setIsSvgLoading(true);

    await client.assets
      .upload("image", new Blob([svg], { type: "image/svg+xml" }), { contentType: "image/svg+xml" })
      .then((imageAsset) => {
        return client
          .patch(docId as string)
          .set({
            svg: {
              _type: "image",
              asset: {
                _ref: imageAsset._id,
                _type: "reference",
              },
            },
          })
          .commit();
      })
      .catch((error) => {
        console.error("Upload failed:", error.message);
      })
      .finally(() => {
        setIsSvgLoading(false);
      });
  };

  return (
    <Stack space={3}>
      <Player
        ref={svgPlayerRef}
        lottieRef={(ref) => {
          svgLottieRef.current = ref;
        }}
        autoplay
        loop
        src={url}
        style={{ height: "300px", width: "300px" }}
      >
        <Controls visible={true} buttons={["play", "repeat", "frame", "debug", ""]} />
      </Player>

      {/* GIF 추출을 위한 Player */}
      <Player
        ref={gitPlayerRef}
        lottieRef={(ref) => {
          gitLottieRef.current = ref;
        }}
        renderer="canvas"
        rendererSettings={{
          clearCanvas: true,
        }}
        src={url}
        style={{ height: "300px", width: "300px", display: "none" }}
      />

      <div
        style={{
          display: "flex",
          gap: "8px",
        }}
      >
        <Button
          style={{
            flex: 1,
            cursor: "pointer",
          }}
          loading={isGifLoading}
          disabled={isGifLoading}
          onClick={extractGif}
        >
          GIF 추출하기
        </Button>
        <Button
          style={{
            flex: 1,
            cursor: "pointer",
          }}
          loading={isSvgLoading}
          disabled={isSvgLoading}
          onClick={extractSvg}
        >
          SVG 추출하기 (현재 프레임 기준)
        </Button>
      </div>

      {props.renderDefault({
        ...props,
        onChange: (value) => {
          props.onChange(value);
        },
      })}
    </Stack>
  );
};
