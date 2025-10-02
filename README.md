# @pitchpro/reference-tones

Reference tone playback library for pitch training applications using Tone.js and Salamander Grand Piano samples.

## Features

- 🎹 **High-quality piano samples**: Yamaha C5 48kHz/24bit Salamander Grand Piano
- 🎵 **15 chromatic notes**: C4 to E5 (261.63Hz - 659.25Hz)
- 🎼 **Automatic pitch shifting**: Single C4.mp3 sample with Tone.js Sampler
- 🌐 **Japanese note names**: ド（低）to ミ（高）support
- 📦 **Lightweight**: ~6KB gzipped (excluding audio samples)
- 🔧 **TypeScript**: Full type definitions included

## Installation

```bash
npm install @pitchpro/reference-tones
```

## Usage

### Basic Usage

```typescript
import { PitchShifter } from '@pitchpro/reference-tones';

// Initialize
const pitchShifter = new PitchShifter({
  baseUrl: '/audio/piano/',  // Path to C4.mp3
  release: 1.5,              // Release time in seconds
  volume: -6                 // Volume in dB
});

await pitchShifter.initialize();

// Play a note
await pitchShifter.playNote('A4', 2);  // A4 for 2 seconds

// Play random note
const noteInfo = await pitchShifter.playRandomNote(2);
console.log(noteInfo);
// { note: 'C4', frequency: 261.63, japaneseName: 'ド（低）' }
```

### Available Notes

```typescript
import { PitchShifter } from '@pitchpro/reference-tones';

// Get all available notes
console.log(PitchShifter.AVAILABLE_NOTES);
/*
[
  { note: 'C4', frequency: 261.63, japaneseName: 'ド（低）' },
  { note: 'C#4', frequency: 277.18, japaneseName: 'ド♯（低）' },
  { note: 'D4', frequency: 293.66, japaneseName: 'レ（低）' },
  { note: 'D#4', frequency: 311.13, japaneseName: 'レ♯（低）' },
  { note: 'E4', frequency: 329.63, japaneseName: 'ミ（低）' },
  { note: 'F4', frequency: 349.23, japaneseName: 'ファ（低）' },
  { note: 'F#4', frequency: 369.99, japaneseName: 'ファ♯（低）' },
  { note: 'G4', frequency: 392.00, japaneseName: 'ソ（低）' },
  { note: 'G#4', frequency: 415.30, japaneseName: 'ソ♯（低）' },
  { note: 'A4', frequency: 440.00, japaneseName: 'ラ（中）' },
  { note: 'A#4', frequency: 466.16, japaneseName: 'ラ♯（中）' },
  { note: 'B4', frequency: 493.88, japaneseName: 'シ（中）' },
  { note: 'C5', frequency: 523.25, japaneseName: 'ド（高）' },
  { note: 'D5', frequency: 587.33, japaneseName: 'レ（高）' },
  { note: 'E5', frequency: 659.25, japaneseName: 'ミ（高）' }
]
*/

// Get note by frequency (finds closest match)
const note = PitchShifter.getNoteByFrequency(440);
console.log(note);  // { note: 'A4', frequency: 440.00, japaneseName: 'ラ（中）' }

// Get specific note info
const noteInfo = PitchShifter.getNoteInfo('C5');
console.log(noteInfo);  // { note: 'C5', frequency: 523.25, japaneseName: 'ド（高）' }
```

### Control Playback

```typescript
// Stop specific note
pitchShifter.stopNote('A4');

// Stop all notes
pitchShifter.stopAll();

// Set volume
pitchShifter.setVolume(-10);  // Set to -10dB

// Check if playing
if (pitchShifter.isCurrentlyPlaying()) {
  console.log('Currently playing...');
}

// Cleanup
pitchShifter.dispose();
```

## API Reference

### `PitchShifter`

#### Constructor

```typescript
new PitchShifter(config?: PitchShifterConfig)
```

**Config Options:**
- `baseUrl?: string` - Base URL for audio samples (default: `/audio/piano/`)
- `release?: number` - Release time in seconds (default: `1.5`)
- `volume?: number` - Volume in dB (default: `-6`)
- `noteRange?: string[]` - Available note range (default: all 15 notes)

#### Methods

##### `initialize(): Promise<void>`
Initialize the PitchShifter system. Must be called before playback.

##### `playNote(note: string, duration?: number, velocity?: number): Promise<void>`
Play a specific note.
- `note`: Note name (e.g., `'C4'`, `'A4'`)
- `duration`: Duration in seconds (default: `2`)
- `velocity`: Velocity 0-1 (default: `0.8`)

##### `playRandomNote(duration?: number): Promise<NoteInfo>`
Play a random note from available range.
- `duration`: Duration in seconds (default: `2`)
- Returns: The note info that was played

##### `stopNote(note: string): void`
Stop specific note immediately.

##### `stopAll(): void`
Stop all currently playing notes.

##### `setVolume(volumeDb: number): void`
Set volume in dB.

##### `isCurrentlyPlaying(): boolean`
Check if currently playing.

##### `dispose(): void`
Dispose of resources.

#### Static Methods

##### `PitchShifter.getNoteInfo(note: string): NoteInfo | undefined`
Get note info by note name.

##### `PitchShifter.getNoteByFrequency(frequency: number): NoteInfo`
Get note info by frequency (finds closest match).

#### Static Properties

##### `PitchShifter.AVAILABLE_NOTES: NoteInfo[]`
Array of all available notes with frequency and Japanese names.

### Types

```typescript
interface PitchShifterConfig {
  baseUrl?: string;
  release?: number;
  volume?: number;
  noteRange?: string[];
}

interface NoteInfo {
  note: string;           // e.g., "C4", "A4"
  frequency: number;      // in Hz
  japaneseName: string;   // e.g., "ド（低）"
}
```

## Integration with PitchPro

This library is designed to work seamlessly with [@pitchpro/audio-processing](https://github.com/kiyopi/pitchpro-audio-processing) for pitch training applications:

```typescript
import { AudioDetectionComponent } from '@pitchpro/audio-processing';
import { PitchShifter } from '@pitchpro/reference-tones';

// Initialize detection
const detector = new AudioDetectionComponent({
  onPitchUpdate: (result) => {
    // Find closest reference note
    const referenceNote = PitchShifter.getNoteByFrequency(result.frequency);
    console.log(`Detected: ${result.frequency}Hz → ${referenceNote.note}`);
  }
});

// Initialize reference tones
const tones = new PitchShifter();
await tones.initialize();

// Play reference tone
await tones.playNote('A4', 2);
```

## Audio Setup

The library requires `C4.mp3` to be available at the configured `baseUrl`. You can:

1. **Copy from this package**:
```bash
cp node_modules/@pitchpro/reference-tones/public/audio/piano/C4.mp3 public/audio/piano/
```

2. **Configure custom path**:
```typescript
const pitchShifter = new PitchShifter({
  baseUrl: '/custom/path/to/audio/'
});
```

3. **Use CDN** (if available):
```typescript
const pitchShifter = new PitchShifter({
  baseUrl: 'https://cdn.example.com/audio/piano/'
});
```

## Technical Details

- **Audio Source**: Salamander Grand Piano (Yamaha C5, 48kHz/24bit)
- **Base Sample**: C4.mp3 (261.63Hz, 214KB)
- **Pitch Shifting**: Tone.js Sampler automatic pitch adjustment
- **Supported Range**: C4 (261.63Hz) to E5 (659.25Hz)
- **Quality**: Professional-grade piano samples with natural decay

## Browser Compatibility

- ✅ Chrome 66+
- ✅ Firefox 61+
- ✅ Safari 14.1+
- ✅ Edge 79+
- ✅ iOS Safari 14.5+

**Note**: Requires user interaction to start AudioContext on iOS/Safari.

## License

MIT

## Credits

- Piano samples: [Salamander Grand Piano](https://archive.org/details/SalamanderGrandPianoV3)
- Audio engine: [Tone.js](https://tonejs.github.io/)
- Part of the [PitchPro](https://github.com/kiyopi/pitchpro-audio-processing) ecosystem

## Related Projects

- [@pitchpro/audio-processing](https://github.com/kiyopi/pitchpro-audio-processing) - Real-time pitch detection library
- [Relative-pitch-app](https://github.com/kiyopi/Relative-pitch-app) - Pitch training application
