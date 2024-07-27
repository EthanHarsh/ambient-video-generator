import {
  findFileFromDirectoryByExtension,
  readFileFromDirectoryByExtension,
} from "./common";
import { join } from "path";

interface ReadAudioFile {
  directoryPath: string;
  extension: ".wav" | ".mp3" | ".aiff";
}
export function readAudioFile({ directoryPath, extension }: ReadAudioFile) {
  return readFileFromDirectoryByExtension({ directoryPath, extension });
}

export function readDefaultAudioFile() {
  return readAudioFile({
    directoryPath: join(__dirname, "../audio"),
    extension: ".wav",
  });
}

export function findDefaultAudioFile() {
  return findFileFromDirectoryByExtension({
    directoryPath: join(__dirname, "../audio"),
    extension: ".wav",
  });
}
