'use client';

import React, { useState, useEffect } from 'react';
import QuestionNavigator from './QuestionNavigator';
import SpeakingExam from './SpeakingExam';
import WritingExam from './WritingExam';

interface ExamLayoutProps {
  examTitle: string;
  totalTime: number; // in minutes
  onExit: () => void;
  onSubmit: () => void;
  children: React.ReactNode;
  onSkillChange?: (skill: string) => void;
  selectedAnswers?: { [key: number]: string };
  onQuestionClick?: (questionId: number) => void;
}

const ExamLayout: React.FC<ExamLayoutProps> = ({
  examTitle,
  totalTime,
  onExit,
  onSubmit,
  children,
  onSkillChange,
  selectedAnswers: initialSelectedAnswers = {},
  onQuestionClick = () => {}
}) => {
  const [activeSkill, setActiveSkill] = useState<'listening' | 'reading' | 'writing' | 'speaking'>('listening');
  const [responses, setResponses] = useState<{ [key: number]: any }>({});
  const [selectedAnswers, setSelectedAnswers] = useState<{ [key: number]: string }>(initialSelectedAnswers);
  const [currentQuestionId, setCurrentQuestionId] = useState<number | undefined>(undefined);
  const [isPartActive, setIsPartActive] = useState(false);
  const [timeLeft, setTimeLeft] = useState(0);

  // Get time for each skill (in minutes)
  const getSkillTime = (skill: string) => {
    switch (skill) {
      case 'listening': return 45; // 45 minutes
      case 'reading': return 75;   // 75 minutes  
      case 'writing': return 8;    // 8 minutes
      case 'speaking': return 8;   // 8 minutes
      default: return totalTime;
    }
  };

  const skills = [
    { id: 'listening', name: 'Listening', color: 'bg-blue-500' },
    { id: 'reading', name: 'Reading', color: 'bg-green-500' },
    { id: 'writing', name: 'Writing', color: 'bg-yellow-500' },
    { id: 'speaking', name: 'Speaking', color: 'bg-red-500' }
  ];

  // Start part timer
  const startPartTimer = () => {
    setIsPartActive(true);
    setTimeLeft(getSkillTime(activeSkill) * 60);
  };

  // Reset when skill changes
  useEffect(() => {
    setIsPartActive(false);
    setTimeLeft(getSkillTime(activeSkill) * 60);
  }, [activeSkill]);

  useEffect(() => {
    if (!isPartActive) return;

    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          setIsPartActive(false);
          onSubmit();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [onSubmit, isPartActive]);

  const formatTime = (seconds: number) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const handleSkillChange = (skill: 'listening' | 'reading' | 'writing' | 'speaking') => {
    setActiveSkill(skill);
    setCurrentQuestionId(undefined);
    if (onSkillChange) {
      onSkillChange(skill);
    }
  };

  // Handle speaking/writing responses
  const handleAnswerSubmit = async (questionId: number, response: string, audioBlob?: Blob) => {
    setResponses(prev => ({
      ...prev,
      [questionId]: { response, audioBlob }
    }));
    
    // Mark this question as answered
    setSelectedAnswers(prev => ({
      ...prev,
      [questionId]: response || 'submitted'
    }));
  };

  // Handle individual question submission (for writing/speaking specific questions)
  const handleQuestionSubmit = (questionId: number, answer: string) => {
    setSelectedAnswers(prev => ({
      ...prev,
      [questionId]: answer
    }));
  };

  // Handle question navigation when clicking on question numbers
  const handleQuestionClick = (questionId: number) => {
    // Only allow navigation for writing and speaking
    if (activeSkill === 'writing' || activeSkill === 'speaking') {
      setCurrentQuestionId(questionId);
    }
    
    // Call the original onQuestionClick for other functionality
    onQuestionClick(questionId);
  };

  // Get parts structure for current active skill
  const getPartsForActiveSkill = () => {
    switch (activeSkill) {
      case 'listening':
        return [
          { id: 1, name: 'Part 1', questionStart: 1, questionCount: 6 },
          { id: 2, name: 'Part 2', questionStart: 7, questionCount: 25 },
          { id: 3, name: 'Part 3', questionStart: 32, questionCount: 39 },
          { id: 4, name: 'Part 4', questionStart: 71, questionCount: 30 }
        ];
      case 'reading':
        return [
          { id: 5, name: 'Part 5', questionStart: 101, questionCount: 30 },
          { id: 6, name: 'Part 6', questionStart: 131, questionCount: 16 },
          { id: 7, name: 'Part 7', questionStart: 147, questionCount: 54 }
        ];
      case 'writing':
        return [
          { id: 1, name: 'Part 1', questionStart: 1, questionCount: 5 },
          { id: 2, name: 'Part 2', questionStart: 6, questionCount: 1 }
        ];
      case 'speaking':
        return [
          { id: 1, name: 'Part 1', questionStart: 1, questionCount: 2 },
          { id: 2, name: 'Part 2', questionStart: 3, questionCount: 1 },
          { id: 3, name: 'Part 3', questionStart: 4, questionCount: 3 },
          { id: 4, name: 'Part 4', questionStart: 7, questionCount: 3 },
          { id: 5, name: 'Part 5', questionStart: 10, questionCount: 1 },
          { id: 6, name: 'Part 6', questionStart: 11, questionCount: 1 }
        ];
      default:
        return [];
    }
  };

  // Handle part completion with AI analysis
  const handlePartComplete = async (partId: number, responses: any[]) => {
    try {
      console.log(`Part ${partId} completed with responses:`, responses);
      
      // Combine all responses for this part
      const combinedContent = responses.map(r => r.transcription || r.response).filter(Boolean).join('\n\n');
      
      if (!combinedContent.trim()) {
        console.warn('No content to analyze for part', partId);
        return;
      }

      let apiEndpoint = '';
      let analysisData: any = {};

      if (activeSkill === 'speaking') {
        apiEndpoint = '/api/demo/analyze-speaking';
        analysisData = {
          question: `TOEIC Speaking Part ${partId} - Multiple responses`,
          transcription: combinedContent,
          recordingTime: responses.length * 30 // Estimate based on number of responses
        };
      } else if (activeSkill === 'writing') {
        apiEndpoint = '/api/demo/analyze-writing';
        analysisData = {
          question: `TOEIC Writing Part ${partId} - Multiple responses`,
          essay: combinedContent
        };
      }

      if (apiEndpoint) {
        const response = await fetch(apiEndpoint, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(analysisData),
        });

        if (response.ok) {
          const feedback = await response.json();
          console.log(`AI feedback for part ${partId}:`, feedback);
          
          // Show feedback to user (you can implement a modal or sidebar for this)
          alert(`Part ${partId} completed! AI Score: ${feedback.score}/10. Check console for detailed feedback.`);
        } else {
          console.error('Failed to get AI analysis');
        }
      }
    } catch (error) {
      console.error('Error analyzing part:', error);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex justify-between items-center">
            <h1 className="text-xl font-semibold text-gray-800">{examTitle}</h1>
            <button
              onClick={onExit}
              className="bg-teal-500 hover:bg-teal-600 text-white px-6 py-2 rounded-lg font-medium transition-colors"
            >
              Thoát
            </button>
          </div>
        </div>
      </div>

      {/* Skills Navigation */}
      <div className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex space-x-1">
            {skills.map((skill) => (
              <button
                key={skill.id}
                onClick={() => handleSkillChange(skill.id as any)}
                className={`px-6 py-3 font-medium text-sm rounded-t-lg transition-colors ${
                  activeSkill === skill.id
                    ? 'bg-gray-100 text-gray-800 border-b-2 border-blue-500'
                    : 'text-gray-600 hover:text-gray-800 hover:bg-gray-50'
                }`}
              >
                {skill.name}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-6">
        <div className="flex gap-6">
          {/* Main Content */}
          <div className="flex-1">
            {activeSkill === 'listening' && children}
            {activeSkill === 'reading' && (
              <div className="bg-white rounded-lg shadow-sm border p-6">
                <h2 className="text-lg font-medium text-gray-800 mb-4">Reading Section</h2>
                <p className="text-gray-600">Reading interface will be implemented here.</p>
              </div>
            )}
            {activeSkill === 'writing' && (
              <WritingExam
                parts={[]} // Will be populated from props or API later
                onAnswerSubmit={handleAnswerSubmit}
                onPartComplete={handlePartComplete}
                onQuestionSubmit={handleQuestionSubmit}
                currentQuestionId={currentQuestionId}
                onStartPart={startPartTimer}
              />
            )}
            {activeSkill === 'speaking' && (
              <SpeakingExam
                parts={[]} // Will be populated from props or API later
                onAnswerSubmit={handleAnswerSubmit}
                onPartComplete={handlePartComplete}
                onQuestionSubmit={handleQuestionSubmit}
                currentQuestionId={currentQuestionId}
                onStartPart={startPartTimer}
              />
            )}
          </div>

          {/* Right Sidebar */}
          <div className="w-80 space-y-6">
            {/* Timer */}
            <div className="bg-white rounded-lg shadow-sm border p-4">
              <h3 className="font-medium text-gray-800 mb-2">Thời gian làm bài</h3>
              <div className="text-2xl font-bold text-red-600 mb-4">
                {isPartActive ? formatTime(timeLeft) : `${getSkillTime(activeSkill)}:00`}
              </div>
              <button
                onClick={onSubmit}
                className="w-full bg-green-500 hover:bg-green-600 text-white py-2 rounded-lg font-medium transition-colors"
              >
                Nộp bài
              </button>
            </div>

            {/* Question Navigator */}
            <QuestionNavigator
              selectedAnswers={selectedAnswers}
              onQuestionClick={handleQuestionClick}
              activeSkill={activeSkill}
            />

            {/* Progress Summary */}
            <div className="bg-white rounded-lg shadow-sm border p-4">
              <h3 className="font-medium text-gray-800 mb-3">Progress Summary</h3>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-600">Listening:</span>
                  <span className="font-medium">Completed</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Reading:</span>
                  <span className="font-medium">Not started</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Writing:</span>
                  <span className="font-medium">In progress</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Speaking:</span>
                  <span className="font-medium">Not started</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ExamLayout; 