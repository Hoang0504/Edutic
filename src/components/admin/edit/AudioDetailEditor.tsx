'use client';
import React, { useState, useEffect } from 'react';

interface AudioItem {
  id: number;
  fileName: string;
  duration: string;
  levels: number;
  updatedAt: string;
  audioUrl?: string; // Thêm thuộc tính audioUrl vào AudioItem
}

interface Transcript {
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
}

const AudioDetailEditor = ({ audio, transcripts, onClose }: AudioDetailEditorProps) => {
  const [activeTab, setActiveTab] = useState<'general' | 'easy' | 'medium' | 'hard' | 'translation'>('general');
  const [audioFileName, setAudioFileName] = useState(audio.fileName);
  const [audioUrl, setAudioUrl] = useState(audio.audioUrl || ''); // Sử dụng audioUrl từ props
  const [fullTranscript, setFullTranscript] = useState(transcripts.find(t => t.level === 'easy')?.fullText || '');
  const [localTranscripts, setLocalTranscripts] = useState<Transcript[]>(transcripts);
  const [selectedWords, setSelectedWords] = useState<Set<number>>(new Set());
  const [vietnameseTranslation, setVietnameseTranslation] = useState(transcripts.find(t => t.level === 'easy')?.vietnameseTranslation || '');

  useEffect(() => {
    setAudioFileName(audio.fileName);
    setAudioUrl(audio.audioUrl || ''); // Cập nhật audioUrl khi audio thay đổi
    setFullTranscript(transcripts.find(t => t.level === 'easy')?.fullText || '');
    setLocalTranscripts(transcripts);
    setVietnameseTranslation(transcripts.find(t => t.level === 'easy')?.vietnameseTranslation || '');
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
        newSet.add(index);
      }
      return newSet;
    });
  };

  const isSelected = (index: number) => selectedWords.has(index);

  const handleCtrlClick = (e: React.MouseEvent, index: number) => {
    if (e.ctrlKey) {
      toggleSelect(index);
    }
  };

  const updateBlanks = (level: 'easy' | 'medium' | 'hard') => {
    const transcript = localTranscripts.find(t => t.level === level);
    if (transcript && selectedWords.size > 0) {
      const words = tokenizeBaseText(transcript.fullText);
      const newBlanks = Array.from(selectedWords).map(index => ({
        index,
        position: words[index].start,
        length: words[index].text.length,
      }));
      setLocalTranscripts(localTranscripts.map(t => t.level === level ? { ...t, blanks: newBlanks } : t));
      setSelectedWords(new Set());
    }
    console.log(`Updated blanks for ${level}:`, localTranscripts.find(t => t.level === level)?.blanks);
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
                <input
                  type="text"
                  value={audioFileName}
                  onChange={(e) => setAudioFileName(e.target.value)}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-600 focus:ring-blue-600"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Audio Preview</label>
                <audio controls src={audioUrl} className="mt-1" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Original Full Transcript</label>
                <textarea
                  value={fullTranscript}
                  onChange={(e) => setFullTranscript(e.target.value)}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-600 focus:ring-blue-600"
                  rows={4}
                />
              </div>
            </div>
          )}

          {['easy', 'medium', 'hard'].includes(activeTab) && (
            <div className="space-y-4">
              <label className="block text-sm font-medium text-gray-700">Transcript</label>
              <div className="border p-2">
                {tokenizeBaseText(localTranscripts.find(t => t.level === activeTab)?.fullText || '').map((word, i) => (
                  <span
                    key={i}
                    onDoubleClick={() => toggleSelect(i)}
                    onClick={(e) => handleCtrlClick(e, i)}
                    className={`cursor-pointer px-1 py-0.5 rounded ${isSelected(i) ? 'bg-blue-300' : ''}`}
                  >
                    {word.text}
                  </span>
                ))}
              </div>
              <button
                className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
                onClick={() => updateBlanks(activeTab as 'easy' | 'medium' | 'hard')}
              >
                Save Blanks
              </button>
            </div>
          )}

          {activeTab === 'translation' && (
            <div className="space-y-4">
              <label className="block text-sm font-medium text-gray-700">Vietnamese Translation</label>
              <textarea
                value={vietnameseTranslation}
                onChange={(e) => setVietnameseTranslation(e.target.value)}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-600 focus:ring-blue-600"
                rows={4}
                placeholder="Enter Vietnamese translation"
              />
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