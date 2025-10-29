"use client";

import { useState } from "react";
import { PauseIcon, PlayIcon } from "@heroicons/react/24/outline";

export default function ListeningStep3({
  audioRef,
}: {
  audioRef: React.RefObject<HTMLAudioElement>;
}) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [playbackRate, setPlaybackRate] = useState(1);

  const handleChangeSpeed = (rate: number) => {
    if (audioRef.current) {
      audioRef.current.playbackRate = rate;
      audioRef.current.currentTime = 0;
      audioRef.current.play();
      setPlaybackRate(rate);
      setIsPlaying(true);
    }
  };

  const handleReplay = () => {
    if (!audioRef.current) return;

    if (isPlaying) {
      audioRef.current.pause();
      setIsPlaying(false);
    } else {
      audioRef.current.currentTime = 0;
      audioRef.current.play();
      setIsPlaying(true);

      audioRef.current.onended = () => {
        audioRef.current!.currentTime = 0;
        audioRef.current!.play();
      };
    }
  };

  return (
    <div className="p-4 w-full space-y-4">
      <p className="text-gray-600">
        Luyện nghe với tốc độ nhanh dần sẽ làm tăng phản xạ nghe của bạn.
      </p>

      <div className="flex justify-center space-x-4 mt-4">
        {[1, 1.25, 1.5, 2].map((rate) => (
          <button
            key={rate}
            onClick={() => handleChangeSpeed(rate)}
            className={`p-1 rounded ${
              rate === playbackRate ? "bg-blue-600 text-white" : ""
            }`}
          >
            {rate}x
          </button>
        ))}
      </div>
      <button
        onClick={handleReplay}
        className="w-[50px] h-[50px] m-auto rounded-full bg-green-600 text-white flex items-center justify-center gap-2"
      >
        {isPlaying ? (
          <PauseIcon className="h-5 w-5" />
        ) : (
          <PlayIcon className="h-5 w-5" />
        )}
      </button>
    </div>
  );
}
