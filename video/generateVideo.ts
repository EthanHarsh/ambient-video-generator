import { Effect } from "effect";
import ffmpeg from "fluent-ffmpeg";
import { audioCodec, audioInputOptions, buildComplexFilter, getVideoNameFromPath, outputOptions, videoCodec } from "./constants";
import type { GenerateVideoParams } from "./generators/types";
import { generators } from "./generators";

interface GenerateVideo {
  generatorParams: GenerateVideoParams;
  generatorName: keyof typeof generators;
}

export function generateVideo({
  generatorParams,
  generatorName,
}: GenerateVideo) {
  return Effect.tryPromise({
    try: generators[generatorName](generatorParams),
    catch: (unknown) => new Error(`Error generating video: ${unknown}`),
  });
}
