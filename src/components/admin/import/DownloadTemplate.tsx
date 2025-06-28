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

    // Sheet 1: Exams
    const examData = [
      ['title', 'description', 'difficulty', 'estimated_time'],
      ['TOEIC Practice Test 2024', 'Full TOEIC test with 200 questions, 7 parts', 'medium', 120]
    ];
    const examSheet = XLSX.utils.aoa_to_sheet(examData);
    XLSX.utils.book_append_sheet(wb, examSheet, 'Exams');

    // Sheet 2: Parts
    const partsData = [
      ['part_number', 'title', 'description', 'instruction', 'difficulty_level', 'time_limit']
    ];
    
    const partStructure = [
      { partNo: 1, name: 'Part 1 - Photographs', description: 'Listening - Picture descriptions', time: 10, type: 'listening', start: 1, count: 6 },
      { partNo: 2, name: 'Part 2 - Question-Response', description: 'Listening - Question-response sets', time: 15, type: 'listening', start: 7, count: 25 },
      { partNo: 3, name: 'Part 3 - Short Conversations', description: 'Listening - Conversations', time: 20, type: 'listening', start: 32, count: 39 },
      { partNo: 4, name: 'Part 4 - Short Talks', description: 'Listening - Talks', time: 20, type: 'listening', start: 71, count: 30 },
      { partNo: 5, name: 'Part 5 - Incomplete Sentences', description: 'Reading - Grammar and vocabulary', time: 15, type: 'reading', start: 101, count: 30 },
      { partNo: 6, name: 'Part 6 - Text Completion', description: 'Reading - Text completion', time: 15, type: 'reading', start: 131, count: 16 },
      { partNo: 7, name: 'Part 7 - Reading Comprehension', description: 'Reading - Passages and questions', time: 25, type: 'reading', start: 147, count: 54 }
    ];

    partStructure.forEach(part => {
      partsData.push([part.partNo, part.name, part.description, `Instructions for ${part.name}`, 'medium', part.time]);
    });

    const partsSheet = XLSX.utils.aoa_to_sheet(partsData);
    XLSX.utils.book_append_sheet(wb, partsSheet, 'Parts');

    // Sheet 2.5: QuestionGroups (for reading comprehension)
    const questionGroupsData = [
      ['group_id', 'part_number', 'passage', 'image_url', 'instruction', 'start_question', 'end_question', 'vietnamese_translation']
    ];

    // Create sample reading passages for Part 6 and Part 7
    const readingGroups = [
      // Part 6 - Text Completion (4 groups, 4 questions each)
      { id: 1, part: 6, passage: 'Dear Mr. Johnson,\n\nWe are pleased to inform you that your application for the Marketing Manager position has been accepted. We were impressed by your extensive experience in digital marketing and your innovative approach to brand development.\n\nYour first day will be Monday, March 15th. Please report to the Human Resources department at 9:00 AM for orientation. You will meet with your new team and receive your employee handbook.\n\nWe look forward to having you join our team.', start: 131, end: 134 },
      { id: 2, part: 6, passage: 'MEMO\n\nTo: All Employees\nFrom: IT Department\nDate: February 28, 2024\nRE: System Maintenance\n\nWe will be performing scheduled maintenance on our computer systems this weekend. The maintenance will begin Saturday at 6:00 PM and is expected to complete by Sunday at 8:00 AM.\n\nDuring this time, email services and the company intranet will be unavailable. Please plan accordingly and complete any urgent tasks before the maintenance window begins.', start: 135, end: 138 },
      { id: 3, part: 6, passage: 'Green Valley Electronics is having a major sale this month! All laptops are 30% off, smartphones get a 25% discount, and tablets are reduced by 40%. This incredible offer is valid until the end of March.\n\nOur knowledgeable staff can help you find the perfect device for your needs. We also offer extended warranties and technical support for all purchases. Visit our store today or shop online at www.greenvalleyelectronics.com.', start: 139, end: 142 },
      { id: 4, part: 6, passage: 'The International Business Conference will take place in Chicago from April 10-12, 2024. This year\'s theme is "Innovation in Global Markets." Leading experts from around the world will share insights on emerging technologies, sustainable business practices, and market trends.\n\nRegistration includes access to all sessions, networking events, and conference materials. Early bird pricing is available until March 1st. For more information and to register, visit our website.', start: 143, end: 146 },

      // Part 7 - Reading Comprehension (multiple groups with varying question counts)
      { id: 5, part: 7, passage: 'New Restaurant Opening\n\nMario\'s Italian Kitchen is excited to announce the grand opening of our newest location in downtown Springfield. Join us for our opening celebration on Saturday, March 20th, from 11:00 AM to 10:00 PM.\n\nTo celebrate, we\'re offering 20% off all menu items during opening week. Our menu features authentic Italian cuisine prepared with fresh, locally-sourced ingredients. From classic pasta dishes to wood-fired pizzas, we have something for everyone.\n\nReservations are recommended for dinner service. Call (555) 123-4567 or visit our website to book your table.', start: 147, end: 149 },
      { id: 6, part: 7, passage: 'City Transit Update\n\nEffective Monday, March 8th, the City Transit Authority will implement new bus routes to better serve the growing downtown business district. Route 45 will now include stops at the Financial Center and the Convention Center.\n\nAdditionally, weekend service hours have been extended. Buses will now run until midnight on Fridays and Saturdays. Updated schedules and route maps are available at all bus stops and on our mobile app.\n\nFor questions about these changes, please call our customer service line at (555) 987-6543.', start: 150, end: 152 },
      { id: 7, part: 7, passage: 'Job Posting: Marketing Coordinator\n\nTechStart Solutions is seeking a dynamic Marketing Coordinator to join our growing team. The ideal candidate will have 2-3 years of experience in digital marketing, excellent communication skills, and proficiency in social media management.\n\nResponsibilities include:\n• Developing marketing campaigns\n• Managing social media accounts\n• Creating promotional materials\n• Analyzing market trends\n\nWe offer competitive salary, health benefits, and flexible work arrangements. To apply, send your resume and cover letter to careers@techstartsolutions.com by March 15th.', start: 153, end: 157 }
    ];

    readingGroups.forEach(group => {
      questionGroupsData.push([
        group.id,
        group.part,
        group.passage,
        '', // image_url - có thể có cho một số passages
        `Read the following text and answer questions ${group.start}-${group.end}`,
        group.start,
        group.end,
        'Đọc đoạn văn sau và trả lời các câu hỏi tương ứng'
      ]);
    });

    const questionGroupsSheet = XLSX.utils.aoa_to_sheet(questionGroupsData);
    XLSX.utils.book_append_sheet(wb, questionGroupsSheet, 'QuestionGroups');

    // Sheet 3: Questions (updated with group_id)
    const questionsData = [
      ['part_number', 'question_number', 'group_id', 'content', 'vietnamese_translation']
    ];

    partStructure.forEach(part => {
      for (let i = 0; i < part.count; i++) {
        const questionNo = part.start + i;
        let groupId = null;
        
        // Assign group_id for reading comprehension questions
        if (part.partNo === 6) {
          // Part 6: 4 groups, 4 questions each
          groupId = Math.floor((questionNo - 131) / 4) + 1;
        } else if (part.partNo === 7) {
          // Part 7: Assign to appropriate reading groups
          if (questionNo >= 147 && questionNo <= 149) groupId = 5;
          else if (questionNo >= 150 && questionNo <= 152) groupId = 6;
          else if (questionNo >= 153 && questionNo <= 157) groupId = 7;
          // Add more groups as needed...
        }
        
        const content = part.type === 'listening' 
          ? `Listening question ${questionNo} for Part ${part.partNo} - [Audio content description]`
          : `Reading question ${questionNo} for Part ${part.partNo}${groupId ? ` - Group ${groupId}` : ''} - [Question content]`;
        const translation = part.type === 'listening'
          ? `Câu hỏi nghe ${questionNo} cho Part ${part.partNo} - [Mô tả nội dung audio]`
          : `Câu hỏi đọc ${questionNo} cho Part ${part.partNo}${groupId ? ` - Nhóm ${groupId}` : ''} - [Nội dung câu hỏi]`;
          
        questionsData.push([part.partNo, questionNo, groupId, content, translation]);
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