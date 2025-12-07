import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { getAllRecords } from '../firebase/diary';
import { logoutUser } from '../firebase/auth';

function MyDiaries() {
  const { currentUser } = useAuth();
  const navigate = useNavigate();
  const [records, setRecords] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all'); // 'all' | 'diary' | 'emotion'

  useEffect(() => {
    loadRecords();
  }, []);

  const loadRecords = async () => {
    setLoading(true);
    const result = await getAllRecords(currentUser.uid);
    
    if (result.success) {
      setRecords(result.records);
      console.log('📊 전체 기록:', result.records);
    }
    
    setLoading(false);
  };

  const handleLogout = async () => {
    const result = await logoutUser();
    if (result.success) {
      navigate('/login');
    }
  };

  // 감정 이모지 반환
  const getEmotionEmoji = (record) => {
    // 감정 기록인 경우 저장된 이모지 사용
    if (record.type === 'emotion' && record.emotionEmoji) {
      return record.emotionEmoji;
    }
    
    // 일기인 경우 점수로 이모지 선택
    const score = record.emotionScore;
    if (score >= 80) return '😄';
    if (score >= 60) return '🙂';
    if (score >= 40) return '😐';
    if (score >= 20) return '🙁';
    return '😢';
  };

  // 날짜 포맷팅
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    const hours = String(date.getHours()).padStart(2, '0');
    const minutes = String(date.getMinutes()).padStart(2, '0');
    const weekdays = ['일', '월', '화', '수', '목', '금', '토'];
    const weekday = weekdays[date.getDay()];
    
    return `${year}.${month}.${day} (${weekday}) ${hours}:${minutes}`;
  };

  // 필터링된 기록
  const filteredRecords = records.filter(record => {
    if (filter === 'all') return true;
    return record.type === filter;
  });

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50">
      {/* 네비게이션 바 */}
      <nav className="bg-white shadow-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-8">
              <h1 
                onClick={() => navigate('/dashboard')}
                className="text-2xl font-bold text-indigo-600 cursor-pointer"
              >
                EmoLog
              </h1>
              <div className="hidden md:flex space-x-4">
                <button
                  onClick={() => navigate('/dashboard')}
                  className="text-gray-600 hover:text-gray-900 px-3 py-2 rounded-lg transition"
                >
                  대시보드
                </button>
                <button
                  className="text-indigo-600 font-semibold px-3 py-2 rounded-lg bg-indigo-50"
                >
                  전체 기록
                </button>
              </div>
            </div>

            <div className="flex items-center space-x-4">
              <span className="text-gray-700">
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
      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h2 className="text-3xl font-bold text-gray-800 mb-2">전체 기록 📚</h2>
          <p className="text-gray-600">
            총 {records.length}개의 기록이 있습니다
          </p>
        </div>

        {/* 필터 버튼 */}
        <div className="flex space-x-3 mb-6">
          <button
            onClick={() => setFilter('all')}
            className={`px-4 py-2 rounded-lg font-semibold transition ${
              filter === 'all'
                ? 'bg-indigo-600 text-white'
                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
            }`}
          >
            전체 ({records.length})
          </button>
          <button
            onClick={() => setFilter('diary')}
            className={`px-4 py-2 rounded-lg font-semibold transition ${
              filter === 'diary'
                ? 'bg-purple-600 text-white'
                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
            }`}
          >
            일기 ({records.filter(r => r.type === 'diary').length})
          </button>
          <button
            onClick={() => setFilter('emotion')}
            className={`px-4 py-2 rounded-lg font-semibold transition ${
              filter === 'emotion'
                ? 'bg-blue-600 text-white'
                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
            }`}
          >
            감정 ({records.filter(r => r.type === 'emotion').length})
          </button>
        </div>

        {/* 로딩 */}
        {loading && (
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto"></div>
            <p className="mt-4 text-gray-600">기록을 불러오는 중...</p>
          </div>
        )}

        {/* 기록 없음 */}
        {!loading && records.length === 0 && (
          <div className="bg-white rounded-2xl shadow-lg p-12 text-center">
            <div className="text-6xl mb-4">📝</div>
            <h3 className="text-xl font-bold text-gray-800 mb-2">
              아직 작성한 기록이 없습니다
            </h3>
            <p className="text-gray-600 mb-6">
              오늘의 기분을 기록해보세요!
            </p>
            <div className="flex justify-center space-x-4">
              <button
                onClick={() => navigate('/record')}
                className="bg-blue-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-blue-700 transition"
              >
                감정 기록하기
              </button>
              <button
                onClick={() => navigate('/write-diary')}
                className="bg-purple-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-purple-700 transition"
              >
                일기 쓰기
              </button>
            </div>
          </div>
        )}

        {/* 기록 목록 */}
        {!loading && filteredRecords.length > 0 && (
          <div className="space-y-4">
            {filteredRecords.map((record) => (
              <div
                key={record.id}
                onClick={() => navigate(`/record/${record.id}/${record.type}`, { state: { record } })}
                className={`bg-white rounded-xl shadow-md p-6 hover:shadow-lg transition cursor-pointer ${
                  record.type === 'diary' 
                    ? 'border-l-4 border-purple-500' 
                    : 'border-l-4 border-blue-500'
                }`}
              >
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center space-x-3">
                    <div className="text-4xl">
                      {getEmotionEmoji(record)}
                    </div>
                    <div>
                      <div className="flex items-center space-x-2">
                        <h3 className="font-bold text-gray-800">
                          {record.emotionLabel}
                        </h3>
                        <span className={`text-xs px-2 py-1 rounded-full ${
                          record.type === 'diary'
                            ? 'bg-purple-100 text-purple-700'
                            : 'bg-blue-100 text-blue-700'
                        }`}>
                          {record.type === 'diary' ? '일기' : '감정'}
                        </span>
                      </div>
                      <p className="text-sm text-gray-500">
                        {formatDate(record.timestamp)}
                      </p>
                    </div>
                  </div>
                  
                  {record.isShared && (
                    <span className="bg-green-100 text-green-700 text-xs px-3 py-1 rounded-full">
                      공유됨
                    </span>
                  )}
                </div>

                {/* 일기 내용 */}
                {record.type === 'diary' && record.content && (
                  <p className="text-gray-700 whitespace-pre-wrap">
                    {record.content}
                  </p>
                )}

                {/* 감정 메모 */}
                {record.type === 'emotion' && record.note && (
                  <p className="text-gray-600 italic">
                    💭 {record.note}
                  </p>
                )}
              </div>
            ))}
          </div>
        )}

        {/* 필터링 결과 없음 */}
        {!loading && records.length > 0 && filteredRecords.length === 0 && (
          <div className="bg-white rounded-2xl shadow-lg p-12 text-center">
            <div className="text-5xl mb-4">🔍</div>
            <h3 className="text-xl font-bold text-gray-800 mb-2">
              해당하는 기록이 없습니다
            </h3>
            <p className="text-gray-600">
              다른 필터를 선택해보세요
            </p>
          </div>
        )}
      </main>
    </div>
  );
}

export default MyDiaries;
