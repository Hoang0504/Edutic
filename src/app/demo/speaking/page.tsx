'use client';

import { useState, useRef, useEffect } from 'react';
import { MicrophoneIcon, StopIcon, PlayIcon, PauseIcon } from '@heroicons/react/24/solid';
import { ClockIcon, SpeakerWaveIcon, PencilIcon } from '@heroicons/react/24/outline';

interface AIFeedback {
  score: number;
  strengths: string;
  weaknesses: string;
  suggestions: string[] | string;
  pronunciation_score?: number;
  fluency_score?: number;
  content_score?: number;
  transcription?: string;
  pronunciation_analysis?: string;
}

export default function SpeakingDemoPage() {
  const [question, setQuestion] = useState<string>(
    "Describe your favorite hobby. Explain why you enjoy it and how often you do it. Talk about how this hobby has influenced your life. You have 60 seconds to speak."
  );
  const [isRecording, setIsRecording] = useState<boolean>(false);
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [recordingTime, setRecordingTime] = useState<number>(0);
  const [audioURL, setAudioURL] = useState<string>('');
  const [transcription, setTranscription] = useState<string>('');
  const [isProcessing, setIsProcessing] = useState<boolean>(false);
  const [feedback, setFeedback] = useState<AIFeedback | null>(null);
  const [error, setError] = useState<string>('');
  const [isListening, setIsListening] = useState<boolean>(false);
  const [manualEdit, setManualEdit] = useState<boolean>(false);
  const [speechSupported, setSpeechSupported] = useState<boolean>(false);

  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const recognitionRef = useRef<any>(null);
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const finalTranscriptRef = useRef<string>('');

  useEffect(() => {
    // Check for Speech Recognition support
    if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
      setSpeechSupported(true);
      
      const SpeechRecognition = (window as any).webkitSpeechRecognition || (window as any).SpeechRecognition;
      const recognition = new SpeechRecognition();
      
      recognition.continuous = true;
      recognition.interimResults = true;
      recognition.lang = 'en-US';
      recognition.maxAlternatives = 1;
      
      recognition.onstart = () => {
        console.log('Speech recognition started');
        setIsListening(true);
        setError('');
      };
      
      recognition.onresult = (event: any) => {
        let interimTranscript = '';
        
        // Process only new results from the last index
        for (let i = event.resultIndex; i < event.results.length; ++i) {
          const transcript = event.results[i][0].transcript;
          if (event.results[i].isFinal) {
            // Add final transcript to the accumulated final transcript
            finalTranscriptRef.current += transcript + ' ';
            setTranscription(finalTranscriptRef.current);
          } else {
            // Show interim results temporarily
            interimTranscript += transcript;
          }
        }
        
        // Show interim results combined with final transcript
        if (interimTranscript) {
          setTranscription(finalTranscriptRef.current + interimTranscript);
        }
      };

      recognition.onerror = (event: any) => {
        console.error('Speech recognition error:', event.error);
        setIsListening(false);
        
        if (event.error === 'no-speech') {
          setError('Không nhận được giọng nói. Hãy nói to hơn một chút.');
        } else if (event.error === 'network') {
          setError('Lỗi kết nối mạng. Kiểm tra kết nối internet.');
        } else {
          setError('Lỗi nhận diện giọng nói. Bạn có thể nhập văn bản thủ công bên dưới.');
        }
      };

      recognition.onend = () => {
        console.log('Speech recognition ended');
        setIsListening(false);
        
        // Auto-restart recognition if still recording
        if (isRecording) {
          setTimeout(() => {
            try {
              if (recognitionRef.current && isRecording) {
                recognitionRef.current.start();
              }
            } catch (err) {
              console.log('Recognition restart failed:', err);
            }
          }, 100);
        }
      };

      recognitionRef.current = recognition;
    } else {
      setSpeechSupported(false);
      setError('Trình duyệt không hỗ trợ nhận diện giọng nói. Vui lòng sử dụng Chrome/Edge.');
    }

    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    };
  }, [isRecording]);

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mediaRecorder = new MediaRecorder(stream);
      const audioChunks: BlobPart[] = [];

      mediaRecorder.ondataavailable = (event) => {
        audioChunks.push(event.data);
      };

      mediaRecorder.onstop = () => {
        const audioBlob = new Blob(audioChunks, { type: 'audio/wav' });
        const url = URL.createObjectURL(audioBlob);
        setAudioURL(url);
        stream.getTracks().forEach(track => track.stop());
      };

      mediaRecorder.start();
      mediaRecorderRef.current = mediaRecorder;
      setIsRecording(true);
      setRecordingTime(0);
      setTranscription('');
      finalTranscriptRef.current = '';
      setError('');
      setManualEdit(false);

      // Start Speech Recognition if supported
      if (speechSupported && recognitionRef.current) {
        try {
          recognitionRef.current.start();
        } catch (err) {
          console.error('Failed to start speech recognition:', err);
          setError('Không thể khởi động nhận diện giọng nói. Bạn có thể nhập văn bản sau khi ghi âm.');
        }
      }

      // Start timer
      timerRef.current = setInterval(() => {
        setRecordingTime(prev => prev + 1);
      }, 1000);

    } catch (err) {
      setError('Không thể truy cập microphone. Vui lòng cho phép quyền ghi âm.');
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
      
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }

      // Stop Speech Recognition
      if (recognitionRef.current && isListening) {
        try {
          recognitionRef.current.stop();
        } catch (err) {
          console.log('Recognition stop failed:', err);
        }
      }
      
      // If no transcription was captured, show manual input option
      setTimeout(() => {
        if (!transcription.trim()) {
          setError('Không nhận được văn bản từ ghi âm. Vui lòng nhập thủ công bên dưới.');
          setManualEdit(true);
        }
      }, 1000);
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

  const handleAnalyze = async () => {
    if (!transcription.trim()) {
      setError('Không có nội dung để phân tích. Vui lòng ghi âm lại hoặc nhập văn bản.');
      return;
    }

    setIsProcessing(true);
    setError('');
    setFeedback(null);

    try {
      const response = await fetch('/api/demo/analyze-speaking', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          question,
          transcription: transcription.trim(),
          recordingTime,
        }),
      });

      if (!response.ok) {
        throw new Error('Có lỗi xảy ra khi phân tích bài nói');
      }

      const data = await response.json();
      setFeedback(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Có lỗi xảy ra');
    } finally {
      setIsProcessing(false);
    }
  };

  const resetRecording = () => {
    setAudioURL('');
    setTranscription('');
    finalTranscriptRef.current = '';
    setRecordingTime(0);
    setFeedback(null);
    setError('');
    setIsPlaying(false);
    setManualEdit(false);
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-pink-100 py-8">
      <div className="max-w-4xl mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-800 mb-2">
            TOEIC Speaking Demo
          </h1>
          <p className="text-gray-600">
            Ghi âm và nhận phân tích từ AI DeepSeek
          </p>
          {!speechSupported && (
            <div className="mt-2 text-sm text-orange-600 bg-orange-50 px-4 py-2 rounded-lg inline-block">
              ⚠️ Nhận diện giọng nói không khả dụng - Có thể nhập văn bản thủ công
            </div>
          )}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Recording Section */}
          <div className="bg-white rounded-xl shadow-lg p-6">
            <div className="flex items-center mb-4">
              <SpeakerWaveIcon className="h-6 w-6 text-purple-500 mr-2" />
              <h2 className="text-xl font-semibold text-gray-800">Đề bài</h2>
            </div>
            
            <div className="bg-purple-50 p-4 rounded-lg mb-6">
              <p className="text-gray-800 leading-relaxed">{question}</p>
            </div>

            {/* Recording Controls */}
            <div className="text-center mb-6">
              <div className={`inline-flex items-center justify-center w-24 h-24 rounded-full ${
                isRecording ? 'bg-red-500 animate-pulse' : 'bg-purple-500 hover:bg-purple-600'
              } transition-colors mb-4`}>
                {isRecording ? (
                  <StopIcon 
                    className="h-10 w-10 text-white cursor-pointer" 
                    onClick={stopRecording}
                  />
                ) : (
                  <MicrophoneIcon 
                    className="h-10 w-10 text-white cursor-pointer" 
                    onClick={startRecording}
                  />
                )}
              </div>
              
              <div className="flex items-center justify-center space-x-2 mb-2">
                <ClockIcon className="h-4 w-4 text-gray-500" />
                <span className={`text-lg font-mono ${
                  recordingTime >= 60 ? 'text-orange-600' : 'text-gray-700'
                }`}>
                  {formatTime(recordingTime)}
                </span>
                {recordingTime >= 60 && (
                  <span className="text-xs text-orange-600 font-medium">
                    (Đã vượt thời gian khuyến nghị)
                  </span>
                )}
              </div>
              
              <p className="text-sm text-gray-600">
                {isRecording ? (
                  <>
                    Đang ghi âm...
                    {speechSupported && (
                      <span className={`block text-xs mt-1 ${
                        isListening ? 'text-green-600' : 'text-orange-600'
                      }`}>
                        {isListening ? '🎤 Đang nhận diện giọng nói' : '⚠️ Nhận diện tạm dừng'}
                      </span>
                    )}
                    {recordingTime < 60 && (
                      <span className="block text-xs text-purple-600 mt-1">
                        Khuyến nghị: 45-60 giây
                      </span>
                    )}
                  </>
                ) : (
                  'Nhấn để bắt đầu ghi âm'
                )}
              </p>
            </div>

            {/* Audio Playback */}
            {audioURL && (
              <div className="bg-gray-50 p-4 rounded-lg mb-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium text-gray-700">Bài ghi âm</span>
                  <div className="flex items-center space-x-2">
                    <button
                      onClick={playAudio}
                      className="flex items-center space-x-1 text-purple-600 hover:text-purple-700"
                    >
                      {isPlaying ? (
                        <PauseIcon className="h-5 w-5" />
                      ) : (
                        <PlayIcon className="h-5 w-5" />
                      )}
                      <span className="text-sm">
                        {isPlaying ? 'Tạm dừng' : 'Phát'}
                      </span>
                    </button>
                    <button
                      onClick={resetRecording}
                      className="text-sm text-gray-500 hover:text-gray-700"
                    >
                      Ghi lại
                    </button>
                  </div>
                </div>
                <audio ref={audioRef} src={audioURL} className="hidden" />
              </div>
            )}

            {/* Transcription */}
            <div className="mb-4">
              <div className="flex items-center justify-between mb-2">
                <label className="block text-sm font-medium text-gray-700">
                  Nội dung bài nói:
                </label>
                {audioURL && !isRecording && (
                  <button
                    onClick={() => setManualEdit(!manualEdit)}
                    className="flex items-center space-x-1 text-purple-600 hover:text-purple-700 text-sm"
                  >
                    <PencilIcon className="h-4 w-4" />
                    <span>{manualEdit ? 'Xem kết quả' : 'Sửa thủ công'}</span>
                  </button>
                )}
              </div>
              
              {manualEdit ? (
                <textarea
                  value={transcription}
                  onChange={(e) => setTranscription(e.target.value)}
                  placeholder="Nhập nội dung bài nói của bạn vào đây..."
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent resize-none"
                  rows={4}
                />
              ) : (
                <div className={`p-3 rounded-lg min-h-[100px] ${
                  transcription ? 'bg-blue-50 border border-blue-200' : 'bg-gray-50 border border-gray-200'
                }`}>
                  {transcription ? (
                    <p className="text-gray-800 text-sm leading-relaxed whitespace-pre-wrap">
                      {transcription}
                    </p>
                  ) : (
                    <p className="text-gray-500 text-sm italic">
                      {isRecording 
                        ? 'Đang ghi âm và nhận diện giọng nói...' 
                        : audioURL 
                          ? 'Không có văn bản được nhận diện. Nhấn "Sửa thủ công" để nhập.'
                          : 'Nội dung bài nói sẽ xuất hiện ở đây'
                      }
                    </p>
                  )}
                </div>
              )}
            </div>

            {error && (
              <div className="bg-red-50 border border-red-200 rounded-lg p-3 mb-4">
                <p className="text-red-700 text-sm">{error}</p>
              </div>
            )}

            <button
              onClick={handleAnalyze}
              disabled={isProcessing || !transcription.trim() || isRecording}
              className="w-full bg-purple-600 hover:bg-purple-700 disabled:bg-gray-400 text-white font-medium py-3 px-4 rounded-lg transition duration-200 flex items-center justify-center"
            >
              {isProcessing ? (
                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
              ) : (
                'Phân tích bài nói'
              )}
            </button>

            {/* Helper text */}
            <p className="text-xs text-gray-500 mt-2 text-center">
              {!transcription.trim() 
                ? !audioURL 
                  ? "Ghi âm để bắt đầu nhận diện giọng nói" 
                  : "Chưa có văn bản - Có thể sửa thủ công"
                : isRecording 
                  ? "Dừng ghi âm để có thể phân tích"
                  : `Đã ghi được ${recordingTime} giây - Sẵn sàng phân tích`
              }
            </p>
          </div>

          {/* Feedback Section */}
          <div className="bg-white rounded-xl shadow-lg p-6">
            <h2 className="text-xl font-semibold text-gray-800 mb-6">
              Phân tích từ AI DeepSeek
            </h2>

            {!feedback && !isProcessing && (
              <div className="text-center py-12">
                <div className="text-gray-400 mb-4">
                  <SpeakerWaveIcon className="mx-auto h-16 w-16" />
                </div>
                <p className="text-gray-500">
                  Hoàn thành bài nói và nhấn "Phân tích" để nhận phản hồi từ AI
                </p>
              </div>
            )}

            {isProcessing && (
              <div className="text-center py-12">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600 mx-auto mb-4"></div>
                <p className="text-gray-600">AI đang phân tích bài nói của bạn...</p>
              </div>
            )}

            {feedback && (
              <div className="space-y-6">
                {/* Overall Score */}
                <div className="bg-gradient-to-r from-purple-50 to-pink-50 p-4 rounded-lg">
                  <div className="flex items-center justify-between">
                    <h3 className="font-semibold text-gray-800">Điểm tổng</h3>
                    <span className="text-2xl font-bold text-purple-600">
                      {feedback.score}/10
                    </span>
                  </div>
                </div>

                {/* Detailed Scores */}
                {(feedback.pronunciation_score || feedback.fluency_score || feedback.content_score) && (
                  <div className="grid grid-cols-3 gap-3">
                    {feedback.pronunciation_score && (
                      <div className="text-center p-3 bg-blue-50 rounded-lg">
                        <div className="text-lg font-semibold text-blue-600">
                          {feedback.pronunciation_score}/10
                        </div>
                        <div className="text-xs text-gray-600">Phát âm</div>
                      </div>
                    )}
                    {feedback.fluency_score && (
                      <div className="text-center p-3 bg-green-50 rounded-lg">
                        <div className="text-lg font-semibold text-green-600">
                          {feedback.fluency_score}/10
                        </div>
                        <div className="text-xs text-gray-600">Lưu loát</div>
                      </div>
                    )}
                    {feedback.content_score && (
                      <div className="text-center p-3 bg-purple-50 rounded-lg">
                        <div className="text-lg font-semibold text-purple-600">
                          {feedback.content_score}/10
                        </div>
                        <div className="text-xs text-gray-600">Nội dung</div>
                      </div>
                    )}
                  </div>
                )}

                {/* Transcription */}
                {feedback.transcription && (
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <h3 className="font-semibold text-gray-800 mb-2">📝 Nội dung đã nói</h3>
                    <p className="text-gray-700 text-sm leading-relaxed">
                      {feedback.transcription}
                    </p>
                  </div>
                )}

                {/* Strengths */}
                <div className="bg-green-50 p-4 rounded-lg">
                  <h3 className="font-semibold text-green-800 mb-2">✅ Điểm mạnh</h3>
                  <p className="text-green-700 text-sm leading-relaxed">
                    {feedback.strengths}
                  </p>
                </div>

                {/* Weaknesses */}
                <div className="bg-orange-50 p-4 rounded-lg">
                  <h3 className="font-semibold text-orange-800 mb-2">⚠️ Điểm cần cải thiện</h3>
                  <p className="text-orange-700 text-sm leading-relaxed">
                    {feedback.weaknesses}
                  </p>
                </div>

                {/* Pronunciation Analysis */}
                {feedback.pronunciation_analysis && (
                  <div className="bg-blue-50 p-4 rounded-lg">
                    <h3 className="font-semibold text-blue-800 mb-2">🗣️ Phân tích phát âm</h3>
                    <p className="text-blue-700 text-sm leading-relaxed">
                      {feedback.pronunciation_analysis}
                    </p>
                  </div>
                )}

                {/* Suggestions */}
                <div className="bg-purple-50 p-4 rounded-lg">
                  <h3 className="font-semibold text-purple-800 mb-3">💡 Gợi ý cải thiện</h3>
                  {Array.isArray(feedback.suggestions) ? (
                    <ul className="space-y-2">
                      {feedback.suggestions.map((suggestion, index) => (
                        <li key={index} className="text-purple-700 text-sm flex items-start">
                          <span className="text-purple-500 mr-2 mt-0.5">•</span>
                          {suggestion}
                        </li>
                      ))}
                    </ul>
                  ) : (
                    <div className="text-purple-700 text-sm leading-relaxed whitespace-pre-line">
                      {feedback.suggestions}
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
} 