"use client";

import { useEffect, useState } from "react";

type ClozeDataByLevel = {
  baseText: string;
  level: Record<
    "easy" | "medium" | "hard",
    { index: number; position: number; length: number }[]
  >;
};

type ClozeData = {
  baseText: string;
  blanks: { position: number; length: number }[];
};

const levelLabels: Record<"easy" | "medium" | "hard", string> = {
  easy: "Dễ",
  medium: "Vừa",
  hard: "Khó",
};

function ListeningStep4({
  clozeDataByLevel,
}: {
  clozeDataByLevel: ClozeDataByLevel;
}) {
  const [level, setLevel] = useState<"easy" | "medium" | "hard">("easy");
  const [userInputs, setUserInputs] = useState<string[]>([]);
  const [clozeData, setClozeData] = useState<ClozeData | null>(null);
  const [results, setResults] = useState<(boolean | null)[]>([]);

  useEffect(() => {
    const blanks = clozeDataByLevel.level[level];
    setClozeData({ baseText: clozeDataByLevel.baseText, blanks });
    setUserInputs(Array(blanks.length).fill(""));
    setResults(Array(blanks.length).fill(null));
  }, [level]);

  const handleChange = (i: number, val: string) => {
    const updated = [...userInputs];
    updated[i] = val;
    setUserInputs(updated);
  };

  const checkAnswers = () => {
    if (!clozeData) return;
    const expected = clozeData.blanks.map((blank) =>
      clozeData.baseText
        .substring(blank.position, blank.position + blank.length)
        .toLowerCase()
    );

    console.log(expected);

    const outcome = userInputs.map(
      (val, i) => val.trim().toLowerCase() === expected[i]
    );
    setResults(outcome);
  };

  if (!clozeData) return null;

  const renderTextWithInputs = () => {
    const parts: React.ReactNode[] = [];
    let lastIndex = 0;

    clozeData.blanks.forEach((blank, i) => {
      const before = clozeData.baseText.slice(lastIndex, blank.position);
      parts.push(<span key={`text-${i}`}>{before}</span>);
      parts.push(
        <input
          key={`input-${i}`}
          value={userInputs[i] || ""}
          onChange={(e) => handleChange(i, e.target.value)}
          className={`border-b mx-1 w-24 px-2 py-1 text-center rounded-sm text-sm outline-none transition-colors
            ${results[i] === true ? "border-green-500 bg-green-100" : ""}
            ${results[i] === false ? "border-red-500 bg-red-100" : ""}`}
        />
      );
      lastIndex = blank.position + blank.length;
    });

    parts.push(<span key="end">{clozeData.baseText.slice(lastIndex)}</span>);
    return parts;
  };

  return (
    <div className="p-4 w-full space-y-4">
      <div className="space-x-2">
        <label className="font-medium">Lựa chọn độ khó:</label>
        {["easy", "medium", "hard"].map((opt) => (
          <button
            key={opt}
            onClick={() => setLevel(opt as "easy" | "medium" | "hard")}
            className={`p-1 rounded ${
              level === opt ? "bg-blue-600 text-white" : ""
            }`}
          >
            {levelLabels[opt as "easy" | "medium" | "hard"]}
          </button>
        ))}
      </div>

      <div className="p-4 rounded text-gray-800 leading-relaxed">
        {renderTextWithInputs()}
      </div>

      <button
        className="p-1 rounded bg-blue-600 text-white"
        onClick={checkAnswers}
      >
        Kiểm tra đáp án
      </button>
    </div>
  );
}

export default ListeningStep4;
