import Header from '@/components/Header';

export default function PrivacyPage() {
  return (
    <main className="min-h-screen pb-24 bg-cyber-black text-white selection:bg-neon-green/30">
      <Header />
      <div className="max-w-2xl mx-auto p-4 animate-in fade-in slide-in-from-bottom-4 duration-500 font-mono text-gray-300">
        <h1 className="text-2xl font-cyber text-neon-green mb-2 tracking-wider">PRIVACY_POLICY</h1>
        <p className="text-xs text-gray-500 mb-8">Effective Date: April 19, 2026</p>
        
        <div className="space-y-6 text-sm leading-relaxed">
          <p>
            HackWall (“we”, “our”, or “us”) respects your privacy. This Privacy Policy explains how we collect, use, and protect your information when you use our mobile application.
          </p>

          <section>
            <h2 className="text-lg text-neon-green mb-2">1. Information We Collect</h2>
            <p className="mb-2">We may collect limited information, including:</p>
            <ul className="list-disc pl-5 space-y-1 text-gray-400">
              <li>Device information (device type, OS version)</li>
              <li>App usage data (pages visited, interactions)</li>
              <li>IP address (for analytics and security)</li>
            </ul>
            <p className="mt-2">
              We do NOT collect personally identifiable information such as your name, phone number, or address unless explicitly provided by you.
            </p>
          </section>

          <hr className="border-neon-green/10" />

          <section>
            <h2 className="text-lg text-neon-green mb-2">2. How We Use Information</h2>
            <p className="mb-2">We use collected data to:</p>
            <ul className="list-disc pl-5 space-y-1 text-gray-400">
              <li>Improve app performance and user experience</li>
              <li>Analyze usage patterns</li>
              <li>Serve relevant advertisements</li>
            </ul>
          </section>

          <hr className="border-neon-green/10" />

          <section>
            <h2 className="text-lg text-neon-green mb-2">3. Third-Party Services</h2>
            <p className="mb-2">We may use third-party services that may collect information:</p>
            <ul className="list-disc pl-5 space-y-1 text-gray-400">
              <li>Google AdMob (for advertisements)</li>
              <li>Analytics services (for app usage tracking)</li>
              <li>Cloud storage providers (for delivering wallpapers)</li>
            </ul>
            <p className="mt-2 text-xs text-gray-500">
              These services have their own privacy policies.
            </p>
          </section>

          <hr className="border-neon-green/10" />

          <section>
            <h2 className="text-lg text-neon-green mb-2">4. Cookies & Tracking</h2>
            <p>We may use cookies or similar technologies to enhance user experience and analyze app usage.</p>
          </section>

          <hr className="border-neon-green/10" />

          <section>
            <h2 className="text-lg text-neon-green mb-2">5. Data Security</h2>
            <p>We implement reasonable security measures to protect your data. However, no method of transmission over the internet is 100% secure.</p>
          </section>

          <hr className="border-neon-green/10" />

          <section>
            <h2 className="text-lg text-neon-green mb-2">6. Children’s Privacy</h2>
            <p>Our app is not intended for children under 13. We do not knowingly collect data from children.</p>
          </section>

          <hr className="border-neon-green/10" />

          <section>
            <h2 className="text-lg text-neon-green mb-2">7. Changes to This Policy</h2>
            <p>We may update this Privacy Policy from time to time. Changes will be reflected with an updated date.</p>
          </section>

          <hr className="border-neon-green/10" />

          <section>
            <h2 className="text-lg text-neon-green mb-2">8. Contact Us</h2>
            <p>If you have any questions, contact us at:</p>
            <p className="mt-2 text-neon-green"><a href="mailto:support@tensolab.tech">support@tensolab.tech</a></p>
          </section>
        </div>
      </div>
    </main>
  );
}
