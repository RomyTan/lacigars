'use client';
import { useState } from 'react';

// Komponen Tabel Dinamis (Otomatis baca kolom Prisma)
function DynamicTable({ data }: { data: any[] }) {
  if (!data || data.length === 0) return <div className="text-gray-500">Belum ada data.</div>;
  
  const headers = Object.keys(data[0]);

  return (
    <div className="overflow-x-auto rounded-lg border border-gray-200">
      <table className="w-full text-sm text-left text-black">
        <thead className="bg-gray-100 uppercase text-xs font-bold">
          <tr>
            {headers.map((h) => (
              <th key={h} className="p-3 border-b">{h}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {data.map((row, i) => (
            <tr key={i} className="border-b hover:bg-gray-50">
              {headers.map((h) => (
                <td key={h} className="p-3">
                  {typeof row[h] === 'object' ? JSON.stringify(row[h]) : String(row[h] ?? '-')}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default function AdminDashboardClient({ initialData }: any) {
  const [activeTab, setActiveTab] = useState('Product');

  const menuItems = [
    { id: 'Product', icon: '📦', label: 'Products & Catalog', dataKey: 'products' },
    { id: 'Category', icon: '📑', label: 'Categories', dataKey: 'categories' },
    { id: 'User', icon: '👥', label: 'Users', dataKey: 'users' },
    { id: 'CustomerGroup', icon: '🏢', label: 'Customer Groups', dataKey: 'customerGroups' },
    { id: 'TierPrice', icon: '🏷️', label: 'Tier Prices', dataKey: 'tierPrices' },
    { id: 'GroupProductRule', icon: '⚙️', label: 'Group Product Rules', dataKey: 'groupProductRules' },
    { id: 'CustomerOverride', icon: '🔀', label: 'Customer Overrides', dataKey: 'customerOverrides' },
    { id: 'CartDraft', icon: '🛒', label: 'Cart Drafts', dataKey: 'cartDrafts' },
    { id: 'Order', icon: '📋', label: 'Orders Management', dataKey: 'orders' },
    { id: 'OrderItem', icon: '🧾', label: 'Order Items', dataKey: 'orderItems' },
  ];

  const activeMenu = menuItems.find(m => m.id === activeTab);

  return (
    <div className="flex min-h-screen bg-gray-50">
      <aside className="w-72 bg-white shadow-md p-4 border-r border-gray-200">
        <h2 className="text-xl font-bold mb-8 mt-2 text-black px-4">LAC Admin Panel</h2>
        <nav className="flex flex-col gap-1.5">
          {menuItems.map((item) => (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={`flex items-center gap-3 px-4 py-3 rounded-xl font-semibold text-sm transition-all ${
                activeTab === item.id ? 'bg-black text-white shadow-md' : 'text-gray-500 hover:bg-gray-100 hover:text-black'
              }`}
            >
              <span className="text-lg">{item.icon}</span>
              {item.label}
            </button>
          ))}
        </nav>
      </aside>

      <main className="flex-1 p-8 overflow-auto">
        <h1 className="text-2xl font-bold mb-6 text-black">{activeMenu?.label}</h1>
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-200 min-h-[500px]">
          {/* Render tabel berdasarkan tab yang aktif */}
          <DynamicTable data={initialData?.[activeMenu?.dataKey || ''] || []} />
        </div>
      </main>
    </div>
  );
}