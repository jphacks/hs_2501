import React, { useState } from 'react';
import { signup, login } from '../services/api';

export default function AuthForm({ onAuth }: { onAuth: (token: string) => void }) {
  const [mode, setMode] = useState<'login'|'signup'>('login');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setError(null);
      const fn = mode === 'login' ? login : signup;
      const res = await fn(username, password);
      if (res.token) {
        onAuth(res.token);
      }
    } catch (err:any) {
      setError(err?.response?.data?.error || 'Auth failed');
    }
  };

  return (
    <div className="p-4 bg-white rounded shadow">
      <h3 className="text-lg font-semibold mb-2">{mode === 'login' ? 'ログイン' : 'サインアップ'}</h3>
      <form onSubmit={submit} className="space-y-2">
        <input value={username} onChange={e=>setUsername(e.target.value)} placeholder="username" className="border p-2 w-full" />
        <input value={password} type="password" onChange={e=>setPassword(e.target.value)} placeholder="password" className="border p-2 w-full" />
        {error && <div className="text-red-500">{error}</div>}
        <div className="flex gap-2">
          <button className="bg-blue-500 text-white px-3 py-1 rounded">{mode === 'login' ? 'ログイン' : 'サインアップ'}</button>
          <button type="button" onClick={()=>setMode(mode === 'login' ? 'signup' : 'login')} className="text-sm underline">{mode === 'login' ? '新規登録' : 'ログインに切替'}</button>
        </div>
      </form>
    </div>
  );
}
