import React, { useState } from 'react';
import { AIHapticGenerator } from './components/AIHapticGenerator';
import { Video, Zap, Music } from 'lucide-react';

function App() {
  const [generatedVideo, setGeneratedVideo] = useState<File | null>(null);

  const handleVideoGenerated = (file: File) => {
    setGeneratedVideo(file);
    console.log('Haptic video generated:', file);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      {/* Header */}
      <header className="bg-slate-800/50 backdrop-blur-sm border-b border-cyan-500/20">
        <div className="container mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-gradient-to-r from-cyan-500 to-blue-500 rounded-lg">
                <Zap className="h-8 w-8 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-white">Haptic Video Editor</h1>
                <p className="text-cyan-300 text-sm">AI-powered haptic feedback generation</p>
              </div>
            </div>
            <div className="flex items-center space-x-4 text-cyan-300">
              <div className="flex items-center space-x-2">
                <Music className="h-5 w-5" />
                <span className="text-sm">Audio Analysis</span>
              </div>
              <div className="flex items-center space-x-2">
                <Video className="h-5 w-5" />
                <span className="text-sm">Video Processing</span>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          {/* Introduction */}
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold text-white mb-4">
              Transform Your Videos with AI-Generated Haptic Feedback
            </h2>
            <p className="text-cyan-300/80 text-lg max-w-2xl mx-auto">
              Upload your audio or video files, analyze the bass frequencies, and generate 
              immersive haptic patterns using advanced AI. Create videos that you can feel!
            </p>
          </div>

          {/* Features Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <div className="bg-slate-800/30 backdrop-blur-sm border border-cyan-500/20 rounded-xl p-6 text-center">
              <div className="w-12 h-12 bg-gradient-to-r from-cyan-500 to-blue-500 rounded-lg mx-auto mb-4 flex items-center justify-center">
                <Music className="h-6 w-6 text-white" />
              </div>
              <h3 className="text-cyan-100 font-semibold mb-2">Bass Analysis</h3>
              <p className="text-cyan-300/70 text-sm">
                Advanced frequency analysis to detect bass patterns and audio intensity
              </p>
            </div>

            <div className="bg-slate-800/30 backdrop-blur-sm border border-cyan-500/20 rounded-xl p-6 text-center">
              <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-pink-500 rounded-lg mx-auto mb-4 flex items-center justify-center">
                <Zap className="h-6 w-6 text-white" />
              </div>
              <h3 className="text-cyan-100 font-semibold mb-2">AI Generation</h3>
              <p className="text-cyan-300/70 text-sm">
                Smart AI algorithms create haptic patterns that match your content perfectly
              </p>
            </div>

            <div className="bg-slate-800/30 backdrop-blur-sm border border-cyan-500/20 rounded-xl p-6 text-center">
              <div className="w-12 h-12 bg-gradient-to-r from-green-500 to-emerald-500 rounded-lg mx-auto mb-4 flex items-center justify-center">
                <Video className="h-6 w-6 text-white" />
              </div>
              <h3 className="text-cyan-100 font-semibold mb-2">Video Export</h3>
              <p className="text-cyan-300/70 text-sm">
                Export high-quality videos with embedded haptic metadata for playback
              </p>
            </div>
          </div>

          {/* Main Editor Component */}
          <AIHapticGenerator onVideoGenerated={handleVideoGenerated} />

          {/* Generated Video Preview */}
          {generatedVideo && (
            <div className="mt-8 bg-gradient-to-br from-green-800/30 to-emerald-700/30 border border-green-500/30 backdrop-blur-sm rounded-xl p-6">
              <h3 className="text-green-100 font-semibold mb-4 flex items-center">
                <Video className="h-5 w-5 mr-2" />
                Generated Haptic Video
              </h3>
              <div className="bg-slate-900/50 rounded-lg p-4">
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <p className="text-green-100 font-medium">{generatedVideo.name}</p>
                    <p className="text-green-300/70 text-sm">
                      Size: {(generatedVideo.size / (1024 * 1024)).toFixed(2)} MB
                    </p>
                  </div>
                  <div className="text-green-400 text-sm">
                    ✓ Haptic metadata embedded
                  </div>
                </div>
                <video
                  src={URL.createObjectURL(generatedVideo)}
                  controls
                  className="w-full max-h-64 rounded"
                />
              </div>
            </div>
          )}
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-slate-800/50 backdrop-blur-sm border-t border-cyan-500/20 mt-16">
        <div className="container mx-auto px-4 py-6">
          <div className="text-center text-cyan-300/60">
            <p>© 2024 Haptic Video Editor - Experience videos like never before</p>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default App;