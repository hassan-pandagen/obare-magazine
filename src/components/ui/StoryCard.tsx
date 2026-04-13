"use client";

import { cn } from "@/lib/utils";

interface StoryCardProps {
  category: string;
  title: string;
  image: string;
  color: string;
}

export default function StoryCard({
  category,
  title,
  image,
  color,
}: StoryCardProps) {
  return (
    <a
      href="#"
      className="story-card group relative block aspect-[3/4] overflow-hidden rounded-sm"
    >
      {/* Background image — replace with Figma exports */}
      <div
        className="absolute inset-0 bg-cover bg-center transition-transform duration-500 group-hover:scale-[1.08]"
        style={{ backgroundImage: `url(${image})` }}
      />

      {/* Gradient overlay */}
      <div
        className={cn(
          "absolute inset-0 bg-gradient-to-t opacity-70 transition-opacity duration-300 group-hover:opacity-90",
          color
        )}
      />

      {/* Red tint on hover */}
      <div className="absolute inset-0 bg-red/0 transition-colors duration-300 group-hover:bg-red/15" />

      {/* Content */}
      <div className="relative z-10 flex h-full flex-col justify-end p-6">
        <span className="mb-2 inline-block w-fit rounded-full border border-white/30 px-3 py-1 font-montserrat text-[10px] font-medium uppercase tracking-widest text-white/80">
          {category}
        </span>
        <h3 className="font-poppins text-2xl font-bold leading-tight text-white md:text-3xl">
          {title}
        </h3>
      </div>
    </a>
  );
}
