import { prisma } from '../../lib/prisma';
import AdminDashboardClient from './AdminDashboardClient';

export default async function AdminPage() {
  // Gunakan Promise.all agar ke-10 tabel ditarik secara bersamaan (paralel), loading jadi jauh lebih cepat
  const [
    products,
    categories,
    users,
    customerGroups,
    tierPrices,
    groupProductRules,
    customerOverrides,
    cartDrafts,
    orders,
    orderItems
  ] = await Promise.all([
    prisma.product.findMany({ include: { category: true } }),
    prisma.category.findMany(),
    prisma.user.findMany(),
    prisma.customerGroup.findMany(),
    prisma.tierPrice.findMany(),
    prisma.groupProductRule.findMany(),
    prisma.customerOverride.findMany(),
    prisma.cartDraft.findMany(),
    prisma.order.findMany(),
    prisma.orderItem.findMany()
  ]);

  const initialData = {
    products,
    categories,
    users,
    customerGroups,
    tierPrices,
    groupProductRules,
    customerOverrides,
    cartDrafts,
    orders,
    orderItems
  };

  return <AdminDashboardClient initialData={initialData} />;
}