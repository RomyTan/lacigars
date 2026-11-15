'use client';
import { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import Lenis from '@studio-freight/lenis';

export default function CompanyPage() {
  const mainRef = useRef<HTMLDivElement>(null);
  const [isScrolled, setIsScrolled] = useState(false);

  const menuItems = [
    { name: 'Home', link: '/', active: false },
    { name: 'Company', link: '/company', active: true },
    { name: 'Brands', link: '/brands', active: false },
    { name: 'Products', link: '/products', active: false },
    { name: 'Contact', link: '/contact', active: false },
  ];

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 50);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);
    
    const lenis = new Lenis({
      duration: 1.2,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)), 
      orientation: 'vertical',
      smoothWheel: true,
      wheelMultiplier: 1, 
    });

    lenis.on('scroll', ScrollTrigger.update);
    gsap.ticker.add((time) => lenis.raf(time * 1000));
    gsap.ticker.lagSmoothing(0);

    let ctx: gsap.Context;
    const timer = setTimeout(() => {
      if (!mainRef.current) return; 

      ctx = gsap.context(() => {
        // Animasi Navbar Masuk
        gsap.from(".nav-anim", { 
          y: -20, opacity: 0, duration: 1, stagger: 0.05, ease: "power3.out" 
        });

        // Animasi Fade Out Video Container saat masuk Section 3
        gsap.to(".video-bg-wrapper", {
          opacity: 0,
          scrollTrigger: {
            trigger: "#section-3",
            start: "top 75%", // Mulai fade out saat section 3 muncul
            end: "top 25%",   // Selesai fade out
            scrub: true,
          }
        });

        // Animasi Entry Konten Tiap Section
        const sections = gsap.utils.toArray('.fs-section');
        sections.forEach((sec: any) => {
          const content = sec.querySelectorAll('.fs-content');
          if(content.length > 0) {
            gsap.fromTo(content,
              { y: 80, opacity: 0 },
              {
                y: 0,
                opacity: 1,
                duration: 1.5,
                stagger: 0.1,
                ease: "power3.out", 
                scrollTrigger: {
                  trigger: sec,
                  start: "top 75%", 
                }
              }
            );
          }
        });

        ScrollTrigger.refresh();
      }, mainRef.current); 

    }, 100);

    return () => {
      clearTimeout(timer);
      if (ctx) ctx.revert();
      lenis.destroy();
      gsap.ticker.remove((time) => lenis.raf(time * 1000));
    };
  }, []);

  return (
    <div ref={mainRef} className="text-[#fdfbf7] font-sans selection:bg-[#F8B93C] selection:text-black overflow-x-hidden relative bg-[#1a1714]">
      
      {/* ========================================================= */}
      {/* VIDEO BACKGROUND (Berhenti, Fade Out, Gak Looping)        */}
      {/* ========================================================= */}
      <div className="video-bg-wrapper fixed inset-0 z-0 pointer-events-none bg-[#1a1714]">
        <video
          src="/lacigars-video-company.mp4"
          className="w-full h-full object-cover opacity-50 transition-opacity duration-1000"
          autoPlay
          playsInline
          muted
          // Event: Fade out perlahan saat video selesai
          onEnded={(e) => {
            (e.target as HTMLVideoElement).style.opacity = '0';
          }}
        />
        <div className="absolute inset-0 bg-[#1a1714]/40" />
      </div>

      {/* NAVBAR */}
      <nav className={`fixed top-0 left-0 w-full px-8 py-5 flex justify-between items-center z-[999] transition-all duration-500 ${isScrolled ? 'bg-[#1a1714]/95 shadow-sm border-b border-[#3d332a]' : 'bg-transparent'}`}>
        <div className="nav-anim flex items-center gap-3">
          <Link href="/" className="flex items-center gap-3">
            <img src="/lacigars-logo.png" alt="Latin American Cigars Corp" className="h-12 md:h-14 w-auto object-contain" />
            <div className="hidden sm:block text-[11px] font-bold tracking-[0.15em] text-[#fdfbf7] leading-snug border-l border-[#8c6d48] pl-4 uppercase">
              LATIN AMERICAN<br />CIGARS CORP.
            </div>
          </Link>
        </div>

        <div className="hidden lg:flex items-center gap-8">
          {menuItems.map((item, i) => (
            <div key={i} className="nav-anim">
              <Link href={item.link} className={`text-[11px] tracking-[0.2em] uppercase font-bold transition-colors duration-300 py-2 relative group ${item.active ? 'text-[#c4aa82]' : 'text-[#fdfbf7] hover:text-[#c4aa82]'}`}>
                {item.name}
                <span className={`absolute bottom-0 left-0 h-0.5 bg-[#c4aa82] transition-all duration-300 ${item.active ? 'w-full' : 'w-0 group-hover:w-full'}`} />
              </Link>
            </div>
          ))}
        </div>

        <div className="flex items-center gap-4 nav-anim">
          <Link href="/admin/login" className="text-[11px] tracking-[0.15em] uppercase font-bold text-[#fdfbf7] hover:text-[#c4aa82] transition-colors flex items-center gap-2 px-3 py-2">
            <svg className="w-4 h-4 text-[#c4aa82]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
            </svg>
            Partner Login
          </Link>
          <Link href="/contact" className="hidden sm:inline-block bg-[#8c6d48] text-white px-5 py-2.5 text-[10px] uppercase tracking-[0.2em] font-bold hover:bg-[#F8B93C] hover:text-[#1a1714] transition-all duration-300 shadow-sm rounded-sm">
            Become a Customer
          </Link>
        </div>
      </nav>

      {/* 1. HERO SECTION (Video BG) */}
      <section id="section-1" className="fs-section relative h-screen w-full flex flex-col justify-center items-center px-8 z-10 bg-transparent">
        <div className="relative z-10 max-w-4xl mx-auto w-full text-center mt-12">
          <p className="fs-content text-[10px] md:text-xs tracking-[0.3em] uppercase text-[#F8B93C] font-bold mb-6 flex items-center justify-center gap-4">
            <span className="w-8 h-px bg-[#F8B93C]"></span> CORPORATE PROFILE <span className="w-8 h-px bg-[#F8B93C]"></span>
          </p>
          <h1 className="fs-content text-5xl md:text-[72px] font-serif font-bold text-[#fdfbf7] tracking-tight leading-[1.05] mb-6 drop-shadow-lg">
            Empowering Retailers<br />Through Reliability.
          </h1>
          <p className="fs-content text-[#c4aa82] text-sm md:text-base max-w-2xl mx-auto leading-relaxed mb-12 drop-shadow-md">
            Latin American Cigars Corp. bridges the gap between world-class tobacco manufacturers and the retail market, offering a streamlined supply chain and uncompromised service quality.
          </p>
          <div className="fs-content animate-bounce mt-10">
            <span className="text-[#F8B93C] opacity-80 text-sm">↓</span>
          </div>
        </div>
      </section>

      {/* 2. THE STORY SECTION (Video BG + Transisi Gelap) */}
      <section id="section-2" className="fs-section relative h-screen w-full flex items-center z-10 bg-gradient-to-b from-transparent to-[#1a1714]">
        <div className="relative z-10 max-w-7xl mx-auto px-8 w-full flex flex-col md:flex-row items-center gap-16">
          <div className="w-full md:w-1/2 bg-[#2b2621]/90 p-10 rounded-2xl border border-[#3d332a] shadow-2xl backdrop-blur-sm">
            <h2 className="fs-content text-5xl font-serif font-bold text-[#fdfbf7] leading-tight mb-8">
              A Legacy Built on Consistency.
            </h2>
            <div className="fs-content space-y-6 text-[#c4aa82] text-sm leading-relaxed max-w-lg">
              <p>
                Founded on the principles of efficiency and quality, Latin American Cigars Corp. has grown into a trusted wholesale partner for retailers. We understand that in the retail environment, consistent inventory and reliable pricing are the lifeblood of your business.
              </p>
              <p>
                Our curated portfolio focuses on high-demand, premium cigars, cigarettes, vapes, and essential accessories. We don't just supply products; we supply peace of mind—ensuring that your shelves remain stocked with the brands your customers demand.
              </p>
            </div>
          </div>
          <div className="w-full md:w-1/2 h-[60vh] relative rounded-xl overflow-hidden shadow-2xl fs-content border border-[#3d332a]">
            {/* [REPLACE_ME]: GAMBAR WAREHOUSE/OFFICE */}
            <div className="absolute inset-0 bg-[#1a1714] bg-[url('/warehouse-bg.jpg')] bg-cover bg-center opacity-80" />
            <div className="absolute inset-0 bg-black/30" />
          </div>
        </div>
      </section>

      {/* 3. CAPABILITIES / CORE VALUES (Solid Dark Background) */}
      <section id="section-3" className="fs-section relative h-screen w-full flex items-center z-10 bg-[#1a1714] border-t border-[#2b2621]">
        <div className="relative z-10 max-w-7xl mx-auto px-8 w-full">
          <div className="text-center mb-16">
            <p className="fs-content text-[10px] tracking-[0.3em] uppercase text-[#F8B93C] font-bold mb-4">— Core Strengths</p>
            <h2 className="fs-content text-5xl font-serif font-bold text-[#fdfbf7] leading-tight">Why Partner With Us?</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="fs-content bg-[#2b2621] p-12 rounded-xl border border-[#3d332a] shadow-xl hover:-translate-y-2 transition-transform duration-300">
              <div className="w-12 h-12 mb-8 flex items-center justify-center bg-[#1a1714] border border-[#3d332a] rounded-full">
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-[#F8B93C]"><path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"/></svg>
              </div>
              <h3 className="text-2xl font-serif font-bold text-[#fdfbf7] mb-4">Curated Portfolio</h3>
              <p className="text-sm text-[#c4aa82] leading-relaxed">
                We eliminate the noise by offering a carefully selected range of top-tier brands. Our catalog is designed to meet high retail demand, ensuring swift turnover and strong margins.
              </p>
            </div>
            <div className="fs-content bg-[#2b2621] p-12 rounded-xl border border-[#3d332a] shadow-xl hover:-translate-y-2 transition-transform duration-300">
              <div className="w-12 h-12 mb-8 flex items-center justify-center bg-[#1a1714] border border-[#3d332a] rounded-full">
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-[#F8B93C]"><path d="M14 18V6a2 2 0 0 0-2-2H4a2 2 0 0 0-2 2v11a1 1 0 0 0 1 1h2"/><path d="M15 18H9"/><path d="M19 18h2a1 1 0 0 0 1-1v-3.65a1 1 0 0 0-.22-.624l-3.48-4.35A1 1 0 0 0 17.52 8H14"/><circle cx="17" cy="18" r="2"/><circle cx="7" cy="18" r="2"/></svg>
              </div>
              <h3 className="text-2xl font-serif font-bold text-[#fdfbf7] mb-4">Dependable Logistics</h3>
              <p className="text-sm text-[#c4aa82] leading-relaxed">
                Operating a robust supply chain network, we guarantee accurate order fulfillment and strictly adhere to delivery schedules. Your inventory arrives exactly when you need it.
              </p>
            </div>
            <div className="fs-content bg-[#2b2621] p-12 rounded-xl border border-[#3d332a] shadow-xl hover:-translate-y-2 transition-transform duration-300">
              <div className="w-12 h-12 mb-8 flex items-center justify-center bg-[#1a1714] border border-[#3d332a] rounded-full">
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-[#F8B93C]"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path><circle cx="9" cy="7" r="4"></circle><path d="M23 21v-2a4 4 0 0 0-3-3.87"></path><path d="M16 3.13a4 4 0 0 1 0 7.75"></path></svg>
              </div>
              <h3 className="text-2xl font-serif font-bold text-[#fdfbf7] mb-4">Dedicated Support</h3>
              <p className="text-sm text-[#c4aa82] leading-relaxed">
                Our wholesale portal and account managers provide a frictionless purchasing experience. From transparent pricing to seamless backorder management, we prioritize your efficiency.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 4. SERVICE AREA (Solid Dark Background + Placeholder Image Layer) */}
      <section id="section-4" className="fs-section relative h-screen w-full flex flex-col items-center justify-center bg-[#1a1714] text-white z-10 border-t border-[#2b2621]">
        {/* [REPLACE_ME]: IMAGE BACKGROUND PLACEHOLDER */}
        <div className="absolute inset-0 bg-[url('/blur-bg.jpg')] bg-cover bg-center opacity-10 pointer-events-none mix-blend-overlay" />
        
        <div className="relative z-10 max-w-5xl mx-auto px-8 w-full text-center">
          <p className="fs-content text-[10px] tracking-[0.3em] uppercase text-[#F8B93C] font-bold mb-4">— Distribution Network</p>
          <h2 className="fs-content text-5xl md:text-[64px] font-serif font-bold mb-8 text-[#fdfbf7]">Serving Florida Retailers.</h2>
          <p className="fs-content text-[#c4aa82] text-sm md:text-base leading-relaxed max-w-3xl mx-auto mb-16">
            Our strategic distribution hub allows us to service convenience stores, smoke shops, and specialized tobacco retailers throughout the entire state of Florida with unmatched speed and reliability.
          </p>
          <div className="fs-content flex justify-center gap-16 border-t border-[#3d332a] pt-10">
            <div>
              <div className="text-5xl font-serif font-bold text-[#F8B93C] mb-2">99%</div>
              <div className="text-[10px] tracking-[0.2em] font-bold uppercase text-[#c4aa82]">Order Accuracy</div>
            </div>
            <div>
              <div className="text-5xl font-serif font-bold text-[#F8B93C] mb-2">24/7</div>
              <div className="text-[10px] tracking-[0.2em] font-bold uppercase text-[#c4aa82]">Portal Access</div>
            </div>
          </div>
        </div>
      </section>

      {/* 5. CONTACT & FOOTER */}
      <section id="section-5" className="fs-section relative h-screen w-full flex flex-col justify-between bg-gradient-to-t from-[#0d0b0a] to-[#1a1714] z-10 border-t border-[#2b2621]">
        <div className="relative z-10 flex-grow flex items-center justify-center px-8">
          <div className="fs-content max-w-4xl mx-auto text-center bg-[#2b2621] border border-[#3d332a] p-16 rounded-2xl shadow-2xl">
            <h2 className="text-5xl font-serif font-bold text-[#fdfbf7] mb-6">Experience the Standard in Distribution</h2>
            <p className="text-[#c4aa82] text-sm md:text-base leading-relaxed mb-12 max-w-2xl mx-auto">
              Join the network of successful retailers who trust Latin American Cigars Corp. as their primary supply partner.
            </p>
            <div className="flex flex-col sm:flex-row gap-6 justify-center">
              <Link href="/contact" className="bg-[#8c6d48] text-[#fdfbf7] px-10 py-4 text-[11px] tracking-[0.2em] font-bold hover:bg-[#F8B93C] hover:text-[#1a1714] transition-colors rounded-sm shadow-md">
                APPLY FOR WHOLESALE ACCESS
              </Link>
            </div>
          </div>
        </div>
        <footer className="fs-content w-full border-t border-[#3d332a] py-8 text-center bg-transparent">
          <p className="text-[10px] text-[#8c6d48] uppercase tracking-[0.2em] font-bold">
            © {new Date().getFullYear()} Latin American Cigars Corp. All Rights Reserved.
          </p>
        </footer>
      </section>

    </div>
  );
}