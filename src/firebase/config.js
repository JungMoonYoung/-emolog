import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: process.env.REACT_APP_FIREBASE_API_KEY,
  authDomain: process.env.REACT_APP_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.REACT_APP_FIREBASE_PROJECT_ID,
  storageBucket: process.env.REACT_APP_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.REACT_APP_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.REACT_APP_FIREBASE_APP_ID
};

console.log('🔥 Firebase 초기화 중...');

// Firebase 앱 초기화
const app = initializeApp(firebaseConfig);

// Auth와 Firestore 내보내기
export const auth = getAuth(app);
export const db = getFirestore(app);

console.log('✅ Firebase 초기화 완료!');
console.log('✅ Auth:', auth ? '정상' : '오류');
console.log('✅ DB:', db ? '정상' : '오류');
