import React from 'react';
import * as XLSX from 'xlsx';
import { ArrowDownTrayIcon } from '@heroicons/react/24/outline';

const DownloadTemplate: React.FC = () => {
  
  // Download Speaking Test file directly from project folder
  const downloadSpeakingTest = async () => {
    try {
      const response = await fetch('/speaking-test.xlsx');
      if (!response.ok) {
        throw new Error('File not found');
      }
      
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = 'speaking-test.xlsx';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Error downloading speaking test:', error);
      alert('Không thể tải file speaking-test.xlsx. Vui lòng kiểm tra file có tồn tại trong thư mục public.');
    }
  };

  // Download Writing Test file directly from project folder  
  const downloadWritingTest = async () => {
    try {
      const response = await fetch('/writing-test.xlsx');
      if (!response.ok) {
        throw new Error('File not found');
      }
      
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = 'writing-test.xlsx';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Error downloading writing test:', error);
      alert('Không thể tải file writing-test.xlsx. Vui lòng kiểm tra file có tồn tại trong thư mục public.');
    }
  };

  // Template for Full TOEIC Test (Standard 200 questions, 7 parts)
  const downloadFullToeicTemplate = () => {
    const wb = XLSX.utils.book_new();

    // Sheet 1: Exam Info
    const examData = [
      ['Title', 'Description', 'Difficulty', 'Duration'],
      ['TOEIC Full Test - ETS Standard', 'Đề thi TOEIC đầy đủ - 200 câu hỏi, 7 parts theo chuẩn ETS 2024', 'Hard', 120]
    ];
    const examSheet = XLSX.utils.aoa_to_sheet(examData);
    XLSX.utils.book_append_sheet(wb, examSheet, 'Exams');

    // Sheet 2: Parts - All 7 TOEIC parts with exact structure
    const partsData = [
      ['part_number', 'title', 'description', 'instruction', 'difficulty_level', 'time_limit'],
      [1, 'Part 1 - Photographs', 'Photographs - 6 questions (1-6)', 'Look at the picture and listen to the four statements. Choose the statement that best describes what you see in the picture.', 'medium', 6],
      [2, 'Part 2 - Question-Response', 'Question-Response - 25 questions (7-31)', 'You will hear a question or statement and three responses. Choose the best response to the question or statement.', 'medium', 25],
      [3, 'Part 3 - Short Conversations', 'Short Conversations - 39 questions (32-70)', 'You will hear some conversations between two or more people. You will be asked to answer three questions about what the speakers say in each conversation.', 'medium', 39],
      [4, 'Part 4 - Short Talks', 'Short Talks - 30 questions (71-100)', 'You will hear some talks given by a single speaker. You will be asked to answer three questions about what the speaker says in each talk.', 'medium', 30],
      [5, 'Part 5 - Incomplete Sentences', 'Incomplete Sentences - 30 questions (101-130)', 'A word or phrase is missing in each of the sentences below. Four answer choices are given below each sentence. Select the best answer to complete the sentence.', 'medium', 30],
      [6, 'Part 6 - Text Completion', 'Text Completion - 16 questions (131-146)', 'Read the texts that follow. A word, phrase, or sentence is missing in parts of each text. Four answer choices for each question are given below the text.', 'medium', 16],
      [7, 'Part 7 - Reading Comprehension', 'Reading Comprehension - 54 questions (147-200)', 'In this part you will read a selection of texts, such as magazine and newspaper articles, letters, and advertisements. Each text is followed by several questions.', 'medium', 54]
    ];
    const partsSheet = XLSX.utils.aoa_to_sheet(partsData);
    XLSX.utils.book_append_sheet(wb, partsSheet, 'Parts');

    // Sheet 3: Questions - Sample structure for all 200 questions
    const questionsData = [
      ['part_number', 'question_number', 'content', 'vietnamese_translation']
    ];
    
    // Generate sample questions following TOEIC structure
    const partStructure = [
      { partNo: 1, start: 1, count: 6, type: 'listening' },
      { partNo: 2, start: 7, count: 25, type: 'listening' },
      { partNo: 3, start: 32, count: 39, type: 'listening' },
      { partNo: 4, start: 71, count: 30, type: 'listening' },
      { partNo: 5, start: 101, count: 30, type: 'reading' },
      { partNo: 6, start: 131, count: 16, type: 'reading' },
      { partNo: 7, start: 147, count: 54, type: 'reading' }
    ];

    partStructure.forEach(part => {
      for (let i = 0; i < part.count; i++) {
        const questionNo = part.start + i;
        const content = part.type === 'listening' 
          ? `Listening question ${questionNo} for Part ${part.partNo} - [Audio content description]`
          : `Reading question ${questionNo} for Part ${part.partNo} - [Question content]`;
        const translation = part.type === 'listening'
          ? `Câu hỏi nghe ${questionNo} cho Part ${part.partNo} - [Mô tả nội dung audio]`
          : `Câu hỏi đọc ${questionNo} cho Part ${part.partNo} - [Nội dung câu hỏi]`;
          
        questionsData.push([part.partNo, questionNo, content, translation]);
      }
    });

    const questionsSheet = XLSX.utils.aoa_to_sheet(questionsData);
    XLSX.utils.book_append_sheet(wb, questionsSheet, 'Questions');

    // Sheet 4: Answers - 4 options per question (A, B, C, D)
    const answersData = [
      ['question_number', 'answer_letter', 'answer_text', 'is_correct', 'vietnamese_translation']
    ];
    
    // Generate 4 answers per question for all 200 questions
    for (let q = 1; q <= 200; q++) {
      for (let a = 0; a < 4; a++) {
        const letter = String.fromCharCode(65 + a); // A, B, C, D
        const isCorrect = a === 0; // First option correct for template
        answersData.push([
          q,
          letter,
          `(${letter}) Answer option ${letter} for question ${q}`,
          isCorrect,
          `(${letter}) Lựa chọn ${letter} cho câu hỏi ${q}`
        ]);
      }
    }

    const answersSheet = XLSX.utils.aoa_to_sheet(answersData);
    XLSX.utils.book_append_sheet(wb, answersSheet, 'Answers');

    XLSX.writeFile(wb, 'full-toeic-test-template.xlsx');
  };

  return (
    <div className="mb-6 space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Speaking Test Template */}
        <div className="border border-gray-200 rounded-lg p-4 bg-blue-50">
          <h4 className="font-medium text-blue-800 mb-2">🗣️ Speaking Test</h4>
          <p className="text-sm text-blue-700 mb-3">
            Đề thi Speaking chính thức<br/>
            11 câu hỏi, 3 parts, 20 phút<br/>
            Không cần đáp án, audio, ảnh
          </p>
          <button
            onClick={downloadSpeakingTest}
            className="inline-flex items-center px-3 py-2 border border-blue-300 rounded-md text-sm font-medium text-blue-700 bg-white hover:bg-blue-50"
          >
            <ArrowDownTrayIcon className="h-4 w-4 mr-2" />
            Tải speaking-test.xlsx
          </button>
        </div>

        {/* Writing Test Template */}
        <div className="border border-gray-200 rounded-lg p-4 bg-green-50">
          <h4 className="font-medium text-green-800 mb-2">✍️ Writing Test</h4>
          <p className="text-sm text-green-700 mb-3">
            Đề thi Writing chính thức<br/>
            8 câu hỏi, 2 parts, 60 phút<br/>
            Không cần đáp án, audio, ảnh
          </p>
          <button
            onClick={downloadWritingTest}
            className="inline-flex items-center px-3 py-2 border border-green-300 rounded-md text-sm font-medium text-green-700 bg-white hover:bg-green-50"
          >
            <ArrowDownTrayIcon className="h-4 w-4 mr-2" />
            Tải writing-test.xlsx
          </button>
        </div>

        {/* Full TOEIC Template */}
        <div className="border border-gray-200 rounded-lg p-4 bg-purple-50">
          <h4 className="font-medium text-purple-800 mb-2">📚 Full TOEIC Test</h4>
          <p className="text-sm text-purple-700 mb-3">
            Đề thi TOEIC đầy đủ<br/>
            200 câu hỏi, 7 parts, 120 phút<br/>
            Cần đáp án và audio files
          </p>
          <button
            onClick={downloadFullToeicTemplate}
            className="inline-flex items-center px-3 py-2 border border-purple-300 rounded-md text-sm font-medium text-purple-700 bg-white hover:bg-purple-50"
          >
            <ArrowDownTrayIcon className="h-4 w-4 mr-2" />
            Tạo template TOEIC
          </button>
        </div>
      </div>

      <div className="bg-yellow-50 border border-yellow-200 rounded-md p-4">
        <h4 className="text-sm font-medium text-yellow-800 mb-2">📋 Hướng dẫn sử dụng:</h4>
        <ul className="text-sm text-yellow-700 list-disc list-inside space-y-1">
          <li><strong>Speaking Test:</strong> Download file speaking-test.xlsx, chỉnh sửa câu hỏi và upload</li>
          <li><strong>Writing Test:</strong> Download file writing-test.xlsx, chỉnh sửa câu hỏi và upload</li>
          <li><strong>Full TOEIC:</strong> Tạo template mới với 200 câu hỏi, cần thêm audio files cho Part 1-4</li>
          <li><strong>Lưu ý:</strong> Không thay đổi tên cột và cấu trúc sheets để đảm bảo import thành công</li>
        </ul>
      </div>
    </div>
  );
};

export default DownloadTemplate; 