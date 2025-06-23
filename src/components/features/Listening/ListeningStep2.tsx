"use client";

import { useState } from "react";

import FlashcardPopover from "./FlashcardPopover";
import SelectableTranscript from "./SelectableTranscript";
import { getContextLine } from "@/utils";

export default function ListeningStep2({
  transcript,
  transcriptVi,
}: {
  transcript: string;
  transcriptVi?: string;
}) {
  const [openSection, setOpenSection] = useState<"en" | "vi" | null>(null);
  const [selectedWord, setSelectedWord] = useState<string | null>(null);
  const [position, setPosition] = useState<{ x: number; y: number } | null>(
    null
  );

  const handleToggle = (section: "en" | "vi") => {
    setOpenSection((prev) => (prev === section ? null : section));
  };

  const handleSelectWord = (
    word: string,
    position: { x: number; y: number }
  ) => {
    console.log("Selected word:", word);
    console.log("Popup position:", position);
    setSelectedWord(word);
    setPosition(position);
    // Show FlashcardPopover here or trigger state
  };

  const handleClosePopover = () => {
    setSelectedWord(null);
    setPosition(null);
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
          {openSection === "en" && (
            <div className="relative">
              <SelectableTranscript
                text={transcript}
                onSelectWord={handleSelectWord}
              />

              {selectedWord && position && (
                <FlashcardPopover
                  word={selectedWord}
                  contextEn={getContextLine(transcript, selectedWord)}
                  position={position}
                  onClose={handleClosePopover}
                />
              )}
            </div>
          )}
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
