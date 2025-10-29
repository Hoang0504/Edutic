"use client";

import React, { useState, useEffect } from "react";

import { XMarkIcon } from "@heroicons/react/24/outline";

import AudioDetailEditor from "./edit/AudioDetailEditor";

interface AudioItem {
  id: number;
  fileName: string;
  filePath: string;
  duration: number;
  transcript: string;
  vietnameseTranslation?: string;
  levels: number;
  updatedAt: string;
  audioUrl?: string;
}

interface Transcript {
  id: number;
  audioFileId: number;
  level: "easy" | "medium" | "hard";
  blanks: { index: number; position: number; length: number }[];
  fullText: string;
  vietnameseTranslation?: string;
}

const ListeningTranscript = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [audioItems, setAudioItems] = useState<AudioItem[]>([]);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [newAudioFile, setNewAudioFile] = useState<File | null>(null);
  const [newTranscript, setNewTranscript] = useState("");
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [selectedAudio, setSelectedAudio] = useState<AudioItem | null>(null);
  const [transcripts, setTranscripts] = useState<Transcript[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchAudioItems();
  }, []);

  const fetchAudioItems = async () => {
    setLoading(true);
    try {
      const response = await fetch(
        "/api/admin/listening_transcripts?page=1&limit=10"
      );
      if (!response.ok) {
        const text = await response.text(); // Get the full response text
        console.error("API Error Response:", text);
        throw new Error("Failed to fetch audio items");
      }
      const data = await response.json();
      const items = data.data.map((file: any) => ({
        id: file.id,
        fileName: file.file_path.split("/").pop() || "",
        filePath: file.file_path,
        duration: file.duration,
        transcript: file.transcript,
        vietnameseTranslation: file.vietnameseTranslation,
        levels: file.listeningTranscripts.length,
        updatedAt: new Date(file.created_at).toLocaleDateString(),
        audioUrl: file.file_path,
      }));
      const allTranscripts = data.data.flatMap((file: any) =>
        file.listeningTranscripts.map((transcript: any) => ({
          id: transcript.id,
          audioFileId: file.id,
          level: transcript.level,
          blanks: transcript.blanks,
          fullText: file.transcript,
          vietnameseTranslation: file.vietnameseTranslation,
        }))
      );
      setAudioItems(items);

      setTranscripts(allTranscripts);
    } catch (err) {
      console.error("Fetch Error:", err);
    } finally {
      setLoading(false);
    }
  };
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

  const handleSaveNewAudio = async () => {
    if (newAudioFile && newTranscript) {
      const formData = new FormData();
      formData.append("file", newAudioFile);
      formData.append("transcript", newTranscript);
      try {
        const response = await fetch(
          "/api/admin/listening_transcripts/create",
          {
            method: "POST",
            body: formData,
          }
        );
        if (response.ok) {
          fetchAudioItems();
          setIsAddModalOpen(false);
          setNewAudioFile(null);
          setNewTranscript("");
        } else {
          const errorData = await response.json();
          console.error("Error:", errorData.error);
        }
      } catch (err) {
        console.error(err);
      }
    }
  };

  const handleEditAudio = async (audio: AudioItem) => {
    try {
      const response = await fetch(`/api/admin/audio_files/${audio.id}`);
      if (response.ok) {
        const data = await response.json();
        const updatedAudio = { ...audio, ...data };
        setSelectedAudio(updatedAudio);
        setIsEditModalOpen(true);
      } else {
        console.error("Error fetching audio details:", await response.json());
        setSelectedAudio(audio);
        setIsEditModalOpen(true);
      }
    } catch (err) {
      console.error("Error:", err);
      setSelectedAudio(audio);
      setIsEditModalOpen(true);
    }
  };

  const handleDeleteAudio = async (id: number) => {
    if (confirm("Are you sure you want to delete this audio file?")) {
      try {
        const response = await fetch(`/api/admin/audio_files/${id}`, {
          method: "DELETE",
        });
        if (response.ok) {
          fetchAudioItems();
        } else {
          const errorData = await response.json();
          console.error("Error:", errorData.error);
        }
      } catch (err) {
        console.error(err);
      }
    }
  };

  const handleRefresh = () => {
    fetchAudioItems();
  };

  const filteredAudioItems = audioItems.filter((item) =>
    item.fileName.toLowerCase().includes(searchQuery.toLowerCase())
  );

  if (loading) return <div className="text-center p-4">Loading...</div>;

  return (
    <div className="min-h-screen flex flex-col">
      <header className="bg-[#006494] text-white">
        <div className="text-center py-2">
          <h1 className="text-2xl font-semibold">
            Listening Transcript Management
          </h1>
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
                  <th className="p-2 border">Levels</th>
                  <th className="p-2 border">Updated At</th>
                  <th className="p-2 border">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredAudioItems.map((item, index) => (
                  <tr key={item.id} className="border-t">
                    <td className="p-2 border">{index + 1}</td>
                    <td className="p-2 border">{item.fileName}</td>
                    <td className="p-2 border">{item.duration} seconds</td>
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
                <label
                  htmlFor="audioFile"
                  className="block text-sm font-medium text-gray-700"
                >
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
                <label
                  htmlFor="transcript"
                  className="block text-sm font-medium text-gray-700"
                >
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
              audio={{
                ...selectedAudio,
                duration: String(selectedAudio.duration),
                audioUrl: selectedAudio.audioUrl,
              }}
              transcripts={transcripts.filter(
                (t) => t.audioFileId === selectedAudio.id
              )}
              onClose={() => {
                setIsEditModalOpen(false);
                setSelectedAudio(null);
              }}
              onRefresh={handleRefresh}
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default ListeningTranscript;
