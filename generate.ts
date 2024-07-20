import { readdir } from "fs/promises";
import { extname } from "path";
import ffmpeg from "fluent-ffmpeg";
// @ts-ignore
import Vibrant = require("node-vibrant");

const VIDEO_LENGTH = hoursToSeconds;

try {
  const audioFilePath = (await readdir("./audio")).find(
    (file) => extname(file) === ".wav",
  );
  const backgroundImagePath = (await readdir("./background")).find(
    (file) => extname(file) === ".png",
  );
  const lengthArgIndex = process.argv.findIndex((arg) => arg === "--length");
  const videoLengthHours =
    lengthArgIndex !== -1 && process.argv[lengthArgIndex + 1]
      ? parseFloat(process.argv[lengthArgIndex + 1])
      : null;

  if (videoLengthHours === null) {
    throw new Error("Video length (--length) must be specified");
  }

  if (!audioFilePath) {
    throw new Error("No audio file found");
  }

  if (!backgroundImagePath) {
    throw new Error("No background image found");
  }

  const videoLength = hoursToSeconds(videoLengthHours);
  const videoResolution = "3840x2160";

  await generateVideo({
    audioFilePath: `./audio/${audioFilePath}`,
    backgroundImagePath: `./background/${backgroundImagePath}`,
    videoLength,
    videoResolution,
  });

  process.exit(0);
} catch (error) {
  console.error(error);
  process.exit(1);
}

function hoursToSeconds(hours: number) {
  return hours * 60 * 60;
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
        // {
        //   filter: "pad",
        //   options: {
        //     w: "3840",
        //     h: "2160",
        //     x: "(ow-iw)/2",
        //     y: "(oh-ih)/2",
        //     color: await getScalingBarColor(backgroundImagePath),
        //   },
        // },
      ])
      .videoCodec("libx264")
      .audioCodec("aac")
      .outputOptions(["-pix_fmt yuv420p", "-shortest"])
      .output("./ambient-video.mp4")
      .on("start", (commandLine) => {
        console.log("Spawned FFmpeg with command: " + commandLine);
      })
      .on("progress", (progress) => {
        console.log(`Processing: ${progress.percent}% done`);
      })
      .on("end", () => {
        console.log("Processing finished!");
        resolve();
      })
      .on("error", (err, stdout, stderr) => {
        console.error("Error: " + err.message);
        console.error("FFmpeg stdout: " + stdout);
        console.error("FFmpeg stderr: " + stderr);
        reject();
      })
      .run();
  });
}
