'use client';
import { useState } from 'react';

function DynamicTable({ data }: { data: any[] }) {
  if (!data || data.length === 0) return <div className="text-gray-500 mt-4">Belum ada data.</div>;
  
  const headers = Object.keys(data[0]);

  return (
    <div className="overflow-x-auto rounded-2xl border border-[#333] bg-[#1a1a1a]">
      <table className="w-full text-sm text-left text-gray-300">
        <thead className="bg-[#222] uppercase text-xs font-semibold text-[#d4af37] tracking-wider">
          <tr>
            {headers.map((h) => (
              <th key={h} className="p-4 border-b border-[#333]">{h}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {data.map((row, i) => (
            <tr key={i} className="border-b border-[#333] hover:bg-[#2a2a2a] transition-colors">
              {headers.map((h) => (
                <td key={h} className="p-4">
                  {h.toLowerCase() === 'image' || h.toLowerCase() === 'images' ? (
                    row[h] && row[h] !== 'null' ? (
                      <img src={row[h]} alt="thumbnail" className="w-10 h-10 object-cover rounded-lg border border-[#444]" />
                    ) : (
                      <span className="text-gray-600 text-xs italic">No Image</span>
                    )
                  ) : typeof row[h] === 'object' ? (
                    JSON.stringify(row[h])
                  ) : (
                    String(row[h] ?? '-')
                  )}
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
  const [productView, setProductView] = useState<'table' | 'add'>('table');

  const [newProduct, setNewProduct] = useState({
    name: '', sku: '', basePrice: '', category: 'Premium Cigars', brand: '', origin: '',
    wrapper: '', binderFiller: '', shape: '', strength: '', flavored: 'No',
    length: '', ring: '', boxInfo: '', description: '',
    imagePreview: '/uploads/1790012363796-Double_Corona-c.jpg'
  });

  const handleInput = (e: any) => {
    const { name, value } = e.target;
    setNewProduct(prev => ({ ...prev, [name]: value }));
  };

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

  const inputClass = "w-full bg-[#121212] border border-[#333] rounded-xl p-3 text-white focus:outline-none focus:border-[#d4af37] transition-colors";
  const labelClass = "block text-gray-400 text-xs uppercase tracking-wider mb-2 font-semibold";

  return (
    <div className="min-h-screen bg-[#0f0f0f] p-4 lg:p-6 font-sans text-gray-200 flex">
      {/* Container Utama Melengkung */}
      <div className="flex w-full bg-[#1e1e1e] rounded-[32px] shadow-2xl overflow-hidden border border-[#2a2a2a]">
        
        {/* Sidebar */}
        <aside className="w-72 bg-[#1e1e1e] p-6 flex flex-col border-r border-[#2a2a2a]">
          <div className="flex items-center gap-3 mb-10 px-2">
            <div className="w-3 h-3 rounded-full bg-[#d4af37]"></div>
            <h2 className="text-xl font-bold text-white tracking-widest uppercase">LAC Admin</h2>
          </div>
          
          <nav className="flex flex-col gap-2 flex-1 overflow-y-auto pr-2 custom-scrollbar">
            {menuItems.map((item) => {
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => {
                    setActiveTab(item.id);
                    if (item.id !== 'Product') setProductView('table');
                  }}
                  className={`flex items-center gap-4 px-4 py-3.5 rounded-2xl text-sm font-medium transition-all ${
                    isActive 
                      ? 'bg-[#2a2a2a] text-[#d4af37] shadow-inner border-l-4 border-[#d4af37]' 
                      : 'text-gray-400 hover:bg-[#252525] hover:text-white'
                  }`}
                >
                  <span className="text-lg opacity-80">{item.icon}</span>
                  {item.label}
                </button>
              );
            })}
          </nav>
        </aside>

        {/* Main Content */}
        <main className="flex-1 p-8 lg:p-10 overflow-auto bg-[#1a1a1a]">
          <div className="flex justify-between items-end mb-8 border-b border-[#333] pb-6">
            <div>
              <p className="text-[#d4af37] text-xs font-bold uppercase tracking-widest mb-1">Dashboard</p>
              <h1 className="text-3xl font-bold text-white">
                {activeTab === 'Product' && productView === 'add' ? 'Add New Cigar' : activeMenu?.label}
              </h1>
            </div>
            
            {activeTab === 'Product' && productView === 'table' && (
              <button 
                onClick={() => setProductView('add')}
                className="bg-[#5c3616] text-[#d4af37] px-6 py-3 rounded-xl text-sm font-bold shadow-lg hover:bg-[#4a2b11] transition-all flex items-center gap-2"
              >
                <span>+</span> New Product
              </button>
            )}
          </div>

          <div className="min-h-[500px]">
            {activeTab === 'Product' ? (
              productView === 'table' ? (
                <DynamicTable data={initialData?.products || []} />
              ) : (
                <div className="flex flex-col xl:flex-row gap-8">
                  {/* Form */}
                  <div className="flex-1 bg-[#1e1e1e] p-8 rounded-3xl border border-[#2a2a2a]">
                    <div className="space-y-5 text-sm">
                      <div>
                        <label className={labelClass}>Product Name</label>
                        <input name="name" value={newProduct.name} onChange={handleInput} placeholder="Montecristo 1935..." className={inputClass} />
                      </div>
                      <div className="grid grid-cols-2 gap-5">
                        <div>
                          <label className={labelClass}>SKU</label>
                          <input name="sku" value={newProduct.sku} onChange={handleInput} placeholder="LAC-002" className={inputClass} />
                        </div>
                        <div>
                          <label className={labelClass}>Base Price ($)</label>
                          <input name="basePrice" type="number" value={newProduct.basePrice} onChange={handleInput} placeholder="150" className={inputClass} />
                        </div>
                      </div>
                      <div>
                        <label className={labelClass}>Category</label>
                        <select name="category" value={newProduct.category} onChange={handleInput} className={inputClass}>
                          <option className="bg-[#121212]">Premium Cigars</option>
                          <option className="bg-[#121212]">Accessories</option>
                        </select>
                      </div>

                      <h3 className="font-bold text-[#d4af37] pt-6 border-t border-[#333] uppercase tracking-wider text-xs">Specifications</h3>
                      
                      <div className="grid grid-cols-2 gap-5">
                        <div><label className={labelClass}>Brand</label><input name="brand" value={newProduct.brand} onChange={handleInput} className={inputClass} /></div>
                        <div><label className={labelClass}>Origin</label><input name="origin" value={newProduct.origin} onChange={handleInput} className={inputClass} /></div>
                        <div><label className={labelClass}>Wrapper</label><input name="wrapper" value={newProduct.wrapper} onChange={handleInput} className={inputClass} /></div>
                        <div><label className={labelClass}>Binder / Filler</label><input name="binderFiller" value={newProduct.binderFiller} onChange={handleInput} className={inputClass} /></div>
                        <div><label className={labelClass}>Shape</label><input name="shape" value={newProduct.shape} onChange={handleInput} className={inputClass} /></div>
                        <div><label className={labelClass}>Strength</label><input name="strength" value={newProduct.strength} onChange={handleInput} className={inputClass} /></div>
                      </div>

                      <div className="grid grid-cols-3 gap-5">
                        <div><label className={labelClass}>Flavored</label><input name="flavored" value={newProduct.flavored} onChange={handleInput} className={inputClass} /></div>
                        <div><label className={labelClass}>Length</label><input name="length" value={newProduct.length} onChange={handleInput} className={inputClass} /></div>
                        <div><label className={labelClass}>Ring</label><input name="ring" value={newProduct.ring} onChange={handleInput} className={inputClass} /></div>
                      </div>

                      <div><label className={labelClass}>Box Info</label><input name="boxInfo" value={newProduct.boxInfo} onChange={handleInput} className={inputClass} /></div>
                      <div><label className={labelClass}>Description</label><textarea name="description" rows={3} value={newProduct.description} onChange={handleInput} className={inputClass}></textarea></div>

                      <div className="flex gap-4 pt-6">
                        <button className="flex-1 bg-[#d4af37] text-black py-3.5 rounded-xl font-bold hover:bg-[#c19b2e] transition shadow-lg">
                          Publish Product
                        </button>
                        <button onClick={() => setProductView('table')} className="px-8 bg-[#2a2a2a] text-white py-3.5 rounded-xl font-bold hover:bg-[#333] transition">
                          Cancel
                        </button>
                      </div>
                    </div>
                  </div>

                  {/* Preview */}
                  <div className="w-full xl:w-[380px]">
                    <div className="bg-[#1e1e1e] border border-[#2a2a2a] rounded-3xl p-6 sticky top-0 shadow-2xl">
                      <p className="text-gray-400 text-xs uppercase tracking-wider mb-4 font-semibold">Live Preview</p>
                      <div className="bg-[#121212] rounded-2xl p-6 mb-6 flex items-center justify-center min-h-[280px] border border-[#333]">
                        {newProduct.imagePreview ? (
                          <img src={newProduct.imagePreview} alt="Preview" className="max-w-full max-h-[260px] object-contain drop-shadow-2xl" />
                        ) : (
                          <span className="text-gray-600 italic">No Image</span>
                        )}
                      </div>
                      
                      <h3 className="text-xl font-bold text-white leading-tight">{newProduct.name || 'Cigar Name...'}</h3>
                      <p className="text-xs text-[#d4af37] font-mono mt-1 mb-4">SKU: {newProduct.sku || '---'}</p>
                      
                      <div className="text-sm flex flex-col gap-2 text-gray-300 bg-[#121212] p-4 rounded-xl border border-[#333]">
                        <p className="flex justify-between border-b border-[#222] pb-2"><span>Brand</span> <span className="text-white font-medium">{newProduct.brand || '-'}</span></p>
                        <p className="flex justify-between border-b border-[#222] pb-2"><span>Shape</span> <span className="text-white font-medium">{newProduct.shape || '-'}</span></p>
                        <p className="flex justify-between pb-1"><span>Box Info</span> <span className="text-white font-medium">{newProduct.boxInfo || '-'}</span></p>
                      </div>
                      <div className="mt-6 flex justify-between items-center bg-[#5c3616] p-4 rounded-xl border border-[#4a2b11]">
                        <span className="text-[#d4af37] font-semibold text-sm">Base Price</span>
                        <span className="text-2xl font-bold text-white">${newProduct.basePrice || '0.00'}</span>
                      </div>
                    </div>
                  </div>
                </div>
              )
            ) : (
              <DynamicTable data={initialData?.[activeMenu?.dataKey || ''] || []} />
            )}
          </div>
        </main>
      </div>
    </div>
  );
}