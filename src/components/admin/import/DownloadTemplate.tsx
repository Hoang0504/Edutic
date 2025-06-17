import React from 'react';
import * as XLSX from 'xlsx';
import { ArrowDownTrayIcon } from '@heroicons/react/24/outline';

const DownloadTemplate: React.FC = () => {
  const downloadTemplate = () => {
    // Create a new workbook
    const wb = XLSX.utils.book_new();

    // Sheet 1: Exam Info
    const examData = [
      ['Title', 'Description', 'Difficulty', 'Duration'],
      ['TOEIC Sample Test', 'Đề thi TOEIC mẫu dành cho test import', 'Medium', 90]
    ];
    const examSheet = XLSX.utils.aoa_to_sheet(examData);
    XLSX.utils.book_append_sheet(wb, examSheet, 'Exam Info');

    // Sheet 2: Parts - 1 listening + 2 reading parts để dễ test
    const partsData = [
      ['Part No', 'Title', 'Type', 'Time Limit', 'Description'],
      [1, 'Part 1 - Photographs', 'listening', '6 phút', 'Mô tả hình ảnh dựa trên audio'],
      [2, 'Part 5 - Grammar', 'reading', '15 phút', 'Điền từ vào chỗ trống'],
      [3, 'Part 7 - Reading', 'reading', '25 phút', 'Đọc hiểu đoạn văn']
    ];
    const partsSheet = XLSX.utils.aoa_to_sheet(partsData);
    XLSX.utils.book_append_sheet(wb, partsSheet, 'Parts');

    // Sheet 3: Questions
    const questionsData = [
      ['Question No', 'Part No', 'Content', 'Type'],
      [1, 1, 'What is shown in the picture?', 'multiple_choice'],
      [2, 1, 'Where is the woman standing?', 'multiple_choice'],
      [3, 2, 'The company will _____ a new product next month.', 'multiple_choice'],
      [4, 2, 'Please _____ the report by Friday.', 'multiple_choice'],
      [5, 3, 'According to the passage, what is the main purpose of the meeting?', 'multiple_choice'],
      [6, 3, 'When will the new policy take effect?', 'multiple_choice']
    ];
    const questionsSheet = XLSX.utils.aoa_to_sheet(questionsData);
    XLSX.utils.book_append_sheet(wb, questionsSheet, 'Questions');

    // Sheet 4: Answers
    const answersData = [
      ['Question No', 'Content', 'Is Correct', 'Explanation'],
      // Question 1 answers
      [1, 'A. A woman is sitting at a desk', 'TRUE', 'Đúng - hình ảnh cho thấy phụ nữ ngồi bàn làm việc'],
      [1, 'B. A man is walking in the park', 'FALSE', 'Sai - không có người đàn ông đi bộ'],
      [1, 'C. Children are playing outside', 'FALSE', 'Sai - không có trẻ em trong hình'],
      [1, 'D. A dog is sleeping on the floor', 'FALSE', 'Sai - không có con chó'],
      
      // Question 2 answers  
      [2, 'A. In the office', 'TRUE', 'Đúng - cô ấy đang đứng trong văn phòng'],
      [2, 'B. At home', 'FALSE', 'Sai - không phải ở nhà'],
      [2, 'C. In the restaurant', 'FALSE', 'Sai - không phải nhà hàng'],
      [2, 'D. At the library', 'FALSE', 'Sai - không phải thư viện'],

      // Question 3 answers
      [3, 'A. launch', 'TRUE', 'Đúng - "launch a product" = tung ra sản phẩm'],
      [3, 'B. buy', 'FALSE', 'Sai - không phù hợp ngữ cảnh'],
      [3, 'C. sell', 'FALSE', 'Sai - chưa phù hợp'],
      [3, 'D. make', 'FALSE', 'Sai - không tự nhiên'],

      // Question 4 answers
      [4, 'A. complete', 'TRUE', 'Đúng - "complete the report" = hoàn thành báo cáo'],
      [4, 'B. start', 'FALSE', 'Sai - không phù hợp deadline'],
      [4, 'C. read', 'FALSE', 'Sai - không phù hợp ngữ cảnh'],
      [4, 'D. write', 'FALSE', 'Sai - không chính xác'],

      // Question 5 answers
      [5, 'A. To discuss new policies', 'TRUE', 'Đúng - theo đoạn văn, mục đích là thảo luận chính sách mới'],
      [5, 'B. To hire new employees', 'FALSE', 'Sai - không phải tuyển dụng'],
      [5, 'C. To celebrate success', 'FALSE', 'Sai - không phải ăn mừng'],
      [5, 'D. To plan vacation', 'FALSE', 'Sai - không phải lập kế hoạch nghỉ'],

      // Question 6 answers
      [6, 'A. Next Monday', 'TRUE', 'Đúng - chính sách có hiệu lực thứ Hai tuần sau'],
      [6, 'B. This Friday', 'FALSE', 'Sai - không phải thứ Sáu này'],
      [6, 'C. Next month', 'FALSE', 'Sai - không phải tháng sau'],
      [6, 'D. Next year', 'FALSE', 'Sai - không phải năm sau']
    ];
    const answersSheet = XLSX.utils.aoa_to_sheet(answersData);
    XLSX.utils.book_append_sheet(wb, answersSheet, 'Answers');

    // Generate and download the file
    XLSX.writeFile(wb, 'exam-template-easy-test.xlsx');
  };

  const downloadReadingOnlyTemplate = () => {
    // Create a new workbook for reading-only template
    const wb = XLSX.utils.book_new();

    // Sheet 1: Exam Info
    const examData = [
      ['Title', 'Description', 'Difficulty', 'Duration'],
      ['Reading Test Sample', 'Đề thi Reading test không cần audio', 'Easy', 60]
    ];
    const examSheet = XLSX.utils.aoa_to_sheet(examData);
    XLSX.utils.book_append_sheet(wb, examSheet, 'Exam Info');

    // Sheet 2: Parts - Chỉ reading parts
    const partsData = [
      ['Part No', 'Title', 'Type', 'Time Limit', 'Description'],
      [1, 'Part 5 - Grammar', 'reading', '20 phút', 'Điền từ vào chỗ trống'],
      [2, 'Part 6 - Text Completion', 'reading', '15 phút', 'Hoàn thành đoạn văn'],
      [3, 'Part 7 - Reading Comprehension', 'reading', '25 phút', 'Đọc hiểu đoạn văn']
    ];
    const partsSheet = XLSX.utils.aoa_to_sheet(partsData);
    XLSX.utils.book_append_sheet(wb, partsSheet, 'Parts');

    // Sheet 3: Questions
    const questionsData = [
      ['Question No', 'Part No', 'Content', 'Type'],
      [1, 1, 'The company will _____ a new product next month.', 'multiple_choice'],
      [2, 1, 'Please _____ the report by Friday.', 'multiple_choice'],
      [3, 2, 'The meeting has been _____ to next week.', 'multiple_choice'],
      [4, 2, 'We need to _____ our sales targets this quarter.', 'multiple_choice'],
      [5, 3, 'According to the passage, what is the main purpose?', 'multiple_choice'],
      [6, 3, 'When will the new policy take effect?', 'multiple_choice']
    ];
    const questionsSheet = XLSX.utils.aoa_to_sheet(questionsData);
    XLSX.utils.book_append_sheet(wb, questionsSheet, 'Questions');

    // Sheet 4: Answers
    const answersData = [
      ['Question No', 'Content', 'Is Correct', 'Explanation'],
      // Question 1 answers
      [1, 'A. launch', 'TRUE', 'Đúng - "launch a product" = tung ra sản phẩm'],
      [1, 'B. buy', 'FALSE', 'Sai - không phù hợp ngữ cảnh'],
      [1, 'C. sell', 'FALSE', 'Sai - chưa phù hợp'],
      [1, 'D. make', 'FALSE', 'Sai - không tự nhiên'],

      // Question 2 answers
      [2, 'A. complete', 'TRUE', 'Đúng - "complete the report" = hoàn thành báo cáo'],
      [2, 'B. start', 'FALSE', 'Sai - không phù hợp deadline'],
      [2, 'C. read', 'FALSE', 'Sai - không phù hợp ngữ cảnh'],
      [2, 'D. write', 'FALSE', 'Sai - không chính xác'],

      // Question 3 answers
      [3, 'A. postponed', 'TRUE', 'Đúng - "postponed to" = hoãn lại'],
      [3, 'B. cancelled', 'FALSE', 'Sai - không phải hủy'],
      [3, 'C. advanced', 'FALSE', 'Sai - không phải đưa lên sớm'],
      [3, 'D. repeated', 'FALSE', 'Sai - không phải lặp lại'],

      // Question 4 answers
      [4, 'A. achieve', 'TRUE', 'Đúng - "achieve targets" = đạt mục tiêu'],
      [4, 'B. avoid', 'FALSE', 'Sai - không phải tránh'],
      [4, 'C. ignore', 'FALSE', 'Sai - không phải bỏ qua'],
      [4, 'D. reduce', 'FALSE', 'Sai - không phải giảm'],

      // Question 5 answers
      [5, 'A. To discuss new policies', 'TRUE', 'Đúng - theo đoạn văn, mục đích là thảo luận chính sách mới'],
      [5, 'B. To hire new employees', 'FALSE', 'Sai - không phải tuyển dụng'],
      [5, 'C. To celebrate success', 'FALSE', 'Sai - không phải ăn mừng'],
      [5, 'D. To plan vacation', 'FALSE', 'Sai - không phải lập kế hoạch nghỉ'],

      // Question 6 answers
      [6, 'A. Next Monday', 'TRUE', 'Đúng - chính sách có hiệu lực thứ Hai tuần sau'],
      [6, 'B. This Friday', 'FALSE', 'Sai - không phải thứ Sáu này'],
      [6, 'C. Next month', 'FALSE', 'Sai - không phải tháng sau'],
      [6, 'D. Next year', 'FALSE', 'Sai - không phải năm sau']
    ];
    const answersSheet = XLSX.utils.aoa_to_sheet(answersData);
    XLSX.utils.book_append_sheet(wb, answersSheet, 'Answers');

    // Generate and download the file
    XLSX.writeFile(wb, 'exam-template-reading-only.xlsx');
  };

  return (
    <div className="mb-4 space-y-3">
      <div className="flex space-x-3">
        <button
          onClick={downloadTemplate}
          className="inline-flex items-center px-4 py-2 border border-blue-300 rounded-md shadow-sm text-sm font-medium text-blue-700 bg-blue-50 hover:bg-blue-100"
        >
          <ArrowDownTrayIcon className="h-4 w-4 mr-2" />
          Tải file mẫu (1 listening + 2 reading)
        </button>
        
        <button
          onClick={downloadReadingOnlyTemplate}
          className="inline-flex items-center px-4 py-2 border border-green-300 rounded-md shadow-sm text-sm font-medium text-green-700 bg-green-50 hover:bg-green-100"
        >
          <ArrowDownTrayIcon className="h-4 w-4 mr-2" />
          Tải file mẫu (chỉ reading - dễ test)
        </button>
      </div>
      
      <div className="text-sm text-gray-500 space-y-1">
        <p><strong>Option 1:</strong> File có 1 listening part + 2 reading parts (cần upload 1 file audio cho Part 1)</p>
        <p><strong>Option 2:</strong> File chỉ có reading parts (không cần audio - test nhanh nhất)</p>
      </div>
    </div>
  );
};

export default DownloadTemplate; 