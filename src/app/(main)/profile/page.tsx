'use client';

import { useState, useRef } from 'react';
import Image from 'next/image';
import {
  PencilIcon,
  UserIcon,
  CameraIcon,
  CheckCircleIcon,
  XCircleIcon,
  ArrowPathIcon
} from '@heroicons/react/24/outline';

type TabType = 'personal' | 'learning';
type StatisticsTabType = 'results' | 'attendance';

interface PersonalInfo {
  email: string;
  displayName: string;
  avatar: string | null;
  accountType: 'student' | 'admin';
  emailVerified: boolean;
}

interface LearningSettings {
  targetScores: {
    listening: number;
    reading: number;
    speaking: number;
    writing: number;
  };
  studyTimePerDay: number;
  currentLevel: {
    listeningReading: 'beginner' | 'intermediate' | 'advanced';
    speakingWriting: 'beginner' | 'intermediate' | 'advanced';
  };
}

interface FormErrors {
  displayName?: string;
  listening?: string;
  reading?: string;
  speaking?: string;
  writing?: string;
  studyTime?: string;
}

export default function ProfilePage() {
  const [activeTab, setActiveTab] = useState<TabType>('personal');
  const [activeStatsTab, setActiveStatsTab] = useState<StatisticsTabType>('results');
  const [isEditing, setIsEditing] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState<FormErrors>({});
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Mock data - trong thực tế sẽ fetch từ API
  const [personalInfo, setPersonalInfo] = useState<PersonalInfo>({
    email: 'user@example.com',
    displayName: 'Nguyễn Văn A',
    avatar: null,
    accountType: 'student',
    emailVerified: true
  });

  const [learningSettings, setLearningSettings] = useState<LearningSettings>({
    targetScores: {
      listening: 450,
      reading: 450,
      speaking: 150,
      writing: 150
    },
    studyTimePerDay: 120,
    currentLevel: {
      listeningReading: 'intermediate',
      speakingWriting: 'beginner'
    }
  });

  const validatePersonalInfo = (): boolean => {
    const newErrors: FormErrors = {};
    
    // Validate display name
    if (!personalInfo.displayName.trim()) {
      newErrors.displayName = 'Tên hiển thị không được để trống';
    } else if (personalInfo.displayName.trim().length < 2) {
      newErrors.displayName = 'Tên hiển thị phải có ít nhất 2 ký tự';
    } else if (personalInfo.displayName.trim().length > 50) {
      newErrors.displayName = 'Tên hiển thị không được quá 50 ký tự';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const validateLearningSettings = (): boolean => {
    const newErrors: FormErrors = {};
    const { listening, reading, speaking, writing } = learningSettings.targetScores;
    
    // Validate listening score
    if (isNaN(listening)) {
      newErrors.listening = 'Điểm nghe phải là một số';
    } else if (listening < 0) {
      newErrors.listening = 'Điểm nghe không được nhỏ hơn 0';
    } else if (listening > 495) {
      newErrors.listening = 'Điểm nghe không được vượt quá 495';
    }
    
    // Validate reading score
    if (isNaN(reading)) {
      newErrors.reading = 'Điểm đọc phải là một số';
    } else if (reading < 0) {
      newErrors.reading = 'Điểm đọc không được nhỏ hơn 0';
    } else if (reading > 495) {
      newErrors.reading = 'Điểm đọc không được vượt quá 495';
    }
    
    // Validate speaking score
    if (isNaN(speaking)) {
      newErrors.speaking = 'Điểm nói phải là một số';
    } else if (speaking < 0) {
      newErrors.speaking = 'Điểm nói không được nhỏ hơn 0';
    } else if (speaking > 200) {
      newErrors.speaking = 'Điểm nói không được vượt quá 200';
    }
    
    // Validate writing score
    if (isNaN(writing)) {
      newErrors.writing = 'Điểm viết phải là một số';
    } else if (writing < 0) {
      newErrors.writing = 'Điểm viết không được nhỏ hơn 0';
    } else if (writing > 200) {
      newErrors.writing = 'Điểm viết không được vượt quá 200';
    }

    // Validate study time
    if (isNaN(learningSettings.studyTimePerDay)) {
      newErrors.studyTime = 'Thời gian học phải là một số';
    } else if (learningSettings.studyTimePerDay < 0) {
      newErrors.studyTime = 'Thời gian học phải lớn hơn 0';
    } else if (learningSettings.studyTimePerDay > 1440) {
      newErrors.studyTime = 'Thời gian học không được vượt quá 1440 phút (24 giờ)';
    }

    // Validate that at least one skill target is set (greater than 0)
    if (listening === 0 && reading === 0 && speaking === 0 && writing === 0) {
      newErrors.listening = 'Vui lòng nhập ít nhất một mục tiêu điểm số lớn hơn 0';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Real-time validation functions
  const validateDisplayNameOnChange = (value: string) => {
    const newErrors = { ...errors };
    
    if (!value.trim()) {
      newErrors.displayName = 'Tên hiển thị không được để trống';
    } else if (value.trim().length < 2) {
      newErrors.displayName = 'Tên hiển thị phải có ít nhất 2 ký tự';
    } else if (value.trim().length > 50) {
      newErrors.displayName = 'Tên hiển thị không được quá 50 ký tự';
    } else {
      delete newErrors.displayName;
    }
    
    setErrors(newErrors);
  };

  const validateScoreOnChange = (field: string, value: number, max: number) => {
    const newErrors = { ...errors };
    
    if (isNaN(value)) {
      newErrors[field as keyof FormErrors] = `Điểm ${field === 'listening' ? 'nghe' : field === 'reading' ? 'đọc' : field === 'speaking' ? 'nói' : 'viết'} phải là một số`;
    } else if (value < 0) {
      newErrors[field as keyof FormErrors] = `Điểm ${field === 'listening' ? 'nghe' : field === 'reading' ? 'đọc' : field === 'speaking' ? 'nói' : 'viết'} không được nhỏ hơn 0`;
    } else if (value > max) {
      newErrors[field as keyof FormErrors] = `Điểm ${field === 'listening' ? 'nghe' : field === 'reading' ? 'đọc' : field === 'speaking' ? 'nói' : 'viết'} không được vượt quá ${max}`;
    } else {
      delete newErrors[field as keyof FormErrors];
    }
    
    setErrors(newErrors);
  };

  const validateStudyTimeOnChange = (value: number) => {
    const newErrors = { ...errors };
    
    if (isNaN(value)) {
      newErrors.studyTime = 'Thời gian học phải là một số';
    } else if (value < 0) {
      newErrors.studyTime = 'Thời gian học phải lớn hơn 0';
    } else if (value > 1440) {
      newErrors.studyTime = 'Thời gian học không được vượt quá 1440 phút (24 giờ)';
    } else {
      delete newErrors.studyTime;
    }
    
    setErrors(newErrors);
  };

  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setPersonalInfo(prev => ({
          ...prev,
          avatar: e.target?.result as string
        }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSavePersonalInfo = async () => {
    if (!validatePersonalInfo()) return;
    
    setIsLoading(true);
    try {
      // API call to save personal info
      await new Promise(resolve => setTimeout(resolve, 1000)); // Mock API call
      setIsEditing(false);
      alert('Thông tin cá nhân đã được cập nhật thành công!');
    } catch (error) {
      alert('Có lỗi xảy ra khi cập nhật thông tin!');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSaveLearningSettings = async () => {
    if (!validateLearningSettings()) return;
    
    setIsLoading(true);
    try {
      // API call to save learning settings
      await new Promise(resolve => setTimeout(resolve, 1000)); // Mock API call
      alert('Thiết lập học tập đã được cập nhật thành công!');
    } catch (error) {
      alert('Có lỗi xảy ra khi cập nhật thiết lập!');
    } finally {
      setIsLoading(false);
    }
  };

  const handleResendVerification = async () => {
    setIsLoading(true);
    try {
      // API call to resend verification email
      await new Promise(resolve => setTimeout(resolve, 1000)); // Mock API call
      alert('Email xác thực đã được gửi lại!');
    } catch (error) {
      alert('Có lỗi xảy ra khi gửi email xác thực!');
    } finally {
      setIsLoading(false);
    }
  };

  const getLevelText = (level: string) => {
    switch (level) {
      case 'beginner': return 'Bắt đầu';
      case 'intermediate': return 'Khá';
      case 'advanced': return 'Xuất sắc';
      default: return 'Bắt đầu';
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-4 sm:py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6">
        {/* Combined Profile Container */}
        <div className="bg-white rounded-lg shadow-sm">
          {/* Header Section */}
          <div className="p-4 sm:p-6 border-b border-gray-200">
            <div className="flex flex-col items-center gap-4 sm:gap-6">
              {/* Avatar */}
              <div className="relative">
                <div className="w-24 h-24 sm:w-32 sm:h-32 rounded-full overflow-hidden bg-gray-200 border-4 border-gray-300">
                  {personalInfo.avatar ? (
                    <Image
                      src={personalInfo.avatar}
                      alt="Avatar"
                      width={128}
                      height={128}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-gray-400">
                      <UserIcon className="w-12 h-12 sm:w-16 sm:h-16" />
                    </div>
                  )}
                </div>
                
                {/* Edit Button - Small button next to avatar */}
                <button
                  onClick={() => setIsEditing(!isEditing)}
                  className={`absolute -bottom-2 -right-2 w-10 h-10 rounded-full flex items-center justify-center shadow-lg transition-colors ${
                    isEditing 
                      ? 'bg-gray-500 text-white hover:bg-gray-600' 
                      : 'bg-blue-500 text-white hover:bg-blue-600'
                  }`}
                  title={isEditing ? 'Hủy chỉnh sửa' : 'Chỉnh sửa thông tin'}
                >
                  <PencilIcon className="w-5 h-5" />
                </button>

                {/* Camera button for avatar upload - only show when editing */}
                {isEditing && (
                  <button
                    onClick={() => fileInputRef.current?.click()}
                    className="absolute -top-2 -right-2 w-8 h-8 bg-green-500 text-white rounded-full flex items-center justify-center hover:bg-green-600 transition-colors shadow-lg"
                    title="Thay đổi ảnh đại diện"
                  >
                    <CameraIcon className="w-4 h-4" />
                  </button>
                )}
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  onChange={handleAvatarChange}
                  className="hidden"
                />
              </div>

              {/* Name and Details - Centered */}
              <div className="text-center">
                <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2">
                  {personalInfo.displayName}
                </h1>
                <p className="text-gray-600 text-lg">{personalInfo.email}</p>
                <p className="text-sm text-gray-500 mt-1">
                  {personalInfo.accountType === 'student' ? 'Học viên' : 'Quản trị viên'}
                </p>
              </div>
            </div>
          </div>

          {/* Tabs */}
          <div className="border-b border-gray-200">
            <nav className="flex">
              <button
                onClick={() => setActiveTab('personal')}
                className={`flex-1 px-4 sm:px-6 py-3 sm:py-4 text-sm sm:text-base font-medium border-b-2 transition-colors ${
                  activeTab === 'personal'
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700'
                }`}
              >
                Thông tin cá nhân
              </button>
              <button
                onClick={() => setActiveTab('learning')}
                className={`flex-1 px-4 sm:px-6 py-3 sm:py-4 text-sm sm:text-base font-medium border-b-2 transition-colors ${
                  activeTab === 'learning'
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700'
                }`}
              >
                Thiết lập học tập
              </button>
            </nav>
          </div>

          <div className="p-4 sm:p-6">
            {activeTab === 'personal' ? (
              <div className="space-y-6">
                {!isEditing ? (
                  // View Mode - Display information only
                  <div className="space-y-4">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                      <div>
                        <h3 className="text-sm font-medium text-gray-500 mb-1">Email</h3>
                        <p className="text-lg text-gray-900">{personalInfo.email}</p>
                      </div>
                      <div>
                        <h3 className="text-sm font-medium text-gray-500 mb-1">Tên hiển thị</h3>
                        <p className="text-lg text-gray-900">{personalInfo.displayName}</p>
                      </div>
                      <div>
                        <h3 className="text-sm font-medium text-gray-500 mb-1">Loại tài khoản</h3>
                        <p className="text-lg text-gray-900">
                          {personalInfo.accountType === 'student' ? 'Học viên' : 'Quản trị viên'}
                        </p>
                      </div>
                      <div>
                        <h3 className="text-sm font-medium text-gray-500 mb-1">Trạng thái xác thực</h3>
                        <div className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-sm font-medium ${
                          personalInfo.emailVerified 
                            ? 'bg-green-100 text-green-800' 
                            : 'bg-red-100 text-red-800'
                        }`}>
                          {personalInfo.emailVerified ? (
                            <CheckCircleIcon className="w-4 h-4" />
                          ) : (
                            <XCircleIcon className="w-4 h-4" />
                          )}
                          {personalInfo.emailVerified ? 'Đã xác minh' : 'Chưa xác minh'}
                        </div>
                      </div>
                    </div>
                  </div>
                ) : (
                  // Edit Mode - Show forms
                  <div className="space-y-6">
                    {/* Email */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Email
                      </label>
                      <input
                        type="email"
                        value={personalInfo.email}
                        readOnly
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-gray-50 text-gray-500 cursor-not-allowed"
                      />
                    </div>

                    {/* Display Name */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Tên hiển thị *
                      </label>
                      <input
                        type="text"
                        value={personalInfo.displayName}
                        onChange={(e) => {
                          setPersonalInfo(prev => ({ ...prev, displayName: e.target.value }));
                          validateDisplayNameOnChange(e.target.value);
                        }}
                        className={`w-full px-3 py-2 border rounded-lg focus:border-blue-500 focus:ring-2 focus:ring-blue-200 text-black ${
                          errors.displayName ? 'border-red-500' : 'border-gray-300'
                        }`}
                        placeholder="Nhập tên hiển thị"
                      />
                      {errors.displayName && (
                        <p className="mt-1 text-sm text-red-500">{errors.displayName}</p>
                      )}
                    </div>

                    {/* Account Type */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Loại tài khoản
                      </label>
                      <input
                        type="text"
                        value={personalInfo.accountType === 'student' ? 'Học viên' : 'Quản trị viên'}
                        readOnly
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-gray-50 text-gray-500 cursor-not-allowed"
                      />
                    </div>

                    {/* Email Verification */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Xác thực email
                      </label>
                      <div className="flex items-center gap-3">
                        <div className={`flex items-center gap-2 px-3 py-2 rounded-lg ${
                          personalInfo.emailVerified ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-700'
                        }`}>
                          {personalInfo.emailVerified ? (
                            <CheckCircleIcon className="w-5 h-5" />
                          ) : (
                            <XCircleIcon className="w-5 h-5" />
                          )}
                          <span className="text-sm font-medium">
                            {personalInfo.emailVerified ? 'Đã xác minh' : 'Chưa xác minh'}
                          </span>
                        </div>
                        {!personalInfo.emailVerified && (
                          <button
                            onClick={handleResendVerification}
                            disabled={isLoading}
                            className="flex items-center gap-2 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed"
                          >
                            {isLoading ? (
                              <ArrowPathIcon className="w-4 h-4 animate-spin" />
                            ) : null}
                            Gửi lại link
                          </button>
                        )}
                      </div>
                    </div>

                    {/* Save Button */}
                    <div className="pt-4">
                      <button
                        onClick={handleSavePersonalInfo}
                        disabled={isLoading}
                        className="w-full sm:w-auto px-6 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed font-medium"
                      >
                        {isLoading ? 'Đang lưu...' : 'Lưu thay đổi'}
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <div className="space-y-6">
                {!isEditing ? (
                  // View Mode - Display learning settings
                  <div className="space-y-6">
                    {/* TOEIC Target Scores - View Mode */}
                    <div>
                      <h3 className="text-lg font-medium text-gray-900 mb-4">Mục tiêu TOEIC</h3>
                      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                        <div className="bg-blue-50 p-4 rounded-lg text-center">
                          <p className="text-sm text-gray-600 mb-1">Nghe</p>
                          <p className="text-2xl font-bold text-blue-600">{learningSettings.targetScores.listening}</p>
                          <p className="text-xs text-gray-500">/ 495 điểm</p>
                        </div>
                        <div className="bg-green-50 p-4 rounded-lg text-center">
                          <p className="text-sm text-gray-600 mb-1">Đọc</p>
                          <p className="text-2xl font-bold text-green-600">{learningSettings.targetScores.reading}</p>
                          <p className="text-xs text-gray-500">/ 495 điểm</p>
                        </div>
                        <div className="bg-orange-50 p-4 rounded-lg text-center">
                          <p className="text-sm text-gray-600 mb-1">Nói</p>
                          <p className="text-2xl font-bold text-orange-600">{learningSettings.targetScores.speaking}</p>
                          <p className="text-xs text-gray-500">/ 200 điểm</p>
                        </div>
                        <div className="bg-purple-50 p-4 rounded-lg text-center">
                          <p className="text-sm text-gray-600 mb-1">Viết</p>
                          <p className="text-2xl font-bold text-purple-600">{learningSettings.targetScores.writing}</p>
                          <p className="text-xs text-gray-500">/ 200 điểm</p>
                        </div>
                      </div>
                    </div>

                    {/* Study Time - View Mode */}
                    <div>
                      <h3 className="text-sm font-medium text-gray-500 mb-1">Thời gian học mỗi ngày</h3>
                      <p className="text-lg text-gray-900">{learningSettings.studyTimePerDay} phút</p>
                    </div>
                  </div>
                ) : (
                  // Edit Mode - Show forms for learning settings
                  <div className="space-y-6">
                    {/* TOEIC Target Scores */}
                    <div>
                      <h3 className="text-lg font-medium text-gray-900 mb-4">Mục tiêu TOEIC</h3>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Nghe (0-495 điểm) *
                          </label>
                          <input
                            type="number"
                            min="0"
                            max="495"
                            value={learningSettings.targetScores.listening || ''}
                            onChange={(e) => {
                              const value = parseInt(e.target.value) || 0;
                              setLearningSettings(prev => ({
                                ...prev,
                                targetScores: { ...prev.targetScores, listening: value }
                              }));
                              validateScoreOnChange('listening', value, 495);
                            }}
                            className={`w-full px-3 py-2 border rounded-lg focus:border-blue-500 focus:ring-2 focus:ring-blue-200 text-black ${
                              errors.listening ? 'border-red-500' : 'border-gray-300'
                            }`}
                            placeholder="0"
                          />
                          {errors.listening && (
                            <p className="mt-1 text-sm text-red-500">{errors.listening}</p>
                          )}
                        </div>
                        
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Đọc (0-495 điểm) *
                          </label>
                          <input
                            type="number"
                            min="0"
                            max="495"
                            value={learningSettings.targetScores.reading || ''}
                            onChange={(e) => {
                              const value = parseInt(e.target.value) || 0;
                              setLearningSettings(prev => ({
                                ...prev,
                                targetScores: { ...prev.targetScores, reading: value }
                              }));
                              validateScoreOnChange('reading', value, 495);
                            }}
                            className={`w-full px-3 py-2 border rounded-lg focus:border-blue-500 focus:ring-2 focus:ring-blue-200 text-black ${
                              errors.reading ? 'border-red-500' : 'border-gray-300'
                            }`}
                            placeholder="0"
                          />
                          {errors.reading && (
                            <p className="mt-1 text-sm text-red-500">{errors.reading}</p>
                          )}
                        </div>
                        
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Nói (0-200 điểm) *
                          </label>
                          <input
                            type="number"
                            min="0"
                            max="200"
                            value={learningSettings.targetScores.speaking || ''}
                            onChange={(e) => {
                              const value = parseInt(e.target.value) || 0;
                              setLearningSettings(prev => ({
                                ...prev,
                                targetScores: { ...prev.targetScores, speaking: value }
                              }));
                              validateScoreOnChange('speaking', value, 200);
                            }}
                            className={`w-full px-3 py-2 border rounded-lg focus:border-blue-500 focus:ring-2 focus:ring-blue-200 text-black ${
                              errors.speaking ? 'border-red-500' : 'border-gray-300'
                            }`}
                            placeholder="0"
                          />
                          {errors.speaking && (
                            <p className="mt-1 text-sm text-red-500">{errors.speaking}</p>
                          )}
                        </div>
                        
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Viết (0-200 điểm) *
                          </label>
                          <input
                            type="number"
                            min="0"
                            max="200"
                            value={learningSettings.targetScores.writing || ''}
                            onChange={(e) => {
                              const value = parseInt(e.target.value) || 0;
                              setLearningSettings(prev => ({
                                ...prev,
                                targetScores: { ...prev.targetScores, writing: value }
                              }));
                              validateScoreOnChange('writing', value, 200);
                            }}
                            className={`w-full px-3 py-2 border rounded-lg focus:border-blue-500 focus:ring-2 focus:ring-blue-200 text-black ${
                              errors.writing ? 'border-red-500' : 'border-gray-300'
                            }`}
                            placeholder="0"
                          />
                          {errors.writing && (
                            <p className="mt-1 text-sm text-red-500">{errors.writing}</p>
                          )}
                        </div>
                      </div>
                    </div>

                    {/* Study Time */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Thời gian học mỗi ngày (phút) *
                      </label>
                      <input
                        type="number"
                        min="0"
                        max="1440"
                        value={learningSettings.studyTimePerDay || ''}
                        onChange={(e) => {
                          const value = parseInt(e.target.value) || 0;
                          setLearningSettings(prev => ({
                            ...prev,
                            studyTimePerDay: value
                          }));
                          validateStudyTimeOnChange(value);
                        }}
                        className={`w-full sm:w-48 px-3 py-2 border rounded-lg focus:border-blue-500 focus:ring-2 focus:ring-blue-200 text-black ${
                          errors.studyTime ? 'border-red-500' : 'border-gray-300'
                        }`}
                        placeholder="120"
                      />
                      {errors.studyTime && (
                        <p className="mt-1 text-sm text-red-500">{errors.studyTime}</p>
                      )}
                      <p className="mt-1 text-xs text-gray-500">Tối đa 1440 phút (24 giờ)</p>
                    </div>

                    {/* Save Button */}
                    <div className="pt-4">
                      <button
                        onClick={handleSaveLearningSettings}
                        disabled={isLoading}
                        className="w-full sm:w-auto px-6 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed font-medium"
                      >
                        {isLoading ? 'Đang cập nhật...' : 'Cập nhật thiết lập'}
                      </button>
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Statistics Section */}
        <div className="bg-white rounded-lg shadow-sm mt-6">
          {/* Statistics Tabs */}
          <div className="border-b border-gray-200">
            <nav className="flex">
              <button 
                onClick={() => setActiveStatsTab('results')}
                className={`flex-1 px-4 sm:px-6 py-3 sm:py-4 text-sm sm:text-base font-medium border-b-2 transition-colors ${
                  activeStatsTab === 'results'
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700'
                }`}
              >
                Kết quả thi
              </button>
              <button 
                onClick={() => setActiveStatsTab('attendance')}
                className={`flex-1 px-4 sm:px-6 py-3 sm:py-4 text-sm sm:text-base font-medium border-b-2 transition-colors ${
                  activeStatsTab === 'attendance'
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700'
                }`}
              >
                Đồ chuyên cần
              </button>
            </nav>
          </div>

          <div className="p-4 sm:p-6">
            {activeStatsTab === 'results' ? (
              <>
                {/* Statistics Button */}
                <div className="mb-6">
                  <button className="w-full flex items-center justify-center gap-3 px-4 py-3 bg-blue-50 border border-blue-200 rounded-lg hover:bg-blue-100 transition-colors">
                    <div className="flex items-center gap-2">
                      <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                      </svg>
                      <span className="text-blue-800 font-medium">Tới trang thống kê thành tích</span>
                    </div>
                  </button>
                </div>

                {/* Table Header */}
                <div className="overflow-x-auto">
                  <div className="min-w-full">
                    <div className="grid grid-cols-6 gap-1 mb-2">
                      {['Tên bài thi', 'Ngày làm', 'Thời gian làm', 'Kết quả', 'Nhận xét', 'Chi tiết'].map((header, index) => (
                        <div key={index} className="p-3 text-xs sm:text-sm font-medium text-gray-700 bg-gray-100 border border-gray-300 text-center">
                          {header}
                        </div>
                      ))}
                    </div>

                    {/* Table Body */}
                    <div className="space-y-1">
                      {/* Sample exam results - replace with dynamic data */}
                      {[
                        {
                          id: 1,
                          name: "Luyện thi 1",
                          description: "Luyện thi từ vựng cơ bản 01",
                          date: "15/12/2024",
                          duration: "45 phút",
                          score: "420/495",
                          feedback: "Tốt, cần cải thiện ngữ pháp",
                          hasDetail: true
                        },
                        {
                          id: 2,
                          name: "Đề thi TOEIC 2024",
                          description: "Full test listening & reading",
                          date: "12/12/2024",
                          duration: "120 phút",
                          score: "385/495",
                          feedback: "Cần luyện thêm listening",
                          hasDetail: true
                        },
                        {
                          id: 3,
                          name: "Practice Test 3",
                          description: "Speaking & Writing practice",
                          date: "10/12/2024",
                          duration: "90 phút",
                          score: "160/200",
                          feedback: "Phát âm tốt, cần cải thiện từ vựng",
                          hasDetail: true
                        }
                      ].map((exam) => (
                        <div key={exam.id} className="grid grid-cols-6 gap-1">
                          {/* Tên bài thi */}
                          <div className="p-3 border border-gray-300 bg-white">
                            <div className="text-xs sm:text-sm">
                              <div className="text-blue-600 font-medium mb-1">{exam.name}</div>
                              <div className="text-gray-600">{exam.description}</div>
                            </div>
                          </div>
                          
                          {/* Ngày làm */}
                          <div className="p-3 border border-gray-300 bg-white flex items-center justify-center">
                            <span className="text-xs sm:text-sm text-gray-700">{exam.date}</span>
                          </div>
                          
                          {/* Thời gian làm */}
                          <div className="p-3 border border-gray-300 bg-white flex items-center justify-center">
                            <span className="text-xs sm:text-sm text-gray-700">{exam.duration}</span>
                          </div>
                          
                          {/* Kết quả */}
                          <div className="p-3 border border-gray-300 bg-white flex items-center justify-center">
                            <span className="text-xs sm:text-sm font-medium text-green-600">{exam.score}</span>
                          </div>
                          
                          {/* Nhận xét */}
                          <div className="p-3 border border-gray-300 bg-white">
                            <span className="text-xs sm:text-sm text-gray-700">{exam.feedback}</span>
                          </div>
                          
                          {/* Chi tiết */}
                          <div className="p-3 border border-gray-300 bg-white flex items-center justify-center">
                            {exam.hasDetail && (
                              <button className="text-xs sm:text-sm text-blue-600 hover:text-blue-800 font-medium">
                                Xem chi tiết
                              </button>
                            )}
                          </div>
                        </div>
                      ))}
                      
                      {/* Empty state when no exams */}
                      {false && (
                        <div className="grid grid-cols-6 gap-1">
                          <div className="col-span-6 p-8 text-center text-gray-500 border border-gray-300 bg-gray-50">
                            <div className="text-sm">Chưa có kết quả thi nào</div>
                            <div className="text-xs mt-1">Hãy thực hiện bài thi đầu tiên của bạn</div>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </>
            ) : (
              /* Attendance Tab */
              <div className="space-y-6">
                {/* Attendance Statistics Button */}
                <div className="mb-6">
                  <button className="w-full flex items-center justify-center gap-3 px-4 py-3 bg-green-50 border border-green-200 rounded-lg hover:bg-green-100 transition-colors">
                    <div className="flex items-center gap-2">
                      <svg className="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      <span className="text-green-800 font-medium">Tới trang thống kê độ chuyên cần</span>
                    </div>
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
