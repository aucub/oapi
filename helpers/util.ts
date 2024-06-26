import { IterableReadableStream } from "../deps.ts";

export async function urlToDataURL(url: string): Promise<string> {
  const response = await fetch(url);
  if (!response.ok) {
    throw new Error("Failed to download.");
  }
  const blob = await response.blob();
  return await blobToDataURL(blob);
}

export function blobToDataURL(blob: Blob): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = reject;
    reader.readAsDataURL(blob);
  });
}

export async function blobToBase64(blob: Blob): Promise<string> {
  const arrayBuffer = await blob.arrayBuffer();
  const uint8Array = new Uint8Array(arrayBuffer);
  let binaryString = "";
  for (let i = 0; i < uint8Array.byteLength; i += 1024) {
    const chunk = uint8Array.subarray(
      i,
      Math.min(i + 1024, uint8Array.byteLength),
    );
    binaryString += String.fromCharCode.apply(null, Array.from(chunk));
  }
  return btoa(binaryString);
}

export function isIterableReadableStream(
  obj: any,
): obj is IterableReadableStream<any> {
  return typeof obj === "object" && obj !== null && "locked" in obj &&
    "cancel" in obj &&
    "getReader" in obj;
}

export function isChatCompletionNamedToolChoice(
  obj: any,
) {
  return typeof obj === "object" && obj !== null && "type" in obj &&
    "function" in obj &&
    "name" in obj["function"];
}
