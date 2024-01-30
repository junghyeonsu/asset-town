import { Stack } from "@sanity/ui";

import { ComponentType } from "react";
import { ImageValue, type ObjectInputProps, type ObjectSchemaType } from "sanity";

export const CustomPreviewImage: ComponentType<ObjectInputProps<ImageValue, ObjectSchemaType>> = (props) => {
  console.log("props", props);

  return (
    <Stack space={2}>
      {/* <img src={props.value?.asset?.url} style={{ height: "300px", width: "300px" }} /> */}
      {props.renderDefault(props)}
    </Stack>
  );
};
