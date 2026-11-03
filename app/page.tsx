'use client';
import { useEffect, useRef } from 'react';
import Link from 'next/link';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import dynamic from 'next/dynamic';
import Lenis from '@studio-freight/lenis';

const AgeVerification = dynamic(() => import('../components/AgeVerification'), { 
  ssr: false,
  loading: () => <div className="min-h-screen bg-[#0a0a0a]" /> 
});

function MainContent() {
  const mainRef = useRef<HTMLDivElement>(null);

  const menuItems = [
    { name: 'Home', link: '#home' },
    { name: 'Cigars', link: '#cigars', sub: ['Brands', 'Cigar Bundles', 'Flavored Premium Cigars', 'Cigarillos & Minis'] },
    { name: 'Machine Made', link: '#machine-made', sub: ['Brands', 'Filtered Cigars', 'Flavored Cigars', 'Cigar Wraps', 'Rolling Papers & Cones', 'All Machine Made'] },
    { name: 'Samplers', link: '#samplers' },
    { name: 'Accessories', link: '#accessories', sub: ['Cutters', 'Lighters'] },
    { name: 'Deals', link: '#deals', sub: ['Cheap Bundles', 'Hot Deals'] },
    { name: 'Best Sellers', link: '#best-sellers' }
  ];

  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);

    const lenis = new Lenis({
      duration: 1.5,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)), 
      orientation: 'vertical',
      gestureOrientation: 'vertical',
      smoothWheel: true,
      wheelMultiplier: 1,
      touchMultiplier: 2,
    });

    lenis.on('scroll', ScrollTrigger.update);
    gsap.ticker.add((time) => { lenis.raf(time * 1000) });
    gsap.ticker.lagSmoothing(0);

    const timer = setTimeout(() => {
      const ctx = gsap.context(() => {
        
        gsap.from(".nav-anim", { 
          y: -20, opacity: 0, duration: 1, stagger: 0.1, ease: "power4.out" 
        });

        gsap.from(".about-item", {
          scrollTrigger: { trigger: ".about-section", start: "top 80%" },
          y: 60, opacity: 0, duration: 1.5, stagger: 0.15, ease: "expo.out"
        });

        gsap.from(".category-card", {
          scrollTrigger: { trigger: ".category-section", start: "top 75%" },
          y: 50, opacity: 0, duration: 1.5, stagger: 0.1, ease: "power3.out"
        });

        gsap.to(".parallax-img", {
          scrollTrigger: {
            trigger: ".parallax-section",
            start: "top bottom",
            end: "bottom top",
            scrub: true,
          },
          y: 150, 
          ease: "none"
        });

        gsap.from(".cta-box", {
          scrollTrigger: { trigger: ".cta-section", start: "top 85%" },
          y: 50, opacity: 0, duration: 1.5, ease: "power3.out"
        });

        ScrollTrigger.refresh();
      }, mainRef);

      return () => ctx.revert(); 
    }, 100);

    return () => {
      clearTimeout(timer);
      lenis.destroy();
      gsap.ticker.remove((time) => { lenis.raf(time * 1000) });
    };
  }, []);

  return (
    <div ref={mainRef} className="text-[#e5e5e5] min-h-screen font-sans selection:bg-[#d4af37] selection:text-black overflow-x-hidden">
      
      {/* NAVBAR */}
      <nav className="fixed top-0 left-0 w-full px-8 py-6 flex justify-between items-center z-[999] pointer-events-none">
        
        <div className="nav-anim pointer-events-auto">
          <Link href="/">
            <img 
              src="/lacigars-logo.png" 
              alt="Latin American Cigars" 
              className="h-16 md:h-20 w-auto object-contain" 
            />
          </Link>
        </div>

        <div className="hidden lg:flex items-center gap-6 pointer-events-auto">
          {menuItems.map((item, i) => (
            <div key={i} className="relative group nav-anim">
              <Link 
                href={item.link} 
                className="text-[10px] tracking-[0.2em] uppercase font-bold text-black group-hover:text-[#5c3616] transition-colors duration-500 flex items-center gap-1 py-4"
              >
                {item.name}
                {item.sub && (
                  <svg className="w-2 h-2 opacity-50 group-hover:rotate-180 transition-transform duration-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M19 9l-7 7-7-7" />
                  </svg>
                )}
              </Link>

              {item.sub && (
                <div className="absolute top-[80%] left-0 pt-4 w-56 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-500 translate-y-2 group-hover:translate-y-0 z-[999]">
                  <div className="bg-white border border-gray-200 p-2 flex flex-col gap-1 shadow-2xl">
                    {item.sub.map((subItem, j) => (
                      <Link 
                        key={j} 
                        href={`#${subItem.toLowerCase().replace(/ & /g, '-').replace(/ /g, '-')}`} 
                        className="px-4 py-3 text-[9px] tracking-[0.15em] text-black font-medium hover:text-black hover:bg-[#d4af37] transition-all duration-300 uppercase block"
                      >
                        {subItem}
                      </Link>
                    ))}
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>

        <Link href="/admin/login" className="nav-anim text-[10px] md:text-xs tracking-[0.2em] uppercase font-bold text-black hover:text-[#5c3616] transition-colors pointer-events-auto">
          Partner Login
        </Link>
        
      </nav>

      {/* HERO SECTION KOSONG */}
      <section className="relative h-screen flex flex-col items-center justify-center z-10 pointer-events-none"></section>

      {/* KONTEN BAWAH */}
      <div className="relative z-10 bg-[#0a0a0a]">
        
        <section className="about-section py-32 px-8 max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-16">
          {[
            { title: "Heritage", desc: "Sourcing strictly from the world's most esteemed cigar makers. We guarantee perfect provenance and condition from origin to delivery." },
            { title: "B2B Only", desc: "Dedicated 100% to retail and hospitality partners. We offer tier-based pricing, high-volume stock, and dedicated account management." },
            { title: "Logistics", desc: "State-of-the-art climate-controlled storage and shipping facilities ensure your inventory arrives in impeccable smoking condition." }
          ].map((item, i) => (
            <div key={i} className="about-item border-t border-[#1f1f1f] pt-8">
              <h3 className="text-[#d4af37] tracking-[0.2em] uppercase text-[10px] mb-6">{item.title}</h3>
              <p className="text-[#8c8c8c] text-xs leading-relaxed font-light">{item.desc}</p>
            </div>
          ))}
        </section>

        <section className="category-section py-32 px-8 max-w-7xl mx-auto border-t border-[#1f1f1f]">
          <div className="mb-20 flex flex-col md:flex-row justify-between items-start md:items-end gap-6">
            <h2 className="text-4xl md:text-5xl uppercase tracking-tighter font-medium">Curated<br/><span className="text-[#d4af37] italic font-serif lowercase">Collection</span></h2>
            <Link href="/admin/login" className="text-[#8c8c8c] text-[10px] uppercase tracking-[0.2em] hover:text-white transition-colors duration-500">
              Explore All Catalog
            </Link>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              { title: "Cigars", img: "/uploads/1790012363796-Double_Corona-c.jpg" }, 
              { title: "Humidors", img: "/uploads/1790012363796-Double_Corona-c.jpg" },
              { title: "Accessories", img: "/uploads/1790012363796-Double_Corona-c.jpg" }
            ].map((cat, i) => (
              <div key={i} className="category-card group cursor-pointer relative h-[500px] bg-[#0f0f0f] overflow-hidden">
                <img 
                  src={cat.img} 
                  alt={cat.title} 
                  className="w-full h-full object-cover opacity-40 group-hover:scale-105 group-hover:opacity-70 transition-all duration-1000 ease-[cubic-bezier(0.25,1,0.5,1)]"
                />
                <h3 className="absolute bottom-8 left-8 text-sm uppercase tracking-[0.2em] text-[#e5e5e5]">
                  {cat.title}
                </h3>
              </div>
            ))}
          </div>
        </section>

        <section className="parallax-section relative h-[70vh] overflow-hidden bg-[#000] flex items-center justify-center">
          <img 
            src="/uploads/1790012363796-Double_Corona-c.jpg" 
            alt="Atmosphere" 
            className="parallax-img absolute top-[-30%] w-full h-[160%] object-cover opacity-20 mix-blend-screen"
          />
          <div className="relative z-10 text-center">
            <h2 className="text-4xl md:text-6xl font-medium uppercase tracking-widest leading-tight">
              Uncompromising
            </h2>
            <p className="text-[#d4af37] italic font-serif text-5xl md:text-7xl lowercase mt-2">quality</p>
          </div>
        </section>

        <section className="cta-section py-40 px-8 flex justify-center text-center">
          <div className="cta-box max-w-3xl w-full">
            <h2 className="text-3xl md:text-4xl uppercase tracking-tighter mb-8 font-medium">Elevate Your Business</h2>
            <p className="text-[#8c8c8c] max-w-md mx-auto mb-12 text-xs md:text-sm leading-relaxed font-light">
              Join our network of elite retailers. Access live inventory, tier-based pricing, and seamless wholesale ordering.
            </p>
            <div className="flex flex-col md:flex-row gap-6 justify-center">
              <Link href="/admin/login" className="bg-[#d4af37] text-black px-12 py-4 text-[10px] uppercase tracking-[0.2em] font-bold hover:bg-white transition-colors duration-500">
                Partner Login
              </Link>
              <button className="border border-[#262626] text-[#e5e5e5] px-12 py-4 text-[10px] uppercase tracking-[0.2em] font-medium hover:border-white transition-colors duration-500">
                Request Account
              </button>
            </div>
          </div>
        </section>

        <footer className="border-t border-[#1f1f1f] py-12 text-center">
          <p className="text-[10px] text-[#4d4d4d] uppercase tracking-[0.2em]">
            © {new Date().getFullYear()} Latin American Cigars Corp.
          </p>
        </footer>
        
      </div> 
      
    </div>
  );
}

export default function LandingPage() {
  return (
    <AgeVerification>
      <MainContent />
    </AgeVerification>
  );
}