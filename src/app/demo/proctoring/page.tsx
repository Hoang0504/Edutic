'use client';

import React, { useState } from 'react';
import ExamProctoring from '@/components/exam/ExamProctoring';
import ExamPermissionDialog from '@/components/ExamPermissionDialog';
import ExamViolationAlert from '@/components/exam/ExamViolationAlert';
import { useExamProctoring } from '@/hooks/UseExamProctoring';

const ProctoringDemo = () => {
  const [activeSkill, setActiveSkill] = useState<'listening' | 'reading' | 'writing' | 'speaking'>('reading');
  const [isTimerPaused, setIsTimerPaused] = useState(false);

  // Initialize proctoring system
  const proctoringSystem = useExamProctoring({
    isEnabled: true,
    currentSkill: activeSkill,
    onTimerPause: (pause: boolean) => {
      setIsTimerPaused(pause);
      console.log('Timer paused:', pause);
    },
    onExamCancel: () => {
      console.log('Exam cancelled by proctoring system');
      alert('Bài thi đã bị hủy bởi hệ thống giám sát');
    }
  });

  const handleStartProctoring = () => {
    proctoringSystem.requestProctoringPermission();
  };

  const skills = [
    { id: 'listening', name: 'Listening', description: 'Phần nghe - được phép nói' },
    { id: 'reading', name: 'Reading', description: 'Phần đọc - KHÔNG được nói' },
    { id: 'writing', name: 'Writing', description: 'Phần viết - được phép nói' },
    { id: 'speaking', name: 'Speaking', description: 'Phần nói - được phép nói' }
  ];

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="bg-white rounded-lg shadow-sm border p-6 mb-6">
          <h1 className="text-2xl font-bold text-gray-800 mb-2">
            🎯 Demo Hệ thống Giám sát Thi
          </h1>
          <p className="text-gray-600 mb-4">
            Test các tính năng giám sát camera và microphone cho kỳ thi trực tuyến
          </p>

          {/* Start button */}
          {!proctoringSystem.proctoringEnabled && !proctoringSystem.showPermissionDialog && (
            <button
              onClick={handleStartProctoring}
              className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-medium"
            >
              🚀 Bắt đầu Giám sát
            </button>
          )}

          {/* Status */}
          {proctoringSystem.proctoringEnabled && (
            <div className="flex items-center space-x-4 text-sm">
              <div className="flex items-center space-x-2">
                <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
                <span className="text-green-600 font-medium">Giám sát đang hoạt động</span>
              </div>
              
              {proctoringSystem.shouldShowRiskWarning() && (
                <div className="flex items-center space-x-2">
                  <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                  <span className="text-red-600 font-medium">
                    Cảnh báo: {proctoringSystem.getViolationStats().total} vi phạm
                  </span>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Skills selector */}
        <div className="bg-white rounded-lg shadow-sm border p-6 mb-6">
          <h2 className="text-lg font-semibold text-gray-800 mb-4">
            Chọn phần thi để test:
          </h2>
          
          <div className="grid grid-cols-2 gap-4">
            {skills.map((skill) => (
              <button
                key={skill.id}
                onClick={() => setActiveSkill(skill.id as any)}
                className={`p-4 rounded-lg border-2 transition-colors text-left ${
                  activeSkill === skill.id
                    ? 'border-blue-500 bg-blue-50'
                    : 'border-gray-200 hover:border-gray-300'
                }`}
              >
                <div className="font-medium text-gray-800">{skill.name}</div>
                <div className="text-sm text-gray-600 mt-1">{skill.description}</div>
                {activeSkill === skill.id && (
                  <div className="text-xs text-blue-600 mt-2 font-medium">✓ Đang active</div>
                )}
              </button>
            ))}
          </div>

          {activeSkill === 'reading' && (
            <div className="mt-4 bg-amber-50 border border-amber-200 rounded-lg p-4">
              <div className="flex items-start space-x-2">
                <div className="text-amber-500 mt-0.5">⚠️</div>
                <div>
                  <div className="font-medium text-amber-800">Chế độ Reading Test</div>
                  <div className="text-sm text-amber-700 mt-1">
                    Thử nói gì đó - hệ thống sẽ phát hiện và cảnh báo!
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Test instructions */}
        <div className="bg-white rounded-lg shadow-sm border p-6 mb-6">
          <h2 className="text-lg font-semibold text-gray-800 mb-4">
            📋 Hướng dẫn Test:
          </h2>
          
          <div className="space-y-4">
            <div className="flex items-start space-x-3">
              <div className="flex-shrink-0 w-6 h-6 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center text-sm font-medium">1</div>
              <div>
                <div className="font-medium text-gray-800">Test Camera</div>
                <div className="text-sm text-gray-600">Thử rời khỏi camera trong 5 giây để kích hoạt cảnh báo</div>
              </div>
            </div>

            <div className="flex items-start space-x-3">
              <div className="flex-shrink-0 w-6 h-6 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center text-sm font-medium">2</div>
              <div>
                <div className="font-medium text-gray-800">Test Microphone</div>
                <div className="text-sm text-gray-600">Chuyển sang phần "Reading" và thử nói gì đó</div>
              </div>
            </div>

            <div className="flex items-start space-x-3">
              <div className="flex-shrink-0 w-6 h-6 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center text-sm font-medium">3</div>
              <div>
                <div className="font-medium text-gray-800">Test Face Detection</div>
                <div className="text-sm text-gray-600">Quan sát khung vẽ xanh xung quanh khuôn mặt và landmarks</div>
              </div>
            </div>

            <div className="flex items-start space-x-3">
              <div className="flex-shrink-0 w-6 h-6 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center text-sm font-medium">4</div>
              <div>
                <div className="font-medium text-gray-800">Test Violation Alert</div>
                <div className="text-sm text-gray-600">Khi có vi phạm, chọn "Tiếp tục thi" hoặc "Hủy bài thi"</div>
              </div>
            </div>
          </div>
        </div>

        {/* Current status */}
        <div className="bg-white rounded-lg shadow-sm border p-6">
          <h2 className="text-lg font-semibold text-gray-800 mb-4">
            📊 Trạng thái hiện tại:
          </h2>
          
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-gray-50 rounded-lg p-4">
              <div className="text-sm text-gray-600 mb-1">Phần thi đang active</div>
              <div className="font-medium text-gray-800">{activeSkill.toUpperCase()}</div>
            </div>

            <div className="bg-gray-50 rounded-lg p-4">
              <div className="text-sm text-gray-600 mb-1">Timer</div>
              <div className={`font-medium ${isTimerPaused ? 'text-orange-600' : 'text-green-600'}`}>
                {isTimerPaused ? 'Đã tạm dừng' : 'Đang chạy'}
              </div>
            </div>

            <div className="bg-gray-50 rounded-lg p-4">
              <div className="text-sm text-gray-600 mb-1">Tổng vi phạm</div>
              <div className="font-medium text-gray-800">{proctoringSystem.getViolationStats().total}</div>
            </div>

            <div className="bg-gray-50 rounded-lg p-4">
              <div className="text-sm text-gray-600 mb-1">Giám sát</div>
              <div className={`font-medium ${proctoringSystem.proctoringEnabled ? 'text-green-600' : 'text-gray-400'}`}>
                {proctoringSystem.proctoringEnabled ? 'Đang hoạt động' : 'Tắt'}
              </div>
            </div>
          </div>

          {/* Violation history */}
          {proctoringSystem.violationHistory.length > 0 && (
            <div className="mt-6">
              <h3 className="font-medium text-gray-800 mb-2">Lịch sử vi phạm:</h3>
              <div className="space-y-2 max-h-32 overflow-y-auto">
                {proctoringSystem.violationHistory.slice(-5).map((violation, index) => (
                  <div
                    key={violation.timestamp}
                    className={`text-xs px-3 py-2 rounded ${
                      violation.type === 'face' ? 'bg-red-100 text-red-700' : 'bg-orange-100 text-orange-700'
                    }`}
                  >
                    <span className="font-medium">{violation.type.toUpperCase()}:</span> {violation.message}
                    <span className="ml-2 text-gray-500">
                      {new Date(violation.timestamp).toLocaleTimeString()}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Proctoring Components */}
      <ExamProctoring
        isEnabled={proctoringSystem.proctoringEnabled}
        onViolation={proctoringSystem.handleViolation}
        onPauseTimer={(pause) => setIsTimerPaused(pause)}
        currentSkill={activeSkill}
      />

      <ExamPermissionDialog
        isOpen={proctoringSystem.showPermissionDialog}
        onPermissionGranted={proctoringSystem.handlePermissionGranted}
        onSkipProctoring={proctoringSystem.handleSkipProctoring}
        onCancel={proctoringSystem.handlePermissionCancel}
      />

      <ExamViolationAlert
        isVisible={proctoringSystem.showViolationAlert}
        violationType={proctoringSystem.currentViolation?.type || 'face'}
        message={proctoringSystem.currentViolation?.message || ''}
        onContinue={proctoringSystem.handleContinueAfterViolation}
        onCancel={proctoringSystem.handleCancelFromViolation}
      />
    </div>
  );
};

export default ProctoringDemo; 