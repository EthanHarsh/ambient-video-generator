import { Effect } from "effect";
import {
  findFileFromDirectoryByExtension,
  findFilesFromDirectoryByExtension,
  readFileFromDirectoryByExtension,
} from "./common";
import { join } from "path";

interface ReadImageFile {
  directoryPath: string;
  extension: ".jpg" | ".png" | ".gif" | ".webp";
}

export function readImage({ directoryPath, extension }: ReadImageFile) {
  return readFileFromDirectoryByExtension({ directoryPath, extension });
}

export function readDefaultBackgroundImage() {6
  return readImage({
    directoryPath: join(__dirname, "../image"),
    extension: ".png",
  });
}

export function findDefaultBackgroundImage() {
  return findFileFromDirectoryByExtension({
    directoryPath: join(__dirname, "../background"),
    extension: ".png",
  });
}

export function findMultiImageInDefaultDirectory() {
  return findFilesFromDirectoryByExtension({
    directoryPath: join(__dirname, "../background"),
    extension: ".png",
  }).pipe(Effect.map((images) => images.map((image) => image.path)));
}

export function findMultiVideoInDefaultDirectory() {
  return findFilesFromDirectoryByExtension({
    directoryPath: join(__dirname, "../background"),
    extension: ".mp4",
  }).pipe(Effect.map((images) => images.map((image) => image.path)));
}
