import { prisma } from '../../lib/prisma';
import AdminDashboardClient from './AdminDashboardClient';

export default async function AdminPage() {
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

  // Konversi semua tipe khusus Prisma (Decimal, Date) menjadi objek/string plain JS
  const sanitizedData = JSON.parse(JSON.stringify(initialData));

  return <AdminDashboardClient initialData={sanitizedData} />;
}