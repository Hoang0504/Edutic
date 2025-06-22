'use client';

import { createContext, useContext, useState, useEffect, useRef, ReactNode } from 'react';

interface Track {
  title: string;
  artist: string;
  src: string;
  duration: string;
}

interface MusicContextType {
  // Music state
  isPlaying: boolean;
  isMuted: boolean;
  currentTime: number;
  duration: number;
  volume: number;
  currentTrackIndex: number;
  currentTrack: Track;
  isLoaded: boolean;
  
  // Controls
  togglePlay: () => void;
  toggleMute: () => void;
  nextTrack: () => void;
  previousTrack: () => void;
  setVolume: (volume: number) => void;
  seekTo: (percentage: number) => void;
  
  // Study mode integration
  startStudyMusic: () => void;
  stopStudyMusic: () => void;
  isStudyMusicActive: boolean;
  
  // Utilities
  formatTime: (seconds: number) => string;
}

const musicTracks: Track[] = [
  {
    title: "Blue Boi",
    artist: "LAKEY INSPIRED",
    src: "/LAKEY INSPIRED - Blue Boi.mp3",
    duration: "1:36"
  },
  {
    title: "Chill Day", 
    artist: "LAKEY INSPIRED",
    src: "/LAKEY INSPIRED - Chill Day.mp3",
    duration: "2:54"
  },
  {
    title: "In My Dreams",
    artist: "LAKEY INSPIRED", 
    src: "/LAKEY INSPIRED - In My Dreams.mp3",
    duration: "2:30"
  }
];

const MusicContext = createContext<MusicContextType | undefined>(undefined);

export function MusicProvider({ children }: { children: ReactNode }) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolumeState] = useState(0.7);
  const [currentTrackIndex, setCurrentTrackIndex] = useState(0);
  const [isLoaded, setIsLoaded] = useState(false);
  const [isStudyMusicActive, setIsStudyMusicActive] = useState(false);
  
  const audioRef = useRef<HTMLAudioElement>(null);
  
  const currentTrack = musicTracks[currentTrackIndex];

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const togglePlay = () => {
    if (audioRef.current && isLoaded) {
      if (isPlaying) {
        audioRef.current.pause();
        setIsPlaying(false);
      } else {
        audioRef.current.play().catch(console.error);
        setIsPlaying(true);
      }
    }
  };

  const toggleMute = () => {
    if (audioRef.current) {
      const newMuted = !isMuted;
      setIsMuted(newMuted);
      audioRef.current.muted = newMuted;
    }
  };

  const nextTrack = () => {
    const nextIndex = (currentTrackIndex + 1) % musicTracks.length;
    setCurrentTrackIndex(nextIndex);
  };

  const previousTrack = () => {
    const prevIndex = currentTrackIndex === 0 ? musicTracks.length - 1 : currentTrackIndex - 1;
    setCurrentTrackIndex(prevIndex);
  };

  const setVolume = (newVolume: number) => {
    setVolumeState(newVolume);
    if (audioRef.current) {
      audioRef.current.volume = newVolume;
      if (newVolume > 0) {
        setIsMuted(false);
        audioRef.current.muted = false;
      }
    }
  };

  const seekTo = (percentage: number) => {
    if (audioRef.current && duration > 0) {
      const newTime = (percentage / 100) * duration;
      audioRef.current.currentTime = newTime;
      setCurrentTime(newTime);
    }
  };

  const startStudyMusic = () => {
    setIsStudyMusicActive(true);
    if (audioRef.current && isLoaded) {
      audioRef.current.play().then(() => {
        setIsPlaying(true);
      }).catch(console.error);
    }
  };

  const stopStudyMusic = () => {
    setIsStudyMusicActive(false);
    if (audioRef.current) {
      audioRef.current.pause();
      setIsPlaying(false);
    }
  };

  // Audio event handlers
  useEffect(() => {
    if (audioRef.current) {
      const audio = audioRef.current;
      
      const handleLoadedMetadata = () => {
        setDuration(audio.duration);
        setIsLoaded(true);
      };
      
      const handleTimeUpdate = () => {
        setCurrentTime(audio.currentTime);
      };
      
      const handleEnded = () => {
        // Auto play next track when current track ends
        nextTrack();
      };

      const handleCanPlay = () => {
        setIsLoaded(true);
      };

      const handleLoadStart = () => {
        setIsLoaded(false);
      };
      
      // Add event listeners
      audio.addEventListener('loadedmetadata', handleLoadedMetadata);
      audio.addEventListener('timeupdate', handleTimeUpdate);
      audio.addEventListener('ended', handleEnded);
      audio.addEventListener('canplay', handleCanPlay);
      audio.addEventListener('loadstart', handleLoadStart);
      
      return () => {
        audio.removeEventListener('loadedmetadata', handleLoadedMetadata);
        audio.removeEventListener('timeupdate', handleTimeUpdate);
        audio.removeEventListener('ended', handleEnded);
        audio.removeEventListener('canplay', handleCanPlay);
        audio.removeEventListener('loadstart', handleLoadStart);
      };
    }
  }, [currentTrackIndex]);

  // Initialize audio when track changes
  useEffect(() => {
    if (audioRef.current) {
      const audio = audioRef.current;
      const wasPlaying = isPlaying;
      
      // Reset state
      setIsPlaying(false);
      setCurrentTime(0);
      setIsLoaded(false);
      
      // Load new track
      audio.load();
      
      // Continue playing if it was playing before
      if (wasPlaying || isStudyMusicActive) {
        const timer = setTimeout(() => {
          if (audioRef.current && (isLoaded || audioRef.current.readyState >= 3)) {
            audioRef.current.play().then(() => {
              setIsPlaying(true);
            }).catch(console.error);
          }
        }, 300);

        return () => clearTimeout(timer);
      }
    }
  }, [currentTrackIndex]);

  // Set initial volume
  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = volume;
    }
    
    // Listen for stop music event from Pomodoro context
    const handleStopMusic = () => {
      stopStudyMusic();
    };
    
    if (typeof window !== 'undefined') {
      window.addEventListener('stopStudyMusic', handleStopMusic);
      
      return () => {
        window.removeEventListener('stopStudyMusic', handleStopMusic);
      };
    }
  }, []);

  const value: MusicContextType = {
    isPlaying,
    isMuted,
    currentTime,
    duration,
    volume,
    currentTrackIndex,
    currentTrack,
    isLoaded,
    togglePlay,
    toggleMute,
    nextTrack,
    previousTrack,
    setVolume,
    seekTo,
    startStudyMusic,
    stopStudyMusic,
    isStudyMusicActive,
    formatTime
  };

  return (
    <MusicContext.Provider value={value}>
      {children}
      {/* Global Audio Element */}
      <audio 
        ref={audioRef}
        src={currentTrack.src}
        preload="metadata"
        crossOrigin="anonymous"
      />
    </MusicContext.Provider>
  );
}

export function useMusic() {
  const context = useContext(MusicContext);
  if (context === undefined) {
    throw new Error('useMusic must be used within a MusicProvider');
  }
  return context;
} 