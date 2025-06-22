import React from 'react';
import * as XLSX from 'xlsx';
import { ArrowDownTrayIcon } from '@heroicons/react/24/outline';

const DownloadTemplate: React.FC = () => {
  
  // Template for Speaking Practice (Topics only)
  const downloadSpeakingTemplate = () => {
    const wb = XLSX.utils.book_new();

    // Sheet 1: Exam Info
    const examData = [
      ['Title', 'Description', 'Difficulty', 'Duration'],
      ['Speaking Practice Topics', 'Bộ đề luyện tập Speaking - Topics để thực hành nói', 'Medium', 30]
    ];
    const examSheet = XLSX.utils.aoa_to_sheet(examData);
    XLSX.utils.book_append_sheet(wb, examSheet, 'Exam Info');

    // Sheet 2: Parts - Single part for topics
    const partsData = [
      ['Part No', 'Title', 'Type', 'Time Limit', 'Description'],
      [1, 'Speaking Topics', 'speaking', 30, 'Topics luyện tập nói']
    ];
    const partsSheet = XLSX.utils.aoa_to_sheet(partsData);
    XLSX.utils.book_append_sheet(wb, partsSheet, 'Parts');

    // Sheet 3: Questions (Topics)
    const questionsData = [
      ['Question No', 'Part No', 'Content', 'Type', 'Vietnamese Translation'],
      [1, 1, 'Describe your hometown. What do you like most about it?', 'speaking_topic', 'Mô tả quê hương của bạn. Bạn thích điều gì nhất về nó?'],
      [2, 1, 'Talk about your favorite hobby and why you enjoy it.', 'speaking_topic', 'Nói về sở thích yêu thích của bạn và tại sao bạn thích nó.'],
      [3, 1, 'Describe a memorable vacation you took.', 'speaking_topic', 'Mô tả một kỳ nghỉ đáng nhớ mà bạn đã có.'],
      [4, 1, 'What are your career goals for the next 5 years?', 'speaking_topic', 'Mục tiêu nghề nghiệp của bạn trong 5 năm tới là gì?'],
      [5, 1, 'Discuss the importance of learning English in today\'s world.', 'speaking_topic', 'Thảo luận về tầm quan trọng của việc học tiếng Anh trong thế giới ngày nay.'],
      [6, 1, 'Describe your ideal job and workplace environment.', 'speaking_topic', 'Mô tả công việc lý tưởng và môi trường làm việc của bạn.'],
      [7, 1, 'Talk about a person who has influenced your life.', 'speaking_topic', 'Nói về một người đã ảnh hưởng đến cuộc sống của bạn.'],
      [8, 1, 'What changes would you make to improve your city?', 'speaking_topic', 'Bạn sẽ thay đổi gì để cải thiện thành phố của mình?'],
      [9, 1, 'Describe your daily routine and how you manage your time.', 'speaking_topic', 'Mô tả thói quen hàng ngày và cách bạn quản lý thời gian.'],
      [10, 1, 'Discuss the advantages and disadvantages of social media.', 'speaking_topic', 'Thảo luận về ưu và nhược điểm của mạng xã hội.']
    ];
    const questionsSheet = XLSX.utils.aoa_to_sheet(questionsData);
    XLSX.utils.book_append_sheet(wb, questionsSheet, 'Questions');

    // Sheet 4: Answers (Empty for speaking practice - keep for consistency)
    const answersData = [
      ['Question No', 'Content', 'Is Correct', 'Explanation', 'Vietnamese Translation'],
      ['', '(Không cần đáp án cho Speaking Practice)', '', '', '']
    ];
    const answersSheet = XLSX.utils.aoa_to_sheet(answersData);
    XLSX.utils.book_append_sheet(wb, answersSheet, 'Answers');

    XLSX.writeFile(wb, 'speaking-practice-template.xlsx');
  };

  // Template for Writing Practice (Topics only)
  const downloadWritingTemplate = () => {
    const wb = XLSX.utils.book_new();

    // Sheet 1: Exam Info
    const examData = [
      ['Title', 'Description', 'Difficulty', 'Duration'],
      ['Writing Practice Topics', 'Bộ đề luyện tập Writing - Topics để thực hành viết', 'Medium', 60]
    ];
    const examSheet = XLSX.utils.aoa_to_sheet(examData);
    XLSX.utils.book_append_sheet(wb, examSheet, 'Exam Info');

    // Sheet 2: Parts - Single part for topics
    const partsData = [
      ['Part No', 'Title', 'Type', 'Time Limit', 'Description'],
      [1, 'Writing Topics', 'writing', 60, 'Topics luyện tập viết']
    ];
    const partsSheet = XLSX.utils.aoa_to_sheet(partsData);
    XLSX.utils.book_append_sheet(wb, partsSheet, 'Parts');

    // Sheet 3: Questions (Topics)
    const questionsData = [
      ['Question No', 'Part No', 'Content', 'Type', 'Vietnamese Translation'],
      [1, 1, 'Write an essay about the benefits of online learning compared to traditional classroom learning.', 'writing_topic', 'Viết một bài luận về lợi ích của việc học trực tuyến so với học truyền thống trong lớp học.'],
      [2, 1, 'Describe the impact of technology on modern communication and relationships.', 'writing_topic', 'Mô tả tác động của công nghệ đến giao tiếp và các mối quan hệ hiện đại.'],
      [3, 1, 'Write about your opinion on working from home versus working in an office.', 'writing_topic', 'Viết về ý kiến của bạn về làm việc tại nhà so với làm việc tại văn phòng.'],
      [4, 1, 'Discuss the importance of environmental protection and what individuals can do to help.', 'writing_topic', 'Thảo luận về tầm quan trọng của việc bảo vệ môi trường và những gì cá nhân có thể làm để giúp đỡ.'],
      [5, 1, 'Write a report on the advantages and disadvantages of globalization.', 'writing_topic', 'Viết một báo cáo về ưu và nhược điểm của toàn cầu hóa.'],
      [6, 1, 'Describe your ideal vacation destination and explain why you would choose it.', 'writing_topic', 'Mô tả điểm đến nghỉ dưỡng lý tưởng của bạn và giải thích tại sao bạn lại chọn nó.'],
      [7, 1, 'Write about the role of artificial intelligence in the future workplace.', 'writing_topic', 'Viết về vai trò của trí tuệ nhân tạo trong nơi làm việc tương lai.'],
      [8, 1, 'Discuss the challenges and opportunities of studying abroad.', 'writing_topic', 'Thảo luận về những thách thức và cơ hội của việc du học.'],
      [9, 1, 'Write an argumentative essay about whether social media has more positive or negative effects on society.', 'writing_topic', 'Viết một bài luận tranh luận về việc mạng xã hội có nhiều tác động tích cực hay tiêu cực hơn đến xã hội.'],
      [10, 1, 'Describe your experience with online shopping and compare it to traditional shopping.', 'writing_topic', 'Mô tả trải nghiệm mua sắm trực tuyến của bạn và so sánh với mua sắm truyền thống.']
    ];
    const questionsSheet = XLSX.utils.aoa_to_sheet(questionsData);
    XLSX.utils.book_append_sheet(wb, questionsSheet, 'Questions');

    // Sheet 4: Answers (Empty for writing practice - keep for consistency)
    const answersData = [
      ['Question No', 'Content', 'Is Correct', 'Explanation', 'Vietnamese Translation'],
      ['', '(Không cần đáp án cho Writing Practice)', '', '', '']
    ];
    const answersSheet = XLSX.utils.aoa_to_sheet(answersData);
    XLSX.utils.book_append_sheet(wb, answersSheet, 'Answers');

    XLSX.writeFile(wb, 'writing-practice-template.xlsx');
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
    XLSX.utils.book_append_sheet(wb, examSheet, 'Exam Info');

    // Sheet 2: Parts - All 7 TOEIC parts with exact structure
    const partsData = [
      ['Part No', 'Title', 'Type', 'Time Limit', 'Description'],
      [1, 'Part 1 - Photographs', 'listening', 6, 'Photographs - 6 questions (1-6)'],
      [2, 'Part 2 - Question-Response', 'listening', 25, 'Question-Response - 25 questions (7-31)'],
      [3, 'Part 3 - Short Conversations', 'listening', 39, 'Short Conversations - 39 questions (32-70)'],
      [4, 'Part 4 - Short Talks', 'listening', 30, 'Short Talks - 30 questions (71-100)'],
      [5, 'Part 5 - Incomplete Sentences', 'reading', 30, 'Incomplete Sentences - 30 questions (101-130)'],
      [6, 'Part 6 - Text Completion', 'reading', 16, 'Text Completion - 16 questions (131-146)'],
      [7, 'Part 7 - Reading Comprehension', 'reading', 54, 'Reading Comprehension - 54 questions (147-200)']
    ];
    const partsSheet = XLSX.utils.aoa_to_sheet(partsData);
    XLSX.utils.book_append_sheet(wb, partsSheet, 'Parts');

    // Sheet 3: Questions - Sample structure for all 200 questions
    const questionsData = [
      ['Question No', 'Part No', 'Content', 'Type', 'Vietnamese Translation']
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
          
        questionsData.push([questionNo.toString(), part.partNo.toString(), content, 'multiple_choice', translation]);
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
        {/* Speaking Practice Template */}
        <div className="border border-gray-200 rounded-lg p-4 bg-blue-50">
          <h4 className="font-medium text-blue-800 mb-2">🗣️ Speaking Practice</h4>
          <p className="text-sm text-blue-700 mb-3">
            Topics luyện tập nói<br/>
            Không cần đáp án, audio, ảnh<br/>
            Thời gian linh hoạt (10-30 phút)
          </p>
          <button
            onClick={downloadSpeakingTemplate}
            className="w-full inline-flex items-center justify-center px-3 py-2 border border-blue-300 rounded-md shadow-sm text-sm font-medium text-blue-700 bg-white hover:bg-blue-50"
          >
            <ArrowDownTrayIcon className="h-4 w-4 mr-2" />
            Tải template Speaking
          </button>
        </div>

        {/* Writing Practice Template */}
        <div className="border border-gray-200 rounded-lg p-4 bg-green-50">
          <h4 className="font-medium text-green-800 mb-2">✍️ Writing Practice</h4>
          <p className="text-sm text-green-700 mb-3">
            Topics luyện tập viết<br/>
            Không cần đáp án, audio, ảnh<br/>
            Thời gian linh hoạt (30-90 phút)
          </p>
          <button
            onClick={downloadWritingTemplate}
            className="w-full inline-flex items-center justify-center px-3 py-2 border border-green-300 rounded-md shadow-sm text-sm font-medium text-green-700 bg-white hover:bg-green-50"
          >
            <ArrowDownTrayIcon className="h-4 w-4 mr-2" />
            Tải template Writing
          </button>
        </div>

        {/* Full TOEIC Template */}
        <div className="border border-gray-200 rounded-lg p-4 bg-purple-50">
          <h4 className="font-medium text-purple-800 mb-2">📝 Full TOEIC Test</h4>
          <p className="text-sm text-purple-700 mb-3">
            Đề thi TOEIC đầy đủ<br/>
            200 câu hỏi, 7 parts chuẩn ETS<br/>
            120 phút, cần audio cho Parts 1-4
          </p>
          <button
            onClick={downloadFullToeicTemplate}
            className="w-full inline-flex items-center justify-center px-3 py-2 border border-purple-300 rounded-md shadow-sm text-sm font-medium text-purple-700 bg-white hover:bg-purple-50"
          >
            <ArrowDownTrayIcon className="h-4 w-4 mr-2" />
            Tải template TOEIC
          </button>
        </div>
      </div>
      
      <div className="text-sm text-gray-600 bg-gray-50 p-4 rounded-md">
        <h4 className="font-medium text-gray-800 mb-2">📋 Hướng dẫn sử dụng</h4>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <p className="font-medium text-blue-800">Speaking Practice:</p>
            <ul className="mt-1 space-y-1 text-xs">
              <li>• Chỉ cần điền topics/câu hỏi</li>
              <li>• Không cần chia parts</li>
              <li>• Bản dịch tiếng Việt tùy chọn</li>
              <li>• Thời gian và độ khó cho từng topic</li>
            </ul>
          </div>
          <div>
            <p className="font-medium text-green-800">Writing Practice:</p>
            <ul className="mt-1 space-y-1 text-xs">
              <li>• Chỉ cần điền topics/đề bài</li>
              <li>• Không cần chia parts</li>
              <li>• Bản dịch tiếng Việt tùy chọn</li>
              <li>• Thời gian và độ khó cho từng topic</li>
            </ul>
          </div>
          <div>
            <p className="font-medium text-purple-800">Full TOEIC Test:</p>
            <ul className="mt-1 space-y-1 text-xs">
              <li>• Đúng 200 câu, 7 parts chuẩn ETS</li>
              <li>• Question numbering: 1-6, 7-31, 32-70...</li>
              <li>• Parts 1-4 cần file audio</li>
              <li>• Mỗi câu hỏi có 4 đáp án A,B,C,D</li>
            </ul>
          </div>
        </div>
        
        <div className="mt-3 p-3 bg-yellow-50 border border-yellow-200 rounded">
          <p className="text-yellow-800 text-xs">
            <strong>⚠️ Lưu ý quan trọng:</strong> Để hệ thống tự động nhận diện đúng loại đề thi, hãy đặt tên file có chứa từ khóa: 
            "speaking" cho Speaking Practice, "writing" cho Writing Practice, hoặc đảm bảo có đủ 7 parts (1-7) và 200 câu hỏi cho Full TOEIC.
          </p>
        </div>
      </div>
    </div>
  );
};

export default DownloadTemplate; 