import { getFile } from "@sanity/asset-utils";
import { Stack } from "@sanity/ui";

import { ComponentType } from "react";
import { type FileValue, type ObjectInputProps, type ObjectSchemaType } from "sanity";
import { sanityConfig } from "../env";

import { Controls, Player } from "@lottiefiles/react-lottie-player";

export const CustomLottiePlayerInput: ComponentType<ObjectInputProps<FileValue, ObjectSchemaType>> = (props) => {
  const value = props.value;
  if (!value) return props.renderDefault(props);

  const { asset } = value;
  if (!asset) return props.renderDefault(props);

  const file = getFile(asset, sanityConfig);
  const url = file.asset.url;

  return (
    <Stack space={3}>
      <Player autoplay loop src={url} style={{ height: "300px", width: "300px" }}>
        <Controls visible={true} buttons={["play", "repeat", "frame", "debug", ""]} />
      </Player>

      {props.renderDefault(props)}
    </Stack>
  );
};
