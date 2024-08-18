import { videoBackgroundGenerator } from './videoBackground';
import { stillBackgroundGenerator } from './stillBackground';

export const generators = {
    stillBackground: stillBackgroundGenerator,
    videoBackground: videoBackgroundGenerator,
}
