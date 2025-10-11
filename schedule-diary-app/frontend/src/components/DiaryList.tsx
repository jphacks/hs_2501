import React, { useEffect, useState } from 'react';
import { fetchDiaries, saveDiary } from '../services/api';

export default function DiaryList({ token }: { token: string }) {
  const [diaries, setDiaries] = useState<any[]>([]);
  const [content, setContent] = useState('');

  const load = async () => {
    const res = await fetchDiaries(token);
    setDiaries(res.diaries || []);
  };

  useEffect(()=>{ if (token) load(); }, [token]);

  const add = async () => {
    if (!content) return;
    const res = await saveDiary(token, { content });
    setContent('');
    setDiaries(prev => [res.diary, ...prev]);
  };

  return (
    <div className="p-4 bg-white rounded shadow">
      <h3 className="text-lg font-semibold mb-2">過去の日記</h3>
      <div className="mb-2">
        <textarea value={content} onChange={e=>setContent(e.target.value)} className="border p-2 w-full" placeholder="今日の記録を入力" />
        <div className="flex gap-2 mt-2">
          <button onClick={add} className="bg-green-500 text-white px-3 py-1 rounded">保存</button>
        </div>
      </div>
      <div className="space-y-2">
        {diaries.map(d=> (
          <div key={d.id} className="border p-2 rounded">
            <div className="text-sm text-gray-500">{new Date(d.createdAt).toLocaleString()}</div>
            <div className="mt-1">{d.content}</div>
          </div>
        ))}
      </div>
    </div>
  );
}
