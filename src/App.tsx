import React, { useState } from 'react';
import { AIHapticGenerator } from '@/components/AIHapticGenerator';
import './App.css';

function App() {
  const [generatedVideo, setGeneratedVideo] = useState<File | null>(null);

  const handleVideoGenerated = (file: File) => {
    setGeneratedVideo(file);
    console.log('Video generated:', file.name);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
      <div className="container mx-auto py-8 px-4">
        <header className="text-center mb-8">
          <h1 className="text-4xl font-bold text-cyan-100 mb-2">
            AI Haptic Generator
          </h1>
          <p className="text-cyan-300/70 text-lg">
            Transform your audio and video content into immersive haptic experiences
          </p>
        </header>

        <div className="max-w-4xl mx-auto">
          <AIHapticGenerator onVideoGenerated={handleVideoGenerated} />
          
          {generatedVideo && (
            <div className="mt-8 p-6 bg-gradient-to-br from-green-800/30 to-green-700/30 border border-green-500/30 backdrop-blur-sm rounded-xl">
              <h3 className="text-green-100 text-lg font-semibold mb-2">
                ✅ Video Generated Successfully!
              </h3>
              <p className="text-green-300/70">
                Generated video: {generatedVideo.name}
              </p>
            </div>
          )}
        </div>

        <footer className="text-center mt-12 text-cyan-400/60 text-sm">
          <p>Powered by AI-driven audio analysis and haptic pattern generation</p>
        </footer>
      </div>
    </div>
  );
}

export default App;