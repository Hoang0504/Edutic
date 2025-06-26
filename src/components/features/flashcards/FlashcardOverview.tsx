"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { useRouter } from "next/navigation";

import { BookOpenIcon, TagIcon } from "@heroicons/react/24/outline";
import { CheckBadgeIcon, CircleStackIcon } from "@heroicons/react/24/solid";

import ROUTES from "@/constants/routes";
import API_ENDPOINTS from "@/constants/api";
import FullPageLoading from "../FullPageLoading";

import { useAuth } from "@/contexts/AuthContext";
import { FlashcardOverviewProps } from "@/interfaces";

function FlashcardOverview() {
  const router = useRouter();
  const [data, setData] = useState<FlashcardOverviewProps | null>(null);
  const { user, isLoading } = useAuth();

  const fetchData = async () => {
    try {
      const res = await fetch(
        API_ENDPOINTS.FLASHCARDS.DASHBOARD(user?.id.toString())
      );
      const result = await res.json();

      if (!res.ok || !result) {
        setData(null);
      } else {
        const mappedData: FlashcardOverviewProps = {
          approvedCount: result.approved_vocab_count,
          ...(user
            ? {
                userCount: result.user_vocab_count,
                dueCount: result.user_vocab_due_count,
              }
            : {}),
          contextGroups: result.context_groups,
        };

        setData(mappedData);
      }
    } catch (error) {
      console.error("Error fetching flashcard overview:", error);
      setData(null);
    }
  };

  useEffect(() => {
    if (!isLoading && user?.id) fetchData();
  }, [user, isLoading]);

  if (!data) {
    return <FullPageLoading />;
  }
  const { approvedCount, userCount, dueCount, contextGroups } = data;

  return (
    <div className="p-4 space-y-6">
      {/* Tổng quan số lượng */}
      <div
        className={`grid gap-4 ${
          user ? "grid-cols-1 sm:grid-cols-3" : "grid-cols-1 place-items-center"
        }`}
      >
        <Link
          href={ROUTES.FLASHCARDS.CONTEXT_LIST}
          className="rounded-2xl shadow bg-gradient-to-r from-blue-100 to-blue-200 p-4 flex flex-col items-center text-center space-y-2"
        >
          <BookOpenIcon className="w-8 h-8 text-blue-700" />
          <div className="text-xl font-semibold">Tổng từ vựng</div>
          <div className="text-3xl font-bold text-blue-700">
            {approvedCount}
          </div>
        </Link>
        {user && (
          <>
            <Link
              href={`${ROUTES.FLASHCARDS.CONTEXT_LIST}?user_id=${user.id}`}
              className="rounded-2xl shadow bg-gradient-to-r from-green-100 to-green-200 p-4 flex flex-col items-center text-center space-y-2"
            >
              <CheckBadgeIcon className="w-8 h-8 text-green-700" />
              <div className="text-xl font-semibold">Từ đang học</div>
              <div className="text-3xl font-bold text-green-700">
                {userCount}
              </div>
            </Link>
            <div className="rounded-2xl shadow bg-gradient-to-r from-yellow-100 to-yellow-200 p-4 flex flex-col items-center text-center space-y-2">
              <CircleStackIcon className="w-8 h-8 text-yellow-700" />
              <div className="text-xl font-semibold">Cần ôn tập</div>
              <div className="text-3xl font-bold text-yellow-700">
                {dueCount}
              </div>
            </div>
          </>
        )}
      </div>

      {/* Nhóm theo ngữ cảnh */}
      <div className="space-y-2">
        <h2 className="text-lg font-bold">Flashcard theo ngữ cảnh</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
          {contextGroups &&
            contextGroups.map((context, idx) => (
              <motion.div
                key={idx}
                onClick={() =>
                  router.push(`/flashcards/context-list?context=${context}`)
                }
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
                    {context}
                  </span>
                </div>
                <span className="text-sm font-bold text-blue-500 group-hover:scale-110 transition">
                  →
                </span>
              </motion.div>
            ))}
        </div>
      </div>
    </div>
  );
}

export default FlashcardOverview;
