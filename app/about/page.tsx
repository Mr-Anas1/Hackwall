import Header from '@/components/Header';
import Link from 'next/link';

export default function AboutPage() {
  return (
    <main className="min-h-screen pb-24 bg-cyber-black text-white selection:bg-neon-green/30">
      <Header />
      <div className="max-w-2xl mx-auto p-4 animate-in fade-in slide-in-from-bottom-4 duration-500">
        
        <div className="flex flex-col items-center justify-center py-20 text-center">
          {/* App Icon */}
          <div className="w-24 h-24 rounded-2xl bg-gradient-to-br from-neon-green/20 to-black border border-neon-green/30 flex items-center justify-center mb-6 shadow-neon-strong p-3">
            <img 
               src="/icon.svg" 
               alt="HackWall Icon" 
               className="w-16 h-16 drop-shadow-lg rounded-xl"
            />
          </div>
          
          <h1 className="text-4xl font-cyber text-neon-green tracking-widest mb-2">
            HACKWALL
          </h1>
          
          <p className="font-mono text-gray-400 text-sm mb-6">
            Version 1.2.0
          </p>

          <div className="inline-block bg-cyber-gray/50 border border-neon-green/20 rounded-xl p-4 px-8 mb-12">
            <p className="font-mono text-xs text-gray-500 uppercase tracking-widest mb-1">Developed By</p>
            <p className="font-cyber text-xl text-white tracking-widest">TENSOLAB</p>
          </div>

          <div className="flex gap-4 mb-12">
            <Link href="/privacy" className="text-neon-green/70 hover:text-neon-green font-mono text-xs underline underline-offset-4">
              Privacy Policy
            </Link>
            <span className="text-neon-green/30">|</span>
            <Link href="/terms" className="text-neon-green/70 hover:text-neon-green font-mono text-xs underline underline-offset-4">
              Terms & Conditions
            </Link>
          </div>

          <div className="text-xs font-mono text-gray-500 mt-8">
            <p className="uppercase tracking-widest mb-1">© 2026 Tensolab.</p>
            <p className="uppercase tracking-widest">All Rights Reserved.</p>
          </div>
        </div>

      </div>
    </main>
  );
}
