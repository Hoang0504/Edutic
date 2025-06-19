"use client";

import { useEffect, useRef, useState } from "react";

import {
  ListeningStep1,
  ListeningStep2,
  ListeningStep3,
  ListeningStep4,
} from "@/components/features/Listening";
import { ChevronDownIcon, ChevronRightIcon } from "@heroicons/react/24/outline";

type ClozeLevel = {
  index: number;
  position: number;
  length: number;
};

type TranscriptData = {
  audio_path: string;
  transcript: string;
  vietnameseTranscript: string;
  level: {
    easy: ClozeLevel[];
    medium: ClozeLevel[];
    hard: ClozeLevel[];
  };
};

function SmartListening({ audio_id }: { audio_id: string }) {
  const audioRef = useRef<HTMLAudioElement>(null);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);
  const [openStep, setOpenStep] = useState<number | null>(null);
  const [data, setData] = useState<TranscriptData | null>(null);

  const toggleStep = (step: number) => {
    setOpenStep((prev) => (prev === step ? null : step));
  };

  const fetchData = async (audio_id: string) => {
    try {
      const res = await fetch(`/api/listening-transcripts/${audio_id}`);
      const result = await res.json();

      if (result?.message === "Audio file not found") {
        setNotFound(true);
        setData(null);
      } else {
        setData(result);
        setNotFound(false);
      }
    } catch (error) {
      console.error("Error fetching transcript data:", error);
      setNotFound(true);
      setData(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (audio_id) {
      fetchData(audio_id);
    }
  }, [audio_id]);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-60 text-gray-600">
        <svg
          className="animate-spin h-6 w-6 mr-2 text-blue-500"
          viewBox="0 0 24 24"
        >
          <circle
            className="opacity-25"
            cx="12"
            cy="12"
            r="10"
            stroke="currentColor"
            strokeWidth="4"
            fill="none"
          />
          <path
            className="opacity-75"
            fill="currentColor"
            d="M4 12a8 8 0 018-8v8z"
          />
        </svg>
        Đang tải dữ liệu...
      </div>
    );
  }

  if (notFound) {
    return (
      <div className="text-center text-red-600 font-semibold p-8">
        Không tìm thấy nội dung audio tương ứng.
      </div>
    );
  }

  // const clozeDataByLevel = {
  //   baseText:
  //     "1. (A) She’s eating in a picnic area. (B) She’s waiting in line at a food truck. (C) She’s wiping off a bench. (D) She’s throwing away a plate.  2. (A) The man is brushing snow off the roof of a car. (B) The man is standing in the snow beside a car. (C) The man is shoveling snow from a walkway. (D) The man is running through the snow.  3. (A) Some workers are hanging art in a gallery. (B) Two of the people are having a conversation. (C) One of the men is rearranging cushions on a sofa. (D) One of the men is painting a picture.  4. (A) Vehicles are entering a parking garage. (B) Clothes hangers are scattered on the ground. (C) Empty racks are lined up next to a building. (D) Clothing is being displayed under a tent.  5. (A) Potted plants have been suspended from a ceiling. (B) Chairs have been stacked in front of an entryway. (C) A computer station has been set up on a desk. (D) A rug has been rolled up against a wall.  6. (A) One of the men is sweeping a patio. (B) One of the men is replacing some flooring. (C) A door has been taken off its frame. (D) A light fixture has been left on the ground.",

  //   level: {
  //     easy: [
  //       { index: 0, position: 11, length: 6 }, // eating
  //       { index: 1, position: 116, length: 8 }, // brushing
  //     ],
  //     medium: [
  //       { index: 0, position: 11, length: 6 }, // eating
  //       { index: 1, position: 116, length: 8 }, // brushing
  //       { index: 2, position: 237, length: 9 }, // shoveling
  //     ],
  //     hard: [
  //       { index: 0, position: 11, length: 6 }, // eating
  //       { index: 1, position: 116, length: 8 }, // brushing
  //       { index: 2, position: 237, length: 9 }, // shoveling
  //       { index: 3, position: 408, length: 8 }, // entering
  //       { index: 4, position: 696, length: 9 }, // sweeping
  //     ],
  //   },
  // };

  return (
    <div className="max-w-7xl mx-auto space-y-4 px-3 sm:px-6 lg:px-8">
      <h1 className="text-2xl font-bold text-center text-blue-800 mb-4">
        Luyện nghe thông minh
      </h1>

      <audio
        ref={audioRef}
        src={`/exam_audio/${data?.audio_path}`}
        controls
        className="w-full rounded"
      />

      {/* Step 1 */}
      <div
        className={`border rounded-lg ${
          openStep === 1 ? "border-blue-500" : "border-gray-200"
        }`}
      >
        <div
          className="flex justify-between items-center p-4 cursor-pointer"
          onClick={() => toggleStep(1)}
        >
          <h2
            className={`text-lg font-semibold ${
              openStep === 1 ? "text-blue-600" : "text-gray-800"
            }`}
          >
            Bước 1: Nghe thử
          </h2>
          {openStep === 1 ? (
            <ChevronDownIcon height={20} width={20} />
          ) : (
            <ChevronRightIcon height={20} width={20} />
          )}
        </div>
        {openStep === 1 && (
          <div className="p-4 border-t">
            <ListeningStep1 />
          </div>
        )}
      </div>

      {/* Step 2 */}
      <div
        className={`border rounded-lg ${
          openStep === 2 ? "border-blue-500" : "border-gray-200"
        }`}
      >
        <div
          className="flex justify-between items-center p-4 cursor-pointer"
          onClick={() => toggleStep(2)}
        >
          <h2
            className={`text-lg font-semibold ${
              openStep === 2 ? "text-blue-600" : "text-gray-800"
            }`}
          >
            Bước 2: Nghe và đọc transcript
          </h2>
          {openStep === 2 ? (
            <ChevronDownIcon height={20} width={20} />
          ) : (
            <ChevronRightIcon height={20} width={20} />
          )}
        </div>
        {openStep === 2 && (
          <div className="p-4 border-t">
            <ListeningStep2
              transcript={data?.transcript || ""}
              transcriptVi={data?.vietnameseTranscript || ""}
            />
          </div>
        )}
      </div>

      {/* Step 3 */}
      <div
        className={`border rounded-lg ${
          openStep === 3 ? "border-blue-500" : "border-gray-200"
        }`}
      >
        <div
          className="flex justify-between items-center p-4 cursor-pointer"
          onClick={() => toggleStep(3)}
        >
          <h2
            className={`text-lg font-semibold ${
              openStep === 3 ? "text-blue-600" : "text-gray-800"
            }`}
          >
            Bước 3: Nghe điều chỉnh tốc độ và lặp lại nhiều lần
          </h2>
          {openStep === 4 ? (
            <ChevronDownIcon height={20} width={20} />
          ) : (
            <ChevronRightIcon height={20} width={20} />
          )}
        </div>
        {openStep === 3 && (
          <div className="p-4 border-t">
            <ListeningStep3 audioRef={audioRef} />
          </div>
        )}
      </div>

      {/* Step 4 */}
      <div
        className={`border rounded-lg ${
          openStep === 4 ? "border-blue-500" : "border-gray-200"
        }`}
      >
        <div
          className="flex justify-between items-center p-4 cursor-pointer"
          onClick={() => toggleStep(4)}
        >
          <h2
            className={`text-lg font-semibold ${
              openStep === 4 ? "text-blue-600" : "text-gray-800"
            }`}
          >
            Bước 4: Nghe điền từ theo độ khó
          </h2>
          {openStep === 4 ? (
            <ChevronDownIcon height={20} width={20} />
          ) : (
            <ChevronRightIcon height={20} width={20} />
          )}
        </div>
        {openStep === 4 && (
          <div className="p-4 border-t">
            <ListeningStep4
              clozeDataByLevel={{
                baseText: data?.transcript || "",
                level: data?.level ?? { easy: [], medium: [], hard: [] },
              }}
            />
          </div>
        )}
      </div>
    </div>
  );
}

export default SmartListening;
