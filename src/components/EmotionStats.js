import React, { useState, useEffect } from 'react';
import { useAuth } from '../hooks/useAuth';
import { getAllRecords } from '../firebase/diary';
import {
  LineChart, Line, BarChart, Bar, PieChart, Pie, Cell,
  XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer
} from 'recharts';

function EmotionStats() {
  const { currentUser } = useAuth();
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [period, setPeriod] = useState('week'); // 'week' | 'month'

  useEffect(() => {
    loadStats();
  }, [period]);

  const loadStats = async () => {
    setLoading(true);
    const result = await getAllRecords(currentUser.uid);
    
    if (result.success) {
      const records = result.records;
      
      // 기간별 필터링
      const now = new Date();
      const filterDate = new Date();
      if (period === 'week') {
        filterDate.setDate(now.getDate() - 7);
      } else {
        filterDate.setDate(now.getDate() - 30);
      }
      
      const filteredRecords = records.filter(record => {
        const recordDate = new Date(record.timestamp);
        return recordDate >= filterDate;
      });
      
      // 통계 계산
      const calculatedStats = calculateStats(filteredRecords);
      setStats(calculatedStats);
    }
    
    setLoading(false);
  };

  const calculateStats = (records) => {
    if (records.length === 0) {
      return {
        avgScore: 0,
        totalCount: 0,
        emotionDistribution: [],
        dailyTrend: [],
        weekdayAverage: []
      };
    }

    // 평균 감정 점수
    const avgScore = Math.round(
      records.reduce((sum, r) => sum + r.emotionScore, 0) / records.length
    );

    // 감정 분포
    const emotionCounts = {};
    records.forEach(record => {
      const label = record.emotionLabel;
      emotionCounts[label] = (emotionCounts[label] || 0) + 1;
    });

    const emotionDistribution = Object.entries(emotionCounts).map(([name, value]) => ({
      name,
      value
    }));

    // 일별 추이
    const dailyData = {};
    records.forEach(record => {
      const date = record.date;
      if (!dailyData[date]) {
        dailyData[date] = { scores: [], count: 0 };
      }
      dailyData[date].scores.push(record.emotionScore);
      dailyData[date].count++;
    });

    const dailyTrend = Object.entries(dailyData)
      .map(([date, data]) => ({
        date: new Date(date).toLocaleDateString('ko-KR', { month: 'short', day: 'numeric' }),
        score: Math.round(data.scores.reduce((a, b) => a + b, 0) / data.scores.length),
        count: data.count
      }))
      .sort((a, b) => new Date(a.date) - new Date(b.date))
      .slice(-7); // 최근 7일

    // 요일별 평균
    const weekdayData = {};
    const weekdayNames = ['일', '월', '화', '수', '목', '금', '토'];
    
    records.forEach(record => {
      const date = new Date(record.timestamp);
      const weekday = weekdayNames[date.getDay()];
      if (!weekdayData[weekday]) {
        weekdayData[weekday] = { scores: [] };
      }
      weekdayData[weekday].scores.push(record.emotionScore);
    });

    const weekdayAverage = weekdayNames.map(day => ({
      day,
      average: weekdayData[day] 
        ? Math.round(weekdayData[day].scores.reduce((a, b) => a + b, 0) / weekdayData[day].scores.length)
        : 0
    }));

    return {
      avgScore,
      totalCount: records.length,
      emotionDistribution,
      dailyTrend,
      weekdayAverage
    };
  };

  const COLORS = ['#10b981', '#3b82f6', '#f59e0b', '#ef4444', '#8b5cf6'];

  if (loading) {
    return (
      <div className="bg-white rounded-2xl shadow-lg p-8">
        <div className="text-center py-12">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600 mx-auto"></div>
        </div>
      </div>
    );
  }

  if (!stats || stats.totalCount === 0) {
    return (
      <div className="bg-white rounded-2xl shadow-lg p-8">
        <h3 className="text-2xl font-bold text-gray-800 mb-4">감정 통계 📊</h3>
        <div className="text-center py-12">
          <div className="text-5xl mb-4">📈</div>
          <p className="text-gray-500">아직 기록이 충분하지 않아요</p>
          <p className="text-sm text-gray-400 mt-2">더 많은 감정을 기록하면 통계를 볼 수 있어요!</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-2xl shadow-lg p-8">
      {/* 헤더 */}
      <div className="flex justify-between items-center mb-6">
        <div>
          <h3 className="text-2xl font-bold text-gray-800">감정 통계 📊</h3>
          <p className="text-sm text-gray-500 mt-1">당신의 감정 패턴을 분석했어요</p>
        </div>
        
        <div className="flex space-x-2">
          <button
            onClick={() => setPeriod('week')}
            className={`px-4 py-2 rounded-lg font-semibold transition ${
              period === 'week'
                ? 'bg-indigo-600 text-white'
                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
            }`}
          >
            최근 7일
          </button>
          <button
            onClick={() => setPeriod('month')}
            className={`px-4 py-2 rounded-lg font-semibold transition ${
              period === 'month'
                ? 'bg-indigo-600 text-white'
                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
            }`}
          >
            최근 30일
          </button>
        </div>
      </div>

      {/* 요약 카드 */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
        <div className="bg-gradient-to-br from-blue-50 to-indigo-100 rounded-xl p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-indigo-600 font-semibold">평균 감정 점수</p>
              <p className="text-4xl font-bold text-indigo-900 mt-2">{stats.avgScore}점</p>
            </div>
            <div className="text-5xl">😊</div>
          </div>
        </div>
        
        <div className="bg-gradient-to-br from-purple-50 to-pink-100 rounded-xl p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-purple-600 font-semibold">총 기록 수</p>
              <p className="text-4xl font-bold text-purple-900 mt-2">{stats.totalCount}개</p>
            </div>
            <div className="text-5xl">📝</div>
          </div>
        </div>
      </div>

      {/* 차트 섹션 */}
      <div className="space-y-8">
        {/* 일별 감정 추이 */}
        <div>
          <h4 className="text-lg font-bold text-gray-800 mb-4">📈 일별 감정 추이</h4>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={stats.dailyTrend}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="date" />
              <YAxis domain={[0, 100]} />
              <Tooltip />
              <Legend />
              <Line 
                type="monotone" 
                dataKey="score" 
                stroke="#6366f1" 
                strokeWidth={3}
                name="감정 점수"
              />
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* 요일별 평균 */}
        <div>
          <h4 className="text-lg font-bold text-gray-800 mb-4">📅 요일별 평균 감정</h4>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={stats.weekdayAverage}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="day" />
              <YAxis domain={[0, 100]} />
              <Tooltip />
              <Legend />
              <Bar dataKey="average" fill="#8b5cf6" name="평균 점수" />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* 감정 분포 */}
        <div>
          <h4 className="text-lg font-bold text-gray-800 mb-4">🎭 감정 분포</h4>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={stats.emotionDistribution}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                outerRadius={100}
                fill="#8884d8"
                dataKey="value"
              >
                {stats.emotionDistribution.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* 인사이트 */}
      <div className="mt-8 p-4 bg-gradient-to-r from-yellow-50 to-amber-50 rounded-xl border border-yellow-200">
        <div className="flex items-start space-x-3">
          <div className="text-2xl">💡</div>
          <div>
            <h4 className="font-bold text-amber-900 mb-1">인사이트</h4>
            <p className="text-sm text-amber-800">
              {period === 'week' ? '최근 일주일' : '최근 한 달'} 동안 평균 {stats.avgScore}점의 감정을 기록하셨네요.
              {stats.avgScore >= 70 && ' 전반적으로 좋은 감정 상태를 유지하고 계시네요! 👍'}
              {stats.avgScore >= 50 && stats.avgScore < 70 && ' 안정적인 감정 상태를 유지하고 계시네요. 😊'}
              {stats.avgScore < 50 && ' 힘든 시기를 보내고 계시는 것 같아요. 필요하다면 주변에 도움을 요청하세요. 💙'}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default EmotionStats;
