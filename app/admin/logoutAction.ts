'use server';

import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';

export async function logoutUser() {
  const cookieStore = await cookies();
  
  // Metode Sapu Jagat: Hapus SEMUA cookie yang nyangkut di browser
  const allCookies = cookieStore.getAll();
  allCookies.forEach((cookie) => {
    cookieStore.delete(cookie.name);
  });
  
  // Lempar ke halaman login
  redirect('/admin/login');
}