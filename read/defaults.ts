import { Effect } from "effect";
import { findDefaultAudioFile } from "./audio";
import {
  findDefaultBackgroundImage,
  findMultiImageInDefaultDirectory,
} from "./image";

export function getInputsFromDefault() {
  return Effect.gen(function* () {
    return {
      audioFilePath: yield* findDefaultAudioFile(),
      backgroundImagePath: yield* findDefaultBackgroundImage(),
    };
  });
}

export function getMultiImageWithDefaultAudio() {
  return Effect.gen(function* () {
    return {
      audioFilePath: yield* findDefaultAudioFile(),
      backgroundImagePath: yield* findMultiImageInDefaultDirectory(),
    };
  });
}
