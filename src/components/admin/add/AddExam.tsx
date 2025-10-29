'use client';
import React, { useState } from 'react';
import { PlusCircleIcon, XMarkIcon } from '@heroicons/react/24/outline';

interface AddExamProps {
  onSubmit: (e: React.FormEvent, formData: { title: string; description: string; type: string; estimatedTime: string; isPublished: boolean }) => void;
  onCancel: () => void;
}

const AddExamPage = ({ onSubmit, onCancel }: AddExamProps) => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [type, setType] = useState('Nghe - đọc');
  const [estimatedTime, setEstimatedTime] = useState('');
  const [isPublished, setIsPublished] = useState(true);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Submitting form with data:', { title, description, type, estimatedTime, isPublished }); // Debug
    onSubmit(e, { title, description, type, estimatedTime, isPublished });
  };

  const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setTitle(e.target.value);
  };

  const handleDescriptionChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setDescription(e.target.value);
  };

  const handleTypeChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setType(e.target.value);
  };

  const handleEstimatedTimeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEstimatedTime(e.target.value);
  };

  const handlePublishedChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setIsPublished(e.target.value === 'On');
  };

  return (
    <div className="bg-white dark:bg-gray-700 rounded-lg shadow p-6 relative">
      <button
        className="absolute top-2 right-2 text-red-600 hover:text-red-800"
        onClick={onCancel}
      >
        <XMarkIcon className="h-6 w-6" />
      </button>
      <h2 className="text-2xl font-semibold flex items-center mb-6">
        <PlusCircleIcon className="h-6 w-6 mr-2 text-blue-600" />
        Create New Exam
      </h2>
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
            <option value="Nghe - đọc">Nghe - đọc</option>
            <option value="Viết">Viết</option>
            <option value="Nói">Nói</option>
          </select>
        </div>
        <div>
          <label htmlFor="estimatedTime" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
            Estimated Time (minutes)
          </label>
          <input
            type="number"
            id="estimatedTime"
            name="estimatedTime"
            value={estimatedTime}
            onChange={handleEstimatedTimeChange}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-600 focus:ring-blue-600 dark:bg-gray-600 dark:border-gray-500 dark:text-white"
            placeholder="Enter estimated time"
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
            <PlusCircleIcon className="h-5 w-5 mr-2" />
            Create Exam
          </button>
        </div>
      </form>
    </div>
  );
};

export default AddExamPage;