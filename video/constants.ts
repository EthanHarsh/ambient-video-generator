import  ffmpeg  from "fluent-ffmpeg";

export const RESOLUTIONS = {
  "4k": { width: 3840, height: 2160, string: "3840x2160" },
};

export function getVideoNameFromPath(path: string) {
  return path.split("/").pop()?.split(".")[0];
}

// FFMPEG constants
export const buildComplexFilter: (videoResolution: string) => ffmpeg.FilterSpecification[] = (videoResolution: string) => [
  {
    filter: "scale",
    options: {
      w: videoResolution.split("x")[0],
      h: videoResolution.split("x")[1],
      force_original_aspect_ratio: "increase",
    },
  },
]
export const audioInputOptions = ["-stream_loop -1"]
export const videoCodec = "h264_videotoolbox";
export const audioCodec = "flac";
export const outputOptions = ["-pix_fmt yuv420p", "-shortest", "-r 24"];

