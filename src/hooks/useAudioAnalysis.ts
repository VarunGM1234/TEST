import { useState, useCallback } from 'react';

export interface AudioAnalysisData {
  bassFrequencies: number[];
  timeStamps: number[];
  intensity: number[];
  duration: number;
  sampleRate?: number;
  frequencyData?: Float32Array[];
}

export interface HapticPattern {
  timestamp: number;
  intensity: number;
  duration: number;
  type: 'pulse' | 'vibration' | 'impact' | 'rumble';
  frequency?: number;
}

export interface HapticPreset {
  id: string;
  name: string;
  description: string;
  category: string;
  patterns: HapticPattern[];
}

export interface VideoProcessingOptions {
  format: 'mp4' | 'webm' | 'avi';
  quality: 'low' | 'medium' | 'high';
  includeAudio: boolean;
  hapticIntensity: number;
}

export const useAudioAnalysis = () => {
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [isGeneratingHaptics, setIsGeneratingHaptics] = useState(false);
  const [isProcessingVideo, setIsProcessingVideo] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [processingProgress, setProcessingProgress] = useState(0);

  const uploadAudioFile = useCallback(async (file: File): Promise<string> => {
    setUploadProgress(0);
    
    // Simulate file upload with progress
    return new Promise((resolve) => {
      const uploadInterval = setInterval(() => {
        setUploadProgress(prev => {
          if (prev >= 100) {
            clearInterval(uploadInterval);
            // Generate a unique file ID
            const fileId = `file_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
            resolve(fileId);
            return 100;
          }
          return prev + 10;
        });
      }, 200);
    });
  }, []);

  const analyzeAudio = useCallback(async (fileId: string, analysisData: AudioAnalysisData): Promise<string> => {
    setIsAnalyzing(true);
    
    try {
      // Simulate API call to store analysis
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const analysisId = `analysis_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
      
      // Store analysis data in localStorage for demo purposes
      localStorage.setItem(`analysis_${analysisId}`, JSON.stringify({
        fileId,
        analysisData,
        timestamp: Date.now()
      }));
      
      return analysisId;
    } finally {
      setIsAnalyzing(false);
    }
  }, []);

  const generateHapticPatterns = useCallback(async (
    analysisId: string, 
    audioAnalysis: AudioAnalysisData, 
    aiPrompt?: string
  ): Promise<HapticPattern[]> => {
    setIsGeneratingHaptics(true);
    
    try {
      // Simulate AI haptic generation
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      const patterns: HapticPattern[] = [];
      const { bassFrequencies, timeStamps, intensity } = audioAnalysis;
      
      // Generate patterns based on bass frequencies and AI prompt
      for (let i = 0; i < bassFrequencies.length; i++) {
        const freq = bassFrequencies[i];
        const timestamp = i * 100; // 100ms intervals
        const intensityLevel = intensity[i] || freq / 255;
        
        // Create different types of haptic patterns based on frequency and intensity
        if (freq > 200) {
          patterns.push({
            timestamp,
            intensity: Math.min(intensityLevel * 1.2, 1),
            duration: 150,
            type: 'impact',
            frequency: freq
          });
        } else if (freq > 150) {
          patterns.push({
            timestamp,
            intensity: intensityLevel,
            duration: 200,
            type: 'pulse',
            frequency: freq
          });
        } else if (freq > 100) {
          patterns.push({
            timestamp,
            intensity: intensityLevel * 0.8,
            duration: 300,
            type: 'vibration',
            frequency: freq
          });
        } else if (freq > 50) {
          patterns.push({
            timestamp,
            intensity: intensityLevel * 0.6,
            duration: 400,
            type: 'rumble',
            frequency: freq
          });
        }
      }
      
      // Apply AI prompt modifications
      if (aiPrompt) {
        const lowerPrompt = aiPrompt.toLowerCase();
        patterns.forEach(pattern => {
          if (lowerPrompt.includes('intense') || lowerPrompt.includes('strong')) {
            pattern.intensity = Math.min(pattern.intensity * 1.5, 1);
          } else if (lowerPrompt.includes('gentle') || lowerPrompt.includes('soft')) {
            pattern.intensity = pattern.intensity * 0.7;
          }
          
          if (lowerPrompt.includes('rhythmic') || lowerPrompt.includes('beat')) {
            pattern.type = 'pulse';
            pattern.duration = Math.max(pattern.duration * 0.8, 100);
          }
        });
      }
      
      // Store patterns
      localStorage.setItem(`patterns_${analysisId}`, JSON.stringify(patterns));
      
      return patterns;
    } finally {
      setIsGeneratingHaptics(false);
    }
  }, []);

  const processVideoWithHaptics = useCallback(async (
    videoFile: File,
    hapticPatterns: HapticPattern[],
    options: VideoProcessingOptions
  ): Promise<File> => {
    setIsProcessingVideo(true);
    setProcessingProgress(0);
    
    try {
      // Simulate video processing with haptic data embedding
      const processingSteps = [
        'Extracting video frames...',
        'Processing audio track...',
        'Generating haptic metadata...',
        'Embedding haptic data...',
        'Optimizing output...',
        'Finalizing video...'
      ];
      
      for (let i = 0; i < processingSteps.length; i++) {
        await new Promise(resolve => setTimeout(resolve, 1000));
        setProcessingProgress(((i + 1) / processingSteps.length) * 100);
      }
      
      // Create a new video file with haptic metadata
      const hapticVideoData = await createHapticVideo(videoFile, hapticPatterns, options);
      
      return hapticVideoData;
    } finally {
      setIsProcessingVideo(false);
      setProcessingProgress(0);
    }
  }, []);

  const createHapticVideo = async (
    videoFile: File,
    hapticPatterns: HapticPattern[],
    options: VideoProcessingOptions
  ): Promise<File> => {
    // Create a video blob with embedded haptic metadata
    const arrayBuffer = await videoFile.arrayBuffer();
    const uint8Array = new Uint8Array(arrayBuffer);
    
    // Create haptic metadata
    const hapticMetadata = {
      version: '1.0',
      patterns: hapticPatterns,
      options,
      timestamp: Date.now()
    };
    
    // Convert metadata to binary
    const metadataString = JSON.stringify(hapticMetadata);
    const metadataBytes = new TextEncoder().encode(metadataString);
    
    // Create new file with haptic data
    const hapticVideoArray = new Uint8Array(uint8Array.length + metadataBytes.length + 8);
    
    // Copy original video data
    hapticVideoArray.set(uint8Array, 0);
    
    // Add haptic metadata marker and length
    const marker = new TextEncoder().encode('HAPTIC');
    hapticVideoArray.set(marker, uint8Array.length);
    
    // Add metadata length (4 bytes)
    const lengthBytes = new ArrayBuffer(4);
    new DataView(lengthBytes).setUint32(0, metadataBytes.length, false);
    hapticVideoArray.set(new Uint8Array(lengthBytes), uint8Array.length + 6);
    
    // Add metadata
    hapticVideoArray.set(metadataBytes, uint8Array.length + 10);
    
    // Create new file
    const hapticVideoBlob = new Blob([hapticVideoArray], { type: videoFile.type });
    const hapticVideoFile = new File([hapticVideoBlob], `haptic_${videoFile.name}`, {
      type: videoFile.type
    });
    
    return hapticVideoFile;
  };

  const getHapticPresets = useCallback(async (): Promise<HapticPreset[]> => {
    // Return predefined haptic presets
    return [
      {
        id: 'action_intense',
        name: 'Action Intense',
        description: 'Strong impacts and vibrations for action scenes',
        category: 'action',
        patterns: [
          { timestamp: 0, intensity: 0.9, duration: 200, type: 'impact' },
          { timestamp: 500, intensity: 0.8, duration: 150, type: 'pulse' }
        ]
      },
      {
        id: 'music_rhythmic',
        name: 'Music Rhythmic',
        description: 'Rhythmic pulses that match musical beats',
        category: 'music',
        patterns: [
          { timestamp: 0, intensity: 0.6, duration: 100, type: 'pulse' },
          { timestamp: 250, intensity: 0.6, duration: 100, type: 'pulse' }
        ]
      },
      {
        id: 'ambient_gentle',
        name: 'Ambient Gentle',
        description: 'Soft vibrations for ambient content',
        category: 'ambient',
        patterns: [
          { timestamp: 0, intensity: 0.3, duration: 500, type: 'vibration' }
        ]
      },
      {
        id: 'gaming_explosive',
        name: 'Gaming Explosive',
        description: 'High-intensity patterns for gaming content',
        category: 'gaming',
        patterns: [
          { timestamp: 0, intensity: 1.0, duration: 300, type: 'impact' },
          { timestamp: 100, intensity: 0.7, duration: 200, type: 'rumble' }
        ]
      }
    ];
  }, []);

  const getUserHapticPatterns = useCallback(async (): Promise<HapticPattern[]> => {
    // Get user's saved haptic patterns from localStorage
    const keys = Object.keys(localStorage).filter(key => key.startsWith('patterns_'));
    const patterns: HapticPattern[] = [];
    
    keys.forEach(key => {
      try {
        const storedPatterns = JSON.parse(localStorage.getItem(key) || '[]');
        patterns.push(...storedPatterns);
      } catch (error) {
        console.error('Error loading patterns:', error);
      }
    });
    
    return patterns;
  }, []);

  const extractHapticMetadata = useCallback((videoFile: File): Promise<HapticPattern[] | null> => {
    return new Promise(async (resolve) => {
      try {
        const arrayBuffer = await videoFile.arrayBuffer();
        const uint8Array = new Uint8Array(arrayBuffer);
        
        // Look for haptic metadata marker
        const marker = new TextEncoder().encode('HAPTIC');
        let markerIndex = -1;
        
        for (let i = 0; i < uint8Array.length - marker.length; i++) {
          let found = true;
          for (let j = 0; j < marker.length; j++) {
            if (uint8Array[i + j] !== marker[j]) {
              found = false;
              break;
            }
          }
          if (found) {
            markerIndex = i;
            break;
          }
        }
        
        if (markerIndex === -1) {
          resolve(null);
          return;
        }
        
        // Read metadata length
        const lengthBytes = uint8Array.slice(markerIndex + 6, markerIndex + 10);
        const metadataLength = new DataView(lengthBytes.buffer).getUint32(0, false);
        
        // Extract metadata
        const metadataBytes = uint8Array.slice(markerIndex + 10, markerIndex + 10 + metadataLength);
        const metadataString = new TextDecoder().decode(metadataBytes);
        const metadata = JSON.parse(metadataString);
        
        resolve(metadata.patterns || []);
      } catch (error) {
        console.error('Error extracting haptic metadata:', error);
        resolve(null);
      }
    });
  }, []);

  return {
    // State
    isAnalyzing,
    isGeneratingHaptics,
    isProcessingVideo,
    uploadProgress,
    processingProgress,
    
    // Functions
    uploadAudioFile,
    analyzeAudio,
    generateHapticPatterns,
    processVideoWithHaptics,
    getHapticPresets,
    getUserHapticPatterns,
    extractHapticMetadata
  };
};