"use client";

import Link from "next/link";
import toast from "react-hot-toast";

import { useEffect, useRef, useState } from "react";
import { useParams, useRouter, useSearchParams } from "next/navigation";

import {
  ClockIcon,
  CalendarIcon,
  ArrowLeftIcon,
  QuestionMarkCircleIcon,
} from "@heroicons/react/24/outline";

import ROUTES from "@/constants/routes";
import API_ENDPOINTS from "@/constants/api";
import FullPageLoading from "@/components/features/FullPageLoading";

import { useAuth } from "@/contexts/AuthContext";

type ExamType = {
  id: number;
  title: string;
  duration: number; // in minutes
  year: number;
  score?: number;
  maxScore?: number; // điểm tối đa của đề thi
  totalQuestions?: number; // tổng số câu hỏi đã làm
  releaseDate: string; // dạng "dd/mm/yyyy" (nếu cần, có thể dùng Date)

  attemptId?: number;
  attemptScore?: number;
  attemptMaxScore?: number; // điểm tối đa của đề thi
  attemptStatus?: "completed" | "in_progress" | "abandoned";
  attemptPartNumbers?: number[]; // danh sách các part đã làm
  attemptTotalQuestions?: number; // tổng số câu hỏi đã làm
  attemptTestDuration?: number; // thời lượng làm bài, ví dụ: 12 giờ?
  attemptEstimatedDuration?: number;
  attemptStartTime?: string;
};

type ExamProp = {
  examId: string;
};

type ExamStatus = "completed" | string;

function ExamDetailView({ examId }: ExamProp) {
  const { user, token, isLoading } = useAuth();

  const router = useRouter();
  const searchParams = useSearchParams();

  const [examData, setExamData] = useState<ExamType | null>(null);
  const [allAttempts, setAllAttempts] = useState<ExamType[]>([]);
  const [selectedAttemptId, setSelectedAttemptId] = useState<number | null>(
    null
  );

  const hasFetched = useRef(false);

  const getStatusBadge = (status: ExamStatus) => {
    switch (status) {
      case "completed":
        return (
          <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-green-100 text-green-800 border border-green-200">
            Đã làm
          </span>
        );
      case "abandoned":
        return (
          <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-red-100 text-red-800 border border-red-200">
            Đã hủy
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-purple-100 text-purple-800 border border-purple-200">
            Chưa làm
          </span>
        );
    }
  };

  const handleStartExam = () => {
    const isLoggedIn = !!user;
    if (!isLoggedIn) {
      toast.error("Bạn cần đăng nhập để bắt đầu làm bài thi");
      router.push(ROUTES.AUTH.LOGIN);
      return;
    }
    router.push(ROUTES.EXAM.CHOOSE_PARTS(examId));
  };

  const handleSelectAttempt = (attemptId: number) => {
    const attempt = allAttempts.find((a) => a.attemptId === attemptId);
    if (attempt) {
      setExamData((prev) => ({ ...prev, ...attempt }));
      setSelectedAttemptId(attemptId);

      // Cập nhật URL với query param attempt_id
      const params = new URLSearchParams(searchParams?.toString());
      params.set("attempt_id", attemptId.toString());

      router.replace(`${window.location.pathname}?${params.toString()}`);
    }
  };

  const fetchData = async () => {
    try {
      const res = await fetch(API_ENDPOINTS.EXAM.INFO(examId), {
        headers: {
          "Content-Type": "application/json",
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
      });
      const result = await res.json();

      if (res.ok && result) {
        setExamData(result);
        if (result.attempts) {
          setAllAttempts(result.attempts);

          const attemptIdFromURL = searchParams?.get("attempt_id");
          const matchedAttempt = result.attempts.find(
            (a: any) => a.attemptId?.toString() === attemptIdFromURL
          );
          if (matchedAttempt) {
            setExamData((prev: any) => ({ ...result, ...matchedAttempt }));
            setSelectedAttemptId(matchedAttempt.attemptId);
          }
        }
      }
    } catch (error) {
      console.error("Error fetching flashcard data:", error);
      setExamData(null);
    }
  };

  useEffect(() => {
    if (isLoading || hasFetched.current) return;
    hasFetched.current = true;
    fetchData();
  }, [isLoading, user]);

  if (!examData) {
    return <FullPageLoading />;
  }

  const commonBtnClass =
    "px-6 py-3 rounded-lg transition-colors font-medium text-sm sm:text-base";

  // Get exam data (fallback to exam 1 if not found)
  //   const exam = examData[examId as keyof typeof examData] || examData[1];

  return (
    <div className="min-h-screen p-4">
      <div className="max-w-4xl mx-auto">
        {/* Back Button */}
        <div className="mb-4">
          <Link
            href={ROUTES.EXAMS}
            className="inline-flex items-center gap-2 text-gray-600 hover:text-gray-800 transition-colors"
          >
            <ArrowLeftIcon className="h-4 w-4" />
            <span>Quay lại danh sách đề thi</span>
          </Link>
        </div>
        {/* Header */}
        <div className="mb-6">
          <div className="flex items-center justify-between mb-4">
            <h1 className="text-2xl font-bold text-gray-900">
              {examData?.title}
            </h1>
            <div className="flex items-center gap-3">
              {examData?.attemptStatus === "completed" && (
                <Link
                  href={ROUTES.EXAM_ATTEMPT.RESULT(
                    examData?.attemptId?.toString()!
                  )}
                  className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors font-medium"
                >
                  Xem đáp án
                </Link>
              )}
              {getStatusBadge(examData?.attemptStatus ?? "")}
            </div>
          </div>

          {/* Exam Stats */}
          <div className="bg-white rounded-lg border border-gray-200 p-6 mb-6">
            <div className="flex items-center gap-2 text-gray-600">
              <ClockIcon className="h-4 w-4" />
              <span className="text-sm">
                {examData?.attemptStatus === "completed"
                  ? "Thời gian đã làm:"
                  : examData?.attemptStatus === "abandoned"
                  ? "Thời gian ước tính:"
                  : "Thời gian làm bài:"}{" "}
                {examData?.attemptTestDuration ||
                  examData?.attemptEstimatedDuration ||
                  examData?.duration}{" "}
                phút |{" "}
                {examData?.attemptTotalQuestions ?? examData?.totalQuestions}{" "}
                câu hỏi
              </span>
            </div>
          </div>

          {allAttempts.length > 1 && (
            <div className="bg-white border border-gray-200 rounded-lg p-4 mb-6">
              <h3 className="text-md font-semibold text-gray-900 mb-3">
                Lịch sử làm bài
              </h3>
              <div className="space-y-2">
                {allAttempts.map((att) => (
                  <button
                    key={att.attemptId}
                    onClick={() => handleSelectAttempt(att.attemptId!)}
                    className={`w-full flex justify-between items-center px-4 py-2 rounded-md border transition ${
                      att.attemptId === selectedAttemptId
                        ? "bg-blue-100 border-blue-300"
                        : "bg-gray-50 border-gray-200 hover:bg-gray-100"
                    }`}
                  >
                    <span className="text-sm text-gray-700">
                      Lần thi lúc: {att.attemptStartTime}
                    </span>
                    <span
                      className={`px-2 py-0.5 rounded-full text-xs font-medium ${
                        att.attemptStatus === "completed"
                          ? "bg-green-100 text-green-700"
                          : att.attemptStatus === "in_progress"
                          ? "bg-yellow-100 text-yellow-700"
                          : "bg-red-100 text-red-600"
                      }`}
                    >
                      {att.attemptStatus === "completed"
                        ? "Hoàn thành"
                        : att.attemptStatus === "in_progress"
                        ? "Đang làm"
                        : "Đã hủy"}
                    </span>
                    <span className="text-sm font-medium text-blue-600">
                      {att.score && `${att.score} / `}
                      {att.maxScore} điểm
                    </span>
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
        {/* Exam Structure */}
        <div className="bg-white rounded-lg border border-gray-200 p-6 mb-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4 pb-2 border-b border-gray-200">
            Cấu trúc đề thi
          </h2>

          <div className="space-y-4">
            <div className="flex items-center justify-between py-4 border-b border-gray-100 last:border-b-0">
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 flex items-center justify-center text-lg">
                  <QuestionMarkCircleIcon />
                </div>
                <div>
                  <h3 className="font-medium text-gray-900">
                    {examData.attemptPartNumbers
                      ? examData.attemptPartNumbers
                          ?.map((p) => `Part ${p}`)
                          .join(" - ")
                      : "Đầy đủ"}{" "}
                    :{" "}
                    {examData.attemptTotalQuestions || examData.totalQuestions}{" "}
                    questions
                  </h3>
                </div>
              </div>
              <div className="text-right">
                <span className="text-sm font-medium text-gray-700">
                  {examData.score && `${examData.score} / `}
                  {examData?.maxScore ?? 990} điểm
                </span>
              </div>
            </div>
          </div>
        </div>
        {/* Action Buttons */}
        <div className="flex gap-4 justify-center flex-wrap">
          {examData?.attemptStatus === "completed" ? (
            <button
              className={`${commonBtnClass} bg-green-100 text-green-700 hover:bg-green-200 border border-green-200`}
              onClick={handleStartExam}
            >
              Bắt đầu làm lại
            </button>
          ) : examData?.attemptStatus === "abandoned" ? (
            <>
              {examData?.attemptId && (
                <Link
                  href={ROUTES.EXAM_ATTEMPT.DO(examData.attemptId.toString())}
                  className={`${commonBtnClass} bg-yellow-100 text-yellow-700 hover:bg-yellow-200 border border-yellow-300`}
                >
                  Tiếp tục làm
                </Link>
              )}
              <button
                onClick={handleStartExam}
                className={`${commonBtnClass} bg-blue-600 text-white hover:bg-blue-700`}
              >
                Bắt đầu bài thi mới
              </button>
            </>
          ) : (
            <button
              onClick={handleStartExam}
              className={`${commonBtnClass} bg-blue-600 text-white hover:bg-blue-700`}
            >
              Bắt đầu làm
            </button>
          )}
        </div>
        {/* Additional Info */}
        <div className="mt-8 bg-white rounded-lg border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            Thông tin bổ sung
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm text-gray-600">
            <div className="flex items-center gap-2">
              <ClockIcon className="h-4 w-4" />
              <span>Thời gian: {examData?.duration} phút</span>
            </div>
            <div className="flex items-center gap-2">
              <CalendarIcon className="h-4 w-4" />
              <span>Năm: {examData?.year}</span>
            </div>
            <div className="flex items-center gap-2">
              <CalendarIcon className="h-4 w-4" />
              <span>Ngày tạo đề: {examData?.releaseDate}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ExamDetailView;
