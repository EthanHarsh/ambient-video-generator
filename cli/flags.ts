import { Effect } from "effect";

export function getFlags() {
  return Effect.sync(() => {
    const args = process.argv.slice(2);
    return args.filter((arg) => arg.startsWith("--"));
  });
}

export function getImageFlag(args: string[]) {
  return Effect.sync(() => {
    return args.find((arg) => arg.startsWith("--image="))?.split("=")[1];
  });
}
