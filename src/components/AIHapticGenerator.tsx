import React, { useState, useRef, useEffect } from 'react';
import { Sparkles, Loader2, Upload, Music, Zap, AudioWaveform, Video, Download, Settings } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Slider } from '@/components/ui/slider';
import { Switch } from '@/components/ui/switch';
import { useAudioAnalysis, type AudioAnalysisData, type HapticPattern, type VideoProcessingOptions } from '@/hooks/useAudioAnalysis';

interface AIHapticGeneratorProps {
  onVideoGenerated: (file: File) => void;
}

export const AIHapticGenerator: React.FC<AIHapticGeneratorProps> = ({ onVideoGenerated }) => {
  const [audioFile, setAudioFile] = useState<File | null>(null);
  const [videoFile, setVideoFile] = useState<File | null>(null);
  const [audioFileId, setAudioFileId] = useState<string | null>(null);
  const [analysisId, setAnalysisId] = useState<string | null>(null);
  const [audioAnalysis, setAudioAnalysis] = useState<AudioAnalysisData | null>(null);
  const [hapticPatterns, setHapticPatterns] = useState<HapticPattern[]>([]);
  const [analysisProgress, setAnalysisProgress] = useState(0);
  const [aiPrompt, setAiPrompt] = useState('');
  const [presets, setPresets] = useState<any[]>([]);
  const [selectedPreset, setSelectedPreset] = useState<string>('');
  const [hapticVideo, setHapticVideo] = useState<File | null>(null);
  
  // Video processing options
  const [processingOptions, setProcessingOptions] = useState<VideoProcessingOptions>({
    format: 'mp4',
    quality: 'medium',
    includeAudio: true,
    hapticIntensity: 0.7
  });
  
  const audioRef = useRef<HTMLAudioElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const analyzerRef = useRef<AnalyserNode | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const {
    uploadAudioFile,
    analyzeAudio,
    generateHapticPatterns,
    processVideoWithHaptics,
    getHapticPresets,
    getUserHapticPatterns,
    extractHapticMetadata,
    isAnalyzing,
    isGeneratingHaptics,
    isProcessingVideo,
    uploadProgress,
    processingProgress,
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
    if (file) {
      if (file.type.startsWith('audio/')) {
        setAudioFile(file);
        setVideoFile(null);
        setAudioAnalysis(null);
        setHapticPatterns([]);
        setAnalysisId(null);
        setHapticVideo(null);
        
        // Upload file to backend
        const fileId = await uploadAudioFile(file);
        setAudioFileId(fileId);
      } else if (file.type.startsWith('video/')) {
        setVideoFile(file);
        setAudioFile(file); // Video files contain audio
        setAudioAnalysis(null);
        setHapticPatterns([]);
        setAnalysisId(null);
        setHapticVideo(null);
        
        // Check if video already has haptic data
        const existingPatterns = await extractHapticMetadata(file);
        if (existingPatterns) {
          setHapticPatterns(existingPatterns);
        }
        
        // Upload file to backend
        const fileId = await uploadAudioFile(file);
        setAudioFileId(fileId);
      }
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

  const applyPreset = async (presetId: string) => {
    const preset = presets.find(p => p.id === presetId);
    if (preset) {
      setHapticPatterns(preset.patterns);
      setSelectedPreset(presetId);
    }
  };

  const processVideo = async () => {
    if (!hapticPatterns.length || (!videoFile && !audioFile)) return;

    try {
      // Use video file if available, otherwise create a simple video from audio
      const sourceFile = videoFile || audioFile!;
      
      const hapticVideoFile = await processVideoWithHaptics(
        sourceFile,
        hapticPatterns,
        processingOptions
      );
      
      setHapticVideo(hapticVideoFile);
      onVideoGenerated(hapticVideoFile);
    } catch (error) {
      console.error('Video processing failed:', error);
    }
  };

  const downloadHapticVideo = () => {
    if (!hapticVideo) return;

    const url = URL.createObjectURL(hapticVideo);
    const a = document.createElement('a');
    a.href = url;
    a.download = hapticVideo.name;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
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
            {videoFile ? (
              <Video className="h-12 w-12 text-cyan-400 mx-auto mb-4" />
            ) : (
              <Music className="h-12 w-12 text-cyan-400 mx-auto mb-4" />
            )}
            <p className="text-cyan-100 mb-2">Upload audio or video file</p>
            <p className="text-cyan-300/70 text-sm">Drag and drop or click to browse</p>
            <div className="mt-3 text-cyan-400/60 text-xs">
              Supported: MP3, WAV, MP4, AVI, MOV, WebM
            </div>
          </div>
          <input
            ref={fileInputRef}
            type="file"
            accept="audio/*,video/*"
            onChange={handleFileUpload}
            className="hidden"
          />
          
          {(audioFile || videoFile) && (
            <div className="mt-4 p-4 bg-slate-800/50 rounded-lg border border-cyan-500/20">
              <p className="text-cyan-100 text-sm mb-2">
                Selected: {videoFile?.name || audioFile?.name}
              </p>
              {uploadProgress > 0 && uploadProgress < 100 && (
                <div className="mb-2">
                  <Progress value={uploadProgress} className="w-full" />
                  <p className="text-cyan-400/60 text-xs mt-1">Uploading... {uploadProgress}%</p>
                </div>
              )}
              
              {videoFile ? (
                <video
                  ref={videoRef}
                  src={URL.createObjectURL(videoFile)}
                  controls
                  className="w-full max-h-64 rounded"
                />
              ) : (
                <audio
                  ref={audioRef}
                  src={URL.createObjectURL(audioFile!)}
                  controls
                  className="w-full"
                />
              )}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Audio Analysis */}
      {(audioFile || videoFile) && audioFileId && (
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

      {/* Haptic Generation Options */}
      {audioAnalysis && analysisId && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* AI Haptic Generation */}
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
                  className="w-full bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600"
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
            </CardContent>
          </Card>

          {/* Haptic Presets */}
          <Card className="bg-gradient-to-br from-slate-800/30 to-slate-700/30 border-cyan-500/30 backdrop-blur-sm">
            <CardHeader>
              <CardTitle className="text-cyan-100 flex items-center space-x-2">
                <Sparkles className="h-5 w-5 text-cyan-400" />
                <span>Haptic Presets</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <Label className="text-cyan-300 text-sm">Choose a preset</Label>
                <Select value={selectedPreset} onValueChange={applyPreset}>
                  <SelectTrigger className="bg-slate-800/50 border-cyan-500/30 text-cyan-100">
                    <SelectValue placeholder="Select a haptic preset" />
                  </SelectTrigger>
                  <SelectContent>
                    {presets.map((preset) => (
                      <SelectItem key={preset.id} value={preset.id}>
                        <div>
                          <div className="font-medium">{preset.name}</div>
                          <div className="text-xs text-muted-foreground">{preset.description}</div>
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Generated Haptic Patterns */}
      {hapticPatterns.length > 0 && (
        <Card className="bg-gradient-to-br from-slate-800/30 to-slate-700/30 border-cyan-500/30 backdrop-blur-sm">
          <CardHeader>
            <CardTitle className="text-cyan-100 flex items-center space-x-2">
              <Zap className="h-5 w-5 text-cyan-400" />
              <span>Haptic Patterns ({hapticPatterns.length})</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="max-h-40 overflow-y-auto space-y-2 mb-4">
              {hapticPatterns.slice(0, 10).map((pattern, index) => (
                <div key={index} className="flex items-center justify-between p-2 bg-slate-800/50 rounded border border-cyan-500/20">
                  <div className="flex items-center space-x-3">
                    <div className={`w-3 h-3 rounded-full ${
                      pattern.type === 'pulse' ? 'bg-red-400' :
                      pattern.type === 'vibration' ? 'bg-yellow-400' :
                      pattern.type === 'impact' ? 'bg-orange-400' : 'bg-blue-400'
                    }`} />
                    <span className="text-cyan-100 text-sm capitalize">{pattern.type}</span>
                  </div>
                  <div className="text-cyan-400 text-xs">
                    {Math.round(pattern.timestamp)}ms | {Math.round(pattern.intensity * 100)}% | {pattern.duration}ms
                  </div>
                </div>
              ))}
            </div>
            {hapticPatterns.length > 10 && (
              <p className="text-cyan-400/60 text-xs text-center mb-4">
                ... and {hapticPatterns.length - 10} more patterns
              </p>
            )}
          </CardContent>
        </Card>
      )}

      {/* Video Processing Options */}
      {hapticPatterns.length > 0 && (
        <Card className="bg-gradient-to-br from-slate-800/30 to-slate-700/30 border-cyan-500/30 backdrop-blur-sm">
          <CardHeader>
            <CardTitle className="text-cyan-100 flex items-center space-x-2">
              <Settings className="h-5 w-5 text-cyan-400" />
              <span>Video Processing Options</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              <div>
                <Label className="text-cyan-300 text-sm mb-2 block">Output Format</Label>
                <Select 
                  value={processingOptions.format} 
                  onValueChange={(value: any) => setProcessingOptions({...processingOptions, format: value})}
                >
                  <SelectTrigger className="bg-slate-800/50 border-cyan-500/30 text-cyan-100">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="mp4">MP4</SelectItem>
                    <SelectItem value="webm">WebM</SelectItem>
                    <SelectItem value="avi">AVI</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label className="text-cyan-300 text-sm mb-2 block">Quality</Label>
                <Select 
                  value={processingOptions.quality} 
                  onValueChange={(value: any) => setProcessingOptions({...processingOptions, quality: value})}
                >
                  <SelectTrigger className="bg-slate-800/50 border-cyan-500/30 text-cyan-100">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="low">Low</SelectItem>
                    <SelectItem value="medium">Medium</SelectItem>
                    <SelectItem value="high">High</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label className="text-cyan-300 text-sm mb-2 block">
                  Haptic Intensity: {Math.round(processingOptions.hapticIntensity * 100)}%
                </Label>
                <Slider
                  value={[processingOptions.hapticIntensity]}
                  onValueChange={([value]) => setProcessingOptions({...processingOptions, hapticIntensity: value})}
                  max={1}
                  min={0}
                  step={0.1}
                  className="w-full"
                />
              </div>

              <div className="flex items-center space-x-2">
                <Switch
                  checked={processingOptions.includeAudio}
                  onCheckedChange={(checked) => setProcessingOptions({...processingOptions, includeAudio: checked})}
                />
                <Label className="text-cyan-300 text-sm">Include Audio</Label>
              </div>
            </div>

            <Button
              onClick={processVideo}
              disabled={isProcessingVideo}
              className="w-full bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600"
            >
              {isProcessingVideo ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Processing Video... {Math.round(processingProgress)}%
                </>
              ) : (
                <>
                  <Video className="h-4 w-4 mr-2" />
                  Generate Haptic Video
                </>
              )}
            </Button>

            {isProcessingVideo && (
              <div className="mt-4">
                <Progress value={processingProgress} className="w-full" />
                <p className="text-cyan-400/60 text-xs mt-1 text-center">
                  Creating haptic-enabled video file...
                </p>
              </div>
            )}
          </CardContent>
        </Card>
      )}

      {/* Download Haptic Video */}
      {hapticVideo && (
        <Card className="bg-gradient-to-br from-green-800/30 to-emerald-700/30 border-green-500/30 backdrop-blur-sm">
          <CardHeader>
            <CardTitle className="text-green-100 flex items-center space-x-2">
              <Download className="h-5 w-5 text-green-400" />
              <span>Haptic Video Ready</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-center space-y-4">
              <p className="text-green-100">
                Your haptic video has been generated successfully!
              </p>
              <p className="text-green-300/70 text-sm">
                File size: {(hapticVideo.size / (1024 * 1024)).toFixed(2)} MB
              </p>
              <Button
                onClick={downloadHapticVideo}
                className="bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600"
              >
                <Download className="h-4 w-4 mr-2" />
                Download Haptic Video
              </Button>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};