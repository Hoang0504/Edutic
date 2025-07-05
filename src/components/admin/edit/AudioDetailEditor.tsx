'use client';
import React, { useState, useEffect } from 'react';

interface AudioItem {
  id: number;
  fileName: string;
  duration: string;
  levels: number;
  updatedAt: string;
  audioUrl?: string;
}

interface Transcript {
  id: number;
  audioFileId: number;
  level: 'easy' | 'medium' | 'hard';
  blanks: { index: number; position: number; length: number }[];
  fullText: string;
  vietnameseTranslation?: string;
}

interface WordToken {
  text: string;
  start: number;
}

interface AudioDetailEditorProps {
  audio: AudioItem;
  transcripts: Transcript[];
  onClose: () => void;
  onRefresh: () => void;
}

const AudioDetailEditor = ({ audio, transcripts, onClose, onRefresh }: AudioDetailEditorProps) => {
  const [activeTab, setActiveTab] = useState<'general' | 'easy' | 'medium' | 'hard' | 'translation'>('general');
  const [audioFileName, setAudioFileName] = useState(audio.fileName);
  const [audioUrl, setAudioUrl] = useState(audio.audioUrl || '');
  const [newAudioFile, setNewAudioFile] = useState<File | null>(null);
  const [localTranscripts, setLocalTranscripts] = useState<Transcript[]>(transcripts);
  const [selectedWords, setSelectedWords] = useState<Set<number>>(new Set());
  const [vietnameseTranslation, setVietnameseTranslation] = useState<string | undefined>(transcripts.find(t => t.level === 'easy')?.vietnameseTranslation);

  useEffect(() => {
    setAudioFileName(audio.fileName);
    setAudioUrl(audio.audioUrl || '');
    setLocalTranscripts(transcripts);
    // Lấy vietnameseTranslation từ transcripts hoặc API nếu cần
    const initialTranslation = transcripts.find(t => t.level === 'easy')?.vietnameseTranslation;
    setVietnameseTranslation(initialTranslation || '');
  }, [audio, transcripts]);

  const tokenizeBaseText = (text: string): WordToken[] => {
    const words: WordToken[] = [];
    const regex = /\S+/g;
    let match;
    while ((match = regex.exec(text)) !== null) {
      words.push({ text: match[0], start: match.index });
    }
    return words;
  };

  const toggleSelect = (index: number) => {
    setSelectedWords(prev => {
      const newSet = new Set(prev);
      if (newSet.has(index)) {
        newSet.delete(index);
      } else {
        if (activeTab === 'easy' || activeTab === 'medium' || activeTab === 'hard') {
          const maxWords = { easy: 4, medium: 8, hard: 12 }[activeTab];
          if (newSet.size < maxWords) {
            newSet.add(index);
          }
        }
      }
      return newSet;
    });
  };

  const isSelected = (index: number) => selectedWords.has(index);

  const handleClick = (e: React.MouseEvent, index: number) => {
    e.preventDefault();
    if (e.detail === 2) {
      toggleSelect(index);
    }
  };

  const updateBlanks = async (level: 'easy' | 'medium' | 'hard') => {
    const transcript = localTranscripts.find(t => t.level === level);
    if (transcript && selectedWords.size > 0) {
      const words = tokenizeBaseText(transcript.fullText);
      const newBlanks = Array.from(selectedWords).map(index => ({
        index,
        position: words[index].start,
        length: words[index].text.length,
      }));
      const updatedTranscript = { ...transcript, blanks: newBlanks };
      setLocalTranscripts(localTranscripts.map(t => t.level === level ? updatedTranscript : t));
      setSelectedWords(new Set());

      await fetch(`/api/admin/listening_transcripts/${transcript.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ blanks: newBlanks }),
      });
    }
  };

  const saveTranslation = async () => {
    if (vietnameseTranslation === undefined) {
      console.error("No translation to save");
      return;
    }

    // Sử dụng PUT để cập nhật bản dịch trong bảng translations
    await fetch(`/api/admin/translations/${audio.id}`, { // Sử dụng ID của audio làm content_id
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        content_type: 'transcript',
        content_id: audio.id,
        vietnamese_text: vietnameseTranslation,
        updated_at: new Date().toISOString(),
      }),
    });
    onRefresh(); // Làm mới dữ liệu
    onClose();
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setNewAudioFile(file);
      const url = URL.createObjectURL(file);
      setAudioUrl(url);
      setAudioFileName(file.name);
    }
  };

  const saveAudioChanges = async () => {
    if (newAudioFile) {
      const formData = new FormData();
      formData.append('file', newAudioFile);
      formData.append('fileName', audioFileName);

      try {
        const response = await fetch(`/api/admin/audio_files/${audio.id}`, {
          method: 'PUT',
          body: formData,
        });
        if (response.ok) {
          onRefresh();
          onClose();
        } else {
          const errorData = await response.json();
          console.error("Error:", errorData.error);
        }
      } catch (err) {
        console.error(err);
      }
    }
  };

  return (
    <div className="min-h-screen flex flex-col">
      <header className="bg-[#006494] text-white">
        <div className="text-center py-2">
          <h1 className="text-2xl font-semibold">Audio Detail Editor</h1>
        </div>
      </header>

      <main className="flex-1 p-4">
        <div className="bg-white p-4 rounded-lg shadow">
          <div className="flex space-x-4 mb-4">
            <button
              className={`px-4 py-2 rounded ${activeTab === 'general' ? 'bg-blue-600 text-white' : 'bg-gray-200'}`}
              onClick={() => setActiveTab('general')}
            >
              Thông tin chung
            </button>
            <button
              className={`px-4 py-2 rounded ${activeTab === 'easy' ? 'bg-blue-600 text-white' : 'bg-gray-200'}`}
              onClick={() => setActiveTab('easy')}
            >
              Cấp độ EASY
            </button>
            <button
              className={`px-4 py-2 rounded ${activeTab === 'medium' ? 'bg-blue-600 text-white' : 'bg-gray-200'}`}
              onClick={() => setActiveTab('medium')}
            >
              Cấp độ MEDIUM
            </button>
            <button
              className={`px-4 py-2 rounded ${activeTab === 'hard' ? 'bg-blue-600 text-white' : 'bg-gray-200'}`}
              onClick={() => setActiveTab('hard')}
            >
              Cấp độ HARD
            </button>
            <button
              className={`px-4 py-2 rounded ${activeTab === 'translation' ? 'bg-blue-600 text-white' : 'bg-gray-200'}`}
              onClick={() => setActiveTab('translation')}
            >
              Bản dịch
            </button>
          </div>

          {activeTab === 'general' && (
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">File Name</label>
                <div className="flex space-x-2">
                  <input
                    type="text"
                    value={audioFileName}
                    onChange={(e) => setAudioFileName(e.target.value)}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-600 focus:ring-blue-600"
                  />
                  <input
                    type="file"
                    accept="audio/*"
                    onChange={handleFileUpload}
                    className="mt-1 block w-1/3 text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Audio Preview</label>
                <audio controls src={audioUrl} className="mt-1" />
              </div>
              <button
                className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
                onClick={saveAudioChanges}
                disabled={!newAudioFile}
              >
                Save Audio Changes
              </button>
            </div>
          )}

          {['easy', 'medium', 'hard'].includes(activeTab) && (
            <div className="space-y-4">
              <label className="block text-sm font-medium text-gray-700">Transcript</label>
              <div className="border p-2">
                {tokenizeBaseText(localTranscripts.find(t => t.level === activeTab)?.fullText || '').map((word, i) => (
                  <span
                    key={i}
                    onClick={(e) => handleClick(e, i)}
                    className={`cursor-pointer px-1 py-0.5 rounded ${isSelected(i) ? 'bg-blue-300' : ''}`}
                  >
                    {word.text}
                  </span>
                ))}
              </div>
              <p>Selected: {selectedWords.size} / {activeTab === 'easy' ? 4 : activeTab === 'medium' ? 8 : 12}</p>
              <button
                className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
                onClick={() => updateBlanks(activeTab as 'easy' | 'medium' | 'hard')}
                disabled={selectedWords.size === 0}
              >
                Save Blanks
              </button>
            </div>
          )}

          {activeTab === 'translation' && (
            <div className="space-y-4">
              <label className="block text-sm font-medium text-gray-700">Vietnamese Translation</label>
              <textarea
                value={vietnameseTranslation || ''} // Đảm bảo không undefined
                onChange={(e) => setVietnameseTranslation(e.target.value)}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-600 focus:ring-blue-600"
                rows={4}
                placeholder="Enter Vietnamese translation"
              />
              <button
                className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
                onClick={saveTranslation}
                disabled={!vietnameseTranslation} // Vô hiệu hóa nếu không có nội dung
              >
                Save Translation
              </button>
            </div>
          )}
        </div>
      </main>
      <div className="flex justify-end p-4">
        <button
          className="px-4 py-2 bg-gray-600 text-white rounded hover:bg-gray-700"
          onClick={onClose}
        >
          Close
        </button>
      </div>
    </div>
  );
};

export default AudioDetailEditor;