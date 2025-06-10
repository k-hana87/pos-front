'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

export default function AdminPage() {
  const [CODE, setCODE] = useState('');
  const [NAME, setNAME] = useState('');
  const [PRICE, setPRICE] = useState('');
  const router = useRouter(); 

  console.log("API_BASE_URL =", API_BASE_URL);

  const handleAdd = async () => {
    if (!NAME || !PRICE) {
      alert('商品名と単価を入力してください');
      return;
    }

    //ここで送信するデータ（payload）を定義
    const payload = {
      CODE,
      NAME,
      PRICE: parseInt(PRICE),
    };
  
    //デバッグ用ログを追加
    console.log("送信データ（payload）:", payload);
    

    
    const response = await fetch(`${API_BASE_URL}/products`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        CODE,
        NAME,
        PRICE: parseInt(PRICE),
      }),
    });

    if (response.ok) {
      alert('商品を追加しました');
      setCODE('');
      setNAME('');
      setPRICE('');
    } else {
      alert('追加に失敗しました');
    }
  };

  const handleBack = () => {
    router.push('/');
  };

  return (
    <main className="bg-white text-black p-6 max-w-2xl mx-auto">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold mb-6">管理者ページ</h1>
        <button
          onClick={handleBack}
          className="bg-gray-300 text-black px-3 py-1 hover:bg-gray-400 transition"
        >
          戻る
        </button>
      </div>

      {/* 商品コード */}
      <div className="mb-4 w-1/2">
        <label className="block text-sm font-medium text-gray-700 mb-1">商品コード</label>
        <input
          type="text"
          value={CODE}
          onChange={(e) => setCODE(e.target.value)}
          className="border p-2 bg-gray-100 text-sm h-10 w-full"
          placeholder="例：123456"
        />
      </div>

      {/* 商品名称入力 */}
      <div className="mb-4 w-1/2">
        <label className="block text-sm font-medium text-gray-700 mb-1">商品名称</label>
        <input
          type="text"
          value={NAME}
          onChange={(e) => setNAME(e.target.value)}
          className="border p-2 bg-gray-100 text-sm h-10 w-full"
          placeholder="例：ボールペン"
        />
      </div>

      {/* 商品単価入力 */}
      <div className="mb-4 w-1/2">
        <label className="block text-sm font-medium text-gray-700 mb-1">商品単価</label>
        <input
          type="text"
          value={PRICE}
          onChange={(e) => setPRICE(e.target.value)}
          className="border p-2 bg-gray-100 text-sm h-10 w-full"
          placeholder="例：350"
        />
      </div>

      {/* 追加ボタン */}
      <button
        onClick={handleAdd}
        className="bg-blue-500 text-white px-4 py-2 cursor-pointer hover:bg-orange-300 transition"
      >
        追加
      </button>
    </main>
  );
}
