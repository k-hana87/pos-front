'use client';

import { useState } from 'react';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

type Item = {
  CODE: string;
  NAME: string;
  PRICE: number;
};

export default function Home() {
  const [code, setCode] = useState('');
  const [name, setName] = useState('');
  const [price, setPrice] = useState<number | null>(null);
  const [items, setItems] = useState<Item[]>([]);
  const [popupVisible, setPopupVisible] = useState(false);
  const [total, setTotal] = useState(0);

  const handleFetchItem = async () => {
    try {
      const res = await fetch(`${API_BASE_URL}/products/${code}`);
      if (res.status === 404) {
        setName('商品がマスタ未登録です');
        setPrice(null);
        return;
      }
      const data = await res.json();
      setName(data.NAME);
      setPrice(data.PRICE);
    } catch (error) {
      setName('通信エラー');
      setPrice(null);
    }
  };

  const handleAdd = () => {
    if (!name || name === '商品がマスタ未登録です') return;
    const newItem: Item = { CODE: code, NAME: name, PRICE: price! };
    setItems([...items, newItem]);
    setCode('');
    setName('');
    setPrice(null);
  };

  const handlePurchase = async () => {
    try {
      const totalAmount = items.reduce((acc, item) => acc + item.PRICE, 0);

      const details = items.map((item, index) => ({
        DTL_ID: index + 1,
        PRD_ID: 0, // 仮のID
        PRD_CODE: item.CODE,
        PRD_NAME: item.NAME,
        PRD_PRICE: item.PRICE,
      }));

      const res = await fetch(`${API_BASE_URL}/trades`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          TOTAL_AMT: totalAmount,
          details: details,
        }),
      });

      if (res.ok) {
        setTotal(totalAmount);
        setPopupVisible(true);
        setItems([]);
        setCode('');
        setName('');
        setPrice(null);
      } else {
        alert('購入処理に失敗しました');
      }
    } catch (err) {
      alert('購入エラー');
    }
  };

  return (
    <main className="bg-white text-black p-6 max-w-5xl mx-auto">
      <div className="flex justify-between items-center mb-4 w-full">
        <h1 className="text-2xl font-bold">POSアプリ</h1>
        <div className="w-1/4 ml-auto">
          <a
            href="/admin"
            className="bg-gray-500 text-white px-4 py-2 rounded-lg hover:bg-gray-800 transition"
          >
            管理者ページ
          </a>
        </div>
      </div>

      <div className="flex space-x-2 mb-4">
        <div className="w-1/2 space-y-4">
          <input
            className="border p-2 w-3/4 mb-2"
            placeholder="商品コードを入力"
            value={code}
            onChange={(e) => setCode(e.target.value)}
          />
          <button
            onClick={handleFetchItem}
            className="w-3/4 bg-blue-500 text-white px-4 py-2 mb-4 mr-2 cursor-pointer hover:bg-orange-300 transition"
          >
            商品コード読み込み
          </button>
          <div className="h-10" />
          <div className="mb-2 w-3/4">
             <div
                className={`border p-2 bg-gray-100 text-sm h-10 w-full text-center cursor-default select-none ${
                  !name ? 'text-gray-500' : 'text-black'
                }`}
              >
                {name || 'お～いお茶'}
            </div>
          </div>
          <div className="mb-2 w-3/4">
            <input
              type="text"
              value={price ?? ''}
              readOnly
              placeholder="150円"
              className="border p-2 bg-gray-100 text-sm h-10 w-full text-center"
            />
          </div>
          <button
            onClick={handleAdd}
            className="w-3/4 bg-blue-500 text-white px-4 py-2 cursor-pointer hover:bg-orange-300 transition"
          >
            追加
          </button>
        </div>

        <div className="w-1/2 flex flex-col justify-between">
          <div className="mb-4 mt-15">
            <h2 className="block text-sm font-medium text-gray-700 mb-1">購入リスト</h2>
            <div className="border p-2 bg-gray-100 w-3/4 h-40 overflow-y-auto">
              {items.length === 0 ? (
                <p className="text-gray-500">購入リストは空です</p>
              ) : (
                <ul className="list-disc pl-5">
                  {items.map((item, index) => (
                    <li key={index}>
                      {item.NAME} - ¥{item.PRICE}
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </div>
          <button
            onClick={handlePurchase}
            className="w-3/4 bg-blue-500 text-white px-4 py-2 self-start cursor-pointer hover:bg-orange-300 transition"
            disabled={items.length === 0}
          >
            購入
          </button>
        </div>
      </div>

      {popupVisible && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
          <div className="bg-white p-6 rounded shadow-md text-center w-1/4 min-w-[200px]">
            <p className="mb-4 text-lg">合計金額: ¥{total}</p>
            <button
              onClick={() => setPopupVisible(false)}
              className="bg-blue-500 text-white px-4 py-2 rounded"
            >
              OK
            </button>
          </div>
        </div>
      )}
    </main>
  );
}

