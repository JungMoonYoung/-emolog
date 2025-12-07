import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { collection, addDoc, query, where, getDocs } from 'firebase/firestore';
import { db } from '../firebase/config';
import MusicRecommendationModal from '../components/MusicRecommendationModal';

const EMOTIONS = [
  { emoji: '😄', label: '매우 좋음', score: 100, color: 'from-green-400 to-green-600' },
  { emoji: '🙂', label: '좋음', score: 80, color: 'from-blue-400 to-blue-600' },
  { emoji: '😐', label: '보통', score: 50, color: 'from-yellow-400 to-yellow-600' },
  { emoji: '🙁', label: '조금 나쁨', score: 30, color: 'from-orange-400 to-orange-600' },
  { emoji: '😢', label: '매우 나쁨', score: 0, color: 'from-red-400 to-red-600' }
];

function WriteDiary() {
  const { currentUser } = useAuth();
  const navigate = useNavigate();

  const [selectedDate, setSelectedDate] = useState(getTodayDate());
  const [selectedEmotion, setSelectedEmotion] = useState(null);
  const [diaryContent, setDiaryContent] = useState('');
  const [isShared, setIsShared] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [showMusicModal, setShowMusicModal] = useState(false);
  const [savedEmotion, setSavedEmotion] = useState(null);

  // currentUser가 없으면 로그인 페이지로 리다이렉트
  if (!currentUser) {
    navigate('/login');
    return null;
  }

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

  const checkDateCount = async (date) => {
    const q = query(
      collection(db, 'diaries'),
      where('userId', '==', currentUser.uid),
      where('date', '==', date)
    );
    const snapshot = await getDocs(q);
    return snapshot.size;
  };

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

      if (diaryContent.trim().length === 0) {
        setError('일기 내용을 입력해주세요!');
        setLoading(false);
        return;
      }

      const dateCount = await checkDateCount(selectedDate);
      if (dateCount >= 3) {
        setError(`${formatDateKorean(selectedDate)}은 이미 3회 작성하셨습니다. 다른 날짜를 선택해주세요!`);
        setLoading(false);
        return;
      }

      const emotion = EMOTIONS[selectedEmotion];
      await addDoc(collection(db, 'diaries'), {
        userId: currentUser.uid,
        date: selectedDate,
        timestamp: new Date(`${selectedDate}T${new Date().toTimeString().split(' ')[0]}`).toISOString(),
        emotionScore: emotion.score,
        emotionLabel: emotion.label,
        content: diaryContent.trim(),
        isShared: isShared,
        createdAt: new Date().toISOString()
      });

      console.log('✅ 일기 저장 성공!');
      setLoading(false);
      
      // 음악 추천 모달 표시
      setSavedEmotion(emotion.label);
      setShowMusicModal(true);

    } catch (err) {
      console.error('❌ 일기 저장 실패:', err);
      setError('일기 저장에 실패했습니다. 다시 시도해주세요.');
      setLoading(false);
    }
  };

  // 음악 모달 닫기
  const handleCloseMusicModal = () => {
    setShowMusicModal(false);
    navigate('/dashboard', { replace: true });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-pink-50">
      <nav className="bg-white shadow-md sticky top-0 z-50">
        <div className="max-w-4xl mx-auto px-4 py-4">
          <button
            type="button"
            onClick={() => navigate('/dashboard')}
            className="text-indigo-600 hover:text-indigo-800 font-semibold text-lg"
            style={{ background: 'none', border: 'none', padding: 0, cursor: 'pointer' }}
          >
            ← 돌아가기
          </button>
        </div>
      </nav>

      <main className="max-w-4xl mx-auto px-4 py-8">
        <div className="bg-white rounded-2xl shadow-xl p-8">
          <h1 className="text-3xl font-bold text-gray-800 mb-2">일기 쓰기 📝</h1>
          <p className="text-gray-600 mb-8">지난 7일 이내의 일기를 작성할 수 있어요 (각 날짜별 하루 3회 제한)</p>

          <form onSubmit={handleSubmit}>
            <div className="mb-8">
              <h2 className="text-xl font-bold text-gray-800 mb-4">언제의 일기를 쓸까요?</h2>
              <input
                type="date"
                value={selectedDate}
                onChange={(e) => setSelectedDate(e.target.value)}
                min={getSevenDaysAgo()}
                max={getTodayDate()}
                className="w-full px-4 py-3 border-2 border-purple-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none text-lg font-semibold text-gray-700"
              />
              <p className="mt-2 text-sm text-purple-600 font-semibold">
                선택된 날짜: {formatDateKorean(selectedDate)}
              </p>
            </div>

            <div className="mb-8">
              <h2 className="text-xl font-bold text-gray-800 mb-4">그날의 기분을 선택해주세요</h2>
              <div className="grid grid-cols-5 gap-4">
                {EMOTIONS.map((emotion, index) => (
                  <button
                    key={index}
                    type="button"
                    onClick={() => setSelectedEmotion(index)}
                    className={`p-6 rounded-xl border-4 transition transform hover:scale-105 ${
                      selectedEmotion === index
                        ? 'border-purple-600 bg-purple-50 scale-105'
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    <div className="text-5xl mb-2">{emotion.emoji}</div>
                    <div className="text-sm font-semibold text-gray-700">
                      {emotion.label}
                    </div>
                  </button>
                ))}
              </div>
            </div>

            <div className="mb-8">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-bold text-gray-800">그날 하루를 기록해보세요</h2>
                <span className="text-sm text-gray-500">{diaryContent.length} / 500자</span>
              </div>
              <textarea
                value={diaryContent}
                onChange={(e) => {
                  if (e.target.value.length <= 500) {
                    setDiaryContent(e.target.value);
                  }
                }}
                className="w-full h-64 px-4 py-3 border-2 border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none resize-none"
                placeholder="그날 있었던 일이나 느낀 점을 자유롭게 적어보세요..."
              />
            </div>

            <div className="mb-8">
              <label className="flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={isShared}
                  onChange={(e) => setIsShared(e.target.checked)}
                  className="w-5 h-5 text-purple-600 rounded focus:ring-2 focus:ring-purple-500"
                />
                <span className="ml-3 text-gray-700">이 일기를 커뮤니티에 공유하기</span>
              </label>
            </div>

            {error && (
              <div className="mb-6 bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-lg">
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-gradient-to-r from-purple-600 to-pink-600 text-white py-4 rounded-xl font-bold text-lg hover:from-purple-700 hover:to-pink-700 transition disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? '저장 중...' : '일기 저장하기 💾'}
            </button>
          </form>

          <div className="mt-6 p-4 bg-purple-50 rounded-lg">
            <p className="text-sm text-purple-800">
              💡 <strong>Tip:</strong> 각 날짜별로 최대 3회까지 작성할 수 있어요!
            </p>
          </div>
        </div>
      </main>

      {/* 음악 추천 모달 */}
      {showMusicModal && savedEmotion && (
        <MusicRecommendationModal
          emotion={savedEmotion}
          onClose={handleCloseMusicModal}
        />
      )}
    </div>
  );
}

export default WriteDiary;
