"use client";

import { useRef } from "react";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { Swiper, SwiperSlide } from "swiper/react";
import { Pagination, Navigation, Autoplay } from "swiper/modules";
import "swiper/css";
import "swiper/css/pagination";
import "swiper/css/navigation";

export interface EditorialStory {
  id: string | number;
  category?: string;
  title: string;
  subtitle?: string;
  image: string;
  accent: string;
  href?: string;
}

export default function EditorialGrid({
  stories = [],
}: {
  stories?: EditorialStory[];
}) {
  if (stories.length === 0) return null;
  const sectionRef = useRef<HTMLDivElement>(null);
  const headingRef = useRef<HTMLHeadingElement>(null);

  useGSAP(
    () => {
      gsap.set(headingRef.current, { y: 40, opacity: 0 });
      ScrollTrigger.create({
        trigger: headingRef.current,
        start: "top 85%",
        onEnter: () => {
          gsap.to(headingRef.current, {
            y: 0,
            opacity: 1,
            duration: 0.6,
            ease: "power2.out",
          });
        },
        once: true,
      });
    },
    { scope: sectionRef }
  );

  const renderCard = (story: EditorialStory) => (
    <a
      href={story.href ?? "#"}
      className="story-card group relative block aspect-[3/4] h-full w-full overflow-hidden"
    >
      <div
        className="absolute inset-0 bg-cover bg-center transition-transform duration-500 group-hover:scale-[1.08]"
        style={{ backgroundImage: `url(${story.image})` }}
      />
      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
      <div className="absolute inset-0 bg-red/0 transition-colors duration-300 group-hover:bg-red/15" />
      <div className={`absolute left-0 top-0 h-1.5 w-full ${story.accent}`} />

      <div className="relative z-10 flex h-full flex-col justify-end p-6 md:p-8">
        <span className="mb-3 font-archivo text-xs font-bold uppercase tracking-[0.3em] text-white/60" style={{ fontStretch: "125%" }}>
          {story.category}
        </span>
        <h3 className="font-poppins text-2xl font-black uppercase leading-[1] text-white md:text-3xl lg:text-4xl">
          {story.title}
        </h3>
        {story.subtitle && (
          <p className="mt-3 font-montserrat text-sm leading-relaxed text-white/60">
            {story.subtitle}
          </p>
        )}
        <div className="mt-5 flex items-center gap-2 font-archivo text-sm font-bold uppercase tracking-widest text-white/80 transition-colors group-hover:text-red" style={{ fontStretch: "125%" }}>
          Read Full Story
          <span className="inline-block transition-transform duration-300 group-hover:translate-x-2">
            &rarr;
          </span>
        </div>
      </div>
    </a>
  );

  return (
    <section ref={sectionRef} className="min-h-screen w-full bg-black px-6 py-24 md:px-10 lg:px-16">
      <h2
        ref={headingRef}
        className="mb-12 text-center font-poppins text-[8vw] font-black uppercase tracking-wide text-white md:mb-16 md:text-[5vw]"
      >
        Latest Stories
      </h2>

      {/* Mobile: Swiper carousel */}
      <div className="md:hidden">
        <Swiper
          modules={[Pagination, Navigation, Autoplay]}
          spaceBetween={16}
          slidesPerView={1.1}
          centeredSlides={true}
          pagination={{ clickable: true }}
          autoplay={{ delay: 2500, disableOnInteraction: false }}
          speed={500}
          loop={stories.length > 2}
          className="editorial-swiper"
        >
          {stories.map((story) => (
            <SwiperSlide key={story.id}>{renderCard(story)}</SwiperSlide>
          ))}
        </Swiper>
      </div>

      {/* Desktop: Grid */}
      <div className="mx-auto hidden max-w-7xl grid-cols-3 gap-6 md:grid">
        {stories.map((story) => (
          <div key={story.id}>{renderCard(story)}</div>
        ))}
      </div>

    </section>
  );
}
