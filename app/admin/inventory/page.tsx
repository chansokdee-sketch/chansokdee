'use client';

import React, { useState, useEffect } from 'react';
import { Boxes, AlertTriangle, Check, RefreshCw } from 'lucide-react';

interface InventoryItem {
  id: string;
  sku: string;
  name: string;
  stock: number;
  price: number;
  status: string;
  isLowStock: boolean;
  updatedAt: string;
}

export default function AdminInventoryPage() {
  const [inventory, setInventory] = useState<InventoryItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [newStockVal, setNewStockVal] = useState<string>('');
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  const fetchInventory = async () => {
    try {
      const res = await fetch('/api/admin/inventory');
      const data = await res.json();
      if (data.inventory) setInventory(data.inventory);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchInventory();
  }, []);

  const startEdit = (item: InventoryItem) => {
    setEditingId(item.id);
    setNewStockVal(item.stock.toString());
  };

  const saveStock = async (productId: string) => {
    const stockNum = parseInt(newStockVal, 10);
    if (isNaN(stockNum) || stockNum < 0) {
      alert('Vui lòng nhập số lượng hợp lệ (>= 0)');
      return;
    }

    try {
      const res = await fetch('/api/admin/inventory', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ productId, stock: stockNum }),
      });
      if (res.ok) {
        setInventory(prev => prev.map(item => item.id === productId ? {
          ...item,
          stock: stockNum,
          isLowStock: stockNum <= 5,
        } : item));
        setEditingId(null);
        setSuccessMsg('Đã cập nhật tồn kho thành công!');
        setTimeout(() => setSuccessMsg(null), 3000);
      }
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-white">Quản Lý Tồn Kho</h1>
          <p className="text-xs text-zinc-400 mt-1">
            Kiểm soát số lượng tồn kho thực tế và cập nhật nhập hàng nhanh chóng
          </p>
        </div>
        <button
          onClick={fetchInventory}
          className="px-4 py-2 bg-zinc-800 hover:bg-zinc-700 text-zinc-300 rounded-xl text-xs font-semibold flex items-center gap-2 transition"
        >
          <RefreshCw className="w-3.5 h-3.5" />
          Làm mới dữ liệu
        </button>
      </div>

      {successMsg && (
        <div className="p-3 bg-emerald-500/20 border border-emerald-500/40 text-emerald-400 rounded-xl text-xs flex items-center gap-2">
          <Check className="w-4 h-4" />
          <span>{successMsg}</span>
        </div>
      )}

      <div className="bg-zinc-900 border border-zinc-800/80 rounded-3xl overflow-hidden shadow-xs">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-zinc-800 text-zinc-400 uppercase tracking-wider text-[10px] bg-zinc-950/50">
                <th className="py-4 px-6 font-semibold">Mã SKU</th>
                <th className="py-4 px-4 font-semibold">Tên sản phẩm</th>
                <th className="py-4 px-4 font-semibold">Tồn kho hiện tại</th>
                <th className="py-4 px-4 font-semibold">Tình trạng</th>
                <th className="py-4 px-6 font-semibold text-right">Cập nhật nhanh</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-800/60">
              {inventory.map((item) => {
                const isEditing = editingId === item.id;
                const isOut = item.stock <= 0;
                const isLow = item.isLowStock && !isOut;

                return (
                  <tr key={item.id} className="hover:bg-zinc-800/40 transition">
                    <td className="py-4 px-6 font-mono font-bold text-blue-400">{item.sku}</td>
                    <td className="py-4 px-4 font-medium text-white max-w-xs truncate">{item.name}</td>

                    <td className="py-4 px-4">
                      {isEditing ? (
                        <input
                          type="number"
                          min="0"
                          value={newStockVal}
                          onChange={(e) => setNewStockVal(e.target.value)}
                          className="w-20 bg-zinc-950 border border-blue-500 rounded-lg px-2.5 py-1 text-white text-xs font-bold focus:outline-none"
                          autoFocus
                        />
                      ) : (
                        <span className="font-bold text-base text-zinc-100">{item.stock}</span>
                      )}
                    </td>

                    <td className="py-4 px-4">
                      {isOut ? (
                        <span className="px-2.5 py-1 rounded-full text-[10px] font-bold bg-red-500/20 text-red-400 border border-red-500/30">
                          Hết hàng
                        </span>
                      ) : isLow ? (
                        <span className="px-2.5 py-1 rounded-full text-[10px] font-bold bg-amber-500/20 text-amber-400 border border-amber-500/30 flex items-center gap-1 w-fit">
                          <AlertTriangle className="w-3 h-3" />
                          Sắp hết
                        </span>
                      ) : (
                        <span className="px-2.5 py-1 rounded-full text-[10px] font-bold bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                          Đầy đủ
                        </span>
                      )}
                    </td>

                    <td className="py-4 px-6 text-right">
                      {isEditing ? (
                        <div className="flex items-center justify-end gap-2">
                          <button
                            onClick={() => saveStock(item.id)}
                            className="px-3 py-1 bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg text-xs font-bold transition"
                          >
                            Lưu
                          </button>
                          <button
                            onClick={() => setEditingId(null)}
                            className="px-3 py-1 bg-zinc-800 text-zinc-400 rounded-lg text-xs font-medium"
                          >
                            Hủy
                          </button>
                        </div>
                      ) : (
                        <button
                          onClick={() => startEdit(item)}
                          className="px-3 py-1.5 bg-zinc-800 hover:bg-zinc-700 text-zinc-200 rounded-xl text-xs font-semibold transition"
                        >
                          Nhập / Chỉnh kho
                        </button>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
