# Third-party audio engine

Unmodified browser distributions from npm:
- @ffmpeg/ffmpeg 0.12.15: ffmpeg.js and 814.ffmpeg.js (MIT).
- @ffmpeg/core 0.12.10: ffmpeg-core.js and ffmpeg-core.wasm (GPL-2.0-or-later).

Source code and complete build definitions for these releases: https://github.com/ffmpegwasm/ffmpeg.wasm (release tags n0.12.15 and n0.12.10; packages/ffmpeg and packages/core, Dockerfile, build scripts and codec source references). Distribution: https://www.npmjs.com/package/@ffmpeg/core/v/0.12.10 and https://www.npmjs.com/package/@ffmpeg/ffmpeg/v/0.12.15 .

Upstream source archive for core release: https://github.com/ffmpegwasm/ffmpeg.wasm/archive/refs/tags/n0.12.10.tar.gz . FFmpeg sources: https://github.com/FFmpeg/FFmpeg . Refer to upstream build scripts for exact dependencies and revisions. This application does not modify or relink the engine. Included license texts preserve upstream licensing.

ffmpeg-core.wasm.gz is a lossless gzip representation of the identical unmodified WASM file, used to reduce initial transfer from 32 MB to 10 MB. The browser decompresses it with DecompressionStream; older browsers fall back to the original WASM.

Mediabunny 1.62.1 (unmodified browser bundle mediabunny.mjs), MPL-2.0. Source and license: https://github.com/Vanilagy/mediabunny/tree/v1.62.1 and https://www.npmjs.com/package/mediabunny/v/1.62.1 . Included LICENSE-mediabunny.txt. Used for lazy audio-only demuxing and WebCodecs decoding, with no video frame decoding.
