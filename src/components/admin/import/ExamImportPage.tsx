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
import { useSelectedMenu } from "@/contexts/SelectedAminMenuContext";
import { useExcelProcessor } from "@/hooks/useExcelProcessor";
import { ExamImportData, EXAM_TYPE_CONFIGS } from "@/types/exam";
import DownloadTemplate from "./DownloadTemplate";

const ExamImportPage: React.FC = () => {
  const { handleMenuSelect } = useSelectedMenu();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const audioFileRef = useRef<HTMLInputElement>(null);
  const groupImageRef = useRef<HTMLInputElement>(null);
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
  const [groupImages, setGroupImages] = useState<{ [groupId: number]: File[] }>({});
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

  // Get grouped questions structure for navigation
  const getQuestionGroups = (partNumber: number) => {
    const questions = getQuestionsForPart(partNumber);
    const groups: Array<{ 
      type: 'single' | 'group', 
      questions: typeof questions,
      groupId?: number,
      displayIndex: number 
    }> = [];
    
    const processedQuestions = new Set<number>();
    let displayIndex = 0;

    console.log('Debug - Processing questions for part', partNumber, ':', questions.map(q => ({
      number: q.question_number,
      group_id: q.group_id,
      content: q.content.substring(0, 50) + '...'
    })));

    questions.forEach((question) => {
      if (processedQuestions.has(question.question_number)) return;

      if (question.group_id !== null) {
        // This is a grouped question
        const groupQuestions = questions.filter(q => q.group_id === question.group_id);
        console.log('Debug - Found group', question.group_id, 'with questions:', groupQuestions.map(q => q.question_number));
        groups.push({
          type: 'group',
          questions: groupQuestions,
          groupId: question.group_id,
          displayIndex: displayIndex++
        });
        // Mark all questions in this group as processed
        groupQuestions.forEach(q => processedQuestions.add(q.question_number));
      } else {
        // This is a single question
        console.log('Debug - Single question:', question.question_number);
        groups.push({
          type: 'single',
          questions: [question],
          displayIndex: displayIndex++
        });
        processedQuestions.add(question.question_number);
      }
    });

    console.log('Debug - Final groups structure:', groups.map(g => ({
      type: g.type,
      groupId: g.groupId,
      questionNumbers: g.questions.map(q => q.question_number),
      displayIndex: g.displayIndex
    })));

    return groups;
  };

  // Get current question group structure
  const getCurrentQuestionGroupStructure = () => {
    const questionGroups = getQuestionGroups(activePartTab);
    return questionGroups[currentQuestionIndex] || null;
  };

  // Get current question group if exists
  const getCurrentQuestionGroup = () => {
    const currentStructure = getCurrentQuestionGroupStructure();
    if (!currentStructure || currentStructure.type !== 'group' || !examData?.question_groups) {
      return null;
    }
    return examData.question_groups.find(g => g.group_id === currentStructure.groupId);
  };

  // Get all questions in the same group
  const getQuestionsInGroup = (groupId: number | null) => {
    if (!groupId || !examData) return [];
    return examData.questions.filter(q => q.group_id === groupId);
  };

  // Get answers for a specific question
  const getAnswersForQuestion = (questionNumber: number) => {
    if (!examData) return [];
    return examData.answers.filter((a) => a.question_number === questionNumber);
  };

  // Handle group image upload
  const handleGroupImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (!files || files.length === 0) return;

    // Validate image files
    for (let i = 0; i < files.length; i++) {
      if (!files[i].type.startsWith("image/")) {
        setError("Vui lòng chọn file ảnh hợp lệ");
        return;
      }
    }

    const currentStructure = getCurrentQuestionGroupStructure();
    if (currentStructure && currentStructure.type === 'group' && currentStructure.groupId) {
      setGroupImages(prev => ({
        ...prev,
        [currentStructure.groupId!]: [...(prev[currentStructure.groupId!] || []), ...Array.from(files)]
      }));
    }
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
    const questionGroups = getQuestionGroups(activePartTab);
    
    if (direction === "prev" && currentQuestionIndex > 0) {
      setCurrentQuestionIndex(currentQuestionIndex - 1);
    } else if (direction === "next" && currentQuestionIndex < questionGroups.length - 1) {
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

      // Add group images to question images
      const allImages: { [key: string]: File } = { ...questionImages };
      Object.entries(groupImages).forEach(([groupId, files]) => {
        // Use a special key format for group images
        files.forEach((file) => {
          allImages[`group_${groupId}_${file.name}`] = file;
        });
      });

      console.log("Submitting exam with details:", {
        examType: examData.exam.exam_type,
        examTitle: examData.exam.title,
        totalParts: examData.parts.length,
        totalQuestions: examData.questions.length,
        audioFilesCount: audioFilesArray.length,
        audioFileNames: audioFilesArray.map((f) => f.name),
        questionImagesCount: Object.keys(questionImages).length,
        questionImagesDetails: Object.entries(questionImages).map(([questionNumber, file]) => ({
          questionNumber,
          fileName: file.name
        })),
        groupImagesCount: Object.values(groupImages).reduce((total, files) => total + files.length, 0),
        groupImagesDetails: Object.entries(groupImages).map(([groupId, files]) => ({
          groupId,
          imageCount: files.length,
          fileNames: files.map(f => f.name)
        })),
        isFullToeic,
      });

      const result = await submitExamToDatabase(examData, audioFilesArray, groupImages, questionImages);

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

  // Component for Single Question Image Upload
  const SingleQuestionImageUpload = ({ questionNumber }: { questionNumber: number }) => {
    const singleImageRef = useRef<HTMLInputElement>(null);
    
    const handleSingleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
      const file = event.target.files?.[0];
      if (!file) return;

      // Validate image file
      if (!file.type.startsWith("image/")) {
        setError("Vui lòng chọn file ảnh hợp lệ");
        return;
      }

      setQuestionImages((prev) => ({
        ...prev,
        [questionNumber]: file,
      }));
    };

    return (
      <>
        <button
          onClick={() => singleImageRef.current?.click()}
          className="inline-flex items-center px-3 py-1 border border-gray-300 rounded text-sm text-gray-700 hover:bg-gray-50"
        >
          📷 Ảnh
        </button>
        <input
          ref={singleImageRef}
          type="file"
          accept="image/*"
          onChange={handleSingleImageUpload}
          className="hidden"
        />
      </>
    );
  };

  // Component for Single Question Image Preview
  const SingleQuestionImagePreview = ({ questionNumber }: { questionNumber: number }) => {
    const imageFile = questionImages[questionNumber];
    
    if (!imageFile) return null;

    return (
      <div className="mb-3">
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Ảnh câu hỏi
        </label>
        <div className="relative inline-block">
          <img
            src={URL.createObjectURL(imageFile)}
            alt="Question image preview"
            className="max-w-md max-h-48 object-contain border border-gray-300 rounded"
          />
          <button
            onClick={() => {
              setQuestionImages(prev => {
                const newState = { ...prev };
                delete newState[questionNumber];
                return newState;
              });
            }}
            className="absolute top-2 right-2 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-sm hover:bg-red-600"
          >
            ×
          </button>
        </div>
      </div>
    );
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
    const questionGroups = getQuestionGroups(activePartTab);
    const currentQuestionStructure = getCurrentQuestionGroupStructure();

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
          {currentQuestionStructure && (
            <div className="space-y-4">
              {currentQuestionStructure.type === 'group' ? (
                /* Display grouped questions */
                <>
                  <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-4">
                    <div className="flex items-center justify-between mb-3">
                      <h4 className="font-medium text-blue-900">
                        Nhóm câu hỏi {currentQuestionStructure.groupId} (Câu {currentQuestionStructure.questions[0].question_number}-{currentQuestionStructure.questions[currentQuestionStructure.questions.length - 1].question_number})
                      </h4>
                      <button
                        onClick={() => groupImageRef.current?.click()}
                        className="inline-flex items-center px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
                      >
                        📷 Upload ảnh nhóm
                      </button>
                      <input
                        ref={groupImageRef}
                        type="file"
                        accept="image/*"
                        multiple
                        onChange={handleGroupImageUpload}
                        className="hidden"
                      />
                    </div>
                    
                    {(() => {
                      const currentGroupData = getCurrentQuestionGroup();
                      return currentGroupData?.passage ? (
                        <div className="mb-3">
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Đoạn văn/Mô tả nhóm
                          </label>
                          <div className="p-3 bg-white border border-gray-300 rounded-md">
                            {currentGroupData.passage}
                          </div>
                        </div>
                      ) : null;
                    })()}

                    {currentQuestionStructure.groupId && groupImages[currentQuestionStructure.groupId] && groupImages[currentQuestionStructure.groupId].length > 0 && (
                      <div className="mb-3">
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Ảnh đã upload ({groupImages[currentQuestionStructure.groupId].length} ảnh)
                        </label>
                        <div className="grid grid-cols-2 gap-3">
                          {groupImages[currentQuestionStructure.groupId].map((file, index) => (
                            <div key={index} className="relative inline-block">
                              <img
                                src={URL.createObjectURL(file)}
                                alt={`Group image ${index + 1}`}
                                className="w-full max-h-32 object-contain border border-gray-300 rounded"
                              />
                              <button
                                onClick={() => {
                                  const groupId = currentQuestionStructure.groupId;
                                  if (!groupId) return;
                                  setGroupImages(prev => {
                                    const newState = { ...prev };
                                    const updatedFiles = [...(newState[groupId] || [])];
                                    updatedFiles.splice(index, 1);
                                    if (updatedFiles.length === 0) {
                                      delete newState[groupId];
                                    } else {
                                      newState[groupId] = updatedFiles;
                                    }
                                    return newState;
                                  });
                                }}
                                className="absolute top-1 right-1 bg-red-500 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs hover:bg-red-600"
                              >
                                ×
                              </button>
                              <div className="absolute bottom-1 left-1 bg-black bg-opacity-50 text-white text-xs px-1 rounded">
                                {index + 1}
                              </div>
                            </div>
                          ))}
                        </div>
                        <p className="text-xs text-gray-500 mt-1">
                          Ảnh sẽ được lưu như: {currentQuestionStructure.questions[0].question_number}-{currentQuestionStructure.questions[currentQuestionStructure.questions.length - 1].question_number}.png, etc.
                        </p>
                      </div>
                    )}
                  </div>

                  {/* Display all questions in group */}
                  <div className="space-y-6">
                    {currentQuestionStructure.questions.map((question) => {
                      const questionAnswers = getAnswersForQuestion(question.question_number);
                      return (
                        <div key={question.question_number} className="border border-gray-200 rounded-lg p-4">
                          <h4 className="text-base font-medium text-gray-900 mb-3">
                            Câu hỏi {question.question_number}
                          </h4>
                          
                          {/* Question Content */}
                          <div className="space-y-4">
                            <div>
                              <label className="block text-sm font-medium text-gray-700 mb-2">
                                Nội dung câu hỏi
                              </label>
                              <textarea
                                value={question.content}
                                readOnly
                                className="w-full p-3 border border-gray-300 rounded-md bg-gray-50"
                                rows={2}
                              />
                            </div>

                            {question.vietnamese_translation && (
                              <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                  Bản dịch tiếng Việt
                                </label>
                                <textarea
                                  value={question.vietnamese_translation}
                                  readOnly
                                  className="w-full p-3 border border-gray-300 rounded-md bg-gray-50"
                                  rows={1}
                                />
                              </div>
                            )}

                            {/* Answers */}
                            <div>
                              <label className="block text-sm font-medium text-gray-700 mb-3">
                                Đáp án
                              </label>
                              <div className="space-y-2">
                                {questionAnswers.map((answer) => (
                                  <div
                                    key={answer.answer_letter}
                                    className={`p-2 border rounded ${
                                      answer.is_correct
                                        ? "border-green-300 bg-green-50"
                                        : "border-gray-300 bg-white"
                                    }`}
                                  >
                                    <div className="flex items-start space-x-2">
                                      <input
                                        type="radio"
                                        name={`question-${question.question_number}`}
                                        checked={answer.is_correct}
                                        readOnly
                                        className="mt-1"
                                      />
                                      <div className="flex-1">
                                        <div className="text-sm font-medium text-gray-900">
                                          {answer.content}
                                        </div>
                                        {answer.vietnamese_translation && (
                                          <div className="text-xs text-gray-600 mt-1">
                                            {answer.vietnamese_translation}
                                          </div>
                                        )}
                                        {answer.explanation && (
                                          <div className={`text-xs mt-1 font-medium ${
                                            answer.is_correct ? "text-green-700" : "text-gray-600"
                                          }`}>
                                            {answer.explanation}
                                          </div>
                                        )}
                                      </div>
                                    </div>
                                  </div>
                                ))}
                              </div>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </>
              ) : (
                /* Display single question */
                <div className="space-y-4">
                  {/* Question Header */}
                  <div className="flex items-center justify-between">
                    <h3 className="text-base font-medium text-gray-900">
                      Câu hỏi {currentQuestionStructure.questions[0].question_number}
                    </h3>
                    <SingleQuestionImageUpload questionNumber={currentQuestionStructure.questions[0].question_number} />
                  </div>

                  {/* Question Image Preview */}
                  <SingleQuestionImagePreview questionNumber={currentQuestionStructure.questions[0].question_number} />

                  {/* Question Content */}
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Nội dung câu hỏi
                      </label>
                      <textarea
                        value={currentQuestionStructure.questions[0].content}
                        readOnly
                        className="w-full p-3 border border-gray-300 rounded-md bg-gray-50"
                        rows={3}
                      />
                    </div>

                    {currentQuestionStructure.questions[0].vietnamese_translation && (
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Bản dịch tiếng Việt (câu hỏi)
                        </label>
                        <textarea
                          value={currentQuestionStructure.questions[0].vietnamese_translation || ""}
                          readOnly
                          className="w-full p-3 border border-gray-300 rounded-md bg-gray-50"
                          rows={2}
                        />
                      </div>
                    )}

                    {/* Single Question Answers */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-3">
                        Đáp án
                      </label>
                      <div className="space-y-3">
                        {getAnswersForQuestion(currentQuestionStructure.questions[0].question_number).map((answer) => (
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
                                name={`question-${currentQuestionStructure.questions[0].question_number}`}
                                checked={answer.is_correct}
                                readOnly
                                className="mt-1"
                              />
                              <div className="flex-1">
                                <div className="font-medium text-gray-900">
                                  {answer.content}
                                </div>
                                {answer.vietnamese_translation && (
                                  <div className="text-sm text-gray-600 mt-1">
                                    {answer.vietnamese_translation}
                                  </div>
                                )}
                                {answer.explanation && (
                                  <div className={`text-sm mt-1 font-medium ${
                                    answer.is_correct ? "text-green-700" : "text-gray-600"
                                  }`}>
                                    {answer.explanation}
                                  </div>
                                )}
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}

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
              {currentQuestionIndex + 1} / {questionGroups.length}
                </span>

                <button
                  onClick={() => handleQuestionNavigation("next")}
              disabled={currentQuestionIndex === questionGroups.length - 1}
                  className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Câu tiếp →
                </button>
              </div>
        </div>

        {/* Submit Button */}
        <div className="mt-6 flex justify-end">
          <button
            onClick={handleExamSubmission}
            disabled={isSubmitting}
            className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isSubmitting ? "Đang lưu..." : "Lưu đề thi"}
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
