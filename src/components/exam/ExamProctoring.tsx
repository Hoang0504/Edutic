"use client";

import React, { useRef, useEffect, useState, useCallback } from "react";
import * as faceapi from "face-api.js";

interface ExamProctoringProps {
  isEnabled: boolean;
  onViolation: (type: "face" | "audio", message: string) => void;
  onPauseTimer: (pause: boolean) => void;
  currentSkill: "listening" | "reading" | "writing" | "speaking";
  className?: string;
  noiseThreshold?: number; // Ngưỡng tạp âm cho phép
  voiceThreshold?: number; // Ngưỡng phát hiện tiếng nói
}

interface ViolationAlert {
  type: "face" | "audio";
  message: string;
  timestamp: number;
}

const ExamProctoring: React.FC<ExamProctoringProps> = ({
  isEnabled,
  onViolation,
  onPauseTimer,
  currentSkill,
  className = "",
  noiseThreshold = 20, // Ngưỡng tạp âm mặc định
  voiceThreshold = 30, // Ngưỡng tiếng nói mặc định
}) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const audioContextRef = useRef<AudioContext | null>(null);
  const analyserRef = useRef<AnalyserNode | null>(null);
  const streamRef = useRef<MediaStream | null>(null);

  const [isVideoVisible, setIsVideoVisible] = useState(true);
  const [faceDetected, setFaceDetected] = useState(true);
  const [audioLevel, setAudioLevel] = useState(0);
  const [modelsLoaded, setModelsLoaded] = useState(false);
  const [violations, setViolations] = useState<ViolationAlert[]>([]);
  const [isRecording, setIsRecording] = useState(false);
  const [lastFaceDetection, setLastFaceDetection] = useState(Date.now());
  const [modelLoadingError, setModelLoadingError] = useState<string | null>(
    null
  );

  const [backgroundNoiseLevel, setBackgroundNoiseLevel] = useState(0);
  const [isCalibrating, setIsCalibrating] = useState(true);
  const [voiceDetected, setVoiceDetected] = useState(false);
  const voiceDetectionTimeoutRef = useRef<NodeJS.Timeout>();

  // Hàm phân tích âm thanh cải tiến
  const analyzeAudio = useCallback((dataArray: Uint8Array) => {
    // Tính toán mức âm thanh trung bình
    const average =
      dataArray.reduce((sum, value) => sum + value, 0) / dataArray.length;

    // Phân tích tần số để phát hiện tiếng nói
    const voiceFrequencyRange = dataArray.slice(20, 50); // Tần số đặc trưng của giọng nói
    const voiceLevel =
      voiceFrequencyRange.reduce((sum, value) => sum + value, 0) /
      voiceFrequencyRange.length;

    return { average, voiceLevel };
  }, []);

  // Initialize face detection models
  useEffect(() => {
    const loadModels = async () => {
      try {
        console.log("Loading face detection models...");

        // Load các models cần thiết
        await Promise.all([
          faceapi.nets.tinyFaceDetector.loadFromUri("/models"),
          faceapi.nets.faceLandmark68Net.loadFromUri("/models"),
          faceapi.nets.faceRecognitionNet.loadFromUri("/models"),
        ]);

        console.log("Face detection models loaded successfully!");
        setModelsLoaded(true);
        setModelLoadingError(null);
      } catch (error) {
        console.error("Error loading face detection models:", error);
        setModelLoadingError("Không thể tải models nhận diện khuôn mặt");
        // Fallback to basic mode
        setModelsLoaded(false);
      }
    };

    if (isEnabled) {
      loadModels();
    }
  }, [isEnabled]);

  // Initialize camera and microphone
  const initializeMedia = useCallback(async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { width: 640, height: 480 }, // Tăng resolution cho face detection tốt hơn
        audio: true,
      });

      streamRef.current = stream;
      setIsRecording(true);

      if (videoRef.current) {
        videoRef.current.srcObject = stream;
      }

      // Setup audio analysis
      const audioContext = new AudioContext();
      const analyser = audioContext.createAnalyser();
      const source = audioContext.createMediaStreamSource(stream);

      analyser.fftSize = 256;
      source.connect(analyser);

      audioContextRef.current = audioContext;
      analyserRef.current = analyser;

      // Start audio monitoring
      startAudioMonitoring();
    } catch (error) {
      console.error("Error accessing media devices:", error);
      onViolation(
        "face",
        "Không thể truy cập camera hoặc microphone. Vui lòng cấp quyền và thử lại."
      );
    }
  }, [onViolation]);

  // Audio monitoring function
  const startAudioMonitoring = useCallback(() => {
    if (!analyserRef.current) return;

    const dataArray = new Uint8Array(analyserRef.current.frequencyBinCount);
    const calibrationSamples: number[] = [];
    let calibrationCount = 0;

    const checkAudioLevel = () => {
      if (!analyserRef.current) return;

      analyserRef.current.getByteFrequencyData(dataArray);
      // const average =
      //   dataArray.reduce((sum, value) => sum + value, 0) / dataArray.length;
      const { average, voiceLevel } = analyzeAudio(dataArray);

      // Giai đoạn hiệu chỉnh (5 giây đầu)
      if (isCalibrating && calibrationCount < 50) {
        // 50 samples ~ 5 giây
        calibrationSamples.push(average);
        calibrationCount++;

        if (calibrationCount === 50) {
          // Tính toán ngưỡng tạp âm nền
          const avgBackgroundNoise =
            calibrationSamples.reduce((sum, val) => sum + val, 0) /
            calibrationSamples.length;
          setBackgroundNoiseLevel(avgBackgroundNoise);
          setIsCalibrating(false);
        }

        setAudioLevel(average);
        requestAnimationFrame(checkAudioLevel);
        return;
      }

      // Sau khi hiệu chỉnh
      setAudioLevel(average);

      // Tính toán ngưỡng động
      const dynamicThreshold = backgroundNoiseLevel + 10; // Ngưỡng = tạp âm nền + 10

      // COMMENT: Đây là chỗ phát hiện âm thanh cho bài đọc
      // Chỉ cảnh báo nếu đang làm bài reading và phát hiện âm thanh vượt ngưỡng
      // if (currentSkill === "reading" && average > 30) {
      //   const violation: ViolationAlert = {
      //     type: "audio",
      //     message: "Phát hiện tiếng nói trong phần thi đọc!",
      //     timestamp: Date.now(),
      //   };

      //   setViolations((prev) => [...prev, violation]);
      //   onViolation("audio", violation.message);
      // }
      if (currentSkill === "reading") {
        const isVoiceDetected =
          voiceLevel > dynamicThreshold && average > noiseThreshold;

        if (isVoiceDetected && !voiceDetected) {
          // Xác nhận tiếng nói trong 500ms để tránh false positive
          if (voiceDetectionTimeoutRef.current) {
            clearTimeout(voiceDetectionTimeoutRef.current);
          }

          voiceDetectionTimeoutRef.current = setTimeout(() => {
            const violation: ViolationAlert = {
              type: "audio",
              message: "Phát hiện tiếng nói trong phần thi đọc!",
              timestamp: Date.now(),
            };

            setViolations((prev) => [...prev, violation]);
            onViolation("audio", violation.message);
            setVoiceDetected(true);

            // Tự động tắt phát hiện sau 3 giây
            setTimeout(() => setVoiceDetected(false), 3000);
          }, 500);
        } else if (!isVoiceDetected && voiceDetected) {
          if (voiceDetectionTimeoutRef.current) {
            clearTimeout(voiceDetectionTimeoutRef.current);
          }
          setVoiceDetected(false);
        }
      }

      // Continue monitoring
      if (isEnabled) {
        requestAnimationFrame(checkAudioLevel);
      }
    };

    checkAudioLevel();

    // Cleanup
    return () => {
      if (voiceDetectionTimeoutRef.current) {
        clearTimeout(voiceDetectionTimeoutRef.current);
      }
    };
    // currentSkill, isEnabled, onViolation
  }, [
    currentSkill,
    isEnabled,
    isCalibrating,
    backgroundNoiseLevel,
    noiseThreshold,
    voiceDetected,
    onViolation,
    analyzeAudio,
  ]);

  // Advanced face detection using face-api.js
  const detectFace = useCallback(async () => {
    if (!videoRef.current || !canvasRef.current || !modelsLoaded) return;

    try {
      const detections = await faceapi
        .detectAllFaces(videoRef.current, new faceapi.TinyFaceDetectorOptions())
        .withFaceLandmarks()
        .withFaceDescriptors();

      const canvas = canvasRef.current;
      const displaySize = {
        width: videoRef.current.videoWidth,
        height: videoRef.current.videoHeight,
      };
      faceapi.matchDimensions(canvas, displaySize);

      // Clear previous drawings
      const ctx = canvas.getContext("2d");
      if (ctx) {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
      }

      if (detections.length > 0) {
        setFaceDetected(true);
        setLastFaceDetection(Date.now());

        // Draw face detection boxes and landmarks
        const resizedDetections = faceapi.resizeResults(
          detections,
          displaySize
        );
        faceapi.draw.drawDetections(canvas, resizedDetections);
        faceapi.draw.drawFaceLandmarks(canvas, resizedDetections);
      } else {
        setFaceDetected(false);

        // Check if face has been missing for more than 5 seconds
        if (Date.now() - lastFaceDetection > 5000) {
          const violation: ViolationAlert = {
            type: "face",
            message: "Không phát hiện khuôn mặt! Vui lòng ngồi trước camera.",
            timestamp: Date.now(),
          };

          setViolations((prev) => [...prev, violation]);
          onViolation("face", violation.message);
          setLastFaceDetection(Date.now()); // Reset to prevent spam
        }
      }
    } catch (error) {
      console.error("Error in face detection:", error);
    }
  }, [modelsLoaded, lastFaceDetection, onViolation]);

  // Start face detection loop
  useEffect(() => {
    if (!isEnabled || !modelsLoaded) return;

    const faceDetectionInterval = setInterval(detectFace, 1000); // Check every 1 second

    return () => {
      clearInterval(faceDetectionInterval);
    };
  }, [isEnabled, modelsLoaded, detectFace]);

  // Basic motion detection fallback (when models not loaded)
  const startBasicMotionDetection = useCallback(() => {
    const checkMotion = () => {
      if (!videoRef.current || !isEnabled || modelsLoaded) return;

      // Simple presence detection based on video stream status
      const video = videoRef.current;
      if (video.videoWidth > 0 && video.videoHeight > 0) {
        setLastFaceDetection(Date.now());
        setFaceDetected(true);
      }

      // Continue monitoring
      if (isEnabled && !modelsLoaded) {
        setTimeout(checkMotion, 5000); // Check every 5 seconds
      }
    };

    checkMotion();
  }, [isEnabled, modelsLoaded]);

  // Initialize media when component mounts and is enabled
  useEffect(() => {
    if (isEnabled) {
      initializeMedia();
    }

    return () => {
      // Cleanup
      if (streamRef.current) {
        streamRef.current.getTracks().forEach((track) => track.stop());
      }
      if (audioContextRef.current) {
        audioContextRef.current.close();
      }
      setIsRecording(false);
    };
  }, [isEnabled, initializeMedia]);

  // Start basic detection when models fail to load
  useEffect(() => {
    if (isEnabled && !modelsLoaded && modelLoadingError) {
      startBasicMotionDetection();
    }
  }, [isEnabled, modelsLoaded, modelLoadingError, startBasicMotionDetection]);

  const renderStatusInfo = () => (
    <div className="mt-2 bg-blue-50 border border-blue-200 rounded p-2">
      <p className="text-xs text-blue-700">
        {isCalibrating ? (
          "🔧 Đang hiệu chỉnh tạp âm nền..."
        ) : (
          <>
            💡 <strong>Trạng thái:</strong>{" "}
            {modelsLoaded
              ? `Nhận diện khuôn mặt AI | Tạp âm nền: ${Math.round(
                  backgroundNoiseLevel
                )}`
              : modelLoadingError
              ? "Chế độ giám sát cơ bản"
              : "Đang tải AI models..."}
          </>
        )}
      </p>
    </div>
  );

  if (!isEnabled) {
    return null;
  }

  return (
    <div className={`fixed top-20 right-4 z-50 ${className}`}>
      {/* Camera Preview */}
      <div
        className={`bg-white rounded-lg shadow-lg border-2 border-gray-300 overflow-hidden transition-all duration-300 ${
          isVideoVisible ? "w-80 h-60" : "w-12 h-12"
        }`}
      >
        {isVideoVisible ? (
          <div className="relative">
            {/* Header */}
            <div className="bg-gray-800 text-white px-3 py-2 flex justify-between items-center">
              <span className="text-sm font-medium">Giám sát thi</span>
              <div className="flex items-center space-x-2">
                {/* Status indicators */}
                <div
                  className={`w-2 h-2 rounded-full ${
                    isRecording ? "bg-green-400" : "bg-red-400"
                  }`}
                  title={
                    isRecording
                      ? "Camera đang hoạt động"
                      : "Camera không hoạt động"
                  }
                />
                <div
                  className={`w-2 h-2 rounded-full ${
                    faceDetected ? "bg-green-400" : "bg-red-400"
                  }`}
                  title={
                    faceDetected
                      ? "Đã phát hiện khuôn mặt"
                      : "Không phát hiện khuôn mặt"
                  }
                />
                <div
                  className={`w-2 h-2 rounded-full ${
                    audioLevel > 20 ? "bg-yellow-400" : "bg-gray-400"
                  }`}
                  title={`Mức âm thanh: ${Math.round(audioLevel)}`}
                />
                <div
                  className={`w-2 h-2 rounded-full ${
                    modelsLoaded ? "bg-blue-400" : "bg-orange-400"
                  }`}
                  title={modelsLoaded ? "AI models đã tải" : "Chế độ cơ bản"}
                />
                <button
                  onClick={() => setIsVideoVisible(false)}
                  className="text-white hover:text-gray-300 text-sm"
                >
                  −
                </button>
              </div>
            </div>

            {/* Video container */}
            <div className="relative">
              <video
                ref={videoRef}
                autoPlay
                muted
                playsInline
                className="w-full h-48 object-cover bg-gray-900"
              />

              {/* Canvas overlay for face detection */}
              <canvas
                ref={canvasRef}
                className="absolute top-0 left-0 w-full h-full"
                style={{ pointerEvents: "none" }}
              />

              {/* Recording indicator */}
              {isRecording && (
                <div className="absolute top-2 left-2 bg-red-600 text-white text-xs px-2 py-1 rounded flex items-center">
                  <div className="w-2 h-2 bg-white rounded-full mr-1 animate-pulse"></div>
                  REC
                </div>
              )}

              {/* Face detection status */}
              {modelsLoaded && (
                <div
                  className={`absolute top-2 right-2 text-xs px-2 py-1 rounded ${
                    faceDetected
                      ? "bg-green-600 text-white"
                      : "bg-red-600 text-white"
                  }`}
                >
                  {faceDetected ? "👤 Detected" : "❌ No Face"}
                </div>
              )}
            </div>

            {/* Audio level indicator */}
            <div className="bg-gray-100 px-3 py-2">
              <div className="flex items-center space-x-2">
                <span className="text-xs text-gray-600">Mic:</span>
                <div className="flex-1 bg-gray-300 rounded-full h-1">
                  <div
                    className={`h-1 rounded-full transition-all duration-200 ${
                      audioLevel > 30
                        ? "bg-red-500"
                        : audioLevel > 20
                        ? "bg-yellow-500"
                        : "bg-green-500"
                    }`}
                    style={{ width: `${Math.min(audioLevel * 2, 100)}%` }}
                  />
                </div>
                <span className="text-xs text-gray-600">
                  {Math.round(audioLevel)}
                </span>
              </div>

              {/* Model status */}
              <div className="mt-1 text-xs text-gray-500">
                {modelsLoaded ? (
                  <span className="text-green-600">✓ AI Face Detection</span>
                ) : modelLoadingError ? (
                  <span className="text-orange-600">⚠ Basic Mode</span>
                ) : (
                  <span className="text-blue-600">⏳ Loading Models...</span>
                )}
              </div>
            </div>
          </div>
        ) : (
          /* Minimized view */
          <button
            onClick={() => setIsVideoVisible(true)}
            className={`w-full h-full text-white flex items-center justify-center ${
              faceDetected
                ? "bg-green-600 hover:bg-green-700"
                : "bg-red-600 hover:bg-red-700"
            }`}
            title="Hiển thị camera giám sát"
          >
            <svg
              className="w-6 h-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M15 10l4.55-3.64a1 1 0 011.45.9v5.48a1 1 0 01-1.45.9L15 10zM4 6h7a2 2 0 012 2v8a2 2 0 01-2 2H4a2 2 0 01-2-2V8a2 2 0 012-2z"
              />
            </svg>
          </button>
        )}
      </div>
      {/* Violation alerts */}
      {violations.length > 0 && (
        <div className="mt-2 space-y-1">
          {violations.slice(-3).map((violation, index) => (
            <div
              key={violation.timestamp}
              className={`text-xs px-2 py-1 rounded text-white ${
                violation.type === "face" ? "bg-red-500" : "bg-orange-500"
              }`}
            >
              {violation.message}
            </div>
          ))}
        </div>
      )}
      {/* Status info */}
      {/* {isVideoVisible && (
        <div className="mt-2 bg-blue-50 border border-blue-200 rounded p-2">
          <p className="text-xs text-blue-700">
            💡 <strong>Trạng thái:</strong>{" "}
            {modelsLoaded
              ? "Nhận diện khuôn mặt AI đang hoạt động"
              : modelLoadingError
              ? "Chế độ giám sát cơ bản"
              : "Đang tải AI models..."}
          </p>
        </div>
      )} */}
      renderStatusInfo();
    </div>
  );
};

export default ExamProctoring;
