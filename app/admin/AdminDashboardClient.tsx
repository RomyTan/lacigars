'use client';
import { useState, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import { logoutUser } from './logoutAction';
import { BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

// --- 1. KOMPONEN DASHBOARD HOME (CLEAN LAYOUT) ---
function DashboardHome({ data }: { data: any }) {
  const totalProducts = data?.products?.length || 0;
  const totalOrders = data?.orders?.length || 0;
  const totalCustomers = data?.users?.length || 0;
  const totalRevenue = data?.orders?.reduce((acc: number, curr: any) => acc + (curr.total || 0), 0) || 0;

  const barData = [
    { name: 'Jan', b2c: 4000, b2b: 2400 },
    { name: 'Feb', b2c: 3000, b2b: 1398 },
    { name: 'Mar', b2c: 2000, b2b: 5800 },
    { name: 'Apr', b2c: 2780, b2b: 3908 },
    { name: 'May', b2c: 1890, b2b: 4800 },
    { name: 'Jun', b2c: 2390, b2b: 3800 },
    { name: 'Jul', b2c: 3490, b2b: 4300 },
  ];

  const pieData = [
    { name: 'Premium Cigars', value: 85000 },
    { name: 'Accessories', value: 25000 },
    { name: 'Humidors', value: 10000 },
    { name: 'Samplers', value: 5000 },
  ];
  const COLORS = ['#d4af37', '#8c6a21', '#4a2c11', '#5c3616'];

  const recentActivities = [
    { type: 'order', title: 'Order #2048', desc: 'John Doe • 12 Jan 26', status: 'New Order', color: 'text-blue-400 bg-blue-400/10' },
    { type: 'alert', title: 'Low Stock Alert', desc: 'Montecristo 1935 • 10 Jan 26', status: 'Low Stock', color: 'text-red-400 bg-red-400/10' },
    { type: 'promo', title: 'Promo code "LAC10"', desc: 'Applied 52 times • 8 Jan 26', status: 'Campaign', color: 'text-purple-400 bg-purple-400/10' },
    { type: 'system', title: 'System Update', desc: 'Version 1.2.1 • 2 Jan 26', status: 'System', color: 'text-gray-400 bg-gray-400/10' },
  ];

  const topProducts = [
    { name: 'Montecristo 1935', stock: '1,200', price: '$250.00', sales: '4,800', earnings: '$1,200,000' },
    { name: 'Padron 1964 Anniv.', stock: '320', price: '$180.00', sales: '3,200', earnings: '$576,000' },
    { name: 'Davidoff Signature', stock: '450', price: '$300.00', sales: '800', earnings: '$240,000' },
    { name: 'Arturo Fuente OpusX', stock: '120', price: '$400.00', sales: '1,800', earnings: '$720,000' },
  ];

  return (
    <div className="flex flex-col gap-6">
      {/* Metric Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { title: 'Total Products', value: totalProducts, icon: '📦', bg: 'bg-blue-500/10', text: 'text-blue-400' },
          { title: 'Total Sales', value: totalOrders, icon: '🛒', bg: 'bg-purple-500/10', text: 'text-purple-400' },
          { title: 'Total Income', value: `$${totalRevenue.toLocaleString()}`, icon: '↗', bg: 'bg-green-500/10', text: 'text-green-400' },
          { title: 'Total Customers', value: totalCustomers, icon: '👥', bg: 'bg-orange-500/10', text: 'text-orange-400' },
        ].map((stat, i) => (
          <div key={i} className="bg-[#141414] border border-[#262626] rounded-2xl p-6 flex items-center gap-4">
            <div className={`w-12 h-12 rounded-full flex items-center justify-center text-xl ${stat.bg} ${stat.text}`}>{stat.icon}</div>
            <div>
              <p className="text-xs font-semibold text-gray-400 mb-1">{stat.title}</p>
              <h3 className="text-2xl font-bold text-white leading-none">{stat.value}</h3>
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Bar Chart */}
        <div className="lg:col-span-2 bg-[#141414] border border-[#262626] rounded-2xl p-6 flex flex-col">
          <div className="flex justify-between items-center mb-6">
            <div className="flex items-center gap-2"><span className="text-gray-400">📊</span><h3 className="font-semibold text-white">Sales Revenue</h3></div>
            <div className="flex bg-[#0a0a0a] border border-[#262626] rounded-lg p-1">
              <button className="px-3 py-1 text-xs font-medium text-white bg-[#1a1a1a] rounded-md shadow">Monthly</button>
              <button className="px-3 py-1 text-xs font-medium text-gray-500 hover:text-white">Quarterly</button>
              <button className="px-3 py-1 text-xs font-medium text-gray-500 hover:text-white">Yearly</button>
            </div>
          </div>
          <div className="flex gap-4 text-xs mb-4 px-2">
            <div className="flex items-center gap-2"><div className="w-2 h-2 rounded-full bg-[#d4af37]"></div><span className="text-gray-400">B2C Retail</span></div>
            <div className="flex items-center gap-2"><div className="w-2 h-2 rounded-full bg-[#4a2c11]"></div><span className="text-gray-400">B2B Wholesale</span></div>
          </div>
          <div className="flex-1 w-full h-62.5">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={barData} margin={{ top: 0, right: 0, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#262626" vertical={false} />
                <XAxis dataKey="name" stroke="#666" tick={{ fill: '#666', fontSize: 12 }} axisLine={false} tickLine={false} />
                <YAxis stroke="#666" tick={{ fill: '#666', fontSize: 12 }} axisLine={false} tickLine={false} tickFormatter={(val) => `${val / 1000}k`} />
                <Tooltip cursor={{ fill: '#1a1a1a' }} contentStyle={{ backgroundColor: '#0a0a0a', borderColor: '#333', borderRadius: '8px' }} />
                <Bar dataKey="b2c" fill="#d4af37" radius={[4, 4, 0, 0]} barSize={20} />
                <Bar dataKey="b2b" fill="#4a2c11" radius={[4, 4, 0, 0]} barSize={20} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Pie Chart */}
        <div className="bg-[#141414] border border-[#262626] rounded-2xl p-6 flex flex-col">
          <div className="flex justify-between items-center mb-6">
            <div className="flex items-center gap-2"><span className="text-gray-400">🏆</span><h3 className="font-semibold text-white">Top Categories</h3></div>
            <button className="text-xs text-gray-400 hover:text-white border border-[#262626] px-2 py-1 rounded-md">See All</button>
          </div>
          <div className="relative flex-1 w-full h-50 flex items-center justify-center">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie data={pieData} cx="50%" cy="50%" innerRadius={60} outerRadius={80} paddingAngle={5} dataKey="value" stroke="none">
                  {pieData.map((entry, index) => <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />)}
                </Pie>
                <Tooltip contentStyle={{ backgroundColor: '#0a0a0a', borderColor: '#333', borderRadius: '8px' }} />
              </PieChart>
            </ResponsiveContainer>
            <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
              <span className="text-[10px] text-gray-500 uppercase">Total Sales</span>
              <span className="text-lg font-bold text-white">$125,000</span>
            </div>
          </div>
          <div className="mt-4 space-y-3">
            {pieData.map((item, idx) => (
              <div key={idx} className="flex justify-between items-center text-sm">
                <div className="flex items-center gap-2"><div className="w-2 h-2 rounded-full" style={{ backgroundColor: COLORS[idx] }}></div><span className="text-gray-300">{item.name}</span></div>
                <div className="flex items-center gap-4"><span className="text-gray-400">${item.value.toLocaleString()}</span><span className="font-semibold text-white w-8 text-right">{Math.round((item.value / 125000) * 100)}%</span></div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recent Activity */}
        <div className="bg-[#141414] border border-[#262626] rounded-2xl p-6">
          <div className="flex justify-between items-center mb-6">
            <div className="flex items-center gap-2"><span className="text-gray-400">⏱</span><h3 className="font-semibold text-white">Recent Activity</h3></div>
            <button className="text-xs text-gray-400 hover:text-white border border-[#262626] px-2 py-1 rounded-md">See All</button>
          </div>
          <div className="flex flex-col gap-4">
            {recentActivities.map((act, i) => (
              <div key={i} className="flex items-center justify-between p-3 rounded-xl border border-[#262626] bg-[#0a0a0a]">
                <div className="flex items-center gap-3">
                  b<div className={`w-10 h-10 rounded-full flex items-center justify-center ${act.color}`}>{act.type === 'order' ? '🛒' : act.type === 'alert' ? '⚠' : act.type === 'promo' ? '🎟' : '⚙'}</div>
                  <div><h4 className="text-sm font-semibold text-white">{act.title}</h4><p className="text-[11px] text-gray-500">{act.desc}</p></div>
                </div>
                <span className={`text-[10px] font-semibold px-2 py-1 rounded-md ${act.color}`}>{act.status}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Top Products */}
        <div className="lg:col-span-2 bg-[#141414] border border-[#262626] rounded-2xl p-6 flex flex-col">
          <div className="flex justify-between items-center mb-6">
            <div className="flex items-center gap-2"><span className="text-gray-400">📦</span><h3 className="font-semibold text-white">Top Products</h3></div>
            <div className="flex gap-2">
              <button className="px-3 py-1.5 bg-[#0a0a0a] border border-[#262626] text-xs text-gray-300 rounded-lg hover:bg-[#1a1a1a]">⇅ Sort</button>
              <button className="px-3 py-1.5 bg-[#0a0a0a] border border-[#262626] text-xs text-gray-300 rounded-lg hover:bg-[#1a1a1a]">≡ Filter</button>
            </div>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm text-gray-300">
              <thead className="text-xs text-gray-500 border-b border-[#262626]">
                <tr>
                  <th className="pb-3 font-medium">Product ↕</th>
                  <th className="pb-3 font-medium">Stocks ↕</th>
                  <th className="pb-3 font-medium">Price ↕</th>
                  <th className="pb-3 font-medium">Sales ↕</th>
                  <th className="pb-3 font-medium">Earnings ↕</th>
                </tr>
              </thead>
              <tbody>
                {topProducts.map((prod, i) => (
                  <tr key={i} className="border-b border-[#262626] last:border-0 hover:bg-[#1a1a1a] transition-colors">
                    <td className="py-3 flex items-center gap-3"><div className="w-8 h-8 rounded bg-[#262626] flex items-center justify-center text-xs">🚬</div><span className="font-medium text-white">{prod.name}</span></td>
                    <td className="py-3 text-gray-400">{prod.stock}</td>
                    <td className="py-3 text-gray-400">{prod.price}</td>
                    <td className="py-3 text-gray-400">{prod.sales}</td>
                    <td className="py-3 font-medium text-white">{prod.earnings}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}

// --- 2. KOMPONEN TABEL DINAMIS (MENU LAIN) ---
function DynamicTable({ data }: { data: any[] }) {
  if (!data || data.length === 0) return <div className="text-gray-500 mt-4">Belum ada data.</div>;
  const headers = Object.keys(data[0]);

  return (
    <div className="overflow-x-auto rounded-xl border border-[#262626] bg-[#141414]">
      <table className="w-full text-sm text-left text-gray-300">
        <thead className="bg-[#1a1a1a] uppercase text-xs font-semibold text-gray-500 border-b border-[#262626]">
          <tr>{headers.map((h) => <th key={h} className="p-4">{h}</th>)}</tr>
        </thead>
        <tbody>
          {data.map((row, i) => (
            <tr key={i} className="border-b border-[#262626] hover:bg-[#1a1a1a] transition-colors">
              {headers.map((h) => (
                <td key={h} className="p-4">
                  {h.toLowerCase() === 'image' || h.toLowerCase() === 'images' ? (
                    row[h] && row[h] !== 'null' ? <img src={row[h]} alt="thumbnail" className="w-10 h-10 object-cover rounded-md border border-[#333]" /> : <span className="text-gray-600 text-xs italic">No Image</span>
                  ) : typeof row[h] === 'object' ? JSON.stringify(row[h]) : String(row[h] ?? '-')}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

// --- 3. KOMPONEN UTAMA (LAYOUT ADMIN) ---
export default function AdminDashboardClient({ initialData }: any) {
  const router = useRouter();
  
  // States
  const [activeTab, setActiveTab] = useState('Home');
  const [productView, setProductView] = useState<'table' | 'add'>('table');
  const [isNotifOpen, setIsNotifOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [selectedItems, setSelectedItems] = useState<number[]>([]);
  const [statusTab, setStatusTab] = useState('All');

  const notifCount = (initialData?.orders?.length || 0) + (initialData?.users?.length || 0);

  const handleLogout = async (e: any) => {
    e.preventDefault();
    
    // Hapus local storage kalau emang ada
    localStorage.removeItem('token');
    
    // Eksekusi Server Action untuk menghancurkan cookie HttpOnly
    await logoutUser();
  };

  const toggleSelect = (id: number) => setSelectedItems(prev => prev.includes(id) ? prev.filter(item => item !== id) : [...prev, id]);
  const toggleSelectAll = () => setSelectedItems(selectedItems.length === initialData?.products?.length ? [] : initialData?.products?.map((p: any) => p.id) || []);

  const [newProduct, setNewProduct] = useState({
    name: '', sku: '', basePrice: '', category: 'Premium Cigars', brand: '', origin: '',
    wrapper: '', binderFiller: '', shape: '', strength: '', flavored: 'No',
    length: '', ring: '', boxInfo: '', stock: '', description: '',
    imagePreview: '/uploads/1790012363796-Double_Corona-c.jpg'
  });

  const handleInput = (e: any) => setNewProduct(prev => ({ ...prev, [e.target.name]: e.target.value }));

  // Menu Items & Active Menu Matcher (Fix error .label)
  const menuItems = [
    { id: 'Home', icon: '⌂', label: 'Home', dataKey: 'dashboard' },
    { id: 'Order', icon: '📋', label: 'Orders', dataKey: 'orders' },
    { id: 'Product', icon: '📦', label: 'Products', dataKey: 'products' },
    { id: 'User', icon: '👥', label: 'Customers', dataKey: 'users' },
    { id: 'Content', icon: '📑', label: 'Content', dataKey: 'categories' },
    { id: 'Finances', icon: '💰', label: 'Finances', dataKey: 'tierPrices' },
    { id: 'Analytics', icon: '📈', label: 'Analytics', dataKey: 'orders' },
    { id: 'Marketing', icon: '🎯', label: 'Marketing', dataKey: 'customerGroups' },
    { id: 'Discounts', icon: '🏷️', label: 'Discounts', dataKey: 'groupProductRules' },
  ];

  const activeMenu = menuItems.find(m => m.id === activeTab);
  
  const inputClass = "w-full bg-[#0a0a0a] text-white px-4 py-2.5 rounded-lg border border-[#262626] focus:outline-none focus:border-[#d4af37] text-sm transition-colors";
  const labelClass = "block text-xs font-semibold text-gray-400 mb-1.5";

  return (
    <div className="min-h-screen bg-[#0a0a0a] font-sans text-gray-200 flex">
      {/* SIDEBAR */}
      <aside className="w-64 bg-[#0a0a0a] border-r border-[#262626] flex flex-col">
        <div className="h-16 flex items-center px-6 border-b border-[#262626]">
          <div className="w-4 h-4 rounded bg-[#d4af37] mr-3"></div>
          <h2 className="text-sm font-bold text-white tracking-widest uppercase">LACigars</h2>
        </div>
        <div className="p-4 flex-1 overflow-y-auto custom-scrollbar">
          <p className="text-[10px] font-bold text-gray-500 uppercase tracking-widest mb-3 ml-2">Main</p>
          <nav className="flex flex-col gap-1">
            {menuItems.map((item) => (
              <button key={item.id} onClick={() => { setActiveTab(item.id); setProductView('table'); }} className={`flex items-center gap-3 px-3 py-2 rounded-lg text-sm transition-all ${activeTab === item.id ? 'bg-[#1a1a1a] text-white font-medium' : 'text-gray-400 hover:text-white'}`}>
                <span className="text-lg w-5 text-center">{item.icon}</span>{item.label}
              </button>
            ))}
          </nav>
        </div>
      </aside>

      {/* MAIN CONTENT */}
      <main className="flex-1 flex flex-col min-w-0 bg-[#0f0f0f]">
        
        {/* TOP BAR */}
        <header className="h-16 border-b border-[#262626] bg-[#0a0a0a] flex items-center justify-between px-8">
          <div className="relative w-96">
            <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path></svg>
            <input type="text" placeholder="Search..." className="w-full bg-[#141414] text-white pl-10 pr-4 py-2 rounded-lg border border-[#262626] focus:outline-none focus:border-[#d4af37] text-sm transition-colors" />
          </div>
          <div className="flex items-center gap-5">
            {/* Notification Dropdown */}
            <div className="relative">
              <button onClick={() => setIsNotifOpen(!isNotifOpen)} className="text-gray-400 hover:text-white transition mt-1">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"></path></svg>
                {notifCount > 0 && <span className="absolute -top-1 -right-1 bg-red-500 text-white text-[9px] font-bold w-4 h-4 flex items-center justify-center rounded-full">{notifCount}</span>}
              </button>
              {isNotifOpen && (
                <div className="absolute right-0 top-10 w-64 bg-[#141414] border border-[#262626] rounded-xl shadow-2xl z-50 overflow-hidden">
                  <div className="p-3 border-b border-[#262626]"><h4 className="text-xs font-bold text-white uppercase tracking-wider">Notifications</h4></div>
                  <div className="max-h-64 overflow-y-auto">
                    {notifCount > 0 ? <div className="p-4 text-sm text-gray-300">You have {notifCount} new updates.</div> : <div className="p-4 text-xs text-gray-500 text-center">No new notification</div>}
                  </div>
                </div>
              )}
            </div>
            
            {/* Profile Dropdown (Logout) */}
            <div className="relative">
              <div onClick={() => setIsProfileOpen(!isProfileOpen)} className="flex items-center gap-3 cursor-pointer group">
                <div className="text-right hidden md:block">
                  <p className="text-sm font-semibold text-white leading-tight">Admin LAC</p>
                  <p className="text-xs text-gray-500">Store owner</p>
                </div>
                <img src="https://ui-avatars.com/api/?name=Admin+LAC&background=d4af37&color=000&bold=true" alt="Profile" className="w-9 h-9 rounded-full border border-transparent group-hover:border-[#d4af37] transition" />
              </div>
              {isProfileOpen && (
                <div className="absolute right-0 top-12 w-48 bg-[#141414] border border-[#262626] rounded-xl shadow-2xl z-50 overflow-hidden py-1">
                  <button className="w-full text-left px-4 py-2.5 text-sm text-gray-300 hover:bg-[#1a1a1a] hover:text-white transition">Account Settings</button>
                  <div className="h-px bg-[#262626] my-1"></div>
                  <button onClick={handleLogout} className="w-full text-left px-4 py-2.5 text-sm text-red-400 hover:bg-[#1a1a1a] hover:text-red-300 transition flex items-center gap-2">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"></path></svg> Sign Out
                  </button>
                </div>
              )}
            </div>
          </div>
        </header>

        {/* PAGE CONTENT */}
        <div className="flex-1 overflow-auto p-6 md:p-8 relative">
          {activeTab === 'Home' ? (
             <DashboardHome data={initialData} />
          ) : activeTab === 'Product' ? (
            productView === 'table' ? (
              <>
                <div className="flex justify-between items-end mb-6">
                  <div>
                    <h1 className="text-2xl font-semibold text-white mb-1">Products</h1>
                    <p className="text-sm text-gray-400">Manage inventory, pricing and availability across your store</p>
                  </div>
                  <div className="flex gap-3">
                    <button className="px-4 py-2 text-sm font-medium bg-[#141414] border border-[#262626] text-white rounded-lg hover:bg-[#1f1f1f] transition">↓ Export</button>
                    <button onClick={() => setProductView('add')} className="px-4 py-2 text-sm font-medium bg-[#d4af37] text-black rounded-lg hover:bg-[#c69c38] transition">+ Add product</button>
                  </div>
                </div>

                <div className="flex justify-between items-center mb-4">
                  <div className="flex gap-3">
                    <div className="relative">
                      <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path></svg>
                      <input type="text" placeholder="Search by product name or ID" className="bg-[#141414] text-white pl-9 pr-4 py-1.5 rounded-lg border border-[#262626] text-sm w-64 focus:border-[#d4af37] outline-none" />
                    </div>
                    <button className="px-3 py-1.5 bg-[#141414] border border-[#262626] text-sm text-gray-300 rounded-lg flex items-center gap-2 hover:bg-[#1f1f1f]">≡ Filter</button>
                    <button className="px-3 py-1.5 bg-[#141414] border border-[#262626] text-sm text-gray-300 rounded-lg flex items-center gap-2 hover:bg-[#1f1f1f]">
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 16V4m0 0L3 8m4-4l4 4m6 0v12m0 0l4-4m-4 4l-4-4"></path></svg> Sort
                    </button>
                  </div>
                  <div className="flex gap-6 border-b border-[#262626]">
                    {['All', 'Active', 'Drafts', 'Archived'].map(tab => (
                      <button key={tab} onClick={() => setStatusTab(tab)} className={`pb-2 text-sm font-medium transition-colors ${statusTab === tab ? 'text-white border-b-2 border-[#d4af37]' : 'text-gray-500 hover:text-gray-300'}`}>{tab}</button>
                    ))}
                  </div>
                </div>

                <div className="bg-[#141414] border border-[#262626] rounded-xl overflow-hidden">
                  <table className="w-full text-left text-sm text-gray-300">
                    <thead className="bg-[#1a1a1a] text-xs uppercase text-gray-500 font-semibold border-b border-[#262626]">
                      <tr>
                        <th className="p-4 w-12"><input type="checkbox" onChange={toggleSelectAll} checked={selectedItems.length === (initialData?.products?.length || 0) && selectedItems.length > 0} className="accent-[#d4af37]" /></th>
                        <th className="p-4">Product Name</th>
                        <th className="p-4">ID & Create Date</th>
                        <th className="p-4">Price</th>
                        <th className="p-4">Stock</th>
                        <th className="p-4">Status</th>
                      </tr>
                    </thead>
                    <tbody>
                      {initialData?.products?.length > 0 ? initialData.products.map((prod: any) => {
                        const isSelected = selectedItems.includes(prod.id);
                        return (
                          <tr key={prod.id} className={`border-b border-[#262626] hover:bg-[#1a1a1a] transition-colors ${isSelected ? 'bg-[#1a1a1a]' : ''}`}>
                            <td className="p-4"><input type="checkbox" checked={isSelected} onChange={() => toggleSelect(prod.id)} className="accent-[#d4af37]" /></td>
                            <td className="p-4 flex items-center gap-3">
                              <div className="w-10 h-10 rounded-md bg-[#262626] overflow-hidden flex items-center justify-center border border-[#333]">
                                {prod.image ? <img src={prod.image} alt={prod.name} className="w-full h-full object-cover" /> : <span className="text-xs text-gray-500">Img</span>}
                              </div>
                              <div><p className="font-semibold text-white">{prod.name}</p><p className="text-xs text-gray-500">{prod.category?.name || 'Category'}</p></div>
                            </td>
                            <td className="p-4"><p className="font-medium text-white">{prod.sku || '#ID-NULL'}</p><p className="text-xs text-gray-500">{new Date(prod.createdAt || Date.now()).toLocaleDateString('en-US', { month: 'short', day: '2-digit', year: 'numeric' })}</p></td>
                            <td className="p-4"><p className="font-medium text-white">${prod.basePrice || '0.00'}</p><p className="text-xs text-gray-500">Sell Price ${prod.basePrice || '0.00'}</p></td>
                            <td className="p-4 text-white">{prod.stock || '120,120'}</td>
                            <td className="p-4">{prod.isActive !== false ? <span className="px-2.5 py-1 rounded-md text-xs font-medium bg-green-900/30 text-green-400 border border-green-800/50">• Published</span> : <span className="px-2.5 py-1 rounded-md text-xs font-medium bg-red-900/30 text-red-400 border border-red-800/50">• Inactive</span>}</td>
                          </tr>
                        );
                      }) : <tr><td colSpan={6} className="p-8 text-center text-gray-500">No products found.</td></tr>}
                    </tbody>
                  </table>
                </div>

                {selectedItems.length > 0 && (
                  <div className="fixed bottom-10 left-1/2 -translate-x-1/2 bg-[#1a1a1a] border border-[#333] shadow-2xl rounded-xl px-2 py-2 flex items-center gap-2 z-50">
                    <span className="text-white text-sm font-semibold px-4">{selectedItems.length} Selected</span><div className="w-px h-6 bg-[#333]"></div>
                    <button className="flex items-center gap-2 text-gray-300 hover:text-white text-sm px-4 py-2 rounded-lg hover:bg-[#262626] transition">↓ Export</button>
                    <button className="flex items-center gap-2 text-gray-300 hover:text-white text-sm px-4 py-2 rounded-lg hover:bg-[#262626] transition">✎ Edit Info</button>
                    <button className="flex items-center gap-2 text-red-400 hover:text-red-300 text-sm px-4 py-2 rounded-lg hover:bg-[#262626] transition">🗑 Delete</button>
                    <div className="w-px h-6 bg-[#333]"></div>
                    <button onClick={() => setSelectedItems([])} className="text-gray-400 hover:text-white px-3 text-lg font-bold">×</button>
                  </div>
                )}
              </>
            ) : (
              <div className="max-w-5xl mx-auto flex flex-col gap-6">
                <div className="flex justify-between items-center">
                  <h1 className="text-2xl font-semibold text-white">Add New Product</h1>
                  <button onClick={() => setProductView('table')} className="text-gray-400 hover:text-white text-sm">← Back to List</button>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                  <div className="lg:col-span-2 bg-[#141414] border border-[#262626] rounded-xl p-6">
                    <div className="flex justify-between items-center mb-4"><h3 className="font-semibold text-white">Add Product Photo</h3><span className="text-gray-500">•••</span></div>
                    <div className="border-2 border-dashed border-[#333] rounded-xl flex flex-col items-center justify-center p-12 cursor-pointer hover:border-[#d4af37] transition bg-[#0a0a0a]">
                      <div className="w-12 h-12 bg-[#1a1a1a] rounded-full flex items-center justify-center mb-4"><svg className="w-5 h-5 text-[#d4af37]" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12"></path></svg></div>
                      <p className="text-white font-medium mb-1">Upload images or click here</p>
                      <p className="text-xs text-gray-500">1600 x 1200 (4:3) recommended. PNG, JPG and GIF files are allowed</p>
                    </div>
                    <div className="flex gap-4 mt-6">
                      <div className="w-20 h-20 rounded-lg border border-[#d4af37] p-1 bg-[#0a0a0a]"><img src={newProduct.imagePreview} alt="thumb" className="w-full h-full object-contain" /></div>
                      <div className="w-20 h-20 rounded-lg border border-[#333] p-1 bg-[#0a0a0a] flex items-center justify-center text-gray-600 text-xs">+</div>
                    </div>
                  </div>

                  <div className="bg-[#141414] border border-[#262626] rounded-xl p-6 flex flex-col items-center justify-center">
                    <div className="w-full bg-[#0a0a0a] rounded-xl p-4 flex items-center justify-center mb-6 h-48 border border-[#262626]"><img src={newProduct.imagePreview} alt="Preview" className="max-h-full object-contain drop-shadow-xl" /></div>
                    <div className="w-full text-left">
                      <span className="px-2 py-1 bg-[#d4af37]/20 text-[#d4af37] text-[10px] font-bold uppercase rounded-md mb-3 inline-block">{newProduct.category}</span>
                      <h3 className="text-lg font-bold text-white mb-2">{newProduct.name || 'Product Name Title'}</h3>
                      <p className="text-sm text-gray-400 mb-2">Brand: <span className="text-white">{newProduct.brand || '-'}</span></p>
                      <div className="flex items-center gap-3"><span className="text-xl font-bold text-white">${newProduct.basePrice || '0.00'}</span><span className="text-sm text-gray-500 line-through">${Number(newProduct.basePrice || 0) * 1.2 || '0.00'}</span></div>
                    </div>
                  </div>
                </div>

                <div className="bg-[#141414] border border-[#262626] rounded-xl p-6">
                  <div className="flex justify-between items-center mb-6"><h3 className="font-semibold text-white">Product Information</h3><span className="text-gray-500">•••</span></div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                    <div><label className={labelClass}>Product Name</label><input name="name" value={newProduct.name} onChange={handleInput} placeholder="e.g. Montecristo 1935" className={inputClass} /></div>
                    <div>
                      <label className={labelClass}>Product Categories</label>
                      <select name="category" value={newProduct.category} onChange={handleInput} className={inputClass}><option className="bg-[#141414]">Premium Cigars</option><option className="bg-[#141414]">Accessories</option></select>
                    </div>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
                    <div><label className={labelClass}>Brand</label><input name="brand" value={newProduct.brand} onChange={handleInput} placeholder="Larkon Fashion" className={inputClass} /></div>
                    <div><label className={labelClass}>SKU / Tag Number</label><input name="sku" value={newProduct.sku} onChange={handleInput} placeholder="LAC-002" className={inputClass} /></div>
                    <div><label className={labelClass}>Base Price ($)</label><input name="basePrice" type="number" value={newProduct.basePrice} onChange={handleInput} placeholder="150" className={inputClass} /></div>
                  </div>

                  <div className="mb-6">
                    <label className={labelClass}>Description</label>
                    <textarea name="description" rows={4} value={newProduct.description} onChange={handleInput} placeholder="Describe the product details here..." className={inputClass}></textarea>
                  </div>

                  <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-8 pt-6 border-t border-[#262626]">
                    <div><label className={labelClass}>Origin</label><input name="origin" value={newProduct.origin} onChange={handleInput} className={inputClass} /></div>
                    <div><label className={labelClass}>Wrapper</label><input name="wrapper" value={newProduct.wrapper} onChange={handleInput} className={inputClass} /></div>
                    <div><label className={labelClass}>Binder / Filler</label><input name="binderFiller" value={newProduct.binderFiller} onChange={handleInput} className={inputClass} /></div>
                    <div><label className={labelClass}>Shape</label><input name="shape" value={newProduct.shape} onChange={handleInput} className={inputClass} /></div>
                    <div><label className={labelClass}>Strength</label><input name="strength" value={newProduct.strength} onChange={handleInput} className={inputClass} /></div>
                    <div><label className={labelClass}>Flavored</label><input name="flavored" value={newProduct.flavored} onChange={handleInput} className={inputClass} /></div>
                    <div><label className={labelClass}>Length & Ring</label><div className="flex gap-2"><input name="length" value={newProduct.length} onChange={handleInput} placeholder="L" className={inputClass} /><input name="ring" value={newProduct.ring} onChange={handleInput} placeholder="R" className={inputClass} /></div></div>
                    <div><label className={labelClass}>Stock & Box Info</label><div className="flex gap-2"><input name="stock" type="number" value={newProduct.stock} onChange={handleInput} placeholder="Qty" className={inputClass} /><input name="boxInfo" value={newProduct.boxInfo} onChange={handleInput} placeholder="Box" className={inputClass} /></div></div>
                  </div>

                  <div className="flex justify-end gap-4 pt-6 border-t border-[#262626]">
                    <button onClick={() => setProductView('table')} className="px-6 py-2.5 rounded-lg text-sm font-medium border border-[#333] text-gray-300 hover:bg-[#1a1a1a] transition">Cancel</button>
                    <button className="px-8 py-2.5 rounded-lg text-sm font-medium bg-[#d4af37] text-black hover:bg-[#c69c38] transition shadow-lg">Save Product</button>
                  </div>
                </div>
              </div>
            )
          ) : (
            <div>
              <h1 className="text-2xl font-semibold text-white mb-6">{activeMenu?.label}</h1>
              <DynamicTable data={initialData?.[activeMenu?.dataKey || ''] || []} />
            </div>
          )}
        </div>
      </main>
    </div>
  );
}