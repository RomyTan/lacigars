'use client';

import { useState, useRef } from 'react';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';
import { submitOrder } from './actions';
import { useTransition } from 'react';

export default function CatalogClient({ products, userName }: { products: any[], userName?: string }) {
  const container = useRef<HTMLDivElement>(null);
  const [cart, setCart] = useState<Record<number, number>>({}); 
  const [isCartOpen, setIsCartOpen] = useState(false); // State untuk modal checkout
  const [isPending, startTransition] = useTransition();

const handleCheckout = () => {
  startTransition(async () => {
    // Angka 1 adalah ID dummy dari user "John Doe" yang kita buat di file seed.ts
    const res = await submitOrder(1, grandTotal, cart, products); 
    if (res.success) {
      alert(`Sukses! B2B Order #${res.orderId} masuk ke sistem.`);
      setCart({});
      setIsCartOpen(false);
    }
  });
};

  useGSAP(() => {
    gsap.from('.product-card', {
      y: 30,
      opacity: 0,
      duration: 0.5,
      stagger: 0.1,
      ease: 'power2.out',
    });
  }, { scope: container });

  const handleQty = (id: number, delta: number) => {
    setCart((prev) => {
      const newQty = Math.max(0, (prev[id] || 0) + delta);
      const newCart = { ...prev };
      
      if (newQty === 0) delete newCart[id];
      else newCart[id] = newQty;
      
      // Tutup modal otomatis kalau keranjang kosong
      if (Object.keys(newCart).length === 0) setIsCartOpen(false);
      
      return newCart;
    });
  };

  const totalItems = Object.values(cart).reduce((a, b) => a + b, 0);
  
  // Hitung total harga pesanan (berdasarkan harga final user)
  const grandTotal = products.reduce((total, product) => {
    const qty = cart[product.id] || 0;
    return total + (qty * product.finalPrice);
  }, 0);

  return (
    <main ref={container} className="min-h-screen bg-gray-50 p-8 pb-32 relative">
      <header className="mb-10 flex justify-between items-end">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-gray-900">B2B Wholesale Portal</h1>
          <p className="text-gray-500">Latin American Cigars Corp</p>
        </div>
        {userName && (
          <p className="text-sm font-semibold text-blue-600 bg-blue-50 px-3 py-1 rounded-full">
            Logged in as: {userName} (Distributor)
          </p>
        )}
      </header>

      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {products.map((product) => (
          <div key={product.id} className="product-card rounded-xl bg-white p-6 shadow-sm ring-1 ring-gray-100">
            <div className="mb-4">
              <span className="inline-block rounded-full bg-gray-100 px-2 py-1 text-xs font-medium text-gray-600">
                {product.categoryName}
              </span>
            </div>
            <h2 className="text-lg font-semibold text-gray-900">{product.name}</h2>
            <p className="text-sm text-gray-500 mb-4">SKU: {product.sku}</p>
            
            <div className="flex items-center justify-between border-t pt-4">
              <div>
                <p className="text-xs text-gray-400">Your Price</p>
                <div className="flex items-baseline gap-2">
                  <p className="text-lg font-bold text-black">${product.finalPrice}</p>
                  {product.isTiered && (
                    <p className="text-sm text-gray-400 line-through">${product.basePrice}</p>
                  )}
                </div>
              </div>
              
              {!cart[product.id] ? (
                <button 
                  onClick={() => handleQty(product.id, 1)}
                  className="rounded-md bg-black px-4 py-2 text-sm font-semibold text-white hover:bg-gray-800 transition"
                >
                  Add to Order
                </button>
              ) : (
                <div className="flex items-center gap-3 rounded-md border border-gray-300 p-1">
                  <button onClick={() => handleQty(product.id, -1)} className="w-8 h-8 flex items-center justify-center font-bold text-gray-600 hover:bg-gray-100 rounded">-</button>
                  <span className="w-4 text-center font-semibold">{cart[product.id]}</span>
                  <button onClick={() => handleQty(product.id, 1)} className="w-8 h-8 flex items-center justify-center font-bold text-gray-600 hover:bg-gray-100 rounded">+</button>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Floating Cart Panel */}
      {totalItems > 0 && !isCartOpen && (
        <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 shadow-[0_-10px_15px_-3px_rgba(0,0,0,0.05)] p-4 px-8 flex justify-between items-center z-40">
          <div>
            <p className="text-sm text-gray-500">Selected Items</p>
            <p className="text-xl font-bold text-black">{totalItems} Units</p>
          </div>
          <button 
            onClick={() => setIsCartOpen(true)}
            className="bg-black text-white px-8 py-3 rounded-lg font-bold hover:bg-gray-800 transition"
          >
            Review Order
          </button>
        </div>
      )}

      {/* Checkout Modal Overlay */}
      {isCartOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 backdrop-blur-sm">
          <div className="w-full max-w-md rounded-xl bg-white p-6 shadow-2xl">
            <div className="mb-4 flex items-center justify-between">
              <h2 className="text-xl font-bold text-black">Order Summary</h2>
              <button 
                onClick={() => setIsCartOpen(false)} 
                className="text-gray-400 hover:text-black font-bold text-xl"
              >
                ✕
              </button>
            </div>
            
            <div className="max-h-60 overflow-y-auto border-b border-t border-gray-100 py-4">
              {products.filter(p => cart[p.id]).map(p => (
                <div key={p.id} className="mb-3 flex justify-between text-sm">
                  <div>
                    <p className="font-semibold text-black">{p.name}</p>
                    <p className="text-gray-500">{cart[p.id]} x ${p.finalPrice}</p>
                  </div>
                  <p className="font-bold text-black">${cart[p.id] * p.finalPrice}</p>
                </div>
              ))}
            </div>
            
            <div className="mt-4 flex justify-between text-lg font-bold text-black">
              <span>Total</span>
              <span>${grandTotal}</span>
            </div>
            
            <button 
            onClick={handleCheckout}
            disabled={isPending}
            className="mt-6 w-full rounded-lg bg-blue-600 py-3 font-bold text-white hover:bg-blue-700 transition disabled:bg-gray-400"
            >
            {isPending ? 'Processing...' : 'Submit B2B Order'}
            </button>
          </div>
        </div>
      )}
    </main>
  );
}