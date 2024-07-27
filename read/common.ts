import { readdir } from "fs/promises";
import { Effect, pipe } from "effect";
import { extname, join } from "path";
import { readFile } from "fs/promises";

export function getDirectoryContents(directoryPath: string) {
  return Effect.tryPromise({
    try: async () => {
      const fileNames = await readdir(directoryPath);
      return fileNames.map((name) =>
        buildFileMetadata({ directoryPath, name }),
      );
    },
    catch: (unknown) =>
      new Error(`Error reading files from ${directoryPath}: ${unknown}`),
  });
}

export interface FileMetaDataParams {
  directoryPath: string;
  name: string;
}

export interface FileMetaData {
  name: string;
  extension: string;
  path: string;
}
export function buildFileMetadata({ directoryPath, name }: FileMetaDataParams) {
  return {
    name,
    extension: extname(name),
    path: join(directoryPath, name),
  };
}

export interface ReadFileFromDirectory {
  directoryPath: string;
  extension: string;
}

export function readFileFromDirectoryByExtension({
  directoryPath,
  extension,
}: ReadFileFromDirectory) {
  return Effect.gen(function* () {
    const files = yield* getDirectoryContents(directoryPath);
    const file = yield* findFileByExtension({ files, extension });
    return yield* readFileByPath(file.path);
  });
}

export function findFileFromDirectoryByExtension({
  directoryPath,
  extension,
}: ReadFileFromDirectory) {
  return Effect.gen(function* () {
    const files = yield* getDirectoryContents(directoryPath);
    const file = yield* findFileByExtension({ files, extension });
    return file.path;
  });
}

interface FindFileByExtension {
  files: FileMetaData[];
  extension: string;
}
export function findFileByExtension({ files, extension }: FindFileByExtension) {
  return Effect.try({
    try: () => {
      const file = files.find((file) => file.extension === extension);
      if (!file) throw new Error(`No file found with extension ${extension}`);
      return file;
    },
    catch: (unknown) =>
      new Error(`Error finding file with extension ${extension}: ${unknown}`),
  });
}

export function readFileByPath(filePath: string) {
  return Effect.tryPromise({
    try: () => readFile(filePath),
    catch: (unknown) =>
      new Error(`Error reading file from ${filePath}: ${unknown}`),
  });
}
