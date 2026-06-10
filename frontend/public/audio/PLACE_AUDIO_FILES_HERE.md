# Audio files for the birthday experience

Place the following files in this directory (`frontend/public/audio/`):

| File                | Purpose                                  | Volume | Notes                         |
|---------------------|------------------------------------------|--------|-------------------------------|
| `romantic-bg.mp3`   | Soft looping background music            | 0.25   | Must loop cleanly (no gap)    |
| `correct-chime.mp3` | Sparkle/chime for correct answers        | 0.42   | Short (< 2s), light, feminine |
| `wrong-cute.mp3`    | Gentle boop for wrong answers            | 0.30   | Short (< 1.5s), cute not harsh|
| `final-chime.mp3`   | Magical chime for the final transition   | 0.48   | Short (< 3s), emotional       |

## Format recommendations
- `.mp3` preferred (widest mobile browser support)
- `.m4a` as an alternative (very good iOS support)
- Keep files small: bg music < 3 MB, SFX < 100 KB each
- Compress with tools like `ffmpeg` or online converters

## Example free sources
- freesound.org (search "chime", "sparkle", "piano loop")
- pixabay.com/music (royalty-free)
- zapsplat.com (create a free account)

## If files are missing
The app will continue silently — no errors or crashes. Audio is fully optional.
