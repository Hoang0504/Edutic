'use client';

import React, { useState, useEffect, useRef } from 'react';
import * as faceapi from 'face-api.js';
import { FaChevronLeft } from 'react-icons/fa';

interface ExamSupervisionProps {
  isReadingSection: boolean;
}

const ExamSupervision: React.FC<ExamSupervisionProps> = ({ isReadingSection }) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const audioContextRef = useRef<AudioContext | null>(null);
  const analyserRef = useRef<AnalyserNode | null>(null);

  const [isCameraAllowed, setIsCameraAllowed] = useState(false);
  const [isMicAllowed, setIsMicAllowed] = useState(false);
  const [isMonitoring, setIsMonitoring] = useState(false);
  const [isViolation, setIsViolation] = useState(false);
  const [showCamera, setShowCamera] = useState(true);
  const [showPermissionPrompt, setShowPermissionPrompt] = useState(true);
  const [stream, setStream] = useState<MediaStream | null>(null);
  const [showToast, setShowToast] = useState(false);

  useEffect(() => {
    const loadModels = async () => {
      try {
        await faceapi.nets.ssdMobilenetv1.loadFromUri('/models');
        await faceapi.nets.faceLandmark68Net.loadFromUri('/models');
        console.log('Mô hình face-api.js đã tải thành công!');
      } catch (error) {
        console.error('Lỗi tải mô hình:', error);
      }
    };
    loadModels();
  }, []);

  useEffect(() => {
    const requestPermissions = async () => {
      try {
        const userStream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
        setStream(userStream);
        setIsCameraAllowed(true);
        setIsMicAllowed(true);

        if (videoRef.current) {
          videoRef.current.srcObject = userStream;
          videoRef.current.play();
        }

        startMonitoring();

        setTimeout(() => setShowPermissionPrompt(false), 2000);
      } catch (error) {
        console.error('Lỗi truy cập:', error);
        alert('Bạn cần cấp quyền cả camera và micro để tiếp tục.');
      }
    };

    if (!isMonitoring) {
      requestPermissions();
    }
  }, [isMonitoring]);

  const startMonitoring = () => {
    setIsMonitoring(true);
    startFaceDetection();
    if (isReadingSection) startAudioMonitoring();
  };

  const startFaceDetection = () => {
    const interval = setInterval(async () => {
      if (!videoRef.current || !canvasRef.current || !isMonitoring) return;

      const detections = await faceapi
        .detectAllFaces(videoRef.current, new faceapi.SsdMobilenetv1Options())
        .withFaceLandmarks();

      const canvas = canvasRef.current;
      const context = canvas.getContext('2d');
      context?.clearRect(0, 0, canvas.width, canvas.height);
      faceapi.draw.drawDetections(canvas, detections);
      faceapi.draw.drawFaceLandmarks(canvas, detections);

      if (detections.length === 0) handleViolation('Không phát hiện khuôn mặt!');
    }, 2000);

    return () => clearInterval(interval);
  };

  const startAudioMonitoring = () => {
    const audioContext = new AudioContext();
    const analyser = audioContext.createAnalyser();
    audioContextRef.current = audioContext;
    analyserRef.current = analyser;
    analyser.fftSize = 2048;

    navigator.mediaDevices.getUserMedia({ audio: true }).then(stream => {
      const source = audioContext.createMediaStreamSource(stream);
      source.connect(analyser);
      const bufferLength = analyser.frequencyBinCount;
      const dataArray = new Uint8Array(bufferLength);

      const interval = setInterval(() => {
        if (!isMonitoring) return;
        analyser.getByteFrequencyData(dataArray);
        const volume = dataArray.reduce((sum, val) => sum + val, 0) / bufferLength;
        if (volume > 20) handleViolation('Phát hiện tiếng động trong phần đọc!');
      }, 1000);

      return () => clearInterval(interval);
    });
  };

  const handleViolation = (message: string) => {
    if (!isViolation) {
      setIsViolation(true);
      alert(message);
    }
  };

  const disableSupervision = () => {
    setIsMonitoring(false);
    setIsViolation(false);
    setShowToast(true);

    if (videoRef.current) videoRef.current.pause();
    if (stream) {
      stream.getTracks().forEach(track => track.stop());
      setStream(null);
    }
    if (audioContextRef.current) audioContextRef.current.close();

    setTimeout(() => setShowToast(false), 3000);
  };

  return (
    <div className="relative w-full h-full">
      {showPermissionPrompt && (
        <div className="fixed top-0 inset-x-0 flex items-center justify-center bg-white text-black z-50 animate-slide-fade py-4">
          <p className="text-center text-lg font-medium max-w-md">
            Để đảm bảo chất lượng bài thi của bạn tốt nhất, vui lòng cho phép sử dụng camera và mic.
          </p>
        </div>
      )}

      {isMonitoring && (
        <>
          <div
            className={`fixed top-5 right-0 z-40 transition-transform duration-300 ${
              showCamera ? 'translate-x-0' : 'translate-x-full'
            }`}
          >
            <div className="relative bg-gray-100 rounded shadow-md p-2 w-[220px]">
              <video ref={videoRef} autoPlay muted width={200} height={150} className="rounded" />
              <canvas ref={canvasRef} width={200} height={150} className="absolute top-0 left-0" />
              <button
                className="mt-1 text-sm text-white bg-gray-800 px-2 py-1 rounded"
                onClick={() => setShowCamera(false)}
              >
                Ẩn camera
              </button>
            </div>

            {!showCamera && (
              <button
                className="absolute top-1/2 -left-6 transform -translate-y-1/2 bg-gray-800 text-white rounded-full p-1"
                onClick={() => setShowCamera(true)}
              >
                <FaChevronLeft size={20} />
              </button>
            )}
          </div>

          {isViolation && (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex flex-col items-center justify-center z-50">
              <div className="bg-white p-6 rounded shadow-md text-center">
                <p className="mb-4">Phát hiện vi phạm! Vui lòng chọn:</p>
                <button
                  onClick={() => setIsViolation(false)}
                  className="px-4 py-2 bg-blue-500 text-white rounded mr-2"
                >
                  Tiếp tục thi
                </button>
                <button
                  onClick={() => alert('Bài thi đã bị hủy!')}
                  className="px-4 py-2 bg-red-500 text-white rounded"
                >
                  Hủy làm bài
                </button>
              </div>
            </div>
          )}

          <button
            onClick={disableSupervision}
            className="fixed bottom-4 left-4 bg-gray-800 text-white px-4 py-2 rounded"
          >
            Tắt chế độ giám sát
          </button>
        </>
      )}

      {showToast && (
        <div className="fixed bottom-5 right-5 bg-green-500 text-white px-4 py-2 rounded shadow">
          Đã tắt chế độ giám sát!
        </div>
      )}
    </div>
  );
};

export default ExamSupervision;
