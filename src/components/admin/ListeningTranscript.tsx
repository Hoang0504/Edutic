'use client';
import React, { useState } from 'react';
// import { useRouter } from 'next/navigation';
import {  XMarkIcon } from '@heroicons/react/24/outline';
import AudioDetailEditor from './edit/AudioDetailEditor'; 

interface AudioItem {
  id: number;
  fileName: string;
  duration: string;
  levels: number;
  updatedAt: string;
  audioUrl?: string;
}

interface Transcript {
  audioFileId: number;
  level: 'easy' | 'medium' | 'hard';
  blanks: { index: number; position: number; length: number }[];
  fullText: string;
  vietnameseTranslation?: string;
}

const ListeningTranscript = () => {
//   const router = useRouter();
  const [searchQuery, setSearchQuery] = useState('');
  const [audioItems, setAudioItems] = useState<AudioItem[]>([
    { id: 1, fileName: 'test01.mp3', duration: '01:30', levels: 3, updatedAt: '17/06/2025' },
    { id: 2, fileName: 'test02.mp3', duration: '02:10', levels: 2, updatedAt: '16/06/2025' },
  ]);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [newAudioFile, setNewAudioFile] = useState<File | null>(null);
  const [newTranscript, setNewTranscript] = useState('');
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [selectedAudio, setSelectedAudio] = useState<AudioItem | null>(null);
const [transcripts, setTranscripts] = useState<Transcript[]>([
    { audioFileId: 1, level: 'easy', blanks: [], fullText: 'She is eating in a picnic area.', vietnameseTranslation: '' },
    { audioFileId: 1, level: 'medium', blanks: [], fullText: 'She is eating in a picnic area with friends.', vietnameseTranslation: '' },
    { audioFileId: 1, level: 'hard', blanks: [], fullText: 'She is eating in a picnic area with friends and family.', vietnameseTranslation: '' },
  ]); 

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
  };

  const handleAddNewAudio = () => {
    setIsAddModalOpen(true);
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) setNewAudioFile(file);
  };

 const handleSaveNewAudio = () => {
  if (newAudioFile && newTranscript) {
    const newId = audioItems.length + 1;
    setAudioItems([...audioItems, { id: newId, fileName: newAudioFile.name, duration: '00:00', levels: 0, updatedAt: new Date().toLocaleDateString() }]);
    setTranscripts([...transcripts, { audioFileId: newId, level: 'easy', blanks: [], fullText: newTranscript, vietnameseTranslation: '' }]);
    setIsAddModalOpen(false);
    setNewAudioFile(null);
    setNewTranscript('');
  }
};

  const handleEditAudio = (audio: AudioItem) => {
    setSelectedAudio(audio);
    setIsEditModalOpen(true);
  };

  const handleDeleteAudio = (id: number) => {
    setAudioItems(audioItems.filter(item => item.id !== id));
    setTranscripts(transcripts.filter(t => t.audioFileId !== id));
  };

  const filteredAudioItems = audioItems.filter(item =>
    item.fileName.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="min-h-screen flex flex-col">
      <header className="bg-[#006494] text-white">
        <div className="text-center py-2">
          <h1 className="text-2xl font-semibold">Listening Transcript Management</h1>
        </div>
        <div className="flex justify-between items-center p-4">
          <input
            type="text"
            placeholder="Search by keyword..."
            value={searchQuery}
            onChange={handleSearchChange}
            className="p-2 border rounded text-black"
          />
          <button
            className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
            onClick={handleAddNewAudio}
          >
            Add New Audio
          </button>
        </div>
      </header>

      <main className="flex-1 p-4">
        <div className="bg-white p-4 rounded-lg shadow">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-gray-200">
                  <th className="p-2 border">No</th>
                  <th className="p-2 border">File Name</th>
                  <th className="p-2 border">Duration</th>
                  <th className="p-2 border">#Levels</th>
                  <th className="p-2 border">Updated At</th>
                  <th className="p-2 border">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredAudioItems.map((item, index) => (
                  <tr key={item.id} className="border-t">
                    <td className="p-2 border">{index + 1}</td>
                    <td className="p-2 border">{item.fileName}</td>
                    <td className="p-2 border">{item.duration}</td>
                    <td className="p-2 border">{item.levels}</td>
                    <td className="p-2 border">{item.updatedAt}</td>
                    <td className="p-2 border flex space-x-2">
                      <button
                        className="bg-green-500 text-white px-2 py-1 rounded hover:bg-green-600"
                        onClick={() => handleEditAudio(item)}
                      >
                        Edit
                      </button>
                      <button
                       className="bg-red-500 text-white px-2 py-1 rounded hover:bg-red-600"
                        onClick={() => handleDeleteAudio(item.id)}
                      >
                       Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </main>

      {isAddModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow p-6 w-1/3 relative">
            <button
              className="absolute top-2 right-2 text-red-600 hover:text-red-800"
              onClick={() => setIsAddModalOpen(false)}
            >
              <XMarkIcon className="h-6 w-6" />
            </button>
            <h2 className="text-2xl font-semibold mb-6">Add New Audio</h2>
            <div className="space-y-4">
              <div>
                <label htmlFor="audioFile" className="block text-sm font-medium text-gray-700">
                  Audio File
                </label>
                <input
                  type="file"
                  id="audioFile"
                  accept="audio/*"
                  onChange={handleFileUpload}
                  className="mt-1 block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
                />
              </div>
              <div>
                <label htmlFor="transcript" className="block text-sm font-medium text-gray-700">
                  Initial Transcript
                </label>
                <textarea
                  id="transcript"
                  value={newTranscript}
                  onChange={(e) => setNewTranscript(e.target.value)}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-600 focus:ring-blue-600 dark:bg-gray-600 dark:border-gray-500 dark:text-white"
                  rows={4}
                  placeholder="Enter initial transcript"
                />
              </div>
              <div className="flex justify-end space-x-4">
                <button
                  className="px-4 py-2 border border-transparent text-sm font-medium rounded-md text-gray-700 bg-gray-200 hover:bg-gray-300"
                  onClick={() => setIsAddModalOpen(false)}
                >
                  Cancel
                </button>
                <button
                  className="px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700"
                  onClick={handleSaveNewAudio}
                >
                  Save
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {isEditModalOpen && selectedAudio && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow p-6 w-3/4 h-[80vh] relative overflow-y-auto">
            <button
              className="absolute top-2 right-2 text-red-600 hover:text-red-800"
              onClick={() => {
                setIsEditModalOpen(false);
                setSelectedAudio(null);
              }}
            >
              <XMarkIcon className="h-6 w-6" />
            </button>
            <AudioDetailEditor
              audio={{ ...selectedAudio, audioUrl: 'path-to-audio-url' }} 
  transcripts={transcripts.filter(t => t.audioFileId === selectedAudio.id)}
  onClose={() => {
    setIsEditModalOpen(false);
    setSelectedAudio(null);
              }}
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default ListeningTranscript;