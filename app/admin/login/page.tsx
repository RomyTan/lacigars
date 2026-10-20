'use client';

import { useActionState } from 'react';
import { loginAdmin } from './actions';

export default function AdminLogin() {
  const [state, formAction, isPending] = useActionState(loginAdmin, null);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <form action={formAction} className="bg-white p-8 rounded-xl shadow-md w-96">
        <h1 className="text-2xl font-bold text-center mb-6 text-black">LAC Admin Login</h1>
        
        {state?.error && (
          <p className="text-red-500 text-sm mb-4 text-center font-semibold">{state.error}</p>
        )}
        
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700">Username</label>
          <input name="username" required className="w-full mt-1 border rounded-md p-2 text-black" />
        </div>
        
        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700">Password</label>
          <input type="password" name="password" required className="w-full mt-1 border rounded-md p-2 text-black" />
        </div>
        
        <button 
          disabled={isPending} 
          type="submit" 
          className="w-full bg-black text-white py-2 rounded-md font-semibold hover:bg-gray-800 disabled:bg-gray-400 transition-colors"
        >
          {isPending ? 'Verifying...' : 'Login'}
        </button>
      </form>
    </div>
  );
}