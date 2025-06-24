'use client';
import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import EditVocabulary from './edit/EditVocabulary';
import AddVocabulary from './add/AddVocabulary';

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

const Flashcard = () => {
  const router = useRouter();
  const [filterKeyword, setFilterKeyword] = useState('');
  const [filterContext, setFilterContext] = useState('All');
  const [filterStatus, setFilterStatus] = useState('All');
  const [currentPage, setCurrentPage] = useState(1);
  const [vocabularies, setVocabularies] = useState<Vocabulary[]>([]);
  const [isDetailModalVisible, setIsDetailModalVisible] = useState(false);
  const [isAddModalVisible, setIsAddModalVisible] = useState(false);
  const [selectedVocabulary, setSelectedVocabulary] = useState<Vocabulary | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchVocabularies = async () => {
      setLoading(true);
      try {
        const token = localStorage.getItem('token');
        const response = await fetch(`http://localhost:3000/api/admin/vocabularies?page=${currentPage}&limit=10`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (!response.ok) throw new Error('Failed to fetch vocabularies');
        const data = await response.json();
        setVocabularies(data.data);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Unknown error');
      } finally {
        setLoading(false);
      }
    };
    fetchVocabularies();
  }, [currentPage]);

  const handleKeywordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFilterKeyword(e.target.value);
    setCurrentPage(1);
  };

  const handleContextChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setFilterContext(e.target.value);
    setCurrentPage(1);
  };

  const handleStatusChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setFilterStatus(e.target.value);
    setCurrentPage(1);
  };

  const filteredVocabularies = vocabularies.filter((vocab: Vocabulary) => {
    const keywordLower = filterKeyword.toLowerCase();
    const wordLower = vocab.word.toLowerCase();
    const contextMatch = filterContext === 'All' || vocab.context === filterContext;
    const statusMatch = filterStatus === 'All' || vocab.status === filterStatus;
    return wordLower.includes(keywordLower) && contextMatch && statusMatch;
  });

  const pageSize = 2;
  const paginatedVocabularies = filteredVocabularies.slice((currentPage - 1) * pageSize, currentPage * pageSize);
  const totalVocabularies = filteredVocabularies.length;

  const handleModalCancel = () => {
    setIsDetailModalVisible(false);
  };

  const handleLogoutAdmin = () => {
    router.push('/admin/login');
  };

 const handleAddVocabulary = async (data: VocabularyInput) => {
  setLoading(true);
  setError(null);
  try {
    const token = localStorage.getItem('token');
    const formData = new FormData();
    formData.append('word', data.word);
    formData.append('pronunciation', data.pronunciation || '');
    formData.append('meaning', data.meaning || '');
    formData.append('example', data.example);
    formData.append('context', data.context);
    formData.append('status', data.status);

  
    if (data.image_url && data.image_url.startsWith('blob:')) {
      const response = await fetch(data.image_url);
      const blob = await response.blob();
      formData.append('image', blob, 'image.jpg');
    }

    
    if (data.speech_audio_url && data.speech_audio_url.startsWith('blob:')) {
      const response = await fetch(data.speech_audio_url);
      const blob = await response.blob();
      formData.append('audio', blob, 'audio.mp3');
    }

    console.log('Sending FormData:', Array.from(formData.entries())); 
    const response = await fetch('http://localhost:3000/api/admin/vocabularies', { 
      method: 'POST',
      headers: {
        Authorization: `Bearer ${token}`,
      },
      body: formData,
    });

    if (!response.ok) {
      const text = await response.text();
      console.error('Server response:', text);
      throw new Error(`HTTP error! status: ${response.status}, message: ${text || 'No response'}`);
    }

    const newVocab = await response.json();
    setVocabularies((prev) => [newVocab, ...prev]);
    setIsAddModalVisible(false);
  } catch (err) {
    setError(err instanceof Error ? err.message : 'Unknown error');
    console.error('Add vocabulary error:', err);
  } finally {
    setLoading(false);
  }
};

  const handleViewReview = async (vocab: Vocabulary) => {
    setLoading(true);
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`http://localhost:3000/api/admin/vocabularies/${vocab.id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!response.ok) throw new Error('Failed to fetch vocabulary details');
      const data = await response.json();
      setSelectedVocabulary(data);
      setIsDetailModalVisible(true);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unknown error');
    } finally {
      setLoading(false);
    }
  };

  const handleSaveVocabulary = async (e: React.FormEvent, data: Vocabulary) => {
    e.preventDefault();
    setLoading(true);
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`http://localhost:3000/api/admin/vocabularies/${data.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          word: data.word,
          image_url: data.image_url,
          pronunciation: data.pronunciation,
          speech_audio_url: data.speech_audio_url,
          meaning: data.meaning,
          example: data.example,
          context: data.context,
          status: data.status,
        }),
      });
      if (!response.ok) throw new Error('Failed to update vocabulary');
      const updatedData = await response.json();
      setVocabularies((prev) =>
        prev.map((vocab) => (vocab.id === updatedData.id ? updatedData : vocab))
      );
      setIsDetailModalVisible(false);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unknown error');
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteVocabulary = async (id: number) => {
    if (!window.confirm("Are you sure you want to delete this vocabulary?")) return;
    setLoading(true);
    setError(null);
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`http://localhost:3000/api/admin/vocabularies/${id}`, {
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      if (response.status === 204) {
        setVocabularies((prev) => prev.filter((vocab) => vocab.id !== id));
        setIsDetailModalVisible(false);
      } else if (response.status === 404) {
        setError("Vocabulary not found");
      } else if (response.status === 400) {
        setError("Invalid ID");
      } else {
        const data = await response.json();
        setError(data.message || "Failed to delete vocabulary");
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unknown error");
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <div className="text-center p-4">Loading...</div>;
  if (error) return <div className="text-center p-4 text-red-500">Error: {error}</div>;

  return (
    <div className="min-h-screen flex flex-col">
      <header className="bg-[#006494] text-white">
        <div className="text-center py-2">
          <h1 className="text-2xl font-semibold">Vocabulary Management</h1>
        </div>
        <div className="flex justify-between items-center p-4">
          <div className="flex space-x-4 items-center">
            <button
              className="flex items-center bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
              onClick={() => setIsAddModalVisible(true)}
            >
              Add Vocabulary
            </button>
            <input
              type="text"
              placeholder="Search by keyword..."
              value={filterKeyword}
              onChange={handleKeywordChange}
              className="p-2 border rounded text-black"
            />
            <select
              value={filterContext}
              onChange={handleContextChange}
              className="p-2 border rounded text-black"
            >
              <option value="All">All Contexts</option>
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
            <select
              value={filterStatus}
              onChange={handleStatusChange}
              className="p-2 border rounded text-black"
            >
              <option value="All">All Statuses</option>
              <option value="Active">Active</option>
              <option value="Inactive">Inactive</option>
            </select>
          </div>
          <div className="flex space-x-2">
            <button
              className="flex items-center bg-gray-600 text-white px-4 py-2 rounded hover:bg-gray-700"
              onClick={handleLogoutAdmin}
            >
              <svg
                className="w-5 h-5 mr-1"
                fill="currentColor"
                viewBox="0 0 20 20"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  fillRule="evenodd"
                  d="M3 3a1 1 0 00-1 1v12a1 1 0 102 0V4a1 1 0 00-1-1zm10.293 9.293a1 1 0 001.414 1.414l3-3a1 1 0 000-1.414l-3-3a1 1 0 10-1.414 1.414L14.586 9H7a1 1 0 100 2h7.586l-1.293 1.293z"
                  clipRule="evenodd"
                />
              </svg>
              Logout
            </button>
          </div>
        </div>
      </header>

      <main className="flex-1 p-4">
        <div className="bg-white p-4 rounded-lg shadow">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-gray-200">
                  <th className="p-2 border">Word</th>
                  <th className="p-2 border">Context</th>
                  <th className="p-2 border">Status</th>
                  <th className="p-2 border">Created At</th>
                  <th className="p-2 border">Action</th>
                </tr>
              </thead>
              <tbody>
                {paginatedVocabularies.map((vocab) => (
                  <tr key={vocab.id} className="border-t">
                    <td className="p-2 border">{vocab.word}</td>
                    <td className="p-2 border">{vocab.context}</td>
                    <td className="p-2 border">{vocab.status}</td>
                    <td className="p-2 border">{vocab.created_at}</td>
                    <td className="p-2 border flex space-x-2">
                      <button
                        className="bg-blue-500 text-white px-2 py-1 rounded hover:bg-blue-600"
                        onClick={() => handleViewReview(vocab)}
                      >
                        View & Review
                      </button>
                      <button
                        className="bg-red-500 text-white px-2 py-1 rounded hover:bg-red-600"
                        onClick={() => handleDeleteVocabulary(vocab.id)}
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            <div className="mt-4 flex justify-end">
              <button
                className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
                onClick={() => setCurrentPage(currentPage - 1)}
                disabled={currentPage === 1}
              >
                Previous
              </button>
              <span className="mx-4 py-2">{currentPage} / {Math.ceil(totalVocabularies / pageSize)}</span>
              <button
                className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
                onClick={() => setCurrentPage(currentPage + 1)}
                disabled={currentPage === Math.ceil(totalVocabularies / pageSize)}
              >
                Next
              </button>
            </div>
          </div>
        </div>
      </main>

      {isAddModalVisible && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white dark:bg-gray-700 rounded-lg shadow p-6 w-1/3 relative">
            <AddVocabulary
              onSave={handleAddVocabulary}
              onCancel={() => setIsAddModalVisible(false)}
            />
          </div>
        </div>
      )}
      <div className={isDetailModalVisible ? 'modal-content' : 'hidden'}>
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white dark:bg-gray-700 rounded-lg shadow p-6 w-1/3 relative">
            <EditVocabulary
              initialData={selectedVocabulary}
              onSave={handleSaveVocabulary}
              onCancel={handleModalCancel}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Flashcard;