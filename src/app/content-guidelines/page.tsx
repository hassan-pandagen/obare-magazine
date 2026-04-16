import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";

const LAST_UPDATED = "1 July 2025";

const DO_LIST = [
  "Submit original, authentic work that reflects your genuine perspective.",
  "Disclose any conflicts of interest or commercial relationships relevant to your submission.",
  "Obtain and document consent from any identifiable individuals in your photography or video.",
  "Provide accurate captions, credits, and factual information.",
  "Represent yourself and your credentials honestly.",
];

const DONT_LIST = [
  "Submit work that infringes on any third party's intellectual property rights.",
  "Submit AI-generated content without substantial human authorship and clear disclosure.",
  "Include content that is defamatory, hateful, discriminatory, or incites violence.",
  "Plagiarise, misattribute, or misrepresent another creator's work as your own.",
  "Submit work that was previously published elsewhere without disclosure.",
];

export default function ContentGuidelinesPage() {
  return (
    <>
      <Navbar />

      <main className="bg-black text-white">
        {/* ── Header ───────────────────────────────────────────────────── */}
        <section className="px-6 pb-12 pt-40 md:px-14 lg:px-20">
          <span className="mb-4 block font-montserrat text-xs font-bold uppercase tracking-[0.45em] text-red">
            Editorial Standards
          </span>
          <h1 className="font-poppins text-4xl font-black uppercase leading-[0.9] md:text-5xl">
            Content Guidelines
          </h1>
          <p className="mt-4 font-montserrat text-xs text-white/40">Last updated: {LAST_UPDATED}</p>
        </section>

        {/* ── Intro ─────────────────────────────────────────────────────── */}
        <section className="border-t border-white/10 px-6 py-16 md:px-14 lg:px-20">
          <div className="mx-auto max-w-3xl">
            <p className="font-montserrat text-base leading-relaxed text-white/65">
              OBARE Magazine is built on trust — with our contributors, our readers, and the
              communities whose stories we tell. These guidelines exist to protect that trust and
              maintain the editorial integrity of everything we publish.
            </p>
            <p className="mt-4 font-montserrat text-base leading-relaxed text-white/65">
              All contributors — whether photographers, writers, videographers, or brands — are
              expected to abide by these standards as a condition of working with us.
            </p>
          </div>
        </section>

        {/* ── Do / Don't ────────────────────────────────────────────────── */}
        <section className="border-t border-white/10 px-6 py-16 md:px-14 lg:px-20">
          <div className="mx-auto max-w-5xl grid gap-16 md:grid-cols-2">

            <div>
              <span className="mb-6 block font-montserrat text-xs font-bold uppercase tracking-[0.4em] text-red">
                We Expect
              </span>
              <ul className="space-y-4">
                {DO_LIST.map((item, i) => (
                  <li key={i} className="flex items-start gap-4">
                    <span className="mt-1 block h-1.5 w-1.5 shrink-0 rounded-full bg-red" />
                    <span className="font-montserrat text-sm leading-relaxed text-white/70">{item}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <span className="mb-6 block font-montserrat text-xs font-bold uppercase tracking-[0.4em] text-white/30">
                We Won&apos;t Publish
              </span>
              <ul className="space-y-4">
                {DONT_LIST.map((item, i) => (
                  <li key={i} className="flex items-start gap-4">
                    <span className="mt-1 block h-0.5 w-3 shrink-0 bg-white/20" />
                    <span className="font-montserrat text-sm leading-relaxed text-white/50">{item}</span>
                  </li>
                ))}
              </ul>
            </div>

          </div>
        </section>

        {/* ── Editorial Independence ─────────────────────────────────────── */}
        <section className="border-t border-white/10 px-6 py-16 md:px-14 lg:px-20">
          <div className="mx-auto max-w-3xl space-y-10 font-montserrat text-sm leading-relaxed text-white/70">

            <div>
              <h2 className="mb-3 font-poppins text-xl font-black uppercase text-white">Editorial Independence</h2>
              <p>Advertising, sponsorships, and commercial partnerships do not influence our editorial decisions. Sponsored content is always clearly labelled. Our editorial team has final say on all published content.</p>
            </div>

            <div>
              <h2 className="mb-3 font-poppins text-xl font-black uppercase text-white">Accuracy & Fact-Checking</h2>
              <p>We verify factual claims before publication. Contributors are responsible for the accuracy of their submissions. If errors are discovered post-publication, we will issue corrections promptly and transparently.</p>
            </div>

            <div>
              <h2 className="mb-3 font-poppins text-xl font-black uppercase text-white">Representation & Sensitivity</h2>
              <p>We are committed to telling stories about marginalised communities with the care and nuance they deserve. We work with members of those communities wherever possible. We do not publish content that stereotypes, demeans, or dehumanises any group.</p>
            </div>

            <div>
              <h2 className="mb-3 font-poppins text-xl font-black uppercase text-white">Violations</h2>
              <p>Content that violates these guidelines will be removed. Repeat or serious violations may result in a permanent ban from contributing to OBARE. We reserve the right to make this determination at our sole discretion.</p>
            </div>

            <div>
              <h2 className="mb-3 font-poppins text-xl font-black uppercase text-white">Questions</h2>
              <p>Questions about these guidelines? Email{" "}
                <a href="mailto:editorial@ObareMag.com" className="text-white underline hover:text-red">
                  editorial@ObareMag.com
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