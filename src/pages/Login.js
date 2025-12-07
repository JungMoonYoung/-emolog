import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { loginUser, loginWithGoogle } from '../firebase/auth'; // ★ 우리가 만든 auth.js 함수 사용

function Login() {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // 1. 이메일 로그인 처리
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    
    if (!email || !password) {
      setError('이메일과 비밀번호를 입력해주세요.');
      return;
    }

    setLoading(true);

    // auth.js에 만들어둔 loginUser 함수 사용
    const result = await loginUser(email, password);

    if (result.success) {
      // 로그인 성공 시 토큰 저장 및 이동
      const token = await result.user.getIdToken();
      localStorage.setItem('token', token);
      console.log('✅ 로그인 성공 & 토큰 저장 완료');
      navigate('/dashboard');
    } else {
      setError(result.error);
    }
    
    setLoading(false);
  };

  // 2. ★ 구글 로그인 처리 (새로 추가된 부분)
  const handleGoogleLogin = async () => {
    setError('');
    setLoading(true);

    // auth.js에 만들어둔 loginWithGoogle 함수 사용
    const result = await loginWithGoogle();

    if (result.success) {
      const token = await result.user.getIdToken();
      localStorage.setItem('token', token);
      console.log('✅ 구글 로그인 성공 & 토큰 저장 완료');
      navigate('/dashboard');
    } else {
      setError(result.error);
    }

    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-100 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-2xl p-8 w-full max-w-md">
        <div className="text-center mb-8">
          <div className="text-6xl mb-4">🎭</div>
          <h1 className="text-3xl font-bold text-gray-800 mb-2">로그인</h1>
          <p className="text-gray-600">감정 일기에 오신 것을 환영합니다</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* 이메일 */}
          <div>
            <label className="block text-sm font-bold text-gray-700 mb-2">
              이메일
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition"
              placeholder="example@email.com"
              disabled={loading}
            />
          </div>

          {/* 비밀번호 */}
          <div>
            <label className="block text-sm font-bold text-gray-700 mb-2">
              비밀번호
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition"
              placeholder="비밀번호를 입력하세요"
              disabled={loading}
            />
          </div>

          {/* 오류 메시지 */}
          {error && (
            <div className="bg-red-50 border-2 border-red-200 text-red-600 px-4 py-3 rounded-xl text-center">
              {error}
            </div>
          )}

          {/* 이메일 로그인 버튼 */}
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-gradient-to-r from-indigo-600 to-purple-600 text-white py-4 rounded-xl font-bold text-lg hover:from-indigo-700 hover:to-purple-700 transition-all shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? '로그인 중...' : '로그인 🚀'}
          </button>
        </form>

        {/* 구분선 */}
        <div className="my-6 flex items-center">
          <div className="flex-grow border-t border-gray-300"></div>
          <span className="mx-4 text-gray-500 text-sm">또는</span>
          <div className="flex-grow border-t border-gray-300"></div>
        </div>

        {/* ★ 구글 로그인 버튼 (추가됨) */}
        <button
          type="button"
          onClick={handleGoogleLogin}
          disabled={loading}
          className="w-full flex items-center justify-center gap-3 bg-white border-2 border-gray-200 text-gray-700 py-4 rounded-xl font-bold text-lg hover:bg-gray-50 hover:border-gray-300 transition-all shadow-sm hover:shadow-md disabled:opacity-50"
        >
          <img 
            src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg" 
            alt="Google" 
            className="w-6 h-6"
          />
          Google 계정으로 계속하기
        </button>

        {/* 회원가입 링크 */}
        <div className="mt-8 text-center">
          <p className="text-gray-600">
            아직 계정이 없으신가요?{' '}
            <Link 
              to="/signup" 
              className="text-indigo-600 font-bold hover:text-indigo-800 transition"
            >
              회원가입
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}

export default Login;