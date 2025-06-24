'use client';

import { useState, useRef } from 'react';
import { 
  CloudArrowUpIcon, 
  MusicalNoteIcon, 
  TrashIcon, 
  PlusIcon
} from '@heroicons/react/24/outline';

interface MusicFile {
  id: string;
  file?: File;
  title: string;
  artist: string;
  duration: string;
  isUploading: boolean;
  uploadProgress: number;
  isValid: boolean;
  error?: string;
  isExisting?: boolean; // To differentiate between existing and new songs
}

export default function AddMusicPage() {
  // Initialize with existing songs
  const [musicFiles, setMusicFiles] = useState<MusicFile[]>([
    {
      id: '1',
      title: 'Blue Boi',
      artist: 'LAKEY INSPIRED',
      duration: '1:36',
      isUploading: false,
      uploadProgress: 100,
      isValid: true,
      isExisting: true
    },
    {
      id: '2',
      title: 'Chill Day',
      artist: 'LAKEY INSPIRED',
      duration: '2:54',
      isUploading: false,
      uploadProgress: 100,
      isValid: true,
      isExisting: true
    },
    {
      id: '3',
      title: 'In My Dreams',
      artist: 'LAKEY INSPIRED',
      duration: '2:30',
      isUploading: false,
      uploadProgress: 100,
      isValid: true,
      isExisting: true
    }
  ]);
  
  const [dragActive, setDragActive] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const supportedFormats = ['mp3', 'wav', 'ogg', 'm4a'];
  const maxFileSize = 50 * 1024 * 1024; // 50MB

  const validateFile = (file: File): { isValid: boolean; error?: string } => {
    const extension = file.name.split('.').pop()?.toLowerCase();
    
    if (!extension || !supportedFormats.includes(extension)) {
      return { 
        isValid: false, 
        error: `Định dạng không hỗ trợ. Chỉ chấp nhận: ${supportedFormats.join(', ')}` 
      };
    }
    
    if (file.size > maxFileSize) {
      return { 
        isValid: false, 
        error: 'File quá lớn. Kích thước tối đa: 50MB' 
      };
    }
    
    return { isValid: true };
  };

  const generateId = () => Math.random().toString(36).substr(2, 9);

  const extractMetadata = (file: File): Promise<{ title: string; artist: string; duration: string }> => {
    return new Promise((resolve) => {
      const audio = new Audio();
      const url = URL.createObjectURL(file);
      
      audio.onloadedmetadata = () => {
        const duration = Math.floor(audio.duration);
        const minutes = Math.floor(duration / 60);
        const seconds = duration % 60;
        const formattedDuration = `${minutes}:${seconds.toString().padStart(2, '0')}`;
        
        // Extract filename without extension as title
        const title = file.name.replace(/\.[^/.]+$/, '');
        
        URL.revokeObjectURL(url);
        resolve({
          title,
          artist: 'Unknown Artist',
          duration: formattedDuration
        });
      };
      
      audio.onerror = () => {
        URL.revokeObjectURL(url);
        resolve({
          title: file.name.replace(/\.[^/.]+$/, ''),
          artist: 'Unknown Artist',
          duration: '0:00'
        });
      };
      
      audio.src = url;
    });
  };

  const handleFiles = async (files: FileList) => {
    const newFiles: MusicFile[] = [];
    
    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      const validation = validateFile(file);
      const metadata = await extractMetadata(file);
      
      const musicFile: MusicFile = {
        id: generateId(),
        file,
        title: metadata.title,
        artist: metadata.artist,
        duration: metadata.duration,
        isUploading: false,
        uploadProgress: 0,
        isValid: validation.isValid,
        error: validation.error,
        isExisting: false
      };
      
      newFiles.push(musicFile);
    }
    
    setMusicFiles(prev => [...prev, ...newFiles]);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragActive(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      handleFiles(e.dataTransfer.files);
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setDragActive(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setDragActive(false);
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      handleFiles(e.target.files);
    }
  };

  const removeFile = (id: string) => {
    setMusicFiles(prev => prev.filter(file => file.id !== id));
  };

  const simulateUpload = async (fileId: string) => {
    const fileIndex = musicFiles.findIndex(f => f.id === fileId);
    if (fileIndex === -1) return;

    // Simulate upload progress
    for (let progress = 0; progress <= 100; progress += 10) {
      await new Promise(resolve => setTimeout(resolve, 200));
      setMusicFiles(prev => 
        prev.map(file => 
          file.id === fileId 
            ? { ...file, uploadProgress: progress, isUploading: true }
            : file
        )
      );
    }

    // Mark as completed
    setMusicFiles(prev => 
      prev.map(file => 
        file.id === fileId 
          ? { ...file, isUploading: false, uploadProgress: 100 }
          : file
      )
    );
  };

  const uploadAll = async () => {
    setIsUploading(true);
    const validFiles = musicFiles.filter(f => f.isValid && f.uploadProgress === 0 && !f.isExisting);
    
    for (const file of validFiles) {
      await simulateUpload(file.id);
    }
    
    setIsUploading(false);
  };

  const validNewFiles = musicFiles.filter(f => f.isValid && !f.isExisting);
  const pendingUploads = validNewFiles.filter(f => f.uploadProgress === 0);

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-blue-100 rounded-lg">
              <MusicalNoteIcon className="w-6 h-6 text-blue-600" />
            </div>
            <div>
              <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">Kho nhạc của tôi</h1>
              <p className="text-gray-600 mt-1">Quản lý thư viện nhạc của bạn</p>
            </div>
          </div>
          
          {/* Add Music Button */}
          <button
            onClick={() => fileInputRef.current?.click()}
            className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            <PlusIcon className="w-5 h-5" />
            <span>Thêm nhạc</span>
          </button>
        </div>
      </div>

      {/* Hidden File Input */}
      <input
        ref={fileInputRef}
        type="file"
        multiple
        accept="audio/*"
        onChange={handleFileSelect}
        className="hidden"
      />

      {/* Upload Progress */}
      {pendingUploads.length > 0 && (
        <div className="mb-6 bg-blue-50 border border-blue-200 rounded-lg p-4">
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-sm font-medium text-blue-900">
              {pendingUploads.length} file chờ tải lên
            </h3>
            <button
              onClick={uploadAll}
              disabled={isUploading}
              className="px-3 py-1 bg-blue-600 text-white text-sm rounded hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              {isUploading ? 'Đang tải...' : 'Tải lên tất cả'}
            </button>
          </div>
          
          {/* Show pending files with progress */}
          <div className="space-y-2">
            {pendingUploads.map((file) => (
              <div key={file.id} className="flex items-center justify-between text-sm">
                <span className="text-gray-700 truncate flex-1 mr-4">{file.title}</span>
                {file.isUploading ? (
                  <div className="flex items-center space-x-2 min-w-[100px]">
                    <div className="w-16 bg-gray-200 rounded-full h-2">
                      <div 
                        className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                        style={{ width: `${file.uploadProgress}%` }}
                      />
                    </div>
                    <span className="text-xs text-gray-500">{file.uploadProgress}%</span>
                  </div>
                ) : (
                  <span className="text-gray-500 text-xs">Chờ tải lên</span>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Music Table */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-200 bg-gray-50">
          <h2 className="text-lg font-semibold text-gray-900">
            Danh sách nhạc ({musicFiles.length})
          </h2>
        </div>

        {musicFiles.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-16">
                    STT
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Tên bài hát
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-32">
                    Thời lượng
                  </th>
                  <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider w-32">
                    Xóa bài hát
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {musicFiles.map((musicFile, index) => (
                  <tr key={musicFile.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {index + 1}
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center space-x-3">
                        <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                          musicFile.uploadProgress === 100 
                            ? 'bg-green-100' 
                            : musicFile.isUploading 
                            ? 'bg-blue-100' 
                            : musicFile.isValid 
                            ? 'bg-gray-100' 
                            : 'bg-red-100'
                        }`}>
                          <MusicalNoteIcon className={`w-4 h-4 ${
                            musicFile.uploadProgress === 100 
                              ? 'text-green-600' 
                              : musicFile.isUploading 
                              ? 'text-blue-600' 
                              : musicFile.isValid 
                              ? 'text-gray-600' 
                              : 'text-red-600'
                          }`} />
                        </div>
                        <div>
                          <div className="text-sm font-medium text-gray-900">
                            {musicFile.title}
                          </div>
                          {musicFile.artist && (
                            <div className="text-sm text-gray-500">
                              {musicFile.artist}
                            </div>
                          )}
                          {!musicFile.isValid && musicFile.error && (
                            <div className="text-xs text-red-600 mt-1">
                              {musicFile.error}
                            </div>
                          )}
                          {musicFile.isUploading && (
                            <div className="mt-2">
                              <div className="w-40 bg-gray-200 rounded-full h-1.5">
                                <div 
                                  className="bg-blue-600 h-1.5 rounded-full transition-all duration-300"
                                  style={{ width: `${musicFile.uploadProgress}%` }}
                                />
                              </div>
                            </div>
                          )}
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {musicFile.duration}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-center">
                      <button
                        onClick={() => removeFile(musicFile.id)}
                        className="inline-flex items-center justify-center w-8 h-8 bg-red-100 hover:bg-red-200 text-red-600 rounded-full transition-colors"
                        title="Xóa bài hát"
                      >
                        <TrashIcon className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="text-center py-12">
            <MusicalNoteIcon className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">Chưa có bài hát nào</h3>
            <p className="text-gray-500 mb-4">Thêm nhạc để bắt đầu xây dựng thư viện của bạn</p>
            <button
              onClick={() => fileInputRef.current?.click()}
              className="inline-flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              <PlusIcon className="w-5 h-5" />
              <span>Thêm nhạc đầu tiên</span>
            </button>
          </div>
        )}
      </div>

      {/* Alternative Upload Area (Drag & Drop) */}
      <div className="mt-8">
        <div
          className={`relative border-2 border-dashed rounded-xl p-6 text-center transition-all duration-200 ${
            dragActive
              ? 'border-blue-500 bg-blue-50'
              : 'border-gray-300 hover:border-gray-400'
          }`}
          onDrop={handleDrop}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
        >
          <input
            type="file"
            multiple
            accept="audio/*"
            onChange={handleFileSelect}
            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
          />
          
          <CloudArrowUpIcon className="w-12 h-12 text-gray-400 mx-auto mb-3" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">
            Hoặc kéo thả file nhạc vào đây
          </h3>
          <p className="text-sm text-gray-500">
            Hỗ trợ: {supportedFormats.join(', ')} • Tối đa 50MB/file
          </p>
        </div>
      </div>
    </div>
  );
} 