import React from 'react';
import { ExamInfo, ExamPart, ExamQuestion, ExamAnswer } from '@/types/exam';
import AudioUploadField from './AudioUploadField';

interface TableColumn {
  key: string;
  label: string;
  render?: (value: any, row: any, index: number) => React.ReactNode;
}

interface TablePreviewProps {
  data: any[];
  columns: TableColumn[];
  title: string;
  audioFiles?: Record<number, File>;
  onAudioFileSelect?: (partNumber: number, file: File | null) => void;
}

const TablePreview: React.FC<TablePreviewProps> = ({
  data,
  columns,
  title,
  audioFiles,
  onAudioFileSelect,
}) => {
  if (!data || data.length === 0) {
    return (
      <div className="text-center py-8 text-gray-500">
        <p>Không có dữ liệu để hiển thị</p>
      </div>
    );
  }

  return (
    <div className="bg-white">
      <div className="mb-4">
        <h3 className="text-lg font-medium text-gray-900">{title}</h3>
        <p className="text-sm text-gray-500">{data.length} mục</p>
      </div>
      
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              {columns.map((column) => (
                <th
                  key={column.key}
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  {column.label}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {data.map((row, index) => (
              <tr key={index} className="hover:bg-gray-50">
                {columns.map((column) => (
                  <td key={column.key} className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {column.render
                      ? column.render(row[column.key], row, index)
                      : row[column.key]
                    }
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

// Predefined column configurations for different data types
export const examColumns: TableColumn[] = [
  { key: 'title', label: 'Tiêu đề' },
  { key: 'description', label: 'Mô tả' },
  { 
    key: 'difficulty', 
    label: 'Độ khó',
    render: (value) => (
      <span className={`px-2 py-1 rounded-full text-xs font-medium ${
        value === 'easy' ? 'bg-green-100 text-green-800' :
        value === 'medium' ? 'bg-yellow-100 text-yellow-800' :
        'bg-red-100 text-red-800'
      }`}>
        {value === 'easy' ? 'Dễ' : value === 'medium' ? 'Trung bình' : 'Khó'}
      </span>
    )
  },
  { 
    key: 'estimated_time', 
    label: 'Thời gian (phút)' 
  },
];

export const createPartsColumns = (
  audioFiles?: Record<number, File>,
  onAudioFileSelect?: (partNumber: number, file: File | null) => void
): TableColumn[] => [
  { key: 'part_number', label: 'Số phần' },
  { key: 'title', label: 'Tiêu đề' },
  { 
    key: 'type', 
    label: 'Loại',
    render: (value) => (
      <span className={`px-2 py-1 rounded-full text-xs font-medium ${
        value === 'listening' ? 'bg-blue-100 text-blue-800' : 'bg-purple-100 text-purple-800'
      }`}>
        {value === 'listening' ? 'Nghe' : 'Đọc'}
      </span>
    )
  },
  { 
    key: 'time_limit', 
    label: 'Thời gian (giây)',
    render: (value) => `${Math.floor(value / 60)}:${String(value % 60).padStart(2, '0')}`
  },
  {
    key: 'audio_file',
    label: 'File Audio',
    render: (_, row) => {
      if (row.type !== 'listening') return <span className="text-gray-400">-</span>;
      
      return onAudioFileSelect ? (
        <AudioUploadField
          partNumber={row.part_number}
          selectedFile={audioFiles?.[row.part_number]}
          onFileSelect={onAudioFileSelect}
        />
      ) : (
        <span className="text-gray-500">Cần upload</span>
      );
    }
  },
];

export const questionsColumns: TableColumn[] = [
  { key: 'question_number', label: 'Số câu' },
  { key: 'part_number', label: 'Phần' },
  { 
    key: 'content', 
    label: 'Nội dung',
    render: (value) => (
      <div className="max-w-md truncate" title={value}>
        {value}
      </div>
    )
  },
  { 
    key: 'question_type', 
    label: 'Loại câu hỏi',
    render: (value) => (
      <span className="px-2 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
        {value === 'multiple_choice' ? 'Trắc nghiệm' : 
         value === 'fill_blank' ? 'Điền từ' : 'Tự luận'}
      </span>
    )
  },
];

export const answersColumns: TableColumn[] = [
  { key: 'question_number', label: 'Câu số' },
  { 
    key: 'content', 
    label: 'Nội dung đáp án',
    render: (value) => (
      <div className="max-w-md truncate" title={value}>
        {value}
      </div>
    )
  },
  { 
    key: 'is_correct', 
    label: 'Đúng?',
    render: (value) => value ? (
      <span className="text-green-600 font-bold">✓</span>
    ) : (
      <span className="text-red-600 font-bold">✗</span>
    )
  },
  { 
    key: 'explanation', 
    label: 'Giải thích',
    render: (value) => value ? (
      <div className="max-w-md truncate" title={value}>
        {value}
      </div>
    ) : (
      <span className="text-gray-400">-</span>
    )
  },
];

export default TablePreview; 