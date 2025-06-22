"use client";

import { useState } from "react";

import AddFlashcard from "../flashcards/AddFlashcard";

export default function ListeningStep2({
  transcript,
  transcriptVi,
}: {
  transcript: string;
  transcriptVi?: string;
}) {
  const [openSection, setOpenSection] = useState<"en" | "vi" | null>(null);

  const handleToggle = (section: "en" | "vi") => {
    setOpenSection((prev) => (prev === section ? null : section));
  };

  return (
    <div className="p-4 w-full space-y-4">
      <p className="text-gray-600">
        Nghe lại đoạn hội thoại và đọc theo transcript để hiểu rõ nội dung.
      </p>

      <div className="space-y-4">
        <div className="border-t pt-4">
          <button onClick={() => handleToggle("en")}>
            Hiện / Ẩn Transcript Tiếng Anh
          </button>
          {openSection === "en" && <AddFlashcard text={transcript} />}
        </div>

        <div className="border-t pt-4">
          <button onClick={() => handleToggle("vi")}>
            Hiện / Ẩn Transcript Tiếng Việt
          </button>
          {openSection === "vi" && (
            <div className="mt-2 bg-gray-50 p-4 rounded text-gray-800 whitespace-pre-wrap border">
              {transcriptVi && transcriptVi.replace(/\\n/g, "\n")}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
