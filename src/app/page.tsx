'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import api from '@/lib/axios';

export default function LoginPage() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const router = useRouter();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await api.post('/auth/login', {
        username,
        password
      });

      localStorage.setItem('token', response.data.access_token);
      localStorage.setItem('userColor', response.data.user.color);
      localStorage.setItem('username', response.data.user.username);

      router.push('/calendar');
    } catch (error) {
      setError('로그인에 실패했습니다.');
    }
  };

  return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="max-w-md w-full space-y-8 p-8 bg-white rounded-lg shadow-lg">
          <div>
            <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
              캘린더 로그인
            </h2>
          </div>
          <form className="mt-8 space-y-6" onSubmit={handleLogin}>
            <div className="space-y-4">
              <div>
                <label htmlFor="username" className="block text-sm font-medium text-gray-700">
                  아이디
                </label>
                <input
                    id="username"
                    type="text"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm"
                    placeholder="아이디 입력"
                    required
                />
                <p className="mt-1 text-xs text-gray-500">
                  사용 가능한 아이디: ahyeon, yewon, gayeon, sion, hansol, dasol
                </p>
              </div>
              <div>
                <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                  비밀번호
                </label>
                <input
                    id="password"
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm"
                    placeholder="비밀번호 입력"
                    required
                />
                <p className="mt-1 text-xs text-gray-500">
                  비밀번호는 아이디와 동일합니다
                </p>
              </div>
            </div>
            {error && (
                <div className="text-red-500 text-sm text-center">
                  {error}
                </div>
            )}
            <div>
              <button
                  type="submit"
                  className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700"
              >
                로그인
              </button>
            </div>
          </form>
        </div>
      </div>
  );
}