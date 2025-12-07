// src/services/openaiService.js

const API_KEY = process.env.REACT_APP_OPENAI_API_KEY;

// 1. 주간 보고서 생성 함수
export const generateWeeklyReportGPT = async (records, stats, startDate, endDate) => {
  try {
    console.log("🤖 GPT에게 주간 보고서 요청 중...");

    const prompt = `
    당신은 따뜻한 심리 상담가입니다. ${startDate}부터 ${endDate}까지의 감정 데이터를 분석해주세요.
    
    [데이터]
    - 총 기록: ${stats.totalRecords}개
    - 평균 점수: ${stats.avgScore}점
    - 상세 기록: ${JSON.stringify(records)}

    반드시 아래 JSON 형식을 지켜주세요 (마크다운 없이):
    {
      "summary": {
        "title": "한 줄 제목",
        "overview": "3~4문장 요약",
        "weekTrend": "상승/하락/안정 중 택1"
      },
      "timeAnalysis": {
        "아침": { "analysis": "내용", "recommendations": ["추천1", "추천2"] },
        "점심": { "analysis": "내용", "recommendations": ["추천1", "추천2"] },
        "저녁": { "analysis": "내용", "recommendations": ["추천1", "추천2"] },
        "밤": { "analysis": "내용", "recommendations": ["추천1", "추천2"] }
      },
      "foodRecommendations": [
        { "timeOfDay": "점심", "foods": ["음식1"], "reason": "이유" }
      ],
      "actionRecommendations": [
        { "category": "운동", "actions": ["행동1"], "benefit": "효과" }
      ],
      "encouragement": "응원 메시지"
    }
    `;

    const result = await callGPT(prompt);
    return result;
  } catch (error) {
    console.error('GPT 보고서 오류:', error);
    throw error;
  }
};

// 2. 음악 추천 생성 함수 (RecordEmotion용)
export const generateMusicRecommendationGPT = async (emotionLabel, emotionScore, note) => {
  try {
    console.log("🎵 GPT에게 음악 추천 요청 중...");

    const prompt = `
    사용자가 방금 감정을 기록했습니다.
    - 감정: ${emotionLabel} (점수: ${emotionScore})
    - 메모: ${note || "없음"}

    이 사용자의 기분에 딱 맞는 노래 1곡을 추천하고 위로의 말을 건네주세요.
    반드시 아래 JSON 형식을 지켜주세요 (마크다운 없이):
    {
      "comment": "사용자의 감정에 공감하는 따뜻한 멘트 (2문장)",
      "music": {
        "title": "노래 제목",
        "artist": "가수 이름",
        "reason": "이 노래를 추천한 이유"
      }
    }
    `;

    const result = await callGPT(prompt);
    return result;
  } catch (error) {
    console.error('GPT 음악 추천 오류:', error);
    throw error;
  }
};

// (공통) GPT 호출 함수
async function callGPT(prompt) {
  if (!API_KEY) throw new Error("OpenAI API 키가 없습니다.");

  const response = await fetch('https://api.openai.com/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${API_KEY}`
    },
    body: JSON.stringify({
      model: 'gpt-4o-mini', // 가성비 모델 사용
      messages: [
        { role: 'system', content: 'You are a helpful assistant that responds in JSON format only.' },
        { role: 'user', content: prompt }
      ],
      temperature: 0.7
    })
  });

  const data = await response.json();
  if (!response.ok) throw new Error(data.error?.message || 'API 호출 실패');

  let content = data.choices[0].message.content;
  // 마크다운 제거
  content = content.replace(/```json/g, '').replace(/```/g, '').trim();
  
  return JSON.parse(content);
}