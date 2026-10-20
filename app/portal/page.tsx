import { prisma } from '../lib/prisma'; 
import CatalogClient from './CatalogClient';

export default async function CatalogPage() {
  // 1. Simulasi User Login (Nanti diganti pakai NextAuth/Auth.js)
  const currentUser = await prisma.user.findUnique({
    where: { email: 'client@store.com' }
  });

  // 2. Tarik Data Mentah
  const rawProducts = await prisma.product.findMany({
    include: { 
      category: true,
      tierPrices: true 
    },
  });

  // 3. Kalkulasi Harga Berdasarkan Grup User
  const products = rawProducts.map((product) => {
    const tierPrice = product.tierPrices.find((t) => t.groupId === currentUser?.groupId);
    return {
      id: product.id,
      name: product.name,
      sku: product.sku,
      categoryName: product.category.name,
      basePrice: Number(product.basePrice),
      finalPrice: tierPrice ? Number(tierPrice.price) : Number(product.basePrice),
      isTiered: !!tierPrice, // Cek apakah dapat harga khusus
    };
  });

  return <CatalogClient products={products} userName={currentUser?.name} />;
}