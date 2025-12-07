import { 
  createUserWithEmailAndPassword, 
  signInWithEmailAndPassword,
  signOut,
  updateProfile,
  GoogleAuthProvider,     // 추가됨
  signInWithPopup,        // 추가됨
  sendEmailVerification   // 추가됨
} from 'firebase/auth';
import { doc, setDoc, getDoc } from 'firebase/firestore'; // getDoc 추가됨
import { auth, db } from './config';

// 1. 회원가입 함수 (이메일 인증 발송 추가)
export const signupUser = async (email, password, nickname) => {
  try {
    // 사용자 생성
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    const user = userCredential.user;

    // 프로필 업데이트
    await updateProfile(user, { displayName: nickname });

    // Firestore에 저장
    await setDoc(doc(db, 'users', user.uid), {
      email: email,
      nickname: nickname,
      createdAt: new Date().toISOString(),
      authProvider: 'email'
    });

    // ★ 이메일 인증 메일 발송
    await sendEmailVerification(user);
    console.log('📧 인증 메일 발송 완료');

    return { success: true, user, message: '인증 메일이 발송되었습니다. 이메일을 확인해주세요!' };
  } catch (error) {
    console.error('❌ 회원가입 실패:', error);
    let errorMessage = '회원가입에 실패했습니다.';
    if (error.code === 'auth/email-already-in-use') errorMessage = '이미 사용 중인 이메일입니다.';
    if (error.code === 'auth/weak-password') errorMessage = '비밀번호는 6자 이상이어야 합니다.';
    return { success: false, error: errorMessage };
  }
};

// 2. 구글 로그인 함수 (새로 추가됨!)
export const loginWithGoogle = async () => {
  try {
    const provider = new GoogleAuthProvider();
    const result = await signInWithPopup(auth, provider);
    const user = result.user;

    // Firestore에 유저 정보가 있는지 확인
    const userDocRef = doc(db, 'users', user.uid);
    const userSnapshot = await getDoc(userDocRef);

    // 처음 로그인하는 유저라면 Firestore에 정보 저장
    if (!userSnapshot.exists()) {
      await setDoc(userDocRef, {
        email: user.email,
        nickname: user.displayName, // 구글 닉네임 사용
        createdAt: new Date().toISOString(),
        authProvider: 'google'
      });
    }

    console.log('✅ 구글 로그인 성공:', user.uid);
    return { success: true, user };
  } catch (error) {
    console.error('❌ 구글 로그인 실패:', error);
    return { success: false, error: '구글 로그인 중 오류가 발생했습니다.' };
  }
};

// 3. 이메일 로그인 함수 (인증 여부 체크 로직은 선택 사항)
export const loginUser = async (email, password) => {
  try {
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    const user = userCredential.user;
    
    // 이메일 인증 확인 (선택 사항: 강제하려면 주석 해제)
    /*
    if (!user.emailVerified) {
      return { success: false, error: '이메일 인증이 완료되지 않았습니다. 메일함을 확인해주세요.' };
    }
    */

    console.log('✅ 로그인 성공:', user.uid);
    return { success: true, user };
  } catch (error) {
    console.error('❌ 로그인 실패:', error);
    let errorMessage = '로그인에 실패했습니다.';
    if (error.code === 'auth/invalid-credential') errorMessage = '이메일 또는 비밀번호가 틀렸습니다.';
    return { success: false, error: errorMessage };
  }
};

// 4. 로그아웃 함수
export const logoutUser = async () => {
  try {
    await signOut(auth);
    return { success: true };
  } catch (error) {
    return { success: false, error: error.message };
  }
};