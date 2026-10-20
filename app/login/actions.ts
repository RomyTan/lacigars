'use server';

import { prisma } from '../../lib/prisma';
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';

export async function login(formData: FormData) {
  try {
    const email = formData.get('email') as string;
    const user = await prisma.user.findUnique({ where: { email } });

    if (!user) {
      console.error('Login failed: Email not found:', email);
      return;
    }

    const cookieStore = await cookies();
    cookieStore.set('userId', user.id.toString());
    cookieStore.set('userRole', user.role);

    if (user.role === 'ADMIN') {
      redirect('/admin');
    } else {
      redirect('/');
    }
  } catch (error: any) {
    // Abaikan error redirect bawaan Next.js
    if (error.message?.includes('NEXT_REDIRECT')) {
      throw error;
    }
    console.error('Database/Server Error saat Login:', error);
  }
}