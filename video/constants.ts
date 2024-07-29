import { build } from "bun";
import { hoursToSeconds } from "../time/tools";

export const RESOLUTIONS = {
  "4k": { width: 3840, height: 2160, string: "3840x2160" },
};

export function getVideoNameFromPath(path: string) {
  return path.split("/").pop()?.split(".")[0];
}
