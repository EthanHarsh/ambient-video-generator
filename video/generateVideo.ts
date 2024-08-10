import { Effect } from "effect";
import ffmpeg from "fluent-ffmpeg";
import { getVideoNameFromPath } from "./constants";

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
          .inputOptions(["-stream_loop -1"])
          .audioFilter('afade=t=in:ss=0:d=3,afade=t=out:st=25:d=3')
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
          .saveToFile(`/Volumes/T7/ambience-videos/${videoName}.mp4`);

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
