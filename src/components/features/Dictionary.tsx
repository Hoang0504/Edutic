"use client";

import { useState } from "react";

import { useDictionary } from "@/context/DictionaryContext";
import { useRouteLoading } from "@/context/RouteLoadingContext";
import { SpeakerWaveIcon, XMarkIcon } from "@heroicons/react/24/outline";

import FullPageLoading from "../features/FullPageLoading";

type DictionaryResult = {
  word: string;
  phonetics: Array<{
    text?: string;
    audioUrl?: string;
  }>;
  meanings: Array<{
    partOfSpeech: string;
    definitions: Array<{
      definition: string;
      example?: string;
    }>;
  }>;
} | null;

function Dictionary() {
  const { routeLoading, setRouteLoading } = useRouteLoading();

  const [message, setMessage] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const { showDictionary, toggleDictionary } = useDictionary();

  const [dictionaryResult, setDictionaryResult] =
    useState<DictionaryResult>(null);

  const closeDictionary = () => {
    toggleDictionary();
    setSearchTerm("");
    setDictionaryResult(null);
  };

  const searchDictionary = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchTerm.trim()) return;
    setMessage("");
    setDictionaryResult(null);
    setRouteLoading("/tra-cuu-tu-vung", true);
    try {
      const result: DictionaryResult = await fetchDictionaryData(searchTerm);

      setDictionaryResult(result);
    } catch (error) {
      console.error("Dictionary search failed:", error);
    } finally {
      setRouteLoading("/tra-cuu-tu-vung", false);
    }
  };

  const fetchDictionaryData = async (
    word: string
  ): Promise<DictionaryResult> => {
    try {
      const response = await fetch(
        `https://api.dictionaryapi.dev/api/v2/entries/en/${word}`
      );

      if (!response.ok) {
        if (response.status === 404) {
          setMessage(`Không tìm thấy từ "${word}" trong từ điển`);
        }
        console.log("Failed to fetch dictionary data");
      }

      const data = await response.json();
      const firstEntry = data[0];

      // Find the first phonetic with audio
      const phonetics =
        firstEntry.phonetics?.filter((p: any) => p.text || p.audio) || [];

      return {
        word: firstEntry.word,
        phonetics: phonetics.map((p: any) => ({
          text: p.text,
          audioUrl: p.audio,
        })),
        meanings: firstEntry.meanings.map((meaning: any) => ({
          partOfSpeech: meaning.partOfSpeech,
          definitions: meaning.definitions.map((def: any) => ({
            definition: def.definition,
            example: def.example || "",
          })),
        })),
      };
    } catch (error) {
      console.error("Dictionary API error:", error);
      setMessage(`Lỗi kết nối từ điển. Vui lòng thử lại sau.`);
      return null;
    }
  };

  if (showDictionary) {
    return (
      <div className="fixed right-0 top-0 w-full sm:w-96 rounded bg-gray-50 shadow-lg z-50 transform transition-all duration-300 ease-in-out">
        <div className="p-4 flex flex-col">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-bold text-gray-800">
              Từ điển Anh - Anh
            </h2>
            <button
              onClick={closeDictionary}
              className="p-1 rounded-full hover:bg-gray-200"
            >
              <XMarkIcon className="w-6 h-6 text-gray-600" />
            </button>
          </div>

          <form onSubmit={searchDictionary} className="mb-4">
            <div className="flex">
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Nhập từ cần tra..."
                className="flex-1 border border-gray-300 rounded-l-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-green-500"
              />
              <button
                type="submit"
                disabled={routeLoading["/tra-cuu-tu-vung"]}
                className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-r-lg disabled:opacity-50"
              >
                {routeLoading["/tra-cuu-tu-vung"] ? "Đang tìm..." : "Tra cứu"}
              </button>
            </div>
          </form>

          {routeLoading["/tra-cuu-tu-vung"] && <FullPageLoading />}

          {dictionaryResult && (
            <div className="flex-1 max-h-[400px] overflow-y-auto">
              <div className="mb-6">
                <div className="flex items-center gap-3 mb-1">
                  <h3 className="text-2xl font-bold">
                    {dictionaryResult.word}
                  </h3>
                </div>

                {/* Hiển thị tất cả phiên âm và nút phát âm thanh */}
                {dictionaryResult.phonetics.length > 0 && (
                  <div className="mb-4 space-y-2">
                    <h4 className="font-medium text-gray-700">Phiên âm:</h4>
                    <ul className="space-y-2">
                      {dictionaryResult.phonetics.map((phonetic, index) => (
                        <li key={index} className="flex items-center gap-3">
                          {phonetic.text && (
                            <span className="text-gray-600">
                              /{phonetic.text}/
                            </span>
                          )}
                          {phonetic.audioUrl && (
                            <button
                              onClick={() =>
                                new Audio(phonetic.audioUrl).play()
                              }
                              className="p-1 rounded-full hover:bg-gray-100 transition-colors"
                              aria-label="Phát âm thanh"
                            >
                              <SpeakerWaveIcon className="h-5 w-5 text-blue-500" />
                            </button>
                          )}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {/* Hiển thị các nghĩa của từ */}
                {dictionaryResult.meanings.length > 0 ? (
                  dictionaryResult.meanings.map((meaning, index) => (
                    <div key={index} className="mb-4">
                      <p className="text-lg font-semibold italic text-gray-700">
                        {meaning.partOfSpeech}
                      </p>
                      <ul className="list-disc pl-5 space-y-2">
                        {meaning.definitions.map((def, idx) => (
                          <li key={idx} className="text-gray-800">
                            <p>{def.definition}</p>
                            {def.example && (
                              <p className="text-gray-500 italic mt-1">
                                Ví dụ: "{def.example}"
                              </p>
                            )}
                          </li>
                        ))}
                      </ul>
                    </div>
                  ))
                ) : (
                  <p className="text-gray-500 italic">
                    Không tìm thấy định nghĩa cho từ này
                  </p>
                )}
              </div>
            </div>
          )}

          {message && <p className="text-gray-500 italic">{message}</p>}
        </div>
      </div>
    );
  }

  return null;
}

export default Dictionary;
