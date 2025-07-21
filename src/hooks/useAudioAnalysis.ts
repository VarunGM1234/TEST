import { useState, useCallback } from 'react';

export interface AudioAnalysisData {
  bassFrequencies: number[];
  timeStamps: number[];
  intensity: number[];
  duration: number;
}

export interface HapticPattern {
  type: 'pulse' | 'vibration' | 'tap';
  timestamp: number;
  intensity: number;
  duration?: number;
}

export interface HapticPreset {
  id: string;
  name: string;
  description: string;
  category: string;
  patterns: HapticPattern[];
}

// Mock API functions - replace with actual backend calls
const mockAPI = {
  uploadFile: async (file: File): Promise<string> => {
    // Simulate upload delay
    await new Promise(resolve => setTimeout(resolve, 1000));
    return `file_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  },

  analyzeAudio: async (fileId: string, analysisData: AudioAnalysisData): Promise<string> => {
    // Simulate analysis processing
    await new Promise(resolve => setTimeout(resolve, 500));
    return `analysis_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  },

  generateHaptics: async (analysisId: string, analysisData: AudioAnalysisData, prompt: string): Promise<HapticPattern[]> => {
    // Simulate AI haptic generation
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    const patterns: HapticPattern[] = [];
    const types: HapticPattern['type'][] = ['pulse', 'vibration', 'tap'];
    
    // Generate patterns based on bass frequencies
    analysisData.bassFrequencies.forEach((bassLevel, index) => {
      if (bassLevel > 100) { // Only generate haptics for significant bass
        const timestamp = (index / analysisData.bassFrequencies.length) * analysisData.duration * 1000;
        const intensity = Math.min(bassLevel / 255, 1);
        const type = types[Math.floor(Math.random() * types.length)];
        
        patterns.push({
          type,
          timestamp,
          intensity,
          duration: type === 'pulse' ? 100 : type === 'vibration' ? 200 : 50
        });
      }
    });

    // Apply AI prompt modifications (simplified)
    if (prompt.toLowerCase().includes('intense')) {
      patterns.forEach(pattern => {
        pattern.intensity = Math.min(pattern.intensity * 1.5, 1);
      });
    } else if (prompt.toLowerCase().includes('gentle')) {
      patterns.forEach(pattern => {
        pattern.intensity = pattern.intensity * 0.7;
      });
    }

    return patterns.slice(0, 50); // Limit to 50 patterns
  },

  getPresets: async (): Promise<HapticPreset[]> => {
    return [
      {
        id: '1',
        name: 'Action Movie',
        description: 'Intense haptics for action scenes with explosions and impacts',
        category: 'entertainment',
        patterns: []
      },
      {
        id: '2',
        name: 'Music Rhythm',
        description: 'Rhythmic haptics that follow musical beats and bass lines',
        category: 'music',
        patterns: []
      },
      {
        id: '3',
        name: 'Nature Sounds',
        description: 'Gentle haptics for rain, wind, and ambient nature sounds',
        category: 'ambient',
        patterns: []
      },
      {
        id: '4',
        name: 'Gaming FPS',
        description: 'Sharp, responsive haptics for first-person shooter games',
        category: 'gaming',
        patterns: []
      },
      {
        id: '5',
        name: 'Meditation',
        description: 'Calm, slow pulses for meditation and relaxation content',
        category: 'wellness',
        patterns: []
      },
      {
        id: '6',
        name: 'Sports Commentary',
        description: 'Dynamic haptics for sports events and crowd reactions',
        category: 'sports',
        patterns: []
      }
    ];
  },

  getUserPatterns: async (): Promise<HapticPattern[]> => {
    return [];
  }
};

export const useAudioAnalysis = () => {
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [isGeneratingHaptics, setIsGeneratingHaptics] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);

  const uploadAudioFile = useCallback(async (file: File): Promise<string> => {
    setUploadProgress(0);
    
    // Simulate upload progress
    const progressInterval = setInterval(() => {
      setUploadProgress(prev => {
        if (prev >= 100) {
          clearInterval(progressInterval);
          return 100;
        }
        return prev + 10;
      });
    }, 100);

    try {
      const fileId = await mockAPI.uploadFile(file);
      setUploadProgress(100);
      return fileId;
    } catch (error) {
      console.error('Upload failed:', error);
      throw error;
    } finally {
      clearInterval(progressInterval);
      setTimeout(() => setUploadProgress(0), 1000);
    }
  }, []);

  const analyzeAudio = useCallback(async (fileId: string, analysisData: AudioAnalysisData): Promise<string> => {
    setIsAnalyzing(true);
    try {
      const analysisId = await mockAPI.analyzeAudio(fileId, analysisData);
      return analysisId;
    } catch (error) {
      console.error('Analysis failed:', error);
      throw error;
    } finally {
      setIsAnalyzing(false);
    }
  }, []);

  const generateHapticPatterns = useCallback(async (
    analysisId: string, 
    analysisData: AudioAnalysisData, 
    prompt: string
  ): Promise<HapticPattern[]> => {
    setIsGeneratingHaptics(true);
    try {
      const patterns = await mockAPI.generateHaptics(analysisId, analysisData, prompt);
      return patterns;
    } catch (error) {
      console.error('Haptic generation failed:', error);
      throw error;
    } finally {
      setIsGeneratingHaptics(false);
    }
  }, []);

  const getHapticPresets = useCallback(async (): Promise<HapticPreset[]> => {
    try {
      return await mockAPI.getPresets();
    } catch (error) {
      console.error('Failed to load presets:', error);
      return [];
    }
  }, []);

  const getUserHapticPatterns = useCallback(async (): Promise<HapticPattern[]> => {
    try {
      return await mockAPI.getUserPatterns();
    } catch (error) {
      console.error('Failed to load user patterns:', error);
      return [];
    }
  }, []);

  return {
    uploadAudioFile,
    analyzeAudio,
    generateHapticPatterns,
    getHapticPresets,
    getUserHapticPatterns,
    isAnalyzing,
    isGeneratingHaptics,
    uploadProgress,
  };
};