'use client';
import { useState } from 'react';
import Link from 'next/link';

export default function PartnerLogin() {
  const [isLogin, setIsLogin] = useState(true);
  
  // States for Inputs
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [agreeTerms, setAgreeTerms] = useState(false);

  // Form Handlers
  const handleAuth = (e: React.FormEvent) => {
    e.preventDefault();
    alert(`Processing ${isLogin ? 'Login' : 'Registration'}...`);
  };

  const handleGoogleLogin = () => {
    alert("Redirecting to Google Authentication...");
  };

  return (
    <div className="min-h-screen flex items-center justify-center relative overflow-hidden bg-[#12100e] font-sans selection:bg-[#F8B93C] selection:text-[#1a1714]">
      
      {/* ================= BACKGROUND ================= */}
      <div className="absolute inset-0 bg-[url('/blur-bg.jpg')] bg-cover bg-center opacity-10 mix-blend-screen pointer-events-none" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-[#8c6d48]/10 blur-[120px] rounded-full pointer-events-none" />

      {/* BACK TO WEBSITE */}
      <Link href="/" className="absolute top-8 left-8 text-[#c4aa82] hover:text-[#F8B93C] transition-colors flex items-center gap-2 text-[10px] font-bold tracking-widest uppercase z-50">
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" /></svg>
        Back to Website
      </Link>

      {/* ================= PURE CSS ANIMATION STYLES ================= */}
      <style dangerouslySetInnerHTML={{__html: `
        .sliding-container {
          transition: all 0.7s ease-in-out;
        }
        /* MOBILE FIRST (Vertical Stack) */
        .overlay-login { transform: translateY(0); border-radius: 0 0 80px 80px; }
        .overlay-register { transform: translateY(100%); border-radius: 80px 80px 0 0; }
        
        .form-register-active { opacity: 1; z-index: 20; transform: translateY(0); pointer-events: auto; }
        .form-register-inactive { opacity: 0; z-index: 10; transform: translateY(-50px); pointer-events: none; }
        
        .form-login-active { opacity: 1; z-index: 20; transform: translateY(0); pointer-events: auto; }
        .form-login-inactive { opacity: 0; z-index: 10; transform: translateY(50px); pointer-events: none; }

        .overlay-text-active { opacity: 1; transform: translateX(0); pointer-events: auto; }
        .overlay-text-inactive-left { opacity: 0; transform: translateX(-40px); pointer-events: none; }
        .overlay-text-inactive-right { opacity: 0; transform: translateX(40px); pointer-events: none; }

        /* DESKTOP (Horizontal Side-by-Side) */
        @media (min-width: 768px) {
          .overlay-login { transform: translateX(-100%); border-radius: 0 130px 130px 0; }
          .overlay-register { transform: translateX(0); border-radius: 130px 0 0 130px; }
          .form-register-inactive { transform: translateX(-50px); translateY(0); }
          .form-login-inactive { transform: translateX(50px); translateY(0); }
        }
      `}} />

      {/* ================= MAIN CONTAINER ================= */}
      <div className="relative w-full max-w-[900px] h-[750px] md:h-[600px] bg-[#2b2621] md:rounded-[32px] overflow-hidden shadow-[0_20px_50px_rgba(0,0,0,0.5)] border border-white/10 m-0 md:m-4 flex flex-col md:flex-row">
        
        {/* ================= 1. REGISTRATION FORM (KIRI) ================= */}
        <div className={`absolute top-0 left-0 w-full md:w-1/2 h-1/2 md:h-full flex flex-col justify-center px-8 md:px-14 sliding-container ${!isLogin ? 'form-register-active' : 'form-register-inactive'}`}>
          <div className="text-center mb-6">
            <h2 className="text-3xl font-serif font-bold text-[#fdfbf7] mb-2">Create Account</h2>
            <p className="text-[11px] text-[#c4aa82] tracking-wide">Join us today for wholesale access.</p>
          </div>

          <form onSubmit={handleAuth} className="flex flex-col gap-4">
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                <svg className="w-4 h-4 text-[#6b6256]" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" /></svg>
              </div>
              <input type="text" required className="w-full bg-[#1a1714] border border-[#3d332a] text-[#fdfbf7] rounded-xl pl-11 pr-4 py-3 focus:border-[#F8B93C] outline-none transition-all placeholder:text-[#6b6256] text-xs" placeholder="Full Name" />
            </div>

            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                <svg className="w-4 h-4 text-[#6b6256]" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" /></svg>
              </div>
              <input type="email" required className="w-full bg-[#1a1714] border border-[#3d332a] text-[#fdfbf7] rounded-xl pl-11 pr-4 py-3 focus:border-[#F8B93C] outline-none transition-all placeholder:text-[#6b6256] text-xs" placeholder="Email Address" />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <svg className="w-4 h-4 text-[#6b6256]" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" /></svg>
                </div>
                <input type={showConfirm ? "text" : "password"} required className="w-full bg-[#1a1714] border border-[#3d332a] text-[#fdfbf7] rounded-xl pl-9 pr-9 py-3 focus:border-[#F8B93C] outline-none transition-all placeholder:text-[#6b6256] text-xs tracking-widest" placeholder="Password" />
              </div>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <svg className="w-4 h-4 text-[#6b6256]" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" /></svg>
                </div>
                <input type={showConfirm ? "text" : "password"} required className="w-full bg-[#1a1714] border border-[#3d332a] text-[#fdfbf7] rounded-xl pl-9 pr-9 py-3 focus:border-[#F8B93C] outline-none transition-all placeholder:text-[#6b6256] text-xs tracking-widest" placeholder="Confirm" />
                <button type="button" onClick={() => setShowConfirm(!showConfirm)} className="absolute inset-y-0 right-0 pr-3 flex items-center text-[#6b6256] hover:text-[#F8B93C] transition-colors">
                  {showConfirm ? <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" /></svg> : <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" /></svg>}
                </button>
              </div>
            </div>

            <label className="flex items-center gap-3 cursor-pointer group mt-1 mb-2">
              <div className={`w-4 h-4 rounded-[4px] border flex items-center justify-center transition-all ${agreeTerms ? 'bg-[#F8B93C] border-[#F8B93C]' : 'border-[#6b6256] group-hover:border-[#F8B93C]'}`} onClick={() => setAgreeTerms(!agreeTerms)}>
                {agreeTerms && <svg className="w-3 h-3 text-[#1a1714]" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" /></svg>}
              </div>
              <span className="text-[10px] text-[#c4aa82] select-none">I agree to Terms & Privacy Policy</span>
            </label>

            <button type="submit" className="w-full bg-[#F8B93C] text-[#1a1714] py-3.5 rounded-xl text-[11px] tracking-[0.1em] font-bold hover:brightness-110 active:scale-95 transition-all shadow-md">
              REGISTER
            </button>
            
            <div className="flex items-center justify-center gap-4 mt-2">
              <span className="text-[10px] text-[#6b6256] tracking-widest uppercase">Or register with</span>
            </div>

            <div className="flex justify-center gap-3">
              <button type="button" onClick={handleGoogleLogin} className="flex items-center justify-center w-12 h-10 bg-[#1a1714] border border-[#3d332a] rounded-lg hover:bg-black active:scale-95 transition-all">
                <svg className="w-4 h-4" viewBox="0 0 24 24"><path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/><path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/><path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/><path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/></svg>
              </button>
            </div>
          </form>
        </div>

        {/* ================= 2. LOGIN FORM (KANAN) ================= */}
        <div className={`absolute bottom-0 md:top-0 right-0 w-full md:w-1/2 h-1/2 md:h-full flex flex-col justify-center px-8 md:px-14 sliding-container ${isLogin ? 'form-login-active' : 'form-login-inactive'}`}>
          <div className="text-center mb-8">
            <h2 className="text-4xl font-serif font-bold text-[#fdfbf7] mb-2">Login</h2>
            <p className="text-[11px] text-[#c4aa82] tracking-wide">Enter your details to access your account.</p>
          </div>

          <form onSubmit={handleAuth} className="flex flex-col gap-5">
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                <svg className="w-4 h-4 text-[#6b6256]" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" /></svg>
              </div>
              <input type="email" required className="w-full bg-[#1a1714] border border-[#3d332a] text-[#fdfbf7] rounded-xl pl-11 pr-4 py-3.5 focus:border-[#F8B93C] outline-none transition-all placeholder:text-[#6b6256] text-[13px]" placeholder="Email Address" />
            </div>

            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                <svg className="w-4 h-4 text-[#6b6256]" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" /></svg>
              </div>
              <input type={showPassword ? "text" : "password"} required className="w-full bg-[#1a1714] border border-[#3d332a] text-[#fdfbf7] rounded-xl pl-11 pr-10 py-3.5 focus:border-[#F8B93C] outline-none transition-all placeholder:text-[#6b6256] text-[13px] tracking-widest" placeholder="Password" />
              <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute inset-y-0 right-0 pr-4 flex items-center text-[#6b6256] hover:text-[#F8B93C] transition-colors">
                {showPassword ? <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" /></svg> : <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" /></svg>}
              </button>
            </div>

            <div className="flex items-center justify-between">
              <label className="flex items-center gap-3 cursor-pointer group">
                <div className={`w-4 h-4 rounded-[4px] border flex items-center justify-center transition-all ${rememberMe ? 'bg-[#F8B93C] border-[#F8B93C]' : 'border-[#6b6256] group-hover:border-[#F8B93C]'}`} onClick={() => setRememberMe(!rememberMe)}>
                  {rememberMe && <svg className="w-3 h-3 text-[#1a1714]" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" /></svg>}
                </div>
                <span className="text-[11px] text-[#c4aa82] select-none">Remember me</span>
              </label>
              <Link href="#" className="text-[11px] text-[#6b6256] hover:text-[#F8B93C] transition-colors select-none">Forgot Password?</Link>
            </div>

            <button type="submit" className="w-full bg-[#F8B93C] text-[#1a1714] py-3.5 rounded-xl text-[12px] tracking-[0.1em] font-bold hover:brightness-110 active:scale-95 transition-all shadow-md mt-1">
              LOGIN
            </button>

            <div className="flex items-center justify-center gap-4 mt-2">
              <span className="text-[10px] text-[#6b6256] tracking-widest uppercase">Or login with</span>
            </div>

            <div className="flex justify-center gap-3">
              <button type="button" onClick={handleGoogleLogin} className="flex items-center justify-center w-12 h-10 bg-[#1a1714] border border-[#3d332a] rounded-lg hover:bg-black active:scale-95 transition-all">
                <svg className="w-4 h-4" viewBox="0 0 24 24"><path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/><path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/><path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/><path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/></svg>
              </button>
            </div>
          </form>
        </div>

        {/* ================= 3. SLIDING OVERLAY ================= */}
        <div className={`absolute top-0 md:left-1/2 w-full md:w-1/2 h-1/2 md:h-full bg-gradient-to-br from-[#F8B93C] to-[#d4af37] z-50 overflow-hidden shadow-2xl sliding-container ${isLogin ? 'overlay-login' : 'overlay-register'}`}>
          
          {/* Inner Content (Login Mode) */}
          <div className={`absolute inset-0 flex flex-col items-center justify-center text-[#1a1714] px-12 text-center sliding-container ${isLogin ? 'overlay-text-active' : 'overlay-text-inactive-right'}`}>
            <h2 className="text-4xl font-serif font-bold mb-4">Hello, Welcome!</h2>
            <p className="text-sm font-medium mb-8">Don't have an account yet? Register now to view our full wholesale catalog.</p>
            <button onClick={() => setIsLogin(false)} className="px-10 py-3 rounded-full border-2 border-[#1a1714] text-[#1a1714] font-bold text-xs tracking-widest uppercase hover:bg-[#1a1714] hover:text-[#F8B93C] transition-colors active:scale-95">
              REGISTER
            </button>
          </div>

          {/* Inner Content (Register Mode) */}
          <div className={`absolute inset-0 flex flex-col items-center justify-center text-[#1a1714] px-12 text-center sliding-container ${!isLogin ? 'overlay-text-active' : 'overlay-text-inactive-left'}`}>
            <h2 className="text-4xl font-serif font-bold mb-4">Welcome Back!</h2>
            <p className="text-sm font-medium mb-8">Already have a wholesale account? Login with your credentials.</p>
            <button onClick={() => setIsLogin(true)} className="px-10 py-3 rounded-full border-2 border-[#1a1714] text-[#1a1714] font-bold text-xs tracking-widest uppercase hover:bg-[#1a1714] hover:text-[#F8B93C] transition-colors active:scale-95">
              LOGIN
            </button>
          </div>
          
        </div>
      </div>
      
    </div>
  );
}