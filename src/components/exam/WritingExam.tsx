'use client';

import React, { useState, useRef, useEffect } from 'react';
import { PencilIcon, ClockIcon, DocumentTextIcon } from '@heroicons/react/24/solid';
import { ChevronLeftIcon, ChevronRightIcon } from '@heroicons/react/24/outline';

interface Question {
  id: number;
  text: string;
  prompt?: string;
  imageUrl?: string;
  emailContent?: string;
  keywords?: string[];
  timeLimit: number; // in minutes
  minWords?: number;
  maxWords?: number;
  answered: boolean;
  response?: string;
}

interface Part {
  id: number;
  name: string;
  description: string;
  questions: Question[];
  totalTime: number; // in minutes
}

interface WritingExamProps {
  parts: Part[];
  onAnswerSubmit: (questionId: number, response: string) => void;
  onPartComplete: (partId: number, responses: any[]) => void;
  onQuestionSubmit?: (questionId: number, answer: string) => void;
  currentQuestionId?: number;
  onStartPart?: () => void;
}

interface AIFeedback {
  score: number;
  strengths: string;
  weaknesses: string;
  suggestions: string[] | string;
  grammar_score?: number;
  vocabulary_score?: number;
  coherence_score?: number;
  task_achievement_score?: number;
}

const WritingExam: React.FC<WritingExamProps> = ({ parts, onAnswerSubmit, onPartComplete, onQuestionSubmit, currentQuestionId, onStartPart }) => {
  const [activePart, setActivePart] = useState(1);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [response, setResponse] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [feedback, setFeedback] = useState<AIFeedback | null>(null);
  const [error, setError] = useState('');
  const [wordCount, setWordCount] = useState(0);
  const [responses, setResponses] = useState<{ [key: number]: string }>({});
  const [isPartActive, setIsPartActive] = useState(false);

  // Sample data for TOEIC Writing
  const sampleParts: Part[] = [
    {
      id: 1,
      name: 'Part 1: Write a sentence based on a picture',
      description: 'Viết câu hoàn chỉnh dựa vào bức tranh và các từ cho sẵn',
      totalTime: 8,
      questions: [
        {
          id: 1,
          text: 'Write one sentence based on the picture using the given words.',
          imageUrl: '/images/writing-sample-1.jpg',
          keywords: ['man', 'computer', 'office'],
          timeLimit: 8,
          minWords: 5,
          maxWords: 20,
          answered: false
        },
        {
          id: 2,
          text: 'Write one sentence based on the picture using the given words.',
          imageUrl: '/images/writing-sample-2.jpg',
          keywords: ['woman', 'phone', 'meeting'],
          timeLimit: 8,
          minWords: 5,
          maxWords: 20,
          answered: false
        },
        {
          id: 3,
          text: 'Write one sentence based on the picture using the given words.',
          imageUrl: '/images/writing-sample-3.jpg',
          keywords: ['students', 'library', 'books'],
          timeLimit: 8,
          minWords: 5,
          maxWords: 20,
          answered: false
        },
        {
          id: 4,
          text: 'Write one sentence based on the picture using the given words.',
          imageUrl: '/images/writing-sample-4.jpg',
          keywords: ['people', 'restaurant', 'dinner'],
          timeLimit: 8,
          minWords: 5,
          maxWords: 20,
          answered: false
        },
        {
          id: 5,
          text: 'Write one sentence based on the picture using the given words.',
          imageUrl: '/images/writing-sample-5.jpg',
          keywords: ['car', 'parking', 'building'],
          timeLimit: 8,
          minWords: 5,
          maxWords: 20,
          answered: false
        }
      ]
    },
    {
      id: 2,
      name: 'Part 2: Respond to a written request',
      description: 'Viết email phản hồi thư yêu cầu',
      totalTime: 20,
      questions: [
        {
          id: 6,
          text: 'Respond to the email below as if you are a customer service representative.',
          emailContent: `From: john.customer@email.com
To: support@company.com
Subject: Problem with Online Order

Dear Customer Service,

I placed an order last week (Order #12345) but I haven't received it yet. The tracking information shows it was delivered, but I didn't receive anything. This is very frustrating as I needed these items for an important meeting.

Could you please help me resolve this issue? I would appreciate a quick response.

Thank you,
John Customer`,
          timeLimit: 20,
          minWords: 80,
          maxWords: 120,
          answered: false
        },
        {
          id: 7,
          text: 'Respond to the email below as if you are responding to a colleague.',
          emailContent: `From: sarah.manager@company.com
To: team@company.com
Subject: Upcoming Project Deadline

Dear Team,

I hope this email finds you well. I wanted to update you on our upcoming project deadline. Due to some unexpected changes from the client, we need to move the deadline forward by one week.

I know this is short notice, but I believe we can manage if we work together. Please let me know if you have any concerns or if you need additional resources.

Looking forward to your response.

Best regards,
Sarah Manager`,
          timeLimit: 20,
          minWords: 80,
          maxWords: 120,
          answered: false
        }
      ]
    },
    {
      id: 3,
      name: 'Part 3: Write an opinion essay',
      description: 'Viết một bài luận trình bày quan điểm cá nhân',
      totalTime: 30,
      questions: [
        {
          id: 8,
          text: 'Write an essay expressing your opinion on the following topic.',
          prompt: 'Some people believe that working from home is more productive than working in an office, while others think that office work is more effective. In your opinion, which work environment is better for productivity? Give reasons and examples to support your opinion.',
          timeLimit: 30,
          minWords: 300,
          answered: false
        }
      ]
    }
  ];

  const currentPart = sampleParts.find(part => part.id === activePart) || sampleParts[0];
  const currentQuestion = currentPart.questions[currentQuestionIndex];

  // Handle navigation to specific question
  useEffect(() => {
    if (currentQuestionId) {
      // Find the question in all parts
      let foundPart = null;
      let foundQuestionIndex = -1;
      
      for (const part of sampleParts) {
        const questionIndex = part.questions.findIndex(q => q.id === currentQuestionId);
        if (questionIndex !== -1) {
          foundPart = part;
          foundQuestionIndex = questionIndex;
          break;
        }
      }
      
      if (foundPart && foundQuestionIndex !== -1) {
        // Save current response before switching
        if (response.trim() && currentQuestion) {
          setResponses(prev => ({
            ...prev,
            [currentQuestion.id]: response.trim()
          }));
        }
        
        setActivePart(foundPart.id);
        setCurrentQuestionIndex(foundQuestionIndex);
        
        // Load the response for the target question
        setResponse(responses[currentQuestionId] || '');
        
        // Start the part if not already active
        if (!isPartActive) {
          setIsPartActive(true);
        }
      }
    }
  }, [currentQuestionId]);

  useEffect(() => {
    // Count words in response
    const words = response.trim().split(/\s+/).filter(word => word.length > 0);
    setWordCount(words.length);
  }, [response]);

  const startPart = () => {
    setIsPartActive(true);
    setError('');
    if (onStartPart) {
      onStartPart();
    }
  };

  const handleSubmitResponse = () => {
    if (!response.trim()) {
      setError('Không có nội dung để nộp.');
      return;
    }

    // Check word count requirements
    if (currentQuestion.minWords && wordCount < currentQuestion.minWords) {
      setError(`Cần ít nhất ${currentQuestion.minWords} từ. Hiện tại: ${wordCount} từ.`);
      return;
    }

    if (currentQuestion.maxWords && wordCount > currentQuestion.maxWords) {
      setError(`Không được vượt quá ${currentQuestion.maxWords} từ. Hiện tại: ${wordCount} từ.`);
      return;
    }

    // Save response
    setResponses(prev => ({
      ...prev,
      [currentQuestion.id]: response.trim()
    }));

    onAnswerSubmit(currentQuestion.id, response.trim());
    
    // Mark question as submitted in the navigator
    if (onQuestionSubmit) {
      onQuestionSubmit(currentQuestion.id, response.trim());
    }
    
    // Move to next question or complete part
    if (currentQuestionIndex < currentPart.questions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
      setResponse(responses[currentPart.questions[currentQuestionIndex + 1].id] || '');
    } else {
      // Complete current part
      const partResponses = currentPart.questions.map(q => ({
        questionId: q.id,
        response: responses[q.id] || (q.id === currentQuestion.id ? response : '')
      }));
      
      onPartComplete(currentPart.id, partResponses);
      setIsPartActive(false);
      
      // Move to next part or complete exam
      if (activePart < sampleParts.length) {
        setActivePart(activePart + 1);
        setCurrentQuestionIndex(0);
        resetQuestion();
      }
    }
    
    setError('');
  };

  const resetQuestion = () => {
    setResponse('');
    setWordCount(0);
    setError('');
    setIsPartActive(false);
  };

  const handleNextQuestion = () => {
    if (currentQuestionIndex < currentPart.questions.length - 1) {
      // Save current response before moving
      if (response.trim()) {
        setResponses(prev => ({
          ...prev,
          [currentQuestion.id]: response.trim()
        }));
      }
      
      setCurrentQuestionIndex(currentQuestionIndex + 1);
      // Load saved response for next question
      setResponse(responses[currentPart.questions[currentQuestionIndex + 1].id] || '');
    }
  };

  const handlePreviousQuestion = () => {
    if (currentQuestionIndex > 0) {
      // Save current response before moving
      if (response.trim()) {
        setResponses(prev => ({
          ...prev,
          [currentQuestion.id]: response.trim()
        }));
      }
      
      setCurrentQuestionIndex(currentQuestionIndex - 1);
      // Load saved response for previous question
      setResponse(responses[currentPart.questions[currentQuestionIndex - 1].id] || '');
    }
  };

  const canGoPrevious = () => {
    return currentQuestionIndex > 0;
  };

  const canGoNext = () => {
    return currentQuestionIndex < currentPart.questions.length - 1;
  };

  const getWordCountColor = () => {
    if (!currentQuestion.minWords) return 'text-gray-600';
    
    if (wordCount < currentQuestion.minWords) {
      return 'text-red-600';
    } else if (currentQuestion.maxWords && wordCount > currentQuestion.maxWords) {
      return 'text-red-600';
    } else {
      return 'text-green-600';
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-sm border">
      {/* Header */}
      <div className="p-6 border-b">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-xl font-semibold text-gray-800">{currentPart.name}</h2>
            <p className="text-gray-600 text-sm">{currentPart.description}</p>
          </div>
          <div className="text-right">
            <p className="text-sm text-gray-600">
              Câu {currentQuestionIndex + 1} / {currentPart.questions.length}
            </p>
            <p className="text-sm text-gray-600">
              Part {activePart} / {sampleParts.length}
            </p>
          </div>
        </div>

        {/* Start Button */}
        <div className="flex items-center justify-end mb-4">
          {!isPartActive && (
            <button
              onClick={startPart}
              className="bg-green-500 hover:bg-green-600 text-white px-6 py-2 rounded-lg font-medium"
            >
              Start Part {activePart}
            </button>
          )}
        </div>

        {/* Navigation */}
        {isPartActive && (
          <div className="flex justify-between items-center">
            <button
              onClick={handlePreviousQuestion}
              disabled={!canGoPrevious()}
              className="flex items-center space-x-2 px-4 py-2 text-gray-600 disabled:text-gray-400 disabled:cursor-not-allowed hover:text-gray-800"
            >
              <ChevronLeftIcon className="h-5 w-5" />
              <span>Câu trước</span>
            </button>

            <div className="text-center">
              <h3 className="font-medium text-gray-800">
                Question {currentQuestion.id}
              </h3>
            </div>

            <button
              onClick={handleNextQuestion}
              disabled={!canGoNext()}
              className="flex items-center space-x-2 px-4 py-2 text-gray-600 disabled:text-gray-400 disabled:cursor-not-allowed hover:text-gray-800"
            >
              <span>Câu tiếp</span>
              <ChevronRightIcon className="h-5 w-5" />
            </button>
          </div>
        )}
      </div>

      {/* Question Content */}
      <div className="p-6">
        {!isPartActive ? (
          <div className="text-center py-12">
            <ClockIcon className="h-16 w-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-800 mb-2">Ready to start {currentPart.name}?</h3>
            <p className="text-gray-600 mb-4">
              You will have {currentPart.totalTime} minutes to complete {currentPart.questions.length} questions.
            </p>
            <button
              onClick={startPart}
              className="bg-green-500 hover:bg-green-600 text-white px-6 py-3 rounded-lg font-medium"
            >
              Start Part {activePart}
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Question Section */}
            <div>
              <div className="bg-blue-50 p-4 rounded-lg mb-4">
                <h4 className="font-medium text-blue-900 mb-2">Instruction:</h4>
                <p className="text-blue-800">{currentQuestion.text}</p>
              </div>

              {/* Image for Part 1 */}
              {currentQuestion.imageUrl && (
                <div className="bg-gray-50 p-4 rounded-lg mb-4">
                  <h4 className="font-medium text-gray-800 mb-2">Picture:</h4>
                  <div className="bg-gray-200 h-48 rounded-lg flex items-center justify-center mb-3">
                    <span className="text-gray-500">Sample Image Placeholder</span>
                  </div>
                </div>
              )}

              {/* Email Content for Part 2 */}
              {currentQuestion.emailContent && (
                <div className="bg-gray-50 p-4 rounded-lg mb-4">
                  <h4 className="font-medium text-gray-800 mb-2">Email to respond to:</h4>
                  <div className="bg-white p-3 rounded border">
                    <pre className="text-gray-700 whitespace-pre-line text-sm">
                      {currentQuestion.emailContent}
                    </pre>
                  </div>
                </div>
              )}

              {/* Essay Prompt for Part 3 */}
              {currentQuestion.prompt && (
                <div className="bg-yellow-50 p-4 rounded-lg mb-4">
                  <h4 className="font-medium text-yellow-800 mb-2">Essay Topic:</h4>
                  <p className="text-yellow-700 leading-relaxed">{currentQuestion.prompt}</p>
                </div>
              )}

              {/* Word Count Requirements */}
              <div className="bg-purple-50 p-4 rounded-lg">
                <h4 className="font-medium text-purple-800 mb-2">Requirements:</h4>
                <div className="text-sm text-purple-700">
                  {currentQuestion.minWords && (
                    <p>Minimum words: {currentQuestion.minWords}</p>
                  )}
                  {currentQuestion.maxWords && (
                    <p>Maximum words: {currentQuestion.maxWords}</p>
                  )}
                  <p>Time limit: {currentQuestion.timeLimit} minutes</p>
                </div>
              </div>
            </div>

            {/* Writing Section */}
            <div>
              <div className="mb-4">
                <div className="flex items-center justify-between mb-2">
                  <label className="block text-sm font-medium text-gray-700">
                    Your response:
                  </label>
                  <div className={`text-sm font-medium ${getWordCountColor()}`}>
                    {wordCount} words
                    {currentQuestion.minWords && (
                      <span className="text-gray-500 ml-1">
                        (min: {currentQuestion.minWords})
                      </span>
                    )}
                  </div>
                </div>
                
                <textarea
                  value={response}
                  onChange={(e) => setResponse(e.target.value)}
                  placeholder="Start typing your response here..."
                  className="w-full h-80 p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                  disabled={!isPartActive}
                />
              </div>

              {error && (
                <div className="bg-red-50 border border-red-200 rounded-lg p-3 mb-4">
                  <p className="text-red-700 text-sm">{error}</p>
                </div>
              )}

              <div className="flex gap-3">
                <button
                  onClick={handleSubmitResponse}
                  disabled={!response.trim() || !isPartActive}
                  className="flex-1 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white font-medium py-3 px-4 rounded-lg transition duration-200 flex items-center justify-center"
                >
                  <DocumentTextIcon className="h-5 w-5 mr-2" />
                  {currentQuestionIndex === currentPart.questions.length - 1 ? 'Submit & Complete Part' : 'Submit & Continue'}
                </button>
                
                {currentQuestionIndex < currentPart.questions.length - 1 && (
                  <button
                    onClick={handleNextQuestion}
                    disabled={!isPartActive}
                    className="bg-gray-500 hover:bg-gray-600 disabled:bg-gray-300 text-white font-medium py-3 px-4 rounded-lg transition duration-200"
                  >
                    Skip
                  </button>
                )}
              </div>

              <p className="text-xs text-gray-500 mt-2 text-center">
                {!isPartActive 
                  ? "Start the part to begin writing"
                  : currentQuestion.minWords 
                    ? `Write at least ${currentQuestion.minWords} words${currentQuestion.maxWords ? ` (max ${currentQuestion.maxWords})` : ''}`
                    : "Write your response in the text area above"
                }
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default WritingExam; 