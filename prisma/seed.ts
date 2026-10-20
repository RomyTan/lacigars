import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

async function main() {
  // 1. Buat Grup Kustomer
  const groupDistributor = await prisma.customerGroup.create({
    data: { name: 'Distributor' }
  });

  // 2. Buat User Kustomer
  await prisma.user.create({
    data: {
      email: 'client@store.com',
      passwordHash: 'dummyhash123',
      name: 'John Doe',
      companyName: 'Doe Cigar Lounge',
      role: 'CUSTOMER',
      groupId: groupDistributor.id
    }
  });

  // 3. Buat Kategori & Produk
  const cat = await prisma.category.create({
    data: { name: 'Premium Cigars' }
  });

  const product = await prisma.product.create({
    data: {
      sku: 'LAC-001',
      name: 'Habana Reserve Churchill',
      description: 'Premium hand-rolled cigar.',
      basePrice: 200.00,
      categoryId: cat.id
    }
  });

  // 4. Set Harga Khusus Grup Distributor (Tier Pricing)
  await prisma.tierPrice.create({
    data: {
      groupId: groupDistributor.id,
      productId: product.id,
      price: 150.00 // Harga lebih murah dari basePrice
    }
  });

  console.log('✅ Seeding data dummy berhasil!');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });