"use client";

import { useRef, useState } from "react";

import {
  ListeningStep1,
  ListeningStep2,
  ListeningStep3,
} from "@/components/features/Listening";
import { ChevronDownIcon, ChevronRightIcon } from "@heroicons/react/24/outline";

function SmartListening() {
  const audioRef = useRef<HTMLAudioElement>(null);
  const [openStep, setOpenStep] = useState<number | null>(null);

  const toggleStep = (step: number) => {
    setOpenStep((prev) => (prev === step ? null : step));
  };

  return (
    <div className="max-w-7xl mx-auto space-y-4 px-3 sm:px-6 lg:px-8">
      <h1 className="text-2xl font-bold text-center text-blue-800 mb-4">
        Luyện nghe thông minh
      </h1>

      <audio
        ref={audioRef}
        src="exam_audio/PART_1-TEST_1.mp3"
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
              transcript="1. (A) She’s eating in a picnic area.\n(B) She’s waiting in line at a food truck.\n(C) She’s wiping off a bench.\n(D) She’s throwing away a plate.\n\n2. (A) The man is brushing snow off the roof of a car.\n(B) The man is standing in the snow beside a car.\n(C) The man is shoveling snow from a walkway.\n(D) The man is running through the snow.\n\n3. (A) Some workers are hanging art in a gallery.\n(B) Two of the people are having a conversation.\n(C) One of the men is rearranging cushions on a sofa.\n(D) One of the men is painting a picture.\n\n4. (A) Vehicles are entering a parking garage.\n(B) Clothes hangers are scattered on the ground.\n(C) Empty racks are lined up next to a building.\n(D) Clothing is being displayed under a tent.\n\n5. (A) Potted plants have been suspended from a ceiling.\n(B) Chairs have been stacked in front of an entryway.\n(C) A computer station has been set up on a desk.\n(D) A rug has been rolled up against a wall.\n\n6. (A) One of the men is sweeping a patio.\n(B) One of the men is replacing some flooring.\n(C) A door has been taken off its frame.\n(D) A light fixture has been left on the ground."
              transcriptVi="1. (A) Cô ấy đang ăn trong khu vực dã ngoại.\n(B) Cô ấy đang xếp hàng tại một xe bán đồ ăn.\n(C) Cô ấy đang lau ghế dài.\n(D) Cô ấy đang vứt đĩa đi.\n\n2. (A) Người đàn ông đang phủi tuyết khỏi mái xe.\n(B) Người đàn ông đang đứng trong tuyết bên cạnh một chiếc xe.\n(C) Người đàn ông đang xúc tuyết khỏi lối đi.\n(D) Người đàn ông đang chạy qua tuyết.\n\n3. (A) Một số công nhân đang treo tranh trong một phòng trưng bày.\n(B) Hai người trong số họ đang trò chuyện.\n(C) Một trong những người đàn ông đang sắp xếp lại gối trên ghế sofa.\n(D) Một trong những người đàn ông đang vẽ tranh.\n\n4. (A) Các phương tiện đang vào một bãi đỗ xe.\n(B) Móc treo quần áo bị vứt rải rác trên mặt đất.\n(C) Các giá treo quần áo trống được xếp hàng cạnh một tòa nhà.\n(D) Quần áo được trưng bày dưới một chiếc lều.\n\n5. (A) Cây cảnh đã được treo từ trần nhà.\n(B) Ghế đã được xếp chồng lên nhau trước lối vào.\n(C) Một trạm máy tính đã được thiết lập trên bàn.\n(D) Một tấm thảm đã được cuộn lại dựa vào tường.\n\n6. (A) Một trong những người đàn ông đang quét sân.\n(B) Một trong những người đàn ông đang thay thế sàn nhà.\n(C) Cửa đã được tháo khỏi khung.\n(D) Một thiết bị chiếu sáng đã được để lại trên mặt đất."
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
          {openStep === 2 ? (
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
    </div>
  );
}

export default SmartListening;
