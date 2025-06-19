'use client';
import React, { useState, useEffect } from 'react';
import { XMarkIcon } from '@heroicons/react/24/outline';

interface Exam {
  id: number;
  title: string;
  type: string;
  estimatedTime: string;
  isPublished: boolean;
  description: string;
}

interface EditExamProps {
  onSubmit: (e: React.FormEvent) => void;
  onCancel: () => void;
  initialData?: Exam;
}

const EditExamPage = ({ onSubmit, onCancel, initialData }: EditExamProps) => {
  const [title, setTitle] = useState('');
  const [type, setType] = useState('TOEIC Sample');
  const [estimatedTime, setEstimatedTime] = useState('120 minutes');
  const [isPublished, setIsPublished] = useState(true);
  const [description, setDescription] = useState('');

  useEffect(() => {
    if (initialData) {
      setTitle(initialData.title || '');
      setType(initialData.type || 'TOEIC Sample');
      setEstimatedTime(initialData.estimatedTime || '120 minutes');
      setIsPublished(initialData.isPublished || false);
      setDescription(initialData.description || '');
    }
  }, [initialData]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Updating exam with data:', { title, type, estimatedTime, isPublished, description }); // Debug
    onSubmit(e);
  };

  const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setTitle(e.target.value);
  };

  const handleTypeChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setType(e.target.value);
  };

  const handleEstimatedTimeChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setEstimatedTime(e.target.value);
  };

  const handlePublishedChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setIsPublished(e.target.value === 'On');
  };

  const handleDescriptionChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setDescription(e.target.value);
  };

  return (
    <div className="bg-white dark:bg-gray-700 rounded-lg shadow p-6 relative">
      <button
        className="absolute top-2 right-2 text-red-600 hover:text-red-800"
        onClick={onCancel}
      >
        <XMarkIcon className="h-6 w-6" />
      </button>
      <h2 className="text-2xl font-semibold mb-6">Edit Exam</h2>
      <form className="space-y-4" onSubmit={handleSubmit}>
        <div>
          <label htmlFor="title" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
            Title
          </label>
          <input
            type="text"
            id="title"
            name="title"
            value={title}
            onChange={handleTitleChange}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-600 focus:ring-blue-600 dark:bg-gray-600 dark:border-gray-500 dark:text-white"
            placeholder="Enter title"
          />
        </div>
        <div>
          <label htmlFor="type" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
            Type
          </label>
          <select
            id="type"
            name="type"
            value={type}
            onChange={handleTypeChange}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-600 focus:ring-blue-600 dark:bg-gray-600 dark:border-gray-500 dark:text-white"
          >
            <option value="TOEIC Sample">TOEIC Sample</option>
            <option value="TOEIC Full">TOEIC Full</option>
            <option value="Writing">Writing</option>
            <option value="Speaking">Speaking</option>
          </select>
        </div>
        <div>
          <label htmlFor="estimatedTime" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
            Estimated Time
          </label>
          <select
            id="estimatedTime"
            name="estimatedTime"
            value={estimatedTime}
            onChange={handleEstimatedTimeChange}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-600 focus:ring-blue-600 dark:bg-gray-600 dark:border-gray-500 dark:text-white"
          >
            <option value="120 minutes">120 minutes</option>
            <option value="30 minutes">30 minutes</option>
            <option value="20 minutes">20 minutes</option>
          </select>
        </div>
        <div>
          <label htmlFor="description" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
            Description
          </label>
          <textarea
            id="description"
            name="description"
            value={description}
            onChange={handleDescriptionChange}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-600 focus:ring-blue-600 dark:bg-gray-600 dark:border-gray-500 dark:text-white"
            rows={3}
            placeholder="Enter description"
          />
        </div>
        <div>
          <label htmlFor="published" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
            Published
          </label>
          <select
            id="published"
            name="published"
            value={isPublished ? 'On' : 'Off'}
            onChange={handlePublishedChange}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-600 focus:ring-blue-600 dark:bg-gray-600 dark:border-gray-500 dark:text-white"
          >
            <option value="On">On</option>
            <option value="Off">Off</option>
          </select>
        </div>
        <div className="flex justify-center space-x-4">
          <button
            type="button"
            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-gray-700 bg-gray-200 hover:bg-gray-300 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500"
            onClick={onCancel}
          >
            Cancel
          </button>
          <button
            type="submit"
            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-600"
          >
            Update Exam
          </button>
        </div>
      </form>
    </div>
  );
};

export default EditExamPage;