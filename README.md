# ambient-video-generator
Generate multiple ambient videos from an audio file and a directory of images or videos.

## How does it work?
1. Create a directory in the root of the project named `audio`.
2. Add an audio loop into the `audio` directory. (Only `.wav` is supported at this time)
3. Create a directory in the root of the project named `background`.
4. Add photos or videos into the `background` directory.
5. Run `bun generate.ts --image=multi-still` or `bun generate.ts --image=multi-video`
