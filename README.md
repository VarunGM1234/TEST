# Haptic Video Editor

An AI-powered haptic video editor that transforms audio and video content into immersive haptic experiences. Upload your files, analyze bass frequencies, and generate intelligent haptic feedback patterns that synchronize perfectly with your content.

## 🚀 Features

### 🎵 Advanced Audio Analysis
- **Real-time Bass Detection**: Analyzes bass frequencies (20Hz - 250Hz) to identify impact points
- **Frequency Visualization**: Interactive canvas showing bass patterns and intensity over time
- **Smart Audio Processing**: Supports both audio-only files and video files with audio tracks

### 🤖 AI-Powered Haptic Generation
- **Intelligent Pattern Creation**: AI algorithms generate haptic patterns based on audio analysis
- **Customizable Prompts**: Describe your desired haptic experience with natural language
- **Multiple Haptic Types**: Support for pulse, vibration, impact, and rumble patterns
- **Intensity Mapping**: Automatic intensity scaling based on audio dynamics

### 🎬 Video Processing & Export
- **Multi-Format Support**: Process MP4, WebM, AVI, MOV video files
- **Quality Options**: Choose from low, medium, or high-quality output
- **Haptic Metadata Embedding**: Seamlessly embed haptic data into video files
- **Custom Processing Options**: Adjust haptic intensity and audio inclusion

### 🎛️ Preset System
- **Pre-built Haptic Presets**: 
  - **Action Intense**: Strong impacts for action scenes
  - **Music Rhythmic**: Rhythmic pulses for musical content
  - **Ambient Gentle**: Soft vibrations for ambient content
  - **Gaming Explosive**: High-intensity patterns for gaming

### 🔧 Professional Tools
- **Progress Tracking**: Real-time progress indicators for all operations
- **File Management**: Easy upload, preview, and download functionality
- **Metadata Extraction**: Read existing haptic data from processed videos
- **Responsive Design**: Works seamlessly on desktop and mobile devices

## 🛠️ How It Works

### 1. Upload Your Content
- Drag and drop audio/video files or click to browse
- Supported formats: MP3, WAV, MP4, AVI, MOV, WebM
- Automatic file type detection and processing

### 2. Analyze Audio Frequencies
- Click "Analyze Bass Frequencies" to start real-time analysis
- View bass frequency visualization in the interactive canvas
- See detailed metrics: average bass level, peak count, duration

### 3. Generate Haptic Patterns
Choose from two approaches:

**AI Generation**:
- Use natural language prompts to describe desired haptic feedback
- AI analyzes audio patterns and creates matching haptic sequences
- Examples: "intense for action scenes", "gentle and rhythmic", "match the music beats"

**Preset Selection**:
- Choose from professionally crafted haptic presets
- Each preset optimized for specific content types
- Instant application with preview capabilities

### 4. Process & Export
- Configure output settings: format, quality, haptic intensity
- Generate haptic-enabled video with embedded metadata
- Download your processed video ready for haptic playback

## 🎯 Use Cases

### 🎮 Gaming Content
Create immersive gaming videos with haptic feedback that matches explosions, impacts, and action sequences.

### 🎵 Music Videos
Generate rhythmic haptic patterns that sync with beats, bass drops, and musical dynamics.

### 🎬 Film & Animation
Add subtle haptic cues to enhance storytelling and create more engaging viewer experiences.

### 📱 Mobile Content
Optimize videos for mobile devices with haptic capabilities, creating tactile social media content.

### 🎓 Educational Content
Use haptic feedback to emphasize important points and create memorable learning experiences.

## 🔬 Technical Implementation

### Audio Analysis Engine
- **Web Audio API**: Real-time frequency analysis using AnalyserNode
- **FFT Processing**: 2048-point Fast Fourier Transform for precise frequency detection
- **Bass Isolation**: Focused analysis on 20Hz-250Hz range for optimal haptic mapping
- **Temporal Tracking**: Millisecond-precision timestamp recording for pattern synchronization

### AI Pattern Generation
- **Frequency-to-Haptic Mapping**: Intelligent algorithms convert audio characteristics to haptic events
- **Natural Language Processing**: AI prompt interpretation for customized haptic experiences
- **Pattern Types**: 
  - **Impact**: Sharp, intense bursts (150ms duration)
  - **Pulse**: Rhythmic beats (200ms duration)
  - **Vibration**: Sustained gentle feedback (300ms duration)
  - **Rumble**: Low-frequency extended patterns (400ms duration)

### Video Processing Pipeline
- **Metadata Embedding**: Custom haptic metadata format with version control
- **Binary Integration**: Seamless haptic data integration without affecting video playback
- **Format Preservation**: Maintains original video quality and codec compatibility
- **Extraction Capability**: Read and modify existing haptic data in processed videos

## 🚀 Getting Started

### Prerequisites
- Node.js 18+ and npm/yarn
- Modern web browser with Web Audio API support
- Sufficient storage for video processing

### Installation
```bash
# Clone the repository
git clone https://github.com/your-org/haptic-video-editor.git
cd haptic-video-editor

# Install dependencies
npm install

# Start development server
npm run dev
```

### Usage
1. Open http://localhost:5173 in your browser
2. Upload an audio or video file
3. Analyze the audio frequencies
4. Generate haptic patterns using AI or presets
5. Configure export settings
6. Process and download your haptic video

## 🎨 UI/UX Features

- **Dark Theme**: Sleek dark interface optimized for video editing
- **Gradient Accents**: Cyan and purple gradients for visual appeal
- **Interactive Elements**: Hover effects and smooth transitions
- **Progress Visualization**: Real-time progress bars for all operations
- **Responsive Design**: Mobile-friendly interface with touch support
- **Accessibility**: Keyboard navigation and screen reader support

## 📊 Performance Optimizations

- **Streaming Processing**: Handle large video files without memory issues
- **Web Workers**: Background processing for intensive operations
- **Lazy Loading**: Component-based loading for faster initial render
- **Efficient Algorithms**: Optimized FFT and pattern generation algorithms
- **Memory Management**: Automatic cleanup of temporary files and data

## 🔮 Future Enhancements

- **Real-time Preview**: Live haptic feedback simulation during editing
- **Cloud Processing**: Server-side video processing for larger files
- **Collaboration Tools**: Share and collaborate on haptic video projects
- **Advanced AI Models**: More sophisticated haptic pattern generation
- **Hardware Integration**: Direct device haptic feedback testing
- **Batch Processing**: Process multiple files simultaneously

## 📄 License

MIT License - see LICENSE file for details.

## 🤝 Contributing

Contributions are welcome! Please read our contributing guidelines and submit pull requests for any improvements.

## 🐛 Issues & Support

Report issues on GitHub or contact our support team for assistance with the haptic video editor.

---

**Transform your videos into immersive haptic experiences with AI-powered precision!** 🎬✨