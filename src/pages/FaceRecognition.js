import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { collection, addDoc } from 'firebase/firestore';
import { db } from '../firebase/config';
import * as faceapi from '@vladmandic/face-api';

const EMOTIONS_MAP = {
  happy: { emoji: '😊', label: '기분 좋아요', score: 80 },
  sad: { emoji: '😢', label: '많이 힘들어요', score: 20 },
  angry: { emoji: '😤', label: '화나요', score: 25 },
  fearful: { emoji: '😰', label: '불안해요', score: 30 },
  disgusted: { emoji: '😔', label: '조금 우울해요', score: 40 },
  surprised: { emoji: '🌟', label: '최고예요', score: 100 },
  neutral: { emoji: '😌', label: '평온해요', score: 60 }
};

function FaceRecognition() {
  const { currentUser } = useAuth();
  const navigate = useNavigate();
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  
  const [isModelLoaded, setIsModelLoaded] = useState(false);
  const [isCameraActive, setIsCameraActive] = useState(false);
  const [isDetecting, setIsDetecting] = useState(false);
  const [currentEmotion, setCurrentEmotion] = useState(null);
  const [emotionHistory, setEmotionHistory] = useState([]);
  const [error, setError] = useState('');
  const [countdown, setCountdown] = useState(null);

  // 모델 로드
  useEffect(() => {
    loadModels();
  }, []);

  const loadModels = async () => {
    try {
      console.log('🤖 Face-API 모델 로딩 시작...');
      const MODEL_URL = '/models';
      
      await Promise.all([
        faceapi.nets.tinyFaceDetector.loadFromUri(MODEL_URL),
        faceapi.nets.faceExpressionNet.loadFromUri(MODEL_URL)
      ]);
      
      console.log('✅ Face-API 모델 로딩 완료!');
      setIsModelLoaded(true);
    } catch (err) {
      console.error('❌ 모델 로딩 실패:', err);
      setError('AI 모델을 불러오는데 실패했습니다. 페이지를 새로고침해주세요.');
    }
  };

  // 웹캠 시작
  const startCamera = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { 
          width: 640, 
          height: 480,
          facingMode: 'user'
        }
      });
      
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        videoRef.current.play();
        setIsCameraActive(true);
        setError('');
      }
    } catch (err) {
      console.error('❌ 카메라 접근 실패:', err);
      setError('카메라에 접근할 수 없습니다. 브라우저 설정에서 카메라 권한을 허용해주세요.');
    }
  };

  // 웹캠 중지
  const stopCamera = () => {
    if (videoRef.current && videoRef.current.srcObject) {
      const tracks = videoRef.current.srcObject.getTracks();
      tracks.forEach(track => track.stop());
      videoRef.current.srcObject = null;
      setIsCameraActive(false);
      setIsDetecting(false);
    }
  };

  // 표정 감지 시작
  const startDetection = async () => {
    if (!videoRef.current || !isModelLoaded || !isCameraActive) return;
    
    setIsDetecting(true);
    setEmotionHistory([]);
    
    const detectInterval = setInterval(async () => {
      if (videoRef.current && videoRef.current.readyState === 4) {
        const detections = await faceapi
          .detectSingleFace(videoRef.current, new faceapi.TinyFaceDetectorOptions())
          .withFaceExpressions();
        
        if (detections) {
          const expressions = detections.expressions;
          const dominantEmotion = getDominantEmotion(expressions);
          
          setCurrentEmotion(dominantEmotion);
          setEmotionHistory(prev => [...prev, dominantEmotion].slice(-10)); // 최근 10개만 유지
          
          // 캔버스에 그리기
          if (canvasRef.current) {
            const canvas = canvasRef.current;
            const displaySize = { 
              width: videoRef.current.videoWidth, 
              height: videoRef.current.videoHeight 
            };
            faceapi.matchDimensions(canvas, displaySize);
            
            const resizedDetections = faceapi.resizeResults(detections, displaySize);
            const ctx = canvas.getContext('2d');
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            
            // 얼굴 박스 그리기
            faceapi.draw.drawDetections(canvas, resizedDetections);
          }
        } else {
          setCurrentEmotion(null);
        }
      }
    }, 100); // 100ms마다 감지

    // 10초 후 자동 중지 및 기록
    setTimeout(() => {
      clearInterval(detectInterval);
      handleAutoRecord();
    }, 10000);
  };

  // 표정 감지 중지
  const stopDetection = () => {
    setIsDetecting(false);
  };

  // 가장 강한 감정 추출
  const getDominantEmotion = (expressions) => {
    let maxEmotion = 'neutral';
    let maxValue = 0;
    
    Object.keys(expressions).forEach(emotion => {
      if (expressions[emotion] > maxValue) {
        maxValue = expressions[emotion];
        maxEmotion = emotion;
      }
    });
    
    return EMOTIONS_MAP[maxEmotion] || EMOTIONS_MAP.neutral;
  };

  // 자동 기록
  const handleAutoRecord = async () => {
    if (emotionHistory.length === 0) {
      alert('감정을 감지하지 못했습니다. 다시 시도해주세요.');
      setIsDetecting(false);
      return;
    }

    // 가장 많이 감지된 감정 찾기
    const emotionCounts = {};
    emotionHistory.forEach(emotion => {
      const key = emotion.label;
      emotionCounts[key] = (emotionCounts[key] || 0) + 1;
    });

    let dominantEmotionLabel = '';
    let maxCount = 0;
    Object.keys(emotionCounts).forEach(label => {
      if (emotionCounts[label] > maxCount) {
        maxCount = emotionCounts[label];
        dominantEmotionLabel = label;
      }
    });

    const finalEmotion = emotionHistory.find(e => e.label === dominantEmotionLabel);

    // 3초 카운트다운
    setCountdown(3);
    await new Promise(resolve => setTimeout(() => { setCountdown(2); resolve(); }, 1000));
    await new Promise(resolve => setTimeout(() => { setCountdown(1); resolve(); }, 1000));
    await new Promise(resolve => setTimeout(() => { setCountdown(null); resolve(); }, 1000));

    try {
      const today = new Date();
      const dateStr = today.toISOString().split('T')[0];
      const [year, month, day] = dateStr.split('-').map(Number);
      const selectedDateTime = new Date(year, month - 1, day, 
        today.getHours(), today.getMinutes(), today.getSeconds());

      await addDoc(collection(db, 'emotions'), {
        userId: currentUser.uid,
        date: dateStr,
        timestamp: selectedDateTime.toISOString(),
        emotionScore: finalEmotion.score,
        emotionLabel: finalEmotion.label,
        emotionEmoji: finalEmotion.emoji,
        note: 'AI 표정 인식으로 자동 기록됨',
        createdAt: new Date().toISOString(),
        isAIDetected: true
      });

      alert(`${finalEmotion.emoji} ${finalEmotion.label}로 자동 기록되었습니다!`);
      stopCamera();
      navigate('/dashboard');
      
    } catch (err) {
      console.error('❌ 자동 기록 실패:', err);
      alert('기록 저장에 실패했습니다.');
      setIsDetecting(false);
    }
  };

  // 수동 기록
  const handleManualRecord = async () => {
    if (!currentEmotion) {
      alert('먼저 표정 감지를 시작해주세요!');
      return;
    }

    stopDetection();

    try {
      const today = new Date();
      const dateStr = today.toISOString().split('T')[0];
      const [year, month, day] = dateStr.split('-').map(Number);
      const selectedDateTime = new Date(year, month - 1, day, 
        today.getHours(), today.getMinutes(), today.getSeconds());

      await addDoc(collection(db, 'emotions'), {
        userId: currentUser.uid,
        date: dateStr,
        timestamp: selectedDateTime.toISOString(),
        emotionScore: currentEmotion.score,
        emotionLabel: currentEmotion.label,
        emotionEmoji: currentEmotion.emoji,
        note: 'AI 표정 인식으로 기록됨',
        createdAt: new Date().toISOString(),
        isAIDetected: true
      });

      alert(`${currentEmotion.emoji} ${currentEmotion.label}로 기록되었습니다!`);
      stopCamera();
      navigate('/dashboard');
      
    } catch (err) {
      console.error('❌ 수동 기록 실패:', err);
      alert('기록 저장에 실패했습니다.');
    }
  };

  // 컴포넌트 언마운트 시 카메라 정리
  useEffect(() => {
    return () => {
      stopCamera();
    };
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-teal-100">
      {/* 네비게이션 */}
      <nav className="bg-white shadow-md">
        <div className="max-w-4xl mx-auto px-4 py-4">
          <button
            onClick={() => {
              stopCamera();
              navigate('/dashboard');
            }}
            className="text-teal-600 hover:text-teal-800 font-semibold"
          >
            ← 돌아가기
          </button>
        </div>
      </nav>

      {/* 메인 컨텐츠 */}
      <main className="max-w-4xl mx-auto px-4 py-8">
        <div className="bg-white rounded-2xl shadow-xl p-8">
          <div className="text-center mb-6">
            <h1 className="text-3xl font-bold text-gray-800 mb-2">
              AI 표정 인식 🤖📷
            </h1>
            <p className="text-gray-600">
              웹캠으로 당신의 표정을 분석하여 자동으로 감정을 기록합니다
            </p>
          </div>

          {/* 에러 메시지 */}
          {error && (
            <div className="mb-6 bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-lg">
              {error}
            </div>
          )}

          {/* 모델 로딩 중 */}
          {!isModelLoaded && (
            <div className="text-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-teal-600 mx-auto mb-4"></div>
              <p className="text-gray-600">AI 모델을 불러오는 중...</p>
            </div>
          )}

          {/* 메인 화면 */}
          {isModelLoaded && (
            <div className="space-y-6">
              {/* 비디오 영역 */}
              <div className="relative bg-gray-900 rounded-xl overflow-hidden">
                <video
                  ref={videoRef}
                  width="640"
                  height="480"
                  className="w-full"
                  style={{ transform: 'scaleX(-1)' }}
                />
                <canvas
                  ref={canvasRef}
                  className="absolute top-0 left-0 w-full h-full"
                  style={{ transform: 'scaleX(-1)' }}
                />
                
                {/* 카운트다운 오버레이 */}
                {countdown && (
                  <div className="absolute inset-0 bg-black/70 flex items-center justify-center">
                    <div className="text-white text-9xl font-bold animate-pulse">
                      {countdown}
                    </div>
                  </div>
                )}

                {/* 감정 표시 */}
                {currentEmotion && isDetecting && (
                  <div className="absolute top-4 right-4 bg-white/90 backdrop-blur rounded-xl p-4 shadow-lg">
                    <div className="text-5xl mb-2 text-center">{currentEmotion.emoji}</div>
                    <div className="text-sm font-bold text-gray-800 text-center">
                      {currentEmotion.label}
                    </div>
                  </div>
                )}

                {/* 안내 메시지 */}
                {!isCameraActive && (
                  <div className="absolute inset-0 flex items-center justify-center bg-gray-800/50">
                    <div className="text-white text-center p-6">
                      <div className="text-6xl mb-4">📷</div>
                      <p className="text-xl font-semibold">카메라를 시작해주세요</p>
                    </div>
                  </div>
                )}
              </div>

              {/* 컨트롤 버튼 */}
              <div className="grid grid-cols-2 gap-4">
                {!isCameraActive ? (
                  <button
                    onClick={startCamera}
                    className="col-span-2 bg-gradient-to-r from-teal-600 to-green-600 text-white py-4 rounded-xl font-bold text-lg hover:from-teal-700 hover:to-green-700 transition"
                  >
                    📷 카메라 시작
                  </button>
                ) : (
                  <>
                    {!isDetecting ? (
                      <>
                        <button
                          onClick={startDetection}
                          className="bg-gradient-to-r from-green-600 to-teal-600 text-white py-4 rounded-xl font-bold text-lg hover:from-green-700 hover:to-teal-700 transition"
                        >
                          🤖 감지 시작 (10초)
                        </button>
                        <button
                          onClick={stopCamera}
                          className="bg-gray-600 text-white py-4 rounded-xl font-bold text-lg hover:bg-gray-700 transition"
                        >
                          ⏹️ 중지
                        </button>
                      </>
                    ) : (
                      <>
                        <button
                          onClick={handleManualRecord}
                          disabled={!currentEmotion}
                          className="bg-blue-600 text-white py-4 rounded-xl font-bold text-lg hover:bg-blue-700 transition disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                          💾 지금 기록
                        </button>
                        <button
                          onClick={stopDetection}
                          className="bg-red-600 text-white py-4 rounded-xl font-bold text-lg hover:bg-red-700 transition"
                        >
                          ⏸️ 중지
                        </button>
                      </>
                    )}
                  </>
                )}
              </div>

              {/* 안내 */}
              <div className="bg-gradient-to-r from-teal-50 to-green-50 rounded-xl p-6 border border-teal-200">
                <h3 className="font-bold text-teal-900 mb-3 text-lg">사용 방법</h3>
                <ol className="space-y-2 text-sm text-teal-800">
                  <li className="flex items-start">
                    <span className="font-bold mr-2">1.</span>
                    <span>카메라 시작 버튼을 누르고 얼굴이 화면에 나오도록 조정하세요</span>
                  </li>
                  <li className="flex items-start">
                    <span className="font-bold mr-2">2.</span>
                    <span>"감지 시작" 버튼을 누르면 10초 동안 표정을 분석합니다</span>
                  </li>
                  <li className="flex items-start">
                    <span className="font-bold mr-2">3.</span>
                    <span>10초 후 자동으로 가장 많이 감지된 감정이 기록됩니다</span>
                  </li>
                  <li className="flex items-start">
                    <span className="font-bold mr-2">4.</span>
                    <span>또는 "지금 기록" 버튼으로 현재 감정을 즉시 기록할 수 있습니다</span>
                  </li>
                </ol>
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}

export default FaceRecognition;
