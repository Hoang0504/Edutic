"use client";

import Image from "next/image";
import { useEffect, useState } from "react";
import { motion } from "framer-motion";

import API_ENDPOINTS from "@/constants/api";

import FullPageLoading from "../FullPageLoading";

import {
  PauseIcon,
  PlayIcon,
  SpeakerWaveIcon,
} from "@heroicons/react/24/solid";
import {
  ArrowPathIcon,
  BackwardIcon,
  ForwardIcon,
  StarIcon,
} from "@heroicons/react/24/outline";
import { useQueryParams } from "@/hooks";

interface Flashcard {
  id: number;
  word: string;
  meaning: string;
  example: string;
  image_url: string;
  pronunciation: string;
  speech_audio_url: string;
}

export default function FlashcardQuizlet() {
  const { context, user_id, date, set } = useQueryParams();

  const [index, setIndex] = useState(0);
  const [error, setError] = useState<string | null>(null);
  const [isFlipped, setIsFlipped] = useState(false);
  const [autoPlay, setautoPlay] = useState(false);
  const [flashcards, setFlashcards] = useState<Flashcard[]>([]);

  const current = flashcards[index];

  useEffect(() => {
    if (!autoPlay) return;

    let flipTimer: NodeJS.Timeout;
    let nextTimer: NodeJS.Timeout;

    flipTimer = setTimeout(async () => {
      await handleSpeak();
      setIsFlipped(true);

      nextTimer = setTimeout(() => {
        setIndex((prev) => (prev + 1) % flashcards.length);
        setIsFlipped(false); // reset flip cho thẻ mới
      }, 3000); // thời gian chờ sau khi flip
    }, 3000); // thời gian chờ trước khi flip

    return () => {
      clearTimeout(flipTimer);
      clearTimeout(nextTimer);
    };
  }, [index, autoPlay]);

  useEffect(() => {
    const fetchData = async () => {
      if ((!context && !date) || (date && !user_id)) {
        setError("Không có từ vựng nào tồn tại");
        return;
      }

      try {
        const url = context
          ? API_ENDPOINTS.VOCABULARIES.BY_CONTEXT(context, user_id || "", set)
          : API_ENDPOINTS.VOCABULARIES.BY_DATE(user_id, date, set);

        const res = await fetch(url);
        const result = await res.json();

        // console.log(result);

        if (!res.ok || result.length === 0) {
          setError("Không có từ vựng nào tồn tại");
        }

        setFlashcards(result);
        setError(null);
      } catch (error) {
        console.error("Error fetching flashcard data:", error);
      }
    };

    fetchData();
  }, []);

  const handleNext = () => {
    setIndex((prev) => (prev + 1) % flashcards.length);
    setIsFlipped(false);
  };

  const handleBack = () => {
    setIndex((prev) => (prev - 1 + flashcards.length) % flashcards.length);
    setIsFlipped(false);
  };

  const handleShuffle = () => {
    const shuffledCards = [...flashcards].sort(() => Math.random() - 0.5);
    setFlashcards(shuffledCards);
    setIndex(0);
    setIsFlipped(false);
  };

  const handleSpeak = async () => {
    const audio = new Audio(`/flashcards/${current.speech_audio_url}`);
    await audio.play();
  };

  if (error) {
    return (
      <div className="text-red-600 font-semibold text-center">{error}</div>
    );
  }

  if (!flashcards.length || !current) {
    return <FullPageLoading />;
  }

  return (
    <div className="max-w-3xl mx-auto px-4">
      {/* Flashcard */}
      <motion.div
        key={`${index}-${isFlipped}`}
        animate={{ rotateX: isFlipped ? 180 : 0 }}
        transition={{ duration: 0.6 }}
        className="relative h-96 w-full rounded-3xl shadow-lg bg-white text-center select-none perspective preserve-3d cursor-pointer"
        onClick={() => setIsFlipped((f) => !f)}
      >
        {/* Mặt trước */}
        <div className="absolute inset-0 backface-hidden p-6 flex flex-col justify-between">
          <div className="flex justify-end text-sm text-gray-500">
            <SpeakerWaveIcon
              className="w-5 h-5 cursor-pointer"
              onClick={(e) => {
                e.stopPropagation();
                handleSpeak();
              }}
            />
          </div>
          <div className="flex-1 flex items-center justify-center">
            <h2 className="text-3xl font-semibold">{current.word}</h2>
          </div>
          <div className="flex justify-end text-gray-400">
            <StarIcon className="w-5 h-5" />
          </div>
        </div>

        {/* Mặt sau */}
        <div className="absolute inset-0 backface-hidden rotate-x-180 p-6 flex flex-col justify-between">
          <div className="text-sm text-gray-500">{current.pronunciation}</div>
          <div className="text-lg font-semibold text-gray-800">
            {current.meaning}
          </div>
          <div className="text-gray-500 italic">"{current.example}"</div>
          <div className="flex justify-center">
            <Image
              src={`/flashcards/${current.image_url}`}
              width={0}
              height={0}
              sizes="100vw"
              className="w-auto h-40 object-contain rounded-xl"
              alt="flashcard visual"
            />
          </div>
        </div>
      </motion.div>

      {/* Controls */}
      <div className="flex items-center justify-between mt-6">
        <button onClick={handleShuffle}>
          <ArrowPathIcon className="w-6 h-6" />
        </button>
        <div className="flex items-center gap-4">
          <button onClick={handleBack}>
            <BackwardIcon className="w-6 h-6" />
          </button>
          <span className="text-gray-700 font-medium">
            {index + 1} / {flashcards.length}
          </span>
          <button onClick={handleNext}>
            <ForwardIcon className="w-6 h-6" />
          </button>
        </div>
        <button onClick={() => setautoPlay((a) => !a)}>
          {autoPlay ? (
            <PauseIcon className="w-6 h-6 text-blue-500" />
          ) : (
            <PlayIcon className="w-6 h-6 text-gray-500" />
          )}
        </button>
      </div>
    </div>
  );
}
