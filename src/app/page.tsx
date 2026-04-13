"use client";

import { useState, useCallback } from "react";
import Navbar from "@/components/layout/Navbar";
import Loader from "@/components/layout/Loader";
import Footer from "@/components/layout/Footer";
import Hero from "@/components/sections/Hero";
import WhyTravel from "@/components/sections/WhyTravel";
import ProjectSection from "@/components/sections/ProjectSection";
import Marquee from "@/components/sections/Marquee";
import EditorialGrid from "@/components/sections/EditorialGrid";
import FooterCTA from "@/components/sections/FooterCTA";

export default function Home() {
  const [isLoaded, setIsLoaded] = useState(false);

  const handleLoadComplete = useCallback(() => {
    setIsLoaded(true);
  }, []);

  return (
    <>
      {!isLoaded && <Loader onComplete={handleLoadComplete} />}
      <Navbar />
      <main>
        {/*
          FOLDER STACK LAYOUT:
          - Hero is h-[200vh] with sticky image. Content scrolls past it.
          - Each subsequent section slides UP over the previous one
          - Rounded top corners + shadow = physical folder card feel
          - Previous section peeks behind the rounded corners
        */}

        {/* 1. Hero — tall wrapper, sticky inside */}
        <div className="relative z-[1] h-[200vh]">
          <div className="sticky top-0 h-screen">
            <Hero />
          </div>
        </div>

        {/* 2. WHY TRAVEL — pulls up over hero with negative margin */}
        <div
          className="relative z-[2]"
          style={{
            marginTop: "-100vh",
            borderRadius: "24px 24px 0 0",
            boxShadow: "0 -30px 80px rgba(0,0,0,0.4)",
            overflow: "hidden",
          }}
        >
          <WhyTravel />
        </div>

        {/* 3. Project 1 — rounded top, shadow, slides over WhyTravel */}
        <div
          className="relative z-[3]"
          style={{
            borderRadius: "24px 24px 0 0",
            boxShadow: "0 -30px 80px rgba(0,0,0,0.3)",
            overflow: "hidden",
          }}
        >
          <ProjectSection
            title="Bare Models"
            subtitle="My visual universe is surrealistic, colorful and dark at the same time."
            category="Culture"
            author="Obi Nwachukwu"
            videoSrc="/videos/reveal-bg.mp4"
            nextImageSrc="/images/traveling.png"
            index={3}
          />
        </div>

        {/* 4. Project 2 — rounded top, slides over Project 1 */}
        <div
          className="relative z-[4]"
          style={{
            borderRadius: "24px 24px 0 0",
            boxShadow: "0 -30px 80px rgba(0,0,0,0.3)",
            overflow: "hidden",
          }}
        >
          <ProjectSection
            title="The Magazine That's Real"
            subtitle="We believe in raw expression, bold creativity, and stories that move people."
            category="About OBARE"
            author="OBARE Editorial"
            videoSrc="/videos/who-we-are.mp4"
            nextImageSrc="/images/magazine-real.png"
            index={4}
          />
        </div>

        {/* 5. Marquee — rounded top */}
        <div
          className="relative z-[10]"
          style={{
            borderRadius: "24px 24px 0 0",
            boxShadow: "0 -20px 60px rgba(0,0,0,0.2)",
            overflow: "hidden",
          }}
        >
          <Marquee />
        </div>

        {/* 6. Latest Stories */}
        <div className="relative z-[11]">
          <EditorialGrid />
        </div>

        {/* 7. LET'S TALK CTA — rounded top */}
        <div
          className="relative z-[12]"
          style={{
            borderRadius: "24px 24px 0 0",
            boxShadow: "0 -20px 60px rgba(0,0,0,0.15)",
            overflow: "hidden",
          }}
        >
          <FooterCTA />
        </div>
      </main>

      <div className="relative z-[13]">
        <Footer />
      </div>
    </>
  );
}
