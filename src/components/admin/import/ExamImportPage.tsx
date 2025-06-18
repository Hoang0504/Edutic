'use client';

import React, { useState, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { CloudArrowUpIcon, ArrowLeftIcon, CheckIcon, ExclamationTriangleIcon } from '@heroicons/react/24/outline';
import AdminLayout from '@/components/layout/AdminLayout';
import DownloadTemplate from './DownloadTemplate';
import PartEditor from './PartEditor';
import { useExcelProcessor } from '@/hooks/useExcelProcessor';
import { ExamImportData, PartTabType, EXAM_TYPE_CONFIGS } from '@/types/exam';

const ExamImportPage: React.FC = () => {
  const router = useRouter();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { processExcelFile, isProcessing } = useExcelProcessor();

  // State management
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [examData, setExamData] = useState<ExamImportData | null>(null);
  const [activePartTab, setActivePartTab] = useState<number>(1);
  const [submittingParts, setSubmittingParts] = useState<Set<number>>(new Set());
  const [submittedParts, setSubmittedParts] = useState<Set<number>>(new Set());
  const [currentExamId, setCurrentExamId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  // Handle Excel file selection
  const handleFileSelect = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    // Validate file type
    if (!file.name.endsWith('.xlsx') && !file.name.endsWith('.xls')) {
      setError('Vui lòng chọn file Excel (.xlsx hoặc .xls)');
      return;
    }

    setSelectedFile(file);
    setError(null);
    setExamData(null);
    setSubmittedParts(new Set());
    setCurrentExamId(null);

    // Process the Excel file
    const result = await processExcelFile(file);
    if (result.success && result.data) {
      setExamData(result.data);
      
      // Set active tab to first available part
      const availableParts = getAvailableParts(result.data);
      if (availableParts.length > 0) {
        setActivePartTab(availableParts[0]);
      }
      
      // Generate examId for this session
      setCurrentExamId(`exam_${Date.now()}`);
    } else {
      setError(result.error || 'Lỗi xử lý file Excel');
    }
  };

  // Get available parts based on exam data
  const getAvailableParts = (data: ExamImportData) => {
    return data.parts.map(p => p.part_number).sort((a, b) => a - b);
  };

  // Get questions for a specific part
  const getQuestionsForPart = (partNumber: number) => {
    if (!examData) return [];
    return examData.questions.filter(q => q.part_number === partNumber);
  };

  // Get answers for a specific part
  const getAnswersForPart = (partNumber: number) => {
    if (!examData) return [];
    const questionsInPart = getQuestionsForPart(partNumber);
    const questionNumbers = questionsInPart.map(q => q.question_number);
    return examData.answers.filter(a => questionNumbers.includes(a.question_number));
  };

  // Handle part submission
  const handlePartSubmission = async (partData: any, audioFile?: File, questionImages?: File[]) => {
    if (!currentExamId) {
      setError('Thiếu exam ID');
      return;
    }

    const partNumber = partData.part_number;
    setSubmittingParts(prev => new Set(prev).add(partNumber));
    setError(null);

    try {
      // Prepare form data
      const formData = new FormData();
      formData.append('partData', JSON.stringify(partData));

      // Add audio file if exists
      if (audioFile) {
        formData.append('audioFile', audioFile);
      }

      // Add question images if exist
      if (questionImages && questionImages.length > 0) {
        questionImages.forEach((imageFile, index) => {
          formData.append('questionImages', imageFile);
        });
      }

      // Submit to API
      const response = await fetch(`/api/admin/exams/${currentExamId}/parts`, {
        method: 'POST',
        body: formData,
      });

      const result = await response.json();

      if (result.success) {
        setSubmittedParts(prev => new Set(prev).add(partNumber));
        alert(`Đã gửi Part ${partNumber} thành công!`);
        
        // Move to next part if available
        const availableParts = getAvailableParts(examData!);
        const currentIndex = availableParts.indexOf(partNumber);
        if (currentIndex < availableParts.length - 1) {
          setActivePartTab(availableParts[currentIndex + 1]);
        }
      } else {
        setError(result.data?.message || `Lỗi khi gửi Part ${partNumber}`);
      }

    } catch (error) {
      console.error('Part submission error:', error);
      setError('Lỗi kết nối với server');
    } finally {
      setSubmittingParts(prev => {
        const newSet = new Set(prev);
        newSet.delete(partNumber);
        return newSet;
      });
    }
  };

  // Get exam type info
  const getExamTypeInfo = () => {
    if (!examData?.exam.exam_type) return null;
    return EXAM_TYPE_CONFIGS[examData.exam.exam_type];
  };

  // Check if exam type needs part division
  const needsPartDivision = () => {
    const typeInfo = getExamTypeInfo();
    return typeInfo?.needsPartDivision || false;
  };

  // Render content based on current state
  const renderContent = () => {
    if (!selectedFile) {
      return (
        <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center">
          <CloudArrowUpIcon className="mx-auto h-12 w-12 text-gray-400" />
          <div className="mt-4">
            <label htmlFor="excel-upload" className="cursor-pointer">
              <span className="mt-2 block text-sm font-medium text-gray-900">
                Chọn file Excel để nhập đề thi
              </span>
              <span className="mt-1 block text-sm text-gray-500">
                Hỗ trợ định dạng .xlsx, .xls (Speaking Practice, Writing Practice, Full TOEIC)
              </span>
            </label>
            <input
              ref={fileInputRef}
              id="excel-upload"
              type="file"
              accept=".xlsx,.xls"
              onChange={handleFileSelect}
              className="hidden"
            />
          </div>
        </div>
      );
    }

    if (isProcessing) {
      return (
        <div className="text-center py-8">
          <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
          <p className="mt-2 text-gray-600">Đang xử lý file Excel...</p>
        </div>
      );
    }

    if (!examData) {
      return (
        <div className="text-center py-8 text-red-600">
          <ExclamationTriangleIcon className="mx-auto h-12 w-12" />
          <p className="mt-2">Không thể xử lý file Excel</p>
        </div>
      );
    }

    // Show different UI based on exam type
    return needsPartDivision() ? <PartTabsContent /> : <SimpleTopicsContent />;
  };

  // Simple content for practice types (no part division)
  const SimpleTopicsContent = () => {
    if (!examData) return null;

    const examTypeInfo = getExamTypeInfo();
    const questions = examData.questions;
    const answers = examData.answers;

    return (
      <div className="space-y-6">
        {/* Exam Info Summary */}
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <h3 className="font-medium text-blue-900">{examData.exam.title}</h3>
          <p className="text-blue-700 text-sm mt-1">{examData.exam.description}</p>
          <div className="mt-2 flex items-center space-x-4 text-sm text-blue-600">
            <span>Độ khó: {examData.exam.difficulty}</span>
            <span>Thời gian: {examData.exam.estimated_time} phút</span>
            {examTypeInfo && <span className="font-medium">{examTypeInfo.description}</span>}
          </div>
        </div>

        {/* Topics List */}
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-medium text-gray-900">
              {examData.exam.exam_type === 'speaking_practice' ? '🗣️ Speaking Topics' : '✍️ Writing Topics'}
            </h3>
            <span className="text-sm text-gray-500">{questions.length} topics</span>
          </div>

          <div className="space-y-4">
            {questions.map((question, index) => (
              <div key={question.question_number} className="border border-gray-200 rounded-lg p-4">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <h4 className="font-medium text-gray-900">
                      Topic {question.question_number}
                    </h4>
                    <p className="text-gray-700 mt-1">{question.content}</p>
                    {question.vietnamese_translation && (
                      <p className="text-gray-600 text-sm mt-2 italic">
                        {question.vietnamese_translation}
                      </p>
                    )}
                  </div>
                  <span className="ml-4 px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded">
                    {examData.exam.exam_type === 'speaking_practice' ? 'Speaking' : 'Writing'}
                  </span>
                </div>
              </div>
            ))}
          </div>

          {/* Submit Button for Practice Types */}
          <div className="mt-6 flex justify-center">
            <button
              onClick={() => handlePracticeSubmission()}
              disabled={submittingParts.size > 0}
              className={`px-8 py-3 rounded-md font-medium ${
                submittingParts.size > 0
                  ? 'bg-gray-400 text-white cursor-not-allowed'
                  : 'bg-blue-600 text-white hover:bg-blue-700'
              }`}
            >
              {submittingParts.size > 0 ? 'Đang gửi...' : `Gửi ${questions.length} Topics`}
            </button>
          </div>
        </div>
      </div>
    );
  };

  // Handle practice submission (for speaking/writing practice)
  const handlePracticeSubmission = async () => {
    if (!examData || !currentExamId) return;

    setSubmittingParts(prev => new Set(prev).add(1));
    setError(null);

    try {
      // Prepare practice data
      const practiceData = {
        title: examData.exam.title,
        part_number: 1,
        difficulty_level: examData.exam.difficulty,
        instruction: examData.exam.description,
        time_limit: examData.exam.estimated_time,
        questions: examData.questions.map(question => ({
          question: question.content,
          vietnamese_translation: question.vietnamese_translation,
          answers: [] // No answers for practice types
        })),
        translations: examData.questions.map(question => ({
          question_id: question.question_number,
          vietnamese_text: question.vietnamese_translation || ''
        })).filter(t => t.vietnamese_text.trim())
      };

      // Submit to API
      const formData = new FormData();
      formData.append('partData', JSON.stringify(practiceData));

      const response = await fetch(`/api/admin/exams/${currentExamId}/parts`, {
        method: 'POST',
        body: formData,
      });

      const result = await response.json();

      if (result.success) {
        setSubmittedParts(prev => new Set(prev).add(1));
        alert(`Đã gửi ${examData.questions.length} topics thành công!`);
      } else {
        setError(result.data?.message || 'Lỗi khi gửi topics');
      }

    } catch (error) {
      console.error('Practice submission error:', error);
      setError('Lỗi kết nối với server');
    } finally {
      setSubmittingParts(prev => {
        const newSet = new Set(prev);
        newSet.delete(1);
        return newSet;
      });
    }
  };

  // Part tabs content
  const PartTabsContent = () => {
    if (!examData) return null;

    const availableParts = getAvailableParts(examData);
    const examTypeInfo = getExamTypeInfo();
    const currentPart = examData.parts.find(p => p.part_number === activePartTab);
    
    if (!currentPart) return null;

    const questionsForPart = getQuestionsForPart(activePartTab);
    const answersForPart = getAnswersForPart(activePartTab);

    return (
      <div className="space-y-6">
        {/* Exam Info Summary */}
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <h3 className="font-medium text-blue-900">{examData.exam.title}</h3>
          <p className="text-blue-700 text-sm mt-1">{examData.exam.description}</p>
          <div className="mt-2 flex items-center space-x-4 text-sm text-blue-600">
            <span>Độ khó: {examData.exam.difficulty}</span>
            <span>Thời gian: {examData.exam.estimated_time} phút</span>
            {examTypeInfo && <span className="font-medium">{examTypeInfo.description}</span>}
          </div>
        </div>

        {/* Part Navigation Tabs */}
        <div className="border-b border-gray-200">
          <nav className="-mb-px flex space-x-8">
            {availableParts.map(partNumber => {
              const isActive = partNumber === activePartTab;
              const isSubmitted = submittedParts.has(partNumber);
              const isSubmitting = submittingParts.has(partNumber);
              
              return (
                <button
                  key={partNumber}
                  onClick={() => setActivePartTab(partNumber)}
                  className={`py-2 px-1 border-b-2 font-medium text-sm flex items-center space-x-2 ${
                    isActive
                      ? 'border-blue-500 text-blue-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
                >
                  <span>Part {partNumber}</span>
                  {isSubmitted && <CheckIcon className="h-4 w-4 text-green-600" />}
                  {isSubmitting && (
                    <div className="h-4 w-4 animate-spin rounded-full border-2 border-blue-600 border-t-transparent"></div>
                  )}
                </button>
              );
            })}
          </nav>
        </div>

        {/* Part Editor */}
        <PartEditor
          part={currentPart}
          questions={questionsForPart}
          answers={answersForPart}
          onPartUpdate={(partData) => {
            // Handle part data updates if needed
          }}
          onSubmitPart={handlePartSubmission}
          isSubmitting={submittingParts.has(activePartTab)}
        />

        {/* Progress Summary */}
        <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
          <h4 className="font-medium text-gray-900 mb-2">Tiến độ gửi Parts</h4>
          <div className="grid grid-cols-7 gap-2">
            {availableParts.map(partNumber => {
              const isSubmitted = submittedParts.has(partNumber);
              const isSubmitting = submittingParts.has(partNumber);
              
              return (
                <div
                  key={partNumber}
                  className={`p-2 rounded text-center text-sm font-medium ${
                    isSubmitted
                      ? 'bg-green-100 text-green-800'
                      : isSubmitting
                      ? 'bg-yellow-100 text-yellow-800'
                      : 'bg-gray-100 text-gray-600'
                  }`}
                >
                  Part {partNumber}
                  {isSubmitted && ' ✓'}
                  {isSubmitting && ' ...'}
                </div>
              );
            })}
          </div>
          
          <div className="mt-3 text-sm text-gray-600">
            Đã gửi: {submittedParts.size}/{availableParts.length} parts
          </div>
        </div>
      </div>
    );
  };

  return (
    <AdminLayout>
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-6 flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Nhập đề thi từ Excel</h1>
            <p className="text-gray-600">Upload Excel, chỉnh sửa và gửi từng Part riêng lẻ</p>
          </div>
          <button
            onClick={() => router.push('/admin/exams')}
            className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
          >
            <ArrowLeftIcon className="h-4 w-4 mr-2" />
            Quay lại
          </button>
        </div>

        {/* File Upload Section */}
        <div className="bg-white rounded-lg shadow p-6 mb-6">
          <h2 className="text-lg font-medium text-gray-900 mb-4">1. Tải file Excel</h2>
          
          {/* Download Template */}
          <DownloadTemplate />
          
          {renderContent()}
        </div>

        {/* Error Display */}
        {error && (
          <div className="bg-red-50 border border-red-200 rounded-md p-4 mb-6">
            <div className="flex">
              <ExclamationTriangleIcon className="h-5 w-5 text-red-400 mr-2" />
              <span className="text-red-800">{error}</span>
            </div>
          </div>
        )}

        {/* Instructions */}
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
          <h3 className="font-medium text-yellow-800 mb-2">📚 Hướng dẫn sử dụng</h3>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
            {/* Speaking Practice */}
            <div className="bg-blue-50 border border-blue-200 rounded p-3">
              <h4 className="font-medium text-blue-800 mb-2">🗣️ Speaking Practice</h4>
              <ul className="text-blue-700 text-sm space-y-1">
                <li>• Chỉ cần topics/câu hỏi thực hành</li>
                <li>• Không cần đáp án hoặc chia parts</li>
                <li>• Thời gian linh hoạt (10-30 phút)</li>
                <li>• Bản dịch tiếng Việt tùy chọn</li>
              </ul>
            </div>

            {/* Writing Practice */}
            <div className="bg-green-50 border border-green-200 rounded p-3">
              <h4 className="font-medium text-green-800 mb-2">✍️ Writing Practice</h4>
              <ul className="text-green-700 text-sm space-y-1">
                <li>• Chỉ cần topics/đề bài thực hành</li>
                <li>• Không cần đáp án hoặc chia parts</li>
                <li>• Thời gian linh hoạt (30-90 phút)</li>
                <li>• Bản dịch tiếng Việt tùy chọn</li>
              </ul>
            </div>

            {/* Full TOEIC */}
            <div className="bg-purple-50 border border-purple-200 rounded p-3">
              <h4 className="font-medium text-purple-800 mb-2">📝 Full TOEIC Test</h4>
              <ul className="text-purple-700 text-sm space-y-1">
                <li>• Đề thi TOEIC chuẩn ETS (200 câu)</li>
                <li>• Chia đúng 7 parts: 1-6, 7-31, 32-70...</li>
                <li>• Parts 1-4 cần file audio</li>
                <li>• Mỗi câu có 4 đáp án A,B,C,D</li>
              </ul>
            </div>
          </div>

          <div className="text-yellow-700 text-sm">
            <p className="mb-2"><strong>Quy trình chung:</strong></p>
            <ol className="list-decimal list-inside space-y-1 ml-4">
              <li>Tải template Excel phù hợp với loại đề thi</li>
              <li>Điền thông tin vào file Excel</li>
              <li>Upload file và xem trước dữ liệu</li>
              <li>Chỉnh sửa và gửi dữ liệu lên server</li>
            </ol>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
};

export default ExamImportPage; 