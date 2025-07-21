# AI Haptic Generator

A React-based application that transforms audio and video content into immersive haptic experiences using AI-powered analysis and pattern generation.

## Features

### 🎵 Audio/Video Upload
- Support for multiple audio formats (MP3, WAV, etc.)
- Support for video formats (MP4, AVI, MOV, etc.)
- Drag-and-drop interface with upload progress tracking
- Real-time audio playback controls

### 🔍 Bass Detection Analysis
- Real-time audio frequency analysis using Web Audio API
- Focus on bass frequencies (20Hz - 250Hz) for haptic generation
- Visual waveform representation with bass peak highlighting
- Comprehensive analytics including average bass level, peak detection, and duration

### 🤖 AI-Powered Haptic Generation
- AI-driven haptic pattern generation based on audio analysis
- Custom AI prompts for personalized haptic experiences
- Multiple haptic types: pulse, vibration, and tap patterns
- Intensity mapping based on audio characteristics

### 🎛️ Haptic Presets
- Pre-built haptic patterns for different content categories:
  - **Action Movie**: Intense haptics for action scenes
  - **Music Rhythm**: Rhythmic patterns following beats
  - **Nature Sounds**: Gentle ambient haptics
  - **Gaming FPS**: Sharp, responsive patterns
  - **Meditation**: Calm, slow pulses
  - **Sports Commentary**: Dynamic sports event haptics

## Technology Stack

- **Frontend**: React 18 with TypeScript
- **Styling**: Tailwind CSS with custom design system
- **Audio Processing**: Web Audio API
- **Icons**: Lucide React
- **Build Tool**: Vite
- **UI Components**: Custom component library with shadcn/ui patterns

## Project Structure

```
src/
├── components/
│   ├── AIHapticGenerator.tsx    # Main component
│   └── ui/                      # UI component library
│       ├── button.tsx
│       ├── input.tsx
│       ├── label.tsx
│       ├── card.tsx
│       ├── progress.tsx
│       └── textarea.tsx
├── hooks/
│   └── useAudioAnalysis.ts      # Custom hook for audio analysis
├── lib/
│   └── utils.ts                 # Utility functions
├── App.tsx                      # Main application component
├── App.css                      # Global styles
└── main.tsx                     # Application entry point
```

## Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd ai-haptic-generator
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm run dev
```

4. Open your browser and navigate to `http://localhost:5173`

## Usage

### Basic Workflow

1. **Upload Content**: Drag and drop or click to upload an audio/video file
2. **Analyze Audio**: Click "Analyze Bass Frequencies" to process the audio
3. **Generate Haptics**: Optionally add an AI prompt and click "Generate AI Haptic Patterns"
4. **Review Results**: View generated haptic patterns and their properties

### AI Prompt Examples

- `"intense for action scenes"` - Creates strong, impactful haptic patterns
- `"gentle and rhythmic"` - Generates soft, rhythmic feedback
- `"match the music beats"` - Aligns haptics with musical rhythm
- `"gaming feedback"` - Optimized for gaming experiences

## Component Architecture

### AIHapticGenerator Component

The main component handles:
- File upload and validation
- Audio analysis coordination
- AI haptic pattern generation
- UI state management
- Real-time visualization

### useAudioAnalysis Hook

A custom hook providing:
- File upload functionality with progress tracking
- Audio analysis with Web Audio API integration
- AI haptic pattern generation (currently mocked)
- Preset management
- Error handling and loading states

### UI Components

A comprehensive set of reusable UI components built with:
- Consistent design system
- Accessibility considerations
- TypeScript support
- Tailwind CSS styling

## Audio Analysis Details

The application performs sophisticated audio analysis:

1. **Web Audio API Integration**: Creates audio context and analyzer nodes
2. **Frequency Analysis**: Uses FFT (Fast Fourier Transform) for frequency domain analysis
3. **Bass Detection**: Focuses on low-frequency range (20Hz-250Hz)
4. **Real-time Processing**: Continuous analysis during audio playback
5. **Data Visualization**: Canvas-based waveform rendering

## Haptic Pattern Generation

The AI-powered haptic generation considers:

- **Bass Frequency Intensity**: Higher bass levels create stronger haptics
- **Temporal Mapping**: Haptic timing aligned with audio timeline
- **Pattern Types**: Multiple haptic feedback types (pulse, vibration, tap)
- **AI Prompt Integration**: User input influences pattern characteristics
- **Intensity Scaling**: Dynamic intensity based on audio analysis

## Development

### Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint

### Adding New Features

1. **New Haptic Types**: Extend the `HapticPattern` interface in `useAudioAnalysis.ts`
2. **Additional Analysis**: Modify the audio analysis logic in `performAudioAnalysis`
3. **Custom Presets**: Add new presets to the `mockAPI.getPresets` function
4. **UI Components**: Create new components in the `src/components/ui/` directory

## Browser Compatibility

- **Web Audio API**: Supported in all modern browsers
- **File API**: Full support for drag-and-drop file operations
- **Canvas API**: Used for real-time audio visualization
- **ES2020**: Modern JavaScript features supported

## Performance Considerations

- **Audio Processing**: Optimized for real-time analysis without blocking UI
- **Memory Management**: Proper cleanup of audio contexts and intervals
- **File Handling**: Efficient handling of large audio/video files
- **Rendering**: Optimized canvas rendering for smooth visualizations

## Future Enhancements

- [ ] Backend integration for actual AI processing
- [ ] Export haptic patterns to various formats
- [ ] Advanced audio analysis (mid/treble frequencies)
- [ ] Real-time haptic playback
- [ ] Cloud-based pattern storage
- [ ] Multi-channel haptic support
- [ ] Machine learning model integration

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## License

This project is licensed under the MIT License. See the LICENSE file for details.

## Acknowledgments

- Built with React and TypeScript
- UI components inspired by shadcn/ui
- Icons provided by Lucide React
- Styling powered by Tailwind CSS