"use client";

import React, { useState, useRef } from "react";
import { useRouter } from "next/navigation";
import {
  CloudArrowUpIcon,
  ArrowLeftIcon,
  CheckIcon,
  ExclamationTriangleIcon,
  PhotoIcon,
} from "@heroicons/react/24/outline";
// import AdminLayout from "@/components/admin/layout/AdminLayout";
// import TabGroup from "./TabGroup";
// import TablePreview, {
//   examColumns,
//   createPartsColumns,
//   questionsColumns,
//   answersColumns,
// } from "./TablePreview";
import DownloadTemplate from "./DownloadTemplate";
import { useExcelProcessor } from "@/hooks/useExcelProcessor";
import { ExamImportData, EXAM_TYPE_CONFIGS } from "@/types/exam";
import { useSelectedMenu } from "@/contexts/SelectedAminMenuContext";

const ExamImportPage: React.FC = () => {
  const { handleMenuSelect } = useSelectedMenu();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const audioFileRef = useRef<HTMLInputElement>(null);
  const imageFileRef = useRef<HTMLInputElement>(null);
  const { processExcelFile, submitExamToDatabase, isProcessing, isSubmitting } =
    useExcelProcessor();

  // State management
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [examData, setExamData] = useState<ExamImportData | null>(null);
  const [activePartTab, setActivePartTab] = useState<number>(1);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState<number>(0);
  const [audioFiles, setAudioFiles] = useState<{ [partNumber: number]: File }>(
    {}
  );
  const [questionImages, setQuestionImages] = useState<{
    [questionNumber: number]: File;
  }>({});
  const [currentExamId, setCurrentExamId] = useState<number | null>(null);
  const [importSuccess, setImportSuccess] = useState<{
    examId: number;
    summary: any;
  } | null>(null);
  const [error, setError] = useState<string | null>(null);

  // Handle Excel file selection
  const handleFileSelect = async (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = event.target.files?.[0];
    if (!file) return;

    // Validate file type
    if (!file.name.endsWith(".xlsx") && !file.name.endsWith(".xls")) {
      setError("Vui lòng chọn file Excel (.xlsx hoặc .xls)");
      return;
    }

    setSelectedFile(file);
    setError(null);
    setExamData(null);
    setCurrentExamId(null);
    setImportSuccess(null);
    setCurrentQuestionIndex(0);

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
      setError(result.error || "Lỗi xử lý file Excel");
    }
  };

  // Get available parts based on exam data
  const getAvailableParts = (data: ExamImportData) => {
    return data.parts.map((p) => p.part_number).sort((a, b) => a - b);
  };

  // Get questions for a specific part
  const getQuestionsForPart = (partNumber: number) => {
    if (!examData) return [];
    return examData.questions.filter((q) => q.part_number === partNumber);
  };

  // Get answers for a specific question
  const getAnswersForQuestion = (questionNumber: number) => {
    if (!examData) return [];
    return examData.answers.filter((a) => a.question_number === questionNumber);
  };

  // Handle audio file upload
  const handleAudioUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    // Validate audio file
    if (!file.type.startsWith("audio/")) {
      setError("Vui lòng chọn file audio hợp lệ");
      return;
    }

    setAudioFiles((prev) => ({
      ...prev,
      [activePartTab]: file,
    }));
  };

  // Handle image upload for question
  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    // Validate image file
    if (!file.type.startsWith("image/")) {
      setError("Vui lòng chọn file ảnh hợp lệ");
      return;
    }

    const currentQuestions = getQuestionsForPart(activePartTab);
    if (currentQuestions[currentQuestionIndex]) {
      const questionNumber =
        currentQuestions[currentQuestionIndex].question_number;
      setQuestionImages((prev) => ({
        ...prev,
        [questionNumber]: file,
      }));
    }
  };

  // Get part info
  const getCurrentPart = () => {
    if (!examData) return null;
    return examData.parts.find((p) => p.part_number === activePartTab);
  };

  // Handle part tab change
  const handlePartTabChange = (partNumber: number) => {
    setActivePartTab(partNumber);
    setCurrentQuestionIndex(0);
  };

  // Handle question navigation
  const handleQuestionNavigation = (direction: "prev" | "next") => {
    const questions = getQuestionsForPart(activePartTab);
    if (direction === "prev" && currentQuestionIndex > 0) {
      setCurrentQuestionIndex(currentQuestionIndex - 1);
    } else if (
      direction === "next" &&
      currentQuestionIndex < questions.length - 1
    ) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
    }
  };

  // Check if part is listening part
  const isListeningPart = (partNumber: number) => {
    return [1, 2, 3, 4].includes(partNumber);
  };

  // Handle exam submission
  const handleExamSubmission = async () => {
    if (!examData) return;

    setError(null);

    // Only validate audio for full_toeic exam type with listening parts
    const isFullToeic = examData.exam.exam_type === "full_toeic";

    if (isFullToeic) {
      // Validate that all listening parts have audio files for TOEIC exams
      const listeningParts = [1, 2, 3, 4];
      const availableParts = getAvailableParts(examData);
      const requiredListeningParts = listeningParts.filter((part) =>
        availableParts.includes(part)
      );

      // Check if all required listening parts have audio files
      const missingAudioParts = requiredListeningParts.filter(
        (part) => !audioFiles[part]
      );
      if (missingAudioParts.length > 0) {
        setError(
          `Thiếu file audio cho Part ${missingAudioParts.join(
            ", "
          )}. Vui lòng upload đầy đủ audio files cho các part listening.`
        );
        return;
      }
    }

    try {
      // Prepare audio files array in correct order (only for full_toeic)
      const audioFilesArray: File[] = [];

      if (isFullToeic) {
        const listeningParts = [1, 2, 3, 4];
        const availableParts = getAvailableParts(examData);
        const requiredListeningParts = listeningParts.filter((part) =>
          availableParts.includes(part)
        );

        requiredListeningParts.forEach((partNumber) => {
          if (audioFiles[partNumber]) {
            audioFilesArray.push(audioFiles[partNumber]);
          }
        });
      }

      console.log("Submitting exam with details:", {
        examType: examData.exam.exam_type,
        examTitle: examData.exam.title,
        totalParts: examData.parts.length,
        totalQuestions: examData.questions.length,
        audioFilesCount: audioFilesArray.length,
        audioFileNames: audioFilesArray.map((f) => f.name),
        isFullToeic,
      });

      const result = await submitExamToDatabase(examData, audioFilesArray);

      if (result.success && result.data) {
        setImportSuccess({
          examId: result.data.examId,
          summary: result.data.summary,
        });
      } else {
        setError(result.error || "Lỗi khi lưu vào database");
      }
    } catch (error) {
      console.error("Exam submission error:", error);
      setError("Lỗi kết nối với server");
    }
  };

  // Render content based on current state
  const renderContent = () => {
    if (importSuccess) {
      return (
        <div className="text-center py-8">
          <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-green-100">
            <CheckIcon className="h-6 w-6 text-green-600" />
          </div>
          <h3 className="mt-2 text-sm font-medium text-gray-900">
            Import thành công!
          </h3>
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
                fileInputRef.current.value = "";
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
                Hỗ trợ định dạng .xlsx, .xls (Speaking Practice, Writing
                Practice, Full TOEIC)
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

    return <ExamPreviewContent />;
  };

  // Main exam preview content
  const ExamPreviewContent = () => {
    if (!examData) return null;

    const availableParts = getAvailableParts(examData);
    const currentPart = getCurrentPart();
    const questions = getQuestionsForPart(activePartTab);
    const currentQuestion = questions[currentQuestionIndex];
    const answers = currentQuestion
      ? getAnswersForQuestion(currentQuestion.question_number)
      : [];

    return (
      <div className="space-y-6">
        {/* Exam Info Header */}
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <h3 className="font-medium text-blue-900">{examData.exam.title}</h3>
          <p className="text-blue-700 text-sm mt-1">
            {examData.exam.description}
          </p>
          <div className="mt-2 flex items-center space-x-4 text-sm text-blue-600">
            <span>Độ khó: {examData.exam.difficulty}</span>
            <span>Thời gian: {examData.exam.estimated_time} phút</span>
            <span>Full đề - 200 câu hỏi, 120 phút</span>
          </div>
        </div>

        {/* Part Tabs */}
        <div className="border-b border-gray-200">
          <nav className="-mb-px flex space-x-8">
            {availableParts.map((partNumber) => {
              const part = examData.parts.find(
                (p) => p.part_number === partNumber
              );
              return (
                <button
                  key={partNumber}
                  onClick={() => handlePartTabChange(partNumber)}
                  className={`py-2 px-1 border-b-2 font-medium text-sm ${
                    activePartTab === partNumber
                      ? "border-blue-500 text-blue-600"
                      : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                  }`}
                >
                  Part {partNumber}
                </button>
              );
            })}
          </nav>
        </div>

        {/* Part Content */}
        <div className="bg-white rounded-lg shadow p-6">
          {/* Part Header */}
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-lg font-medium text-gray-900">
                Part {activePartTab}: {currentPart?.title}
              </h2>
              <p className="text-sm text-gray-600 mt-1">
                {currentPart?.instruction}
              </p>
            </div>
            {isListeningPart(activePartTab) && (
              <span className="bg-blue-100 text-blue-800 text-xs font-medium px-2.5 py-0.5 rounded">
                Listening
              </span>
            )}
          </div>

          {/* Audio Upload for Listening Parts - Only show for full_toeic */}
          {isListeningPart(activePartTab) &&
            examData?.exam.exam_type === "full_toeic" && (
              <div className="mb-6 p-4 bg-gray-50 rounded-lg">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  📎 Upload Audio cho Part {activePartTab} *
                </label>
                <div className="flex items-center space-x-4">
                  <button
                    onClick={() => audioFileRef.current?.click()}
                    className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
                  >
                    📁 Chọn file audio
                  </button>
                  {audioFiles[activePartTab] && (
                    <span className="text-sm text-green-600">
                      ✓ {audioFiles[activePartTab].name}
                    </span>
                  )}
                </div>
                <input
                  ref={audioFileRef}
                  type="file"
                  accept="audio/*"
                  onChange={handleAudioUpload}
                  className="hidden"
                />
                <p className="mt-1 text-xs text-gray-500">
                  Audio file cho part listening
                </p>
              </div>
            )}

          {/* Question Content */}
          {currentQuestion && (
            <div className="space-y-4">
              {/* Question Header */}
              <div className="flex items-center justify-between">
                <h3 className="text-base font-medium text-gray-900">
                  Câu hỏi {currentQuestion.question_number}
                </h3>
                <button
                  onClick={() => imageFileRef.current?.click()}
                  className="inline-flex items-center px-3 py-1 border border-gray-300 rounded text-sm text-gray-700 hover:bg-gray-50"
                >
                  📷 Ảnh
                </button>
                <input
                  ref={imageFileRef}
                  type="file"
                  accept="image/*"
                  onChange={handleImageUpload}
                  className="hidden"
                />
              </div>

              {/* Question Content */}
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Nội dung câu hỏi
                  </label>
                  <textarea
                    value={currentQuestion.content}
                    readOnly
                    className="w-full p-3 border border-gray-300 rounded-md bg-gray-50"
                    rows={3}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Bản dịch tiếng Việt (câu hỏi)
                  </label>
                  <textarea
                    value={currentQuestion.vietnamese_translation || ""}
                    readOnly
                    className="w-full p-3 border border-gray-300 rounded-md bg-gray-50"
                    rows={2}
                  />
                </div>

                {/* Answers */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-3">
                    Đáp án
                  </label>
                  <div className="space-y-3">
                    {answers.map((answer) => (
                      <div
                        key={answer.answer_letter}
                        className={`p-3 border rounded-lg ${
                          answer.is_correct
                            ? "border-green-300 bg-green-50"
                            : "border-gray-300 bg-white"
                        }`}
                      >
                        <div className="flex items-start space-x-3">
                          <input
                            type="radio"
                            name={`question-${currentQuestion.question_number}`}
                            checked={answer.is_correct}
                            readOnly
                            className="mt-1"
                          />
                          <div className="flex-1">
                            <div className="font-medium text-gray-900">
                              {answer.answer_letter}. {answer.answer_text}
                            </div>
                            <div className="text-sm text-gray-600 mt-1">
                              {answer.answer_letter}.{" "}
                              {answer.vietnamese_translation}
                            </div>
                            {answer.is_correct && (
                              <div className="text-sm text-green-700 mt-1 font-medium">
                                Explanation for option {answer.answer_letter}
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Question Navigation */}
              <div className="flex justify-between items-center pt-4 border-t">
                <button
                  onClick={() => handleQuestionNavigation("prev")}
                  disabled={currentQuestionIndex === 0}
                  className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  ← Câu trước
                </button>

                <span className="text-sm text-gray-500">
                  {currentQuestionIndex + 1} / {questions.length}
                </span>

                <button
                  onClick={() => handleQuestionNavigation("next")}
                  disabled={currentQuestionIndex === questions.length - 1}
                  className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Câu tiếp →
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Submit Button */}
        <div className="flex justify-center">
          <button
            onClick={handleExamSubmission}
            disabled={isSubmitting}
            className={`px-8 py-3 rounded-md font-medium ${
              isSubmitting
                ? "bg-gray-400 text-white cursor-not-allowed"
                : "bg-blue-600 text-white hover:bg-blue-700"
            }`}
          >
            {isSubmitting
              ? "Đang lưu vào database..."
              : "Lưu đề thi vào Database"}
          </button>
        </div>
      </div>
    );
  };

  return (
    // <AdminLayout>
    <div className="max-w-7xl mx-auto">
      {/* Header */}
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">
            Nhập đề thi từ Excel
          </h1>
          <p className="text-gray-600">
            Upload Excel và preview trước khi lưu vào database
          </p>
        </div>
        <button
          onClick={() => handleMenuSelect("import-exam")}
          className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
        >
          <ArrowLeftIcon className="h-4 w-4 mr-2" />
          Quay lại
        </button>
      </div>

      {/* Main Content */}
      <div className="bg-white rounded-lg shadow p-6 mb-6">
        <h2 className="text-lg font-medium text-gray-900 mb-4">
          Upload & Preview Excel
        </h2>

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
    </div>
    // {/* </AdminLayout> */}
  );
};

export default ExamImportPage;
