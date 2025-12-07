import React, { useState, useEffect } from 'react';
import { useAuth } from '../hooks/useAuth';
import { getAllRecords } from '../firebase/diary';

function EmotionPatternAnalysis() {
  const { currentUser } = useAuth();
  const [analysis, setAnalysis] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    analyzePatterns();
  }, []);

  const analyzePatterns = async () => {
    setLoading(true);
    
    try {
      const result = await getAllRecords(currentUser.uid);
      
      if (!result.success || result.records.length === 0) {
        setLoading(false);
        return;
      }

      const records = result.records;

      // 유효한 레코드만 필터링
      const validRecords = records.filter(r => 
        r.emotionScore != null && 
        !isNaN(r.emotionScore) && 
        r.emotionScore >= 0 && 
        r.emotionScore <= 100
      );

      if (validRecords.length === 0) {
        setLoading(false);
        return;
      }

      // 기본 통계 분석 (안전하게!)
      const totalScore = validRecords.reduce((sum, r) => sum + (r.emotionScore || 0), 0);
      const avgScore = validRecords.length > 0 ? Math.round(totalScore / validRecords.length) : 0;

      // 요일별 분석 (안전하게!)
      const dayOfWeekStats = {};
      const dayNames = ['일요일', '월요일', '화요일', '수요일', '목요일', '금요일', '토요일'];
      
      validRecords.forEach(record => {
        const date = new Date(record.timestamp);
        const dayIndex = date.getDay();
        const dayName = dayNames[dayIndex];
        
        if (!dayOfWeekStats[dayName]) {
          dayOfWeekStats[dayName] = { sum: 0, count: 0 };
        }
        dayOfWeekStats[dayName].sum += (record.emotionScore || 0);
        dayOfWeekStats[dayName].count += 1;
      });

      const dayAverages = Object.entries(dayOfWeekStats).map(([day, stats]) => ({
        name: day,
        score: stats.count > 0 ? Math.round(stats.sum / stats.count) : 0,
        count: stats.count
      }));

      const sortedDays = [...dayAverages].sort((a, b) => b.score - a.score);
      const bestDay = sortedDays[0] || { name: '데이터 없음', score: 0, count: 0 };
      const worstDay = sortedDays[sortedDays.length - 1] || { name: '데이터 없음', score: 0, count: 0 };

      // 최근 추세 분석 (안전하게!)
      const recentRecords = validRecords.slice(0, Math.min(10, validRecords.length));
      const oldRecords = validRecords.slice(10, Math.min(20, validRecords.length));
      
      const recentAvg = recentRecords.length > 0
        ? recentRecords.reduce((sum, r) => sum + (r.emotionScore || 0), 0) / recentRecords.length
        : avgScore;
      const oldAvg = oldRecords.length > 0 
        ? oldRecords.reduce((sum, r) => sum + (r.emotionScore || 0), 0) / oldRecords.length 
        : recentAvg;

      const trend = recentAvg > oldAvg + 5 ? 'improving' : 
                    recentAvg < oldAvg - 5 ? 'declining' : 'stable';

      // 가장 흔한 감정 (안전하게!)
      const emotionCounts = {};
      validRecords.forEach(r => {
        const emotion = r.emotionLabel || '알 수 없음';
        emotionCounts[emotion] = (emotionCounts[emotion] || 0) + 1;
      });
      
      const emotionEntries = Object.entries(emotionCounts);
      const mostCommon = emotionEntries.length > 0
        ? emotionEntries.sort((a, b) => b[1] - a[1])[0]
        : ['알 수 없음', 0];

      // 통계 기반 인사이트 생성 (안전하게!)
      const statisticalAnalysis = {
        mainInsight: trend === 'improving' 
          ? "최근 감정이 개선되고 있어요!"
          : trend === 'declining'
          ? "최근 감정 관리가 필요해 보여요"
          : "안정적인 감정 상태를 유지하고 있어요",
        
        detailedAnalysis: `전체 평균 감정 점수는 ${avgScore}점이며, 가장 많이 느낀 감정은 "${mostCommon[0]}"입니다. ${bestDay.name}에 가장 좋은 컨디션(${bestDay.score}점)을 보이고 있습니다.`,
        
        strengths: [
          "꾸준한 감정 기록을 통해 자기 인식을 높이고 있습니다",
          bestDay.score > 0 ? `${bestDay.name}에 좋은 감정 상태를 유지하고 있습니다` : "긍정적인 마음가짐을 유지하고 있습니다"
        ],
        
        concerns: worstDay.score < 60 
          ? [`${worstDay.name}의 감정 관리에 주의가 필요합니다`, "스트레스 관리 방법을 찾아보세요"]
          : ["전반적으로 양호한 상태입니다", "현재의 패턴을 유지해보세요"],
        
        recommendations: [
          {
            title: "규칙적인 일상",
            description: "매일 비슷한 시간에 기상하고 취침하여 생체 리듬을 안정화하세요"
          },
          {
            title: "스트레스 관리",
            description: worstDay.score < 60 
              ? `${worstDay.name}에 휴식 시간을 더 가지세요`
              : "현재의 좋은 습관을 유지하세요"
          }
        ],
        
        encouragement: trend === 'improving'
          ? "계속해서 잘하고 있어요! 긍정적인 변화가 보입니다."
          : trend === 'declining'
          ? "힘든 시기도 지나갑니다. 자신을 돌보는 시간을 가지세요."
          : "안정적인 감정 관리를 하고 있어요. 계속 유지해보세요!"
      };

      setAnalysis({
        basic: {
          totalRecords: validRecords.length,
          avgScore: avgScore,
          bestDay: bestDay,
          worstDay: worstDay,
          trend: trend,
          mostCommon: { label: mostCommon[0], count: mostCommon[1] }
        },
        ai: statisticalAnalysis
      });

    } catch (error) {
      console.error('패턴 분석 오류:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="bg-white rounded-2xl shadow-xl p-12">
        <div className="text-center py-12">
          <div className="animate-spin rounded-full h-20 w-20 border-b-4 border-indigo-600 mx-auto mb-6"></div>
          <p className="text-2xl font-bold text-gray-700">분석 중...</p>
          <p className="text-gray-500 mt-2">잠시만 기다려주세요</p>
        </div>
      </div>
    );
  }

  if (!analysis) {
    return (
      <div className="bg-white rounded-2xl shadow-xl p-12">
        <div className="text-center py-12">
          <div className="text-8xl mb-6">📊</div>
          <p className="text-2xl font-bold text-gray-800 mb-2">
            충분한 기록이 쌓이면 패턴 분석을 제공합니다
          </p>
          <p className="text-gray-600">
            감정을 꾸준히 기록해보세요!
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* 기본 통계 */}
      <div className="bg-white rounded-2xl shadow-xl p-8 border border-gray-100">
        <div className="text-center mb-8">
          <div className="text-7xl mb-6 animate-bounce">📊</div>
          <h3 className="text-4xl font-extrabold text-gray-900 mb-3">
            감정 패턴 분석
          </h3>
          <p className="text-gray-600 text-lg">
            당신의 감정 데이터를 분석했어요
          </p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-8 max-w-5xl mx-auto">
          <div className="bg-gradient-to-br from-blue-50 via-blue-100 to-indigo-100 p-8 rounded-2xl text-center border-2 border-blue-200 shadow-lg hover:shadow-xl transition transform hover:scale-105">
            <div className="text-5xl font-extrabold text-blue-700 mb-3">{analysis.basic.totalRecords}</div>
            <div className="text-base text-gray-700 font-bold">총 기록</div>
          </div>
          <div className="bg-gradient-to-br from-green-50 via-green-100 to-emerald-100 p-8 rounded-2xl text-center border-2 border-green-200 shadow-lg hover:shadow-xl transition transform hover:scale-105">
            <div className="text-5xl font-extrabold text-green-700 mb-3">{analysis.basic.avgScore}</div>
            <div className="text-base text-gray-700 font-bold">평균 점수</div>
          </div>
          <div className="bg-gradient-to-br from-purple-50 via-purple-100 to-pink-100 p-8 rounded-2xl text-center border-2 border-purple-200 shadow-lg hover:shadow-xl transition transform hover:scale-105">
            <div className="text-5xl font-extrabold text-purple-700 mb-3">{analysis.basic.bestDay.name}</div>
            <div className="text-base text-gray-700 font-bold">베스트 요일</div>
          </div>
          <div className="bg-gradient-to-br from-orange-50 via-orange-100 to-red-100 p-8 rounded-2xl text-center border-2 border-orange-200 shadow-lg hover:shadow-xl transition transform hover:scale-105">
            <div className="text-5xl font-extrabold text-orange-700 mb-3">{analysis.basic.mostCommon.label}</div>
            <div className="text-base text-gray-700 font-bold">최다 감정</div>
          </div>
        </div>

        {/* 추세 */}
        <div className="bg-gradient-to-r from-indigo-100 via-purple-100 to-pink-100 p-8 rounded-2xl mb-4 max-w-3xl mx-auto border-2 border-indigo-200 shadow-lg">
          <div className="flex flex-col md:flex-row items-center justify-between space-y-4 md:space-y-0">
            <span className="font-extrabold text-gray-800 text-2xl">감정 추세</span>
            <span className={`px-8 py-4 rounded-full text-xl font-extrabold shadow-xl ${
              analysis.basic.trend === 'improving' ? 'bg-gradient-to-r from-green-500 to-emerald-600 text-white' :
              analysis.basic.trend === 'declining' ? 'bg-gradient-to-r from-red-500 to-orange-600 text-white' :
              'bg-gradient-to-r from-blue-500 to-indigo-600 text-white'
            }`}>
              {analysis.basic.trend === 'improving' ? '📈 개선 중' :
               analysis.basic.trend === 'declining' ? '📉 주의 필요' :
               '➡️ 안정적'}
            </span>
          </div>
        </div>
      </div>

      {/* 통계 기반 인사이트 */}
      {analysis.ai && (
        <div className="bg-white rounded-2xl shadow-xl p-8 border border-gray-100">
          <div className="text-center mb-8">
            <div className="text-7xl mb-6">💡</div>
            <h3 className="text-4xl font-extrabold text-gray-900">
              통계 분석
            </h3>
          </div>

          {/* 핵심 인사이트 */}
          <div className="bg-gradient-to-br from-blue-100 via-indigo-100 to-purple-100 p-10 rounded-2xl mb-6 max-w-4xl mx-auto border-2 border-blue-200 shadow-xl">
            <div className="text-center">
              <div className="text-6xl mb-6">📌</div>
              <h4 className="font-extrabold text-indigo-800 text-2xl mb-6">핵심 인사이트</h4>
              <p className="text-gray-800 text-xl leading-relaxed font-medium">{analysis.ai.mainInsight}</p>
            </div>
          </div>

          {/* 상세 분석 */}
          <div className="bg-gradient-to-br from-gray-100 via-slate-100 to-zinc-100 p-10 rounded-2xl mb-6 max-w-4xl mx-auto border-2 border-gray-300 shadow-xl">
            <div className="text-center">
              <div className="text-6xl mb-6">📝</div>
              <h4 className="font-extrabold text-gray-900 text-2xl mb-6">상세 분석</h4>
              <p className="text-gray-800 text-xl leading-relaxed font-medium">{analysis.ai.detailedAnalysis}</p>
            </div>
          </div>

          {/* 강점 */}
          <div className="bg-gradient-to-br from-green-100 via-emerald-100 to-teal-100 p-10 rounded-2xl mb-6 max-w-4xl mx-auto border-2 border-green-300 shadow-xl">
            <div className="text-center mb-8">
              <div className="text-7xl mb-6">💪</div>
              <h4 className="font-extrabold text-green-800 text-2xl">강점</h4>
            </div>
            <ul className="space-y-5">
              {analysis.ai.strengths.map((strength, idx) => (
                <li key={idx} className="flex items-start text-xl text-gray-800 bg-white p-6 rounded-xl shadow-md">
                  <span className="text-green-600 text-3xl mr-4 flex-shrink-0">✓</span>
                  <span className="font-medium">{strength}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* 주의사항 */}
          <div className="bg-gradient-to-br from-orange-100 via-red-100 to-pink-100 p-10 rounded-2xl mb-6 max-w-4xl mx-auto border-2 border-orange-300 shadow-xl">
            <div className="text-center mb-8">
              <div className="text-7xl mb-6">⚠️</div>
              <h4 className="font-extrabold text-orange-800 text-2xl">주의사항</h4>
            </div>
            <ul className="space-y-5">
              {analysis.ai.concerns.map((concern, idx) => (
                <li key={idx} className="flex items-start text-xl text-gray-800 bg-white p-6 rounded-xl shadow-md">
                  <span className="text-orange-600 text-3xl mr-4 flex-shrink-0">•</span>
                  <span className="font-medium">{concern}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* 추천사항 */}
          <div className="space-y-6 mb-6 max-w-4xl mx-auto">
            <div className="text-center mb-8">
              <div className="text-7xl mb-6">💡</div>
              <h4 className="font-extrabold text-gray-900 text-2xl">추천사항</h4>
            </div>
            {analysis.ai.recommendations.map((rec, idx) => (
              <div key={idx} className="bg-gradient-to-br from-indigo-100 via-purple-100 to-pink-100 p-8 rounded-2xl border-2 border-indigo-300 shadow-xl">
                <h5 className="font-extrabold text-indigo-800 mb-4 text-2xl text-center">{rec.title}</h5>
                <p className="text-gray-800 bg-white p-6 rounded-xl text-center text-lg font-medium shadow-md">{rec.description}</p>
              </div>
            ))}
          </div>

          {/* 격려 메시지 */}
          <div className="bg-gradient-to-br from-pink-200 via-purple-200 to-indigo-200 p-12 rounded-2xl text-center max-w-4xl mx-auto border-2 border-purple-300 shadow-2xl">
            <div className="text-8xl mb-8">💖</div>
            <p className="text-gray-900 font-extrabold text-2xl leading-relaxed">{analysis.ai.encouragement}</p>
          </div>
        </div>
      )}
    </div>
  );
}

export default EmotionPatternAnalysis;
