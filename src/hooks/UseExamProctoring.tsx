'use client';

import { useState, useCallback, useRef } from 'react';

interface UseExamProctoringOptions {
  isEnabled: boolean;
  currentSkill: 'listening' | 'reading' | 'writing' | 'speaking';
  onTimerPause: (pause: boolean) => void;
  onExamCancel: () => void;
}

interface ViolationData {
  type: 'face' | 'audio';
  message: string;
  timestamp: number;
}

export const useExamProctoring = (options: UseExamProctoringOptions) => {
  const { isEnabled, currentSkill, onTimerPause, onExamCancel } = options;
  
  const [showPermissionDialog, setShowPermissionDialog] = useState(false);
  const [proctoringEnabled, setProctoringEnabled] = useState(false);
  const [showViolationAlert, setShowViolationAlert] = useState(false);
  const [currentViolation, setCurrentViolation] = useState<ViolationData | null>(null);
  const [violationHistory, setViolationHistory] = useState<ViolationData[]>([]);
  const [isTimerPaused, setIsTimerPaused] = useState(false);
  
  const violationTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Show permission dialog when starting exam
  const requestProctoringPermission = useCallback(() => {
    setShowPermissionDialog(true);
  }, []);

  // Handle permission granted
  const handlePermissionGranted = useCallback(() => {
    setShowPermissionDialog(false);
    setProctoringEnabled(true);
  }, []);

  // Handle skip proctoring
  const handleSkipProctoring = useCallback(() => {
    setShowPermissionDialog(false);
    setProctoringEnabled(false);
  }, []);

  // Handle permission dialog cancel
  const handlePermissionCancel = useCallback(() => {
    setShowPermissionDialog(false);
    onExamCancel();
  }, [onExamCancel]);

  // Handle violation detection
  const handleViolation = useCallback((type: 'face' | 'audio', message: string) => {
    const violation: ViolationData = {
      type,
      message,
      timestamp: Date.now()
    };

    // Add to violation history
    setViolationHistory(prev => [...prev, violation]);

    // Prevent multiple alerts for the same violation type within 5 seconds
    if (violationTimeoutRef.current) {
      return;
    }

    // Set current violation and show alert
    setCurrentViolation(violation);
    setShowViolationAlert(true);
    
    // Pause timer
    if (!isTimerPaused) {
      setIsTimerPaused(true);
      onTimerPause(true);
    }

    // Set timeout to prevent spam
    violationTimeoutRef.current = setTimeout(() => {
      violationTimeoutRef.current = null;
    }, 5000);

  }, [isTimerPaused, onTimerPause]);

  // Handle continue after violation
  const handleContinueAfterViolation = useCallback(() => {
    setShowViolationAlert(false);
    setCurrentViolation(null);
    
    // Resume timer
    if (isTimerPaused) {
      setIsTimerPaused(false);
      onTimerPause(false);
    }
  }, [isTimerPaused, onTimerPause]);

  // Handle cancel exam from violation alert
  const handleCancelFromViolation = useCallback(() => {
    setShowViolationAlert(false);
    setCurrentViolation(null);
    onExamCancel();
  }, [onExamCancel]);

  // Get violation statistics
  const getViolationStats = useCallback(() => {
    const faceViolations = violationHistory.filter(v => v.type === 'face').length;
    const audioViolations = violationHistory.filter(v => v.type === 'audio').length;
    
    return {
      total: violationHistory.length,
      face: faceViolations,
      audio: audioViolations
    };
  }, [violationHistory]);

  // Check if should show violation risk warning
  const shouldShowRiskWarning = useCallback(() => {
    const stats = getViolationStats();
    return stats.total >= 3; // Show warning after 3 violations
  }, [getViolationStats]);

  // Reset proctoring state (useful for exam restart)
  const resetProctoringState = useCallback(() => {
    setShowPermissionDialog(false);
    setProctoringEnabled(false);
    setShowViolationAlert(false);
    setCurrentViolation(null);
    setViolationHistory([]);
    setIsTimerPaused(false);
    
    if (violationTimeoutRef.current) {
      clearTimeout(violationTimeoutRef.current);
      violationTimeoutRef.current = null;
    }
  }, []);

  return {
    // State
    showPermissionDialog,
    proctoringEnabled,
    showViolationAlert,
    currentViolation,
    violationHistory,
    isTimerPaused,
    
    // Actions
    requestProctoringPermission,
    handlePermissionGranted,
    handleSkipProctoring,
    handlePermissionCancel,
    handleViolation,
    handleContinueAfterViolation,
    handleCancelFromViolation,
    resetProctoringState,
    
    // Utilities
    getViolationStats,
    shouldShowRiskWarning
  };
}; 