"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";

import ROUTES from "@/constants/routes";
import API_ENDPOINTS from "@/constants/api";

import FullPageLoading from "@/components/features/FullPageLoading";

type Part = { id: string; part_number?: number };

function PartSelector({ examId }: { examId: string }) {
  const router = useRouter();

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
          setParts(result);
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
      // setSelectedIds(parts?.map((p) => p?.id));
    }
  };

  const onDragEnd = (result: any) => {
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
      const res = await fetch(API_ENDPOINTS.EXAM.START, {
        method: "post",
        body: JSON.stringify({
          examId,
          partOrder: selectedParts.map((p, index) => ({
            part_id: p.id,
            order_index: index + 1,
          })),
        }),
      });
      const result = await res.json();

      // Chuyển đến trang làm bài (giả định có examAttemptId)
      router.push(ROUTES.EXAM_ATTEMPT.DO(result.examAttemptId));
    } catch (err) {
      console.error(err);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (parts.length === 0) return <FullPageLoading />;

  return (
    <div className="p-4 bg-white shadow rounded-xl max-w-3xl mx-auto">
      <h2 className="text-xl font-semibold mb-4">
        Chọn các Part để bắt đầu bài thi
      </h2>
      <div className="mb-2">
        <label className="flex items-center gap-2">
          <input
            type="checkbox"
            checked={selectedIds.length === parts.length}
            onChange={toggleSelectAll}
          />
          <span>Chọn tất cả</span>
        </label>
      </div>

      <DragDropContext onDragEnd={onDragEnd}>
        <Droppable droppableId="parts">
          {(provided: any) => (
            <ul
              className="space-y-2"
              {...provided.droppableProps}
              ref={provided.innerRef}
            >
              {parts.length > 0 &&
                parts.map((part, index) => (
                  <Draggable
                    key={part.id}
                    draggableId={String(part.id)}
                    index={index}
                  >
                    {(provided: any) => (
                      <li
                        className="flex items-center gap-2 border p-3 rounded"
                        ref={provided.innerRef}
                        {...provided.draggableProps}
                        {...provided.dragHandleProps}
                      >
                        <input
                          type="checkbox"
                          checked={selectedIds.includes(part.id)}
                          onChange={() => toggleSelection(part.id)}
                        />
                        <span className="flex-1">
                          Part {part.part_number} (ID: {part.id})
                        </span>
                        <span className="text-gray-400 text-sm">
                          Kéo để thay đổi thứ tự
                        </span>
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
        className="mt-6 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:bg-gray-400"
        disabled={selectedIds.length === 0 || isSubmitting}
        onClick={handleStart}
      >
        {isSubmitting ? "Đang tạo bài thi..." : "Bắt đầu làm bài"}
      </button>
    </div>
  );
}

export default PartSelector;
