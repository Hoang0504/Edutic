"use client";

import React, { useState, useEffect, useMemo } from "react";

import PartContent from "./PartContent";
import FullPageLoading from "../features/FullPageLoading";

import { useExamAttemptInfo } from "@/contexts/ExamAttemptInfoContext";

type LRExamProps = {
  activeSkill: "listening" | "reading" | "writing" | "speaking";
};

function LRExam({ activeSkill }: LRExamProps) {
  const [activePart, setActivePart] = useState<number | null>(null);

  const { data: examData } = useExamAttemptInfo();
  const parts = examData?.parts ?? [];

  const filteredParts = useMemo(
    () =>
      parts.filter((p) => {
        const skillMap: Record<string, string> = {
          l: "listening",
          r: "reading",
          w: "writing",
          s: "speaking",
        };

        return skillMap[p.skill] === activeSkill;
      }),
    [parts, activeSkill]
  );

  useEffect(() => {
    if (filteredParts.length > 0) {
      const firstPart = filteredParts[0];
      if (firstPart) {
        setActivePart(firstPart.part_id);
      }
    }
  }, [filteredParts, activeSkill]);

  if (filteredParts.length === 0) {
    return <FullPageLoading />;
  }

  return (
    <div className="space-y-6">
      {/* Parts Navigation */}
      <div className="bg-white rounded-lg shadow-sm border p-4">
        <div className="flex space-x-2">
          {filteredParts.map((p) => (
            <button
              key={p.part_id}
              onClick={() => setActivePart(p.part_id)}
              className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                activePart === p.part_id
                  ? "bg-blue-500 text-white"
                  : "bg-gray-100 text-gray-700 hover:bg-gray-200"
              }`}
            >
              Part {p.part_number}
            </button>
          ))}
        </div>
      </div>

      {activePart && <PartContent activePart={activePart} />}
    </div>
  );
}

export default LRExam;
