'use server';

import { prisma } from '../lib/prisma';

export async function submitOrder(userId: number, total: number, cart: Record<number, number>, products: any[]) {
  const orderNumber = `LAC-${Date.now()}`;
  const totalUnits = Object.values(cart).reduce((sum, qty) => sum + qty, 0);

  const order = await prisma.order.create({
    data: {
      orderNumber,
      userId,
      totalUnits,
      totalAmount: total,
      items: {
        create: Object.entries(cart).map(([productId, quantity]) => {
          const product = products.find(p => p.id === Number(productId));
          const lineTotal = quantity * product.finalPrice;
          return {
            productId: Number(productId),
            sku: product.sku,
            name: product.name,
            quantity,
            unitPrice: product.finalPrice,
            lineTotal,
          };
        })
      }
    }
  });
  return { success: true, orderId: order.id };
}