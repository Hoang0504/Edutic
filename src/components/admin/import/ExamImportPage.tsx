'use client';

import React, { useState, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { CloudArrowUpIcon, ArrowLeftIcon, CheckIcon, ExclamationTriangleIcon } from '@heroicons/react/24/outline';
import AdminLayout from '@/components/layout/AdminLayout';
import DownloadTemplate from '@/components/admin/import/DownloadTemplate';
import PartEditor from '@/components/admin/import/PartEditor';
import { useExcelProcessor } from '@/hooks/useExcelProcessor';
import { ExamImportData, PartTabType, EXAM_TYPE_CONFIGS } from '@/types/exam';

const ExamImportPage: React.FC = () => {
  const router = useRouter();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { processExcelFile, submitExamToDatabase, isProcessing, isSubmitting } = useExcelProcessor();

  // State management
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [examData, setExamData] = useState<ExamImportData | null>(null);
  const [activePartTab, setActivePartTab] = useState<number>(1);
  const [submittingParts, setSubmittingParts] = useState<Set<number>>(new Set());
  const [submittedParts, setSubmittedParts] = useState<Set<number>>(new Set());
  const [currentExamId, setCurrentExamId] = useState<number | null>(null);
  const [importSuccess, setImportSuccess] = useState<{examId: number, summary: any} | null>(null);
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
    setImportSuccess(null);

    // Process the Excel file
    const result = await processExcelFile(file);
    if (result.success && result.data) {
      setExamData(result.data);
      
      // Set active tab to first available part
      const availableParts = getAvailableParts(result.data);
      if (availableParts.length > 0) {
        setActivePartTab(availableParts[0]);
      }
      
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

  // Handle part submission (for TOEIC multi-part exams)
  const handlePartSubmission = async (partData: any, audioFile?: File, questionImages?: File[]) => {
    if (!currentExamId) {
      setError('Cần tạo exam trước khi gửi part');
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

  // Handle practice submission (for speaking/writing practice)
  const handlePracticeSubmission = async () => {
    if (!examData) return;

    setError(null);

    try {
      const result = await submitExamToDatabase(examData);
      
      if (result.success && result.data) {
        setImportSuccess({
          examId: result.data.examId,
          summary: result.data.summary
        });
      } else {
        setError(result.error || 'Lỗi khi lưu vào database');
      }
    } catch (error) {
      console.error('Practice submission error:', error);
      setError('Lỗi kết nối với server');
    }
  };

  // Render content based on current state
  const renderContent = () => {
    if (importSuccess) {
      return (
        <div className="text-center py-8">
          <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-green-100">
            <svg className="h-6 w-6 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <h3 className="mt-2 text-sm font-medium text-gray-900">Import thành công!</h3>
          <p className="mt-1 text-sm text-gray-500">
            Exam ID: {importSuccess.examId}
          </p>
          <div className="mt-4 bg-gray-50 rounded-lg p-4 text-sm text-left">
            <h4 className="font-medium text-gray-900 mb-2">Thống kê:</h4>
            <ul className="space-y-1 text-gray-600">
              <li>• {importSuccess.summary.partsCount} parts</li>
              <li>• {importSuccess.summary.questionsCount} questions</li>
              <li>• {importSuccess.summary.answersCount} answers</li>
            </ul>
          </div>
          <button
            onClick={() => {
              setSelectedFile(null);
              setExamData(null);
              setImportSuccess(null);
              setCurrentExamId(null);
              if (fileInputRef.current) {
                fileInputRef.current.value = '';
              }
            }}
            className="mt-4 px-4 py-2 bg-blue-600 text-white text-sm rounded-md hover:bg-blue-700"
          >
            Import exam khác
          </button>
        </div>
      );
    }

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

    // Show content for all exam types
    return <ExamContent />;
  };

  // Main content for all exam types
  const ExamContent = () => {
    if (!examData) return null;

    const examTypeInfo = getExamTypeInfo();
    const questions = examData.questions;

    return (
      <div className="space-y-6">
        {/* Exam Info Summary */}
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <h3 className="font-medium text-blue-900">{examData.exam.title}</h3>
          <p className="text-blue-700 text-sm mt-1">{examData.exam.description}</p>
          <div className="mt-2 flex items-center space-x-4 text-sm text-blue-600">
            <span>Loại: {examTypeInfo?.description || examData.exam.exam_type}</span>
            <span>Độ khó: {examData.exam.difficulty}</span>
            <span>Thời gian: {examData.exam.estimated_time} phút</span>
          </div>
        </div>

        {/* Content based on exam type */}
        {examData.exam.exam_type === 'full_toeic' ? (
          <FullToeicContent />
        ) : (
          <PracticeContent />
        )}
      </div>
    );
  };

  // Practice content (speaking/writing)
  const PracticeContent = () => {
    if (!examData) return null;
    
    const questions = examData.questions;

    return (
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

        {/* Submit Button */}
        <div className="mt-6 flex justify-center">
          <button
            onClick={handlePracticeSubmission}
            disabled={isSubmitting}
            className={`px-8 py-3 rounded-md font-medium ${
              isSubmitting
                ? 'bg-gray-400 text-white cursor-not-allowed'
                : 'bg-blue-600 text-white hover:bg-blue-700'
            }`}
          >
            {isSubmitting ? 'Đang lưu vào database...' : `Lưu ${questions.length} Topics vào Database`}
          </button>
        </div>
      </div>
    );
  };

  // TOEIC content
  const FullToeicContent = () => {
    if (!examData) return null;

    const questions = examData.questions;
    const answers = examData.answers;

    return (
      <div className="bg-white rounded-lg shadow p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-medium text-gray-900">📝 TOEIC Test Content</h3>
          <span className="text-sm text-gray-500">
            {questions.length} questions, {answers.length} answers
          </span>
        </div>

        {/* Stats by part */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
          {examData.parts.map(part => {
            const partQuestions = questions.filter(q => q.part_number === part.part_number);
            const partAnswers = answers.filter(a => 
              partQuestions.some(q => q.question_number === a.question_number)
            );
            
            return (
              <div key={part.part_number} className="bg-gray-50 p-3 rounded-lg">
                <h4 className="font-medium text-gray-900">Part {part.part_number}</h4>
                <p className="text-sm text-gray-600">{part.title}</p>
                <div className="mt-1 text-xs text-gray-500">
                  {partQuestions.length} questions, {partAnswers.length} answers
                </div>
              </div>
            );
          })}
        </div>

        {/* Submit Button */}
        <div className="flex justify-center">
          <button
            onClick={handlePracticeSubmission}
            disabled={isSubmitting}
            className={`px-8 py-3 rounded-md font-medium ${
              isSubmitting
                ? 'bg-gray-400 text-white cursor-not-allowed'
                : 'bg-blue-600 text-white hover:bg-blue-700'
            }`}
          >
            {isSubmitting ? 'Đang lưu vào database...' : 'Lưu TOEIC Test vào Database'}
          </button>
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
            <p className="text-gray-600">Upload Excel và import trực tiếp vào database</p>
          </div>
          <button
            onClick={() => router.push('/admin/exams')}
            className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
          >
            <ArrowLeftIcon className="h-4 w-4 mr-2" />
            Quay lại
          </button>
        </div>

        {/* Main Content */}
        <div className="bg-white rounded-lg shadow p-6 mb-6">
          <h2 className="text-lg font-medium text-gray-900 mb-4">Upload & Import Excel</h2>
          
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
                <li>• Không cần đáp án</li>
                <li>• Thời gian linh hoạt (10-30 phút)</li>
                <li>• Bản dịch tiếng Việt tùy chọn</li>
              </ul>
            </div>

            {/* Writing Practice */}
            <div className="bg-green-50 border border-green-200 rounded p-3">
              <h4 className="font-medium text-green-800 mb-2">✍️ Writing Practice</h4>
              <ul className="text-green-700 text-sm space-y-1">
                <li>• Chỉ cần topics/đề bài thực hành</li>
                <li>• Không cần đáp án</li>
                <li>• Thời gian linh hoạt (30-90 phút)</li>
                <li>• Bản dịch tiếng Việt tùy chọn</li>
              </ul>
            </div>

            {/* TOEIC Full Test */}
            <div className="bg-purple-50 border border-purple-200 rounded p-3">
              <h4 className="font-medium text-purple-800 mb-2">📝 TOEIC Test</h4>
              <ul className="text-purple-700 text-sm space-y-1">
                <li>• Cần đầy đủ 4 sheets: Exams, Parts, Questions, Answers</li>
                <li>• Mỗi câu hỏi cần có đáp án</li>
                <li>• Thời gian chuẩn (120 phút)</li>
                <li>• Hỗ trợ bản dịch tiếng Việt</li>
              </ul>
            </div>
          </div>

          <div className="text-yellow-700 text-sm">
            <p><strong>Lưu ý:</strong> Chọn đúng file Excel template tương ứng với loại đề thi bạn muốn tạo. 
            Hệ thống sẽ tự động nhận diện loại đề thi dựa trên tên file và cấu trúc dữ liệu.</p>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
};

export default ExamImportPage; 