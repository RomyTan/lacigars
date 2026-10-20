import { prisma } from '../../lib/prisma';
import { cookies } from 'next/headers';

export default async function OrderHistoryPage() {
  const cookieStore = await cookies();
  const userId = Number(cookieStore.get('userId')?.value || 1);

  const orders = await prisma.order.findMany({
    where: { userId },
    include: { items: true },
    orderBy: { createdAt: 'desc' }
  });

  return (
    <main className="min-h-screen bg-gray-100 p-8">
      <h1 className="text-2xl font-bold mb-6 text-black">Order History & Reorder</h1>
      
      {orders.length === 0 ? (
        <p className="text-gray-600 text-sm">Belum ada riwayat pesanan.</p>
      ) : (
        <div className="space-y-4 max-w-4xl">
          {orders.map(order => (
            <div key={order.id} className="bg-white p-6 rounded-xl shadow-sm border">
              <div className="flex justify-between items-center mb-4">
                <div>
                  <span className="font-bold text-black">{order.orderNumber}</span>
                  <span className="ml-3 text-xs bg-gray-200 px-2 py-1 rounded text-gray-800">{order.status}</span>
                </div>
                <span className="text-sm font-bold text-black">${order.totalAmount.toString()}</span>
              </div>
              
              <div className="text-xs text-gray-500 mb-3">
                Total Units: {order.totalUnits} | Tanggal: {new Date(order.createdAt).toLocaleString()}
              </div>

              <div className="border-t pt-3">
                <ul className="space-y-1 text-sm text-black">
                  {order.items.map(item => (
                    <li key={item.id} className="flex justify-between text-xs">
                      <span>{item.quantity}x {item.name} ({item.sku})</span>
                      <span className="font-medium">${item.lineTotal.toString()}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          ))}
        </div>
      )}
    </main>
  );
}