import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function copyClipboard({ url }: { url: string }) {
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
