import React, { useRef } from 'react';
import { CloudArrowUpIcon, XMarkIcon, MusicalNoteIcon } from '@heroicons/react/24/outline';

interface AudioUploadFieldProps {
  partNumber: number;
  selectedFile?: File;
  onFileSelect: (partNumber: number, file: File | null) => void;
}

const AudioUploadField: React.FC<AudioUploadFieldProps> = ({
  partNumber,
  selectedFile,
  onFileSelect,
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0] || null;
    if (file) {
      // Validate file type
      if (!file.type.startsWith('audio/')) {
        alert('Vui lòng chọn file audio (.mp3, .wav, .m4a)');
        return;
      }
      // Validate file size (max 10MB)
      if (file.size > 10 * 1024 * 1024) {
        alert('File audio không được vượt quá 10MB');
        return;
      }
    }
    onFileSelect(partNumber, file);
    
    // Reset input value to allow selecting the same file again
    if (event.target) {
      event.target.value = '';
    }
  };

  const handleRemoveFile = () => {
    onFileSelect(partNumber, null);
  };

  const handleButtonClick = () => {
    fileInputRef.current?.click();
  };

  return (
    <div className="flex items-center space-x-2">
      {!selectedFile ? (
        <button
          type="button"
          onClick={handleButtonClick}
          className="inline-flex items-center px-3 py-1.5 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
        >
          <CloudArrowUpIcon className="h-4 w-4 mr-1" />
          Chọn file
        </button>
      ) : (
        <div className="flex items-center space-x-2 bg-green-50 border border-green-200 rounded-md px-3 py-1.5">
          <MusicalNoteIcon className="h-4 w-4 text-green-600" />
          <span className="text-sm text-green-800 truncate max-w-[150px]" title={selectedFile.name}>
            {selectedFile.name}
          </span>
          <button
            type="button"
            onClick={handleRemoveFile}
            className="text-green-600 hover:text-green-800"
          >
            <XMarkIcon className="h-4 w-4" />
          </button>
        </div>
      )}
      
      <input
        ref={fileInputRef}
        type="file"
        accept="audio/*"
        onChange={handleFileSelect}
        className="hidden"
      />
      
      {selectedFile && (
        <button
          type="button"
          onClick={handleButtonClick}
          className="text-sm text-blue-600 hover:text-blue-800"
        >
          Đổi file
        </button>
      )}
    </div>
  );
};

export default AudioUploadField; 