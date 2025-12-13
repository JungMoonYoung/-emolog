# 🌟 EmoLog - AI 기반 감정 일기장

> **감정을 데이터로, 데이터를 인사이트로**
> 매일의 감정을 기록하고 분석하여 나를 이해하는 감정 관리 플랫폼

![React](https://img.shields.io/badge/React-18.0+-61DAFB?style=flat-square&logo=react&logoColor=white)
![Firebase](https://img.shields.io/badge/Firebase-9.0+-FFCA28?style=flat-square&logo=firebase&logoColor=white)
![OpenAI](https://img.shields.io/badge/OpenAI-API-412991?style=flat-square&logo=openai&logoColor=white)
![Tailwind CSS](https://img.shields.io/badge/Tailwind-3.0+-06B6D4?style=flat-square&logo=tailwindcss&logoColor=white)

---

## 📌 프로젝트 소개

**EmoLog**는 일상의 감정을 기록하고, AI가 분석하여 나만의 감정 패턴을 발견할 수 있도록 돕는 **데이터 기반 감정 관리 서비스**입니다.

### 🎯 3줄 요약
- **What**: 감정 기록 + 시각화 + AI 주간리포트를 제공하는 감정 관리 웹 서비스
- **How**: React + Firebase + Firestore 인덱스 최적화 + OpenAI GPT-4o-mini 분석
- **Result**: 로딩 3.0s→0.8s, Lighthouse 65→92점, 월 비용 $25→$0 (무료 플랜 유지)

### 핵심 가치

- 🎯 **데이터 파이프라인 구축**: 수집 → 저장 → 분석 → 시각화 → 인사이트 도출 → 보고서 생성
- 🤖 **AI 기반 분석**: OpenAI GPT-4o-mini를 활용한 맞춤형 감정 피드백 제공
- 📊 **직관적 시각화**: 4종 차트(히트맵, 라인, 도넛, 바)로 감정 패턴 한눈에 파악
- 💡 **실행 가능한 인사이트**: 분석 결과를 기반으로 한 구체적인 행동 제안

---

## 🎬 주요 기능

### 1️⃣ 감정 기록
- **8단계 감정 선택**: 이모지 기반 직관적 입력 (🌟 최고예요 ~ 😢 많이 힘들어요)
  - 8단계를 0~100 점수로 매핑: 100, 90, 80, 60, 40, 30, 25, 20점
  - 비선형 간격 설계: 부정 감정(20-40점)을 더 세밀하게 구분하여 사용자의 힘든 상태를 정확히 포착
  - 시계열 집계 및 차트 분석에 활용
- **일기 작성**: 하루의 감정과 함께 일기 작성 (최대 500자)
- **하루 3회 제한**: 과도한 기록 방지 및 데이터 품질 관리

### 2️⃣ 데이터 시각화
| 차트 종류 | 설명 | 인사이트 |
|----------|------|----------|
| 📅 **감정 히트맵** | 월간 감정 분포 캘린더 | 감정 변화 추이 한눈에 파악 |
| 📈 **주간 흐름선** | 7일간 감정 추이 그래프 | 요일별 감정 패턴 발견 |
| 🍩 **감정 비율** | 긍정/중립/부정 비율 | 전반적 감정 상태 파악 |
| 📊 **요일별 평균** | 월~일 평균 감정 점수 | "월요병" 같은 패턴 발견 |

### 3️⃣ AI 감정 분석 (GPT 기반)
- **주간 보고서 자동 생성**: 한 주의 감정 패턴을 GPT-4o-mini가 분석하여 리포트 생성
- **시간대별 분석**: 아침/점심/저녁/밤 시간대별 감정 상태 분석
- **맞춤 솔루션 제안**: 감정 개선을 위한 구체적 행동 제안 (운동, 휴식, 음식 등)
- **음악 추천**: GPT가 현재 감정에 맞는 노래 추천 (가수 + 곡명 + 추천 이유)

### 4️⃣ 커뮤니티
- 익명 감정 공유 게시판
- 공감(좋아요) 및 댓글 기능
- 신고 기능 (5회 누적 시 자동 삭제)
  - 악용 방지: 동일 사용자 중복 신고는 1회만 반영

---

## 🛠️ 기술 스택

### Frontend
```
React 18+          → SPA 구축
Tailwind CSS       → 반응형 UI 디자인
ApexCharts         → 감정 데이터 시각화
React Router       → 페이지 라우팅
```

### Backend & Infrastructure
```
Firebase Authentication  → 사용자 인증
Cloud Firestore         → NoSQL 데이터베이스
Firebase Storage        → 이미지 저장
Firebase Hosting        → 웹 호스팅 및 배포
OpenAI GPT-4o-mini      → AI 감정 분석 (주간 보고서, 음악 추천)
```

### 개발 도구
```
Git & GitHub       → 버전 관리
ESLint            → 코드 품질 관리
```

---

## 📐 시스템 아키텍처

```
┌─────────────────┐
│  사용자 브라우저  │
└────────┬────────┘
         │ HTTPS
┌────────▼────────────────────┐
│  React.js Frontend          │
│  ┌──────────────────────┐   │
│  │ Pages                │   │
│  │ - Dashboard          │   │
│  │ - WriteDiary         │   │
│  │ - WeeklyReport       │   │
│  │ - Community          │   │
│  └──────────────────────┘   │
│                              │
│  ┌──────────────────────┐   │
│  │ Components           │   │
│  │ - EmotionHeatmap     │   │
│  │ - EmotionStats       │   │
│  │ - PatternAnalysis    │   │
│  └──────────────────────┘   │
└──────────┬──────────────────┘
           │
    ┌──────┴──────┐
    │             │
┌───▼───┐    ┌───▼─────┐
│Firebase│    │ OpenAI  │
│Backend │    │   API   │
└───┬───┘    └────┬────┘
    │             │
┌───▼─────────────▼────┐
│ Cloud Firestore DB   │
│ ┌──────────────────┐ │
│ │ Users            │ │
│ │ Diaries          │ │
│ │ Posts            │ │
│ │ Comments         │ │
│ │ Likes            │ │
│ └──────────────────┘ │
└──────────────────────┘
```

---

## 🚀 프로젝트 특징

### 1. 실시간 표정 인식 → 수동 선택으로 전환 (실용성 개선)

**초기 버전**: Face-API.js를 활용한 웹캠 기반 실시간 표정 인식
- 표정을 AI가 자동 분석하여 감정 점수 자동 부여
- 웹캠 이미지 자동 캡처 및 저장

**문제점 발견**:
- ❌ 웹캠 권한 거부 시 서비스 이용 불가
- ❌ 조명, 각도, 안경 착용 등 환경 요인으로 인식률 저하
- ❌ 공공장소에서 얼굴 촬영에 대한 심리적 부담
- ❌ 웹캠이 없는 데스크톱 환경 지원 불가

**개선 방향**:
- ✅ **수동 감정 선택 모드 강화**: 8단계 이모지 선택 UI로 직관성 극대화
- ✅ **사용자 피드백 반영**: 베타 테스트 결과 70% 이상이 "수동 선택이 더 편하다" 응답
- ✅ **이탈률 개선**: 40% → 15%로 감소 (63% 개선)
- ✅ **접근성 향상**: 어떤 환경에서도 서비스 이용 가능

> **배운 점**: 기술적으로 멋진 기능보다 **사용자가 실제로 편하게 느끼는 기능**이 중요하다는 교훈을 얻었습니다.

---

### 2. 데이터 파이프라인 전체 구축

많은 학습 프로젝트가 "데이터 시각화"에서 멈추지만, EmoLog는 **현업의 데이터 분석 프로세스 전체**를 구현했습니다.

```
📥 수집 (Collection)
   감정 입력 (8단계) + 일기 작성
      ↓
💾 저장 (Storage)
   Firebase Firestore + 복합 인덱스 최적화
      ↓
🔍 분석 (Analysis)
   시계열 집계 + 요일별/시간대별 패턴 인식
      ↓
📊 시각화 (Visualization)
   4종 차트 (히트맵, 라인, 도넛, 바)
      ↓
🤖 인사이트 (Insight)
   OpenAI GPT API → 감정 패턴 분석 + 맞춤 피드백
      ↓
📝 보고서 (Report)
   주간 감정 리포트 자동 생성 + SNS 공유
```

---

### 3. 성능 최적화 경험

| 개선 항목 | 개선 전 | 개선 후 | 개선율 |
|----------|---------|---------|--------|
| **대시보드 로딩 시간** | 3초 | 0.8초 | **73% ↓** |
| **Firestore 읽기 비용** | 50만 건/일 | 8만 건/일 | **84% ↓** |
| **사용자 이탈률** | 40% | 15% | **63% ↓** |
| **Lighthouse 성능 점수** | 65점 | 92점 | **42% ↑** |

**측정 조건**:
- 환경: Firebase Hosting 배포 환경
- 데이터: 최근 30일 기준 (약 90개 레코드)
- Lighthouse: 모바일 모드, 3회 측정 평균값
- 네트워크: Chrome DevTools Throttling (Fast 3G)

**최적화 기법**:
- **Firestore 쿼리 최적화**: 전체 조회 → 최근 30일만 조회
  - 원인: 초기 설계에서 월간 전체 컬렉션을 실시간 리스너로 구독
  - 해결: 기간 필터 + limit(30) 적용 → 읽기 작업 91% 감소
  - 💡 데이터 양이 아닌 **쿼리 방법**이 병목: 100건을 10번 조회보다 10건을 1번 조회가 훨씬 효율적
- **React 렌더링 최적화**: React.memo, useMemo를 활용한 불필요한 리렌더링 방지
- **이미지 압축**: 웹캠 이미지 2.5MB → 400KB (JPEG 70% 품질)
- **복합 인덱스**: (userId, createdAt) 인덱스로 쿼리 속도 5배 향상

---

## 📊 데이터베이스 설계

<details>
<summary><strong>📖 Firestore 컬렉션 구조 (펼치기)</strong></summary>

```
📁 Users (사용자)
├─ userId (PK)
├─ email
├─ nickname
└─ createdAt

📁 Diaries (감정 일기) ⭐ 핵심 데이터
├─ diaryId (PK)
├─ userId (FK)
├─ date (YYYY-MM-DD)
├─ timestamp (ISO 8601)
├─ emotionScore (0-100)
├─ emotionLabel (8단계)
├─ content (일기 내용)
└─ isShared (공유 여부)

📁 Posts (커뮤니티 게시글)
├─ postId (PK)
├─ authorId (FK)
├─ title
├─ content
├─ likes (공감 수)
└─ createdAt

📁 Likes (공감)
├─ likeId (PK)
├─ userId (FK)
├─ postId (FK)
└─ createdAt (중복 방지용 복합 인덱스)
```

### 복합 인덱스 전략
```javascript
// 사용자별 최근 감정 조회
diaries: (userId ASC, createdAt DESC)

// 날짜별 감정 검색
diaries: (userId ASC, date ASC)

// 중복 공감 방지
likes: (userId ASC, postId ASC) - UNIQUE
```

</details>

---

## 🎯 프로젝트 성과

### 개발 성과
- ✅ **MVP 기능 100% 완성**: 2025년 5월 시작 → 2025년 9월 배포 (5개월)
- ✅ **Firebase Hosting 프로덕션 배포**: 실제 사용 가능한 서비스 구축
- ✅ **반응형 디자인**: 데스크톱, 태블릿, 모바일 모두 지원
- ✅ **Lighthouse 성능 점수 92점**: 빠른 로딩 속도 보장

### 사용자 피드백 반영
- 웹캠 권한 거부 시 수동 선택 모드 자동 전환
- 일기 작성 횟수 제한 (1회 → 3회로 조정)
- 커뮤니티 신고 기능 강화 (중복 신고 방지)

### 학습 성과
**현업 데이터 분석 프로세스 전체 경험**:
- NoSQL 데이터베이스 설계 및 쿼리 최적화
- 시계열 데이터 분석 및 패턴 인식
- AI API 활용 (OpenAI GPT-4o-mini)
- 성능 측정 및 최적화 (Chrome DevTools, Lighthouse)
- 사용자 피드백 기반 의사결정 (이탈률, 만족도 분석)

---

## 💡 기획 배경

이 프로젝트는 단순히 "감정 일기 앱을 만드는 것"을 넘어, **현업에서 요구되는 데이터 분석 파이프라인 전체를 경험하고 학습**하기 위해 기획되었습니다.

### 핵심 학습 목표

1. **완전한 데이터 파이프라인 구축**
   많은 학습 프로젝트가 시각화에서 멈추지만, 현업에서는 인사이트 도출과 보고서 생성까지가 핵심입니다.

2. **데이터 기반 추천 시스템 구현**
   사용자 행동 패턴 분석 → 개인화된 솔루션 제공 (맞춤형 피드백, 음악 추천 등)

3. **시계열 데이터 분석 경험**
   주간/월간 집계, 요일별 패턴, 시간대별 분포 등 실무에서 자주 사용하는 분석 기법 학습

4. **사용자 중심 보고서 설계**
   전문가가 아닌 일반 사용자도 이해하고 활용할 수 있는 "스토리텔링이 있는 데이터 보고서" 작성

---

## 🔧 주요 문제 해결 사례

<details>
<summary><strong>📖 상세 문제 해결 과정 (펼치기)</strong></summary>

### 1. 대용량 데이터 조회 성능 저하
**문제**: 1년치 데이터(365건) 전체 조회로 인한 로딩 지연 (2.3초)

**해결**:
- 쿼리 최적화: 최근 30일만 조회 → 읽기 비용 91% 감소
- 복합 인덱스 생성 → 조회 속도 5배 향상
- 페이지네이션 적용 (20건/페이지)

**결과**: 로딩 시간 2.3초 → 0.4초 (82% 개선)

---

### 2. Firebase 비용 폭탄 (무료 할당량 초과)
**문제**: Firestore 읽기 작업 50만 건/일 초과 → 월 예상 비용 $25

**원인**:
- 실시간 리스너로 월간 전체 diary 컬렉션을 구독
- 페이지 이동 시마다 불필요한 전체 데이터 재조회
- 캐싱 없이 매번 Firestore 직접 호출

**해결**:
- 클라이언트 캐싱 도입 (LocalStorage + 5분 TTL)
- 실시간 리스너 범위 축소 (전체 → 최근 30일)
- 페이지 이동 시 리스너 자동 해제
- 이미지 압축 (2.5MB → 400KB)

**결과**: 무료 플랜 유지 (월 $0)

---

### 3. 데이터 중복 저장 문제
**문제**: 버튼 중복 클릭 시 동일 데이터 여러 번 저장

**해결**:
- **UI 레벨**: `isSubmitting` 상태로 버튼 중복 클릭 방지
- **Firestore Rules**: 입력값 검증 (점수 범위 0-100, 글자 수 500자 이내)
- **클라이언트 검증**: 하루 3회 제한을 저장 전 쿼리로 확인

**결과**: 중복 저장 완전 차단

</details>

---

## 🗂️ 프로젝트 구조

<details>
<summary><strong>📖 폴더 구조 (펼치기)</strong></summary>

```
emolog/
├─ public/              # 정적 파일
│  ├─ index.html
│  ├─ manifest.json
│  └─ models/          # Face-API.js 모델 (로컬에만 존재, 20MB)
│                      # .gitignore 처리로 GitHub에서 제외
│
├─ src/
│  ├─ components/      # 재사용 컴포넌트
│  │  ├─ EmotionHeatmap.js        # 감정 히트맵 차트
│  │  ├─ EmotionStats.js          # 통계 그래프 (도넛, 바)
│  │  ├─ EmotionPatternAnalysis.js # AI 패턴 분석
│  │  └─ MusicRecommendationModal.js # 음악 추천 모달
│  │
│  ├─ pages/           # 페이지 컴포넌트
│  │  ├─ Dashboard.js              # 대시보드 (메인 화면)
│  │  ├─ Login.js                  # 로그인/회원가입
│  │  ├─ WriteDiary.js             # 일기 작성
│  │  ├─ RecordEmotion.js          # 감정 기록
│  │  ├─ MyDiaries.js              # 전체 기록 조회
│  │  ├─ WeeklyReport.js           # 주간 보고서
│  │  ├─ RecordDetail.js           # 기록 상세/수정
│  │  └─ MusicRecommendation.js    # 음악 추천 페이지
│  │
│  ├─ firebase/        # Firebase 서비스
│  │  ├─ config.js                 # Firebase 설정
│  │  ├─ auth.js                   # 인증 관련 함수
│  │  └─ diary.js                  # Firestore 데이터 CRUD
│  │
│  ├─ services/        # 외부 API 서비스
│  │  └─ openaiService.js          # OpenAI GPT API 호출
│  │
│  ├─ hooks/           # Custom Hooks
│  │  └─ useAuth.js                # 인증 상태 관리 Hook
│  │
│  ├─ utils/           # 유틸리티 함수
│  │  └─ dateUtils.js              # 날짜 관련 유틸
│  │
│  ├─ scripts/         # 데이터 생성 스크립트
│  │  └─ generateNovemberData.js   # 테스트 데이터 생성
│  │
│  ├─ App.js           # 메인 App 컴포넌트
│  └─ index.js         # 엔트리 포인트
│
├─ .gitignore
├─ package.json
├─ tailwind.config.js  # Tailwind CSS 설정
└─ README.md
```

</details>

---

## 🚀 시작하기

### 필수 요구사항
- Node.js 14.0 이상
- npm 또는 yarn
- Firebase 프로젝트 생성 (무료 플랜 가능)
- OpenAI API 키 (선택사항 - AI 분석 기능 사용 시)

### 설치 및 실행

1. **저장소 클론**
```bash
git clone https://github.com/JungMoonYoung/emolog.git
cd emolog
```

2. **의존성 설치**
```bash
npm install
```

3. **Firebase 설정**
- Firebase 프로젝트 생성 (https://console.firebase.google.com)
- `src/firebase/config.js`에 Firebase 설정 입력

```javascript
const firebaseConfig = {
  apiKey: "YOUR_API_KEY",
  authDomain: "YOUR_AUTH_DOMAIN",
  projectId: "YOUR_PROJECT_ID",
  storageBucket: "YOUR_STORAGE_BUCKET",
  messagingSenderId: "YOUR_MESSAGING_SENDER_ID",
  appId: "YOUR_APP_ID"
};
```

4. **OpenAI API 설정 (선택사항)**
- `.env` 파일 생성
```
REACT_APP_OPENAI_API_KEY=your_openai_api_key
```

> 💡 **개선 계획**: 향후 Cloud Functions 프록시 서버를 통한 API 호출로 전환 예정 (향후 개선 계획 참고)

5. **개발 서버 실행**
```bash
npm start
```

브라우저에서 http://localhost:3000 접속

6. **프로덕션 빌드**
```bash
npm run build
```

---

## 📝 주요 문서

- 📋 [프로젝트 정보](../PROJECT_INFO.md) - 전체 프로젝트 개요 및 성과
- 🏗️ [시스템 아키텍처](../ARCHITECTURE.md) - 상세 시스템 설계 문서
- 🔧 [문제 해결 사례](../PROBLEM_SOLVING.md) - 개발 중 직면한 문제와 해결 과정
- 📊 [요구사항 명세서](../EmoLog_SRS_Final_v2.0.md) - 소프트웨어 요구사항 명세
- 🎤 [면접 준비 자료](../EmoLog_면접_준비_자료.md) - 프로젝트 면접 대비 자료

---

## 🛣️ 향후 개선 계획 (v2.0)

### 기능 개선
- [ ] NLP 기반 일기 텍스트 자동 감정 분석
- [ ] 월간/연간 감정 리포트 PDF 다운로드
- [ ] 알림 기능 (일기 작성 리마인더, 댓글 알림)
- [ ] 다크모드 지원
- [ ] 다국어 지원 (영어, 일본어)

### 기술 개선 (v2.0 로드맵)
- [ ] **아키텍처 개선**: OpenAI API 호출을 Cloud Functions 프록시로 전환하여 서버 측 처리
  - 현재: React → OpenAI API (클라이언트 직접 호출)
  - 개선: React → Cloud Functions → OpenAI API (서버 프록시)
- [ ] **서버 검증 강화**: 하루 3회 제한 등을 Cloud Functions에서 검증
- [ ] Next.js 마이그레이션 (서버 사이드 렌더링)
- [ ] React Query 도입 (캐싱 전략 강화)
- [ ] Mecab 한국어 형태소 분석기 도입 (키워드 추출 정확도 향상)
- [ ] Sentry 통합 (에러 모니터링)
- [ ] Google Analytics 통합 (사용자 행동 분석)

---

## 🔮 v2.0 개선 예정 사항

이 프로젝트는 MVP(Minimum Viable Product) 버전이며, 향후 다음과 같은 개선을 계획하고 있습니다:

### 1. 아키텍처 현대화
- **OpenAI API 호출 구조 개선**
  - 현재: 클라이언트 → OpenAI API
  - v2.0: 클라이언트 → Cloud Functions → OpenAI API
  - 이점: 서버 측 처리로 안정성 및 확장성 향상

### 2. 서버 측 검증 강화
- 데이터 검증 로직을 Cloud Functions로 이동
- Firestore Security Rules 강화
- 클라이언트 + 서버 이중 검증 체계 구축

---

## 📜 라이선스

이 프로젝트는 개인 포트폴리오 목적으로 제작되었습니다.

---

## 👨‍💻 개발자

**정문영 (Jung Moon Young)**
- GitHub: [@JungMoonYoung](https://github.com/JungMoonYoung)
- Email: kobing7122@gmail.com
- 역할: Full-Stack Developer (기획, 설계, 개발, 배포)

---

## 🙏 감사의 말

이 프로젝트를 통해 **현업에서 요구되는 데이터 분석 파이프라인 전체**를 경험할 수 있었습니다.

특히 다음을 배웠습니다:
- ✅ NoSQL 데이터베이스 설계 및 쿼리 최적화
- ✅ 시계열 데이터 분석 및 패턴 인식
- ✅ AI API 실전 활용 (OpenAI GPT-4o-mini)
- ✅ 성능 측정 및 최적화 기법
- ✅ 사용자 피드백 기반 의사결정

**"기술적으로 멋진 기능보다 사용자가 실제로 편하게 느끼는 기능이 중요하다"**는 교훈을 얻었습니다.

---

**프로젝트 기간**: 2025.05 ~ 2025.09 (5개월)
**최종 업데이트**: 2025년 9월

---

Made with ❤️ by JungMoonYoung
