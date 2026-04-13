"use client";

import { useRef } from "react";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";

const STRIP_STORIES = [
  { id: 1, number: "01", title: "The Art of Being", author: "Amara Keita", image: "/images/strip-1.jpg" },
  { id: 2, number: "02", title: "Colorful Darkness", author: "Obi Nwachukwu", image: "/images/strip-2.jpg" },
  { id: 3, number: "03", title: "Moving Forward", author: "Zara Osei", image: "/images/strip-3.jpg" },
  { id: 4, number: "04", title: "Style & Substance", author: "Kofi Mensah", image: "/images/strip-4.jpg" },
  { id: 5, number: "05", title: "Beyond Borders", author: "Nia Asante", image: "/images/strip-5.jpg" },
  { id: 6, number: "06", title: "Raw Expression", author: "Tobi Adeyemi", image: "/images/strip-6.jpg" },
  { id: 7, number: "07", title: "New Perspectives", author: "Fatou Diallo", image: "/images/strip-7.jpg" },
  { id: 8, number: "08", title: "Urban Canvas", author: "Kwame Boateng", image: "/images/strip-8.jpg" },
];

export default function StoriesStrip() {
  const stripRef = useRef<HTMLDivElement>(null);

  useGSAP(() => {
    const strip = stripRef.current;
    if (!strip) return;

    // Get total scrollable width
    const scrollWidth = strip.scrollWidth;
    const viewportWidth = strip.offsetWidth;

    gsap.to(strip, {
      x: -(scrollWidth - viewportWidth),
      ease: "none",
      scrollTrigger: {
        trigger: strip.parentElement,
        start: "top top",
        end: () => `+=${scrollWidth - viewportWidth}`,
        scrub: 1,
        pin: true,
        anticipatePin: 1,
      },
    });
  });

  return (
    <section className="overflow-hidden">
      <div className="mb-8 px-6 md:px-10 lg:px-16">
        <h2 className="font-poppins text-3xl font-bold text-white md:text-5xl">
          Featured
        </h2>
      </div>

      <div
        ref={stripRef}
        className="flex gap-6 px-6 md:px-10 lg:px-16"
      >
        {STRIP_STORIES.map((story) => (
          <a
            key={story.id}
            href="#"
            className="group relative block aspect-[3/4] w-[280px] flex-shrink-0 overflow-hidden rounded-sm md:w-[320px]"
          >
            {/* Background */}
            <div
              className="absolute inset-0 bg-zinc-800 bg-cover bg-center transition-transform duration-500 group-hover:scale-105"
              style={{ backgroundImage: `url(${story.image})` }}
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />

            {/* Content */}
            <div className="relative z-10 flex h-full flex-col justify-between p-5">
              <span className="font-montserrat text-[11px] font-bold tracking-widest text-white/50">
                {story.number}
              </span>
              <div>
                <h3 className="mb-1 font-poppins text-xl font-bold text-white">
                  {story.title}
                </h3>
                <p className="font-montserrat text-xs tracking-wide text-white/60">
                  by {story.author}
                </p>
              </div>
            </div>
          </a>
        ))}
      </div>
    </section>
  );
}
