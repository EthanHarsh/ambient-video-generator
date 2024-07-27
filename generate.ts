import ffmpeg from "fluent-ffmpeg";
import { findDefaultAudioFile, findDefaultBackgroundImage } from "./read";
import { Effect } from "effect";
import { RESOLUTIONS } from "./video/constants";
import { getRandomVideoLengthSeconds } from "./time/videoLength";
import { secondsToHours } from "./time";

try {
  const audioFilePath = await Effect.runPromise(findDefaultAudioFile());
  const backgroundImagePath = await Effect.runPromise(
    findDefaultBackgroundImage(),
  );

  const videoResolution = RESOLUTIONS["4k"].string;
  const videoLength = Effect.runSync(getRandomVideoLengthSeconds(undefined))

  await generateVideo({
    audioFilePath: audioFilePath,
    backgroundImagePath: backgroundImagePath,
    videoLength,
    videoResolution,
  });
} catch (error) {
  console.error(error);
} finally {
  process.exit(0);
}

async function generateVideo({
  audioFilePath,
  backgroundImagePath,
  videoLength,
  videoResolution,
}: {
  audioFilePath: string;
  backgroundImagePath: string;
  videoLength: number;
  videoResolution: string;
}) {
  return new Promise<void>(async (resolve, reject) => {
    const command = ffmpeg();
    const videoName = `${secondsToHours(videoLength)}hrs`;

    command
      .input(backgroundImagePath)
      .loop(videoLength)
      .input(audioFilePath)
      .inputOptions(["-stream_loop -1"])
      .complexFilter([
        {
          filter: "scale",
          options: {
            w: videoResolution.split("x")[0],
            h: videoResolution.split("x")[1],
            force_original_aspect_ratio: "increase",
          },
        },
      ])
      .videoCodec("h264_videotoolbox")
      .audioCodec("flac")
      .outputOptions(["-pix_fmt yuv420p", "-shortest", "-r 24"])
      .saveToFile(`./${videoName}.mp4`);

    command.on("start", (commandLine) => {
      console.log("Spawned FFmpeg with command: " + commandLine);
    });

    command.on("progress", (progress) => {
      console.log(`Processing ${videoName}: ${JSON.stringify(progress)}`);
    });

    command.on("end", () => {
      console.log("Processing finished!");
      resolve();
    });

    command.on("error", (err, stdout, stderr) => {
      console.error("Error: " + err.message);
      console.error("FFmpeg stdout: " + stdout);
      console.error("FFmpeg stderr: " + stderr);
      reject();
    });

    command.run();
  });
}
