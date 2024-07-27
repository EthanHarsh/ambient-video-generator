import { findFileFromDirectoryByExtension, readFileFromDirectoryByExtension } from "./common";
import { join } from 'path';

interface ReadImageFile {
    directoryPath: string;
    extension: '.jpg' | '.png' | '.gif' | '.webp';
}

export function readImage({directoryPath, extension}: ReadImageFile) {
    return readFileFromDirectoryByExtension({directoryPath, extension});
}

export function readDefaultBackgroundImage() {
    return readImage({directoryPath: join(__dirname, '../image'), extension: '.png'});
}

export function findDefaultBackgroundImage() {
    return findFileFromDirectoryByExtension({directoryPath: join(__dirname, '../background'), extension: '.png'});
}
