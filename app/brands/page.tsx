'use client';
import { useEffect, useRef, Suspense, useState } from 'react';
import Link from 'next/link';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import Lenis from '@studio-freight/lenis';
import { Canvas, useFrame } from '@react-three/fiber';
import { useTexture } from '@react-three/drei';

// --- KOMPONEN BACKGROUND 3D AWAN ---
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
    let opacity = 0.3;
    if (z < -15) opacity = (1 - (-15 - z) / 4) * 0.3; 
    else if (z > 2) opacity = (1 - (z - 2) / 3) * 0.3; 
    matRef.current.opacity = Math.max(0, Math.min(0.3, opacity));
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

export default function BrandsPage() {
  const mainRef = useRef<HTMLDivElement>(null);
  const [isScrolled, setIsScrolled] = useState(false);

  const menuItems = [
    { name: 'Home', link: '/', active: false },
    { name: 'Company', link: '/company', active: false },
    { name: 'Brands', link: '/brands', active: true },
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

    let ctx = gsap.context(() => {
      gsap.from(".nav-anim", { y: -20, opacity: 0, duration: 1, stagger: 0.05, ease: "power3.out" });
      const sections = gsap.utils.toArray('.fs-section');
      sections.forEach((sec: any) => {
        const content = sec.querySelectorAll('.fs-content');
        if(content.length > 0) {
          gsap.fromTo(content, { y: 80, opacity: 0 }, {
            y: 0, opacity: 1, duration: 1.5, stagger: 0.1, ease: "power3.out", 
            scrollTrigger: { trigger: sec, start: "top 75%" }
          });
        }
      });
      ScrollTrigger.refresh();
    }, mainRef.current!); 

    return () => {
      ctx.revert();
      lenis.destroy();
      gsap.ticker.remove((time) => lenis.raf(time * 1000));
    };
  }, []);

  return (
    <div ref={mainRef} className="text-[#fdfbf7] font-sans selection:bg-[#F8B93C] selection:text-black overflow-x-hidden relative bg-[#1a1714]">
      
      {/* BACKGROUND 3D */}
      <div className="fixed inset-0 z-0 pointer-events-none opacity-20 bg-[#1a1714]">
        <Canvas camera={{ position: [0, 0, 5] }}>
          <Suspense fallback={null}><MultiLayerClouds /></Suspense>                 
        </Canvas>
        <div className="absolute inset-0 bg-[#1a1714]/80" />
      </div>

      {/* NAVBAR */}
      <nav className={`fixed top-0 left-0 w-full px-8 py-5 flex justify-between items-center z-999 transition-all duration-500 ${isScrolled ? 'bg-[#1a1714]/95 shadow-sm border-b border-[#3d332a]' : 'bg-transparent'}`}>
        <div className="nav-anim flex items-center gap-3">
          <Link href="/" className="flex items-center gap-3">
            <img src="/lacigars-logo.png" alt="Logo" className="h-12 md:h-14 w-auto object-contain brightness-0 invert" />
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
            <svg className="w-4 h-4 text-[#c4aa82]" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" /></svg>
            Partner Login
          </Link>
          <Link href="/contact" className="hidden sm:inline-block bg-[#8c6d48] text-white px-5 py-2.5 text-[10px] uppercase tracking-[0.2em] font-bold hover:bg-[#F8B93C] hover:text-[#1a1714] transition-all duration-300 rounded-sm">
            Become a Customer
          </Link>
        </div>
      </nav>

      {/* 1. HERO SECTION */}
      <section className="fs-section relative h-screen w-full flex flex-col justify-center items-center px-8 z-10 bg-transparent border-b border-[#2b2621]">
        <div className="relative z-10 max-w-4xl mx-auto w-full text-center mt-12">
          <p className="fs-content text-[10px] md:text-xs tracking-[0.3em] uppercase text-[#F8B93C] font-bold mb-6 flex items-center justify-center gap-4">
            <span className="w-8 h-px bg-[#F8B93C]"></span> OUR PORTFOLIO <span className="w-8 h-px bg-[#F8B93C]"></span>
          </p>
          <h1 className="fs-content text-5xl md:text-[72px] font-serif font-bold text-[#fdfbf7] tracking-tight leading-[1.05] mb-6">
            Curated Excellence.
          </h1>
          <p className="fs-content text-[#c4aa82] text-sm md:text-base max-w-2xl mx-auto leading-relaxed mb-12">
            We exclusively distribute brands that meet our rigorous standards for quality and market demand. A selection of our key brand partnerships is showcased below.
          </p>
          <div className="fs-content animate-bounce mt-10">
            <span className="text-[#F8B93C] opacity-80 text-sm">↓</span>
          </div>
        </div>
      </section>

      {/* 2. CIGARS BRANDS */}
      <section className="fs-section relative h-screen w-full flex items-center z-10 bg-[#1a1714] border-b border-[#2b2621]">
        <div className="relative z-10 max-w-7xl mx-auto px-8 w-full">
          <div className="text-center mb-16">
            <p className="fs-content text-[10px] tracking-[0.3em] uppercase text-[#F8B93C] font-bold mb-4">— Category</p>
            <h2 className="fs-content text-4xl font-serif font-bold text-[#fdfbf7]">Premium Cigars</h2>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {/* [REPLACE_ME]: Ganti tulisan BRAND LOGO dengan <img> logo ori lo nanti */}
            {[1,2,3,4,5,6,7,8].map((item) => (
              <div key={item} className="fs-content h-32 bg-[#2b2621]/40 border border-[#3d332a] rounded-xl flex items-center justify-center text-[10px] tracking-widest text-[#c4aa82] hover:bg-[#2b2621] transition-colors cursor-pointer group">
                <span className="group-hover:scale-110 transition-transform duration-300">BRAND LOGO {item}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 3. VAPES & ACCESSORIES BRANDS */}
      <section className="fs-section relative h-screen w-full flex items-center z-10 bg-linear-to-b from-[#1a1714] to-[#0d0b0a] border-b border-[#2b2621]">
        <div className="relative z-10 max-w-7xl mx-auto px-8 w-full">
          <div className="text-center mb-16">
            <p className="fs-content text-[10px] tracking-[0.3em] uppercase text-[#F8B93C] font-bold mb-4">— Category</p>
            <h2 className="fs-content text-4xl font-serif font-bold text-[#fdfbf7]">Vapes & Accessories</h2>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {/* [REPLACE_ME]: Ganti tulisan BRAND LOGO dengan <img> logo ori lo nanti */}
            {[9,10,11,12,13,14,15,16].map((item) => (
              <div key={item} className="fs-content h-32 bg-[#2b2621]/40 border border-[#3d332a] rounded-xl flex items-center justify-center text-[10px] tracking-widest text-[#c4aa82] hover:bg-[#2b2621] transition-colors cursor-pointer group">
                <span className="group-hover:scale-110 transition-transform duration-300">BRAND LOGO {item}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 4. CTA & FOOTER */}
      <section className="fs-section relative h-screen w-full flex flex-col justify-between bg-[#0d0b0a] z-10">
        <div className="relative z-10 grow flex items-center justify-center px-8">
          <div className="fs-content max-w-4xl mx-auto text-center bg-[#1a1714] border border-[#3d332a] p-16 rounded-2xl shadow-2xl">
            <h2 className="text-4xl font-serif font-bold text-[#fdfbf7] mb-6">Explore Our Full Catalog</h2>
            <p className="text-[#c4aa82] text-sm leading-relaxed mb-10 max-w-xl mx-auto">
              This is only a selection of our brands. Approved wholesale partners gain access to our complete portfolio and competitive pricing.
            </p>
            <div className="flex flex-col sm:flex-row gap-6 justify-center">
              <Link href="/admin/login" className="bg-[#8c6d48] text-[#fdfbf7] px-10 py-4 text-[11px] tracking-[0.2em] font-bold hover:bg-[#F8B93C] hover:text-[#1a1714] transition-colors rounded-sm shadow-md">
                PARTNER LOGIN
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