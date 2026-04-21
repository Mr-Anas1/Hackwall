import Header from '@/components/Header';

export default function TermsPage() {
  return (
    <main className="min-h-screen pb-24 bg-cyber-black text-white selection:bg-neon-green/30">
      <Header />
      <div className="max-w-2xl mx-auto p-4 animate-in fade-in slide-in-from-bottom-4 duration-500 font-mono text-gray-300">
        <h1 className="text-2xl font-cyber text-neon-green mb-2 tracking-wider">TERMS & CONDITIONS</h1>
        <p className="text-xs text-gray-500 mb-8">Effective Date: April 19, 2026</p>
        
        <div className="space-y-6 text-sm leading-relaxed">
          <p>By using HackWall, you agree to the following terms:</p>

          <section>
            <h2 className="text-lg text-neon-green mb-2">1. Use of the App</h2>
            <p>
              You agree to use the app only for lawful purposes. You must not misuse the app or attempt to disrupt its functionality.
            </p>
          </section>

          <hr className="border-neon-green/10" />

          <section>
            <h2 className="text-lg text-neon-green mb-2">2. Content Usage</h2>
            <p className="mb-2">All wallpapers provided in the app are for personal use only.</p>
            <p className="text-neon-green">You may:</p>
            <ul className="list-disc pl-5 space-y-1 mb-2 text-gray-400">
              <li>Download wallpapers for personal use</li>
            </ul>
            <p className="text-red-400">You may NOT:</p>
            <ul className="list-disc pl-5 space-y-1 text-gray-400">
              <li>Sell or redistribute wallpapers</li>
              <li>Use wallpapers for commercial purposes without permission</li>
            </ul>
          </section>

          <hr className="border-neon-green/10" />

          <section>
            <h2 className="text-lg text-neon-green mb-2">3. Intellectual Property</h2>
            <p>
              All content, design, and branding of the app belong to HackWall unless otherwise stated.
            </p>
          </section>

          <hr className="border-neon-green/10" />

          <section>
            <h2 className="text-lg text-neon-green mb-2">4. Third-Party Services</h2>
            <p>
              The app may display ads and use third-party services. We are not responsible for the content or practices of those services.
            </p>
          </section>

          <hr className="border-neon-green/10" />

          <section>
            <h2 className="text-lg text-neon-green mb-2">5. Disclaimer</h2>
            <p>
              The app is provided “as is” without warranties of any kind. We are not responsible for any damages or issues arising from the use of the app.
            </p>
          </section>

          <hr className="border-neon-green/10" />

          <section>
            <h2 className="text-lg text-neon-green mb-2">6. Limitation of Liability</h2>
            <p>
              We shall not be liable for any indirect, incidental, or consequential damages resulting from the use of the app.
            </p>
          </section>

          <hr className="border-neon-green/10" />

          <section>
            <h2 className="text-lg text-neon-green mb-2">7. Changes to Terms</h2>
            <p>
              We may update these terms at any time. Continued use of the app means you accept the updated terms.
            </p>
          </section>

          <hr className="border-neon-green/10" />

          <section>
            <h2 className="text-lg text-neon-green mb-2">8. Contact</h2>
            <p>For any questions regarding these terms:</p>
            <p className="mt-2 text-neon-green"><a href="mailto:support@tensolab.tech">support@tensolab.tech</a></p>
          </section>
        </div>
      </div>
    </main>
  );
}
