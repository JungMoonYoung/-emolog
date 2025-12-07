import React, { useState, useEffect } from 'react';
import { useNavigate, useParams, useLocation } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { getRecordById, deleteRecord, updateRecord } from '../firebase/diary';
import { collection, addDoc, query, where, getDocs } from 'firebase/firestore';
import { db } from '../firebase/config';

// 감정 데이터
const EMOTIONS_RECORD = [
  { emoji: '🌟', label: '최고예요', score: 100, bgColor: 'bg-yellow-50' },
  { emoji: '🤗', label: '사랑스러워요', score: 90, bgColor: 'bg-pink-50' },
  { emoji: '😊', label: '기분 좋아요', score: 80, bgColor: 'bg-green-50' },
  { emoji: '😌', label: '평온해요', score: 60, bgColor: 'bg-blue-50' },
  { emoji: '😔', label: '조금 우울해요', score: 40, bgColor: 'bg-purple-50' },
  { emoji: '😰', label: '불안해요', score: 30, bgColor: 'bg-orange-50' },
  { emoji: '😢', label: '많이 힘들어요', score: 20, bgColor: 'bg-gray-50' },
  { emoji: '😤', label: '화나요', score: 25, bgColor: 'bg-red-50' },
];

const EMOTIONS_DIARY = [
  { emoji: '😄', label: '매우 좋음', score: 100 },
  { emoji: '🙂', label: '좋음', score: 80 },
  { emoji: '😐', label: '보통', score: 50 },
  { emoji: '🙁', label: '조금 나쁨', score: 30 },
  { emoji: '😢', label: '매우 나쁨', score: 0 }
];

function RecordDetail() {
  const { currentUser } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const { id, type } = useParams();
  
  const [record, setRecord] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  
  // 수정 상태
  const [editedEmotion, setEditedEmotion] = useState(null);
  const [editedNote, setEditedNote] = useState('');
  const [editedContent, setEditedContent] = useState('');
  const [editedIsShared, setEditedIsShared] = useState(false);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    loadRecord();
  }, [id, type]);

  const loadRecord = async () => {
    setLoading(true);
    
    // location.state에서 record 가져오기 (전달받은 경우)
    if (location.state?.record) {
      const recordData = location.state.record;
      setRecord(recordData);
      initializeEditState(recordData);
      setLoading(false);
      return;
    }
    
    // 전달받지 못한 경우 Firebase에서 가져오기
    const result = await getRecordById(id, type);
    if (result.success) {
      setRecord(result.record);
      initializeEditState(result.record);
    } else {
      alert('기록을 불러올 수 없습니다.');
      navigate('/my-diaries');
    }
    
    setLoading(false);
  };

  const initializeEditState = (recordData) => {
    if (recordData.type === 'emotion') {
      const emotionIndex = EMOTIONS_RECORD.findIndex(e => e.label === recordData.emotionLabel);
      setEditedEmotion(emotionIndex !== -1 ? emotionIndex : null);
      setEditedNote(recordData.note || '');
    } else {
      const emotionIndex = EMOTIONS_DIARY.findIndex(e => e.label === recordData.emotionLabel);
      setEditedEmotion(emotionIndex !== -1 ? emotionIndex : null);
      setEditedContent(recordData.content || '');
      setEditedIsShared(recordData.isShared || false);
    }
  };

  const handleEdit = () => {
    setIsEditing(true);
  };

  const handleCancelEdit = () => {
    setIsEditing(false);
    initializeEditState(record);
  };

  const handleSave = async () => {
    setSaving(true);

    try {
      const EMOTIONS = record.type === 'emotion' ? EMOTIONS_RECORD : EMOTIONS_DIARY;
      const emotion = EMOTIONS[editedEmotion];

      if (!emotion) {
        alert('감정을 선택해주세요!');
        setSaving(false);
        return;
      }

      const updateData = {
        emotionScore: emotion.score,
        emotionLabel: emotion.label,
      };

      if (record.type === 'emotion') {
        updateData.emotionEmoji = emotion.emoji;
        updateData.note = editedNote.trim() || null;
      } else {
        if (!editedContent.trim()) {
          alert('일기 내용을 입력해주세요!');
          setSaving(false);
          return;
        }
        updateData.content = editedContent.trim();
        updateData.isShared = editedIsShared;
      }

      const result = await updateRecord(id, type, updateData);

      if (result.success) {
        alert('수정되었습니다! 😊');
        setIsEditing(false);
        // 상태 업데이트
        setRecord({ ...record, ...updateData });
      } else {
        alert('수정에 실패했습니다: ' + result.error);
      }
    } catch (error) {
      console.error('수정 오류:', error);
      alert('수정 중 오류가 발생했습니다.');
    }

    setSaving(false);
  };

  const handleDelete = async () => {
    const result = await deleteRecord(id, type);
    
    if (result.success) {
      alert('삭제되었습니다.');
      navigate('/my-diaries');
    } else {
      alert('삭제에 실패했습니다: ' + result.error);
    }
    
    setShowDeleteModal(false);
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    const hours = String(date.getHours()).padStart(2, '0');
    const minutes = String(date.getMinutes()).padStart(2, '0');
    const weekdays = ['일', '월', '화', '수', '목', '금', '토'];
    const weekday = weekdays[date.getDay()];
    
    return `${year}년 ${month}월 ${day}일 (${weekday}) ${hours}:${minutes}`;
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

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  if (!record) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-600 mb-4">기록을 찾을 수 없습니다.</p>
          <button
            onClick={() => navigate('/my-diaries')}
            className="bg-indigo-600 text-white px-6 py-3 rounded-lg hover:bg-indigo-700"
          >
            목록으로
          </button>
        </div>
      </div>
    );
  }

  const EMOTIONS = record.type === 'emotion' ? EMOTIONS_RECORD : EMOTIONS_DIARY;

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50">
      {/* 네비게이션 */}
      <nav className="bg-white shadow-md">
        <div className="max-w-4xl mx-auto px-4 py-4">
          <button
            onClick={() => navigate('/my-diaries')}
            className="text-indigo-600 hover:text-indigo-800 font-semibold"
          >
            ← 목록으로
          </button>
        </div>
      </nav>

      {/* 메인 컨텐츠 */}
      <main className="max-w-4xl mx-auto px-4 py-8">
        <div className="bg-white rounded-2xl shadow-xl p-8">
          {/* 헤더 */}
          <div className="flex items-start justify-between mb-6">
            <div className="flex items-center space-x-4">
              <div className="text-5xl">{getEmotionEmoji(record)}</div>
              <div>
                <div className="flex items-center space-x-2">
                  <h1 className="text-2xl font-bold text-gray-800">
                    {record.emotionLabel}
                  </h1>
                  <span className={`text-xs px-3 py-1 rounded-full ${
                    record.type === 'diary'
                      ? 'bg-purple-100 text-purple-700'
                      : 'bg-blue-100 text-blue-700'
                  }`}>
                    {record.type === 'diary' ? '일기' : '감정'}
                  </span>
                </div>
                <p className="text-sm text-gray-500 mt-1">
                  {formatDate(record.timestamp)}
                </p>
              </div>
            </div>

            {!isEditing && (
              <div className="flex space-x-2">
                <button
                  onClick={handleEdit}
                  className="bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 transition"
                >
                  ✏️ 수정
                </button>
                <button
                  onClick={() => setShowDeleteModal(true)}
                  className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition"
                >
                  🗑️ 삭제
                </button>
              </div>
            )}
          </div>

          {/* 내용 */}
          {!isEditing ? (
            <div className="space-y-6">
              {record.type === 'diary' && (
                <>
                  <div>
                    <h3 className="text-lg font-bold text-gray-800 mb-3">일기 내용</h3>
                    <div className="bg-gray-50 rounded-xl p-6">
                      <p className="text-gray-700 whitespace-pre-wrap leading-relaxed">
                        {record.content}
                      </p>
                    </div>
                  </div>
                  {record.isShared && (
                    <div className="flex items-center space-x-2 text-green-600">
                      <span className="text-xl">🌍</span>
                      <span className="font-semibold">커뮤니티에 공유됨</span>
                    </div>
                  )}
                </>
              )}

              {record.type === 'emotion' && record.note && (
                <div>
                  <h3 className="text-lg font-bold text-gray-800 mb-3">메모</h3>
                  <div className="bg-gray-50 rounded-xl p-6">
                    <p className="text-gray-700 italic">💭 {record.note}</p>
                  </div>
                </div>
              )}
            </div>
          ) : (
            <div className="space-y-6">
              {/* 수정 모드 */}
              <div>
                <h3 className="text-lg font-bold text-gray-800 mb-4">감정 선택</h3>
                <div className={`grid gap-4 ${
                  record.type === 'emotion' 
                    ? 'grid-cols-2 md:grid-cols-4' 
                    : 'grid-cols-5'
                }`}>
                  {EMOTIONS.map((emotion, index) => (
                    <button
                      key={index}
                      type="button"
                      onClick={() => setEditedEmotion(index)}
                      className={`p-6 rounded-xl border-4 transition transform hover:scale-105 ${
                        editedEmotion === index
                          ? `border-indigo-600 ${emotion.bgColor || 'bg-indigo-50'} scale-105`
                          : 'border-gray-200 hover:border-gray-300'
                      }`}
                    >
                      <div className="text-4xl mb-2">{emotion.emoji}</div>
                      <div className="text-sm font-semibold text-gray-700">
                        {emotion.label}
                      </div>
                    </button>
                  ))}
                </div>
              </div>

              {record.type === 'diary' ? (
                <>
                  <div>
                    <div className="flex justify-between items-center mb-3">
                      <h3 className="text-lg font-bold text-gray-800">일기 내용</h3>
                      <span className="text-sm text-gray-500">
                        {editedContent.length} / 500자
                      </span>
                    </div>
                    <textarea
                      value={editedContent}
                      onChange={(e) => {
                        if (e.target.value.length <= 500) {
                          setEditedContent(e.target.value);
                        }
                      }}
                      className="w-full h-64 px-4 py-3 border-2 border-gray-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none resize-none"
                      placeholder="일기 내용을 입력하세요..."
                    />
                  </div>

                  <div>
                    <label className="flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        checked={editedIsShared}
                        onChange={(e) => setEditedIsShared(e.target.checked)}
                        className="w-5 h-5 text-indigo-600 rounded focus:ring-2 focus:ring-indigo-500"
                      />
                      <span className="ml-3 text-gray-700">
                        이 일기를 커뮤니티에 공유하기
                      </span>
                    </label>
                  </div>
                </>
              ) : (
                <div>
                  <div className="flex justify-between items-center mb-3">
                    <h3 className="text-lg font-bold text-gray-800">메모</h3>
                    <span className="text-sm text-gray-500">
                      {editedNote.length} / 100자
                    </span>
                  </div>
                  <textarea
                    value={editedNote}
                    onChange={(e) => {
                      if (e.target.value.length <= 100) {
                        setEditedNote(e.target.value);
                      }
                    }}
                    className="w-full h-24 px-4 py-3 border-2 border-gray-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none resize-none"
                    placeholder="메모를 입력하세요..."
                  />
                </div>
              )}

              {/* 버튼 */}
              <div className="flex space-x-3">
                <button
                  onClick={handleSave}
                  disabled={saving}
                  className="flex-1 bg-indigo-600 text-white py-3 rounded-xl font-bold hover:bg-indigo-700 transition disabled:opacity-50"
                >
                  {saving ? '저장 중...' : '💾 저장하기'}
                </button>
                <button
                  onClick={handleCancelEdit}
                  className="flex-1 bg-gray-300 text-gray-700 py-3 rounded-xl font-bold hover:bg-gray-400 transition"
                >
                  취소
                </button>
              </div>
            </div>
          )}
        </div>
      </main>

      {/* 삭제 확인 모달 */}
      {showDeleteModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl p-8 max-w-md w-full">
            <div className="text-center mb-6">
              <div className="text-5xl mb-4">⚠️</div>
              <h3 className="text-2xl font-bold text-gray-800 mb-2">
                정말 삭제하시겠어요?
              </h3>
              <p className="text-gray-600">
                삭제된 기록은 복구할 수 없습니다.
              </p>
            </div>

            <div className="flex space-x-3">
              <button
                onClick={handleDelete}
                className="flex-1 bg-red-600 text-white py-3 rounded-xl font-bold hover:bg-red-700 transition"
              >
                삭제하기
              </button>
              <button
                onClick={() => setShowDeleteModal(false)}
                className="flex-1 bg-gray-300 text-gray-700 py-3 rounded-xl font-bold hover:bg-gray-400 transition"
              >
                취소
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default RecordDetail;
