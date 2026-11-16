'use client';
import { useEffect, useRef, Suspense, useState } from 'react';
import Link from 'next/link';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import Lenis from '@studio-freight/lenis';
import { Canvas, useFrame } from '@react-three/fiber';
import { useTexture } from '@react-three/drei';

function AnimatedCloud({ texture, startZ, initialY, initialX, args, idx }: any) {
  const meshRef = useRef<any>(null);
  const matRef = useRef<any>(null);
  const stateRef = useRef({ x: initialX, y: initialY, flipX: 1 });

  useFrame((state, delta) => {
    if (!meshRef.current || !matRef.current) return;
    meshRef.current.position.z += 0.8 * delta;
    let z = meshRef.current.position.z;
    if (z > 5) {
      z -= 24;
      meshRef.current.position.z = z;
      stateRef.current.x = initialX + (Math.random() - 0.5) * 6; 
      stateRef.current.y = initialY + (Math.random() - 0.5) * 2; 
      stateRef.current.flipX = Math.random() > 0.5 ? 1 : -1; 
    }
    let opacity = 0.6;
    if (z < -15) opacity = (1 - (-15 - z) / 4) * 0.6; 
    else if (z > 2) opacity = (1 - (z - 2) / 3) * 0.6; 
    matRef.current.opacity = Math.max(0, Math.min(0.6, opacity));
    const time = state.clock.getElapsedTime();
    meshRef.current.position.x = stateRef.current.x + Math.sin(time * 0.2 + idx) * 0.8;
    meshRef.current.position.y = stateRef.current.y + Math.cos(time * 0.15 + idx) * 0.4;
    meshRef.current.scale.x = stateRef.current.flipX;
  });

  return (
    <mesh ref={meshRef} position={[initialX, initialY, startZ]}>
      <planeGeometry args={args} />
      <meshBasicMaterial ref={matRef} map={texture} transparent depthWrite={false} />
    </mesh>
  );
}

function MultiLayerClouds() {
  const [bg, tint, l0, l1, l2, l3, l4, intro] = useTexture([
    '/HDR_AboveTheClouds.test.jpg', '/Cloud-tint-8.png', '/layer0.png', '/layer1.png', 
    '/layer2.png', '/layer3.png', '/layer4.png', '/intro-cloud.png'
  ]);
  const tintRef = useRef<any>(null); 
  useFrame((state) => {
    if (tintRef.current) {
      const time = state.clock.getElapsedTime();
      tintRef.current.position.x = Math.sin(time * 0.05) * 4; 
      tintRef.current.position.y = -10 + Math.cos(time * 0.03) * 1.5; 
    }
  });

  const cloudArgs = [90, 40];
  const clouds = [
    { map: l0, z: -19, y: -14, x: 0 }, { map: l1, z: -15, y: -15, x: -3 },
    { map: l2, z: -11, y: -14, x: 3 }, { map: l3, z: -7,  y: -15, x: -2 },
    { map: l4, z: -3,  y: -14, x: 2 }, { map: intro, z: 1,y: -15, x: 0 },
  ];

  return (
    <group>
      <mesh position={[0, 0, -20]}><planeGeometry args={[120, 60]} /><meshBasicMaterial map={bg} depthWrite={false} /></mesh>
      <mesh ref={tintRef} position={[0, -10, -40]}><planeGeometry args={[200, 50]} /><meshBasicMaterial map={tint} transparent depthWrite={false} /></mesh>
      {clouds.map((cloud, idx) => (
        <AnimatedCloud key={idx} idx={idx} texture={cloud.map} startZ={cloud.z} initialY={cloud.y} initialX={cloud.x} args={cloudArgs} />
      ))}
    </group>
  );
}

export default function LandingPage() {
  const mainRef = useRef<HTMLDivElement>(null);
  const [isScrolled, setIsScrolled] = useState(false);

  const menuItems = [
    { name: 'Home', link: '/', active: true },
    { name: 'Company', link: '/company', active: false },
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
        gsap.from(".nav-anim", { 
          y: -20, opacity: 0, duration: 1, stagger: 0.05, ease: "power3.out" 
        });

        const sections = gsap.utils.toArray('.fs-section');
        
        sections.forEach((sec: any) => {
          const bg = sec.querySelector('.fs-bg');
          const content = sec.querySelectorAll('.fs-content');

          if(bg) {
            gsap.fromTo(bg, 
              { scale: 1.1, opacity: 0 },
              {
                scale: 1,
                opacity: 1,
                duration: 1.5,
                ease: "power2.out",
                scrollTrigger: {
                  trigger: sec,
                  start: "top 70%",
                }
              }
            );
          }

          if(content.length > 0) {
            gsap.fromTo(content,
              { y: 50, opacity: 0 },
              {
                y: 0,
                opacity: 1,
                duration: 1.2,
                stagger: 0.1,
                ease: "power3.out",
                scrollTrigger: {
                  trigger: sec,
                  start: "top 60%",
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
    <div ref={mainRef} className="text-[#2b2621] font-sans selection:bg-[#F8B93C] selection:text-black overflow-x-hidden bg-[#fdfbf7]">
      
      {/* 3D AWAN TETAP DI BELAKANG SEBAGAI FALLBACK/BASE */}
      <div className="fixed inset-0 z-0 pointer-events-none opacity-60">
        <Canvas camera={{ position: [0, 0, 5] }}>
          <Suspense fallback={null}>  
            <MultiLayerClouds />
          </Suspense>                 
        </Canvas>
      </div>

      {/* NAVBAR */}
      <nav className={`fixed top-0 left-0 w-full px-8 py-5 flex justify-between items-center z-[999] transition-all duration-500 ${isScrolled ? 'bg-[#fdfbf7]/95 backdrop-blur-md shadow-sm border-b border-[#e6e2d8]/60' : 'bg-transparent'}`}>
        <div className="nav-anim flex items-center gap-3">
          <Link href="/" className="flex items-center gap-3">
            <img src="/lacigars-logo.png" alt="Latin American Cigars Corp" className="h-12 md:h-14 w-auto object-contain" />
            <div className="hidden sm:block text-[11px] font-bold tracking-[0.15em] text-[#2b2621] leading-snug border-l border-[#8c6d48] pl-4 uppercase">
              LATIN AMERICAN<br />CIGARS CORP.
            </div>
          </Link>
        </div>

        <div className="hidden lg:flex items-center gap-8">
          {menuItems.map((item, i) => (
            <div key={i} className="nav-anim">
              <Link href={item.link} className={`text-[11px] tracking-[0.2em] uppercase font-bold transition-colors duration-300 py-2 relative group text-[#4a4238] hover:text-[#8c6d48]`}>
                {item.name}
                <span className={`absolute bottom-0 left-0 h-0.5 bg-[#8c6d48] transition-all duration-300 ${item.active ? 'w-full' : 'w-0 group-hover:w-full'}`} />
              </Link>
            </div>
          ))}
        </div>

        <div className="flex items-center gap-4 nav-anim">
          <Link href="/admin/login" className="text-[11px] tracking-[0.15em] uppercase font-bold text-[#4a4238] hover:text-[#8c6d48] transition-colors flex items-center gap-2 px-3 py-2">
            <svg className="w-4 h-4 text-[#8c6d48]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
            </svg>
            Partner Login
          </Link>
          <Link href="/contact" className="hidden sm:inline-block bg-[#8c6d48] text-white px-5 py-2.5 text-[10px] uppercase tracking-[0.2em] font-bold hover:bg-[#7a5d3b] transition-all duration-300 shadow-sm rounded-sm">
            Become a Customer
          </Link>
        </div>
      </nav>

      {/* ========================================================= */}
      {/* 1. HOME SECTION (FULL SCREEN 100VH)                       */}
      {/* ========================================================= */}
      <section id="home" className="fs-section relative h-screen w-full flex flex-col justify-center items-center px-8 z-10 overflow-hidden">
        
        <div className="fs-bg absolute inset-0 bg-transparent bg-cover bg-center opacity-0 pointer-events-none" />
        
        {/* Kontainer utama disesuaikan marginnya agar semua muat di 1 layar */}
        <div className="relative z-10 max-w-6xl mx-auto w-full text-center mt-16 lg:mt-24">
          
          <p className="fs-content text-[9px] md:text-[10px] tracking-[0.3em] uppercase text-[#8c6d48] font-bold mb-4 flex items-center justify-center gap-4">
            <span className="w-8 h-px bg-[#8c6d48]"></span> WHOLESALE TOBACCO DISTRIBUTOR <span className="w-8 h-px bg-[#8c6d48]"></span>
          </p>

          <h1 className="fs-content text-4xl md:text-[64px] font-serif font-bold text-[#2b2621] tracking-tight leading-[1.05] mb-4">
            Premium Tobacco Brands.<br />
            Reliable Wholesale Distribution.
          </h1>

          <p className="fs-content text-[#6b6256] text-xs md:text-sm max-w-3xl mx-auto leading-relaxed mb-8">
            A leading wholesale distributor of cigars, cigarettes, vapes, and accessories, serving retailers across Florida with a premium product portfolio, competitive terms, and dependable, on-time distribution.
          </p>

          {/* CTA BUTTONS KEMBALI DIMUNCULKAN DI SINI */}
          <div className="fs-content flex flex-col sm:flex-row gap-4 justify-center items-center mb-8 w-full">
            <Link href="/products" className="group relative overflow-hidden w-full sm:w-[260px] bg-[#8c6d48] text-white px-6 py-3 text-[10px] tracking-[0.15em] font-bold transition-all duration-500 flex items-center justify-center shadow-md rounded-sm">
              <span className="relative z-10 flex items-center gap-3">
                EXPLORE PRODUCTS <span className="group-hover:translate-x-1.5 transition-transform duration-300">→</span>
              </span>
              <div className="absolute inset-0 h-full w-full scale-0 rounded-sm transition-all duration-500 ease-out group-hover:scale-100 group-hover:bg-[#F8B93C] z-0"></div>
            </Link>

            <Link href="/contact" className="group relative overflow-hidden w-full sm:w-[260px] border border-[#8c6d48] bg-transparent text-[#8c6d48] px-6 py-3 text-[10px] tracking-[0.15em] font-bold transition-colors duration-500 flex items-center justify-center hover:text-white rounded-sm">
              <span className="relative z-10 flex items-center gap-3">
                WHOLESALE ACCESS <span className="group-hover:translate-x-1.5 transition-transform duration-300">→</span>
              </span>
              <div className="absolute inset-0 h-full w-full origin-left scale-x-0 bg-[#F8B93C] border-[#F8B93C] transition-transform duration-500 ease-out group-hover:scale-x-100 z-0"></div>
            </Link>
          </div>

          {/* 3 FEATURES */}
          <div className="fs-content flex flex-wrap justify-center gap-8 md:gap-12 mb-8 opacity-90">
            <div className="flex items-center gap-3 text-left">
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="text-[#8c6d48]"><path d="M2 7l4.41-4.41A2 2 0 0 1 7.83 2h8.34a2 2 0 0 1 1.42.59L22 7"/><path d="M4 12v8a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-8"/><path d="M15 22v-4a2 2 0 0 0-2-2h-2a2 2 0 0 0-2 2v4"/><path d="M2 7h20"/><path d="M22 7v3a2 2 0 0 1-2 2a2.7 2.7 0 0 1-1.59-.63.7.7 0 0 0-.82 0A2.7 2.7 0 0 1 16 12a2.7 2.7 0 0 1-1.59-.63.7.7 0 0 0-.82 0A2.7 2.7 0 0 1 12 12a2.7 2.7 0 0 1-1.59-.63.7.7 0 0 0-.82 0A2.7 2.7 0 0 1 8 12a2.7 2.7 0 0 1-1.59-.63.7.7 0 0 0-.82 0A2.7 2.7 0 0 1 4 12v-3a2 2 0 0 1-2-2V7"/></svg>
              <span className="text-[9px] tracking-[0.15em] font-bold text-[#3d332a] leading-tight">BUILT FOR<br/>RETAILERS</span>
            </div>
            <div className="flex items-center gap-3 text-left">
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="text-[#8c6d48]"><path d="M14 18V6a2 2 0 0 0-2-2H4a2 2 0 0 0-2 2v11a1 1 0 0 0 1 1h2"/><path d="M15 18H9"/><path d="M19 18h2a1 1 0 0 0 1-1v-3.65a1 1 0 0 0-.22-.624l-3.48-4.35A1 1 0 0 0 17.52 8H14"/><circle cx="17" cy="18" r="2"/><circle cx="7" cy="18" r="2"/></svg>
              <span className="text-[9px] tracking-[0.15em] font-bold text-[#3d332a] leading-tight">RELIABLE DISTRIBUTION<br/>ACROSS FLORIDA</span>
            </div>
            <div className="flex items-center gap-3 text-left">
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="text-[#8c6d48]"><path d="M3.85 8.62a4 4 0 0 1 4.78-4.77 4 4 0 0 1 6.74 0 4 4 0 0 1 4.78 4.78 4 4 0 0 1 0 6.74 4 4 0 0 1-4.77 4.78 4 4 0 0 1-6.75 0 4 4 0 0 1-4.78-4.77 4 4 0 0 1 0-6.76Z"/><path d="m9 12 2 2 4-4"/></svg>
              <span className="text-[9px] tracking-[0.15em] font-bold text-[#3d332a] leading-tight">PREMIUM BRANDS<br/>& DIVERSE CATEGORIES</span>
            </div>
          </div>

          {/* 4 BOXES GRID */}
          <div className="fs-content grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 px-4 h-[160px] md:h-[180px]">
            {/* Box 1 */}
            <div className="bg-[#fcfbf9]/80 backdrop-blur-lg p-5 flex flex-col group hover:-translate-y-1 transition-transform duration-500 relative overflow-hidden border border-[#e8e4db] rounded-lg text-left h-full shadow-sm">
              <div className="absolute right-0 top-0 bottom-0 w-2/3 opacity-30 group-hover:opacity-40 group-hover:scale-105 transition-transform duration-700 bg-cover bg-center" style={{ backgroundImage: `url('/leaf-bg.jpg')` }} />
              <div className="absolute inset-0 bg-gradient-to-r from-[#fcfbf9] via-[#fcfbf9]/90 to-transparent" />
              <div className="relative z-10 flex flex-col h-full justify-between">
                <div>
                  <div className="w-5 h-5 mb-2"><img src="/icons/leaf-icon.svg" alt="Brands" className="w-full h-full object-contain opacity-80" /></div>
                  <h3 className="text-xs font-serif font-bold text-[#2b2621] mb-1 uppercase">BRANDS</h3>
                  <p className="text-[10px] text-[#6b6256] leading-snug pr-4 line-clamp-2">A curated portfolio of leading cigar, cigarette, and vape brands trusted by retailers.</p>
                </div>
                <Link href="/brands" className="text-[9px] tracking-[0.2em] font-bold text-[#8c6d48] group-hover:text-[#F8B93C] transition-colors flex items-center gap-2">
                  LEARN MORE <span>→</span>
                </Link>
              </div>
            </div>

            {/* Box 2 */}
            <div className="bg-[#fcfbf9]/80 backdrop-blur-lg p-5 flex flex-col group hover:-translate-y-1 transition-transform duration-500 relative overflow-hidden border border-[#e8e4db] rounded-lg text-left h-full shadow-sm">
              <div className="absolute right-0 top-0 bottom-0 w-2/3 opacity-30 group-hover:opacity-40 group-hover:scale-105 transition-transform duration-700 bg-cover bg-center" style={{ backgroundImage: `url('/smoke-bg.jpg')` }} />
              <div className="absolute inset-0 bg-gradient-to-r from-[#fcfbf9] via-[#fcfbf9]/90 to-transparent" />
              <div className="relative z-10 flex flex-col h-full justify-between">
                <div>
                  <div className="w-5 h-5 mb-2"><img src="/icons/box-icon.svg" alt="Products" className="w-full h-full object-contain opacity-80" /></div>
                  <h3 className="text-xs font-serif font-bold text-[#2b2621] mb-1 uppercase">PRODUCTS</h3>
                  <p className="text-[10px] text-[#6b6256] leading-snug pr-4 line-clamp-2">Cigars, cigarettes, vapes, and accessories to meet your customers' demand.</p>
                </div>
                <Link href="/products" className="text-[9px] tracking-[0.2em] font-bold text-[#8c6d48] group-hover:text-[#F8B93C] transition-colors flex items-center gap-2">
                  LEARN MORE <span>→</span>
                </Link>
              </div>
            </div>

            {/* Box 3 */}
            <div className="bg-[#fcfbf9]/80 backdrop-blur-lg p-5 flex flex-col group hover:-translate-y-1 transition-transform duration-500 relative overflow-hidden border border-[#e8e4db] rounded-lg text-left h-full shadow-sm">
              <div className="absolute right-0 top-0 bottom-0 w-2/3 opacity-30 group-hover:opacity-40 group-hover:scale-105 transition-transform duration-700 bg-cover bg-center" style={{ backgroundImage: `url('/warehouse-bg.jpg')` }} />
              <div className="absolute inset-0 bg-gradient-to-r from-[#fcfbf9] via-[#fcfbf9]/90 to-transparent" />
              <div className="relative z-10 flex flex-col h-full justify-between">
                <div>
                  <div className="w-5 h-5 mb-2"><img src="/icons/truck-icon.svg" alt="Services" className="w-full h-full object-contain opacity-80" /></div>
                  <h3 className="text-xs font-serif font-bold text-[#2b2621] mb-1 uppercase">WHOLESALE</h3>
                  <p className="text-[10px] text-[#6b6256] leading-snug pr-4 line-clamp-2">Competitive pricing, consistent inventory, and dependable distribution.</p>
                </div>
                <Link href="/company" className="text-[9px] tracking-[0.2em] font-bold text-[#8c6d48] group-hover:text-[#F8B93C] transition-colors flex items-center gap-2">
                  LEARN MORE <span>→</span>
                </Link>
              </div>
            </div>

            {/* Box 4 */}
            <div className="bg-[#fcfbf9]/80 backdrop-blur-lg p-5 flex flex-col group hover:-translate-y-1 transition-transform duration-500 relative overflow-hidden border border-[#e8e4db] rounded-lg text-left h-full shadow-sm">
              <div className="absolute right-0 top-0 bottom-0 w-2/3 opacity-30 group-hover:opacity-40 group-hover:scale-105 transition-transform duration-700 bg-cover bg-center" style={{ backgroundImage: `url('/blur-bg.jpg')` }} />
              <div className="absolute inset-0 bg-gradient-to-r from-[#fcfbf9] via-[#fcfbf9]/90 to-transparent" />
              <div className="relative z-10 flex flex-col h-full justify-between">
                <div>
                  <div className="w-5 h-5 mb-2"><img src="/icons/user-plus-icon.svg" alt="Access" className="w-full h-full object-contain opacity-80" /></div>
                  <h3 className="text-xs font-serif font-bold text-[#2b2621] mb-1 uppercase">ACCESS</h3>
                  <p className="text-[10px] text-[#6b6256] leading-snug pr-4 line-clamp-2">Become an approved customer and get full catalog access and pricing.</p>
                </div>
                <Link href="/contact" className="text-[9px] tracking-[0.2em] font-bold text-[#8c6d48] group-hover:text-[#F8B93C] transition-colors flex items-center gap-2">
                  APPLY NOW <span>→</span>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ========================================================= */}
      {/* 2. COMPANY SECTION                                        */}
      {/* ========================================================= */}
      <section className="fs-section relative h-screen w-full flex items-center bg-[#fdfbf7] z-10 overflow-hidden">
        
        {/* 1. BACKGROUND SECTION & WHITE OVERLAY */}
        <div className="fs-bg absolute inset-0 pointer-events-none opacity-0">
          {/* Gambar Background Full */}
          <div className="absolute inset-0 bg-[url('/company-01.jpg')] bg-cover bg-center" />
          
          {/* LAYER OVERLAY PUTIH TRANSPARAN + BLUR TIPIS */}
          {/* bg-[#fdfbf7]/85 bikin background tertutup 85% warna off-white */}
          <div className="absolute inset-0 bg-[#fdfbf7]/85 backdrop-blur-[2px]" />
        </div>
        
        <div className="relative z-10 max-w-7xl mx-auto px-8 w-full flex flex-col md:flex-row items-center gap-16">
          
          {/* BAGIAN KIRI (TEKS) */}
          <div className="w-full md:w-1/2">
            <p className="fs-content text-[10px] tracking-[0.3em] uppercase text-[#8c6d48] font-bold mb-4">— Our Company</p>
            <h2 className="fs-content text-5xl font-serif font-bold text-[#2b2621] leading-tight mb-8">
              A Legacy of Reliable Distribution.
            </h2>
            <p className="fs-content text-[#6b6256] text-sm leading-relaxed mb-10 max-w-lg font-medium">
              Based in Florida, Latin American Cigars Corp. has established itself as a premier wholesale partner for retailers. We bridge the gap between world-class tobacco manufacturers and the retail market, offering a streamlined supply chain, competitive terms, and uncompromised service quality.
            </p>
            <div className="fs-content">
              <Link href="/company" className="inline-flex items-center gap-3 px-8 py-4 bg-[#8c6d48] text-white text-[10px] tracking-[0.2em] font-bold hover:bg-[#F8B93C] hover:text-[#1a1714] transition-colors rounded-sm shadow-md">
                DISCOVER OUR STORY <span>→</span>
              </Link>
            </div>
          </div>

          {/* BAGIAN KANAN (GAMBAR KOTAK) */}
          <div className="w-full md:w-1/2 h-[60vh] relative rounded-xl overflow-hidden shadow-2xl fs-content group border border-[#e6e2d8]">
            
            {/* 2. GAMBAR KOTAK (FLORIDA OPERATIONS HUB) */}
            <div className="absolute inset-0 bg-[#eae5db] bg-[url('/company-02.jpg')] bg-cover bg-center transition-transform duration-700 group-hover:scale-105" />
            
            {/* Overlay gelap tipis yang hilang saat di-hover */}
            <div className="absolute inset-0 bg-black/10 pointer-events-none transition-opacity duration-700 group-hover:bg-black/0" />
            
            <div className="absolute bottom-6 left-6 bg-white/95 backdrop-blur-md px-4 py-2 rounded-sm text-[9px] tracking-widest uppercase font-bold text-[#8c6d48] shadow-lg">
              Florida Operations Hub
            </div>
          </div>

        </div>
      </section>

      {/* ========================================================= */}
      {/* 3. BRANDS SECTION (INFINITE MARQUEE LOOP)                 */}
      {/* ========================================================= */}
      <section className="fs-section relative w-full flex flex-col justify-center items-center bg-white z-10 overflow-hidden py-32 border-b border-[#e6e2d8]">
        
        {/* CSS KEYFRAMES UNTUK ANIMASI MARQUEE */}
        <style dangerouslySetInnerHTML={{__html: `
          @keyframes marquee {
            0% { transform: translateX(0); }
            100% { transform: translateX(calc(-200px * 15 - 3rem * 15)); } /* 15 adalah setengah dari total elemen untuk seamless loop */
          }
          .animate-marquee {
            display: flex;
            width: fit-content;
            animation: marquee 40s linear infinite;
          }
          /* Pause animasi kalau area di-hover */
          .marquee-container:hover .animate-marquee {
            animation-play-state: paused;
          }
        `}} />

        <div className="relative z-10 max-w-7xl mx-auto px-8 w-full text-center mb-16">
          <p className="fs-content text-[10px] tracking-[0.3em] uppercase text-[#8c6d48] font-bold mb-4">— Curated Portfolio</p>
          <h2 className="fs-content text-5xl md:text-[64px] font-serif font-bold text-[#2b2621] leading-tight">Representing<br/>Premium Brands.</h2>
        </div>

        {/* CONTAINER MARQUEE LOOP */}
        <div className="fs-content w-full relative overflow-hidden marquee-container py-8">
          {/* Efek fade/gradient di pinggiran kiri-kanan layar supaya logo gak kepotong kasar */}
          <div className="absolute top-0 bottom-0 left-0 w-32 bg-gradient-to-r from-white to-transparent z-10 pointer-events-none" />
          <div className="absolute top-0 bottom-0 right-0 w-32 bg-gradient-to-l from-white to-transparent z-10 pointer-events-none" />

          <div className="animate-marquee gap-12 pl-12">
            {/* 
              KITA DUPLIKAT ARRAY 30 LOGO INI JADI 2 KALI (TOTAL 60) 
              AGAR ANIMASI LOOPING-NYA MULUS & TIDAK TERPUTUS.
              Ganti "logo-1.png" sesuai dengan nama file logo lu di folder public/brands/
            */}
            {[...Array(2)].map((_, arrayIndex) => (
              <>
                {[
                  { name: "ACID Cigars", img: "acid.jpg" },
                  { name: "Aging Room", img: "aging-room.jpg" },
                  { name: "AJ Fernandez", img: "aj-fernandez.jpg" },
                  { name: "Altadis", img: "altadis2.png" },
                  { name: "Arturo Fuente", img: "arturo-fuente.jpg" },
                  { name: "AVO", img: "avo.jpg" },
                  { name: "Cafeteros", img: "cafeteros.png" },
                  { name: "Camacho", img: "camacho.jpg" },
                  { name: "Chevere", img: "chevere.jpg" },
                  { name: "Cohiba", img: "cohiba.jpg" },
                  { name: "Cuban Rejects", img: "cuban-rejects.jpg" },
                  { name: "Cuban Sandwich", img: "cuban-sandwich.webp" },
                  { name: "Cubiche", img: "cubiche.webp" },
                  { name: "Don Felo", img: "don-felo.jpg" },
                  { name: "Drew Estate", img: "drew-estate.jpg" },
                  { name: "ElBacan", img: "elbacan.jpg" },
                  { name: "H Upmann", img: "h-upmann.jpg" },
                  { name: "Jaime Garcia", img: "jaime-garcia.jpg" },
                  { name: "Java", img: "java.jpg" },
                  { name: "La Aurora", img: "la-aurora.jpg" },
                  { name: "La Galera", img: "la-galera.jpg" },
                  { name: "La Gloria Cubana", img: "la-gloria-cubana.jpg" },
                  { name: "Macanudo", img: "macnudo.jpg" },
                  { name: "Maravilla Gigantes", img: "maravilla-gigantes.jpg" },
                  { name: "My Father", img: "my-father.jpg" },
                  { name: "New Cuba", img: "new-cuba.jpg" },
                  { name: "Olivia", img: "olivia.jpg" },
                  { name: "Partagas", img: "partagas.jpg" },
                  { name: "Perdomo", img: "perdomo.jpg" },
                  { name: "Perez Carillo", img: "perez-carillo.jpg" },
                ].map((brand, i) => (
                  <div key={`${arrayIndex}-${i}`} className="group flex flex-col items-center justify-center w-[200px] flex-shrink-0 cursor-pointer">
                    {/* CONTAINER LOGO */}
                    <div className="h-48 w-full flex items-center justify-center mb-4 transition-transform duration-300 group-hover:scale-110">
                      {/* 
                        Logo dibuat grayscale dan opacity 60% by default, 
                        saat di-hover akan full color dan jelas. 
                      */}
                      <img 
                        src={`/brands/${brand.img}`} 
                        alt={brand.name} 
                        className="max-h-full max-w-full object-contain filter grayscale opacity-60 group-hover:grayscale-0 group-hover:opacity-100 transition-all duration-300"
                        // Fallback kalau gambar belum ada biar gak error/bolong
                        onError={(e) => {
                          e.currentTarget.src = 'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="100" height="100" viewBox="0 0 100 100"><rect width="100" height="100" fill="%23f0f0f0"/><text x="50%" y="50%" dominant-baseline="middle" text-anchor="middle" font-size="12" fill="%23888">NO LOGO</text></svg>';
                        }}
                      />
                    </div>
                    {/* NAMA BRAND */}
                    <span className="text-[11px] font-bold tracking-widest uppercase text-[#6b6256] group-hover:text-[#8c6d48] transition-colors duration-300">
                      {brand.name}
                    </span>
                  </div>
                ))}
              </>
            ))}
          </div>
        </div>
        
        <div className="fs-content mt-16 z-10">
          <Link href="/brands" className="inline-flex items-center gap-3 px-8 py-4 border border-[#8c6d48] text-[#8c6d48] text-[10px] tracking-[0.2em] font-bold hover:bg-[#8c6d48] hover:text-white transition-colors rounded-sm shadow-sm">
            VIEW FULL PORTFOLIO <span>→</span>
          </Link>
        </div>
      </section>

      {/* ========================================================= */}
      {/* 4. PRODUCTS SECTION                                       */}
      {/* ========================================================= */}
      <section className="fs-section relative h-screen w-full flex items-center bg-[#fdfbf7] z-10 overflow-hidden">
        <div className="fs-bg absolute inset-0 bg-transparent bg-cover bg-center opacity-0 pointer-events-none" />
        <div className="relative z-10 max-w-7xl mx-auto px-8 w-full">
          <div className="text-center mb-16">
            <p className="fs-content text-[10px] tracking-[0.3em] uppercase text-[#8c6d48] font-bold mb-4">— Product Categories</p>
            <h2 className="fs-content text-5xl font-serif font-bold text-[#2b2621] leading-tight">Meeting Retail Demand.</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 h-[50vh]">
            <div className="fs-content group relative bg-[#eae5db] rounded-xl overflow-hidden shadow-lg flex items-end p-10 cursor-pointer">
              <div className="absolute inset-0 bg-[url('/smoke-bg.jpg')] bg-cover bg-center opacity-40 group-hover:scale-105 transition-transform duration-1000" />
              <div className="absolute inset-0 bg-gradient-to-t from-[#2b2621] via-[#2b2621]/40 to-transparent opacity-90 group-hover:opacity-100 transition-opacity" />
              <div className="relative z-10 w-full">
                <h3 className="text-white font-serif font-bold text-3xl mb-4">Premium Cigars</h3>
                <Link href="/products" className="inline-flex w-full justify-between items-center text-[10px] tracking-[0.2em] font-bold text-[#c4aa82] group-hover:text-[#F8B93C] transition-colors border-t border-white/20 pt-4">
                  EXPLORE CATEGORY <span>→</span>
                </Link>
              </div>
            </div>
            <div className="fs-content group relative bg-[#eae5db] rounded-xl overflow-hidden shadow-lg flex items-end p-10 cursor-pointer">
              <div className="absolute inset-0 bg-[url('/blur-bg.jpg')] bg-cover bg-center opacity-40 group-hover:scale-105 transition-transform duration-1000" />
              <div className="absolute inset-0 bg-gradient-to-t from-[#2b2621] via-[#2b2621]/40 to-transparent opacity-90 group-hover:opacity-100 transition-opacity" />
              <div className="relative z-10 w-full">
                <h3 className="text-white font-serif font-bold text-3xl mb-4">Vapes & E-Cigs</h3>
                <Link href="/products" className="inline-flex w-full justify-between items-center text-[10px] tracking-[0.2em] font-bold text-[#c4aa82] group-hover:text-[#F8B93C] transition-colors border-t border-white/20 pt-4">
                  EXPLORE CATEGORY <span>→</span>
                </Link>
              </div>
            </div>
            <div className="fs-content group relative bg-[#eae5db] rounded-xl overflow-hidden shadow-lg flex items-end p-10 cursor-pointer">
              <div className="absolute inset-0 bg-[url('/warehouse-bg.jpg')] bg-cover bg-center opacity-40 group-hover:scale-105 transition-transform duration-1000" />
              <div className="absolute inset-0 bg-gradient-to-t from-[#2b2621] via-[#2b2621]/40 to-transparent opacity-90 group-hover:opacity-100 transition-opacity" />
              <div className="relative z-10 w-full">
                <h3 className="text-white font-serif font-bold text-3xl mb-4">Accessories</h3>
                <Link href="/products" className="inline-flex w-full justify-between items-center text-[10px] tracking-[0.2em] font-bold text-[#c4aa82] group-hover:text-[#F8B93C] transition-colors border-t border-white/20 pt-4">
                  EXPLORE CATEGORY <span>→</span>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ========================================================= */}
      {/* 5. CONTACT & FOOTER SECTION                               */}
      {/* ========================================================= */}
      <section className="fs-section relative h-screen w-full flex flex-col justify-between bg-[#f2efe9] z-10 overflow-hidden">
        <div className="fs-bg absolute inset-0 bg-transparent bg-cover bg-center opacity-0 pointer-events-none" />
        <div className="relative z-10 flex-grow flex items-center justify-center px-8">
          <div className="fs-content max-w-4xl mx-auto text-center bg-white/80 backdrop-blur-xl border border-[#dcd4c5] p-16 rounded-2xl shadow-xl">
            <p className="text-[10px] tracking-[0.3em] uppercase text-[#8c6d48] font-bold mb-4">— Partner With Us</p>
            <h2 className="text-5xl font-serif font-bold text-[#2b2621] mb-6">Ready to Elevate Your Retail Business?</h2>
            <p className="text-[#6b6256] text-sm md:text-base leading-relaxed mb-12 max-w-2xl mx-auto">
              Get in touch for wholesale inquiries, catalog access, or to learn more about our distribution capabilities across Florida.
            </p>
            <div className="flex flex-col sm:flex-row gap-6 justify-center">
              <Link href="/contact" className="bg-[#8c6d48] text-white px-10 py-4 text-[11px] tracking-[0.2em] font-bold hover:bg-[#F8B93C] hover:text-[#1a1714] transition-colors rounded-sm shadow-md">
                CONTACT SALES
              </Link>
              <Link href="/admin/login" className="border border-[#8c6d48] text-[#8c6d48] px-10 py-4 text-[11px] tracking-[0.2em] font-bold hover:bg-[#8c6d48] hover:text-white transition-colors rounded-sm">
                PARTNER LOGIN
              </Link>
            </div>
          </div>
        </div>
        <footer className="fs-content w-full border-t border-[#dcd4c5] py-8 text-center bg-[#eae4d9]">
          <p className="text-[10px] text-[#7a6f63] uppercase tracking-[0.2em] font-bold">
            © {new Date().getFullYear()} Latin American Cigars Corp. All Rights Reserved.
          </p>
        </footer>
      </section>

    </div>
  );
}