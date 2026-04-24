"use client";

const CATEGORIES = [
  "No Cover-Up",
  "Unfiltered",
  "Bare",
  "Natural",
  "Authentic",
];

export default function Marquee() {
  const items = [...CATEGORIES, ...CATEGORIES, ...CATEGORIES];

  return (
    <section className="w-full overflow-hidden bg-black py-8 md:py-12">
      <div className="obare-marquee flex whitespace-nowrap">
        {items.map((cat, i) => (
          <span key={i} className="flex items-center">
            <span className="font-poppins text-[8vw] font-black uppercase text-white/80 md:text-[5vw]">
              {cat}
            </span>
            <span className="mx-4 font-poppins text-[8vw] font-black text-red md:mx-6 md:text-[5vw]">
              &bull;
            </span>
          </span>
        ))}
      </div>
    </section>
  );
}
