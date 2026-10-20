import Link from 'next/link';
import AgeVerification from '../components/AgeVerification'; // Sesuaikan path jika berbeda

export default function LandingPage() {
  return (
    <AgeVerification>
      <div className="min-h-screen bg-gray-50 flex flex-col relative font-sans">
        
        {/* Header / Navbar */}
        <header className="absolute top-0 left-0 w-full p-6 flex justify-between items-center z-10">
          <div className="w-24">
            {/* Opsional: Logo kecil di kiri */}
          </div>
          <Link 
            href="/portal"
            className="bg-[#5c3616] text-white px-8 py-2.5 rounded-sm uppercase tracking-widest text-xs font-bold hover:bg-[#d4af37] hover:text-[#5c3616] transition-colors shadow-md"
          >
            Login
          </Link>
        </header>

        {/* Hero Section */}
        <main className="flex-1 flex flex-col items-center justify-center text-center px-4">
          <img 
            src="/lacigars-logo.png" 
            alt="Latin American Cigars" 
            className="w-64 mb-8"
          />
          <h1 className="text-4xl md:text-5xl font-bold text-[#5c3616] mb-4 tracking-widest uppercase">
            Premium Cigars
          </h1>
          <p className="text-gray-600 max-w-xl mx-auto text-sm md:text-base leading-relaxed mb-10">
            Welcome to the exclusive B2B wholesale portal for Latin American Cigars Corp. Partner with us for premium quality and unparalleled service.
          </p>
          <Link 
            href="/portal"
            className="border-2 border-[#5c3616] text-[#5c3616] px-10 py-3 uppercase tracking-widest text-sm font-semibold hover:bg-[#5c3616] hover:text-white transition-all"
          >
            Enter B2B Portal
          </Link>
        </main>

      </div>
    </AgeVerification>
  );
}