'use client';
import React, { useState } from 'react';
import Image from 'next/image';

interface VocabularyInput {
  word: string;
  image_url: string;
  pronunciation: string;
  speech_audio_url: string;
  meaning: string;
  example: string;
  context: string;
  status: string;
}

interface AddVocabularyProps {
  onSave: (data: VocabularyInput) => Promise<void>; 
  onCancel: () => void;
}

const AddVocabulary: React.FC<AddVocabularyProps> = ({ onSave, onCancel }) => {
  const [form, setForm] = useState<VocabularyInput>({
    word: '',
    image_url: '',
    pronunciation: '',
    speech_audio_url: '',
    meaning: '',
    example: '',
    context: 'Business',
    status: 'pending',
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const url = URL.createObjectURL(file);
      console.log('New image URL:', url);
      setForm((prev) => ({ ...prev, image_url: url }));
    }
  };

  const handleAudioUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const url = URL.createObjectURL(file);
      console.log('New audio URL:', url);
      setForm((prev) => ({ ...prev, speech_audio_url: url }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Submitting form:', form);
    await onSave(form); 
  };

  return (
    <div className="bg-white dark:bg-gray-700 rounded-lg shadow p-6 relative max-h-[80vh] overflow-y-auto">
      <h2 className="text-2xl font-semibold mb-6">Add Vocabulary</h2>
      <form className="space-y-4" onSubmit={handleSubmit}>
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Word</label>
          <input
            type="text"
            name="word"
            value={form.word}
            onChange={handleChange}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-600 focus:ring-blue-600 dark:bg-gray-600 dark:border-gray-500 dark:text-white"
            required
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Image</label>
          <input type="file" accept="image/*" onChange={handleImageUpload} />
          {form.image_url && (
            <Image
              key={form.image_url}
              src={form.image_url}
              alt="Preview"
              className="mt-2 object-cover rounded"
              width={128}
              height={128}
            />
          )}
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Pronunciation</label>
          <input
            type="text"
            name="pronunciation"
            value={form.pronunciation}
            onChange={handleChange}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-600 focus:ring-blue-600 dark:bg-gray-600 dark:border-gray-500 dark:text-white"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Audio</label>
          <input type="file" accept="audio/*" onChange={handleAudioUpload} />
          {form.speech_audio_url && (
            <audio controls src={form.speech_audio_url} className="mt-2" />
          )}
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Meaning</label>
          <textarea
            name="meaning"
            value={form.meaning}
            onChange={handleChange}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-600 focus:ring-blue-600 dark:bg-gray-600 dark:border-gray-500 dark:text-white"
            rows={2}
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Example</label>
          <textarea
            name="example"
            value={form.example}
            onChange={handleChange}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-600 focus:ring-blue-600 dark:bg-gray-600 dark:border-gray-500 dark:text-white"
            rows={2}
            required
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Context</label>
          <select
            name="context"
            value={form.context}
            onChange={handleChange}
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
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Status</label>
          <select
            name="status"
            value={form.status}
            onChange={handleChange}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-600 focus:ring-blue-600 dark:bg-gray-600 dark:border-gray-500 dark:text-white"
          >
            <option value="pending">Pending</option>
            <option value="approved">Approved</option>
            <option value="rejected">Rejected</option>
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
            Add
          </button>
        </div>
      </form>
    </div>
  );
};

export default AddVocabulary;