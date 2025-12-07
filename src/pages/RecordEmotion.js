import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { collection, addDoc } from 'firebase/firestore';
import { db } from '../firebase/config';
import { generateMusicRecommendationGPT } from '../services/openaiService'; // GPT 서비스 추가

const EMOTIONS = [
  { emoji: '🌟', label: '최고예요', score: 100, bgColor: 'bg-yellow-50' },
  { emoji: '🤗', label: '사랑스러워요', score: 90, bgColor: 'bg-pink-50' },
  { emoji: '😊', label: '기분 좋아요', score: 80, bgColor: 'bg-green-50' },
  { emoji: '😌', label: '평온해요', score: 60, bgColor: 'bg-blue-50' },
  { emoji: '😔', label: '조금 우울해요', score: 40, bgColor: 'bg-purple-50' },
  { emoji: '😰', label: '불안해요', score: 30, bgColor: 'bg-orange-50' },
  { emoji: '😢', label: '많이 힘들어요', score: 20, bgColor: 'bg-gray-50' },
  { emoji: '😤', label: '화나요', score: 25, bgColor: 'bg-red-50' },
];

function RecordEmotion() {
  const { currentUser } = useAuth();
  const navigate = useNavigate();
  
  const [selectedDate, setSelectedDate] = useState(getTodayDate());
  const [selectedEmotion, setSelectedEmotion] = useState(null);
  const [note, setNote] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // 음악 추천 결과 상태
  const [recommendation, setRecommendation] = useState(null);

  function getTodayDate() {
    const today = new Date();
    return today.toISOString().split('T')[0];
  }

  function getSevenDaysAgo() {
    const date = new Date();
    date.setDate(date.getDate() - 7);
    return date.toISOString().split('T')[0];
  }

  function formatDateKorean(dateString) {
    const date = new Date(dateString);
    const year = date.getFullYear();
    const month = date.getMonth() + 1;
    const day = date.getDate();
    const weekdays = ['일', '월', '화', '수', '목', '금', '토'];
    const weekday = weekdays[date.getDay()];
    return `${year}년 ${month}월 ${day}일 (${weekday})`;
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      if (selectedEmotion === null) {
        setError('감정을 선택해주세요!');
        setLoading(false);
        return;
      }

      const emotion = EMOTIONS[selectedEmotion];

      // 1. Firebase에 저장
      const now = new Date();
      const [year, month, day] = selectedDate.split('-').map(Number);
      const selectedDateTime = new Date(year, month - 1, day, now.getHours(), now.getMinutes(), now.getSeconds());

      await addDoc(collection(db, 'emotions'), {
        userId: currentUser.uid,
        date: selectedDate,
        timestamp: selectedDateTime.toISOString(),
        emotionScore: emotion.score,
        emotionLabel: emotion.label,
        emotionEmoji: emotion.emoji,
        note: note.trim() || null,
        createdAt: new Date().toISOString()
      });

      console.log('✅ 감정 기록 성공!');

      // 2. GPT에게 음악 추천 요청 (바로 이동하지 않음)
      const result = await generateMusicRecommendationGPT(emotion.label, emotion.score, note);
      
      // 3. 결과 표시
      setRecommendation(result);
      setLoading(false);

    } catch (err) {
      console.error('❌ 처리 실패:', err);
      setError('저장 중 오류가 발생했습니다.');
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <nav className="bg-white shadow-md sticky top-0 z-50">
        <div className="max-w-4xl mx-auto px-4 py-4">
          <button
            type="button"
            onClick={() => navigate('/dashboard')}
            className="text-indigo-600 hover:text-indigo-800 font-semibold text-lg"
          >
            ← 돌아가기
          </button>
        </div>
      </nav>

      <main className="max-w-4xl mx-auto px-4 py-8">
        <div className="bg-white rounded-2xl shadow-xl p-8">
          <h1 className="text-3xl font-bold text-gray-800 mb-2">감정 기록하기 💙</h1>
          <p className="text-gray-600 mb-8">오늘의 기분을 기록하고 처방전을 받아보세요</p>

          {!recommendation ? (
            // [입력 폼] 추천 결과가 없을 때 보여줌
            <form onSubmit={handleSubmit}>
              <div className="mb-8">
                <h2 className="text-xl font-bold text-gray-800 mb-4">언제의 감정인가요?</h2>
                <input
                  type="date"
                  value={selectedDate}
                  onChange={(e) => setSelectedDate(e.target.value)}
                  min={getSevenDaysAgo()}
                  max={getTodayDate()}
                  className="w-full px-4 py-3 border-2 border-indigo-300 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none text-lg font-semibold text-gray-700"
                />
              </div>

              <div className="mb-8">
                <h2 className="text-xl font-bold text-gray-800 mb-4">감정을 선택해주세요</h2>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  {EMOTIONS.map((emotion, index) => (
                    <button
                      key={index}
                      type="button"
                      onClick={() => setSelectedEmotion(index)}
                      className={`p-6 rounded-2xl transition-all transform hover:scale-105 ${
                        selectedEmotion === index
                          ? `border-4 border-indigo-600 ${emotion.bgColor} scale-105 shadow-lg`
                          : 'border-2 border-gray-200 hover:border-gray-300 bg-white'
                      }`}
                    >
                      <div className="text-5xl mb-3">{emotion.emoji}</div>
                      <div className={`text-sm font-bold ${
                        selectedEmotion === index ? 'text-indigo-700' : 'text-gray-700'
                      }`}>
                        {emotion.label}
                      </div>
                    </button>
                  ))}
                </div>
              </div>

              <div className="mb-8">
                <div className="flex justify-between items-center mb-3">
                  <h2 className="text-xl font-bold text-gray-800">짧은 메모</h2>
                  <span className="text-sm text-gray-500">{note.length} / 100자</span>
                </div>
                <textarea
                  value={note}
                  onChange={(e) => {
                    if (e.target.value.length <= 100) setNote(e.target.value);
                  }}
                  className="w-full h-24 px-4 py-3 border-2 border-gray-300 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none resize-none"
                  placeholder="오늘 무슨 일이 있었나요?"
                />
              </div>

              {error && (
                <div className="mb-6 bg-red-50 text-red-600 px-4 py-3 rounded-lg border border-red-200">
                  {error}
                </div>
              )}

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-gradient-to-r from-indigo-600 to-blue-600 text-white py-4 rounded-xl font-bold text-lg hover:from-indigo-700 hover:to-blue-700 transition shadow-lg disabled:opacity-50"
              >
                {loading ? (
                  <div className="flex items-center justify-center space-x-2">
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                    <span>기록 저장 및 음악 처방 중... 🤖</span>
                  </div>
                ) : '기록 완료하기 ✨'}
              </button>
            </form>
          ) : (
            // [결과 화면] 추천 결과가 있을 때 보여줌
            <div className="text-center animate-fade-in-up">
              <div className="mb-8 bg-gradient-to-br from-purple-50 to-pink-50 p-8 rounded-2xl border-2 border-purple-100">
                <div className="text-6xl mb-4">🎵</div>
                <h2 className="text-2xl font-bold text-gray-900 mb-2">
                  당신을 위한 음악 처방전
                </h2>
                <p className="text-gray-600 mb-6">
                  {recommendation.comment}
                </p>

                <div className="bg-white p-6 rounded-xl shadow-md max-w-md mx-auto">
                  <h3 className="text-xl font-extrabold text-indigo-600 mb-1">
                    {recommendation.music.title}
                  </h3>
                  <p className="text-gray-500 font-medium mb-4">
                    🎤 {recommendation.music.artist}
                  </p>
                  <p className="text-sm text-gray-600 bg-gray-50 p-3 rounded-lg mb-4">
                    💡 {recommendation.music.reason}
                  </p>
                  
                  <a 
                    href={`https://www.youtube.com/results?search_query=${recommendation.music.artist}+${recommendation.music.title}`}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-block w-full bg-red-600 text-white py-3 rounded-lg font-bold hover:bg-red-700 transition"
                  >
                    ▶️ 유튜브에서 듣기
                  </a>
                </div>
              </div>

              <div className="flex gap-4">
                <button
                  onClick={() => setRecommendation(null)} // 다시 기록하기
                  className="flex-1 py-3 bg-gray-100 text-gray-700 rounded-xl font-bold hover:bg-gray-200"
                >
                  하나 더 기록하기
                </button>
                <button
                  onClick={() => navigate('/dashboard')}
                  className="flex-1 py-3 bg-indigo-600 text-white rounded-xl font-bold hover:bg-indigo-700"
                >
                  대시보드로 가기
                </button>
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}

export default RecordEmotion;
