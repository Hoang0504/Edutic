"use client";

import { useState } from "react";

interface FlashcardPopoverProps {
  word: string;
  contextEn?: string;
  position: { x: number; y: number };
  onClose: () => void;
}

export default function FlashcardPopover({
  word,
  contextEn,
  position,
  onClose,
}: FlashcardPopoverProps) {
  const [meaning, setMeaning] = useState("");
  const [example, setExample] = useState("");
  const [loading, setLoading] = useState(false);

  const handleAdd = async () => {
    setLoading(true);
    try {
      // Replace with actual API call
      //   await fetch("/api/flashcards", {
      //     method: "POST",
      //     body: JSON.stringify({ word, meaning, example }),
      //     headers: { "Content-Type": "application/json" },
      //   });
      console.log("vào đây");

      //   onClose();
    } catch (e) {
      console.error("Failed to add flashcard", e);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="absolute z-50 bg-white border shadow-lg rounded-lg p-4 w-80 space-y-2"
      style={{ top: position.y - 30, left: position.x - 330 }}
    >
      <h4 className="font-semibold text-sm">Thêm Flashcard</h4>
      <div>
        <label className="text-xs text-gray-500">Từ vựng tiếng anh</label>
        <input
          className="w-full border px-2 py-1 rounded text-sm"
          value={word}
          readOnly
        />
      </div>
      <div>
        <label className="text-xs text-gray-500 flex justify-between">
          Nghĩa tiếng việt
        </label>
        <input
          className="w-full border px-2 py-1 rounded text-sm"
          value={meaning}
          onChange={(e) => setMeaning(e.target.value)}
        />
      </div>
      <div>
        <label className="text-xs text-gray-500 flex justify-between">
          Câu ví dụ
          {contextEn && (
            <button
              type="button"
              className="text-blue-500 text-xs"
              onClick={() => setExample(contextEn)}
            >
              Suggest
            </button>
          )}
        </label>
        <textarea
          rows={2}
          className="w-full border px-2 py-1 rounded text-sm"
          value={example}
          onChange={(e) => setExample(e.target.value)}
        />
      </div>
      <div className="flex justify-end gap-2 mt-2">
        <button
          className="text-sm text-gray-500 hover:underline"
          onClick={onClose}
        >
          Cancel
        </button>
        <button
          className="bg-blue-500 text-white px-3 py-1 rounded text-sm disabled:opacity-50"
          onClick={handleAdd}
          disabled={loading || !meaning || !example}
        >
          {loading ? "Saving..." : "Add"}
        </button>
      </div>
    </div>
  );
}
