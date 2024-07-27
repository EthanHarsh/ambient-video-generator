import { readdir } from "fs/promises";
import { extname } from "path";
import ffmpeg from "fluent-ffmpeg";
// @ts-ignore
import Vibrant = require("node-vibrant");
import { findDefaultAudioFile, findDefaultBackgroundImage } from "./readInputs";
import { Effect } from "effect";

console.time("generate");

try {
  const audioFilePath = await Effect.runPromise(findDefaultAudioFile());
  const backgroundImagePath = await Effect.runPromise(findDefaultBackgroundImage());

  if (!audioFilePath) {
    throw new Error("No audio file found");
  }

  if (!backgroundImagePath) {
    throw new Error("No background image found");
  }

  const videoResolution = "3840x2160";
  const videoLengths = new Array(12)
    .fill(null)
    .map((_, index) => hoursToSeconds(index + 1));

  
  for (const videoLength of videoLengths) {
    await generateVideo({
      audioFilePath: audioFilePath,
      backgroundImagePath: backgroundImagePath,
      videoLength,
      videoResolution,
    });
  }
} catch (error) {
  console.error(error);
} finally {
  console.timeEnd("generate");
  process.exit(0);
}

function hoursToSeconds(hours: number) {
  return hours * 60 * 60;
}

function secondsToHours(seconds: number) {
  return seconds / 60 / 60;
}

async function getScalingBarColor(backgroundImagePath: string) {
  const vibrant = new Vibrant(backgroundImagePath);
  const palette = await vibrant.getPalette();
  const color = palette.DarkMuted?.getHex();
  console.log("color", color);
  return color;
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
      .saveToFile(`/Volumes/T7/ambient-videos-tests/${videoName}.mp4`);

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
