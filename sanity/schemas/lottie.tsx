import { defineField, defineType } from "sanity";
import { CustomLottiePlayerInput } from "../src/components/CustomLottiePlayerInput";

export const lottie = defineType({
  name: "lottie",
  type: "document",
  title: "Lottie",
  fields: [
    defineField({
      name: "title",
      type: "string",
      description: "로띠 이름을 입력해주세요.",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "description",
      type: "string",
      description: "로띠 설명을 입력해주세요.",
    }),
    defineField({
      name: "lottie",
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
      name: "svg",
      type: "image",
      options: {
        accept: "image/svg+xml",
      },
      validation: (Rule) => Rule.assetRequired(),
    }),
    defineField({
      name: "gif",
      type: "image",
      options: {
        accept: "image/gif",
      },
      validation: (Rule) => Rule.assetRequired(),
    }),
  ],

  preview: {
    select: {
      title: "title",
      subtitle: "description",
      media: "svg",
    },
  },
});
