"use client";

import React, {
  useState,
  useRef,
  useEffect,
  useMemo,
  useCallback,
  memo,
} from "react";
import {
  MicrophoneIcon,
  StopIcon,
  PlayIcon,
  PauseIcon,
  ClockIcon,
} from "@heroicons/react/24/solid";
import { ChevronLeftIcon, ChevronRightIcon } from "@heroicons/react/24/outline";
import { useExamAttemptInfo } from "@/contexts/ExamAttemptInfoContext";
import { usePartDetail } from "@/hooks";
import Image from "next/image";

interface Question {
  id: number;
  text: string;
  prompt?: string;
  imageUrl?: string;
  informationText?: string;
  prepareTime: number; // in seconds
  responseTime: number; // in seconds
  answered: boolean;
  transcription?: string;
  audioUrl?: string;
}

interface Part {
  id: number;
  name: string;
  description: string;
  questions: Question[];
}

interface SpeakingExamProps {
  parts: Part[];
  onAnswerSubmit: (
    questionId: number,
    transcription: string,
    audioBlob?: Blob
  ) => void;
  onPartComplete: (partId: number, responses: any[]) => void;
  onQuestionSubmit?: (questionId: number, answer: string) => void;
  currentQuestionId?: number;
  onStartPart?: () => void;
}

interface AIFeedback {
  score: number;
  strengths: string;
  weaknesses: string;
  suggestions: string[] | string;
  pronunciation_score?: number;
  fluency_score?: number;
  content_score?: number;
}

const SpeakingExam: React.FC<SpeakingExamProps> = ({
  // parts,
  onAnswerSubmit,
  onPartComplete,
  onQuestionSubmit,
  currentQuestionId,
  onStartPart,
}) => {
  // const [activePart, setActivePart] = useState(1);
  // const [activePart, setActivePart] = useState<number | null>(null);
  const [partIndex, setPartIndex] = useState<number>(0);
  // const [parts, setParts] = useState([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [isRecording, setIsRecording] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [recordingTime, setRecordingTime] = useState(0);
  const [prepareTime, setPrepareTime] = useState(0);
  const [audioURL, setAudioURL] = useState("");
  const [transcription, setTranscription] = useState("");
  const [isProcessing, setIsProcessing] = useState(false);
  const [feedback, setFeedback] = useState<AIFeedback | null>(null);
  const [error, setError] = useState("");
  const [isPreparing, setIsPreparing] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [speechSupported, setSpeechSupported] = useState(false);
  const [currentPhase, setCurrentPhase] = useState<
    "prepare" | "respond" | "review"
  >("prepare");
  const [responses, setResponses] = useState<{
    [key: number]: { transcription: string; audioUrl: string };
  }>({});

  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const recognitionRef = useRef<any>(null);
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const finalTranscriptRef = useRef<string>("");

  // Sample data for TOEIC Speaking
  // const sampleParts: Part[] = [
  //   {
  //     id: 1,
  //     name: "Part 1: Read a text aloud",
  //     description: "Đọc thành tiếng đoạn văn bản cho trước",
  //     questions: [
  //       {
  //         id: 1,
  //         text: "Read the text aloud clearly and naturally.",
  //         prompt:
  //           "Welcome to the Grand Hotel. Our hotel offers comfortable rooms with modern amenities including free Wi-Fi, air conditioning, and room service. The hotel restaurant serves international cuisine from 6 AM to 10 PM. For reservations or inquiries, please call the front desk.",
  //         prepareTime: 45,
  //         responseTime: 45,
  //         answered: false,
  //       },
  //       {
  //         id: 2,
  //         text: "Read the text aloud clearly and naturally.",
  //         prompt:
  //           "The annual company meeting will be held on March 15th in the main conference room. All employees are required to attend. The meeting will begin at 9 AM sharp and is expected to last approximately two hours. Please bring your quarterly reports and any questions you may have.",
  //         prepareTime: 45,
  //         responseTime: 45,
  //         answered: false,
  //       },
  //     ],
  //   },
  //   {
  //     id: 2,
  //     name: "Part 2: Describe a picture",
  //     description: "Mô tả hình ảnh được hiển thị",
  //     questions: [
  //       {
  //         id: 3,
  //         text: "Describe the picture in as much detail as possible.",
  //         imageUrl: "/images/speaking-sample-1.jpg",
  //         prompt:
  //           "Look at the picture and describe what you see. Include details about the people, objects, and activities shown.",
  //         prepareTime: 45,
  //         responseTime: 30,
  //         answered: false,
  //       },
  //     ],
  //   },
  //   {
  //     id: 3,
  //     name: "Part 3: Respond to questions",
  //     description: "Trả lời các câu hỏi",
  //     questions: [
  //       {
  //         id: 4,
  //         text: "What is your favorite type of restaurant?",
  //         prepareTime: 3,
  //         responseTime: 15,
  //         answered: false,
  //       },
  //       {
  //         id: 5,
  //         text: "How often do you eat at restaurants?",
  //         prepareTime: 3,
  //         responseTime: 15,
  //         answered: false,
  //       },
  //       {
  //         id: 6,
  //         text: "Describe a memorable meal you had at a restaurant.",
  //         prepareTime: 3,
  //         responseTime: 30,
  //         answered: false,
  //       },
  //     ],
  //   },
  //   {
  //     id: 4,
  //     name: "Part 4: Respond using information",
  //     description: "Trả lời câu hỏi dựa trên thông tin cho trước",
  //     questions: [
  //       {
  //         id: 7,
  //         text: "What time does the workshop begin?",
  //         informationText:
  //           "Professional Development Workshop\nDate: Friday, April 12th\nTime: 2:00 PM - 5:00 PM\nLocation: Training Room B\nTopic: Effective Communication Skills\nInstructor: Dr. Sarah Johnson\nMaterials: Notebook and pen required",
  //         prepareTime: 48, // 45s read + 3s prepare
  //         responseTime: 15,
  //         answered: false,
  //       },
  //       {
  //         id: 8,
  //         text: "Who is the instructor for this workshop?",
  //         informationText:
  //           "Professional Development Workshop\nDate: Friday, April 12th\nTime: 2:00 PM - 5:00 PM\nLocation: Training Room B\nTopic: Effective Communication Skills\nInstructor: Dr. Sarah Johnson\nMaterials: Notebook and pen required",
  //         prepareTime: 48,
  //         responseTime: 15,
  //         answered: false,
  //       },
  //       {
  //         id: 9,
  //         text: "What should participants bring to the workshop?",
  //         informationText:
  //           "Professional Development Workshop\nDate: Friday, April 12th\nTime: 2:00 PM - 5:00 PM\nLocation: Training Room B\nTopic: Effective Communication Skills\nInstructor: Dr. Sarah Johnson\nMaterials: Notebook and pen required",
  //         prepareTime: 48,
  //         responseTime: 30,
  //         answered: false,
  //       },
  //     ],
  //   },
  //   {
  //     id: 5,
  //     name: "Part 5: Express an opinion",
  //     description: "Bày tỏ quan điểm cá nhân",
  //     questions: [
  //       {
  //         id: 11,
  //         text: "Some people prefer to work in a large company, while others prefer to work in a small company. Which do you prefer and why? Give specific reasons and examples to support your opinion.",
  //         prepareTime: 30,
  //         responseTime: 60,
  //         answered: false,
  //       },
  //     ],
  //   },
  // ];

  const { data: examData } = useExamAttemptInfo();
  const parts = examData?.parts ?? [];

  const { data: currentPart } = usePartDetail(parts[partIndex]!.part_id);

  // console.log();

  // console.log(currentPart);

  // const currentPart =
  //   sampleParts.find((part) => part.id === activePart) || sampleParts[0];
  const currentQuestion = currentPart?.questions[currentQuestionIndex];
  // console.log(currentQuestion);

  // Handle navigation to specific question
  useEffect(() => {
    if (currentQuestionId) {
      // Find the question in all parts
      let foundPart = null;
      let foundQuestionIndex = -1;

      for (const part of parts) {
        const questionIndex = currentPart!.questions.findIndex(
          (q) => q.id === currentQuestionId
        );
        if (questionIndex !== -1) {
          foundPart = part;
          foundQuestionIndex = questionIndex;
          break;
        }
      }

      if (foundPart && foundQuestionIndex !== -1) {
        // Save current response before switching
        if (transcription.trim() && currentQuestion) {
          setResponses((prev) => ({
            ...prev,
            [currentQuestion.id]: {
              transcription: transcription.trim(),
              audioUrl: audioURL,
            },
          }));
        }

        // setActivePart(foundPart.id);
        setCurrentQuestionIndex(foundQuestionIndex);

        // Load the response for the target question
        const savedResponse = responses[currentQuestionId];
        if (savedResponse) {
          setTranscription(savedResponse.transcription || "");
          setAudioURL(savedResponse.audioUrl || "");
          finalTranscriptRef.current = savedResponse.transcription || "";
        } else {
          setTranscription("");
          setAudioURL("");
          finalTranscriptRef.current = "";
        }

        // Reset recording state
        setCurrentPhase("prepare");
        setIsPreparing(false);
        setIsRecording(false);
        setRecordingTime(0);
        setPrepareTime(0);
      }
    }
  }, [currentQuestionId]);

  useEffect(() => {
    // Check for Speech Recognition support
    if ("webkitSpeechRecognition" in window || "SpeechRecognition" in window) {
      setSpeechSupported(true);

      const SpeechRecognition =
        (window as any).webkitSpeechRecognition ||
        (window as any).SpeechRecognition;
      const recognition = new SpeechRecognition();

      recognition.continuous = true;
      recognition.interimResults = true;
      recognition.lang = "en-US";
      recognition.maxAlternatives = 1;

      recognition.onstart = () => {
        setIsListening(true);
        setError("");
      };

      recognition.onresult = (event: any) => {
        let interimTranscript = "";

        for (let i = event.resultIndex; i < event.results.length; ++i) {
          const transcript = event.results[i][0].transcript;
          if (event.results[i].isFinal) {
            finalTranscriptRef.current += transcript + " ";
            setTranscription(finalTranscriptRef.current);
          } else {
            interimTranscript += transcript;
          }
        }

        if (interimTranscript) {
          setTranscription(finalTranscriptRef.current + interimTranscript);
        }
      };

      recognition.onerror = (event: any) => {
        setIsListening(false);
        if (event.error === "no-speech") {
          setError("Không nhận được giọng nói. Hãy nói to hơn.");
        } else if (event.error === "network") {
          setError("Lỗi kết nối mạng.");
        }
      };

      recognition.onend = () => {
        setIsListening(false);
        if (isRecording) {
          setTimeout(() => {
            try {
              if (recognitionRef.current && isRecording) {
                recognitionRef.current.start();
              }
            } catch (err) {
              console.log("Recognition restart failed:", err);
            }
          }, 100);
        }
      };

      recognitionRef.current = recognition;
    }

    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    };
  }, [isRecording]);

  const startPreparePhase = () => {
    setCurrentPhase("prepare");
    setIsPreparing(true);
    // currentQuestion.prepareTime;
    setPrepareTime(45);
    setError("");

    // Call the parent's start part timer
    if (onStartPart) {
      onStartPart();
    }

    timerRef.current = setInterval(() => {
      setPrepareTime((prev) => {
        if (prev <= 1) {
          clearInterval(timerRef.current!);
          setIsPreparing(false);
          setCurrentPhase("respond");
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
  };

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mediaRecorder = new MediaRecorder(stream);
      const audioChunks: BlobPart[] = [];

      mediaRecorder.ondataavailable = (event) => {
        audioChunks.push(event.data);
      };

      mediaRecorder.onstop = () => {
        const audioBlob = new Blob(audioChunks, { type: "audio/wav" });
        const url = URL.createObjectURL(audioBlob);
        setAudioURL(url);
        stream.getTracks().forEach((track) => track.stop());
      };

      mediaRecorder.start();
      mediaRecorderRef.current = mediaRecorder;
      setIsRecording(true);
      // currentQuestion.responseTime
      setRecordingTime(30);
      setTranscription("");
      finalTranscriptRef.current = "";

      // Start Speech Recognition
      if (speechSupported && recognitionRef.current) {
        try {
          recognitionRef.current.start();
        } catch (err) {
          console.error("Failed to start speech recognition:", err);
        }
      }

      // Start countdown timer
      timerRef.current = setInterval(() => {
        setRecordingTime((prev) => {
          if (prev <= 1) {
            stopRecording();
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    } catch (err) {
      setError("Không thể truy cập microphone.");
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);

      if (timerRef.current) {
        clearInterval(timerRef.current);
      }

      if (recognitionRef.current && isListening) {
        try {
          recognitionRef.current.stop();
        } catch (err) {
          console.log("Recognition stop failed:", err);
        }
      }

      setCurrentPhase("review");
    }
  };

  const playAudio = () => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.pause();
        setIsPlaying(false);
      } else {
        audioRef.current.play();
        setIsPlaying(true);
        audioRef.current.onended = () => setIsPlaying(false);
      }
    }
  };

  const handleSubmitResponse = useCallback(() => {
    if (!currentPart) return;
    if (!transcription.trim()) {
      setError("Không có nội dung để nộp.");
      return;
    }

    // Save response
    setResponses((prev) => ({
      ...prev,
      [currentQuestion!.id]: {
        transcription: transcription.trim(),
        audioUrl: audioURL,
      },
    }));

    onAnswerSubmit(currentQuestion!.id, transcription.trim());

    // Mark question as submitted in the navigator
    if (onQuestionSubmit) {
      onQuestionSubmit(currentQuestion!.id, transcription.trim());
    }

    // Move to next question or complete part
    if (currentQuestionIndex < currentPart.questions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
      resetQuestion();
    } else {
      // Complete current part
      const partResponses = currentPart.questions.map((q) => ({
        questionId: q.id,
        transcription:
          responses[q.id]?.transcription ||
          (q.id === currentQuestion!.id ? transcription : ""),
        audioUrl:
          responses[q.id]?.audioUrl ||
          (q.id === currentQuestion!.id ? audioURL : ""),
      }));

      onPartComplete(currentPart.part.id, partResponses);

      // Move to next part or complete exam
      // activePart < sampleParts.length
      if (partIndex < parts.length - 1) {
        // setActivePart(activePart + 1);
        setPartIndex(partIndex + 1);
        setCurrentQuestionIndex(0);
        resetQuestion();
      }
    }

    // Kiểm tra nếu là câu hỏi cuối cùng của Part hiện tại
    if (currentQuestionIndex < currentPart.questions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
    } else {
      // Nếu là Part cuối -> Kết thúc bài thi
      // activePart === sampleParts.length
      if (partIndex === parts.length - 1) {
        alert("Bạn đã hoàn thành tất cả Parts!");
        return;
      }
      // Chuyển sang Part tiếp theo
      // setActivePart(activePart + 1);
      setPartIndex(partIndex + 1);
      setCurrentQuestionIndex(0);
    }
    resetQuestion();
  }, [currentPart]);

  const resetQuestion = () => {
    setAudioURL("");
    setTranscription("");
    finalTranscriptRef.current = "";
    setRecordingTime(0);
    setPrepareTime(0);
    setError("");
    setIsPlaying(false);
    setCurrentPhase("prepare");
    setIsPreparing(false);
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  };

  const handleNextQuestion = () => {
    if (currentQuestionIndex < currentPart!.questions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
      // activePart < sampleParts.length
    } else if (partIndex < parts.length - 1) {
      // Chuyển sang Part tiếp theo nếu có
      // setActivePart(activePart + 1);
      setPartIndex(partIndex + 1);
      setCurrentQuestionIndex(0);
    }
    resetQuestion();
  };

  const handlePreviousQuestion = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(currentQuestionIndex - 1);
      // activePart > 1
    } else if (partIndex > 0) {
      // Chuyển về Part trước đó nếu có
      // setActivePart(activePart - 1);
      setPartIndex(partIndex - 1);
      // parts[partIndex - 1].questions.length - 1
      setCurrentQuestionIndex(0);
    }
    resetQuestion();
  };

  const canGoPrevious = () => {
    return currentQuestionIndex > 0 || partIndex > 0;
  };

  const canGoNext = () => {
    return (
      currentQuestionIndex < (currentPart?.questions.length || 0 - 1) ||
      partIndex < parts.length - 1
    );
  };

  return (
    <div className="bg-white rounded-lg shadow-sm border">
      {/* Header */}
      <div className="p-6 border-b">
        <div className="flex space-x-2 mb-4">
          {parts.map((part, idx) => (
            <button
              key={part.part_id}
              onClick={() => {
                // Lưu câu trả lời hiện tại trước khi chuyển Part
                if (transcription.trim()) {
                  setResponses((prev) => ({
                    ...prev,
                    [currentQuestion!.id]: {
                      transcription: transcription.trim(),
                      audioUrl: audioURL,
                    },
                  }));
                }
                // Chuyển Part và reset câu hỏi đầu tiên
                // setActivePart(part.id);
                setPartIndex(idx);
                setCurrentQuestionIndex(0);
                resetQuestion();
              }}
              className={`px-3 py-1 rounded-lg text-sm ${
                partIndex === idx
                  ? "bg-blue-600 text-white"
                  : "bg-gray-200 hover:bg-gray-300"
              }`}
            >
              {/* {part.name.split(":")[0]}{" "} */}
              {/* Chỉ hiển thị "Part 1", "Part 2"... */}
              Part {part.part_number}
            </button>
          ))}
        </div>

        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-xl font-semibold text-gray-800">
              {currentPart?.part.title}
            </h2>
            <p className="text-gray-600 text-sm">
              {currentPart?.part.instructions}
            </p>
          </div>
          <div className="text-right">
            <p className="text-sm text-gray-600">
              Câu {currentQuestionIndex + 1} / {currentPart?.questions.length}
            </p>
            <p className="text-sm text-gray-600">
              Part {currentPart?.part.part_number} / {parts.length}
            </p>
          </div>
        </div>

        {/* Navigation */}
        <div className="flex justify-between items-center">
          <button
            onClick={handlePreviousQuestion}
            disabled={!canGoPrevious()}
            className="flex items-center space-x-2 px-4 py-2 text-gray-600 disabled:text-gray-400 disabled:cursor-not-allowed hover:text-gray-800"
          >
            <ChevronLeftIcon className="h-5 w-5" />
            <span>Câu trước</span>
          </button>

          <div className="text-center">
            <h3 className="font-medium text-gray-800">
              Question {currentQuestion?.question_number}
            </h3>
          </div>

          <button
            onClick={handleNextQuestion}
            disabled={!canGoNext()}
            className="flex items-center space-x-2 px-4 py-2 text-gray-600 disabled:text-gray-400 disabled:cursor-not-allowed hover:text-gray-800"
          >
            <span>Câu tiếp</span>
            <ChevronRightIcon className="h-5 w-5" />
          </button>
        </div>
      </div>

      {/* Question Content */}
      <div className="p-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Question Section */}
          <div>
            {currentQuestion?.content && (
              <div className="bg-blue-50 p-4 rounded-lg mb-4">
                <h4 className="font-medium text-blue-900 mb-2">Question:</h4>
                <p className="text-blue-800">{currentQuestion?.content}</p>
              </div>
            )}

            {/* Prompt/Content */}
            {/* {currentQuestion?.content && (
              <div className="bg-gray-50 p-4 rounded-lg mb-4">
                <h4 className="font-medium text-gray-800 mb-2">Question:</h4>
                <p className="text-gray-700 leading-relaxed">
                  {currentQuestion?.content}
                </p>
              </div>
            )} */}

            {/* Information Text */}
            {/* {currentQuestion.informationText && (
              <div className="bg-yellow-50 p-4 rounded-lg mb-4">
                <h4 className="font-medium text-yellow-800 mb-2">
                  Information:
                </h4>
                <pre className="text-yellow-700 whitespace-pre-line">
                  {currentQuestion.informationText}
                </pre>
              </div>
            )} */}

            {/* Image */}
            {currentQuestion?.image_url && (
              <div className="bg-gray-50 p-4 rounded-lg mb-4">
                <h4 className="font-medium text-gray-800 mb-2">
                  Image to describe:
                </h4>
                {/* flex items-center justify-center */}
                <div className="relative rounded-lg">
                  {/* <span className="text-gray-500">
                    Sample Image Placeholder
                  </span> */}
                  <Image
                    src={`/${currentQuestion.image_url}`}
                    alt="question"
                    width={0}
                    height={0}
                    sizes="100vw"
                    className="w-full h-[auto] object-cover"
                  />
                </div>
              </div>
            )}

            {/* Time Information */}
            <div className="bg-purple-50 p-4 rounded-lg">
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <span className="font-medium text-purple-800">
                    Preparation time:
                  </span>
                  <div className="text-purple-700">
                    {/* currentQuestion.prepareTime */}
                    {formatTime(30)}
                  </div>
                </div>
                <div>
                  <span className="font-medium text-purple-800">
                    Response time:
                  </span>
                  <div className="text-purple-700">
                    {/* currentQuestion.responseTime */}
                    {formatTime(45)}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Recording Section */}
          <div>
            {/* Phase Indicator */}
            <div className="mb-4">
              <div className="flex space-x-2 mb-2">
                {["prepare", "respond", "review"].map((phase, index) => (
                  <div
                    key={phase}
                    className={`flex-1 text-center py-2 rounded-lg text-sm font-medium ${
                      currentPhase === phase
                        ? "bg-blue-500 text-white"
                        : index <
                          ["prepare", "respond", "review"].indexOf(currentPhase)
                        ? "bg-green-500 text-white"
                        : "bg-gray-200 text-gray-600"
                    }`}
                  >
                    {phase === "prepare" && "Preparation"}
                    {phase === "respond" && "Response"}
                    {phase === "review" && "Review"}
                  </div>
                ))}
              </div>
            </div>

            {/* Prepare Phase */}
            {currentPhase === "prepare" && (
              <div className="text-center">
                <div className="mb-4">
                  <ClockIcon className="h-12 w-12 text-blue-500 mx-auto mb-2" />
                  <h3 className="text-lg font-medium text-gray-800">
                    Preparation Time
                  </h3>
                  {isPreparing ? (
                    <div className="text-2xl font-bold text-blue-600">
                      {formatTime(prepareTime)}
                    </div>
                  ) : (
                    <button
                      onClick={startPreparePhase}
                      className="bg-blue-500 hover:bg-blue-600 text-white px-6 py-3 rounded-lg font-medium"
                    >
                      Start Preparation
                    </button>
                  )}
                  <p className="text-sm text-gray-600 mt-2">
                    Use this time to read and prepare your response
                  </p>
                </div>
              </div>
            )}

            {/* Response Phase */}
            {currentPhase === "respond" && (
              <div className="text-center">
                <div className="mb-4">
                  <div
                    className={`inline-flex items-center justify-center w-20 h-20 rounded-full ${
                      isRecording
                        ? "bg-red-500 animate-pulse"
                        : "bg-green-500 hover:bg-green-600"
                    } transition-colors mb-4`}
                  >
                    {isRecording ? (
                      <StopIcon
                        className="h-8 w-8 text-white cursor-pointer"
                        onClick={stopRecording}
                      />
                    ) : (
                      <MicrophoneIcon
                        className="h-8 w-8 text-white cursor-pointer"
                        onClick={startRecording}
                      />
                    )}
                  </div>

                  <h3 className="text-lg font-medium text-gray-800">
                    Response Time
                  </h3>
                  <div className="text-2xl font-bold text-green-600 mb-2">
                    {formatTime(recordingTime)}
                  </div>

                  <p className="text-sm text-gray-600">
                    {isRecording ? (
                      <>
                        Recording... Click stop when finished
                        {speechSupported && (
                          <span
                            className={`block text-xs mt-1 ${
                              isListening ? "text-green-600" : "text-orange-600"
                            }`}
                          >
                            {isListening
                              ? "🎤 Speech recognition active"
                              : "⚠️ Speech recognition paused"}
                          </span>
                        )}
                      </>
                    ) : (
                      "Click the microphone to start recording"
                    )}
                  </p>
                </div>
              </div>
            )}

            {/* Review Phase */}
            {currentPhase === "review" && (
              <div>
                <h3 className="text-lg font-medium text-gray-800 mb-4">
                  Review Your Response
                </h3>

                {/* Audio Playback */}
                {audioURL && (
                  <div className="bg-gray-50 p-4 rounded-lg mb-4">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium text-gray-700">
                        Your recording
                      </span>
                      <button
                        onClick={playAudio}
                        className="flex items-center space-x-1 text-blue-600 hover:text-blue-700"
                      >
                        {isPlaying ? (
                          <PauseIcon className="h-5 w-5" />
                        ) : (
                          <PlayIcon className="h-5 w-5" />
                        )}
                        <span className="text-sm">
                          {isPlaying ? "Pause" : "Play"}
                        </span>
                      </button>
                    </div>
                    <audio ref={audioRef} src={audioURL} className="hidden" />
                  </div>
                )}

                {/* Transcription */}
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Your response content:
                  </label>
                  <textarea
                    value={transcription}
                    onChange={(e) => setTranscription(e.target.value)}
                    placeholder="Your response will appear here, or you can edit it manually..."
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                    rows={4}
                  />
                </div>

                {error && (
                  <div className="bg-red-50 border border-red-200 rounded-lg p-3 mb-4">
                    <p className="text-red-700 text-sm">{error}</p>
                  </div>
                )}

                <button
                  onClick={() => handleSubmitResponse()}
                  disabled={!transcription.trim()}
                  className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white font-medium py-3 px-4 rounded-lg transition duration-200"
                >
                  Submit Response & Continue
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default memo(SpeakingExam);
