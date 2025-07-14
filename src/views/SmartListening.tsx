"use client";

import { useEffect, useRef, useState } from "react";
import { usePathname } from "next/navigation";

import FullPageLoading from "@/components/features/FullPageLoading";

import {
  ListeningStep1,
  ListeningStep2,
  ListeningStep3,
  ListeningStep4,
} from "@/components/features/listening";
import { useRouteLoading } from "@/contexts/RouteLoadingContext";
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

  const pathname = usePathname();
  const { routeLoading, setRouteLoading } = useRouteLoading();

  const [notFound, setNotFound] = useState(false);
  const [openStep, setOpenStep] = useState<number | null>(null);
  const [data, setData] = useState<TranscriptData | null>(null);

  const toggleStep = (step: number) => {
    setOpenStep((prev) => (prev === step ? null : step));
  };

  const fetchData = async (audio_id: string) => {
    setRouteLoading(
      pathname ?? `/practice-listening-transript/${audio_id}`,
      true
    );
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
      setRouteLoading(
        pathname ?? `/practice-listening-transript/${audio_id}`,
        false
      );
    }
  };

  useEffect(() => {
    if (audio_id) {
      fetchData(audio_id);
    }
  }, [audio_id]);

  if (routeLoading[pathname ?? `/practice-listening-transript/${audio_id}`]) {
    return <FullPageLoading />;
  }

  if (notFound) {
    return (
      <div className="text-center text-red-600 font-semibold p-8">
        Không tìm thấy nội dung audio tương ứng.
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto space-y-4 px-3 sm:px-6 lg:px-8">
      <h1 className="text-2xl font-bold text-center text-blue-800 mb-4">
        Luyện nghe thông minh
      </h1>

      <audio
        ref={audioRef}
        src={`${data?.audio_path}`}
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
