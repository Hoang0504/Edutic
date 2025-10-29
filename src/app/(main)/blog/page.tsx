'use client';

import { useState } from 'react';
import Link from 'next/link';
import { 
  MagnifyingGlassIcon, 
  BookOpenIcon, 
  AcademicCapIcon,
  ChatBubbleLeftRightIcon,
  EyeIcon,
  PencilIcon
} from '@heroicons/react/24/outline';
import { TOEIC_TOPICS } from '@/data/toeicKnowledge';
import { useTranslation } from '@/contexts/I18nContext';

interface KnowledgeItem {
  id: string;
  title: string;
  description: string;
  readTime: string;
  difficulty: 'Cơ bản' | 'Trung bình' | 'Nâng cao';
}

interface KnowledgeCategory {
  id: string;
  category: string;
  icon: string;
  color: string;
  items: KnowledgeItem[];
}

export default function BlogPage() {
  const { t } = useTranslation();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');

  // Icon mapping
  const iconMap = {
    BookOpenIcon,
    AcademicCapIcon,
    ChatBubbleLeftRightIcon,
    EyeIcon
  };

  // Filter topics based on search term and category
  const filteredTopics = TOEIC_TOPICS.filter(topic => {
    if (selectedCategory !== 'all' && topic.id !== selectedCategory) return false;
    
    if (searchTerm) {
      const searchLower = searchTerm.toLowerCase();
      return topic.category.toLowerCase().includes(searchLower) ||
             topic.items.some(item => 
               item.title.toLowerCase().includes(searchLower) ||
               item.description.toLowerCase().includes(searchLower)
             );
    }
    return true;
  });

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'Cơ bản': return 'bg-green-100 text-green-800';
      case 'Trung bình': return 'bg-yellow-100 text-yellow-800';
      case 'Nâng cao': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getCategoryColor = (color: string) => {
    const colors = {
      blue: 'bg-blue-500',
      green: 'bg-green-500',
      purple: 'bg-purple-500',
      orange: 'bg-orange-500'
    };
    return colors[color as keyof typeof colors] || 'bg-gray-500';
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-4">
          {t('blog.title', 'Kiến thức TOEIC')}
        </h1>
        <p className="text-lg text-gray-600">
          {t('blog.subtitle', 'Tổng hợp kiến thức và mẹo làm bài để chinh phục TOEIC')}
        </p>
      </div>

      {/* Search and Filter */}
      <div className="mb-8 space-y-4">
        <div className="relative">
          <MagnifyingGlassIcon className="w-5 h-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder={t('blog.searchPlaceholder', 'Tìm kiếm kiến thức...')}
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>

        <div className="flex flex-wrap gap-2">
          <button
            onClick={() => setSelectedCategory('all')}
            className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
              selectedCategory === 'all'
                ? 'bg-blue-500 text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            {t('blog.filter.all', 'Tất cả')}
          </button>
          {TOEIC_TOPICS.map((topic) => (
            <button
              key={topic.id}
              onClick={() => setSelectedCategory(topic.id)}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                selectedCategory === topic.id
                  ? 'bg-blue-500 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              {topic.category}
            </button>
          ))}
        </div>
      </div>

      {/* Knowledge Categories */}
      <div className="space-y-8">
        {filteredTopics.map((topic) => {
          const IconComponent = iconMap[topic.icon as keyof typeof iconMap];
          return (
            <div key={topic.id} className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
              {/* Category Header */}
              <div className="bg-gradient-to-r from-gray-50 to-gray-100 px-6 py-4 border-b border-gray-200">
                <div className="flex items-center">
                  <div className={`p-3 rounded-lg ${getCategoryColor(topic.color)} mr-4`}>
                    <IconComponent className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h2 className="text-xl font-semibold text-gray-900">{topic.category}</h2>
                    <p className="text-gray-600 text-sm">{t('blog.lessonsCount', '{{count}} bài học', { count: topic.items.length })}</p>
                  </div>
                </div>
              </div>

              {/* Category Items */}
              <div className="p-6">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {topic.items.map((item) => (
                    <Link
                      key={item.id}
                      href={`/blog/${item.id}`}
                      className="block group"
                    >
                      <div className="bg-gray-50 rounded-lg p-4 transition-all duration-200 group-hover:bg-gray-100 group-hover:shadow-md border border-gray-200 group-hover:border-gray-300">
                        <div className="flex items-start justify-between mb-2">
                          <h3 className="font-semibold text-gray-900 group-hover:text-blue-600 transition-colors">
                            {item.title}
                          </h3>
                          <span className={`text-xs px-2 py-1 rounded-full font-medium ${getDifficultyColor(item.difficulty)}`}>
                            {item.difficulty}
                          </span>
                        </div>
                        <p className="text-gray-600 text-sm mb-3 line-clamp-2">
                          {item.description}
                        </p>
                        <div className="flex items-center text-xs text-gray-500">
                          <PencilIcon className="w-4 h-4 mr-1" />
                          {item.readTime}
                        </div>
                      </div>
                    </Link>
                  ))}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* No results */}
      {filteredTopics.length === 0 && (
        <div className="text-center py-12">
          <div className="text-gray-400 mb-4">
            <MagnifyingGlassIcon className="w-12 h-12 mx-auto" />
          </div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">
            {t('blog.noResults.title', 'Không tìm thấy kết quả')}
          </h3>
          <p className="text-gray-600">
            {t('blog.noResults.message', 'Hãy thử tìm kiếm với từ khóa khác hoặc chọn danh mục khác.')}
          </p>
        </div>
      )}
    </div>
  );
} 