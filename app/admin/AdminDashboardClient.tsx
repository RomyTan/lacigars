'use client';
import { useState } from 'react';

// Komponen Tabel Dinamis dengan fitur Thumbnail Gambar
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
                  {/* Render gambar jika nama kolom adalah 'image' atau 'images' */}
                  {h.toLowerCase() === 'image' || h.toLowerCase() === 'images' ? (
                    row[h] && row[h] !== 'null' ? (
                      <img src={row[h]} alt="thumbnail" className="w-12 h-12 object-cover rounded-md border" />
                    ) : (
                      <span className="text-gray-400 italic">No Image</span>
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
  // State untuk berpindah antara tampilan Tabel dan tampilan Form Add Product
  const [productView, setProductView] = useState<'table' | 'add'>('table');

  // State untuk form & Live Preview
  const [newProduct, setNewProduct] = useState({
    name: '',
    sku: '',
    basePrice: '',
    category: 'Premium Cigars',
    brand: '',
    origin: '',
    wrapper: '',
    binderFiller: '',
    shape: '',
    strength: '',
    flavored: 'No',
    length: '',
    ring: '',
    boxInfo: '',
    description: '',
    imagePreview: '/uploads/1790012363796-Double_Corona-c.jpg' // Dummy image untuk contoh
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

  return (
    <div className="flex min-h-screen bg-gray-50">
      <aside className="w-72 bg-white shadow-md p-4 border-r border-gray-200">
        <h2 className="text-xl font-bold mb-8 mt-2 text-black px-4">LAC Admin Panel</h2>
        <nav className="flex flex-col gap-1.5">
          {menuItems.map((item) => (
            <button
              key={item.id}
              onClick={() => {
                setActiveTab(item.id);
                if (item.id !== 'Product') setProductView('table');
              }}
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

      <main className="flex-1 p-8 overflow-auto text-black">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold">
            {activeTab === 'Product' && productView === 'add' 
              ? 'Product Management & Preview' 
              : activeMenu?.label}
          </h1>
          
          {/* Tombol Add New Product */}
          {activeTab === 'Product' && productView === 'table' && (
            <button 
              onClick={() => setProductView('add')}
              className="bg-black text-white px-5 py-2.5 rounded-lg text-sm font-bold shadow-md hover:bg-gray-800 transition-colors"
            >
              + Add New Product
            </button>
          )}
        </div>

        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-200 min-h-[500px]">
          {activeTab === 'Product' ? (
            productView === 'table' ? (
              <DynamicTable data={initialData?.products || []} />
            ) : (
              /* TAMPILAN FORM ADD PRODUCT & LIVE PREVIEW */
              <div className="flex flex-col lg:flex-row gap-10">
                
                {/* Form Input (Kiri) */}
                <div className="flex-1 bg-white">
                  <h2 className="text-lg font-bold mb-4">Add New Cigar</h2>
                  
                  <div className="space-y-4 text-sm">
                    <div>
                      <label className="block text-gray-600 mb-1">Product Name</label>
                      <input name="name" value={newProduct.name} onChange={handleInput} placeholder="e.g. Montecristo 1935..." className="w-full border rounded-md p-2" />
                    </div>
                    
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-gray-600 mb-1">SKU</label>
                        <input name="sku" value={newProduct.sku} onChange={handleInput} placeholder="LAC-002" className="w-full border rounded-md p-2" />
                      </div>
                      <div>
                        <label className="block text-gray-600 mb-1">Base Price ($)</label>
                        <input name="basePrice" type="number" value={newProduct.basePrice} onChange={handleInput} placeholder="150" className="w-full border rounded-md p-2" />
                      </div>
                    </div>

                    <div>
                      <label className="block text-gray-600 mb-1">Category</label>
                      <select name="category" value={newProduct.category} onChange={handleInput} className="w-full border rounded-md p-2">
                        <option>Premium Cigars</option>
                        <option>Accessories</option>
                      </select>
                    </div>

                    <h3 className="font-bold pt-4 border-t">Cigar Specifications</h3>
                    
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-gray-600 mb-1">Brand</label>
                        <input name="brand" value={newProduct.brand} onChange={handleInput} placeholder="Montecristo" className="w-full border rounded-md p-2" />
                      </div>
                      <div>
                        <label className="block text-gray-600 mb-1">Origin</label>
                        <input name="origin" value={newProduct.origin} onChange={handleInput} placeholder="Nicaragua" className="w-full border rounded-md p-2" />
                      </div>
                      <div>
                        <label className="block text-gray-600 mb-1">Wrapper</label>
                        <input name="wrapper" value={newProduct.wrapper} onChange={handleInput} placeholder="Nicaragua" className="w-full border rounded-md p-2" />
                      </div>
                      <div>
                        <label className="block text-gray-600 mb-1">Binder / Filler</label>
                        <input name="binderFiller" value={newProduct.binderFiller} onChange={handleInput} placeholder="Nicaragua / Nicaragua" className="w-full border rounded-md p-2" />
                      </div>
                      <div>
                        <label className="block text-gray-600 mb-1">Shape</label>
                        <input name="shape" value={newProduct.shape} onChange={handleInput} placeholder="Torpedo" className="w-full border rounded-md p-2" />
                      </div>
                      <div>
                        <label className="block text-gray-600 mb-1">Strength</label>
                        <input name="strength" value={newProduct.strength} onChange={handleInput} placeholder="Medium - Full" className="w-full border rounded-md p-2" />
                      </div>
                    </div>

                    <div className="grid grid-cols-3 gap-4">
                      <div>
                        <label className="block text-gray-600 mb-1">Flavored</label>
                        <input name="flavored" value={newProduct.flavored} onChange={handleInput} placeholder="No" className="w-full border rounded-md p-2" />
                      </div>
                      <div>
                        <label className="block text-gray-600 mb-1">Length</label>
                        <input name="length" value={newProduct.length} onChange={handleInput} placeholder="6.14" className="w-full border rounded-md p-2" />
                      </div>
                      <div>
                        <label className="block text-gray-600 mb-1">Ring</label>
                        <input name="ring" value={newProduct.ring} onChange={handleInput} placeholder="52" className="w-full border rounded-md p-2" />
                      </div>
                    </div>

                    <div>
                      <label className="block text-gray-600 mb-1">Box Info</label>
                      <input name="boxInfo" value={newProduct.boxInfo} onChange={handleInput} placeholder="Box of 10" className="w-full border rounded-md p-2" />
                    </div>

                    <div>
                      <label className="block text-gray-600 mb-1">Product Image File</label>
                      <input type="file" className="w-full border rounded-md p-1.5 text-sm" />
                    </div>

                    <div>
                      <label className="block text-gray-600 mb-1">Description</label>
                      <textarea name="description" rows={3} value={newProduct.description} onChange={handleInput} className="w-full border rounded-md p-2"></textarea>
                    </div>

                    <div className="flex gap-4 pt-4">
                      <button className="flex-1 bg-black text-white py-3 rounded-md font-bold hover:bg-gray-800 transition">
                        Publish Product
                      </button>
                      <button 
                        onClick={() => setProductView('table')} 
                        className="px-6 bg-gray-200 text-black py-3 rounded-md font-bold hover:bg-gray-300 transition"
                      >
                        Cancel
                      </button>
                    </div>
                  </div>
                </div>

                {/* Live Product Preview (Kanan) */}
                <div className="w-full lg:w-[350px]">
                  <h2 className="text-lg font-bold mb-4">Live Product Preview</h2>
                  <div className="border border-gray-200 rounded-xl p-5 shadow-sm bg-gray-50 flex flex-col">
                    <div className="bg-white rounded-lg p-4 mb-4 flex items-center justify-center min-h-[250px] shadow-sm">
                      {newProduct.imagePreview ? (
                        <img src={newProduct.imagePreview} alt="Preview" className="max-w-full max-h-[250px] object-contain" />
                      ) : (
                        <span className="text-gray-400">No Image</span>
                      )}
                    </div>
                    
                    <h3 className="text-lg font-bold leading-tight">{newProduct.name || 'Product Name'}</h3>
                    <p className="text-sm text-gray-500 mb-3">SKU: {newProduct.sku || '-'}</p>
                    <hr className="border-gray-300 mb-3" />
                    
                    <div className="text-sm flex flex-col gap-1.5">
                      <p><span className="font-semibold w-20 inline-block">Brand:</span> {newProduct.brand || '-'}</p>
                      <p><span className="font-semibold w-20 inline-block">Shape:</span> {newProduct.shape || '-'}</p>
                      <p><span className="font-semibold w-20 inline-block">Box Info:</span> {newProduct.boxInfo || '-'}</p>
                      <p className="mt-2 text-lg font-bold">Price: ${newProduct.basePrice || '0.00'}</p>
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
  );
}