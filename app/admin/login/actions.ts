'use server';

import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';

// Tambahkan daftar user admin di sini
const ADMIN_USERS = [
  { username: 'angel', password: 'angel123' },
  { username: 'romy', password: 'romy123' },
];

export async function loginAdmin(prevState: any, formData: FormData) {
  const user = formData.get('username');
  const pass = formData.get('password');

  // Cek apakah input cocok dengan salah satu data di array
  const isValid = ADMIN_USERS.find(
    (a) => a.username === user && a.password === pass
  );

  if (isValid) {
    const cookieStore = await cookies();
    cookieStore.set('admin_session', 'true', { httpOnly: true, secure: true, path: '/' });
  } else {
    return { error: 'Username atau password salah!' };
  }
  
  redirect('/admin');
}