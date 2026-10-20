'use server';

import { prisma } from '../../lib/prisma';
import { revalidatePath } from 'next/cache';
import { writeFile, mkdir } from 'fs/promises';
import path from 'path';

export async function addProduct(formData: FormData) {
  const name = formData.get('name') as string;
  const sku = formData.get('sku') as string;
  const categoryId = Number(formData.get('categoryId'));
  const basePrice = Number(formData.get('basePrice'));
  const description = formData.get('description') as string;

  // Spesifikasi Cerutu
  const brand = formData.get('brand') as string;
  const origin = formData.get('origin') as string;
  const wrapper = formData.get('wrapper') as string;
  const binderFiller = formData.get('binderFiller') as string;
  const shape = formData.get('shape') as string;
  const strength = formData.get('strength') as string;
  const flavored = formData.get('flavored') as string;
  const length = formData.get('length') as string;
  const ring = formData.get('ring') as string;
  const boxInfo = formData.get('boxInfo') as string;

  // Handle File Upload
  const imageFile = formData.get('image') as File;
  let imageUrl = 'https://images.unsplash.com/photo-1579783902614-a3fb3927b675?w=500';

  if (imageFile && imageFile.size > 0) {
    const bytes = await imageFile.arrayBuffer();
    const buffer = Buffer.from(bytes);

    const uploadDir = path.join(process.cwd(), 'public', 'uploads');
    await mkdir(uploadDir, { recursive: true });

    const filename = `${Date.now()}-${imageFile.name.replaceAll(' ', '_')}`;
    await writeFile(path.join(uploadDir, filename), buffer);
    imageUrl = `/uploads/${filename}`;
  }

  await prisma.product.create({
    data: {
      name,
      sku,
      categoryId,
      basePrice,
      description,
      brand,
      origin,
      wrapper,
      binderFiller,
      shape,
      strength,
      flavored,
      length,
      ring,
      boxInfo,
      image: imageUrl,
    },
  });

  revalidatePath('/admin');
}