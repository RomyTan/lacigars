'use client';
import { useActionState } from 'react';
import { loginAdmin } from './actions';

export default function AdminLogin() {
  const [state, formAction, isPending] = useActionState(loginAdmin, null);

  return (
    <div className="relative min-h-screen bg-[#0a0a0a] flex items-center justify-center overflow-hidden font-sans">
      
      {/* Background Decorative Lines */}
      <svg className="absolute inset-0 w-full h-full text-[#1a1a1a] pointer-events-none" xmlns="http://www.w3.org/2000/svg">
        <path d="M0 150h200l100 100v200l200 150" fill="none" stroke="currentColor" strokeWidth="2" strokeLinejoin="bevel"/>
        <path d="M100vw 150h-200l-100 100v200l-200 150" fill="none" stroke="currentColor" strokeWidth="2" strokeLinejoin="bevel"/>
        <path d="M0 800h200l100-100V500l200-150" fill="none" stroke="currentColor" strokeWidth="2" strokeLinejoin="bevel"/>
        <path d="M100vw 800h-200l-100-100V500l-200-150" fill="none" stroke="currentColor" strokeWidth="2" strokeLinejoin="bevel"/>
        
        <circle cx="200" cy="150" r="4" fill="#262626" />
        <circle cx="200" cy="800" r="4" fill="#262626" />
        <circle cx="calc(100vw - 200px)" cy="150" r="4" fill="#262626" />
        <circle cx="calc(100vw - 200px)" cy="800" r="4" fill="#262626" />
      </svg>

      {/* Top Right Controls */}
      <div className="absolute top-6 right-6 flex gap-3 z-20">
        <button className="w-10 h-10 rounded-full bg-[#141414] border border-[#262626] flex items-center justify-center text-gray-400 hover:text-white transition">
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0zM10 7v3m0 0v3m0-3h3m-3 0H7"></path></svg>
        </button>
        <button className="w-10 h-10 rounded-full bg-[#141414] border border-[#262626] flex items-center justify-center text-gray-400 hover:text-white transition">
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path></svg>
        </button>
      </div>

      {/* Login Card */}
      <div className="bg-[#141414] border border-[#262626] rounded-2xl w-full max-w-105 p-8 shadow-2xl z-10 relative">
        
        <div className="flex flex-col items-center mb-8">
          <div className="w-14 h-14 bg-[#1a1a1a] border border-[#333] rounded-2xl flex items-center justify-center mb-6 shadow-inner">
             <div className="w-6 h-6 border-4 border-[#d4af37] border-t-transparent rounded-full transform rotate-45"></div>
          </div>
          <h2 className="text-2xl font-bold text-white mb-2">Welcome Back</h2>
          <p className="text-sm text-gray-500">
            Don't have an account yet? <a href="#" className="text-white hover:text-[#d4af37] transition font-medium">Sign up</a>
          </p>
        </div>

        <form action={formAction} className="space-y-4">
          
          {/* Menampilkan pesan error dari server action kalau login gagal */}
          {state?.error && (
            <div className="bg-red-900/30 border border-red-800/50 text-red-400 text-sm p-3 rounded-lg text-center font-medium">
              {state.error}
            </div>
          )}

          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <svg className="h-5 w-5 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
              </svg>
            </div>
            <input 
              type="text" 
              name="username" // Wajib ada untuk server action lo
              required
              className="w-full bg-[#0a0a0a] border border-[#262626] text-white text-sm rounded-lg pl-10 pr-4 py-3 focus:outline-none focus:border-[#d4af37] transition placeholder-gray-600"
              placeholder="Username"
            />
          </div>

          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <svg className="h-5 w-5 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
              </svg>
            </div>
            <input 
              type="password" 
              name="password" // Wajib ada untuk server action lo
              required
              className="w-full bg-[#0a0a0a] border border-[#262626] text-white text-sm rounded-lg pl-10 pr-4 py-3 focus:outline-none focus:border-[#d4af37] transition placeholder-gray-600"
              placeholder="Password"
            />
          </div>

          <button 
            type="submit" 
            disabled={isPending}
            className="w-full bg-[#d4af37] text-black font-semibold rounded-lg py-3 hover:bg-[#c69c38] disabled:bg-[#d4af37]/50 disabled:cursor-not-allowed transition duration-200 mt-2"
          >
            {isPending ? 'Verifying...' : 'Login'}
          </button>
        </form>

        <div className="flex items-center my-6">
          <div className="grow border-t border-[#262626]"></div>
          <span className="shrink-0 mx-4 text-[10px] text-gray-600 uppercase font-semibold">OR</span>
          <div className="grow border-t border-[#262626]"></div>
        </div>

        <div className="grid grid-cols-3 gap-3">
          <button className="flex items-center justify-center bg-[#0a0a0a] border border-[#262626] rounded-lg py-3 hover:bg-[#1a1a1a] transition">
            <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 24 24"><path d="M17.05 20.28c-.98.95-2.05.8-3.08.35-1.09-.46-2.09-.48-3.24 0-1.44.62-2.2.44-3.06-.35C2.79 15.25 3.51 7.59 9.05 7.31c1.35.07 2.29.74 3.08.8 1.18-.04 2.26-.79 3.59-.79 1.56 0 2.95.69 3.77 1.84-3.2 1.81-2.6 6.32.4 7.43-.68 1.63-1.63 2.92-2.84 3.69zM12.03 7.25c-.15-2.23 1.66-4.07 3.74-4.25.29 2.58-2.34 4.5-3.74 4.25z"/></svg>
          </button>
          <button className="flex items-center justify-center bg-[#0a0a0a] border border-[#262626] rounded-lg py-3 hover:bg-[#1a1a1a] transition">
            <svg className="w-5 h-5" viewBox="0 0 24 24"><path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/><path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/><path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/><path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/></svg>
          </button>
          <button className="flex items-center justify-center bg-[#0a0a0a] border border-[#262626] rounded-lg py-3 hover:bg-[#1a1a1a] transition">
            <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 24 24"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/></svg>
          </button>
        </div>

      </div>
    </div>
  );
}