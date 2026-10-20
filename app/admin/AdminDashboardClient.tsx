'use client';

import { useState } from 'react';
import { addProduct } from './actions';

export default function AdminDashboardClient({ categories, products }: { categories: any[]; products: any[] }) {
  const [activeTab, setActiveTab] = useState('products');
  
  const [formData, setFormData] = useState({
    name: '',
    sku: '',
    basePrice: '',
    brand: '',
    shape: '',
    boxInfo: 'Box of 10',
  });

  const [imagePreview, setImagePreview] = useState<string | null>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const previewUrl = URL.createObjectURL(file);
      setImagePreview(previewUrl);
    }
  };

  const handleCancel = () => {
    setFormData({
      name: '',
      sku: '',
      basePrice: '',
      brand: '',
      shape: '',
      boxInfo: 'Box of 10',
    });
    setImagePreview(null);
  };

  return (
    <main className="min-h-screen bg-gray-100 flex">
      <aside className="w-64 bg-white border-r p-6 hidden md:block">
        <h2 className="text-lg font-bold text-black mb-6">LAC Admin Panel</h2>
        <nav className="space-y-2">
          <button
            onClick={() => setActiveTab('products')}
            className={`w-full text-left px-4 py-2 rounded-lg text-sm font-medium ${
              activeTab === 'products' ? 'bg-black text-white' : 'text-gray-700 hover:bg-gray-100'
            }`}
          >
            📦 Products & Catalog
          </button>
          <button
            onClick={() => setActiveTab('orders')}
            className={`w-full text-left px-4 py-2 rounded-lg text-sm font-medium ${
              activeTab === 'orders' ? 'bg-black text-white' : 'text-gray-700 hover:bg-gray-100'
            }`}
          >
            📋 Orders Management
          </button>
        </nav>
      </aside>

      <div className="flex-1 p-8 overflow-y-auto">
        {activeTab === 'products' && (
          <div>
            <h1 className="text-2xl font-bold mb-6 text-black">Product Management & Preview</h1>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-stretch">
              
              <div className="bg-white p-6 rounded-xl shadow-sm h-full flex flex-col justify-between">
                <h2 className="text-lg font-semibold mb-4 text-black">Add New Cigar</h2>
                <form action={addProduct} className="space-y-3 flex-1 flex flex-col justify-between">
                  <div className="space-y-3">
                    <div>
                      <label className="block text-xs font-medium text-gray-700">Product Name</label>
                      <input name="name" value={formData.name} onChange={handleChange} required placeholder="e.g. Montecristo 1935..." className="w-full mt-1 border rounded-md p-2 text-black text-xs" />
                    </div>
                    <div className="grid grid-cols-2 gap-2">
                      <div>
                        <label className="block text-xs font-medium text-gray-700">SKU</label>
                        <input name="sku" value={formData.sku} onChange={handleChange} required placeholder="LAC-002" className="w-full mt-1 border rounded-md p-2 text-black text-xs" />
                      </div>
                      <div>
                        <label className="block text-xs font-medium text-gray-700">Base Price ($)</label>
                        <input name="basePrice" type="number" step="0.01" value={formData.basePrice} onChange={handleChange} required placeholder="150" className="w-full mt-1 border rounded-md p-2 text-black text-xs" />
                      </div>
                    </div>

                    <div>
                      <label className="block text-xs font-medium text-gray-700">Category</label>
                      <select name="categoryId" className="w-full mt-1 border rounded-md p-2 text-black text-xs">
                        {categories.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                      </select>
                    </div>

                    <hr className="my-2" />
                    <p className="text-xs font-bold text-gray-900">Cigar Specifications</p>

                    <div className="grid grid-cols-2 gap-2">
                      <div>
                        <label className="block text-[11px] text-gray-600">Brand</label>
                        <input name="brand" value={formData.brand} onChange={handleChange} placeholder="Montecristo" className="w-full border rounded p-1.5 text-black text-xs" />
                      </div>
                      <div>
                        <label className="block text-[11px] text-gray-600">Origin</label>
                        <input name="origin" placeholder="Nicaragua" className="w-full border rounded p-1.5 text-black text-xs" />
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-2">
                      <div>
                        <label className="block text-[11px] text-gray-600">Wrapper</label>
                        <input name="wrapper" placeholder="Nicaragua" className="w-full border rounded p-1.5 text-black text-xs" />
                      </div>
                      <div>
                        <label className="block text-[11px] text-gray-600">Binder / Filler</label>
                        <input name="binderFiller" placeholder="Nicaragua / Nicaragua" className="w-full border rounded p-1.5 text-black text-xs" />
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-2">
                      <div>
                        <label className="block text-[11px] text-gray-600">Shape</label>
                        <input name="shape" value={formData.shape} onChange={handleChange} placeholder="Torpedo" className="w-full border rounded p-1.5 text-black text-xs" />
                      </div>
                      <div>
                        <label className="block text-[11px] text-gray-600">Strength</label>
                        <input name="strength" placeholder="Medium - Full" className="w-full border rounded p-1.5 text-black text-xs" />
                      </div>
                    </div>

                    <div className="grid grid-cols-3 gap-2">
                      <div>
                        <label className="block text-[11px] text-gray-600">Flavored</label>
                        <input name="flavored" placeholder="No" className="w-full border rounded p-1.5 text-black text-xs" />
                      </div>
                      <div>
                        <label className="block text-[11px] text-gray-600">Length</label>
                        <input name="length" placeholder="6,14" className="w-full border rounded p-1.5 text-black text-xs" />
                      </div>
                      <div>
                        <label className="block text-[11px] text-gray-600">Ring</label>
                        <input name="ring" placeholder="52" className="w-full border rounded p-1.5 text-black text-xs" />
                      </div>
                    </div>

                    <div>
                      <label className="block text-[11px] text-gray-600">Box Info</label>
                      <input name="boxInfo" value={formData.boxInfo} onChange={handleChange} placeholder="Box of 10" className="w-full border rounded p-1.5 text-black text-xs" />
                    </div>

                    <div>
                      <label className="block text-[11px] text-gray-600">Product Image File</label>
                      <input name="image" type="file" accept="image/*" onChange={handleImageChange} className="w-full mt-1 border rounded p-1.5 text-black text-xs bg-white file:mr-4 file:py-1 file:px-2 file:rounded file:border-0 file:text-xs file:font-semibold file:bg-black file:text-white hover:file:bg-gray-800" />
                    </div>

                    <div>
                      <label className="block text-xs font-medium text-gray-700">Description</label>
                      <textarea name="description" rows={2} className="w-full mt-1 border rounded-md p-2 text-black text-xs" />
                    </div>
                  </div>

                  <div className="flex gap-3 pt-4">
                    <button type="submit" className="flex-1 bg-black text-white py-2 rounded-md font-semibold hover:bg-gray-800 text-xs">
                      Publish Product
                    </button>
                    <button type="button" onClick={handleCancel} className="px-4 bg-gray-200 text-gray-800 py-2 rounded-md font-semibold hover:bg-gray-300 text-xs">
                      Cancel
                    </button>
                  </div>
                </form>
              </div>

              <div className="bg-white p-6 rounded-xl shadow-sm h-full flex flex-col justify-between border border-dashed border-gray-300">
                <div>
                  <h2 className="text-lg font-semibold mb-4 text-black">Live Product Preview</h2>
                  <div className="border rounded-lg p-4 bg-gray-50 space-y-4">
                    <div className="w-full aspect-square bg-gray-200 rounded-md overflow-hidden flex items-center justify-center">
                      {imagePreview ? (
                        <img src={imagePreview} alt="Preview" className="w-full h-full object-contain" />
                      ) : (
                        <span className="text-xs text-gray-400">Image Preview Area (1:1)</span>
                      )}
                    </div>
                    <div>
                      <h3 className="text-base font-bold text-black">{formData.name || 'Montecristo 1935 Anniversary'}</h3>
                      <p className="text-xs text-gray-500 font-mono">SKU: {formData.sku || 'LAC-001'}</p>
                    </div>
                    <div className="text-xs space-y-1 text-gray-700 border-t pt-2">
                      <p><strong className="text-black">Brand:</strong> {formData.brand || '-'}</p>
                      <p><strong className="text-black">Shape:</strong> {formData.shape || '-'}</p>
                      <p><strong className="text-black">Box Info:</strong> {formData.boxInfo || '-'}</p>
                      <p className="text-sm font-bold text-black pt-1">Price: ${formData.basePrice || '0.00'}</p>
                    </div>
                  </div>
                </div>
              </div>

            </div>
          </div>
        )}

        {activeTab === 'orders' && (
          <div>
            <h1 className="text-2xl font-bold mb-6 text-black">Orders Management</h1>
            <p className="text-gray-600 text-sm">Modul kelola pesanan aktif.</p>
          </div>
        )}
      </div>
    </main>
  );
}