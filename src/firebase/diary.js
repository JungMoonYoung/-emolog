import { collection, query, where, getDocs, orderBy, limit, doc, getDoc, updateDoc, deleteDoc } from 'firebase/firestore';
import { db } from './config';

// 통합 기록 가져오기 (Dashboard용 개수 제한 & WeeklyReport용 날짜 범위 모두 지원)
export const getAllRecords = async (userId, param1 = null, param2 = null) => {
  try {
    // 파라미터 확인: param1, param2가 모두 문자열이면 '날짜 범위' 검색으로 판단
    const isDateRange = (typeof param1 === 'string') && (typeof param2 === 'string');
    const limitCount = (typeof param1 === 'number') ? param1 : null;

    console.log(`📊 조회 모드: ${isDateRange ? '날짜 범위 검색' : (limitCount ? '개수 제한' : '전체 검색')}`);
    if (isDateRange) console.log(`📅 기간: ${param1} ~ ${param2}`);

    let emotionsQuery;
    let diariesQuery;

    // 1. emotions 쿼리 만들기
    if (isDateRange) {
      // 날짜 범위 검색 (WeeklyReport)
      emotionsQuery = query(
        collection(db, 'emotions'),
        where('userId', '==', userId),
        where('date', '>=', param1), // 시작일
        where('date', '<=', param2)  // 종료일
      );
    } else if (limitCount) {
      // 개수 제한 검색 (Dashboard)
      emotionsQuery = query(
        collection(db, 'emotions'),
        where('userId', '==', userId),
        orderBy('timestamp', 'desc'),
        limit(limitCount)
      );
    } else {
      // 전체 검색
      emotionsQuery = query(
        collection(db, 'emotions'),
        where('userId', '==', userId),
        orderBy('timestamp', 'desc')
      );
    }
    
    // 2. diaries 쿼리 만들기 (위와 동일한 로직)
    if (isDateRange) {
      diariesQuery = query(
        collection(db, 'diaries'),
        where('userId', '==', userId),
        where('date', '>=', param1),
        where('date', '<=', param2)
      );
    } else if (limitCount) {
      diariesQuery = query(
        collection(db, 'diaries'),
        where('userId', '==', userId),
        orderBy('timestamp', 'desc'),
        limit(limitCount)
      );
    } else {
      diariesQuery = query(
        collection(db, 'diaries'),
        where('userId', '==', userId),
        orderBy('timestamp', 'desc')
      );
    }

    // 3. 데이터 가져오기
    const [emotionsSnapshot, diariesSnapshot] = await Promise.all([
      getDocs(emotionsQuery),
      getDocs(diariesQuery)
    ]);

    const emotions = emotionsSnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data(),
      type: 'emotion'
    }));
    
    const diaries = diariesSnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data(),
      type: 'diary'
    }));

    console.log(`✅ 가져온 데이터: 감정 ${emotions.length}개, 일기 ${diaries.length}개`);

    // 4. 합치고 최신순 정렬
    const allRecords = [...emotions, ...diaries];
    allRecords.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));
    
    // 개수 제한일 경우에만 자르기 (날짜 검색일 때는 자르면 안 됨)
    const finalRecords = limitCount ? allRecords.slice(0, limitCount) : allRecords;
    
    return {
      success: true,
      records: finalRecords
    };
    
  } catch (error) {
    console.error('❌ getAllRecords 에러:', error);
    return {
      success: false,
      records: [],
      error: error.message
    };
  }
};

// --- 아래는 기존 함수들 (변경 없음) ---

// 일기만 가져오기
export const getUserDiaries = async (userId) => {
  try {
    const q = query(
      collection(db, 'diaries'),
      where('userId', '==', userId),
      orderBy('timestamp', 'desc')
    );
    
    const snapshot = await getDocs(q);
    const diaries = snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));
    
    return { success: true, diaries };
  } catch (error) {
    console.error('❌ getUserDiaries 에러:', error);
    return { success: false, diaries: [], error: error.message };
  }
};

// 감정만 가져오기
export const getUserEmotions = async (userId) => {
  try {
    const q = query(
      collection(db, 'emotions'),
      where('userId', '==', userId),
      orderBy('timestamp', 'desc')
    );
    
    const snapshot = await getDocs(q);
    const emotions = snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));
    
    return { success: true, emotions };
  } catch (error) {
    console.error('❌ getUserEmotions 에러:', error);
    return { success: false, emotions: [], error: error.message };
  }
};

// 특정 날짜의 기록 가져오기
export const getRecordsByDate = async (userId, date) => {
  try {
    const emotionsQuery = query(
      collection(db, 'emotions'),
      where('userId', '==', userId),
      where('date', '==', date)
    );
    const diariesQuery = query(
      collection(db, 'diaries'),
      where('userId', '==', userId),
      where('date', '==', date)
    );
    
    const [emSnap, diSnap] = await Promise.all([
      getDocs(emotionsQuery),
      getDocs(diariesQuery)
    ]);

    const emotions = emSnap.docs.map(doc => ({ id: doc.id, ...doc.data(), type: 'emotion' }));
    const diaries = diSnap.docs.map(doc => ({ id: doc.id, ...doc.data(), type: 'diary' }));
    
    const allRecords = [...emotions, ...diaries].sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));
    
    return { success: true, records: allRecords };
  } catch (error) {
    console.error('❌ getRecordsByDate 에러:', error);
    return { success: false, records: [], error: error.message };
  }
};

export const getRecordById = async (recordId, type) => {
  try {
    const collectionName = type === 'emotion' ? 'emotions' : 'diaries';
    const docRef = doc(db, collectionName, recordId);
    const docSnap = await getDoc(docRef);
    if (docSnap.exists()) {
      return { success: true, record: { id: docSnap.id, ...docSnap.data(), type } };
    } else {
      return { success: false, error: '기록을 찾을 수 없습니다.' };
    }
  } catch (error) {
    console.error('❌ getRecordById 에러:', error);
    return { success: false, error: error.message };
  }
};

export const updateRecord = async (recordId, type, updateData) => {
  try {
    const collectionName = type === 'emotion' ? 'emotions' : 'diaries';
    const docRef = doc(db, collectionName, recordId);
    await updateDoc(docRef, { ...updateData, updatedAt: new Date().toISOString() });
    return { success: true, message: '기록이 수정되었습니다.' };
  } catch (error) {
    console.error('❌ updateRecord 에러:', error);
    return { success: false, error: error.message };
  }
};

export const deleteRecord = async (recordId, type) => {
  try {
    const collectionName = type === 'emotion' ? 'emotions' : 'diaries';
    const docRef = doc(db, collectionName, recordId);
    await deleteDoc(docRef);
    return { success: true, message: '기록이 삭제되었습니다.' };
  } catch (error) {
    console.error('❌ deleteRecord 에러:', error);
    return { success: false, error: error.message };
  }
};