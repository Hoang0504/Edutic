"use client";

import { useEffect, useRef } from "react";

export default function SelectableTranscript({
  text,
  onSelectWord,
}: {
  text: string;
  onSelectWord: (word: string, position: { x: number; y: number }) => void;
}) {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleMouseUp = (e: MouseEvent) => {
      const selection = window.getSelection();
      const selectedText = selection?.toString().trim();

      if (!selectedText || selectedText.split(" ").length > 3) return;

      const range = selection?.getRangeAt(0);

      const rect = range?.getBoundingClientRect();

      if (!rect) return;

      if (e.shiftKey) {
        onSelectWord(selectedText, { x: rect.left, y: rect.top });
        selection?.removeAllRanges();
      }
    };

    const container = containerRef.current;
    container?.addEventListener("mouseup", handleMouseUp);

    return () => {
      container?.removeEventListener("mouseup", handleMouseUp);
    };
  }, [onSelectWord]);

  return (
    <div
      ref={containerRef}
      className="p-4 bg-gray-50 rounded border text-gray-800 whitespace-pre-wrap cursor-text"
    >
      {text.replace(/\n/g, "\n")}
    </div>
  );
}
