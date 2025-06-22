"use client";

import { useEffect, useRef, useState } from "react";
import { toast } from "react-hot-toast";

import API_ENDPOINTS from "@/constants/api";

export default function AddFlashcard({ text }: { text: string }) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [meaning, setMeaning] = useState("");
  const [example, setExample] = useState("");
  const [loading, setLoading] = useState(false);
  const [selectedContext, setSelectedContext] = useState("");
  const [selectedWord, setSelectedWord] = useState<string | null>(null);
  const [position, setPosition] = useState<{ x: number; y: number } | null>(
    null
  );

  const commonContexts = [
    { value: "business", label: "Business English" },
    { value: "academic", label: "Academic Writing" },
    { value: "casual", label: "Casual Conversation" },
    { value: "travel", label: "Travel Situations" },
    { value: "technical", label: "Technical English" },
    { value: "medical", label: "Medical English" },
    { value: "slang", label: "Slang/Informal" },
    { value: "literature", label: "Literary English" },
  ];

  const validateForm = () => {
    if (!meaning.trim()) {
      toast.error("Vui lòng nhập nghĩa tiếng Việt");
      return false;
    }
    if (!selectedContext) {
      toast.error("Vui lòng chọn ngữ cảnh");
      return false;
    }
    if (!example.trim()) {
      toast.error("Vui lòng nhập câu ví dụ");
      return false;
    }
    if (example.trim().length < 10) {
      toast.error("Câu ví dụ cần ít nhất 10 ký tự");
      return false;
    }
    return true;
  };

  const handleAdd = async () => {
    if (!validateForm()) return;

    setLoading(true);
    try {
      const response = await fetch(API_ENDPOINTS.VOCABULARIES.CREATE, {
        method: "POST",
        body: JSON.stringify({
          word: selectedWord,
          meaning,
          context: selectedContext,
          example,
        }),
        headers: { "Content-Type": "application/json" },
      });

      if (!response.ok) throw new Error("Failed to add flashcard");

      const result = await response.json();

      if (
        response.status === 200 &&
        result.message?.includes("already exists")
      ) {
        toast.success("Flashcard của bạn đã sẵn sàng!");
      } else if (response.status === 201) {
        toast.success("Flashcard của bạn đang đợi duyệt!");
      } else {
        toast.success("Thêm flashcard thành công!");
      }

      handleClosePopover();
    } catch {
      toast.error("Nhập flashcard thất bại");
    } finally {
      setLoading(false);
    }
  };

  const handleClosePopover = () => {
    setSelectedWord(null);
    setMeaning("");
    setExample("");
    setSelectedContext("");
    setPosition(null);
  };

  useEffect(() => {
    // e: MouseEvent
    const handleMouseUp = () => {
      const selection = window.getSelection();
      const selectedText = selection?.toString().trim();

      if (!selectedText || selectedText.split(" ").length > 3) return;

      const range = selection?.getRangeAt(0);

      const rect = range?.getBoundingClientRect();

      if (!rect) return;

      setSelectedWord(selectedText);
      setPosition({ x: rect.left, y: rect.top });
      selection?.removeAllRanges();
    };

    const container = containerRef.current;
    container?.addEventListener("mouseup", handleMouseUp);

    return () => {
      container?.removeEventListener("mouseup", handleMouseUp);
    };
  }, []);

  return (
    <div
      ref={containerRef}
      className="p-4 bg-gray-50 rounded border text-gray-800 whitespace-pre-wrap cursor-text transitive"
    >
      <p>{text.replace(/\n/g, "\n")}</p>
      {selectedWord && position && (
        <div
          className="absolute z-50 bg-white border shadow-lg rounded-lg p-4 w-80 space-y-2"
          style={{ top: position.y - 350, left: position.x }}
        >
          <h4 className="font-semibold text-sm">Thêm Flashcard</h4>
          <div>
            <label className="text-xs text-gray-500">Từ vựng tiếng anh</label>
            <input
              className="w-full border px-2 py-1 rounded text-sm"
              value={selectedWord}
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
              Ngữ cảnh
            </label>
            <select
              className="w-full border px-2 py-1 rounded text-sm"
              value={selectedContext}
              onChange={(e) => setSelectedContext(e.target.value)}
            >
              <option value="">Lựa chọn ngữ cảnh...</option>
              {commonContexts.map((context) => (
                <option key={context.value} value={context.value}>
                  {context.label}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="text-xs text-gray-500 flex justify-between">
              Câu ví dụ
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
              onClick={handleClosePopover}
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
      )}
    </div>
  );
}
