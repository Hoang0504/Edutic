'use client';

import React, { useState, useRef } from 'react';
import { 
  PhotoIcon, 
  SpeakerWaveIcon, 
  CheckCircleIcon, 
  XCircleIcon,
  PlusIcon,
  TrashIcon 
} from '@heroicons/react/24/outline';
import { ExamPart, ExamQuestion, ExamAnswer } from '@/types/exam';

interface PartEditorProps {
  part: ExamPart;
  questions: ExamQuestion[];
  answers: ExamAnswer[];
  onPartUpdate: (partData: any) => void;
  onSubmitPart: (partData: any, audioFile?: File, questionImages?: File[]) => Promise<void>;
  isSubmitting: boolean;
}

const PartEditor: React.FC<PartEditorProps> = ({
  part,
  questions,
  answers,
  onPartUpdate,
  onSubmitPart,
  isSubmitting
}) => {
  const audioInputRef = useRef<HTMLInputElement>(null);
  const [audioFile, setAudioFile] = useState<File | null>(null);
  const [questionImages, setQuestionImages] = useState<Record<number, File>>({});
  const [translations, setTranslations] = useState<Record<string, string>>({});
  const [editedQuestions, setEditedQuestions] = useState<ExamQuestion[]>(questions);
  const [editedAnswers, setEditedAnswers] = useState<ExamAnswer[]>(answers);

  // Check if this is a listening part
  const isListeningPart = [1, 2, 3, 4].includes(part.part_number);

  // Group answers by question
  const getAnswersForQuestion = (questionNumber: number) => {
    return editedAnswers.filter(answer => answer.question_number === questionNumber);
  };

  // Handle audio file selection
  const handleAudioFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      // Validate file type
      if (!file.type.startsWith('audio/')) {
        alert('Vui lòng chọn file audio hợp lệ');
        return;
      }
      
      // Validate file size (max 50MB)
      if (file.size > 50 * 1024 * 1024) {
        alert('File audio không được vượt quá 50MB');
        return;
      }
      
      setAudioFile(file);
    }
  };

  // Handle question image selection
  const handleQuestionImageSelect = (questionNumber: number, event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      // Validate file type
      if (!file.type.startsWith('image/')) {
        alert('Vui lòng chọn file ảnh hợp lệ');
        return;
      }
      
      // Validate file size (max 10MB)
      if (file.size > 10 * 1024 * 1024) {
        alert('File ảnh không được vượt quá 10MB');
        return;
      }
      
      setQuestionImages(prev => ({
        ...prev,
        [questionNumber]: file
      }));
    }
  };

  // Handle translation changes
  const handleTranslationChange = (key: string, value: string) => {
    setTranslations(prev => ({
      ...prev,
      [key]: value
    }));
  };

  // Handle question content change
  const handleQuestionContentChange = (questionNumber: number, content: string) => {
    setEditedQuestions(prev => 
      prev.map(q => 
        q.question_number === questionNumber 
          ? { ...q, content }
          : q
      )
    );
  };

  // Handle answer changes
  const handleAnswerChange = (questionNumber: number, answerIndex: number, field: string, value: any) => {
    setEditedAnswers(prev => {
      const questionAnswers = prev.filter(a => a.question_number === questionNumber);
      const targetAnswer = questionAnswers[answerIndex];
      
      if (!targetAnswer) return prev;
      
      return prev.map(answer => 
        answer.question_number === questionNumber && 
        answer.content === targetAnswer.content
          ? { ...answer, [field]: value }
          : answer
      );
    });
  };

  // Set correct answer
  const setCorrectAnswer = (questionNumber: number, correctAnswerIndex: number) => {
    setEditedAnswers(prev => {
      const questionAnswers = prev.filter(a => a.question_number === questionNumber);
      
      return prev.map(answer => {
        if (answer.question_number === questionNumber) {
          const answerIndex = questionAnswers.findIndex(a => a.content === answer.content);
          return { ...answer, is_correct: answerIndex === correctAnswerIndex };
        }
        return answer;
      });
    });
  };

  // Submit part data
  const handleSubmit = async () => {
    // Validate required fields
    if (!part.title.trim()) {
      alert('Vui lòng nhập tiêu đề part');
      return;
    }

    if (isListeningPart && !audioFile) {
      alert(`Part ${part.part_number} là part listening, cần upload file audio`);
      return;
    }

    // Validate each question has at least one correct answer
    for (const question of editedQuestions) {
      const questionAnswers = getAnswersForQuestion(question.question_number);
      const hasCorrectAnswer = questionAnswers.some(answer => answer.is_correct);
      
      if (!hasCorrectAnswer) {
        alert(`Câu hỏi "${question.content}" phải có ít nhất một đáp án đúng`);
        return;
      }
    }

    // Prepare part data for submission
    const partData = {
      title: part.title,
      part_number: part.part_number,
      difficulty_level: part.difficulty_level || 'medium',
      instruction: part.instruction || '',
      time_limit: part.time_limit,
      questions: editedQuestions.map(question => ({
        question: question.content,
        vietnamese_translation: translations[`question_${question.question_number}`] || question.vietnamese_translation,
        answers: getAnswersForQuestion(question.question_number).map(answer => ({
          content: answer.content,
          is_correct: answer.is_correct,
          explanation: answer.explanation,
          vietnamese_translation: translations[`answer_${question.question_number}_${answer.content}`] || answer.vietnamese_translation
        }))
      })),
      translations: Object.entries(translations).map(([key, value]) => ({
        question_id: key.includes('question') ? parseInt(key.split('_')[1]) : undefined,
        vietnamese_text: value
      })).filter(t => t.vietnamese_text.trim())
    };

    // Collect question images
    const imageFiles = Object.values(questionImages);

    await onSubmitPart(partData, audioFile || undefined, imageFiles);
  };

  return (
    <div className="bg-white rounded-lg shadow p-6">
      {/* Part Header */}
      <div className="mb-6">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-semibold text-gray-900">
            Part {part.part_number}: {part.title}
          </h2>
          <span className={`px-3 py-1 rounded-full text-sm font-medium ${
            part.type === 'listening' ? 'bg-blue-100 text-blue-800' : 'bg-green-100 text-green-800'
          }`}>
            {part.type === 'listening' ? 'Listening' : 'Reading'}
          </span>
        </div>
        
        <p className="text-gray-600 mt-2">{part.description}</p>
        
        {part.instruction && (
          <div className="mt-3 p-3 bg-yellow-50 border border-yellow-200 rounded-md">
            <p className="text-sm text-yellow-800">
              <strong>Hướng dẫn:</strong> {part.instruction}
            </p>
          </div>
        )}
      </div>

      {/* Audio Upload (for listening parts) */}
      {isListeningPart && (
        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            <SpeakerWaveIcon className="h-4 w-4 inline mr-1" />
            Upload Audio cho Part {part.part_number} *
          </label>
          <div className="flex items-center space-x-4">
            <button
              onClick={() => audioInputRef.current?.click()}
              className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
            >
              <PhotoIcon className="h-4 w-4 mr-2" />
              Chọn file audio
            </button>
            
            {audioFile && (
              <span className="text-sm text-green-600">
                <CheckCircleIcon className="h-4 w-4 inline mr-1" />
                {audioFile.name}
              </span>
            )}
          </div>
          
          <input
            ref={audioInputRef}
            type="file"
            accept="audio/*"
            onChange={handleAudioFileSelect}
            className="hidden"
          />
        </div>
      )}

      {/* Questions */}
      <div className="space-y-6">
        {editedQuestions.map((question, questionIndex) => {
          const questionAnswers = getAnswersForQuestion(question.question_number);
          
          return (
            <div key={question.question_number} className="border border-gray-200 rounded-lg p-4">
              {/* Question Header */}
              <div className="flex items-start justify-between mb-3">
                <h3 className="text-lg font-medium text-gray-900">
                  Câu hỏi {question.question_number}
                </h3>
                <div className="flex items-center space-x-2">
                  <label className="inline-flex items-center px-3 py-1 border border-gray-300 rounded-md cursor-pointer hover:bg-gray-50">
                    <PhotoIcon className="h-4 w-4 mr-1" />
                    <span className="text-sm">Ảnh</span>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={(e) => handleQuestionImageSelect(question.question_number, e)}
                      className="hidden"
                    />
                  </label>
                  {questionImages[question.question_number] && (
                    <CheckCircleIcon className="h-4 w-4 text-green-500" />
                  )}
                </div>
              </div>

              {/* Question Content */}
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Nội dung câu hỏi
                </label>
                <textarea
                  value={question.content}
                  onChange={(e) => handleQuestionContentChange(question.question_number, e.target.value)}
                  className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-900 placeholder-gray-500 bg-white input-enhanced"
                  rows={2}
                  placeholder="Nhập nội dung câu hỏi..."
                />
              </div>

              {/* Vietnamese Translation for Question */}
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Bản dịch tiếng Việt (câu hỏi)
                </label>
                <textarea
                  value={translations[`question_${question.question_number}`] || question.vietnamese_translation || ''}
                  onChange={(e) => handleTranslationChange(`question_${question.question_number}`, e.target.value)}
                  className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-900 placeholder-gray-500 bg-white input-enhanced"
                  rows={2}
                  placeholder="Nhập bản dịch tiếng Việt cho câu hỏi"
                />
              </div>

              {/* Answers */}
              <div className="space-y-3">
                <h4 className="text-sm font-medium text-gray-700">Đáp án</h4>
                {questionAnswers.map((answer, answerIndex) => {
                  const isCorrect = answer.is_correct;
                  
                  return (
                    <div key={answerIndex} className={`p-3 border-2 rounded-md ${
                      isCorrect ? 'border-green-500 bg-green-50' : 'border-gray-200 bg-white'
                    }`}>
                      <div className="flex items-start space-x-3">
                        <button
                          onClick={() => setCorrectAnswer(question.question_number, answerIndex)}
                          className={`mt-1 ${
                            isCorrect 
                              ? 'text-green-600' 
                              : 'text-gray-400 hover:text-green-600'
                          }`}
                        >
                          {isCorrect ? (
                            <CheckCircleIcon className="h-5 w-5" />
                          ) : (
                            <XCircleIcon className="h-5 w-5" />
                          )}
                        </button>
                        
                        <div className="flex-1 space-y-2">
                          <input
                            value={answer.content}
                            onChange={(e) => handleAnswerChange(question.question_number, answerIndex, 'content', e.target.value)}
                            className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-900 placeholder-gray-500 bg-white font-medium input-enhanced"
                            placeholder={`Đáp án ${String.fromCharCode(65 + answerIndex)}`}
                          />
                          
                          <input
                            value={translations[`answer_${question.question_number}_${answer.content}`] || answer.vietnamese_translation || ''}
                            onChange={(e) => handleTranslationChange(`answer_${question.question_number}_${answer.content}`, e.target.value)}
                            className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-900 placeholder-gray-500 bg-white input-enhanced"
                            placeholder="Bản dịch tiếng Việt"
                          />
                          
                          {answer.explanation && (
                            <input
                              value={answer.explanation}
                              onChange={(e) => handleAnswerChange(question.question_number, answerIndex, 'explanation', e.target.value)}
                              className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-900 placeholder-gray-500 bg-white input-enhanced"
                              placeholder="Giải thích đáp án"
                            />
                          )}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>

      {/* Submit Button */}
      <div className="mt-6 flex justify-end">
        <button
          onClick={handleSubmit}
          disabled={isSubmitting}
          className={`px-6 py-2 rounded-md font-medium ${
            isSubmitting
              ? 'bg-gray-400 text-white cursor-not-allowed'
              : 'bg-blue-600 text-white hover:bg-blue-700'
          }`}
        >
          {isSubmitting ? 'Đang gửi...' : `Gửi Part ${part.part_number}`}
        </button>
      </div>
    </div>
  );
};

export default PartEditor; 