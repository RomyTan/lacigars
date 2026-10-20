import { prisma } from '../../lib/prisma';
import AdminDashboardClient from './AdminDashboardClient';

export default async function AdminPage() {
  const categories = await prisma.category.findMany();
  const products = await prisma.product.findMany({ include: { category: true } });

  return <AdminDashboardClient categories={categories} products={products} />;
}