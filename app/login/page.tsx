import { login } from './actions';

export default function LoginPage() {
  return (
    <main className="min-h-screen flex items-center justify-center bg-gray-50">
      <form action={login} className="bg-white p-8 rounded-xl shadow-sm border w-96 space-y-4">
        <h1 className="text-xl font-bold text-black">Latin American Cigars - Login</h1>
        <p className="text-xs text-gray-500">Masukkan email akun terdaftar (contoh: client@store.com)</p>
        
        <div>
          <label className="block text-xs font-medium text-gray-700">Email Address</label>
          <input name="email" type="email" required className="w-full mt-1 border rounded-md p-2 text-black text-sm" />
        </div>

        <button type="submit" className="w-full bg-black text-white py-2 rounded-md font-semibold hover:bg-gray-800 transition">
          Sign In
        </button>
      </form>
    </main>
  );
}