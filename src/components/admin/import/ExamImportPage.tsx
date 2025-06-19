'use client';

import React, { useState, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { CloudArrowUpIcon, ArrowLeftIcon, CheckIcon, ExclamationTriangleIcon } from '@heroicons/react/24/outline';
import AdminLayout from '@/components/admin/layout/AdminLayout';
import TabGroup from './TabGroup';
import TablePreview, { 
  examColumns, 
  createPartsColumns, 
  questionsColumns, 
  answersColumns 
} from './TablePreview';
import DownloadTemplate from './DownloadTemplate';
import { useExcelProcessor } from '@/hooks/useExcelProcessor';
import { ExamImportData, TabType } from '@/types/exam';

const ExamImportPage: React.FC = () => {
  const router = useRouter();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { processExcelFile, isProcessing } = useExcelProcessor();

  // State management
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [examData, setExamData] = useState<ExamImportData | null>(null);
  const [audioFiles, setAudioFiles] = useState<Record<number, File>>({});
  const [activeTab, setActiveTab] = useState<TabType>('exam');
  const [isSubmitting, setIsSubmitting] = useState(false);
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
    setAudioFiles({});

    // Process the Excel file
    const result = await processExcelFile(file);
    if (result.success && result.data) {
      setExamData(result.data);
    } else {
      setError(result.error || 'Lỗi xử lý file Excel');
    }
  };

  // Handle audio file selection
  const handleAudioFileSelect = (partNumber: number, file: File | null) => {
    setAudioFiles(prev => {
      const updated = { ...prev };
      if (file) {
        updated[partNumber] = file;
      } else {
        delete updated[partNumber];
      }
      return updated;
    });
  };

  // Handle form submission
  const handleSubmit = async () => {
    if (!examData) {
      setError('Chưa có dữ liệu để nhập');
      return;
    }

    // Validate audio files for listening parts
    const listeningParts = examData.parts.filter(part => part.type === 'listening');
    const missingAudio = listeningParts.filter(part => !audioFiles[part.part_number]);
    
    if (missingAudio.length > 0) {
      setError(`Thiếu file audio cho phần: ${missingAudio.map(p => p.title).join(', ')}`);
      return;
    }

    // Confirm before submission
    const confirmed = window.confirm('Bạn có chắc muốn nhập đề thi này vào hệ thống?');
    if (!confirmed) return;

    setIsSubmitting(true);
    setError(null);

    try {
      // Prepare form data
      const formData = new FormData();
      formData.append('data', JSON.stringify(examData));

      // Add audio files in order of parts
      listeningParts.forEach(part => {
        const audioFile = audioFiles[part.part_number];
        if (audioFile) {
          formData.append('audioFiles', audioFile);
        }
      });

      // Submit to API
      const response = await fetch('/api/admin/exams/import', {
        method: 'POST',
        body: formData,
      });

      const result = await response.json();

      if (result.success) {
        alert('Đã nhập đề thi thành công!');
        router.push('/admin/exams');
      } else {
        setError(result.data?.message || 'Lỗi khi nhập đề thi');
      }

    } catch (error) {
      console.error('Submit error:', error);
      setError('Lỗi kết nối với server');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Tab configuration
  const tabs = [
    { key: 'exam' as TabType, label: 'Thông tin đề thi', count: examData ? 1 : 0 },
    { key: 'parts' as TabType, label: 'Phần thi', count: examData?.parts.length || 0 },
    { key: 'questions' as TabType, label: 'Câu hỏi', count: examData?.questions.length || 0 },
    { key: 'answers' as TabType, label: 'Đáp án', count: examData?.answers.length || 0 },
  ];

  // Get data for current tab
  const getCurrentTabData = () => {
    if (!examData) return [];
    
    switch (activeTab) {
      case 'exam':
        return [examData.exam];
      case 'parts':
        return examData.parts;
      case 'questions':
        return examData.questions;
      case 'answers':
        return examData.answers;
      default:
        return [];
    }
  };

  // Get columns for current tab
  const getCurrentTabColumns = () => {
    switch (activeTab) {
      case 'exam':
        return examColumns;
      case 'parts':
        return createPartsColumns(audioFiles, handleAudioFileSelect);
      case 'questions':
        return questionsColumns;
      case 'answers':
        return answersColumns;
      default:
        return [];
    }
  };

  return (
    <AdminLayout>
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-6 flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Nhập đề thi từ Excel</h1>
            <p className="text-gray-600">Tải file Excel và xem trước dữ liệu trước khi nhập vào hệ thống</p>
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
          
          {!selectedFile ? (
            <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center">
              <CloudArrowUpIcon className="mx-auto h-12 w-12 text-gray-400" />
              <div className="mt-4">
                <label htmlFor="excel-upload" className="cursor-pointer">
                  <span className="mt-2 block text-sm font-medium text-gray-900">
                    Chọn file Excel để tải lên
                  </span>
                  <span className="mt-1 block text-sm text-gray-500">
                    Hỗ trợ .xlsx, .xls
                  </span>
                </label>
                <input
                  ref={fileInputRef}
                  id="excel-upload"
                  type="file"
                  accept=".xlsx,.xls"
                  onChange={handleFileSelect}
                  className="sr-only"
                />
              </div>
              <div className="mt-4">
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700"
                >
                  Chọn file
                </button>
              </div>
            </div>
          ) : (
            <div className="flex items-center justify-between bg-green-50 border border-green-200 rounded-lg p-4">
              <div className="flex items-center">
                <CheckIcon className="h-5 w-5 text-green-600 mr-2" />
                <span className="text-green-800 font-medium">{selectedFile.name}</span>
                <span className="text-green-600 ml-2">
                  ({(selectedFile.size / 1024 / 1024).toFixed(2)} MB)
                </span>
              </div>
              <button
                onClick={() => fileInputRef.current?.click()}
                className="text-blue-600 hover:text-blue-800 text-sm font-medium"
              >
                Đổi file
              </button>
            </div>
          )}

          {isProcessing && (
            <div className="mt-4 flex items-center text-blue-600">
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600 mr-2"></div>
              Đang xử lý file Excel...
            </div>
          )}
        </div>

        {/* Error Display */}
        {error && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
            <div className="flex">
              <ExclamationTriangleIcon className="h-5 w-5 text-red-400" />
              <div className="ml-3">
                <h3 className="text-sm font-medium text-red-800">Lỗi</h3>
                <p className="mt-1 text-sm text-red-700">{error}</p>
              </div>
            </div>
          </div>
        )}

        {/* Preview Section */}
        {examData && (
          <div className="bg-white rounded-lg shadow p-6 mb-6">
            <h2 className="text-lg font-medium text-gray-900 mb-4">2. Xem trước dữ liệu</h2>
            
            <TabGroup
              activeTab={activeTab}
              onTabChange={setActiveTab}
              tabs={tabs}
            />

            <TablePreview
              data={getCurrentTabData()}
              columns={getCurrentTabColumns()}
              title={tabs.find(t => t.key === activeTab)?.label || ''}
              audioFiles={audioFiles}
              onAudioFileSelect={handleAudioFileSelect}
            />
          </div>
        )}

        {/* Action Buttons */}
        {examData && (
          <div className="flex justify-between items-center">
            <button
              onClick={() => router.push('/admin/exams')}
              className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
            >
              <ArrowLeftIcon className="h-4 w-4 mr-2" />
              Quay lại
            </button>

            <button
              onClick={handleSubmit}
              disabled={isSubmitting}
              className="inline-flex items-center px-6 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-green-600 hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isSubmitting ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                  Đang xử lý...
                </>
              ) : (
                <>
                  <CheckIcon className="h-4 w-4 mr-2" />
                  Nhập vào hệ thống
                </>
              )}
            </button>
          </div>
        )}
      </div>
    </AdminLayout>
  );
};

export default ExamImportPage; 