import { BookOpenIcon, TagIcon } from "@heroicons/react/24/outline";
import { CheckBadgeIcon, CircleStackIcon } from "@heroicons/react/24/solid";

import FullPageLoading from "../FullPageLoading";
import { FlashcardOverviewProps } from "@/interfaces";

function FlashcardOverview({ data }: { data: FlashcardOverviewProps | null }) {
  if (!data) {
    return <FullPageLoading />;
  }
  const { approvedCount, userCount, dueCount, contextGroups } = data;

  return (
    <div className="p-4 space-y-6">
      {/* Tổng quan số lượng */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="rounded-2xl shadow bg-gradient-to-r from-blue-100 to-blue-200 p-4 flex flex-col items-center text-center space-y-2">
          <BookOpenIcon className="w-8 h-8 text-blue-700" />
          <div className="text-xl font-semibold">Tổng từ vựng</div>
          <div className="text-3xl font-bold text-blue-700">
            {approvedCount}
          </div>
        </div>
        <div className="rounded-2xl shadow bg-gradient-to-r from-green-100 to-green-200 p-4 flex flex-col items-center text-center space-y-2">
          <CheckBadgeIcon className="w-8 h-8 text-green-700" />
          <div className="text-xl font-semibold">Từ đang học</div>
          <div className="text-3xl font-bold text-green-700">{userCount}</div>
        </div>
        <div className="rounded-2xl shadow bg-gradient-to-r from-yellow-100 to-yellow-200 p-4 flex flex-col items-center text-center space-y-2">
          <CircleStackIcon className="w-8 h-8 text-yellow-700" />
          <div className="text-xl font-semibold">Cần ôn tập</div>
          <div className="text-3xl font-bold text-yellow-700">{dueCount}</div>
        </div>
      </div>

      {/* Nhóm theo ngữ cảnh */}
      <div className="space-y-2">
        <h2 className="text-2xl font-bold">Từ mới theo ngữ cảnh</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
          {contextGroups &&
            contextGroups.map((context, idx) => (
              <div
                key={idx}
                className="p-4 text-center font-medium text-gray-700 bg-white shadow-md rounded-2xl hover:scale-105 transition-transform cursor-pointer flex items-center justify-center space-x-2"
              >
                <TagIcon className="w-5 h-5 text-gray-500" />
                <span>{context}</span>
              </div>
            ))}
        </div>
      </div>
    </div>
  );
}

export default FlashcardOverview;
