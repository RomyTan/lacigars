'use client';
import { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import gsap from 'gsap';

export default function PartnerLogin() {
  const [isLogin, setIsLogin] = useState(true);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  
  // Interactivity States
  const [rememberMe, setRememberMe] = useState(false);
  const [agreeTerms, setAgreeTerms] = useState(false);
  
  // Animation Lock State (Solusi agar tombol tidak mati/buggy)
  const [isAnimating, setIsAnimating] = useState(false);

  // GSAP Refs
  const cardContentRef = useRef<HTMLDivElement>(null);
  const tlTriangle = useRef<HTMLDivElement>(null);
  const brTriangle = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Animasi masuk yang elegan saat halaman dibuka
    gsap.fromTo([tlTriangle.current, brTriangle.current], 
      { opacity: 0, scale: 0.5 }, 
      { opacity: 1, scale: 1, duration: 1.2, stagger: 0.1, ease: "back.out(1.5)" }
    );
    gsap.fromTo(cardContentRef.current, 
      { opacity: 0, y: 30 }, 
      { opacity: 1, y: 0, duration: 1, delay: 0.3, ease: "power3.out" }
    );
  }, []);

  const toggleForm = (e: React.MouseEvent) => {
    e.preventDefault();
    if (isAnimating) return; // Cegah spam klik
    
    setIsAnimating(true);
    const tl = gsap.timeline({ 
      onComplete: () => setIsAnimating(false) 
    });

    // 1. Segitiga memutar & menghimpit ke tengah
    tl.to(tlTriangle.current, { top: "50%", left: "50%", xPercent: -50, yPercent: -50, rotation: 225, duration: 0.6, ease: "back.in(1.2)" }, 0);
    tl.to(brTriangle.current, { bottom: "50%", right: "50%", xPercent: 50, yPercent: 50, rotation: 225, duration: 0.6, ease: "back.in(1.2)" }, 0);
    
    // 2. Main Form terhimpit (Scale down & Blur)
    tl.to(cardContentRef.current, { scale: 0.85, opacity: 0, filter: "blur(12px)", duration: 0.4, ease: "power2.in" }, 0.1);

    // 3. Swap State saat form tidak terlihat
    tl.call(() => {
      setIsLogin(!isLogin);
      setShowPassword(false);
      setShowConfirm(false);
    });

    // 4. Segitiga kembali ke ujung
    tl.to(tlTriangle.current, { top: "0%", left: "0%", xPercent: 0, yPercent: 0, rotation: 0, duration: 0.6, ease: "back.out(1.2)" }, "+=0.1");
    tl.to(brTriangle.current, { bottom: "0%", right: "0%", xPercent: 0, yPercent: 0, rotation: 0, duration: 0.6, ease: "back.out(1.2)" }, "<");
    
    // 5. Main Form baru membesar & jelas kembali
    tl.fromTo(cardContentRef.current, 
      { scale: 0.85, opacity: 0, filter: "blur(12px)" }, 
      { scale: 1, opacity: 1, filter: "blur(0px)", duration: 0.5, ease: "power2.out" }, 
      "<0.1"
    );
  };

  // Fungsi aktif untuk tombol Social Login
  const handleSocialLogin = (provider: string) => {
    alert(`Redirecting to ${provider} Authentication...`);
  };

  return (
    <div className="min-h-screen flex items-center justify-center relative overflow-hidden bg-[#12100e] font-sans selection:bg-[#F8B93C] selection:text-[#1a1714]">
      
      {/* ================= BACKGROUND ================= */}
      <div className="absolute inset-0 bg-[url('/blur-bg.jpg')] bg-cover bg-center opacity-10 mix-blend-screen pointer-events-none" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-[#8c6d48]/20 blur-[150px] rounded-full pointer-events-none" />

      {/* BACK TO WEBSITE */}
      <Link href="/" className="absolute top-8 left-8 text-[#c4aa82] hover:text-[#F8B93C] transition-colors flex items-center gap-2 text-[10px] font-bold tracking-widest uppercase z-50">
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" /></svg>
        Back to Website
      </Link>

      {/* ================= GEOMETRIC STRUCTURE ================= */}
      <div className="relative w-full max-w-[460px] min-h-[660px] z-10 m-4">
        
        {/* 1. SEGITIGA KIRI ATAS (Rounded Path Sempurna) */}
        <div 
          ref={tlTriangle} 
          className="absolute top-0 left-0 w-[80px] h-[80px] bg-white/10 backdrop-blur-2xl z-20"
          style={{ 
            // Q (Bezier Curve) membulatkan sudut-sudut tajam secara matematis
            clipPath: "path('M 16 0 L 64 0 Q 80 0 74 6 L 6 74 Q 0 80 0 64 L 0 16 Q 0 0 16 0 Z')",
            // Drop-shadow membayang pas mengikuti kurva clip-path (Gak akan ada kotak hitam bocor)
            filter: "drop-shadow(6px 6px 15px rgba(0,0,0,0.6))"
          }}
        />

        {/* 2. SEGITIGA KANAN BAWAH (Rounded Path Sempurna) */}
        <div 
          ref={brTriangle} 
          className="absolute bottom-0 right-0 w-[80px] h-[80px] bg-white/10 backdrop-blur-2xl z-20"
          style={{ 
            clipPath: "path('M 16 80 L 64 80 Q 80 80 80 64 L 80 16 Q 80 0 74 6 L 6 74 Q 0 80 16 80 Z')",
            filter: "drop-shadow(-6px -6px 15px rgba(0,0,0,0.6))"
          }}
        />

        {/* 3. MAIN CARD (Outer: Rounded-32px | Inner: Chamfer Cut 84px) */}
        <div className="absolute inset-0 z-0 bg-transparent rounded-[32px] overflow-hidden" style={{ filter: "drop-shadow(0px 20px 40px rgba(0,0,0,0.5))" }}>
          <div 
            className="absolute inset-0 bg-[#2b2621]/90 backdrop-blur-3xl border border-white/5"
            // Cut 84px menyisakan "Gap" 4px yg elegan dengan Segitiga (80px)
            style={{ clipPath: 'polygon(84px 0, 100% 0, 100% calc(100% - 84px), calc(100% - 84px) 100%, 0 100%, 0 84px)' }}
          />
        </div>

        {/* ================= 4. FORM CONTENT ================= */}
        <div ref={cardContentRef} className="relative z-10 w-full h-full flex flex-col p-10 pt-12 pb-8">
          
          <div className="mb-8">
            <h2 className="text-4xl font-serif font-bold text-[#fdfbf7] mb-2 drop-shadow-sm">
              {isLogin ? (
                <>Welcome <span className="text-[#F8B93C]">Back</span></>
              ) : (
                <>Create <span className="text-[#F8B93C]">Account</span></>
              )}
            </h2>
            <p className="text-[11px] text-[#c4aa82] tracking-wide pr-8">
              {isLogin 
                ? "Enter your credentials to access your secure account." 
                : "Join us today to access your secure wholesale workspace."}
            </p>
          </div>

          <form className="flex-grow flex flex-col gap-5 px-1 pb-2">
            
            {/* FULL NAME (Khusus Sign Up) */}
            {!isLogin && (
              <div>
                <label className="block text-[9px] tracking-[0.2em] text-[#c4aa82] uppercase font-bold mb-1.5 ml-1">Full Name</label>
                <div className="relative group">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                    <svg className="w-4 h-4 text-[#8c6d48] group-focus-within:text-[#F8B93C] transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" /></svg>
                  </div>
                  <input type="text" disabled={isAnimating} className="w-full bg-[#1a1714]/60 border border-[#8c6d48]/30 text-[#fdfbf7] rounded-xl pl-11 pr-4 py-3.5 focus:border-[#F8B93C] focus:bg-[#1a1714]/80 outline-none transition-all placeholder:text-[#6b6256] text-[13px] shadow-inner" placeholder="Alex Johnson" />
                </div>
              </div>
            )}

            {/* EMAIL */}
            <div>
              <label className="block text-[9px] tracking-[0.2em] text-[#c4aa82] uppercase font-bold mb-1.5 ml-1">Email Address</label>
              <div className="relative group">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <svg className="w-4 h-4 text-[#8c6d48] group-focus-within:text-[#F8B93C] transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" /></svg>
                </div>
                <input type="email" disabled={isAnimating} className="w-full bg-[#1a1714]/60 border border-[#8c6d48]/30 text-[#fdfbf7] rounded-xl pl-11 pr-4 py-3.5 focus:border-[#F8B93C] focus:bg-[#1a1714]/80 outline-none transition-all placeholder:text-[#6b6256] text-[13px] shadow-inner" placeholder="name@domain.com" />
              </div>
            </div>

            {/* PASSWORD */}
            <div className={`grid ${!isLogin ? 'grid-cols-1 sm:grid-cols-2 gap-4' : 'grid-cols-1'}`}>
              <div>
                <label className="block text-[9px] tracking-[0.2em] text-[#c4aa82] uppercase font-bold mb-1.5 ml-1">Password</label>
                <div className="relative group">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                    <svg className="w-4 h-4 text-[#8c6d48] group-focus-within:text-[#F8B93C] transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" /></svg>
                  </div>
                  <input type={showPassword ? "text" : "password"} disabled={isAnimating} className="w-full bg-[#1a1714]/60 border border-[#8c6d48]/30 text-[#fdfbf7] rounded-xl pl-11 pr-10 py-3.5 focus:border-[#F8B93C] focus:bg-[#1a1714]/80 outline-none transition-all placeholder:text-[#6b6256] text-[13px] tracking-widest shadow-inner" placeholder="••••••••" />
                  <button type="button" disabled={isAnimating} onClick={() => setShowPassword(!showPassword)} className="absolute inset-y-0 right-0 pr-4 flex items-center text-[#8c6d48] hover:text-[#F8B93C] transition-colors disabled:opacity-50">
                    {showPassword ? (
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" /></svg>
                    ) : (
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" /></svg>
                    )}
                  </button>
                </div>
              </div>

              {!isLogin && (
                <div>
                  <label className="block text-[9px] tracking-[0.2em] text-[#c4aa82] uppercase font-bold mb-1.5 ml-1">Confirm</label>
                  <div className="relative group">
                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                      <svg className="w-4 h-4 text-[#8c6d48] group-focus-within:text-[#F8B93C] transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" /></svg>
                    </div>
                    <input type={showConfirm ? "text" : "password"} disabled={isAnimating} className="w-full bg-[#1a1714]/60 border border-[#8c6d48]/30 text-[#fdfbf7] rounded-xl pl-11 pr-10 py-3.5 focus:border-[#F8B93C] focus:bg-[#1a1714]/80 outline-none transition-all placeholder:text-[#6b6256] text-[13px] tracking-widest shadow-inner" placeholder="••••••••" />
                    <button type="button" disabled={isAnimating} onClick={() => setShowConfirm(!showConfirm)} className="absolute inset-y-0 right-0 pr-4 flex items-center text-[#8c6d48] hover:text-[#F8B93C] transition-colors disabled:opacity-50">
                      {showConfirm ? (
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" /></svg>
                      ) : (
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" /></svg>
                      )}
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* ACTION ROW (Checkbox / Forgot Password) */}
            <div className="flex items-center justify-between mt-2 mb-3">
              {isLogin ? (
                <>
                  <label className="flex items-center gap-3 cursor-pointer group">
                    <div className={`w-4 h-4 rounded-[4px] border flex items-center justify-center transition-all ${rememberMe ? 'bg-[#F8B93C] border-[#F8B93C]' : 'border-[#8c6d48]/50 group-hover:border-[#F8B93C]'}`} onClick={() => !isAnimating && setRememberMe(!rememberMe)}>
                      {rememberMe && <svg className="w-3 h-3 text-[#1a1714]" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" /></svg>}
                    </div>
                    <span className="text-[11px] text-[#c4aa82] select-none">Remember me</span>
                  </label>
                  <Link href="#" className="text-[11px] text-[#8c6d48] hover:text-[#F8B93C] transition-colors select-none">Forgot password?</Link>
                </>
              ) : (
                <label className="flex items-center gap-3 cursor-pointer group">
                  <div className={`w-4 h-4 rounded-[4px] border flex items-center justify-center transition-all ${agreeTerms ? 'bg-[#F8B93C] border-[#F8B93C]' : 'border-[#8c6d48]/50 group-hover:border-[#F8B93C]'}`} onClick={() => !isAnimating && setAgreeTerms(!agreeTerms)}>
                    {agreeTerms && <svg className="w-3 h-3 text-[#1a1714]" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" /></svg>}
                  </div>
                  <span className="text-[11px] text-[#c4aa82] select-none">I agree to Terms & Privacy Policy</span>
                </label>
              )}
            </div>

            {/* MAIN BUTTON */}
            <button 
              type="button" 
              disabled={isAnimating}
              className="w-full bg-gradient-to-r from-[#F8B93C] to-[#d4af37] text-[#1a1714] py-3.5 rounded-xl text-[11px] tracking-[0.2em] font-bold hover:shadow-[0_0_20px_rgba(248,185,60,0.3)] active:scale-[0.98] transition-all duration-300 flex items-center justify-center gap-3 disabled:opacity-50 disabled:cursor-not-allowed mt-2"
            >
              {isLogin ? "SIGN IN" : "CREATE ACCOUNT"} <span>→</span>
            </button>
            
            <div className="flex items-center gap-4 my-3">
              <span className="h-px w-full bg-white/10"></span>
              <span className="text-[9px] text-[#6b6256] tracking-[0.2em] uppercase whitespace-nowrap">Or {isLogin ? 'Continue' : 'Sign Up'} With</span>
              <span className="h-px w-full bg-white/10"></span>
            </div>

            {/* SOCIAL BUTTONS (AKTIF 100%) */}
            <div className="flex gap-4">
              <button 
                type="button" 
                disabled={isAnimating}
                onClick={() => handleSocialLogin('Google')}
                className="flex-1 flex items-center justify-center gap-2 py-3 bg-[#1a1714]/40 border border-[#8c6d48]/20 rounded-xl hover:bg-[#1a1714]/80 hover:border-[#8c6d48]/60 active:scale-[0.96] transition-all text-xs text-[#fdfbf7] font-semibold disabled:opacity-50 disabled:cursor-not-allowed shadow-sm"
              >
                <svg className="w-4 h-4" viewBox="0 0 24 24"><path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/><path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/><path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/><path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/></svg>
                Google
              </button>
              <button 
                type="button" 
                disabled={isAnimating}
                onClick={() => handleSocialLogin('Apple')}
                className="flex-1 flex items-center justify-center gap-2 py-3 bg-[#1a1714]/40 border border-[#8c6d48]/20 rounded-xl hover:bg-[#1a1714]/80 hover:border-[#8c6d48]/60 active:scale-[0.96] transition-all text-xs text-[#fdfbf7] font-semibold disabled:opacity-50 disabled:cursor-not-allowed shadow-sm"
              >
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M17.05 20.28c-.98.95-2.05.8-3.08.35-1.09-.46-2.09-.48-3.24 0-1.44.62-2.2.44-3.06-.35C2.79 15.25 3.51 7.59 9.05 7.31c1.35.07 2.29.74 3.08.8 1.18-.09 2.31-.86 3.59-.8 1.51.05 2.78.68 3.53 1.8-3.16 1.83-2.6 5.82.5 7.1-1.02 2.65-2.73 4.12-2.7 4.07zM12.03 7.25c-.15-2.23 1.66-4.07 3.74-4.25.29 2.58-2.02 4.49-3.74 4.25z"/></svg>
                Apple
              </button>
            </div>

            {/* TOGGLE FORM LINK */}
            <div className="mt-auto pt-4 text-center">
              <span className="text-[11px] text-[#c4aa82]">
                {isLogin ? "Don't have an account? " : "Already have an account? "}
              </span>
              <button 
                type="button" 
                disabled={isAnimating}
                onClick={toggleForm} 
                className="text-[11px] text-[#F8B93C] hover:text-white font-bold tracking-wider transition-colors ml-1 uppercase disabled:opacity-50"
              >
                {isLogin ? "Sign Up" : "Sign In"}
              </button>
            </div>

          </form>
        </div>
      </div>
      
    </div>
  );
}