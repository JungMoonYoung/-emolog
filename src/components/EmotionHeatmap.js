import React, { useState, useEffect } from 'react';
import { useAuth } from '../hooks/useAuth';
import { getAllRecords } from '../firebase/diary';
import { getMonthDates, formatDateToString, getEmotionColor, calculateMonthAverage } from '../utils/dateUtils';

function EmotionHeatmap() {
  const { currentUser } = useAuth();
  const [currentDate, setCurrentDate] = useState(new Date());
  const [emotionData, setEmotionData] = useState({});
  const [loading, setLoading] = useState(true);
  const [selectedDate, setSelectedDate] = useState(null);

  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();

  useEffect(() => {
    loadMonthData();
  }, [currentDate]);

  const loadMonthData = async () => {
    setLoading(true);
    
    // 모든 기록 가져오기
    const result = await getAllRecords(currentUser.uid);
    
    if (result.success) {
      const records = result.records;
      
      // 날짜별로 그룹화하고 평균 계산
      const grouped = {};
      
      records.forEach(record => {
        const dateStr = record.date;
        
        if (!grouped[dateStr]) {
          grouped[dateStr] = {
            scores: [],
            count: 0,
            records: []
          };
        }
        
        grouped[dateStr].scores.push(record.emotionScore);
        grouped[dateStr].count++;
        grouped[dateStr].records.push(record);
      });
      
      // 평균 계산
      const averaged = {};
      Object.keys(grouped).forEach(dateStr => {
        const data = grouped[dateStr];
        const avgScore = Math.round(
          data.scores.reduce((sum, score) => sum + score, 0) / data.scores.length
        );
        averaged[dateStr] = {
          avgScore,
          count: data.count,
          records: data.records
        };
      });
      
      setEmotionData(averaged);
    }
    
    setLoading(false);
  };

  const goToPreviousMonth = () => {
    setCurrentDate(new Date(year, month - 1, 1));
  };

  const goToNextMonth = () => {
    setCurrentDate(new Date(year, month + 1, 1));
  };

  const goToToday = () => {
    setCurrentDate(new Date());
  };

  const monthDates = getMonthDates(year, month);
  const weekDays = ['일', '월', '화', '수', '목', '금', '토'];
  const monthAverage = calculateMonthAverage(emotionData);

  return (
    <div className="bg-white rounded-2xl shadow-lg p-8">
      {/* 헤더 */}
      <div className="flex justify-between items-center mb-6">
        <div>
          <h3 className="text-2xl font-bold text-gray-800">
            감정 히트맵 🗓️
          </h3>
          <p className="text-sm text-gray-500 mt-1">
            {month + 1}월의 감정 패턴을 한눈에 확인하세요
          </p>
        </div>
        
        <div className="flex items-center space-x-2">
          <button
            onClick={goToPreviousMonth}
            className="px-3 py-2 bg-gray-100 hover:bg-gray-200 rounded-lg transition"
          >
            ←
          </button>
          <button
            onClick={goToToday}
            className="px-4 py-2 bg-indigo-100 text-indigo-700 hover:bg-indigo-200 rounded-lg transition font-semibold"
          >
            오늘
          </button>
          <button
            onClick={goToNextMonth}
            className="px-3 py-2 bg-gray-100 hover:bg-gray-200 rounded-lg transition"
          >
            →
          </button>
        </div>
      </div>

      {/* 월 표시 */}
      <div className="text-center mb-4">
        <h4 className="text-xl font-bold text-gray-700">
          {year}년 {month + 1}월
        </h4>
        {monthAverage !== null && (
          <p className="text-sm text-gray-500 mt-1">
            이번 달 평균: <span className="font-semibold text-indigo-600">{monthAverage}점</span>
          </p>
        )}
      </div>

      {/* 로딩 */}
      {loading && (
        <div className="text-center py-12">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600 mx-auto"></div>
        </div>
      )}

      {/* 캘린더 */}
      {!loading && (
        <div>
          {/* 요일 헤더 */}
          <div className="grid grid-cols-7 gap-2 mb-2">
            {weekDays.map((day, index) => (
              <div
                key={day}
                className={`text-center font-semibold text-sm py-2 ${
                  index === 0 ? 'text-red-500' : index === 6 ? 'text-blue-500' : 'text-gray-600'
                }`}
              >
                {day}
              </div>
            ))}
          </div>

          {/* 날짜 그리드 */}
          <div className="grid grid-cols-7 gap-2">
            {monthDates.map((dateInfo, index) => {
              const dateStr = formatDateToString(dateInfo.date);
              const dayData = emotionData[dateStr];
              const isToday = dateStr === formatDateToString(new Date());
              
              return (
                <button
                  key={index}
                  onClick={() => dayData && setSelectedDate(dayData)}
                  className={`
                    aspect-square rounded-lg p-2 transition-all relative
                    ${dateInfo.isCurrentMonth ? '' : 'opacity-30'}
                    ${dayData ? getEmotionColor(dayData.avgScore) + ' hover:scale-110 cursor-pointer' : 'bg-gray-50'}
                    ${isToday ? 'ring-2 ring-indigo-600' : ''}
                  `}
                >
                  <div className={`text-sm font-semibold ${
                    dayData ? 'text-white' : 'text-gray-400'
                  }`}>
                    {dateInfo.date.getDate()}
                  </div>
                  {dayData && (
                    <div className="absolute bottom-1 right-1 text-xs text-white bg-black/30 rounded-full w-4 h-4 flex items-center justify-center">
                      {dayData.count}
                    </div>
                  )}
                </button>
              );
            })}
          </div>
        </div>
      )}

      {/* 범례 */}
      <div className="mt-6 flex items-center justify-center space-x-4 text-sm">
        <span className="text-gray-600">감정:</span>
        <div className="flex items-center space-x-2">
          <div className="w-4 h-4 bg-red-400 rounded"></div>
          <span className="text-gray-600">나쁨</span>
        </div>
        <div className="flex items-center space-x-2">
          <div className="w-4 h-4 bg-yellow-400 rounded"></div>
          <span className="text-gray-600">보통</span>
        </div>
        <div className="flex items-center space-x-2">
          <div className="w-4 h-4 bg-green-400 rounded"></div>
          <span className="text-gray-600">좋음</span>
        </div>
      </div>

      {/* 선택된 날짜 정보 */}
      {selectedDate && (
        <div className="mt-6 p-4 bg-indigo-50 rounded-lg border border-indigo-200">
          <div className="flex justify-between items-center mb-2">
            <h4 className="font-bold text-indigo-900">
              이 날의 기록 ({selectedDate.count}개)
            </h4>
            <button
              onClick={() => setSelectedDate(null)}
              className="text-indigo-600 hover:text-indigo-800"
            >
              ✕
            </button>
          </div>
          <p className="text-sm text-indigo-700">
            평균 감정 점수: {selectedDate.avgScore}점
          </p>
        </div>
      )}
    </div>
  );
}

export default EmotionHeatmap;