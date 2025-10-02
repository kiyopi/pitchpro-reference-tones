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
  release: 2.5,              // Release time in seconds
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

## Advanced Usage

### Volume Control Implementation

Implement dynamic volume control in your application:

#### Vanilla JavaScript

```typescript
import { PitchShifter } from '@pitchpro/reference-tones';

const pitchShifter = new PitchShifter();
await pitchShifter.initialize();

// HTML: <input type="range" id="volume" min="-60" max="0" value="-6">
const volumeSlider = document.getElementById('volume');

volumeSlider.addEventListener('input', (e) => {
  const volumeDb = Number(e.target.value);
  pitchShifter.setVolume(volumeDb);

  // Update display
  document.getElementById('volumeDisplay').textContent = `${volumeDb}dB`;
});
```

#### React

```tsx
import { useState, useEffect } from 'react';
import { PitchShifter } from '@pitchpro/reference-tones';

function VolumeControl() {
  const [volume, setVolume] = useState(-6);
  const [pitchShifter] = useState(() => new PitchShifter());

  useEffect(() => {
    pitchShifter.initialize();
  }, []);

  const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newVolume = Number(e.target.value);
    setVolume(newVolume);
    pitchShifter.setVolume(newVolume);
  };

  return (
    <div>
      <input
        type="range"
        min="-60"
        max="0"
        value={volume}
        onChange={handleVolumeChange}
      />
      <span>{volume}dB</span>
    </div>
  );
}
```

#### Vue 3

```vue
<script setup>
import { ref, onMounted } from 'vue';
import { PitchShifter } from '@pitchpro/reference-tones';

const volume = ref(-6);
const pitchShifter = new PitchShifter();

onMounted(async () => {
  await pitchShifter.initialize();
});

const updateVolume = (value) => {
  volume.value = value;
  pitchShifter.setVolume(value);
};
</script>

<template>
  <div>
    <input
      type="range"
      min="-60"
      max="0"
      :value="volume"
      @input="updateVolume($event.target.value)"
    />
    <span>{{ volume }}dB</span>
  </div>
</template>
```

### Multiple Instruments Support

Use different instruments by creating separate instances:

#### Setup Multiple Instruments

1. **Prepare audio samples**:

```
/public/audio/
  ├── piano/C4.mp3
  ├── guitar/C4.mp3
  └── violin/C4.mp3
```

2. **Create instances per instrument**:

```typescript
import { PitchShifter } from '@pitchpro/reference-tones';

const instruments = {
  piano: new PitchShifter({
    baseUrl: '/audio/piano/',
    release: 2.5,  // Natural piano decay
    volume: -6
  }),
  guitar: new PitchShifter({
    baseUrl: '/audio/guitar/',
    release: 1.0,  // Faster decay for guitar
    volume: -4
  }),
  violin: new PitchShifter({
    baseUrl: '/audio/violin/',
    release: 3.0,  // Sustained violin sound
    volume: -5
  })
};

// Initialize all instruments
await Promise.all([
  instruments.piano.initialize(),
  instruments.guitar.initialize(),
  instruments.violin.initialize()
]);
```

3. **Switch instruments dynamically**:

```typescript
let currentInstrument = instruments.piano;

function switchInstrument(name: 'piano' | 'guitar' | 'violin') {
  currentInstrument = instruments[name];
  console.log(`Switched to ${name}`);
}

// Play with current instrument
await currentInstrument.playNote('A4', 2);

// Switch and play
switchInstrument('guitar');
await currentInstrument.playNote('E4', 3);
```

#### Instrument Selector UI Example

```typescript
// HTML: <select id="instrument">...</select>
const instrumentSelector = document.getElementById('instrument');

instrumentSelector.addEventListener('change', (e) => {
  const selected = e.target.value;
  currentInstrument = instruments[selected];
  console.log(`Now using: ${selected}`);
});
```

### Recommended Release Times by Instrument

| Instrument | Release (s) | Characteristics |
|------------|-------------|-----------------|
| **Piano** | 2.5 - 3.0 | Natural decay with resonance |
| **Guitar** | 0.8 - 1.5 | Sharp attack, quick decay |
| **Violin** | 3.0 - 4.0 | Sustained, slow decay |
| **Synth** | 0.5 - 2.0 | Varies by synth type |

**Note**: Adjust `release` values based on your specific audio samples and desired sound.

## API Reference

### `PitchShifter`

#### Constructor

```typescript
new PitchShifter(config?: PitchShifterConfig)
```

**Config Options:**
- `baseUrl?: string` - Base URL for audio samples (default: `/audio/piano/`)
- `release?: number` - Release time in seconds (default: `2.5`)
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

## Device-Specific Volume Optimization

Different devices require different volume levels for optimal playback. Use [@pitchpro/audio-processing](https://github.com/kiyopi/pitchpro-audio-processing) device detection for automatic optimization:

```typescript
import { DeviceDetection } from '@pitchpro/audio-processing';
import { PitchShifter } from '@pitchpro/reference-tones';

// Detect device type
const deviceSpecs = DeviceDetection.getDeviceSpecs();

// Device-optimized volume mapping (in dB)
const volumeMap = {
  'PC': -6,        // Desktop/Laptop
  'iPhone': -3,    // iPhone (louder)
  'iPad': -3,      // iPad (louder)
  'Android': -4    // Android devices
};

// Initialize with device-optimized volume
const pitchShifter = new PitchShifter({
  baseUrl: '/audio/piano/',
  volume: volumeMap[deviceSpecs.deviceType] || -6
});

await pitchShifter.initialize();
```

### ⚠️ iPad Detection Caveat

**Important**: iPads may be detected as `'PC'` instead of `'iPad'` due to Safari's user agent string. Use the following robust detection:

```typescript
import { DeviceDetection } from '@pitchpro/audio-processing';
import { PitchShifter } from '@pitchpro/reference-tones';

function getOptimizedVolume(): number {
  const deviceSpecs = DeviceDetection.getDeviceSpecs();

  // iPad-specific detection (handles misdetection as PC)
  const isIpad = deviceSpecs.deviceType === 'iPad' ||
                 (deviceSpecs.deviceType === 'PC' &&
                  navigator.maxTouchPoints > 0 &&
                  /iPad|Macintosh/.test(navigator.userAgent));

  if (isIpad) {
    return -3;  // iPad optimized volume
  }

  // Standard device mapping
  const volumeMap = {
    'PC': -6,
    'iPhone': -3,
    'Android': -4
  };

  return volumeMap[deviceSpecs.deviceType] || -6;
}

const pitchShifter = new PitchShifter({
  baseUrl: '/audio/piano/',
  volume: getOptimizedVolume()
});

await pitchShifter.initialize();
```

### Device Volume Recommendations

Based on extensive testing with [@pitchpro/audio-processing](https://github.com/kiyopi/pitchpro-audio-processing):

| Device | Volume (dB) | Reason |
|--------|------------|--------|
| **PC/Desktop** | -6 | Standard microphone sensitivity |
| **iPhone** | -3 | Built-in noise cancellation, needs boost |
| **iPad** | -3 | Lower microphone sensitivity, needs boost |
| **Android** | -4 | Varies by manufacturer, middle ground |

**Note**: These values are empirically derived from pitch training application testing. Adjust based on your specific use case.

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
