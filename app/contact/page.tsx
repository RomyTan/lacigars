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
    let opacity = 0.4;
    if (z < -15) opacity = (1 - (-15 - z) / 4) * 0.4; 
    else if (z > 2) opacity = (1 - (z - 2) / 3) * 0.4; 
    matRef.current.opacity = Math.max(0, Math.min(0.4, opacity));
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

export default function ContactPage() {
  const mainRef = useRef<HTMLDivElement>(null);
  const [isScrolled, setIsScrolled] = useState(false);

  const menuItems = [
    { name: 'Home', link: '/', active: false },
    { name: 'Company', link: '/company', active: false },
    { name: 'Brands', link: '/brands', active: false },
    { name: 'Products', link: '/products', active: false },
    { name: 'Contact', link: '/contact', active: true },
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
    <div ref={mainRef} className="text-[#2b2621] font-sans selection:bg-[#F8B93C] selection:text-black overflow-x-hidden relative bg-[#fdfbf7] h-screen flex flex-col">
      
      {/* BACKGROUND 3D */}
      <div className="fixed inset-0 z-0 pointer-events-none opacity-40 bg-[#fdfbf7]">
        <Canvas camera={{ position: [0, 0, 5] }}>
          <Suspense fallback={null}><MultiLayerClouds /></Suspense>                 
        </Canvas>
      </div>

      {/* NAVBAR */}
      <nav className={`fixed top-0 left-0 w-full px-8 py-5 flex justify-between items-center z-999 transition-all duration-500 ${isScrolled ? 'bg-[#fdfbf7]/95 backdrop-blur-md shadow-sm border-b border-[#e6e2d8]/60' : 'bg-transparent'}`}>
        <div className="nav-anim flex items-center gap-3">
          <Link href="/" className="flex items-center gap-3">
            <img src="/lacigars-logo.png" alt="Logo" className="h-12 md:h-14 w-auto object-contain" />
            <div className="hidden sm:block text-[11px] font-bold tracking-[0.15em] text-[#2b2621] leading-snug border-l border-[#8c6d48] pl-4 uppercase">
              LATIN AMERICAN<br />CIGARS CORP.
            </div>
          </Link>
        </div>
        <div className="hidden lg:flex items-center gap-8">
          {menuItems.map((item, i) => (
            <div key={i} className="nav-anim">
              <Link href={item.link} className={`text-[11px] tracking-[0.2em] uppercase font-bold transition-colors duration-300 py-2 relative group ${item.active ? 'text-[#8c6d48]' : 'text-[#4a4238] hover:text-[#8c6d48]'}`}>
                {item.name}
                <span className={`absolute bottom-0 left-0 h-0.5 bg-[#8c6d48] transition-all duration-300 ${item.active ? 'w-full' : 'w-0 group-hover:w-full'}`} />
              </Link>
            </div>
          ))}
        </div>
        <div className="flex items-center gap-4 nav-anim">
          <Link href="/admin/login" className="text-[11px] tracking-[0.15em] uppercase font-bold text-[#4a4238] hover:text-[#8c6d48] transition-colors flex items-center gap-2 px-3 py-2">
            <svg className="w-4 h-4 text-[#8c6d48]" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" /></svg>
            Partner Login
          </Link>
        </div>
      </nav>

      {/* SINGLE FULL-SCREEN SECTION FOR CONTACT */}
      <section className="fs-section relative grow w-full flex flex-col justify-center items-center px-8 z-10 bg-transparent pt-24">
        <div className="relative z-10 max-w-6xl mx-auto w-full flex flex-col md:flex-row bg-white/80 backdrop-blur-xl border border-[#dcd4c5] rounded-2xl shadow-xl overflow-hidden">
          
          {/* KIRI: INFO PERUSAHAAN */}
          <div className="w-full md:w-5/12 bg-[#2b2621] text-white p-12 flex flex-col justify-between relative overflow-hidden">
            {/* Background pattern samar */}
            <div className="absolute inset-0 bg-[url('/leaf-bg.jpg')] bg-cover bg-center opacity-10 mix-blend-overlay pointer-events-none" />
            <div className="relative z-10">
              <p className="fs-content text-[10px] tracking-[0.3em] uppercase text-[#F8B93C] font-bold mb-4">— Get in touch</p>
              <h2 className="fs-content text-4xl font-serif font-bold mb-6 text-[#fdfbf7]">Let's Talk Business.</h2>
              <p className="fs-content text-[#c4aa82] text-sm leading-relaxed mb-10">
                Whether you're looking to become an approved wholesale customer, request full catalog access, or ask a general inquiry, our team is ready to assist you.
              </p>

              <div className="fs-content space-y-6">
                <div className="flex items-start gap-4">
                  <svg className="w-5 h-5 text-[#F8B93C] mt-1" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"></path></svg>
                  <div>
                    <h4 className="text-[10px] tracking-widest text-[#8c6d48] uppercase font-bold mb-1">Email Support</h4>
                    <p className="text-sm text-[#fdfbf7]">support@latinamericancigars.com</p>
                  </div>
                </div>
                <div className="flex items-start gap-4">
                  <svg className="w-5 h-5 text-[#F8B93C] mt-1" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"></path><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"></path></svg>
                  <div>
                    <h4 className="text-[10px] tracking-widest text-[#8c6d48] uppercase font-bold mb-1">Florida Operations Hub</h4>
                    <p className="text-sm text-[#fdfbf7]">Latin American Cigars Corp.<br/>Florida, USA</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* KANAN: FORMULIR KONTAK */}
          <div className="w-full md:w-7/12 p-12">
            <form className="fs-content flex flex-col h-full justify-center space-y-6">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div>
                  <label className="block text-[10px] tracking-widest text-[#6b6256] uppercase font-bold mb-2">First Name</label>
                  <input type="text" className="w-full bg-[#fdfbf7] border border-[#dcd4c5] focus:border-[#8c6d48] outline-none rounded-sm px-4 py-3 text-sm text-[#2b2621] transition-colors" placeholder="John" />
                </div>
                <div>
                  <label className="block text-[10px] tracking-widest text-[#6b6256] uppercase font-bold mb-2">Last Name</label>
                  <input type="text" className="w-full bg-[#fdfbf7] border border-[#dcd4c5] focus:border-[#8c6d48] outline-none rounded-sm px-4 py-3 text-sm text-[#2b2621] transition-colors" placeholder="Doe" />
                </div>
              </div>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div>
                  <label className="block text-[10px] tracking-widest text-[#6b6256] uppercase font-bold mb-2">Business Email</label>
                  <input type="email" className="w-full bg-[#fdfbf7] border border-[#dcd4c5] focus:border-[#8c6d48] outline-none rounded-sm px-4 py-3 text-sm text-[#2b2621] transition-colors" placeholder="john@retailstore.com" />
                </div>
                <div>
                  <label className="block text-[10px] tracking-widest text-[#6b6256] uppercase font-bold mb-2">Company Name</label>
                  <input type="text" className="w-full bg-[#fdfbf7] border border-[#dcd4c5] focus:border-[#8c6d48] outline-none rounded-sm px-4 py-3 text-sm text-[#2b2621] transition-colors" placeholder="Retail Store LLC" />
                </div>
              </div>

              <div>
                <label className="block text-[10px] tracking-widest text-[#6b6256] uppercase font-bold mb-2">Message / Inquiry</label>
                <textarea rows={4} className="w-full bg-[#fdfbf7] border border-[#dcd4c5] focus:border-[#8c6d48] outline-none rounded-sm px-4 py-3 text-sm text-[#2b2621] transition-colors resize-none" placeholder="How can we help you?" />
              </div>

              <button type="button" className="bg-[#8c6d48] text-white px-8 py-4 text-[11px] tracking-[0.2em] font-bold hover:bg-[#F8B93C] hover:text-[#1a1714] transition-colors rounded-sm shadow-md w-full sm:w-auto self-end">
                SEND MESSAGE
              </button>
            </form>
          </div>

        </div>
      </section>

      {/* FOOTER */}
      <footer className="w-full border-t border-[#dcd4c5]/60 py-8 text-center bg-[#eae4d9]/80 backdrop-blur-md relative z-10 mt-auto">
        <p className="text-[10px] text-[#7a6f63] uppercase tracking-[0.2em] font-bold">
          © {new Date().getFullYear()} Latin American Cigars Corp. All Rights Reserved.
        </p>
      </footer>
      
    </div>
  );
}