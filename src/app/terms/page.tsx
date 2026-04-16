import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";

const LAST_UPDATED = "1 July 2025";

export default function TermsPage() {
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
            Terms of Service
          </h1>
          <p className="mt-4 font-montserrat text-xs text-white/40">Last updated: {LAST_UPDATED}</p>
        </section>

        {/* ── Body ─────────────────────────────────────────────────────── */}
        <section className="border-t border-white/10 px-6 py-16 md:px-14 lg:px-20">
          <div className="mx-auto max-w-3xl space-y-12 font-montserrat text-sm leading-relaxed text-white/70">

            <div>
              <h2 className="mb-4 font-poppins text-xl font-black uppercase text-white">
                1. Introduction &amp; Acceptance of Terms
              </h2>
              <p>
                By accessing or using Obare and related services (the &ldquo;Services&rdquo;), you agree to
                these Terms and our Privacy Policy, which is incorporated herein by reference. If you
                do not agree, please do not use our Services.
              </p>
            </div>

            <div>
              <h2 className="mb-4 font-poppins text-xl font-black uppercase text-white">
                2. Privacy Notice &amp; Data Practices
              </h2>
              <p className="mb-4">
                When you use our Services, we may collect and process the following categories of
                personal information:
              </p>
              <ul className="space-y-3">
                <li className="flex items-start gap-3">
                  <span className="mt-1.5 block h-1.5 w-1.5 shrink-0 rounded-full bg-red" />
                  <span>
                    <strong className="text-white">Profile Information:</strong>{" "}
                    Name, email address, bio, and profile photo.
                  </span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="mt-1.5 block h-1.5 w-1.5 shrink-0 rounded-full bg-red" />
                  <span>
                    <strong className="text-white">User-Generated Content:</strong>{" "}
                    Photos, videos, text, comments, and other uploads.
                  </span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="mt-1.5 block h-1.5 w-1.5 shrink-0 rounded-full bg-red" />
                  <span>
                    <strong className="text-white">Payment Information:</strong>{" "}
                    Name, billing address, and credit card details.
                  </span>
                </li>
              </ul>
            </div>

            <div>
              <h2 className="mb-4 font-poppins text-xl font-black uppercase text-white">
                3. Content Disclaimer
              </h2>
              <p>
                Some content on Obare may include artistic nudity intended to celebrate
                self-expression, diversity, and natural beauty. Such content is presented for
                editorial, cultural, or body-positive purposes only and is never sexually explicit
                or pornographic in nature.
              </p>
            </div>

            <div>
              <h2 className="mb-4 font-poppins text-xl font-black uppercase text-white">
                4. Adult Content &amp; Age Verification
              </h2>
              <p>
                <strong className="text-white">Age Representation:</strong> You represent that you
                are at least 18 years old (or the age of majority in your jurisdiction) to view any
                nudity on Obare.
              </p>
            </div>

            <div>
              <h2 className="mb-4 font-poppins text-xl font-black uppercase text-white">
                5. Use of the Services
              </h2>
              <p>You may use the Services for lawful, personal, non-commercial purposes only. You must not:</p>
              <ul className="mt-4 space-y-3">
                <li className="flex items-start gap-3">
                  <span className="mt-1.5 block h-1.5 w-1.5 shrink-0 rounded-full bg-red" />
                  <span>Reproduce, distribute, or republish any content without prior written permission from OBARE Magazine.</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="mt-1.5 block h-1.5 w-1.5 shrink-0 rounded-full bg-red" />
                  <span>Use automated means to scrape, crawl, or index the Services.</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="mt-1.5 block h-1.5 w-1.5 shrink-0 rounded-full bg-red" />
                  <span>Attempt to interfere with or disrupt the infrastructure supporting the Services.</span>
                </li>
              </ul>
            </div>

            <div>
              <h2 className="mb-4 font-poppins text-xl font-black uppercase text-white">
                6. Intellectual Property
              </h2>
              <p>
                All editorial content, photography, video, branding, and design elements on the
                Services are the property of OBARE Magazine or its contributors and are protected
                by copyright law. Nothing herein grants you any licence to use our intellectual
                property without express written consent.
              </p>
            </div>

            <div>
              <h2 className="mb-4 font-poppins text-xl font-black uppercase text-white">
                7. User Submissions
              </h2>
              <p className="mb-4">
                By submitting content (pitches, photographs, articles, or other materials) to OBARE
                Magazine, you represent that:
              </p>
              <ul className="space-y-3">
                <li className="flex items-start gap-3">
                  <span className="mt-1.5 block h-1.5 w-1.5 shrink-0 rounded-full bg-red" />
                  <span>You own or have the right to submit the content.</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="mt-1.5 block h-1.5 w-1.5 shrink-0 rounded-full bg-red" />
                  <span>The content does not infringe the rights of any third party.</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="mt-1.5 block h-1.5 w-1.5 shrink-0 rounded-full bg-red" />
                  <span>
                    You grant OBARE Magazine a non-exclusive, royalty-free licence to publish,
                    adapt, and promote the content across its platforms.
                  </span>
                </li>
              </ul>
            </div>

            <div>
              <h2 className="mb-4 font-poppins text-xl font-black uppercase text-white">
                8. Disclaimer of Warranties
              </h2>
              <p>
                The Services are provided on an &ldquo;as is&rdquo; and &ldquo;as available&rdquo;
                basis. OBARE Magazine makes no warranties, express or implied, regarding the
                accuracy, completeness, or fitness for a particular purpose of any content.
              </p>
            </div>

            <div>
              <h2 className="mb-4 font-poppins text-xl font-black uppercase text-white">
                9. Limitation of Liability
              </h2>
              <p>
                To the fullest extent permitted by law, OBARE Magazine shall not be liable for any
                indirect, incidental, or consequential damages arising from your use of the
                Services.
              </p>
            </div>

            <div>
              <h2 className="mb-4 font-poppins text-xl font-black uppercase text-white">
                10. Changes to These Terms
              </h2>
              <p>
                We may update these Terms at any time. Continued use of the Services after any
                changes constitutes your acceptance of the revised Terms.
              </p>
            </div>

            <div>
              <h2 className="mb-4 font-poppins text-xl font-black uppercase text-white">
                11. Contact
              </h2>
              <p>
                Questions about these Terms? Contact us at{" "}
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