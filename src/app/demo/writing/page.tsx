'use client';

import { useState } from 'react';
import { PaperAirplaneIcon, ClockIcon, PencilIcon } from '@heroicons/react/24/outline';

interface AIFeedback {
  score: number;
  strengths: string;
  weaknesses: string;
  suggestions: string[] | string;
  content_analysis?: string;
  grammar_score?: number;
  vocabulary_score?: number;
  coherence_score?: number;
}

export default function WritingDemoPage() {
  const [question, setQuestion] = useState<string>(
    "You recently moved to a new city for work. Write an email to a friend describing your new city, your job, and how you are adjusting to the change. Write at least 150 words."
  );
  const [answer, setAnswer] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [feedback, setFeedback] = useState<AIFeedback | null>(null);
  const [error, setError] = useState<string>('');
  const [wordCount, setWordCount] = useState<number>(0);

  const handleAnswerChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const text = e.target.value;
    setAnswer(text);
    setWordCount(text.trim().split(/\s+/).filter(word => word.length > 0).length);
  };

  const handleSubmit = async () => {
    if (!answer.trim()) {
      setError('Vui lòng nhập câu trả lời của bạn');
      return;
    }

    if (wordCount < 150) {
      setError('Bài viết cần ít nhất 150 từ');
      return;
    }

    setIsLoading(true);
    setError('');
    setFeedback(null);

    try {
      const response = await fetch('/api/demo/analyze-writing', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          question,
          answer,
        }),
      });

      if (!response.ok) {
        throw new Error('Có lỗi xảy ra khi phân tích bài viết');
      }

      const data = await response.json();
      setFeedback(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Có lỗi xảy ra');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-8">
      <div className="max-w-4xl mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-800 mb-2">
            TOEIC Writing Demo
          </h1>
          <p className="text-gray-600">
            Viết bài và nhận phân tích từ AI DeepSeek
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Writing Section */}
          <div className="bg-white rounded-xl shadow-lg p-6">
            <div className="flex items-center mb-4">
              <PencilIcon className="h-6 w-6 text-blue-500 mr-2" />
              <h2 className="text-xl font-semibold text-gray-800">Đề bài</h2>
            </div>
            
            <div className="bg-blue-50 p-4 rounded-lg mb-6">
              <p className="text-gray-800 leading-relaxed">{question}</p>
            </div>

            <div className="mb-4">
              <div className="flex justify-between items-center mb-2">
                <label className="block text-sm font-medium text-gray-700">
                  Câu trả lời của bạn
                </label>
                <div className="flex items-center space-x-4">
                  <span className={`text-sm ${wordCount >= 150 ? 'text-green-600' : 'text-orange-600'}`}>
                    {wordCount} từ
                  </span>
                  <ClockIcon className="h-4 w-4 text-gray-400" />
                </div>
              </div>
              
              <textarea
                value={answer}
                onChange={handleAnswerChange}
                placeholder="Bắt đầu viết bài của bạn tại đây..."
                rows={12}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
              />
              
              {wordCount < 150 && answer.trim() && (
                <p className="text-sm text-orange-600 mt-2">
                  Cần thêm {150 - wordCount} từ để đạt yêu cầu tối thiểu
                </p>
              )}
            </div>

            {error && (
              <div className="bg-red-50 border border-red-200 rounded-lg p-3 mb-4">
                <p className="text-red-700 text-sm">{error}</p>
              </div>
            )}

            <button
              onClick={handleSubmit}
              disabled={isLoading || !answer.trim() || wordCount < 150}
              className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white font-medium py-3 px-4 rounded-lg transition duration-200 flex items-center justify-center"
            >
              {isLoading ? (
                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
              ) : (
                <>
                  <PaperAirplaneIcon className="h-5 w-5 mr-2" />
                  Nộp bài và nhận phân tích
                </>
              )}
            </button>
          </div>

          {/* Feedback Section */}
          <div className="bg-white rounded-xl shadow-lg p-6">
            <h2 className="text-xl font-semibold text-gray-800 mb-6">
              Phân tích từ AI DeepSeek
            </h2>

            {!feedback && !isLoading && (
              <div className="text-center py-12">
                <div className="text-gray-400 mb-4">
                  <svg className="mx-auto h-16 w-16" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                </div>
                <p className="text-gray-500">
                  Hoàn thành bài viết và nhấn "Nộp bài" để nhận phản hồi từ AI
                </p>
              </div>
            )}

            {isLoading && (
              <div className="text-center py-12">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
                <p className="text-gray-600">AI đang phân tích bài viết của bạn...</p>
              </div>
            )}

            {feedback && (
              <div className="space-y-6">
                {/* Overall Score */}
                <div className="bg-gradient-to-r from-green-50 to-blue-50 p-4 rounded-lg">
                  <div className="flex items-center justify-between">
                    <h3 className="font-semibold text-gray-800">Điểm tổng</h3>
                    <span className="text-2xl font-bold text-blue-600">
                      {feedback.score}/10
                    </span>
                  </div>
                </div>

                {/* Detailed Scores */}
                {(feedback.grammar_score || feedback.vocabulary_score || feedback.coherence_score) && (
                  <div className="grid grid-cols-3 gap-3">
                    {feedback.grammar_score && (
                      <div className="text-center p-3 bg-blue-50 rounded-lg">
                        <div className="text-lg font-semibold text-blue-600">
                          {feedback.grammar_score}/10
                        </div>
                        <div className="text-xs text-gray-600">Ngữ pháp</div>
                      </div>
                    )}
                    {feedback.vocabulary_score && (
                      <div className="text-center p-3 bg-green-50 rounded-lg">
                        <div className="text-lg font-semibold text-green-600">
                          {feedback.vocabulary_score}/10
                        </div>
                        <div className="text-xs text-gray-600">Từ vựng</div>
                      </div>
                    )}
                    {feedback.coherence_score && (
                      <div className="text-center p-3 bg-purple-50 rounded-lg">
                        <div className="text-lg font-semibold text-purple-600">
                          {feedback.coherence_score}/10
                        </div>
                        <div className="text-xs text-gray-600">Mạch lạc</div>
                      </div>
                    )}
                  </div>
                )}

                {/* Strengths */}
                <div className="bg-green-50 p-4 rounded-lg">
                  <h3 className="font-semibold text-green-800 mb-2">✅ Điểm mạnh</h3>
                  <p className="text-green-700 text-sm leading-relaxed">
                    {feedback.strengths}
                  </p>
                </div>

                {/* Weaknesses */}
                <div className="bg-orange-50 p-4 rounded-lg">
                  <h3 className="font-semibold text-orange-800 mb-2">⚠️ Điểm cần cải thiện</h3>
                  <p className="text-orange-700 text-sm leading-relaxed">
                    {feedback.weaknesses}
                  </p>
                </div>

                {/* Suggestions */}
                <div className="bg-blue-50 p-4 rounded-lg">
                  <h3 className="font-semibold text-blue-800 mb-3">💡 Gợi ý cải thiện</h3>
                  {Array.isArray(feedback.suggestions) ? (
                    <ul className="space-y-2">
                      {feedback.suggestions.map((suggestion, index) => (
                        <li key={index} className="text-blue-700 text-sm flex items-start">
                          <span className="text-blue-500 mr-2 mt-0.5">•</span>
                          {suggestion}
                        </li>
                      ))}
                    </ul>
                  ) : (
                    <div className="text-blue-700 text-sm leading-relaxed whitespace-pre-line">
                      {feedback.suggestions}
                    </div>
                  )}
                </div>

                {/* Content Analysis */}
                {feedback.content_analysis && (
                  <div className="bg-purple-50 p-4 rounded-lg">
                    <h3 className="font-semibold text-purple-800 mb-2">📝 Phân tích nội dung</h3>
                    <p className="text-purple-700 text-sm leading-relaxed">
                      {feedback.content_analysis}
                    </p>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
} 