'use client';

import { useParams, useRouter } from 'next/navigation';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { 
  ArrowLeftIcon, 
  ClockIcon, 
  TagIcon,
  BookOpenIcon,
  ShareIcon
} from '@heroicons/react/24/outline';
import { TOEIC_KNOWLEDGE, type KnowledgeItem } from '@/data/toeicKnowledge';

export default function BlogDetailPage() {
  const params = useParams();
  const router = useRouter();
  const [article, setArticle] = useState<KnowledgeItem | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (params.id) {
      const articleData = TOEIC_KNOWLEDGE[params.id as string];
      if (articleData) {
        setArticle(articleData);
      }
      setIsLoading(false);
    }
  }, [params.id]);

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'Cơ bản': return 'bg-green-100 text-green-800';
      case 'Trung bình': return 'bg-yellow-100 text-yellow-800';
      case 'Nâng cao': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  if (isLoading) {
    return (
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-1/3 mb-4"></div>
          <div className="h-4 bg-gray-200 rounded w-2/3 mb-8"></div>
          <div className="space-y-4">
            <div className="h-4 bg-gray-200 rounded"></div>
            <div className="h-4 bg-gray-200 rounded w-5/6"></div>
            <div className="h-4 bg-gray-200 rounded w-4/6"></div>
          </div>
        </div>
      </div>
    );
  }

  if (!article) {
    return (
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="text-center">
          <div className="text-gray-400 mb-4">
            <BookOpenIcon className="w-12 h-12 mx-auto" />
          </div>
          <h1 className="text-2xl font-bold text-gray-900 mb-2">
            Bài viết không tồn tại
          </h1>
          <p className="text-gray-600 mb-6">
            Bài viết bạn đang tìm kiếm không tồn tại hoặc đã bị xóa.
          </p>
          <Link 
            href="/blog"
            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 transition-colors"
          >
            <ArrowLeftIcon className="w-4 h-4 mr-2" />
            Quay lại danh sách
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
      {/* Navigation */}
      <div className="mb-6">
        <Link 
          href="/blog"
          className="inline-flex items-center text-blue-600 hover:text-blue-800 font-medium transition-colors"
        >
          <ArrowLeftIcon className="w-4 h-4 mr-2" />
          Quay lại danh sách
        </Link>
      </div>

      {/* Article Header */}
      <header className="mb-8">
        <div className="flex flex-wrap items-center gap-3 mb-4">
          <span className="bg-blue-100 text-blue-800 text-sm font-medium px-3 py-1 rounded-full">
            {article.category}
          </span>
          <span className={`text-sm font-medium px-3 py-1 rounded-full ${getDifficultyColor(article.difficulty)}`}>
            {article.difficulty}
          </span>
        </div>

        <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
          {article.title}
        </h1>

        <p className="text-lg text-gray-600 mb-6">
          {article.description}
        </p>

        <div className="flex flex-wrap items-center gap-6 text-sm text-gray-500">
          <div className="flex items-center">
            <ClockIcon className="w-4 h-4 mr-1" />
            {article.readTime}
          </div>
          <div className="flex items-center">
            <TagIcon className="w-4 h-4 mr-1" />
            {article.tags.join(', ')}
          </div>
          <button className="flex items-center hover:text-blue-600 transition-colors">
            <ShareIcon className="w-4 h-4 mr-1" />
            Chia sẻ
          </button>
        </div>
      </header>

      {/* Article Content */}
      <div className="prose prose-lg max-w-none">
        <div 
          className="article-content"
          dangerouslySetInnerHTML={{ __html: article.content }}
        />
      </div>

      {/* Navigation Footer */}
      <div className="mt-12 pt-8 border-t border-gray-200">
        <div className="flex justify-between items-center">
          <Link 
            href="/blog"
            className="inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 transition-colors"
          >
            <ArrowLeftIcon className="w-4 h-4 mr-2" />
            Danh sách bài viết
          </Link>
          
          <div className="text-sm text-gray-500">
            Bài viết thuộc chủ đề: <span className="font-medium">{article.category}</span>
          </div>
        </div>
      </div>
    </div>
  );
} 