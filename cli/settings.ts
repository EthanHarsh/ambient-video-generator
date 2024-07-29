import { Effect, Match } from "effect";
import { getFlags, getImageFlag } from "./flags";
import {
  findDefaultBackgroundImage,
  findMultiImageInDefaultDirectory,
} from "../read";

export function getSettings() {
  return Effect.gen(function* () {
    return {
      image: yield* getImageReader({
        image: yield* getImageFlag(yield* getFlags()),
      }),
    };
  });
}

export const getImageReader = Match.type<{ image: string | undefined }>().pipe(
  Match.when({ image: "multi" }, () => findMultiImageInDefaultDirectory()),
  Match.orElse(() =>
    findDefaultBackgroundImage().pipe(Effect.map((image) => [image])),
  ),
);
