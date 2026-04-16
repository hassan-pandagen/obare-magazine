import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";

const LAST_UPDATED = "1 July 2025";

export default function PrivacyPage() {
  return (
    <>
      <Navbar />

      <main className="bg-black text-white">
        {/* ── Header ───────────────────────────────────────────────────── */}
        <section className="px-6 pb-12 pt-40 md:px-14 lg:px-20">
          <span className="mb-4 block font-montserrat text-xs font-bold uppercase tracking-[0.45em] text-red">
            Legal
          </span>
          <h1 className="font-poppins text-4xl font-black uppercase leading-[0.9] md:text-5xl">
            Privacy Policy
          </h1>
          <p className="mt-4 font-montserrat text-xs text-white/40">Last updated: {LAST_UPDATED}</p>
        </section>

        {/* ── Body ─────────────────────────────────────────────────────── */}
        <section className="border-t border-white/10 px-6 py-16 md:px-14 lg:px-20">
          <div className="mx-auto max-w-3xl space-y-10 font-montserrat text-sm leading-relaxed text-white/70">

            <div>
              <h2 className="mb-3 font-poppins text-xl font-black uppercase text-white">1. Who We Are</h2>
              <p>OBARE Magazine ("we", "our", "us") is an independent digital publication. Our website is located at obaremag.com. This policy explains what personal data we collect and how we use it.</p>
            </div>

            <div>
              <h2 className="mb-3 font-poppins text-xl font-black uppercase text-white">2. Data We Collect</h2>
              <p>We may collect the following data when you interact with us:</p>
              <ul className="mt-3 list-disc space-y-2 pl-5">
                <li><strong className="text-white">Contact forms</strong> — name, email address, message content.</li>
                <li><strong className="text-white">Newsletter sign-ups</strong> — email address.</li>
                <li><strong className="text-white">Event RSVPs</strong> — name, email address, number of guests.</li>
                <li><strong className="text-white">Submissions</strong> — name, email, social handle, portfolio materials.</li>
                <li><strong className="text-white">Usage data</strong> — anonymised analytics (pages visited, time on site) via a privacy-respecting analytics tool.</li>
              </ul>
            </div>

            <div>
              <h2 className="mb-3 font-poppins text-xl font-black uppercase text-white">3. How We Use Your Data</h2>
              <ul className="list-disc space-y-2 pl-5">
                <li>To respond to your enquiries and submissions.</li>
                <li>To send the newsletter if you have subscribed (you can unsubscribe at any time).</li>
                <li>To manage event RSVPs.</li>
                <li>To improve the Site based on anonymised usage patterns.</li>
              </ul>
              <p className="mt-3">We do not sell your personal data. We do not use it for advertising profiling.</p>
            </div>

            <div>
              <h2 className="mb-3 font-poppins text-xl font-black uppercase text-white">4. Data Storage & Security</h2>
              <p>Data submitted via our forms is stored securely via Sanity.io, our content management platform. We use industry-standard security measures. No method of internet transmission is 100% secure; we do our best to protect your data but cannot guarantee absolute security.</p>
            </div>

            <div>
              <h2 className="mb-3 font-poppins text-xl font-black uppercase text-white">5. Your Rights</h2>
              <p>You have the right to request access to, correction of, or deletion of your personal data held by us. To exercise these rights, contact us at{" "}
                <a href="mailto:info@ObareMag.com" className="text-white underline hover:text-red">
                  info@ObareMag.com
                </a>.
              </p>
            </div>

            <div>
              <h2 className="mb-3 font-poppins text-xl font-black uppercase text-white">6. Cookies</h2>
              <p>We use minimal cookies — strictly necessary ones for the Site to function, and optional analytics cookies. We do not use advertising cookies or third-party tracking pixels.</p>
            </div>

            <div>
              <h2 className="mb-3 font-poppins text-xl font-black uppercase text-white">7. Third Parties</h2>
              <p>We use the following third-party services which may process your data in accordance with their own privacy policies:</p>
              <ul className="mt-3 list-disc space-y-1 pl-5">
                <li>Sanity.io (data storage)</li>
                <li>Vercel (hosting)</li>
                <li>Email delivery provider (newsletter)</li>
              </ul>
            </div>

            <div>
              <h2 className="mb-3 font-poppins text-xl font-black uppercase text-white">8. Changes to This Policy</h2>
              <p>We may update this Privacy Policy from time to time. We&apos;ll update the "Last updated" date above when we do.</p>
            </div>

            <div>
              <h2 className="mb-3 font-poppins text-xl font-black uppercase text-white">9. Contact</h2>
              <p>Privacy questions? Email{" "}
                <a href="mailto:info@ObareMag.com" className="text-white underline hover:text-red">
                  info@ObareMag.com
                </a>.
              </p>
            </div>

          </div>
        </section>
      </main>

      <Footer />
    </>
  );
}