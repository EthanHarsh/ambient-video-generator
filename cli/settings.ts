import { Effect, Match } from "effect";
import { getFlags, getImageFlag } from "./flags";
import {
  findDefaultBackgroundImage,
  findMultiImageInDefaultDirectory,
  findMultiVideoInDefaultDirectory,
} from "../read";
import type { generators } from "../video/generators";

export function getSettings() {
  return Effect.gen(function* () {
    const flags = yield* getFlags();
    const imageFlag = yield* getImageFlag(flags);
    const image = yield* getImageReader({ image: imageFlag });
    const generator = getVideoGenerator({ image: imageFlag });
    return {
      image,
      generator,
    };
  });
}

export const getImageReader = Match.type<{ image: string | undefined }>().pipe(
  Match.when({ image: "multi-still" }, () => findMultiImageInDefaultDirectory()),
  Match.when({ image: "multi-video" }, () => findMultiVideoInDefaultDirectory()),
  Match.orElse(() =>
    findDefaultBackgroundImage().pipe(Effect.map((image) => [image])),
  ),
);

export const getVideoGenerator: (input: {
  image: string | undefined;
}) => keyof typeof generators = Match.type<{ image: string | undefined }>().pipe(
  Match.when({ image: "multi-still" }, () => 'stillBackground' as keyof typeof generators),
  Match.when({ image: "multi-video" }, () => 'videoBackground' as keyof typeof generators),
  Match.orElse(() =>
    'stillBackground' as keyof typeof generators,
  ),
);