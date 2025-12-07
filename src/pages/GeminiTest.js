import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { GoogleGenerativeAI } from "@google/generative-ai";

function GeminiTest() {
  const navigate = useNavigate();
  const [prompt, setPrompt] = useState('안녕하세요! 당신은 누구인가요?');
  const [response, setResponse] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const testGemini = async () => {
    setLoading(true);
    setError('');
    setResponse('');

    try {
      console.log('✨ Gemini API 호출 시작...');
      
      const apiKey = process.env.REACT_APP_GEMINI_API_KEY;
      
      if (!apiKey) {
        throw new Error('Gemini API 키가 설정되지 않았습니다. .env 파일을 확인해주세요.');
      }

      // 1. GoogleGenerativeAI 인스턴스 생성
      const genAI = new GoogleGenerativeAI(apiKey);

      // 2. 모델 설정 (무료로 빠르고 성능 좋은 gemini-1.5-flash 사용)
    
     const model = genAI.getGenerativeModel({ 
        model: "gemini-1.5-flash"
      });

      // 3. 텍스트 생성 요청
      const fullPrompt = `당신은 친절하고 따뜻한 감정 상담 AI입니다. 다음 질문에 대해 한국어로 답변해주세요: ${prompt}`;
      
      const result = await model.generateContent(fullPrompt);
      const responseText = result.response.text();

      console.log('✅ Gemini 응답 성공:', responseText);
      setResponse(responseText);

    } catch (err) {
      console.error('❌ Gemini API 오류:', err);
      setError('오류가 발생했습니다: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-blue-50 to-indigo-100 p-8">
      <div className="max-w-4xl mx-auto">
        {/* 헤더 */}
        <div className="bg-white rounded-2xl shadow-xl p-6 mb-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-800 mb-2">
                ✨ Google Gemini API 테스트
              </h1>
              <p className="text-gray-600">
                Gemini 1.5 Flash 모델 연결 (무료)
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

        {/* 테스트 영역 */}
        <div className="bg-white rounded-2xl shadow-xl p-8">
          {/* 프롬프트 입력 */}
          <div className="mb-6">
            <label className="block text-lg font-bold text-gray-800 mb-3">
              📝 Gemini에게 질문하기
            </label>
            <textarea
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              className="w-full h-32 px-4 py-3 border-2 border-indigo-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none resize-none text-gray-700"
              placeholder="상담 내용을 입력해보세요..."
            />
          </div>

          {/* 테스트 버튼 */}
          <button
            onClick={testGemini}
            disabled={loading || !prompt.trim()}
            className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 text-white py-4 rounded-xl font-bold text-lg hover:from-blue-700 hover:to-indigo-700 transition disabled:opacity-50 disabled:cursor-not-allowed shadow-lg"
          >
            {loading ? (
              <div className="flex items-center justify-center space-x-3">
                <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-white"></div>
                <span>Gemini 생각 중...</span>
              </div>
            ) : (
              '✨ Gemini에게 물어보기'
            )}
          </button>

          {/* 에러 표시 */}
          {error && (
            <div className="mt-6 bg-red-50 border-2 border-red-200 rounded-xl p-6">
              <div className="flex items-start space-x-3">
                <div className="text-3xl">❌</div>
                <div>
                  <h3 className="font-bold text-red-700 text-lg mb-2">오류 발생</h3>
                  <p className="text-red-600">{error}</p>
                </div>
              </div>
            </div>
          )}

          {/* 응답 */}
          {response && (
            <div className="mt-6 bg-gradient-to-br from-blue-50 to-indigo-50 border-2 border-blue-200 rounded-xl p-6">
              <div className="flex items-start space-x-3">
                <div className="text-3xl">✨</div>
                <div className="flex-1">
                  <h3 className="font-bold text-indigo-700 text-lg mb-3">Gemini 답변</h3>
                  <div className="bg-white p-6 rounded-xl shadow-sm">
                    <p className="text-gray-800 leading-relaxed whitespace-pre-wrap">{response}</p>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default GeminiTest;