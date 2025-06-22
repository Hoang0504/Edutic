"use client";

import { useState } from "react";
import {
  ChatBubbleLeftRightIcon,
  BookOpenIcon,
  EyeIcon,
  EyeSlashIcon,
  SpeakerWaveIcon,
  SpeakerXMarkIcon,
  ChevronRightIcon,
  ChevronLeftIcon,
} from "@heroicons/react/24/outline";
import Dictionary from "../features/Dictionary";
import { useDictionary } from "@/context/DictionaryContext";

export default function RightSidebar() {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [isMusicOn, setIsMusicOn] = useState(true);
  const [isFocusMode, setIsFocusMode] = useState(false);
  const { showDictionary, toggleDictionary } = useDictionary();

  const toggleSidebar = () => {
    setIsCollapsed(!isCollapsed);
  };

  const toggleMusic = () => {
    setIsMusicOn(!isMusicOn);
  };

  const toggleFocusMode = () => {
    setIsFocusMode(!isFocusMode);
  };

  const handleDictionaryClick = () => {
    toggleDictionary();
  };

  const sidebarItems = [
    {
      id: "messenger",
      icon: ChatBubbleLeftRightIcon,
      label: "Messenger",
      color: "bg-blue-500 hover:bg-blue-600",
      onClick: () => console.log("Messenger clicked"),
    },
    {
      id: "dictionary",
      icon: BookOpenIcon,
      label: "Từ điển",
      color: "bg-green-500 hover:bg-green-600",
      onClick: handleDictionaryClick,
    },
    {
      id: "focus-mode",
      icon: isFocusMode ? EyeSlashIcon : EyeIcon,
      label: isFocusMode ? "Tắt chế độ tập trung" : "Chế độ tập trung",
      color: isFocusMode
        ? "bg-red-500 hover:bg-red-600"
        : "bg-purple-500 hover:bg-purple-600",
      onClick: toggleFocusMode,
    },
    {
      id: "music",
      icon: isMusicOn ? SpeakerWaveIcon : SpeakerXMarkIcon,
      label: isMusicOn ? "Tắt nhạc" : "Bật nhạc",
      color: isMusicOn
        ? "bg-orange-500 hover:bg-orange-600"
        : "bg-gray-500 hover:bg-gray-600",
      onClick: toggleMusic,
    },
  ];

  if (isCollapsed) {
    return (
      <div className="fixed right-2 sm:right-4 bottom-4 sm:top-1/2 sm:transform sm:-translate-y-1/2 z-40">
        <button
          onClick={toggleSidebar}
          className="w-10 h-10 sm:w-10 sm:h-10 bg-gray-600 hover:bg-gray-700 text-white rounded-full shadow-lg transition-all duration-200 flex items-center justify-center hover:scale-110"
          title="Mở sidebar"
        >
          <ChevronLeftIcon className="w-5 h-5" />
        </button>
      </div>
    );
  }

  return (
    <div className="fixed right-2 sm:right-4 bottom-4 sm:top-1/2 sm:transform sm:-translate-y-1/2 z-40 space-y-2 sm:space-y-3">
      {showDictionary && <Dictionary />}

      {/* Nút thu gọn */}
      <div className="flex justify-end">
        <button
          onClick={toggleSidebar}
          className="w-8 h-8 bg-gray-600 hover:bg-gray-700 text-white rounded-full shadow-md transition-all duration-200 flex items-center justify-center hover:scale-110"
          title="Thu gọn sidebar"
        >
          <ChevronRightIcon className="w-4 h-4" />
        </button>
      </div>

      {/* Sidebar Items */}
      {sidebarItems.map((item) => {
        const IconComponent = item.icon;
        return (
          <div key={item.id} className="group relative">
            <button
              onClick={item.onClick}
              className={`
                w-11 h-11 sm:w-12 sm:h-12 rounded-full text-white shadow-lg transition-all duration-200 
                flex items-center justify-center hover:scale-110 touch-manipulation
                ${item.color}
              `}
              title={item.label}
            >
              <IconComponent className="w-5 h-5 sm:w-6 sm:h-6" />
            </button>

            {/* Tooltip - Hidden on mobile, shown on hover for desktop */}
            <div
              className="
              hidden sm:block absolute right-14 top-1/2 transform -translate-y-1/2 
              bg-gray-800 text-white text-xs rounded py-1 px-2 
              opacity-0 group-hover:opacity-100 transition-opacity duration-200
              pointer-events-none whitespace-nowrap
            "
            >
              {item.label}
              <div className="absolute left-full top-1/2 transform -translate-y-1/2 border-l-4 border-l-gray-800 border-y-4 border-y-transparent"></div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
