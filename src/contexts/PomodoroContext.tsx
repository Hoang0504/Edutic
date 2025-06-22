'use client';

import { createContext, useContext, useState, useEffect, ReactNode } from 'react';

interface PomodoroContextType {
  // Timer states
  studyTime: number;
  breakTime: number;
  currentTime: number;
  isStudyMode: boolean;
  isRunning: boolean;
  isActive: boolean;
  isBreakModalOpen: boolean;
  isBreakEndModalOpen: boolean;
  
  // Input values (in minutes)
  studyMinutes: number;
  breakMinutes: number;
  
  // Actions
  setStudyMinutes: (minutes: number) => void;
  setBreakMinutes: (minutes: number) => void;
  startTimer: () => void;
  pauseTimer: () => void;
  resetTimer: () => void;
  startFocusMode: () => void;
  stopFocusMode: () => void;
  startBreakMode: () => void;
  closeBreakModal: () => void;
  continueStudying: () => void;
  closeBreakEndModal: () => void;
  startNextSession: () => void;
  extendBreak: () => void;
  
  // Utilities
  formatTime: (seconds: number) => string;
}

const PomodoroContext = createContext<PomodoroContextType | undefined>(undefined);

export function PomodoroProvider({ children }: { children: ReactNode }) {
  const [studyTime, setStudyTime] = useState(25 * 60); // 25 minutes in seconds
  const [breakTime, setBreakTime] = useState(5 * 60); // 5 minutes in seconds
  const [currentTime, setCurrentTime] = useState(studyTime);
  const [isStudyMode, setIsStudyMode] = useState(true);
  const [isRunning, setIsRunning] = useState(false);
  const [isActive, setIsActive] = useState(false);
  const [isBreakModalOpen, setIsBreakModalOpen] = useState(false);
  const [isBreakEndModalOpen, setIsBreakEndModalOpen] = useState(false);
  
  // Input values for customization (in minutes)
  const [studyMinutes, setStudyMinutes] = useState(25);
  const [breakMinutes, setBreakMinutes] = useState(5);

  // Timer effect - modified to keep running during break modal
  useEffect(() => {
    let interval: NodeJS.Timeout | null = null;

    // Timer runs when:
    // 1. Normal running state (isRunning && isActive)
    // 2. OR when break modal is open AND isRunning (user can pause break timer)
    const shouldRun = (isRunning && isActive) || (isBreakModalOpen && isRunning && !isStudyMode);

    if (shouldRun && currentTime > 0) {
      interval = setInterval(() => {
        setCurrentTime(time => time - 1);
      }, 1000);
    } else if (currentTime === 0 && isActive) {
      if (isStudyMode) {
        // Study time finished - show break modal and start break countdown
        setIsBreakModalOpen(true);
        setIsStudyMode(false);
        setCurrentTime(breakTime);
        // Keep running for break countdown
        setIsRunning(true);
      } else {
        // Break time finished - show break end modal
        setIsBreakModalOpen(false);
        setIsBreakEndModalOpen(true);
        setIsRunning(false);
      }
    }

    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isRunning, currentTime, isStudyMode, studyTime, breakTime, isActive, isBreakModalOpen, isBreakEndModalOpen]);

  // Update times when input values change
  useEffect(() => {
    const newStudyTime = studyMinutes * 60;
    const newBreakTime = breakMinutes * 60;
    
    setStudyTime(newStudyTime);
    setBreakTime(newBreakTime);
    
    // Only update current time if timer hasn't been started yet (not active)
    if (!isActive) {
      setCurrentTime(isStudyMode ? newStudyTime : newBreakTime);
    }
  }, [studyMinutes, breakMinutes, isStudyMode, isActive]);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const startTimer = () => {
    setIsRunning(true);
  };

  const pauseTimer = () => {
    setIsRunning(false);
  };

  const resetTimer = () => {
    setIsRunning(false);
    setCurrentTime(isStudyMode ? studyTime : breakTime);
  };

  const startFocusMode = () => {
    setIsActive(true);
    setIsRunning(true);
  };

  const stopFocusMode = () => {
    setIsActive(false);
    setIsRunning(false);
    setIsBreakModalOpen(false);
    setIsBreakEndModalOpen(false);
    // Reset to initial state
    setIsStudyMode(true);
    setCurrentTime(studyTime);
  };

  const startBreakMode = () => {
    setIsBreakModalOpen(false);
    setIsRunning(true);
  };

  const closeBreakModal = () => {
    setIsBreakModalOpen(false);
    // If break time is still running, stop it and reset to study mode
    if (!isStudyMode) {
      setIsStudyMode(true);
      setCurrentTime(studyTime);
      setIsRunning(false);
    }
  };

  const continueStudying = () => {
    setIsBreakModalOpen(false);
    setIsStudyMode(true);
    setCurrentTime(studyTime);
    setIsRunning(true);
  };

  const closeBreakEndModal = () => {
    setIsBreakEndModalOpen(false);
  };

  const startNextSession = () => {
    setIsBreakEndModalOpen(false);
    setIsStudyMode(true);
    setCurrentTime(studyTime);
    setIsRunning(true);
  };

  const extendBreak = () => {
    setIsBreakEndModalOpen(false);
    setIsStudyMode(false);
    setCurrentTime(breakTime);
    setIsRunning(true);
    setIsBreakModalOpen(true);
  };

  const value: PomodoroContextType = {
    studyTime,
    breakTime,
    currentTime,
    isStudyMode,
    isRunning,
    isActive,
    isBreakModalOpen,
    isBreakEndModalOpen,
    studyMinutes,
    breakMinutes,
    setStudyMinutes,
    setBreakMinutes,
    startTimer,
    pauseTimer,
    resetTimer,
    startFocusMode,
    stopFocusMode,
    startBreakMode,
    closeBreakModal,
    continueStudying,
    closeBreakEndModal,
    startNextSession,
    extendBreak,
    formatTime
  };

  return (
    <PomodoroContext.Provider value={value}>
      {children}
    </PomodoroContext.Provider>
  );
}

export function usePomodoro() {
  const context = useContext(PomodoroContext);
  if (context === undefined) {
    throw new Error('usePomodoro must be used within a PomodoroProvider');
  }
  return context;
} 