import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { getAllRecords } from '../firebase/diary';

const MUSIC_RECOMMENDATIONS = {
  '최고예요': {
    emoji: '🌟',
    color: 'from-yellow-400 to-amber-500',
    mood: '신나는',
    playlists: [
      { title: 'Happy Hits!', artist: 'Various Artists', link: 'https://www.youtube.com/watch?v=ZbZSe6N_BXs', image: '🎉' },
      { title: 'Feel Good Indie', artist: 'Indie Mix', link: 'https://www.youtube.com/watch?v=fJ9rUzIMcZQ', image: '☀️' },
      { title: 'Upbeat K-Pop', artist: 'K-Pop Hits', link: 'https://www.youtube.com/watch?v=pSUydWEqKwE', image: '🎊' }
    ],
    description: '기분 좋은 날, 신나는 음악으로 더 행복하게!'
  },
  '사랑스러워요': {
    emoji: '🤗',
    color: 'from-pink-400 to-rose-500',
    mood: '사랑스러운',
    playlists: [
      { title: 'Love Songs', artist: 'Romantic Collection', link: 'https://www.youtube.com/watch?v=450p7goxZqg', image: '💕' },
      { title: 'Sweet Acoustic', artist: 'Acoustic Love', link: 'https://www.youtube.com/watch?v=jBmpYME5_8E', image: '🌸' },
      { title: 'K-Drama OST', artist: 'Drama Soundtracks', link: 'https://www.youtube.com/watch?v=XsX3ATc3FbA', image: '💖' }
    ],
    description: '사랑스러운 순간을 더 특별하게 만들어줄 음악'
  },
  '기분 좋아요': {
    emoji: '😊',
    color: 'from-green-400 to-emerald-500',
    mood: '편안한',
    playlists: [
      { title: 'Chill Vibes', artist: 'Relaxing Mix', link: 'https://www.youtube.com/watch?v=5qap5aO4i9A', image: '🎵' },
      { title: 'Coffee Shop Jazz', artist: 'Jazz Collection', link: 'https://www.youtube.com/watch?v=Dx5qFachd3A', image: '☕' },
      { title: 'Lofi Hip Hop', artist: 'Study & Relax', link: 'https://www.youtube.com/watch?v=jfKfPfyJRdk', image: '🎧' }
    ],
    description: '편안하고 기분 좋은 순간을 위한 음악'
  },
  '평온해요': {
    emoji: '😌',
    color: 'from-blue-400 to-cyan-500',
    mood: '평화로운',
    playlists: [
      { title: 'Peaceful Piano', artist: 'Piano Instrumentals', link: 'https://www.youtube.com/watch?v=lTRiuFIWV54', image: '🎹' },
      { title: 'Nature Sounds', artist: 'Meditation Music', link: 'https://www.youtube.com/watch?v=eKFTSSKCzWA', image: '🌿' },
      { title: 'Ambient Relaxation', artist: 'Calm Sounds', link: 'https://www.youtube.com/watch?v=1ZYbU82GVz4', image: '🌊' }
    ],
    description: '평온한 마음을 유지하는 데 도움이 되는 음악'
  },
  '조금 우울해요': {
    emoji: '😔',
    color: 'from-purple-400 to-violet-500',
    mood: '위로하는',
    playlists: [
      { title: 'Healing Music', artist: 'Comfort Songs', link: 'https://www.youtube.com/watch?v=RQshcZ2Hqso', image: '🌙' },
      { title: 'Rainy Day Jazz', artist: 'Melancholic Jazz', link: 'https://www.youtube.com/watch?v=xgCvHqs3pRM', image: '🌧️' },
      { title: 'Emotional Ballads', artist: 'Korean Ballads', link: 'https://www.youtube.com/watch?v=dcD6ZFg0XEw', image: '💙' }
    ],
    description: '힘든 마음을 위로해주는 따뜻한 음악'
  },
  '불안해요': {
    emoji: '😰',
    color: 'from-orange-400 to-red-500',
    mood: '진정시키는',
    playlists: [
      { title: 'Anxiety Relief', artist: 'Calming Music', link: 'https://www.youtube.com/watch?v=1ZYbU82GVz4', image: '🕊️' },
      { title: 'Meditation Sounds', artist: 'Mindfulness', link: 'https://www.youtube.com/watch?v=inpok4MKVLM', image: '🧘' },
      { title: 'Breathing Exercise Music', artist: 'Relaxation', link: 'https://www.youtube.com/watch?v=DbDoBzGY3vo', image: '🌸' }
    ],
    description: '불안한 마음을 진정시키는 데 도움이 되는 음악'
  },
  '많이 힘들어요': {
    emoji: '😢',
    color: 'from-gray-400 to-slate-500',
    mood: '회복을 돕는',
    playlists: [
      { title: 'Healing Piano', artist: 'Recovery Music', link: 'https://www.youtube.com/watch?v=T0bE3puoLpE', image: '💚' },
      { title: 'Hope & Strength', artist: 'Inspirational', link: 'https://www.youtube.com/watch?v=3sL0omwElxw', image: '🌈' },
      { title: 'Comfort Instrumental', artist: 'Soft Music', link: 'https://www.youtube.com/watch?v=4qH30cMziYI', image: '🤍' }
    ],
    description: '힘든 시기를 이겨내는 데 도움이 되는 음악'
  },
  '화나요': {
    emoji: '😤',
    color: 'from-red-400 to-rose-500',
    mood: '분노 해소',
    playlists: [
      { title: 'Anger Release', artist: 'Rock Music', link: 'https://www.youtube.com/watch?v=btPJPFnesV4', image: '🔥' },
      { title: 'Powerful Music', artist: 'Energy Boost', link: 'https://www.youtube.com/watch?v=E7NZUb2OILA', image: '⚡' },
      { title: 'Calm Down Mix', artist: 'Stress Relief', link: 'https://www.youtube.com/watch?v=SHYqPL6bwDc', image: '🌊' }
    ],
    description: '화를 건강하게 표현하고 진정하는 데 도움이 되는 음악'
  }
};

function MusicRecommendation() {
  const { currentUser } = useAuth();
  const navigate = useNavigate();
  const [currentMood, setCurrentMood] = useState(null);
  const [recentEmotion, setRecentEmotion] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadRecentEmotion();
  }, []);

  const loadRecentEmotion = async () => {
    setLoading(true);
    const result = await getAllRecords(currentUser.uid, 1);
    
    if (result.success && result.records.length > 0) {
      const emotion = result.records[0];
      setRecentEmotion(emotion);
      setCurrentMood(emotion.emotionLabel);
    }
    
    setLoading(false);
  };

  const handleMoodSelect = (mood) => {
    setCurrentMood(mood);
  };

  const recommendation = currentMood ? MUSIC_RECOMMENDATIONS[currentMood] : null;

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-pink-50">
      {/* 네비게이션 */}
      <nav className="bg-white shadow-md">
        <div className="max-w-4xl mx-auto px-4 py-4">
          <button
            onClick={() => navigate('/dashboard')}
            className="text-purple-600 hover:text-purple-800 font-semibold"
          >
            ← 돌아가기
          </button>
        </div>
      </nav>

      {/* 메인 컨텐츠 */}
      <main className="max-w-4xl mx-auto px-4 py-8">
        {/* 헤더 */}
        <div className="bg-white rounded-2xl shadow-xl p-8 mb-8">
          <div className="text-center mb-6">
            <h1 className="text-3xl font-bold text-gray-800 mb-2">
              감정 음악 추천 🎵
            </h1>
            <p className="text-gray-600">
              AI가 당신의 감정에 맞는 완벽한 음악을 추천해드려요
            </p>
          </div>

          {/* 최근 감정 표시 */}
          {!loading && recentEmotion && (
            <div className="bg-gradient-to-r from-indigo-50 to-purple-50 rounded-xl p-4 border border-indigo-200">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <span className="text-3xl">{recentEmotion.emotionEmoji || '😊'}</span>
                  <div>
                    <p className="text-sm text-indigo-600 font-semibold">
                      최근 기록된 감정
                    </p>
                    <p className="text-lg font-bold text-gray-800">
                      {recentEmotion.emotionLabel}
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => handleMoodSelect(recentEmotion.emotionLabel)}
                  className="bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 transition text-sm font-semibold"
                >
                  이 감정으로 추천받기
                </button>
              </div>
            </div>
          )}
        </div>

        {/* 감정 선택 */}
        <div className="bg-white rounded-2xl shadow-xl p-8 mb-8">
          <h2 className="text-xl font-bold text-gray-800 mb-4">
            지금의 기분을 선택해주세요
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {Object.entries(MUSIC_RECOMMENDATIONS).map(([mood, data]) => (
              <button
                key={mood}
                onClick={() => handleMoodSelect(mood)}
                className={`p-6 rounded-xl transition-all transform hover:scale-105 ${
                  currentMood === mood
                    ? `bg-gradient-to-br ${data.color} text-white shadow-lg scale-105`
                    : 'bg-gray-50 hover:bg-gray-100 border-2 border-gray-200'
                }`}
              >
                <div className="text-4xl mb-2">{data.emoji}</div>
                <div className="text-sm font-bold">
                  {mood}
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* 음악 추천 */}
        {recommendation && (
          <div className="bg-white rounded-2xl shadow-xl p-8">
            <div className="mb-6">
              <div className="flex items-center space-x-3 mb-3">
                <span className="text-4xl">{recommendation.emoji}</span>
                <div>
                  <h2 className="text-2xl font-bold text-gray-800">
                    {recommendation.mood} 음악
                  </h2>
                  <p className="text-gray-600 text-sm">
                    {recommendation.description}
                  </p>
                </div>
              </div>
            </div>

            {/* 플레이리스트 */}
            <div className="space-y-4">
              {recommendation.playlists.map((playlist, index) => (
                <a
                  key={index}
                  href={playlist.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block bg-gradient-to-r from-gray-50 to-white rounded-xl p-6 hover:shadow-lg transition border-2 border-gray-100 hover:border-purple-300"
                >
                  <div className="flex items-center space-x-4">
                    <div className="text-5xl">{playlist.image}</div>
                    <div className="flex-1">
                      <h3 className="text-lg font-bold text-gray-800">
                        {playlist.title}
                      </h3>
                      <p className="text-sm text-gray-600">
                        {playlist.artist}
                      </p>
                    </div>
                    <div className="text-purple-600">
                      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                    </div>
                  </div>
                </a>
              ))}
            </div>

            {/* 안내 */}
            <div className="mt-6 bg-gradient-to-r from-purple-50 to-pink-50 rounded-xl p-6 border border-purple-200">
              <div className="flex items-start space-x-3">
                <span className="text-2xl">💡</span>
                <div>
                  <h4 className="font-bold text-purple-900 mb-2">음악 치료 효과</h4>
                  <p className="text-sm text-purple-800">
                    음악은 감정 조절에 큰 도움이 됩니다. 하루 15-30분 정도 음악을 들으면서 
                    깊게 호흡하고 현재 순간에 집중해보세요. 감정이 한결 나아질 거예요! 🎵
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* 선택 전 안내 */}
        {!recommendation && !loading && (
          <div className="bg-white rounded-2xl shadow-xl p-12 text-center">
            <div className="text-6xl mb-4">🎵</div>
            <h3 className="text-xl font-bold text-gray-800 mb-2">
              감정을 선택해주세요
            </h3>
            <p className="text-gray-600">
              지금 느끼는 감정을 선택하면, AI가 맞춤 음악을 추천해드려요!
            </p>
          </div>
        )}
      </main>
    </div>
  );
}

export default MusicRecommendation;
