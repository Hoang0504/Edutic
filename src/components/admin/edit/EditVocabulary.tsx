'use client';
import React, { useState, useEffect } from 'react';
import { XMarkIcon } from '@heroicons/react/24/outline';
import Image from 'next/image'; // Import Image từ next/image

interface Vocabulary {
  id: number;
  word: string;
  image_url: string;
  pronunciation: string;
  speech_audio_url: string;
  meaning: string;
  example: string;
  context: string;
  status: string;
  created_at: string;
}

interface EditVocabularyProps {
  initialData?: Vocabulary | null;
  onSave: (e: React.FormEvent, data: Vocabulary) => void;
  onCancel: () => void;
}

const EditVocabulary = ({ initialData, onSave, onCancel }: EditVocabularyProps) => {
  const [editedVocabulary, setEditedVocabulary] = useState<Vocabulary | null>(initialData || null);

  useEffect(() => {
    setEditedVocabulary(initialData || null);
  }, [initialData]);

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file && editedVocabulary) {
      const url = URL.createObjectURL(file);
      setEditedVocabulary({ ...editedVocabulary, image_url: url });
    }
  };

  const handleAudioUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file && editedVocabulary) {
      const url = URL.createObjectURL(file);
      setEditedVocabulary({ ...editedVocabulary, speech_audio_url: url });
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    if (editedVocabulary) {
      setEditedVocabulary({ ...editedVocabulary, [name]: value });
    }
  };

  const handleSaveVocabulary = (e: React.FormEvent) => {
    e.preventDefault();
    if (editedVocabulary) {
      onSave(e, editedVocabulary);
    }
  };

  return (
    <div className="bg-white dark:bg-gray-700 rounded-lg shadow p-6 relative max-h-[80vh] overflow-y-auto">
      <button
        className="absolute top-2 right-2 text-red-600 hover:text-red-800"
        onClick={onCancel}
      >
        <XMarkIcon className="h-6 w-6" />
      </button>
      <h2 className="text-2xl font-semibold mb-6">Edit Vocabulary</h2>
      {editedVocabulary ? (
        <form className="space-y-4" onSubmit={handleSaveVocabulary}>
          <div>
            <label htmlFor="word" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
              Word
            </label>
            <input
              type="text"
              id="word"
              name="word"
              value={editedVocabulary.word}
              onChange={handleInputChange}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-600 focus:ring-blue-600 dark:bg-gray-600 dark:border-gray-500 dark:text-white"
              placeholder="Enter word"
            />
          </div>
          <div>
            <label htmlFor="image_url" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
              Image
            </label>
            <input
              type="file"
              id="image_url"
              name="image_url"
              onChange={handleImageUpload}
              className="mt-1 block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
            />
            {editedVocabulary.image_url && (
              <Image
                src={editedVocabulary.image_url}
                alt="Vocabulary"
                width={128} // Đặt kích thước hợp lý, có thể điều chỉnh
                height={128}
                className="mt-2 object-cover" // Giữ class cũ
              />
            )}
            {!editedVocabulary.image_url && <span className="text-red-500">Missing image</span>}
          </div>
          <div>
            <label htmlFor="pronunciation" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
              Pronunciation
            </label>
            <input
              type="text"
              id="pronunciation"
              name="pronunciation"
              value={editedVocabulary.pronunciation}
              onChange={handleInputChange}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-600 focus:ring-blue-600 dark:bg-gray-600 dark:border-gray-500 dark:text-white"
              placeholder="Enter pronunciation"
            />
            {!editedVocabulary.pronunciation && <span className="text-red-500">Missing pronunciation</span>}
          </div>
          <div>
            <label htmlFor="speech_audio_url" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
              Audio
            </label>
            <input
              type="file"
              id="speech_audio_url"
              name="speech_audio_url"
              onChange={handleAudioUpload}
              className="mt-1 block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
            />
            {editedVocabulary.speech_audio_url && (
              <audio controls src={editedVocabulary.speech_audio_url} className="mt-2" />
            )}
            {!editedVocabulary.speech_audio_url && <span className="text-red-500">Missing audio</span>}
          </div>
          <div>
            <label htmlFor="meaning" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
              Meaning
            </label>
            <textarea
              id="meaning"
              name="meaning"
              value={editedVocabulary.meaning}
              onChange={handleInputChange}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-600 focus:ring-blue-600 dark:bg-gray-600 dark:border-gray-500 dark:text-white"
              rows={3}
              placeholder="Enter meaning"
            />
            {!editedVocabulary.meaning && <span className="text-red-500">Missing meaning</span>}
          </div>
          <div>
            <label htmlFor="example" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
              Example
            </label>
            <textarea
              id="example"
              name="example"
              value={editedVocabulary.example}
              onChange={handleInputChange}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-600 focus:ring-blue-600 dark:bg-gray-600 dark:border-gray-500 dark:text-white"
              rows={3}
              placeholder="Enter example"
            />
            {!editedVocabulary.example && <span className="text-red-500">Missing example</span>}
          </div>
          <div>
            <label htmlFor="context" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
              Context
            </label>
            <select
              id="context"
              name="context"
              value={editedVocabulary.context}
              onChange={handleInputChange}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-600 focus:ring-blue-600 dark:bg-gray-600 dark:border-gray-500 dark:text-white"
            >
              <option value="Business">Business</option>
              <option value="Travel">Travel</option>
              <option value="Restaurant">Restaurant</option>
              <option value="Email">Email</option>
              <option value="Daily conversation">Daily conversation</option>
              <option value="Shopping">Shopping</option>
              <option value="Health">Health</option>
              <option value="Education">Education</option>
              <option value="Technology">Technology</option>
              <option value="Finance">Finance</option>
              <option value="HR & Recruitment">HR & Recruitment</option>
              <option value="Meetings">Meetings</option>
              <option value="Marketing">Marketing</option>
            </select>
          </div>
          <div>
            <label htmlFor="status" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
              Status
            </label>
            <select
              id="status"
              name="status"
              value={editedVocabulary.status}
              onChange={handleInputChange}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-600 focus:ring-blue-600 dark:bg-gray-600 dark:border-gray-500 dark:text-white"
            >
              <option value="Active">Active</option>
              <option value="Inactive">Inactive</option>
            </select>
          </div>
          <div className="flex justify-center space-x-4">
            <button
              type="button"
              className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-gray-700 bg-gray-200 hover:bg-gray-300 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500"
              onClick={onCancel}
            >
              Reject
            </button>
            <button
              type="submit"
              className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-600"
            >
              Accept
            </button>
          </div>
        </form>
      ) : (
        <p>Loading...</p>
      )}
    </div>
  );
};

export default EditVocabulary;