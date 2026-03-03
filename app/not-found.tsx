import Link from 'next/link';

export default function NotFound() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4 text-center">
      <h1 className="text-9xl font-cyber text-neon-green mb-4 animate-pulse">404</h1>
      <h2 className="text-2xl font-mono text-white mb-8">
        {'>'} ERROR: PAGE_NOT_FOUND_
      </h2>
      <p className="text-gray-400 font-mono mb-8 max-w-md">
        The requested sector does not exist or has been corrupted.
        Return to base immediately.
      </p>
      
      <Link 
        href="/"
        className="px-8 py-3 bg-neon-green text-black font-mono font-bold rounded hover:shadow-neon hover:scale-105 transition-all"
      >
        RETURN_HOME
      </Link>

      <div className="absolute inset-0 -z-10 bg-[url('/grid.svg')] opacity-10 pointer-events-none"></div>
    </div>
  );
}
