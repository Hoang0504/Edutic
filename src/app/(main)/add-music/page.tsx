'use client';

import { useState, useRef, useEffect } from 'react';
import { 
  CloudArrowUpIcon, 
  MusicalNoteIcon, 
  CheckCircleIcon,
  ExclamationCircleIcon,
  TrashIcon
} from '@heroicons/react/24/outline';

interface FormData {
  title: string;
  file: File | null;
  duration: number; // in seconds
}

interface FormErrors {
  title?: string;
  file?: string;
}

interface ExistingMusic {
  id: string;
  title: string;
  artist: string;
  duration: string;
  fileUrl: string;
  source: 'public' | 'upload';
}

export default function AddMusicPage() {
  const [formData, setFormData] = useState<FormData>({
    title: '',
    file: null,
    duration: 0
  });
  
  const [errors, setErrors] = useState<FormErrors>({});
  const [isUploading, setIsUploading] = useState(false);
  const [uploadSuccess, setUploadSuccess] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Existing music list
  const [existingMusic, setExistingMusic] = useState<ExistingMusic[]>([]);
  const [loadingMusic, setLoadingMusic] = useState(true);

  // Load existing music from API
  useEffect(() => {
    const fetchMusic = async () => {
      try {
        const response = await fetch('/api/music');
        const data = await response.json();
        if (data.music) {
          setExistingMusic(data.music);
        }
      } catch (error) {
        console.error('Error fetching music:', error);
      } finally {
        setLoadingMusic(false);
      }
    };

    fetchMusic();
  }, []);

  const validateTitle = (title: string): string | undefined => {
    if (title.length < 3) {
      return 'Tiêu đề phải có ít nhất 3 ký tự';
    }
    if (title.length > 100) {
      return 'Tiêu đề không được vượt quá 100 ký tự';
    }
    return undefined;
  };

  const validateFile = (file: File | null): string | undefined => {
    if (!file) {
      return 'Vui lòng chọn file nhạc';
    }
    
    const extension = file.name.split('.').pop()?.toLowerCase();
    if (extension !== 'mp3') {
      return 'Chỉ chấp nhận file .mp3';
    }
    
    return undefined;
  };

  const extractDuration = (file: File): Promise<number> => {
    return new Promise((resolve, reject) => {
      const audio = new Audio();
      const url = URL.createObjectURL(file);
      
      audio.onloadedmetadata = () => {
        const duration = Math.floor(audio.duration) || 0;
        URL.revokeObjectURL(url);
        resolve(duration);
      };
      
      audio.onerror = () => {
        URL.revokeObjectURL(url);
        reject(new Error('Không thể đọc file âm thanh'));
      };
      
      audio.src = url;
    });
  };

  const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const title = e.target.value;
    setFormData(prev => ({ ...prev, title }));
    
    // Clear error when user starts typing
    if (errors.title) {
      setErrors(prev => ({ ...prev, title: undefined }));
    }
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null;
    
    if (file) {
      try {
        const duration = await extractDuration(file);
        setFormData(prev => ({ 
          ...prev, 
          file, 
          duration 
        }));
        
        // Clear file error
        if (errors.file) {
          setErrors(prev => ({ ...prev, file: undefined }));
        }
      } catch (error) {
        setErrors(prev => ({ 
          ...prev, 
          file: 'File âm thanh không hợp lệ' 
        }));
        setFormData(prev => ({ 
          ...prev, 
          file: null, 
          duration: 0 
        }));
      }
    } else {
      setFormData(prev => ({ 
        ...prev, 
        file: null, 
        duration: 0 
      }));
    }
  };

  const formatDuration = (seconds: number): string => {
    if (seconds === 0) return '0:00';
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const removeMusic = async (id: string) => {
    try {
      const music = existingMusic.find(m => m.id === id);
      if (!music || music.source !== 'upload') {
        return;
      }

      // Extract filename from fileUrl
      const filename = music.fileUrl.split('/').pop();
      if (!filename) {
        return;
      }

      const response = await fetch(`/api/delete-music?filename=${encodeURIComponent(filename)}`, {
        method: 'DELETE'
      });

      if (response.ok) {
        // Refresh music list from server
        const musicResponse = await fetch('/api/music');
        const musicData = await musicResponse.json();
        if (musicData.music) {
          setExistingMusic(musicData.music);
        }
      } else {
        const error = await response.json();
        console.error('Failed to delete music:', error.error);
      }
    } catch (error) {
      console.error('Error deleting music:', error);
    }
  };

  const generateId = () => Math.random().toString(36).substr(2, 9);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate form
    const titleError = validateTitle(formData.title);
    const fileError = validateFile(formData.file);
    
    if (titleError || fileError) {
      setErrors({
        title: titleError,
        file: fileError
      });
      return;
    }

    setIsUploading(true);
    setUploadSuccess(false);
    
    try {
      // Upload file to server
      const formDataToSend = new FormData();
      formDataToSend.append('file', formData.file!);
      formDataToSend.append('title', formData.title);

      const response = await fetch('/api/upload-music', {
        method: 'POST',
        body: formDataToSend
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || 'Upload failed');
      }
      
      setUploadSuccess(true);
      
      // Refresh music list from server
      const musicResponse = await fetch('/api/music');
      const musicData = await musicResponse.json();
      if (musicData.music) {
        setExistingMusic(musicData.music);
      }
      
      // Reset form
      setFormData({
        title: '',
        file: null,
        duration: 0
      });
      
      // Reset file input
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
      
    } catch (error) {
      console.error('Upload failed:', error);
      setErrors({
        file: error instanceof Error ? error.message : 'Lỗi khi upload file'
      });
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center space-x-3 mb-4">
          <div className="p-2 bg-blue-100 rounded-lg">
            <MusicalNoteIcon className="w-6 h-6 text-blue-600" />
          </div>
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">Thêm nhạc mới</h1>
            <p className="text-gray-600 mt-1">Tải lên nhạc học tập của bạn</p>
          </div>
        </div>
      </div>

      {/* Success Message */}
      {uploadSuccess && (
        <div className="mb-6 bg-green-50 border border-green-200 rounded-lg p-4 flex items-center space-x-3">
          <CheckCircleIcon className="w-5 h-5 text-green-600 flex-shrink-0" />
          <p className="text-green-800">Tải lên nhạc thành công!</p>
        </div>
      )}

      {/* Form */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {/* Title Input */}
          <div>
            <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-2">
              Tiêu đề bài hát <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              id="title"
              value={formData.title}
              onChange={handleTitleChange}
              className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors ${
                errors.title ? 'border-red-300' : 'border-gray-300'
              }`}
              placeholder="Nhập tiêu đề bài hát (3-100 ký tự)"
              maxLength={100}
            />
            {errors.title && (
              <div className="mt-1 flex items-center space-x-1 text-red-600 text-sm">
                <ExclamationCircleIcon className="w-4 h-4" />
                <span>{errors.title}</span>
              </div>
            )}
            <div className="mt-1 text-xs text-gray-500">
              {formData.title.length}/100 ký tự
            </div>
          </div>

          {/* File Input */}
          <div>
            <label htmlFor="file" className="block text-sm font-medium text-gray-700 mb-2">
              File nhạc (.mp3) <span className="text-red-500">*</span>
            </label>
            <div className="relative">
              <input
                ref={fileInputRef}
                type="file"
                id="file"
                accept=".mp3,audio/mp3"
                onChange={handleFileChange}
                className="hidden"
              />
              <div
                onClick={() => fileInputRef.current?.click()}
                className={`w-full border-2 border-dashed rounded-lg p-6 text-center cursor-pointer transition-colors hover:border-blue-400 hover:bg-blue-50 ${
                  errors.file ? 'border-red-300 bg-red-50' : formData.file ? 'border-green-300 bg-green-50' : 'border-gray-300'
                }`}
              >
                {formData.file ? (
                  <div className="space-y-2">
                    <CheckCircleIcon className="w-8 h-8 text-green-600 mx-auto" />
                    <p className="text-green-800 font-medium">{formData.file.name}</p>
                    <p className="text-sm text-green-600">
                      Kích thước: {(formData.file.size / 1024 / 1024).toFixed(2)} MB
                    </p>
                  </div>
                ) : (
                  <div className="space-y-2">
                    <CloudArrowUpIcon className="w-8 h-8 text-gray-400 mx-auto" />
                    <p className="text-gray-600">Click để chọn file .mp3</p>
                    <p className="text-sm text-gray-500">Chỉ chấp nhận file .mp3</p>
                  </div>
                )}
              </div>
            </div>
            {errors.file && (
              <div className="mt-1 flex items-center space-x-1 text-red-600 text-sm">
                <ExclamationCircleIcon className="w-4 h-4" />
                <span>{errors.file}</span>
              </div>
            )}
          </div>

          {/* Duration Input (Read-only) */}
          <div>
            <label htmlFor="duration" className="block text-sm font-medium text-gray-700 mb-2">
              Thời lượng
            </label>
            <div className="relative">
              <input
                type="text"
                id="duration"
                value={`${formData.duration} giây (${formatDuration(formData.duration)})`}
                readOnly
                className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-gray-50 text-gray-700 cursor-not-allowed"
                placeholder="Tự động tính khi tải file"
              />
              <div className="absolute inset-y-0 right-0 flex items-center pr-3">
                <MusicalNoteIcon className="w-4 h-4 text-gray-400" />
              </div>
            </div>
            <div className="mt-1 text-xs text-gray-500">
              Thời lượng sẽ được tự động tính khi bạn tải file lên
            </div>
          </div>

          {/* Submit Button */}
          <div className="flex justify-end pt-4">
            <button
              type="submit"
              disabled={isUploading || !formData.title || !formData.file}
              className="px-6 py-2 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              {isUploading ? (
                <div className="flex items-center space-x-2">
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  <span>Đang tải lên...</span>
                </div>
              ) : (
                'Thêm nhạc'
              )}
            </button>
          </div>
        </form>
      </div>

      {/* Instructions */}
      <div className="mt-6 bg-blue-50 border border-blue-200 rounded-lg p-4">
        <h3 className="font-medium text-blue-900 mb-2">Hướng dẫn:</h3>
        <ul className="text-blue-800 text-sm space-y-1">
          <li>• Tiêu đề phải có từ 3-100 ký tự</li>
          <li>• Chỉ chấp nhận file .mp3</li>
          <li>• Thời lượng sẽ được tự động tính toán</li>
          <li>• File nhạc sẽ được sử dụng trong chế độ Pomodoro</li>
        </ul>
      </div>

      {/* Existing Music Table */}
      <div className="mt-8 bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-200 bg-gray-50">
          <h2 className="text-lg font-semibold text-gray-900">
            Kho nhạc hiện có {!loadingMusic && `(${existingMusic.length})`}
          </h2>
        </div>

        {loadingMusic ? (
          <div className="text-center py-12">
            <div className="w-8 h-8 border-2 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
            <p className="text-gray-500">Đang tải danh sách nhạc...</p>
          </div>
        ) : existingMusic.length > 0 ? (
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
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-24">
                    Nguồn
                  </th>
                  <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider w-32">
                    Thao tác
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {existingMusic.map((music, index) => (
                  <tr key={music.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {index + 1}
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center space-x-3">
                        <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                          music.source === 'public' ? 'bg-blue-100' : 'bg-green-100'
                        }`}>
                          <MusicalNoteIcon className={`w-4 h-4 ${
                            music.source === 'public' ? 'text-blue-600' : 'text-green-600'
                          }`} />
                        </div>
                        <div>
                          <div className="text-sm font-medium text-gray-900">
                            {music.title}
                          </div>
                          <div className="text-sm text-gray-500">
                            {music.artist}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {music.duration}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {music.source === 'public' ? 'Công khai' : 'Từ tải lên'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-center">
                      {music.source === 'upload' ? (
                        <button
                          onClick={() => removeMusic(music.id)}
                          className="inline-flex items-center justify-center w-8 h-8 bg-red-100 hover:bg-red-200 text-red-600 rounded-full transition-colors"
                          title="Xóa bài hát"
                        >
                          <TrashIcon className="w-4 h-4" />
                        </button>
                      ) : (
                        <span className="text-gray-400 text-sm">Không thể xóa</span>
                      )}
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
            <p className="text-gray-500">Thêm nhạc để bắt đầu xây dựng thư viện của bạn</p>
          </div>
        )}
      </div>
    </div>
  );
} 