import React, { useState, useRef, useEffect } from 'react';
import { Sparkles, Loader2, Upload, Music, Zap, AudioWaveform } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Textarea } from '@/components/ui/textarea';
import { useAudioAnalysis, type AudioAnalysisData, type HapticPattern } from '@/hooks/useAudioAnalysis';

interface AIHapticGeneratorProps {
  onVideoGenerated: (file: File) => void;
}

export const AIHapticGenerator: React.FC<AIHapticGeneratorProps> = ({ onVideoGenerated }) => {
  const [audioFile, setAudioFile] = useState<File | null>(null);
  const [audioFileId, setAudioFileId] = useState<string | null>(null);
  const [analysisId, setAnalysisId] = useState<string | null>(null);
  const [audioAnalysis, setAudioAnalysis] = useState<AudioAnalysisData | null>(null);
  const [hapticPatterns, setHapticPatterns] = useState<HapticPattern[]>([]);
  const [analysisProgress, setAnalysisProgress] = useState(0);
  const [aiPrompt, setAiPrompt] = useState('');
  const [presets, setPresets] = useState<any[]>([]);
  
  const audioRef = useRef<HTMLAudioElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const analyzerRef = useRef<AnalyserNode | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const {
    uploadAudioFile,
    analyzeAudio,
    generateHapticPatterns,
    getHapticPresets,
    getUserHapticPatterns,
    isAnalyzing,
    isGeneratingHaptics,
    uploadProgress,
  } = useAudioAnalysis();

  useEffect(() => {
    loadPresets();
  }, []);

  const loadPresets = async () => {
    const presetsData = await getHapticPresets();
    setPresets(presetsData);
  };

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file && (file.type.startsWith('audio/') || file.type.startsWith('video/'))) {
      setAudioFile(file);
      setAudioAnalysis(null);
      setHapticPatterns([]);
      setAnalysisId(null);
      
      // Upload file to backend
      const fileId = await uploadAudioFile(file);
      setAudioFileId(fileId);
    }
  };

  const performAudioAnalysis = async () => {
    if (!audioFile || !audioRef.current || !audioFileId) return;

    setAnalysisProgress(0);

    try {
      const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
      const source = audioContext.createMediaElementSource(audioRef.current);
      const analyzer = audioContext.createAnalyser();
      
      analyzer.fftSize = 2048;
      source.connect(analyzer);
      analyzer.connect(audioContext.destination);
      analyzerRef.current = analyzer;

      const bufferLength = analyzer.frequencyBinCount;
      const dataArray = new Uint8Array(bufferLength);
      
      const bassFrequencies: number[] = [];
      const timeStamps: number[] = [];
      const intensity: number[] = [];

      // Real-time analysis simulation
      const analysisInterval = setInterval(() => {
        analyzer.getByteFrequencyData(dataArray);
        
        // Focus on bass frequencies (20Hz - 250Hz)
        const bassRange = dataArray.slice(0, Math.floor(bufferLength * 0.1));
        const bassLevel = bassRange.reduce((sum, val) => sum + val, 0) / bassRange.length;
        
        bassFrequencies.push(bassLevel);
        timeStamps.push(Date.now());
        intensity.push(bassLevel / 255);
        
        setAnalysisProgress(prev => Math.min(prev + 2, 95));
      }, 100);

      // Complete analysis after 5 seconds
      setTimeout(async () => {
        clearInterval(analysisInterval);
        setAnalysisProgress(100);
        
        const analysisData: AudioAnalysisData = {
          bassFrequencies,
          timeStamps,
          intensity,
          duration: audioRef.current?.duration || 0
        };
        
        setAudioAnalysis(analysisData);
        drawVisualization(analysisData);
        
        // Store analysis in backend
        const newAnalysisId = await analyzeAudio(audioFileId, analysisData);
        setAnalysisId(newAnalysisId);
      }, 5000);

    } catch (error) {
      console.error('Audio analysis failed:', error);
    }
  };

  const drawVisualization = (analysis: AudioAnalysisData) => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    canvas.width = canvas.offsetWidth;
    canvas.height = canvas.offsetHeight;

    // Clear canvas
    ctx.fillStyle = '#0f172a';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Draw bass waveform
    ctx.strokeStyle = '#22d3ee';
    ctx.lineWidth = 2;
    ctx.beginPath();

    const step = canvas.width / analysis.bassFrequencies.length;
    analysis.bassFrequencies.forEach((freq, index) => {
      const x = index * step;
      const y = canvas.height - (freq / 255) * canvas.height;
      
      if (index === 0) {
        ctx.moveTo(x, y);
      } else {
        ctx.lineTo(x, y);
      }
    });
    
    ctx.stroke();

    // Highlight bass peaks
    ctx.fillStyle = '#22d3ee';
    analysis.bassFrequencies.forEach((freq, index) => {
      if (freq > 150) {
        const x = index * step;
        const y = canvas.height - (freq / 255) * canvas.height;
        ctx.beginPath();
        ctx.arc(x, y, 3, 0, 2 * Math.PI);
        ctx.fill();
      }
    });
  };

  const generateAIHaptics = async () => {
    if (!audioAnalysis || !analysisId) return;

    const patterns = await generateHapticPatterns(analysisId, audioAnalysis, aiPrompt);
    if (patterns) {
      setHapticPatterns(patterns);
    }
  };

  return (
    <div className="space-y-6">
      {/* Audio/Video Upload */}
      <Card className="bg-gradient-to-br from-slate-800/30 to-slate-700/30 border-cyan-500/30 backdrop-blur-sm">
        <CardHeader>
          <CardTitle className="text-cyan-100 flex items-center space-x-2">
            <Upload className="h-5 w-5 text-cyan-400" />
            <span>Upload Audio/Video</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div 
            className="border-2 border-dashed border-cyan-500/40 rounded-xl p-8 text-center hover:border-cyan-400/60 transition-all duration-300 cursor-pointer"
            onClick={() => fileInputRef.current?.click()}
          >
            <Music className="h-12 w-12 text-cyan-400 mx-auto mb-4" />
            <p className="text-cyan-100 mb-2">Upload audio or video file</p>
            <p className="text-cyan-300/70 text-sm">Drag and drop or click to browse</p>
            <div className="mt-3 text-cyan-400/60 text-xs">
              Supported: MP3, WAV, MP4, AVI, MOV
            </div>
          </div>
          <input
            ref={fileInputRef}
            type="file"
            accept="audio/*,video/*"
            onChange={handleFileUpload}
            className="hidden"
          />
          
          {audioFile && (
            <div className="mt-4 p-4 bg-slate-800/50 rounded-lg border border-cyan-500/20">
              <p className="text-cyan-100 text-sm mb-2">Selected: {audioFile.name}</p>
              {uploadProgress > 0 && uploadProgress < 100 && (
                <div className="mb-2">
                  <Progress value={uploadProgress} className="w-full" />
                  <p className="text-cyan-400/60 text-xs mt-1">Uploading... {uploadProgress}%</p>
                </div>
              )}
              <audio
                ref={audioRef}
                src={URL.createObjectURL(audioFile)}
                controls
                className="w-full"
              />
            </div>
          )}
        </CardContent>
      </Card>

      {/* Audio Analysis */}
      {audioFile && audioFileId && (
        <Card className="bg-gradient-to-br from-slate-800/30 to-slate-700/30 border-cyan-500/30 backdrop-blur-sm">
          <CardHeader>
            <CardTitle className="text-cyan-100 flex items-center space-x-2">
              <AudioWaveform className="h-5 w-5 text-cyan-400" />
              <span>Bass Detection Analysis</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <Button
              onClick={performAudioAnalysis}
              disabled={isAnalyzing}
              className="w-full mb-4 bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-600 hover:to-blue-600"
            >
              {isAnalyzing ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Analyzing Audio...
                </>
              ) : (
                <>
                  <AudioWaveform className="h-4 w-4 mr-2" />
                  Analyze Bass Frequencies
                </>
              )}
            </Button>

            {isAnalyzing && (
              <div className="mb-4">
                <Label className="text-cyan-300 text-sm mb-2 block">Analysis Progress</Label>
                <Progress value={analysisProgress} className="w-full" />
                <p className="text-cyan-400/60 text-xs mt-1">{analysisProgress}% Complete</p>
              </div>
            )}

            {audioAnalysis && (
              <div className="space-y-4">
                <div>
                  <Label className="text-cyan-300 text-sm mb-2 block">Bass Frequency Visualization</Label>
                  <canvas
                    ref={canvasRef}
                    className="w-full h-32 bg-slate-900/50 rounded-lg border border-cyan-500/20"
                  />
                </div>
                
                <div className="grid grid-cols-3 gap-4 text-center">
                  <div className="p-3 bg-slate-800/50 rounded-lg border border-cyan-500/20">
                    <p className="text-cyan-400 text-xs">Avg Bass Level</p>
                    <p className="text-cyan-100 text-lg font-semibold">
                      {Math.round(audioAnalysis.bassFrequencies.reduce((a, b) => a + b, 0) / audioAnalysis.bassFrequencies.length)}
                    </p>
                  </div>
                  <div className="p-3 bg-slate-800/50 rounded-lg border border-cyan-500/20">
                    <p className="text-cyan-400 text-xs">Bass Peaks</p>
                    <p className="text-cyan-100 text-lg font-semibold">
                      {audioAnalysis.bassFrequencies.filter(f => f > 150).length}
                    </p>
                  </div>
                  <div className="p-3 bg-slate-800/50 rounded-lg border border-cyan-500/20">
                    <p className="text-cyan-400 text-xs">Duration</p>
                    <p className="text-cyan-100 text-lg font-semibold">
                      {Math.round((audioAnalysis.duration || audioAnalysis.timeStamps.length / 10))}s
                    </p>
                  </div>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      )}

      {/* AI Haptic Generation */}
      {audioAnalysis && analysisId && (
        <Card className="bg-gradient-to-br from-slate-800/30 to-slate-700/30 border-cyan-500/30 backdrop-blur-sm">
          <CardHeader>
            <CardTitle className="text-cyan-100 flex items-center space-x-2">
              <Zap className="h-5 w-5 text-cyan-400" />
              <span>AI Haptic Generation</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div>
                <Label className="text-cyan-300 text-sm mb-2 block">
                  AI Prompt (Optional)
                </Label>
                <Textarea
                  value={aiPrompt}
                  onChange={(e) => setAiPrompt(e.target.value)}
                  placeholder="Describe the type of haptic feedback you want (e.g., 'intense for action scenes', 'gentle and rhythmic', 'match the music beats')..."
                  className="bg-slate-800/50 border-cyan-500/30 text-cyan-100 placeholder:text-cyan-400/50"
                  rows={3}
                />
              </div>

              <Button
                onClick={generateAIHaptics}
                disabled={isGeneratingHaptics}
                className="w-full mb-4 bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600"
              >
                {isGeneratingHaptics ? (
                  <>
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    Generating AI Haptics...
                  </>
                ) : (
                  <>
                    <Sparkles className="h-4 w-4 mr-2" />
                    Generate AI Haptic Patterns
                  </>
                )}
              </Button>
            </div>

            {hapticPatterns.length > 0 && (
              <div className="space-y-3">
                <Label className="text-cyan-300 text-sm">Generated Haptic Patterns ({hapticPatterns.length})</Label>
                <div className="max-h-40 overflow-y-auto space-y-2">
                  {hapticPatterns.slice(0, 10).map((pattern, index) => (
                    <div key={index} className="flex items-center justify-between p-2 bg-slate-800/50 rounded border border-cyan-500/20">
                      <div className="flex items-center space-x-3">
                        <div className={`w-3 h-3 rounded-full ${
                          pattern.type === 'pulse' ? 'bg-red-400' :
                          pattern.type === 'vibration' ? 'bg-yellow-400' : 'bg-blue-400'
                        }`} />
                        <span className="text-cyan-100 text-sm capitalize">{pattern.type}</span>
                      </div>
                      <div className="text-cyan-400 text-xs">
                        {Math.round(pattern.timestamp)}ms | {Math.round(pattern.intensity * 100)}%
                      </div>
                    </div>
                  ))}
                </div>
                {hapticPatterns.length > 10 && (
                  <p className="text-cyan-400/60 text-xs text-center">
                    ... and {hapticPatterns.length - 10} more patterns
                  </p>
                )}
              </div>
            )}
          </CardContent>
        </Card>
      )}

      {/* Haptic Presets */}
      {presets.length > 0 && (
        <Card className="bg-gradient-to-br from-slate-800/30 to-slate-700/30 border-cyan-500/30 backdrop-blur-sm">
          <CardHeader>
            <CardTitle className="text-cyan-100 flex items-center space-x-2">
              <Sparkles className="h-5 w-5 text-cyan-400" />
              <span>Haptic Presets</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {presets.map((preset) => (
                <div key={preset.id} className="p-3 bg-slate-800/50 rounded-lg border border-cyan-500/20 hover:border-cyan-400/40 transition-colors cursor-pointer">
                  <h4 className="text-cyan-100 font-medium">{preset.name}</h4>
                  <p className="text-cyan-300/70 text-sm mt-1">{preset.description}</p>
                  <div className="text-cyan-400/60 text-xs mt-2 capitalize">
                    {preset.category}
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};