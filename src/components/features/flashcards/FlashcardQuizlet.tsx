"use client";

import "./FlashcardQuizlet.css";

import { motion, AnimatePresence } from "framer-motion";
import {
  Volume2,
  RefreshCcw,
  SkipBack,
  SkipForward,
  RotateCcw,
  Play,
  Pause,
  Star,
} from "lucide-react";
import Image from "next/image";
import { useEffect, useState } from "react";

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
  //   const [flashcards, setFlashcards] = useState<Flashcard[] | null>(null);
  const flashcards: Flashcard[] = [
    {
      id: 7,
      word: "clean",
      meaning: "Free from dirt or mess.",
      example: "She likes to keep her room clean.",
      image_url: "clean.jpg",
      pronunciation: "/kliːn/",
      speech_audio_url: "clean.mp3",
    },
    {
      id: 8,
      word: "close",
      meaning: "To shut something.",
      example: "Please close the door when you leave.",
      image_url: "close.png",
      pronunciation: "/kloʊz/",
      speech_audio_url: "close.mp3",
    },
    {
      id: 12,
      word: "dream",
      meaning: "Thoughts during sleep or a goal.",
      example: "I had a strange dream last night.",
      image_url: "dream.jpg",
      pronunciation: "/driːm/",
      speech_audio_url: "dream.mp3",
    },
    {
      id: 14,
      word: "make",
      meaning: "To create or build something.",
      example: "Let’s make a cake together.",
      image_url: "make.jpg",
      pronunciation: "/meɪk/",
      speech_audio_url: "make.mp3",
    },
    {
      id: 17,
      word: "right",
      meaning: "Correct or a direction.",
      example: "You were right about the answer.",
      image_url: "right.jpg",
      pronunciation: "/raɪt/",
      speech_audio_url: "right.mp3",
    },
    {
      id: 18,
      word: "small",
      meaning: "Not large in size.",
      example: "That’s a small dog.",
      image_url: "small.jpg",
      pronunciation: "/smɔːl/",
      speech_audio_url: "small.mp3",
    },
    {
      id: 19,
      word: "so",
      meaning: "To a great extent.",
      example: "I am so happy today.",
      image_url: "so.jpg",
      pronunciation: "/soʊ/",
      speech_audio_url: "so.mp3",
    },
    {
      id: 20,
      word: "some",
      meaning: "An unspecified amount.",
      example: "I have some cookies to share.",
      image_url: "some.jpg",
      pronunciation: "/sʌm/",
      speech_audio_url: "some.mp3",
    },
    {
      id: 21,
      word: "stone",
      meaning: "A hard, solid material.",
      example: "He threw a stone into the lake.",
      image_url: "stone.jpg",
      pronunciation: "/stoʊn/",
      speech_audio_url: "stone.mp3",
    },
    {
      id: 23,
      word: "there",
      meaning: "In that place.",
      example: "The book is over there.",
      image_url: "there.jpg",
      pronunciation: "/ðer/",
      speech_audio_url: "there.mp3",
    },
  ];
  const [index, setIndex] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);
  const [shuffled, setShuffled] = useState(false);
  const [autoPlay, setautoPlay] = useState(false);

  const current = flashcards[index];

  useEffect(() => {
    if (!autoPlay) return;

    let flipTimer: NodeJS.Timeout;
    let nextTimer: NodeJS.Timeout;

    flipTimer = setTimeout(() => {
      setIsFlipped(true);

      nextTimer = setTimeout(() => {
        setIndex((prev) => prev + 1);
        setIsFlipped(false); // reset flip cho thẻ mới
      }, 3000); // thời gian chờ sau khi flip
    }, 3000); // thời gian chờ trước khi flip

    return () => {
      clearTimeout(flipTimer);
      clearTimeout(nextTimer);
    };
  }, [index, autoPlay]);

  const handleNext = () => {
    setIndex((prev) => (prev + 1) % flashcards.length);
    setIsFlipped(false);
  };

  const handleBack = () => {
    setIndex((prev) => (prev - 1 + flashcards.length) % flashcards.length);
    setIsFlipped(false);
  };

  const handleShuffle = () => {
    // const shuffledCards = [...cards].sort(() => Math.random() - 0.5);
    setIndex(0);
    setIsFlipped(false);
    setShuffled(true);
  };

  const handleSpeak = () => {
    const audio = new Audio(`/flashcards/${current.speech_audio_url}`);
    audio.play();
  };

  return (
    <div className="max-w-3xl mx-auto px-4">
      {/* Flashcard */}
      {/* <div
        className="relative h-96 rounded-3xl shadow-lg bg-white text-center select-none"
        onClick={() => setIsFlipped((f) => !f)}
      >
        <AnimatePresence mode="wait">
          <motion.div
            key={isFlipped ? "back" : "front"}
            initial={{ rotateX: -90 }}
            animate={{ rotateX: 0 }}
            exit={{ rotateX: -90 }}
            transition={{ duration: 0.5 }}
            className="absolute inset-0 flex flex-col justify-between p-6 backface-hidden"
          >
            {!isFlipped ? (
              <>
                <div className="flex justify-end text-sm text-gray-500">
                  <Volume2
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
                  <Star className="w-5 h-5" />
                </div>
              </>
            ) : (
              <>
                <div className="text-sm text-gray-500">
                  {current.pronunciation}
                </div>
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
              </>
            )}
          </motion.div>
        </AnimatePresence>
      </div> */}
      <motion.div
        animate={{ rotateX: isFlipped ? 180 : 0 }}
        transition={{ duration: 0.6 }}
        className="relative h-96 w-full rounded-3xl shadow-lg bg-white text-center select-none perspective preserve-3d"
        onClick={() => setIsFlipped((f) => !f)}
      >
        {/* Mặt trước */}
        <div className="absolute inset-0 backface-hidden p-6 flex flex-col justify-between">
          <div className="flex justify-end text-sm text-gray-500">
            <Volume2
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
            <Star className="w-5 h-5" />
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
          <RefreshCcw className="w-6 h-6" />
        </button>
        <div className="flex items-center gap-4">
          <button onClick={handleBack}>
            <SkipBack className="w-6 h-6" />
          </button>
          <span className="text-gray-700 font-medium">
            {index + 1} / {flashcards.length}
          </span>
          <button onClick={handleNext}>
            <SkipForward className="w-6 h-6" />
          </button>
        </div>
        <button onClick={() => setautoPlay((a) => !a)}>
          {autoPlay ? (
            <Pause className="w-6 h-6 text-blue-500" />
          ) : (
            <Play className="w-6 h-6 text-gray-500" />
          )}
        </button>
      </div>
    </div>
  );
}
