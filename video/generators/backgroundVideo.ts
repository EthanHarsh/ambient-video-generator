import { audioCodec, buildComplexFilter, getVideoNameFromPath, inputOptions, outputOptions, videoCodec } from "../constants";
import type { GenerateVideoParams } from "./types";
import ffmpeg from "fluent-ffmpeg";

export const backgroundVideoGenerator = ({
    audioFilePath,
    backgroundPath,
    videoLength,
    videoResolution,
  }: GenerateVideoParams) => () => {
    return new Promise<string>(async (resolve, reject) => {
        const command = ffmpeg();
        const videoName = getVideoNameFromPath(backgroundPath);

        command
          .input(backgroundPath)
          .inputOptions(["-stream_loop -1"]) // Loop the video indefinitely
          .input(audioFilePath)
          .inputOptions(inputOptions)
          .complexFilter(buildComplexFilter(videoResolution))
          .videoCodec(videoCodec)
          .audioCodec(audioCodec)
          .outputOptions(outputOptions.concat([`-t ${videoLength}`]))
          .saveToFile(`./out/${videoName}.mp4`);

      command.on("start", (commandLine) => {
        console.log("Spawned FFmpeg with command: " + commandLine);
      });

      command.on("progress", (progress) => {
        console.log(`Processing ${videoName}: ${JSON.stringify(progress)}`);
      });

      command.on("end", () => {
        console.log("Processing finished!");
        resolve(`Finished processing ${videoName}`);
      });

      command.on("error", (err, stdout, stderr) => {
        console.error("Error: " + err.message);
        console.error("FFmpeg stdout: " + stdout);
        console.error("FFmpeg stderr: " + stderr);
        reject(err);
      });

      command.run();
    });
  }