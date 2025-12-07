import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { getAllRecords } from '../firebase/diary';
// ▼▼▼ Gemini 대신 GPT 서비스로 변경되었습니다 ▼▼▼
import { generateWeeklyReportGPT } from '../services/openaiService';

function WeeklyReport() {
  const { currentUser } = useAuth();
  const navigate = useNavigate();
  const [selectedPeriod, setSelectedPeriod] = useState('lastWeek');
  const [customStartDate, setCustomStartDate] = useState('');
  const [customEndDate, setCustomEndDate] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [report, setReport] = useState(null);

  const generateReport = async () => {
    setLoading(true);
    setError('');
    setReport(null);

    try {
      let startDate, endDate;

      // 기간 설정 로직
      if (selectedPeriod === 'lastWeek') {
        const today = new Date();
        endDate = today.toISOString().split('T')[0];
        const lastWeek = new Date(today);
        lastWeek.setDate(today.getDate() - 7);
        startDate = lastWeek.toISOString().split('T')[0];
      } else if (selectedPeriod === 'lastMonth') {
        const today = new Date();
        endDate = today.toISOString().split('T')[0];
        const lastMonth = new Date(today);
        lastMonth.setMonth(today.getMonth() - 1);
        startDate = lastMonth.toISOString().split('T')[0];
      } else {
        startDate = customStartDate;
        endDate = customEndDate;
      }

      if (!startDate || !endDate) {
        setError('날짜를 선택해주세요');
        setLoading(false);
        return;
      }

      console.log(`📅 보고서 생성 기간: ${startDate} ~ ${endDate}`);

      // Firebase에서 데이터 가져오기
      const result = await getAllRecords(currentUser.uid, startDate, endDate);
      
      if (result.success && result.records) {
        const records = result.records;
        
        if (records.length === 0) {
          setError('해당 기간에 기록된 감정이 없습니다.');
          setLoading(false);
          return;
        }

        console.log(`📊 총 ${records.length}개의 감정 기록 발견`);

        // 유효한 레코드 필터링
        const validRecords = records.filter(r => 
          r.emotionScore != null && 
          !isNaN(r.emotionScore) &&
          r.emotionScore >= 0 && 
          r.emotionScore <= 100
        );

        if (validRecords.length === 0) {
          setError('유효한 감정 점수가 없습니다');
          setLoading(false);
          return;
        }

        // 통계 계산
        const totalScore = validRecords.reduce((sum, r) => sum + (r.emotionScore || 0), 0);
        const avgScore = validRecords.length > 0 ? Math.round(totalScore / validRecords.length) : 0;

        const sortedByScore = [...validRecords].sort((a, b) => b.emotionScore - a.emotionScore);
        const bestMoments = sortedByScore.slice(0, 3);
        const worstMoments = sortedByScore.slice(-3).reverse();

        const stats = {
          totalRecords: validRecords.length,
          avgScore: avgScore,
          bestMoments: bestMoments,
          worstMoments: worstMoments
        };

        // ▼▼▼ GPT로 보고서 생성 호출 ▼▼▼
        console.log('🤖 GPT로 보고서 생성 중...');
        const reportData = await generateWeeklyReportGPT(validRecords, stats, startDate, endDate);
        
        setReport(reportData);
        console.log('✅ 보고서 생성 완료!');

      } else {
        throw new Error(result.error || '데이터를 불러오는데 실패했습니다.');
      }

    } catch (err) {
      console.error('❌ 보고서 생성 오류:', err);
      setError(err.message || '보고서 생성에 실패했습니다.');
    } finally {
      setLoading(false);
    }
  };

  const printReport = () => {
    window.print();
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 to-purple-100 p-8">
      <div className="max-w-6xl mx-auto">
        {/* 헤더 */}
        <div className="bg-white rounded-2xl shadow-xl p-6 mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-4xl font-bold text-gray-800 mb-2">
                📊 주간 감정 보고서
              </h1>
              <p className="text-gray-600 text-lg">
                   당신의 감정을 깊이 있게 분석합니다
              </p>
            </div>
            <button
              onClick={() => navigate('/dashboard')}
              className="px-6 py-3 bg-gray-200 hover:bg-gray-300 text-gray-700 font-semibold rounded-xl transition"
            >
              ← 돌아가기
            </button>
          </div>
        </div>

        {/* 기간 선택 */}
        <div className="bg-white rounded-2xl shadow-xl p-8 mb-8">
          <h2 className="text-2xl font-bold text-gray-800 mb-6">📅 분석 기간 선택</h2>
          
          <div className="space-y-4">
            <div className="grid grid-cols-3 gap-4">
              <button
                onClick={() => setSelectedPeriod('lastWeek')}
                className={`p-4 rounded-xl font-semibold transition ${
                  selectedPeriod === 'lastWeek'
                    ? 'bg-indigo-600 text-white shadow-lg'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                지난주
              </button>
              <button
                onClick={() => setSelectedPeriod('lastMonth')}
                className={`p-4 rounded-xl font-semibold transition ${
                  selectedPeriod === 'lastMonth'
                    ? 'bg-indigo-600 text-white shadow-lg'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                지난달
              </button>
              <button
                onClick={() => setSelectedPeriod('custom')}
                className={`p-4 rounded-xl font-semibold transition ${
                  selectedPeriod === 'custom'
                    ? 'bg-indigo-600 text-white shadow-lg'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                직접 선택
              </button>
            </div>

            {selectedPeriod === 'custom' && (
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    시작일
                  </label>
                  <input
                    type="date"
                    value={customStartDate}
                    onChange={(e) => setCustomStartDate(e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    종료일
                  </label>
                  <input
                    type="date"
                    value={customEndDate}
                    onChange={(e) => setCustomEndDate(e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                  />
                </div>
              </div>
            )}

            <button
              onClick={generateReport}
              disabled={loading}
              className="w-full bg-gradient-to-r from-indigo-600 to-purple-600 text-white py-4 rounded-xl font-bold text-lg hover:from-indigo-700 hover:to-purple-700 transition disabled:opacity-50 disabled:cursor-not-allowed shadow-lg"
            >
              {loading ? '🤖 분석 중...' : '🚀 보고서 생성하기'}
            </button>

            {error && (
              <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-lg">
                {error}
              </div>
            )}
          </div>
        </div>

        {/* 로딩 */}
        {loading && (
          <div className="bg-white rounded-2xl shadow-xl p-12 text-center">
            <div className="animate-spin rounded-full h-20 w-20 border-b-4 border-indigo-600 mx-auto mb-6"></div>
            <p className="text-2xl font-bold text-gray-700 mb-2">GPT가 깊이 분석 중...</p>
            <p className="text-gray-500">시간대별 패턴과 맞춤 추천을 준비하고 있어요</p>
          </div>
        )}

        {/* GPT 보고서 표시 */}
        {report && !loading && (
          <div className="bg-white rounded-2xl shadow-xl p-8 space-y-8">
            {/* 인쇄 버튼 */}
            <div className="flex justify-end print:hidden">
              <button
                onClick={printReport}
                className="bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-2 rounded-lg font-semibold transition flex items-center space-x-2"
              >
                <span>🖨️ 인쇄하기</span>
              </button>
            </div>

            {/* 제목 */}
            <div className="text-center border-b pb-6">
              <h2 className="text-4xl font-extrabold text-gray-900 mb-3">
                {report.summary.title}
              </h2>
              <p className="text-gray-600 text-lg">
                GPT 기반 감정 분석 보고서
              </p>
            </div>

            {/* 전체 요약 */}
            <div className="bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 p-10 rounded-2xl border-2 border-indigo-100 shadow-lg">
              <div className="text-center mb-6">
                <div className="text-6xl mb-4">📊</div>
                <h3 className="text-3xl font-extrabold text-gray-900 mb-4">
                  전체 요약
                </h3>
              </div>
              <p className="text-center text-gray-800 text-xl leading-relaxed mb-6 font-medium">
                {report.summary.overview}
              </p>
              <div className="flex justify-center">
                <span className={`inline-flex items-center px-8 py-4 rounded-full font-extrabold text-2xl shadow-xl ${
                  report.summary.weekTrend === '상승' ? 'bg-gradient-to-r from-green-500 to-emerald-600 text-white' :
                  report.summary.weekTrend === '하락' ? 'bg-gradient-to-r from-red-500 to-orange-600 text-white' :
                  'bg-gradient-to-r from-blue-500 to-indigo-600 text-white'
                }`}>
                  <span className="text-3xl mr-3">
                    {report.summary.weekTrend === '상승' && '📈'} 
                    {report.summary.weekTrend === '하락' && '📉'} 
                    {report.summary.weekTrend === '안정' && '➡️'}
                  </span>
                  {report.summary.weekTrend} 추세
                </span>
              </div>
            </div>

            {/* 시간대별 분석 */}
            <div className="bg-white p-10 rounded-2xl border-2 border-purple-100 shadow-lg">
              <div className="text-center mb-10">
                <div className="text-6xl mb-4">🕐</div>
                <h3 className="text-3xl font-extrabold text-gray-900 mb-2">
                  시간대별 감정 분석
                </h3>
                <p className="text-gray-600 text-lg">
                  GPT가 당신의 하루 패턴을 분석했어요
                </p>
              </div>

              <div className="space-y-8 max-w-5xl mx-auto">
                {['아침', '점심', '저녁', '밤'].map((time) => (
                  report.timeAnalysis[time] && (
                    <div key={time} className={`p-8 rounded-2xl border-2 shadow-md bg-gradient-to-br ${
                      time === '아침' ? 'from-yellow-50 to-orange-50 border-yellow-200' :
                      time === '점심' ? 'from-green-50 to-teal-50 border-green-200' :
                      time === '저녁' ? 'from-purple-50 to-pink-50 border-purple-200' :
                      'from-indigo-50 to-blue-50 border-indigo-200'
                    }`}>
                      <div className="flex items-center mb-6">
                        <div className="text-5xl mr-4">
                          {time === '아침' ? '🌅' : time === '점심' ? '☀️' : time === '저녁' ? '🌆' : '🌙'}
                        </div>
                        <h4 className="text-2xl font-extrabold text-gray-800">{time}</h4>
                      </div>
                      <p className="text-gray-800 text-lg leading-relaxed mb-6 font-medium">
                        {report.timeAnalysis[time].analysis}
                      </p>
                      <div className="bg-white p-6 rounded-xl">
                        <p className="font-bold text-gray-700 mb-4 text-lg">💡 맞춤 추천</p>
                        <ul className="space-y-3">
                          {report.timeAnalysis[time].recommendations.map((rec, idx) => (
                            <li key={idx} className="flex items-start">
                              <span className="text-indigo-500 text-xl mr-3 flex-shrink-0">•</span>
                              <span className="text-gray-800">{rec}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  )
                ))}
              </div>
            </div>

            {/* 음식 추천 */}
            {report.foodRecommendations && report.foodRecommendations.length > 0 && (
              <div className="bg-gradient-to-br from-pink-50 to-red-50 p-10 rounded-2xl border-2 border-pink-200 shadow-lg">
                <div className="text-center mb-8">
                  <div className="text-6xl mb-4">🍽️</div>
                  <h3 className="text-3xl font-extrabold text-gray-900">
                    맞춤 음식 추천
                  </h3>
                </div>
                <div className="space-y-6 max-w-4xl mx-auto">
                  {report.foodRecommendations.map((food, idx) => (
                    <div key={idx} className="bg-white p-8 rounded-xl shadow-md">
                      <h4 className="font-extrabold text-pink-700 text-xl mb-4">
                        {food.timeOfDay} 추천
                      </h4>
                      <div className="flex flex-wrap gap-3 mb-4">
                        {food.foods.map((item, i) => (
                          <span key={i} className="bg-pink-100 text-pink-700 px-4 py-2 rounded-full font-semibold text-lg">
                            {item}
                          </span>
                        ))}
                      </div>
                      <p className="text-gray-700 text-lg">{food.reason}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* 행동 추천 */}
            {report.actionRecommendations && report.actionRecommendations.length > 0 && (
              <div className="bg-gradient-to-br from-cyan-50 to-blue-50 p-10 rounded-2xl border-2 border-cyan-200 shadow-lg">
                <div className="text-center mb-8">
                  <div className="text-6xl mb-4">🎯</div>
                  <h3 className="text-3xl font-extrabold text-gray-900">
                    실천 행동 추천
                  </h3>
                </div>
                <div className="space-y-6 max-w-4xl mx-auto">
                  {report.actionRecommendations.map((action, idx) => (
                    <div key={idx} className="bg-white p-8 rounded-xl shadow-md">
                      <h4 className="font-extrabold text-cyan-700 text-xl mb-4">
                        {action.category}
                      </h4>
                      <ul className="space-y-3 mb-4">
                        {action.actions.map((item, i) => (
                          <li key={i} className="flex items-start">
                            <span className="text-cyan-500 text-xl mr-3 flex-shrink-0">✓</span>
                            <span className="text-gray-800 text-lg">{item}</span>
                          </li>
                        ))}
                      </ul>
                      <div className="bg-cyan-50 p-4 rounded-lg">
                        <p className="text-cyan-800 font-medium">
                          <span className="font-bold">효과:</span> {action.benefit}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* 격려 메시지 */}
            <div className="bg-gradient-to-br from-pink-200 via-purple-200 to-indigo-200 p-12 rounded-2xl text-center border-2 border-purple-300 shadow-2xl">
              <div className="text-8xl mb-8">💖</div>
              <h3 className="text-3xl font-extrabold text-gray-900 mb-6">
                응원의 메시지
              </h3>
              <p className="text-gray-900 font-extrabold text-2xl leading-relaxed max-w-4xl mx-auto">
                {report.encouragement}
              </p>
            </div>

            {/* GPT 정보 */}
            <div className="bg-gray-50 p-6 rounded-xl text-center border border-gray-200">
              <p className="text-gray-600 text-sm">
                🤖 이 보고서는 OpenAI GPT-4o-mini가 당신의 감정 데이터를 분석하여 생성했습니다
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default WeeklyReport;