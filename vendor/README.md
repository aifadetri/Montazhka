# Third-party audio engine

Unmodified browser distributions from npm:
- @ffmpeg/ffmpeg 0.12.15: ffmpeg.js and 814.ffmpeg.js (MIT).
- @ffmpeg/core 0.12.10: ffmpeg-core.js and ffmpeg-core.wasm (GPL-2.0-or-later).

Source code and complete build definitions for these releases: https://github.com/ffmpegwasm/ffmpeg.wasm (release tags n0.12.15 and n0.12.10; packages/ffmpeg and packages/core, Dockerfile, build scripts and codec source references). Distribution: https://www.npmjs.com/package/@ffmpeg/core/v/0.12.10 and https://www.npmjs.com/package/@ffmpeg/ffmpeg/v/0.12.15 .

Upstream source archive for core release: https://github.com/ffmpegwasm/ffmpeg.wasm/archive/refs/tags/n0.12.10.tar.gz . FFmpeg sources: https://github.com/FFmpeg/FFmpeg . Refer to upstream build scripts for exact dependencies and revisions. This application does not modify or relink the engine. Included license texts preserve upstream licensing.
