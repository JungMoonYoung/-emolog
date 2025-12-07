// 날짜 관련 유틸리티 함수

// 해당 월의 모든 날짜 배열 생성
export const getMonthDates = (year, month) => {
  const firstDay = new Date(year, month, 1);
  const lastDay = new Date(year, month + 1, 0);
  const daysInMonth = lastDay.getDate();
  const startDayOfWeek = firstDay.getDay();
  
  const dates = [];
  
  // 이전 달의 날짜로 채우기
  const prevMonthLastDay = new Date(year, month, 0).getDate();
  for (let i = startDayOfWeek - 1; i >= 0; i--) {
    dates.push({
      date: new Date(year, month - 1, prevMonthLastDay - i),
      isCurrentMonth: false
    });
  }
  
  // 현재 달의 날짜
  for (let i = 1; i <= daysInMonth; i++) {
    dates.push({
      date: new Date(year, month, i),
      isCurrentMonth: true
    });
  }
  
  // 다음 달의 날짜로 채우기 (총 42칸 - 6주)
  const remainingDays = 42 - dates.length;
  for (let i = 1; i <= remainingDays; i++) {
    dates.push({
      date: new Date(year, month + 1, i),
      isCurrentMonth: false
    });
  }
  
  return dates;
};

// 날짜를 YYYY-MM-DD 형식으로 변환
export const formatDateToString = (date) => {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
};

// 감정 점수에 따른 색상 반환
export const getEmotionColor = (score) => {
  if (score === null || score === undefined) return 'bg-gray-100';
  if (score >= 80) return 'bg-green-400';
  if (score >= 60) return 'bg-blue-400';
  if (score >= 40) return 'bg-yellow-400';
  if (score >= 20) return 'bg-orange-400';
  return 'bg-red-400';
};

// 해당 월의 평균 감정 점수 계산
export const calculateMonthAverage = (emotionData) => {
  if (!emotionData || Object.keys(emotionData).length === 0) return null;
  
  const scores = Object.values(emotionData).map(d => d.avgScore);
  const sum = scores.reduce((acc, score) => acc + score, 0);
  return Math.round(sum / scores.length);
};