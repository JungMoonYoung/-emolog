import React, { useState, useEffect } from 'react';

// 감정별 음악 추천 데이터 (각 10곡씩)
const MUSIC_RECOMMENDATIONS = {
  '최고예요': [
    { title: 'Happy - Pharrell Williams', url: 'https://www.youtube.com/watch?v=ZbZSe6N_BXs', artist: 'Pharrell Williams' },
    { title: 'Walking on Sunshine', url: 'https://www.youtube.com/watch?v=iPUmE-tne5U', artist: 'Katrina and the Waves' },
    { title: 'Good Vibrations', url: 'https://www.youtube.com/watch?v=Eab_beh07HU', artist: 'The Beach Boys' },
    { title: 'September', url: 'https://www.youtube.com/watch?v=Gs069dndIYk', artist: 'Earth, Wind & Fire' },
    { title: 'I Gotta Feeling', url: 'https://www.youtube.com/watch?v=uSD4vsh1zDA', artist: 'Black Eyed Peas' },
    { title: 'Best Day Of My Life', url: 'https://www.youtube.com/watch?v=Y66j_BUCBMY', artist: 'American Authors' },
    { title: 'Three Little Birds', url: 'https://www.youtube.com/watch?v=zaGUr6wzyT8', artist: 'Bob Marley' },
    { title: 'Lovely Day', url: 'https://www.youtube.com/watch?v=bEeaS6fuUoA', artist: 'Bill Withers' },
    { title: 'On Top of the World', url: 'https://www.youtube.com/watch?v=w5tWYmIOWGk', artist: 'Imagine Dragons' },
    { title: 'Can\'t Stop the Feeling!', url: 'https://www.youtube.com/watch?v=ru0K8uYEZWw', artist: 'Justin Timberlake' },
  ],
  '사랑스러워요': [
    { title: 'Perfect', url: 'https://www.youtube.com/watch?v=2Vv-BfVoq4g', artist: 'Ed Sheeran' },
    { title: 'Make You Feel My Love', url: 'https://www.youtube.com/watch?v=0put0_a--Ng', artist: 'Adele' },
    { title: 'A Thousand Years', url: 'https://www.youtube.com/watch?v=rtOvBOTyX00', artist: 'Christina Perri' },
    { title: 'All of Me', url: 'https://www.youtube.com/watch?v=450p7goxZqg', artist: 'John Legend' },
    { title: 'Thinking Out Loud', url: 'https://www.youtube.com/watch?v=lp-EO5I60KA', artist: 'Ed Sheeran' },
    { title: 'Love Story', url: 'https://www.youtube.com/watch?v=8xg3vE8Ie_E', artist: 'Taylor Swift' },
    { title: 'Just the Way You Are', url: 'https://www.youtube.com/watch?v=LjhCEhWiKXk', artist: 'Bruno Mars' },
    { title: 'Your Song', url: 'https://www.youtube.com/watch?v=mTa8U0Wa0q8', artist: 'Elton John' },
    { title: 'Can\'t Help Falling in Love', url: 'https://www.youtube.com/watch?v=vGJTaP6anOU', artist: 'Elvis Presley' },
    { title: 'At Last', url: 'https://www.youtube.com/watch?v=S-cbOl96RFM', artist: 'Etta James' },
  ],
  '기분 좋아요': [
    { title: 'Uptown Funk', url: 'https://www.youtube.com/watch?v=OPf0YbXqDm0', artist: 'Mark Ronson ft. Bruno Mars' },
    { title: 'Feel Good Inc.', url: 'https://www.youtube.com/watch?v=HyHNuVaZJ-k', artist: 'Gorillaz' },
    { title: 'Dynamite', url: 'https://www.youtube.com/watch?v=gdZLi9oWNZg', artist: 'BTS' },
    { title: 'Shake It Off', url: 'https://www.youtube.com/watch?v=nfWlot6h_JM', artist: 'Taylor Swift' },
    { title: 'Good as Hell', url: 'https://www.youtube.com/watch?v=SmbmeOgWsqE', artist: 'Lizzo' },
    { title: 'Roar', url: 'https://www.youtube.com/watch?v=CevxZvSJLk8', artist: 'Katy Perry' },
    { title: 'Firework', url: 'https://www.youtube.com/watch?v=QGJuMBdaqIw', artist: 'Katy Perry' },
    { title: 'Eye of the Tiger', url: 'https://www.youtube.com/watch?v=btPJPFnesV4', artist: 'Survivor' },
    { title: 'Don\'t Stop Me Now', url: 'https://www.youtube.com/watch?v=HgzGwKwLmgM', artist: 'Queen' },
    { title: 'Walking On Sunshine', url: 'https://www.youtube.com/watch?v=iPUmE-tne5U', artist: 'Katrina And The Waves' },
  ],
  '평온해요': [
    { title: 'Weightless', url: 'https://www.youtube.com/watch?v=UfcAVejslrU', artist: 'Marconi Union' },
    { title: 'River Flows in You', url: 'https://www.youtube.com/watch?v=7maJOI3QMu0', artist: 'Yiruma' },
    { title: 'Clair de Lune', url: 'https://www.youtube.com/watch?v=CvFH_6DNRCY', artist: 'Claude Debussy' },
    { title: 'Moonlight Sonata', url: 'https://www.youtube.com/watch?v=4Tr0otuiQuU', artist: 'Beethoven' },
    { title: 'Canon in D', url: 'https://www.youtube.com/watch?v=hOA-2hl1Vbc', artist: 'Pachelbel' },
    { title: 'The Swan', url: 'https://www.youtube.com/watch?v=3qrKjywjo7Q', artist: 'Saint-Saëns' },
    { title: 'Air on the G String', url: 'https://www.youtube.com/watch?v=rrVDViSlsSM', artist: 'Bach' },
    { title: 'Gymnopédie No. 1', url: 'https://www.youtube.com/watch?v=S-Xm7s9eGxU', artist: 'Erik Satie' },
    { title: 'Nocturne Op.9 No.2', url: 'https://www.youtube.com/watch?v=9E6b3swbnWg', artist: 'Chopin' },
    { title: 'Aquarium', url: 'https://www.youtube.com/watch?v=YVpl-RNzdE4', artist: 'Saint-Saëns' },
  ],
  '조금 우울해요': [
    { title: 'Someone Like You', url: 'https://www.youtube.com/watch?v=hLQl3WQQoQ0', artist: 'Adele' },
    { title: 'Fix You', url: 'https://www.youtube.com/watch?v=k4V3Mo61fJM', artist: 'Coldplay' },
    { title: 'The Scientist', url: 'https://www.youtube.com/watch?v=RB-RcX5DS5A', artist: 'Coldplay' },
    { title: 'Hallelujah', url: 'https://www.youtube.com/watch?v=ttEMYvpoR-k', artist: 'Jeff Buckley' },
    { title: 'Mad World', url: 'https://www.youtube.com/watch?v=4N3N1MlvVc4', artist: 'Gary Jules' },
    { title: 'Everybody Hurts', url: 'https://www.youtube.com/watch?v=5rOiW_xY-kc', artist: 'R.E.M.' },
    { title: 'Tears in Heaven', url: 'https://www.youtube.com/watch?v=JxPj3GAYYZ0', artist: 'Eric Clapton' },
    { title: 'Hurt', url: 'https://www.youtube.com/watch?v=8AHCfZTRGiI', artist: 'Johnny Cash' },
    { title: 'The Night We Met', url: 'https://www.youtube.com/watch?v=KtlgYxa6BMU', artist: 'Lord Huron' },
    { title: 'Skinny Love', url: 'https://www.youtube.com/watch?v=ssdgFoHLwnk', artist: 'Bon Iver' },
  ],
  '불안해요': [
    { title: 'Breathe', url: 'https://www.youtube.com/watch?v=0Z_37w1kzmE', artist: 'Anna Nalick' },
    { title: 'Let It Be', url: 'https://www.youtube.com/watch?v=QDYfEBY9NM4', artist: 'The Beatles' },
    { title: 'Here Comes the Sun', url: 'https://www.youtube.com/watch?v=KQetemT1sWc', artist: 'The Beatles' },
    { title: 'Don\'t Worry Be Happy', url: 'https://www.youtube.com/watch?v=d-diB65scQU', artist: 'Bobby McFerrin' },
    { title: 'Orinoco Flow', url: 'https://www.youtube.com/watch?v=LTrk4X9ACtw', artist: 'Enya' },
    { title: 'Brave', url: 'https://www.youtube.com/watch?v=QUQsqBqxoR4', artist: 'Sara Bareilles' },
    { title: 'Unwritten', url: 'https://www.youtube.com/watch?v=b7k0a5hYnSI', artist: 'Natasha Bedingfield' },
    { title: 'Beautiful Day', url: 'https://www.youtube.com/watch?v=co6WMzDOh1o', artist: 'U2' },
    { title: 'Put Your Records On', url: 'https://www.youtube.com/watch?v=rjOhZZyn30k', artist: 'Corinne Bailey Rae' },
    { title: 'Somewhere Over the Rainbow', url: 'https://www.youtube.com/watch?v=V1bFr2SWP1I', artist: 'Israel Kamakawiwoʻole' },
  ],
  '많이 힘들어요': [
    { title: 'Fix You', url: 'https://www.youtube.com/watch?v=k4V3Mo61fJM', artist: 'Coldplay' },
    { title: 'Lean on Me', url: 'https://www.youtube.com/watch?v=fOZ-MySzAac', artist: 'Bill Withers' },
    { title: 'Stand By Me', url: 'https://www.youtube.com/watch?v=hwZNL7QVJjE', artist: 'Ben E. King' },
    { title: 'You\'ve Got a Friend', url: 'https://www.youtube.com/watch?v=HNWpXiuQVsA', artist: 'Carole King' },
    { title: 'Bridge Over Troubled Water', url: 'https://www.youtube.com/watch?v=4G-YQA_bsOU', artist: 'Simon & Garfunkel' },
    { title: 'Everybody Hurts', url: 'https://www.youtube.com/watch?v=5rOiW_xY-kc', artist: 'R.E.M.' },
    { title: 'Hero', url: 'https://www.youtube.com/watch?v=0IA3ZvCkRkQ', artist: 'Mariah Carey' },
    { title: 'You\'re Not Alone', url: 'https://www.youtube.com/watch?v=pAyKJAtDNCw', artist: 'Saosin' },
    { title: 'Hold On', url: 'https://www.youtube.com/watch?v=uIbXvaE39wM', artist: 'Good Charlotte' },
    { title: 'Stronger', url: 'https://www.youtube.com/watch?v=Xn676-fLq7I', artist: 'Kelly Clarkson' },
  ],
  '화나요': [
    { title: 'Smells Like Teen Spirit', url: 'https://www.youtube.com/watch?v=hTWKbfoikeg', artist: 'Nirvana' },
    { title: 'Break Stuff', url: 'https://www.youtube.com/watch?v=ZpUYjpKg9KY', artist: 'Limp Bizkit' },
    { title: 'Killing in the Name', url: 'https://www.youtube.com/watch?v=bWXazVhlyxQ', artist: 'Rage Against the Machine' },
    { title: 'In the End', url: 'https://www.youtube.com/watch?v=eVTXPUF4Oz4', artist: 'Linkin Park' },
    { title: 'Numb', url: 'https://www.youtube.com/watch?v=kXYiU_JCYtU', artist: 'Linkin Park' },
    { title: 'Remember the Name', url: 'https://www.youtube.com/watch?v=VDvr08sCPOc', artist: 'Fort Minor' },
    { title: 'Till I Collapse', url: 'https://www.youtube.com/watch?v=ytQ5CYE1VZw', artist: 'Eminem' },
    { title: 'Lose Yourself', url: 'https://www.youtube.com/watch?v=_Yhyp-_hX2s', artist: 'Eminem' },
    { title: 'We Will Rock You', url: 'https://www.youtube.com/watch?v=-tJYN-eG1zk', artist: 'Queen' },
    { title: 'Eye of the Tiger', url: 'https://www.youtube.com/watch?v=btPJPFnesV4', artist: 'Survivor' },
  ],
  // 일기 감정 (매우 좋음)
  '매우 좋음': [
    { title: 'Happy', url: 'https://www.youtube.com/watch?v=ZbZSe6N_BXs', artist: 'Pharrell Williams' },
    { title: 'Best Day Of My Life', url: 'https://www.youtube.com/watch?v=Y66j_BUCBMY', artist: 'American Authors' },
    { title: 'Walking on Sunshine', url: 'https://www.youtube.com/watch?v=iPUmE-tne5U', artist: 'Katrina and the Waves' },
    { title: 'Good Vibrations', url: 'https://www.youtube.com/watch?v=Eab_beh07HU', artist: 'The Beach Boys' },
    { title: 'September', url: 'https://www.youtube.com/watch?v=Gs069dndIYk', artist: 'Earth, Wind & Fire' },
    { title: 'I Gotta Feeling', url: 'https://www.youtube.com/watch?v=uSD4vsh1zDA', artist: 'Black Eyed Peas' },
    { title: 'Can\'t Stop the Feeling!', url: 'https://www.youtube.com/watch?v=ru0K8uYEZWw', artist: 'Justin Timberlake' },
    { title: 'Lovely Day', url: 'https://www.youtube.com/watch?v=bEeaS6fuUoA', artist: 'Bill Withers' },
    { title: 'Three Little Birds', url: 'https://www.youtube.com/watch?v=zaGUr6wzyT8', artist: 'Bob Marley' },
    { title: 'On Top of the World', url: 'https://www.youtube.com/watch?v=w5tWYmIOWGk', artist: 'Imagine Dragons' },
  ],
  // 일기 감정 (좋음)
  '좋음': [
    { title: 'Uptown Funk', url: 'https://www.youtube.com/watch?v=OPf0YbXqDm0', artist: 'Mark Ronson ft. Bruno Mars' },
    { title: 'Dynamite', url: 'https://www.youtube.com/watch?v=gdZLi9oWNZg', artist: 'BTS' },
    { title: 'Shake It Off', url: 'https://www.youtube.com/watch?v=nfWlot6h_JM', artist: 'Taylor Swift' },
    { title: 'Good as Hell', url: 'https://www.youtube.com/watch?v=SmbmeOgWsqE', artist: 'Lizzo' },
    { title: 'Feel Good Inc.', url: 'https://www.youtube.com/watch?v=HyHNuVaZJ-k', artist: 'Gorillaz' },
    { title: 'Roar', url: 'https://www.youtube.com/watch?v=CevxZvSJLk8', artist: 'Katy Perry' },
    { title: 'Firework', url: 'https://www.youtube.com/watch?v=QGJuMBdaqIw', artist: 'Katy Perry' },
    { title: 'Don\'t Stop Me Now', url: 'https://www.youtube.com/watch?v=HgzGwKwLmgM', artist: 'Queen' },
    { title: 'Eye of the Tiger', url: 'https://www.youtube.com/watch?v=btPJPFnesV4', artist: 'Survivor' },
    { title: 'Walking On Sunshine', url: 'https://www.youtube.com/watch?v=iPUmE-tne5U', artist: 'Katrina And The Waves' },
  ],
  // 일기 감정 (보통)
  '보통': [
    { title: 'Let It Be', url: 'https://www.youtube.com/watch?v=QDYfEBY9NM4', artist: 'The Beatles' },
    { title: 'Here Comes the Sun', url: 'https://www.youtube.com/watch?v=KQetemT1sWc', artist: 'The Beatles' },
    { title: 'Beautiful Day', url: 'https://www.youtube.com/watch?v=co6WMzDOh1o', artist: 'U2' },
    { title: 'Somewhere Over the Rainbow', url: 'https://www.youtube.com/watch?v=V1bFr2SWP1I', artist: 'Israel Kamakawiwoʻole' },
    { title: 'Put Your Records On', url: 'https://www.youtube.com/watch?v=rjOhZZyn30k', artist: 'Corinne Bailey Rae' },
    { title: 'Unwritten', url: 'https://www.youtube.com/watch?v=b7k0a5hYnSI', artist: 'Natasha Bedingfield' },
    { title: 'Three Little Birds', url: 'https://www.youtube.com/watch?v=zaGUr6wzyT8', artist: 'Bob Marley' },
    { title: 'Don\'t Worry Be Happy', url: 'https://www.youtube.com/watch?v=d-diB65scQU', artist: 'Bobby McFerrin' },
    { title: 'River Flows in You', url: 'https://www.youtube.com/watch?v=7maJOI3QMu0', artist: 'Yiruma' },
    { title: 'Clair de Lune', url: 'https://www.youtube.com/watch?v=CvFH_6DNRCY', artist: 'Claude Debussy' },
  ],
  // 일기 감정 (조금 나쁨)
  '조금 나쁨': [
    { title: 'Fix You', url: 'https://www.youtube.com/watch?v=k4V3Mo61fJM', artist: 'Coldplay' },
    { title: 'The Scientist', url: 'https://www.youtube.com/watch?v=RB-RcX5DS5A', artist: 'Coldplay' },
    { title: 'Someone Like You', url: 'https://www.youtube.com/watch?v=hLQl3WQQoQ0', artist: 'Adele' },
    { title: 'Hallelujah', url: 'https://www.youtube.com/watch?v=ttEMYvpoR-k', artist: 'Jeff Buckley' },
    { title: 'Mad World', url: 'https://www.youtube.com/watch?v=4N3N1MlvVc4', artist: 'Gary Jules' },
    { title: 'Everybody Hurts', url: 'https://www.youtube.com/watch?v=5rOiW_xY-kc', artist: 'R.E.M.' },
    { title: 'The Night We Met', url: 'https://www.youtube.com/watch?v=KtlgYxa6BMU', artist: 'Lord Huron' },
    { title: 'Tears in Heaven', url: 'https://www.youtube.com/watch?v=JxPj3GAYYZ0', artist: 'Eric Clapton' },
    { title: 'Skinny Love', url: 'https://www.youtube.com/watch?v=ssdgFoHLwnk', artist: 'Bon Iver' },
    { title: 'Hurt', url: 'https://www.youtube.com/watch?v=8AHCfZTRGiI', artist: 'Johnny Cash' },
  ],
  // 일기 감정 (매우 나쁨)
  '매우 나쁨': [
    { title: 'Lean on Me', url: 'https://www.youtube.com/watch?v=fOZ-MySzAac', artist: 'Bill Withers' },
    { title: 'Stand By Me', url: 'https://www.youtube.com/watch?v=hwZNL7QVJjE', artist: 'Ben E. King' },
    { title: 'You\'ve Got a Friend', url: 'https://www.youtube.com/watch?v=HNWpXiuQVsA', artist: 'Carole King' },
    { title: 'Bridge Over Troubled Water', url: 'https://www.youtube.com/watch?v=4G-YQA_bsOU', artist: 'Simon & Garfunkel' },
    { title: 'Everybody Hurts', url: 'https://www.youtube.com/watch?v=5rOiW_xY-kc', artist: 'R.E.M.' },
    { title: 'Hero', url: 'https://www.youtube.com/watch?v=0IA3ZvCkRkQ', artist: 'Mariah Carey' },
    { title: 'Stronger', url: 'https://www.youtube.com/watch?v=Xn676-fLq7I', artist: 'Kelly Clarkson' },
    { title: 'You\'re Not Alone', url: 'https://www.youtube.com/watch?v=pAyKJAtDNCw', artist: 'Saosin' },
    { title: 'Hold On', url: 'https://www.youtube.com/watch?v=uIbXvaE39wM', artist: 'Good Charlotte' },
    { title: 'Fix You', url: 'https://www.youtube.com/watch?v=k4V3Mo61fJM', artist: 'Coldplay' },
  ],
};

function MusicRecommendationModal({ emotion, onClose }) {
  const [selectedMusic, setSelectedMusic] = useState([]);

  useEffect(() => {
    // 감정에 맞는 음악 가져오기
    const recommendations = MUSIC_RECOMMENDATIONS[emotion] || MUSIC_RECOMMENDATIONS['보통'];
    
    // 랜덤으로 3개 선택
    const shuffled = [...recommendations].sort(() => 0.5 - Math.random());
    const random3 = shuffled.slice(0, 3);
    
    setSelectedMusic(random3);
  }, [emotion]);

  // 음악 클릭 (새 탭에서 열기)
  const handleMusicClick = (url) => {
    window.open(url, '_blank');
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-6 relative animate-scale-in">
        {/* 닫기 버튼 */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 transition"
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>

        {/* 헤더 */}
        <div className="text-center mb-6">
          <div className="text-5xl mb-3">🎵</div>
          <h2 className="text-2xl font-bold text-gray-800 mb-2">
            음악 추천
          </h2>
          <p className="text-gray-600">
            <span className="text-indigo-600 font-semibold">{emotion}</span> 감정에 어울리는 음악이에요
          </p>
        </div>

        {/* 음악 목록 */}
        <div className="space-y-3">
          {selectedMusic.map((music, index) => (
            <button
              key={index}
              onClick={() => handleMusicClick(music.url)}
              className="w-full bg-gradient-to-r from-purple-50 to-pink-50 hover:from-purple-100 hover:to-pink-100 p-4 rounded-xl transition transform hover:scale-105 flex items-center space-x-4"
            >
              {/* 아이콘 */}
              <div className="bg-gradient-to-br from-purple-500 to-pink-500 text-white w-12 h-12 rounded-full flex items-center justify-center flex-shrink-0">
                <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M18 3a1 1 0 00-1.196-.98l-10 2A1 1 0 006 5v9.114A4.369 4.369 0 005 14c-1.657 0-3 .895-3 2s1.343 2 3 2 3-.895 3-2V7.82l8-1.6v5.894A4.37 4.37 0 0015 12c-1.657 0-3 .895-3 2s1.343 2 3 2 3-.895 3-2V3z" />
                </svg>
              </div>

              {/* 음악 정보 */}
              <div className="flex-1 text-left">
                <div className="font-semibold text-gray-800">{music.title}</div>
                <div className="text-sm text-gray-600">{music.artist}</div>
              </div>

              {/* 화살표 */}
              <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </button>
          ))}
        </div>

        {/* 닫기 버튼 */}
        <button
          onClick={onClose}
          className="w-full mt-6 bg-gray-200 hover:bg-gray-300 text-gray-700 py-3 rounded-xl font-semibold transition"
        >
          닫기
        </button>

        {/* Gemini 준비 주석 */}
        {/* 
        향후 Gemini API 연동 시:
        1. MUSIC_RECOMMENDATIONS를 백업으로 유지
        2. Gemini API로 감정 분석 → 음악 추천 요청
        3. API 실패 시 MUSIC_RECOMMENDATIONS 사용 (fallback)
        
        예시 코드:
        const getGeminiRecommendations = async (emotion) => {
          try {
            const response = await fetch(GEMINI_API_URL, {
              method: 'POST',
              body: JSON.stringify({
                prompt: `${emotion} 감정에 어울리는 음악 3곡 추천해줘`
              })
            });
            const data = await response.json();
            return data.recommendations;
          } catch (error) {
            // Fallback to static recommendations
            return MUSIC_RECOMMENDATIONS[emotion];
          }
        };
        */}
      </div>

      {/* 애니메이션 스타일 */}
      <style>{`
        @keyframes scale-in {
          from {
            opacity: 0;
            transform: scale(0.9);
          }
          to {
            opacity: 1;
            transform: scale(1);
          }
        }
        .animate-scale-in {
          animation: scale-in 0.3s ease-out;
        }
      `}</style>
    </div>
  );
}

export default MusicRecommendationModal;
