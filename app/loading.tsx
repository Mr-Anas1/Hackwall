export default function Loading() {
  return (
    <div className="flex flex-col flex-1 items-center justify-center min-h-screen pb-24 bg-cyber-black selection:bg-neon-green/30 absolute inset-0 z-50">
        <div className="flex flex-col items-center animate-in fade-in duration-500">
            <div className="w-12 h-12 border-4 border-neon-green/10 border-t-neon-green rounded-full animate-spin shadow-neon"></div>
            <p className="text-neon-green/70 font-mono text-sm mt-6 animate-pulse tracking-widest">
                {'>'} SYSTEM_LOADING_
            </p>
        </div>
    </div>
  );
}
