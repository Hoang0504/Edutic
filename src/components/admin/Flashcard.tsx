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
  const [totalPages, setTotalPages] = useState(1);
  const [totalItems, setTotalItems] = useState(0);
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
        const query = new URLSearchParams({
          page: currentPage.toString(),
          limit: '10',
          word: filterKeyword,
          context: filterContext,
          status: filterStatus,
        });

        const response = await fetch(`/api/admin/vocabularies?${query.toString()}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (!response.ok) throw new Error('Failed to fetch vocabularies');
        const data = await response.json();
        setVocabularies(data.data);
        setTotalPages(data.totalPages);
        setTotalItems(data.totalItems);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Unknown error');
      } finally {
        setLoading(false);
      }
    };
    fetchVocabularies();
  }, [currentPage, filterKeyword, filterContext, filterStatus]);

  const handleModalCancel = () => setIsDetailModalVisible(false);
  const handleLogoutAdmin = () => router.push('/admin/login');

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

      const response = await fetch('/api/admin/vocabularies', {
        method: 'POST',
        headers: { Authorization: `Bearer ${token}` },
        body: formData,
      });
      if (!response.ok) throw new Error(await response.text());
      const newVocab = await response.json();
      setVocabularies((prev) => [newVocab, ...prev]);
      setIsAddModalVisible(false);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unknown error');
    } finally {
      setLoading(false);
    }
  };

  const handleViewReview = async (vocab: Vocabulary) => {
    setLoading(true);
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`/api/admin/vocabularies/${vocab.id}`, {
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
      const response = await fetch(`/api/admin/vocabularies/${data.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(data),
      });
      if (!response.ok) throw new Error('Failed to update vocabulary');
      const updatedData = await response.json();
      setVocabularies((prev) => prev.map((v) => (v.id === updatedData.id ? updatedData : v)));
      setIsDetailModalVisible(false);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unknown error');
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteVocabulary = async (id: number) => {
    if (!window.confirm('Are you sure you want to delete this vocabulary?')) return;
    setLoading(true);
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`/api/admin/vocabularies/${id}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` },
      });
      if (response.status === 204) {
        setVocabularies((prev) => prev.filter((vocab) => vocab.id !== id));
        setIsDetailModalVisible(false);
      } else {
        const data = await response.json();
        setError(data.message || 'Failed to delete vocabulary');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unknown error');
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
              onChange={(e) => { setFilterKeyword(e.target.value); setCurrentPage(1); }}
              className="p-2 border rounded text-black"
            />
            <select
              value={filterContext}
              onChange={(e) => { setFilterContext(e.target.value); setCurrentPage(1); }}
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
              onChange={(e) => { setFilterStatus(e.target.value); setCurrentPage(1); }}
              className="p-2 border rounded text-black"
            >
              <option value="All">All Statuses</option>
              <option value="Active">Active</option>
              <option value="Inactive">Inactive</option>
            </select>
          </div>
          <button
            className="flex items-center bg-gray-600 text-white px-4 py-2 rounded hover:bg-gray-700"
            onClick={handleLogoutAdmin}
          >
            Logout
          </button>
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
                {vocabularies.map((vocab) => (
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
                onClick={() => setCurrentPage((prev) => Math.max(1, prev - 1))}
                disabled={currentPage === 1}
              >
                Previous
              </button>
              <span className="mx-4 py-2">{currentPage} / {totalPages}</span>
              <button
                className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
                onClick={() => setCurrentPage((prev) => Math.min(totalPages, prev + 1))}
                disabled={currentPage === totalPages}
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
            <AddVocabulary onSave={handleAddVocabulary} onCancel={() => setIsAddModalVisible(false)} />
          </div>
        </div>
      )}

      {isDetailModalVisible && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white dark:bg-gray-700 rounded-lg shadow p-6 w-1/3 relative">
            <EditVocabulary
              initialData={selectedVocabulary}
              onSave={handleSaveVocabulary}
              onCancel={handleModalCancel}
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default Flashcard;