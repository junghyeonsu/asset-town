import { defineField, defineType } from "sanity";
import { CustomLottiePlayerInput } from "../src/components/CustomLottiePlayerInput";

export const lottie = defineType({
  name: "lottie",
  type: "document",
  title: "Lottie",
  fields: [
    defineField({
      name: "Name",
      type: "string",
      description: "로띠 이름을 입력해주세요.",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "Description",
      type: "string",
      description: "로띠 설명을 입력해주세요.",
    }),
    defineField({
      name: "LottieFile",
      type: "file",
      description: "로띠 파일을 올려주세요.",
      options: {
        accept: ".json",
      },
      components: {
        input: CustomLottiePlayerInput,
      },
      validation: (Rule) => Rule.assetRequired(),
    }),
    defineField({
      name: "PreviewImage",
      type: "image",
      description: "로띠 미리보기 이미지를 올려주세요.",
      options: {
        accept: "image/png, image/jpeg, image/webp, image/svg+xml",
      },
      validation: (Rule) => Rule.assetRequired(),
    }),
  ],

  preview: {
    select: {
      title: "Name",
      subtitle: "Description",
      media: "PreviewImage",
    },
  },
});
