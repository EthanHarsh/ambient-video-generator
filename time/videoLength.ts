import Chance from "chance";
import { Effect, Match } from "effect";
import { hoursToSeconds } from "./tools";
const chance = new Chance();

export function getRandomVideoLengthHours({ min, max } = { min: 1, max: 12 }) {
  return Effect.succeed(chance.integer({ min, max }));
}

export const getRandomVideoLengthSeconds = Match.type<
  { min: number; max: number } | undefined
>().pipe(
  Match.when({ min: Match.number, max: Match.number }, (minMax) =>
    Effect.succeed(chance.integer(minMax)),
  ),
  Match.orElse(() =>
    getRandomVideoLengthHours().pipe(Effect.map(hoursToSeconds)),
  ),
);
