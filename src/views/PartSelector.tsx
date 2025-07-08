"use client";

import type { DropResult } from "@hello-pangea/dnd";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { DragDropContext, Droppable, Draggable } from "@hello-pangea/dnd";

import ROUTES from "@/constants/routes";
import API_ENDPOINTS from "@/constants/api";

import FullPageLoading from "@/components/features/FullPageLoading";

import { useAuth } from "@/contexts/AuthContext";

type Part = { id: string; part_number?: number };

function PartSelector({ examId }: { examId: string }) {
  const router = useRouter();

  const { token } = useAuth();

  const [parts, setParts] = useState<Part[]>([]);
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const toggleSelection = (id: string) => {
    setSelectedIds((prev) =>
      prev?.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]
    );
  };

  useEffect(() => {
    const fetchParts = async () => {
      try {
        const res = await fetch(API_ENDPOINTS.EXAM.PARTS(examId));
        const result = await res.json();

        if (res.ok && result) {
          setParts(result.parts);
        }
      } catch (error) {
        console.error("Error fetching parts data:", error);
      }
    };

    fetchParts();
  }, []);

  const toggleSelectAll = () => {
    if (selectedIds.length === parts.length) {
      setSelectedIds([]);
    } else {
      setSelectedIds(parts.map((p) => p.id));
    }
  };

  const onDragEnd = (result: DropResult) => {
    if (!result.destination) return;
    const reordered = [...parts];
    const [removed] = reordered.splice(result.source.index, 1);
    reordered.splice(result.destination.index, 0, removed);
    setParts(reordered);
  };

  const handleStart = async () => {
    if (selectedIds.length === 0) return;
    setIsSubmitting(true);
    try {
      const selectedParts = parts.filter((p) => selectedIds.includes(p.id));
      const res = await fetch(API_ENDPOINTS.EXAM.START(examId), {
        method: "post",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          part_order: selectedParts.map((p, index) => ({
            part_id: p.id,
            order_index: index + 1,
          })),
        }),
      });
      const result = await res.json();

      router.push(ROUTES.EXAM_ATTEMPT.DO(result.examAttemptId));
    } catch (err) {
      console.error(err);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (parts.length === 0) return <FullPageLoading />;

  return (
    <div className="p-6 bg-white shadow-lg rounded-2xl max-w-3xl mx-auto">
      <h2 className="text-2xl font-bold text-gray-800 mb-6 text-center">
        Chọn các Part để bắt đầu bài thi
      </h2>

      <div className="flex items-center gap-3 mb-4">
        <label className="inline-flex items-center cursor-pointer select-none">
          <input
            type="checkbox"
            className="form-checkbox w-5 h-5 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
            checked={selectedIds.length === parts.length}
            onChange={toggleSelectAll}
          />
          <span className="ml-2 text-gray-700 font-medium">Chọn tất cả</span>
        </label>
      </div>

      <DragDropContext onDragEnd={onDragEnd}>
        <Droppable droppableId="parts">
          {(provided: any) => (
            <ul
              {...provided.droppableProps}
              ref={provided.innerRef}
              className="space-y-3"
            >
              {parts.map((part, index) => (
                <Draggable
                  key={part.id}
                  draggableId={String(part.id)}
                  index={index}
                >
                  {(provided: any) => (
                    <li
                      ref={provided.innerRef}
                      {...provided.draggableProps}
                      {...provided.dragHandleProps}
                      className="flex items-center justify-between p-4 border border-gray-200 bg-gray-50 rounded-xl shadow-sm hover:shadow transition"
                    >
                      <div className="flex items-center gap-3">
                        <input
                          type="checkbox"
                          checked={selectedIds.includes(part.id)}
                          onChange={() => toggleSelection(part.id)}
                          className="form-checkbox w-5 h-5 text-indigo-600 border-gray-300 rounded focus:ring-indigo-500"
                        />
                        <div className="text-gray-800 font-medium">
                          Part {part.part_number}
                        </div>
                      </div>
                      <div className="text-xs text-gray-500 italic hidden sm:block">
                        ↕ Kéo để sắp xếp
                      </div>
                    </li>
                  )}
                </Draggable>
              ))}
              {provided.placeholder}
            </ul>
          )}
        </Droppable>
      </DragDropContext>

      <button
        className="mt-8 w-full sm:w-auto px-6 py-3 bg-blue-600 text-white text-sm font-semibold rounded-xl hover:bg-blue-700 disabled:bg-blue-300 transition"
        disabled={selectedIds.length === 0 || isSubmitting}
        onClick={handleStart}
      >
        {isSubmitting ? "Đang tạo bài thi..." : "🎯 Bắt đầu làm bài"}
      </button>
    </div>
  );
}

export default PartSelector;
