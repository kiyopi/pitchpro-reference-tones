# Release Notes - @pitchpro/reference-tones v1.0.0

**Release Date**: 2025-10-02
**Status**: Initial Release 🎉

## 🎹 Overview

`@pitchpro/reference-tones` is a lightweight reference tone playback library for pitch training applications. Built on Tone.js Sampler with professional-grade Salamander Grand Piano samples, it provides accurate pitch shifting across 15 chromatic notes (C4-E5).

## ✨ Features

### Core Functionality
- **🎼 Automatic Pitch Shifting**: Single C4.mp3 sample with Tone.js Sampler
- **🎵 15 Chromatic Notes**: C4 to E5 (261.63Hz - 659.25Hz)
- **🇯🇵 Japanese Note Names**: ド（低）to ミ（高）support
- **🎹 High-Quality Audio**: Yamaha C5 48kHz/24bit Salamander Grand Piano
- **⚡ Lightweight**: ~6KB gzipped (excluding audio samples)
- **🔧 TypeScript**: Full type definitions included

### API Highlights

#### PitchShifter Class
```typescript
const pitchShifter = new PitchShifter({
  baseUrl: '/audio/piano/',
  release: 2.5,  // Natural piano decay
  volume: -6     // Volume in dB
});

await pitchShifter.initialize();
await pitchShifter.playNote('A4', 2);  // Play A4 for 2 seconds
```

#### Key Methods
- `playNote(note, duration, velocity)` - Play specific note
- `playRandomNote(duration)` - Play random note from range
- `setVolume(volumeDb)` - Adjust volume dynamically
- `stopAll()` - Stop all playing notes
- `getNoteByFrequency(frequency)` - Find closest note

### Device Optimization Support

Built-in support for device-specific volume optimization using [@pitchpro/audio-processing](https://github.com/kiyopi/pitchpro-audio-processing):

```typescript
import { DeviceDetection } from '@pitchpro/audio-processing';

const volumeMap = {
  'PC': -6,
  'iPhone': -3,
  'iPad': -3,
  'Android': -4
};

const pitchShifter = new PitchShifter({
  volume: volumeMap[DeviceDetection.getDeviceSpecs().deviceType] || -6
});
```

**⚠️ iPad Detection Caveat**: iPads may be detected as 'PC' - see README for robust detection workaround.

### Multiple Instruments Support

Create separate instances for different instruments:

```typescript
const instruments = {
  piano: new PitchShifter({ baseUrl: '/audio/piano/', release: 2.5 }),
  guitar: new PitchShifter({ baseUrl: '/audio/guitar/', release: 1.0 }),
  violin: new PitchShifter({ baseUrl: '/audio/violin/', release: 3.0 })
};
```

## 📦 Package Information

### Installation
```bash
npm install @pitchpro/reference-tones
```

### Bundle Sizes
- **ESM**: 5.62KB (gzipped: 1.97KB)
- **CommonJS**: 4.24KB (gzipped: 1.65KB)
- **TypeScript Definitions**: 2.4KB
- **Audio Sample**: C4.mp3 (214KB)

### Module Formats
- ✅ ES Modules (`index.js`)
- ✅ CommonJS (`index.cjs`)
- ✅ TypeScript Definitions (`index.d.ts`)
- ✅ Source Maps included

## 📚 Documentation

### Comprehensive Guides
- **API Reference**: Complete method and type documentation
- **Volume Control**: Implementation examples for Vanilla JS, React, Vue 3
- **Multiple Instruments**: Setup and switching guide
- **Device Optimization**: Cross-device volume adjustment
- **Release Time Recommendations**: Instrument-specific settings

### Recommended Release Times

| Instrument | Release (s) | Characteristics |
|------------|-------------|-----------------|
| **Piano** | 2.5 - 3.0 | Natural decay with resonance |
| **Guitar** | 0.8 - 1.5 | Sharp attack, quick decay |
| **Violin** | 3.0 - 4.0 | Sustained, slow decay |
| **Synth** | 0.5 - 2.0 | Varies by synth type |

## 🌐 Browser Compatibility

- ✅ Chrome 66+
- ✅ Firefox 61+
- ✅ Safari 14.1+
- ✅ Edge 79+
- ✅ iOS Safari 14.5+

**Note**: Requires user interaction to start AudioContext on iOS/Safari.

## 🔄 Integration

### With PitchPro Audio Processing

Seamless integration with [@pitchpro/audio-processing](https://github.com/kiyopi/pitchpro-audio-processing):

```typescript
import { AudioDetectionComponent } from '@pitchpro/audio-processing';
import { PitchShifter } from '@pitchpro/reference-tones';

// Detection
const detector = new AudioDetectionComponent({
  onPitchUpdate: (result) => {
    const refNote = PitchShifter.getNoteByFrequency(result.frequency);
    console.log(`Detected: ${result.frequency}Hz → ${refNote.note}`);
  }
});

// Reference tones
const tones = new PitchShifter();
await tones.initialize();
await tones.playNote('A4', 2);
```

### With Relative-pitch-app

Designed for integration with [Relative-pitch-app](https://github.com/kiyopi/Relative-pitch-app) training modes.

## 🛠️ Technical Details

### Audio Source
- **Sample**: Salamander Grand Piano
- **Instrument**: Yamaha C5
- **Quality**: 48kHz/24bit
- **Base Note**: C4.mp3 (261.63Hz)

### Pitch Shifting
- **Engine**: Tone.js Sampler
- **Method**: Automatic pitch adjustment from C4 base
- **Range**: C4 (261.63Hz) to E5 (659.25Hz)
- **Quality**: Professional-grade with natural decay

### Audio Processing
- **Release Control**: Configurable decay time (default: 2.5s)
- **Volume Control**: Dynamic dB adjustment (-60 to 0)
- **Velocity Support**: Note intensity control (0-1)

## 📝 Files Included

```
@pitchpro/reference-tones/
├── dist/
│   ├── index.js           # ESM bundle
│   ├── index.cjs          # CommonJS bundle
│   ├── index.d.ts         # TypeScript definitions
│   └── *.map              # Source maps
├── public/
│   └── audio/piano/
│       └── C4.mp3         # Piano sample (214KB)
├── README.md              # Complete documentation
└── package.json           # Package metadata
```

## 🙏 Credits

- **Piano Samples**: [Salamander Grand Piano](https://archive.org/details/SalamanderGrandPianoV3)
- **Audio Engine**: [Tone.js](https://tonejs.github.io/)
- **Ecosystem**: Part of [PitchPro](https://github.com/kiyopi/pitchpro-audio-processing)

## 📄 License

MIT

## 🔗 Related Projects

- [@pitchpro/audio-processing](https://github.com/kiyopi/pitchpro-audio-processing) - Real-time pitch detection library
- [Relative-pitch-app](https://github.com/kiyopi/Relative-pitch-app) - Pitch training application

## 📮 Links

- **Repository**: https://github.com/kiyopi/pitchpro-reference-tones
- **Issues**: https://github.com/kiyopi/pitchpro-reference-tones/issues
- **NPM**: https://www.npmjs.com/package/@pitchpro/reference-tones (coming soon)

---

**Released with ❤️ by the PitchPro Team**
