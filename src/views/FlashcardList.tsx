"use client";

import { motion } from "framer-motion";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

import ROUTES from "@/constants/routes";
import API_ENDPOINTS from "@/constants/api";
import FullPageLoading from "@/components/features/FullPageLoading";

import { useQueryParams } from "@/hooks";
import { TagIcon } from "@heroicons/react/24/outline";

interface FlashcardGroup {
  label: string;
  count: number;
}

function FlashcardList() {
  const router = useRouter();

  const { user_id, byDate, context } = useQueryParams();
  const [data, setData] = useState<FlashcardGroup[] | null>(null);
  const [expandedGroup, setExpandedGroup] = useState<string | null>(null);

  const fetchData = async () => {
    try {
      // console.log(userId);

      const url = user_id
        ? byDate
          ? API_ENDPOINTS.FLASHCARDS.DUE_GROUP_BY_DATE(user_id)
          : API_ENDPOINTS.FLASHCARDS.GROUP_BY_CONTEXT(user_id)
        : API_ENDPOINTS.FLASHCARDS.GROUP_BY_CONTEXT();

      const res = await fetch(url);
      const result = await res.json();

      // console.log(result);

      if (!res.ok || !result) {
        setData(null);
      } else {
        const mappedData: FlashcardGroup[] = result.map((item: any) => ({
          label: item.label,
          count: item.count,
        }));

        setData(mappedData);
      }
    } catch (error) {
      console.error("Error fetching flashcard data:", error);
      setData(null);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  useEffect(() => {
    if (context) setExpandedGroup(context);
  }, [context]);

  if (!data) {
    return <FullPageLoading />;
  }

  const renderItem = (item: FlashcardGroup, idx: number) => {
    if (expandedGroup === item.label) {
      const pageSize = 10;
      const pages = Math.ceil(item.count / pageSize);
      return Array.from({ length: pages }).map((_, pageIdx) => {
        const start = pageIdx * pageSize + 1;
        const end = Math.min((pageIdx + 1) * pageSize, item.count);
        return (
          <motion.div
            key={`${item.label}-${pageIdx}`}
            onClick={() =>
              router.push(
                `${ROUTES.VOCABULARIES.QUIZLET}?${
                  byDate
                    ? `date=${item.label}&user_id=${user_id}`
                    : `context=${item.label}${
                        user_id ? `&user_id=${user_id}` : ""
                      }`
                }${pageIdx > 0 ? `&set=${pageIdx + 1}` : ""}`
              )
            }
            className="flex items-center justify-between rounded-2xl p-4 bg-gradient-to-br from-white to-slate-50 shadow-md group hover:shadow-xl transition hover:ring-2 hover:ring-blue-300 hover:ring-offset-1 cursor-pointer"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: pageIdx * 0.05 }}
          >
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-full bg-blue-100 text-blue-700 flex items-center justify-center group-hover:bg-blue-600 group-hover:text-white transition">
                <TagIcon className="w-4 h-4" />
              </div>
              <span className="font-semibold text-slate-800 group-hover:text-blue-700 transition">
                Flashcard {start} - {end}
              </span>
            </div>
          </motion.div>
        );
      });
    } else {
      return (
        <motion.div
          key={idx}
          onClick={() => {
            setExpandedGroup(item.label);
          }}
          className="flex items-center justify-between rounded-2xl p-4 bg-gradient-to-br from-white to-slate-50 shadow-md group hover:shadow-xl transition hover:ring-2 hover:ring-blue-300 hover:ring-offset-1 cursor-pointer"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: idx * 0.05 }}
        >
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-full bg-blue-100 text-blue-700 flex items-center justify-center group-hover:bg-blue-600 group-hover:text-white transition">
              <TagIcon className="w-4 h-4" />
            </div>
            <span className="font-semibold text-slate-800 group-hover:text-blue-700 transition">
              {item.label}
              {/* {capitalizeWords(item.label)} */}
            </span>
          </div>
          <span
            className={`text-sm font-bold transition ${
              item.count >= 10
                ? "text-green-600 group-hover:text-green-700"
                : item.count >= 5
                ? "text-yellow-600 group-hover:text-yellow-700"
                : "text-red-500 group-hover:text-red-600"
            }`}
          >
            {item.count}
          </span>
        </motion.div>
      );
    }
  };

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
      {expandedGroup
        ? data
            .filter((item) => item.label === expandedGroup)
            .map((item, idx) => renderItem(item, idx))
        : data.map((item, idx) => renderItem(item, idx))}
    </div>
  );
}

export default FlashcardList;
