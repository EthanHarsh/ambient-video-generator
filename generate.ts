import { Effect } from "effect";

import { findDefaultAudioFile } from "./read";
import { secondsToHours, getRandomVideoLengthSeconds } from "./time";
import { generateVideo, getVideoNameFromPath, RESOLUTIONS } from "./video";
import { getSettings } from "./cli";

const main = Effect.gen(function* () {
  const audioFilePath = yield* findDefaultAudioFile();
  const { image: backgroundImages } = yield* getSettings();
  const videoResolution = RESOLUTIONS["4k"].string;

  console.log(`Generating ${backgroundImages.length} videos`);
  for (const backgroundImagePath of backgroundImages) {
    const videoLength = yield* getRandomVideoLengthSeconds(undefined);
    console.log(`Generating vide of length ${secondsToHours(videoLength)}hrs titled: ${getVideoNameFromPath(backgroundImagePath)}`);
    const results = yield* generateVideo(
      {
        generatorParams: {
          audioFilePath: audioFilePath,
          backgroundPath: backgroundImagePath,
          videoLength,
          videoResolution,
        },
        generatorName: "stillBackground",
      }
    );
    console.log(
      `Generated video of length ${secondsToHours(videoLength)}hrs titled: ${getVideoNameFromPath(backgroundImagePath)}. Results: ${JSON.stringify(results)}`,
    );
  }
});

console.log(await Effect.runPromiseExit(main));
