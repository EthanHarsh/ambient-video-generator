import { Effect } from "effect";
import ffmpeg from "fluent-ffmpeg";
import { audioCodec, audioInputOptions, buildComplexFilter, getVideoNameFromPath, outputOptions, videoCodec } from "./constants";

interface GenerateVideoParams {
  audioFilePath: string;
  backgroundImagePath: string;
  videoLength: number;
  videoResolution: string;
}

export function generateVideo({
  audioFilePath,
  backgroundImagePath,
  videoLength,
  videoResolution,
}: GenerateVideoParams) {
  return Effect.tryPromise({
    try: () => {
      return new Promise<string>(async (resolve, reject) => {
        const command = ffmpeg();
        const videoName = getVideoNameFromPath(backgroundImagePath);

        command
          .input(backgroundImagePath)
          .loop(videoLength)
          .input(audioFilePath)
          .inputOptions(audioInputOptions)
          .complexFilter(buildComplexFilter(videoResolution))
          .videoCodec(videoCodec)
          .audioCodec(audioCodec)
          .outputOptions(outputOptions)
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
    },
    catch: (unknown) => new Error(`Error generating video: ${unknown}`),
  });
}
