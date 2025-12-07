import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { logoutUser } from '../firebase/auth';
import { getAllRecords } from '../firebase/diary';
import EmotionHeatmap from '../components/EmotionHeatmap';
import EmotionStats from '../components/EmotionStats';
import EmotionPatternAnalysis from '../components/EmotionPatternAnalysis';

function Dashboard() {
  const { currentUser } = useAuth();
  const navigate = useNavigate();
  const [recentRecords, setRecentRecords] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadRecentRecords();
  }, []);

  const loadRecentRecords = async () => {
    setLoading(true);
    const result = await getAllRecords(currentUser.uid, 5);
    
    if (result.success) {
      setRecentRecords(result.records);
      console.log('📊 불러온 기록:', result.records);
    }
    
    setLoading(false);
  };

  const handleLogout = async () => {
    const result = await logoutUser();
    if (result.success) {
      navigate('/login');
    }
  };

  const getEmotionEmoji = (record) => {
    if (record.type === 'emotion' && record.emotionEmoji) {
      return record.emotionEmoji;
    }
    
    const score = record.emotionScore;
    if (score >= 80) return '😄';
    if (score >= 60) return '🙂';
    if (score >= 40) return '😐';
    if (score >= 20) return '🙁';
    return '😢';
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    const hours = String(date.getHours()).padStart(2, '0');
    const minutes = String(date.getMinutes()).padStart(2, '0');
    
    return `${month}.${day} ${hours}:${minutes}`;
  };

  const getTypeBadge = (type) => {
    if (type === 'diary') {
      return (
        <span className="bg-purple-100 text-purple-700 text-xs px-2 py-1 rounded-full">
          일기
        </span>
      );
    } else {
      return (
        <span className="bg-blue-100 text-blue-700 text-xs px-2 py-1 rounded-full">
          감정
        </span>
      );
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50">
      {/* 네비게이션 바 */}
      <nav className="bg-white shadow-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-8">
              <h1 className="text-2xl font-bold text-indigo-600">EmoLog</h1>
              <div className="hidden md:flex space-x-4">
                <button
                  className="text-indigo-600 font-semibold px-3 py-2 rounded-lg bg-indigo-50"
                >
                  대시보드
                </button>
                <button
                  onClick={() => navigate('/my-diaries')}
                  className="text-gray-600 hover:text-gray-900 px-3 py-2 rounded-lg transition"
                >
                  내 일기
                </button>
              </div>
            </div>

            <div className="flex items-center space-x-4">
              <span className="hidden sm:inline text-gray-700">
                {currentUser?.displayName || currentUser?.email}님
              </span>
              <button
                onClick={handleLogout}
                className="bg-gray-200 hover:bg-gray-300 text-gray-700 px-4 py-2 rounded-lg transition"
              >
                로그아웃
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* 메인 컨텐츠 */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* 환영 메시지 */}
        <div className="bg-white rounded-2xl shadow-lg p-8 mb-8">
          <h2 className="text-3xl font-bold text-gray-800 mb-4">
            안녕하세요, {currentUser?.displayName || '사용자'}님! 👋
          </h2>
          <p className="text-gray-600 text-lg">
            오늘의 기분은 어떠신가요?
          </p>
        </div>

        {/* 기록 옵션 카드 - 2개만! (음악 추천 제거) */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          <div 
            onClick={() => navigate('/record')}
            className="bg-gradient-to-br from-blue-500 to-indigo-600 rounded-2xl shadow-lg p-8 text-white cursor-pointer hover:scale-105 transition transform"
          >
            <div className="text-5xl mb-4">😊</div>
            <h3 className="text-2xl font-bold mb-2">감정 기록하기</h3>
            <p className="text-blue-100 mb-2">지금 느끼는 감정을 간단하게</p>
            <span className="inline-block bg-white/20 px-3 py-1 rounded-full text-sm">
              무제한 ∞
            </span>
          </div>

          <div 
            onClick={() => navigate('/write-diary')}
            className="bg-gradient-to-br from-purple-500 to-pink-600 rounded-2xl shadow-lg p-8 text-white cursor-pointer hover:scale-105 transition transform"
          >
            <div className="text-5xl mb-4">📝</div>
            <h3 className="text-2xl font-bold mb-2">일기 쓰기</h3>
            <p className="text-purple-100 mb-2">오늘 하루를 자세히 기록</p>
            <span className="inline-block bg-white/20 px-3 py-1 rounded-full text-sm">
              하루 3회 제한
            </span>
          </div>
        </div>

        {/* 주간 보고서 버튼 */}
        <div className="mb-8">
          <div 
            onClick={() => navigate('/weekly-report')}
            className="bg-gradient-to-r from-indigo-600 to-purple-600 rounded-2xl shadow-lg p-6 text-white cursor-pointer hover:scale-102 transition transform flex items-center justify-between"
          >
            <div className="flex items-center space-x-4">
              <div className="text-5xl">📊</div>
              <div>
                <h3 className="text-2xl font-bold mb-1">주간 감정 보고서</h3>
                <p className="text-indigo-100 text-sm"> 한 주의 기록을 종합 분석해드려요</p>
              </div>
            </div>
            <div className="text-white text-3xl">→</div>
          </div>
        </div>

        {/* 감정 히트맵 */}
        <div className="mb-8">
          <EmotionHeatmap />
        </div>

        {/* AI 감정 패턴 분석 */}
        <div className="mb-8">
          <EmotionPatternAnalysis />
        </div>

        {/* 통계 */}
        <div className="mb-8">
          <EmotionStats />
        </div>

        {/* 최근 기록 */}
        <div className="bg-white rounded-2xl shadow-lg p-6">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-xl font-bold text-gray-800">최근 기록</h3>
            <button
              onClick={() => navigate('/my-diaries')}
              className="text-indigo-600 hover:text-indigo-800 font-semibold text-sm"
            >
              전체 보기 →
            </button>
          </div>

          {loading ? (
            <div className="text-center py-8">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto"></div>
              <p className="mt-4 text-gray-600">기록을 불러오는 중...</p>
            </div>
          ) : recentRecords.length === 0 ? (
            <div className="text-center py-12">
              <div className="text-6xl mb-4">📝</div>
              <p className="text-gray-600 text-lg mb-4">
                아직 기록이 없습니다
              </p>
              <button
                onClick={() => navigate('/record')}
                className="bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-3 rounded-lg font-semibold transition"
              >
                첫 감정 기록하기
              </button>
            </div>
          ) : (
            <div className="space-y-3">
              {recentRecords.map((record, index) => (
                <div
                  key={index}
                  onClick={() => navigate(`/record/${record.id}`)}
                  className="bg-gray-50 hover:bg-gray-100 rounded-xl p-4 cursor-pointer transition flex items-center justify-between"
                >
                  <div className="flex items-center space-x-4">
                    <div className="text-3xl">{getEmotionEmoji(record)}</div>
                    <div>
                      <div className="flex items-center space-x-2 mb-1">
                        <span className="font-semibold text-gray-800">
                          {record.emotionLabel}
                        </span>
                        {getTypeBadge(record.type)}
                      </div>
                      <div className="text-sm text-gray-600">
                        {formatDate(record.timestamp)}
                      </div>
                      {record.note && (
                        <div className="text-sm text-gray-500 mt-1">
                          {record.note.substring(0, 50)}
                          {record.note.length > 50 && '...'}
                        </div>
                      )}
                    </div>
                  </div>
                  <div className="text-2xl font-bold text-indigo-600">
                    {record.emotionScore}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </main>
    </div>
  );
}

export default Dashboard;
