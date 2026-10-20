"use client";
import { useState, useRef, useEffect } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { useTexture } from '@react-three/drei';
import gsap from 'gsap';

function AnimatedHoverButton({ text, onClick, defaultBg, hoverBg, textColor, hoverTextColor, border }: any) {
  const chars = text.split('');

  return (
    <button
      onClick={onClick}
      className={`group relative overflow-hidden ${border} ${defaultBg} ${textColor} px-12 py-3 text-sm tracking-widest uppercase cursor-pointer pointer-events-auto`}
    >
      <div className={`absolute inset-0 ${hoverBg} -translate-y-full group-hover:translate-y-0 transition-transform duration-500 ease-[cubic-bezier(0.65,0,0.35,1)]`} />
      <div className="relative flex justify-center items-center overflow-hidden">
        <div className="flex">
          {chars.map((c, i) => (
            <span key={i} className="inline-block transition-transform duration-500 ease-[cubic-bezier(0.65,0,0.35,1)] group-hover:translate-y-[150%]" style={{ transitionDelay: `${i * 0.02}s` }}>
              {c === ' ' ? '\u00A0' : c}
            </span>
          ))}
        </div>
        <div className={`absolute inset-0 flex justify-center items-center ${hoverTextColor}`}>
          {chars.map((c, i) => (
            <span key={i} className="inline-block -translate-y-[150%] transition-transform duration-500 ease-[cubic-bezier(0.65,0,0.35,1)] group-hover:translate-y-0" style={{ transitionDelay: `${i * 0.02}s` }}>
              {c === ' ' ? '\u00A0' : c}
            </span>
          ))}
        </div>
      </div>
    </button>
  );
}

function AnimatedCloud({ texture, startZ, initialY, initialX, args, dashRef, idx }: any) {
  const meshRef = useRef<any>(null);
  const matRef = useRef<any>(null);

  const stateRef = useRef({
    x: initialX,
    y: initialY,
    flipX: 1,
    prevZOffset: 0
  });

  useFrame((state, delta) => {
    if (!meshRef.current || !matRef.current) return;
    
    const zDelta = dashRef.current.zOffset - stateRef.current.prevZOffset;
    stateRef.current.prevZOffset = dashRef.current.zOffset;

    meshRef.current.position.z += (0.8 * delta) + zDelta;

    let z = meshRef.current.position.z;

    if (z > 5) {
      z -= 24;
      meshRef.current.position.z = z;
      
      stateRef.current.x = initialX + (Math.random() - 0.5) * 6; 
      stateRef.current.y = initialY + (Math.random() - 0.5) * 2; 
      stateRef.current.flipX = Math.random() > 0.5 ? 1 : -1; 
    }

    let opacity = 1;
    if (z < -15) opacity = 1 - (-15 - z) / 4; 
    else if (z > 2) opacity = 1 - (z - 2) / 3; 

    matRef.current.opacity = Math.max(0, Math.min(1, opacity));

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

function MultiLayerClouds({ dashRef }: { dashRef: any }) {
  const [bg, tint, l0, l1, l2, l3, l4, intro] = useTexture([
    '/HDR_AboveTheClouds.test.jpg', 
    '/Cloud-tint-8.png', 
    '/layer0.png', 
    '/layer1.png', 
    '/layer2.png', 
    '/layer3.png', 
    '/layer4.png', 
    '/intro-cloud.png'
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
    { map: l0, z: -19, y: -14, x: 0 },
    { map: l1, z: -15, y: -15, x: -3 },
    { map: l2, z: -11, y: -14, x: 3 },
    { map: l3, z: -7,  y: -15, x: -2 },
    { map: l4, z: -3,  y: -14, x: 2 },
    { map: intro, z: 1,y: -15, x: 0 },
  ];

  return (
    <group>
      <mesh position={[0, 0, -20]}>
        <planeGeometry args={[120, 60]} />
        <meshBasicMaterial map={bg} depthWrite={false} />
      </mesh>
      
      <mesh ref={tintRef} position={[0, -10, -40]}>
        <planeGeometry args={[200, 50]} />
        <meshBasicMaterial map={tint} transparent depthWrite={false} />
      </mesh>
      
      {clouds.map((cloud, idx) => (
        <AnimatedCloud 
          key={idx}
          idx={idx}
          texture={cloud.map} 
          startZ={cloud.z} 
          initialY={cloud.y}
          initialX={cloud.x}
          args={cloudArgs} 
          dashRef={dashRef}
        />
      ))}
    </group>
  );
}

export default function AgeVerification({ children }: { children: React.ReactNode }) {
  const [isEntered, setIsEntered] = useState(false);
  const [isEntering, setIsEntering] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [progress, setProgress] = useState(0);

  const uiTextRef = useRef<HTMLDivElement>(null);
  const logoRef = useRef<HTMLImageElement>(null);
  const topMaskRef = useRef<HTMLDivElement>(null);
  const bottomMaskRef = useRef<HTMLDivElement>(null);
  const loadingTextRef = useRef<HTMLDivElement>(null);
  const dashRef = useRef({ zOffset: 0 });

  useEffect(() => {
    const obj = { p: 0 };
    gsap.to(obj, {
      p: 100,
      duration: 2.5,
      ease: "power2.inOut",
      onUpdate: () => setProgress(Math.round(obj.p)),
      onComplete: () => {
        const tl = gsap.timeline();
        tl.to(loadingTextRef.current, { opacity: 0, duration: 0.3 })
          .to([topMaskRef.current, bottomMaskRef.current], {
            yPercent: (i) => (i === 0 ? -100 : 100),
            duration: 1.5,
            ease: "power3.inOut",
            onComplete: () => setIsLoading(false)
          }, "+=0.2");
      }
    });
  }, []);

  const handleEnter = () => {
    setIsEntering(true);

    gsap.to(uiTextRef.current, { opacity: 0, duration: 0.75, ease: "power1.in" });
    gsap.to(logoRef.current, { scale: 2.5, opacity: 0, duration: 1.5, ease: "power1.in" });
    gsap.to(dashRef.current, {
      zOffset: 100, 
      duration: 8,
      ease: "power2.inOut",
      onComplete: () => setIsEntered(true)
    });
  };

  if (isEntered) return <>{children}</>;

  return (
    <div className="fixed inset-0 z-[9999] bg-black flex flex-col items-center justify-center overflow-hidden">
      
      {isLoading && (
        <div ref={loadingTextRef} className="absolute inset-0 flex items-center justify-center z-[10002] pointer-events-none">
          <div className="font-serif text-sm tracking-[0.2em] text-[#d4af37] uppercase">{progress}%</div>
        </div>
      )}
      
      <div ref={topMaskRef} className="absolute top-0 left-0 w-full h-1/2 bg-white z-[10001]" />
      <div ref={bottomMaskRef} className="absolute bottom-0 left-0 w-full h-1/2 bg-white z-[10001]" />

      <div className="absolute inset-0 pointer-events-none z-[10000]">
        <Canvas camera={{ position: [0, 0, 5] }}>
          <MultiLayerClouds dashRef={dashRef} />
        </Canvas>
      </div>
      
      <div className={`relative z-[10000] flex flex-col items-center transition-opacity duration-1000 ${isEntering ? 'pointer-events-none' : ''}`}>
        <img 
          ref={logoRef}
          src="/lacigars-logo.png" 
          alt="Latin American Cigars Logo" 
          className="w-64 mb-8 transform-gpu" 
        />
        
        <div ref={uiTextRef} className="flex flex-col items-center">
          <h1 className="text-3xl font-bold text-[#5c3616] mb-4 tracking-widest uppercase text-center">
            WELCOME!
          </h1>
          <p className="text-[#5c3616] text-sm max-w-md text-center mb-10 leading-relaxed px-4">
            This website requires you to be 21 years of age or older. Please verify your age to view content, or click "No" otherwise.
          </p>
          
          <div className="flex gap-6">
            <AnimatedHoverButton 
              text="Yes, I am 21" 
              defaultBg="bg-[#5c3616]" 
              hoverBg="bg-[#d4af37]"
              textColor="text-white"
              hoverTextColor="text-[#5c3616]"
              border="border border-[#5c3616]"
              onClick={handleEnter} 
            />
            <AnimatedHoverButton 
              text="No" 
              defaultBg="bg-transparent"
              hoverBg="bg-[#5c3616]"
              textColor="text-[#5c3616]"
              hoverTextColor="text-white"
              border="border border-[#5c3616]"
              onClick={() => window.location.href = 'https://google.com'} 
            />
          </div>
        </div>
      </div>
      
    </div>
  );
}