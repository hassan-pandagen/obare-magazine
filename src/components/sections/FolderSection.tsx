"use client";

interface FolderSectionProps {
  title: string;
  subtitle?: string;
  category?: string;
  author?: string;
  videoSrc?: string;
  imageSrc?: string;
}

export default function FolderSection({
  title,
  subtitle,
  category,
  author,
  videoSrc,
  imageSrc,
}: FolderSectionProps) {
  return (
    <div
      className="folder-card relative h-screen w-full overflow-hidden bg-[#f2f2f2] shadow-[0_-20px_60px_rgba(0,0,0,0.45)]"
      style={{ borderRadius: "24px 24px 0 0" }}
    >
      <div className="flex h-full w-full flex-col md:flex-row">
        {/* TEXT — mobile: top block; desktop: left 40% */}
        <div className="flex flex-shrink-0 flex-col justify-between px-5 pt-5 pb-3 md:w-2/5 md:flex-shrink md:px-10 md:py-12 lg:px-16 lg:py-16">
          <div>
            {category && (
              <span className="block font-montserrat text-[10px] font-bold uppercase tracking-[0.4em] text-black/30 md:text-xs">
                {category}
                {author && (
                  <span className="ml-3 font-normal text-black/25">
                    | by {author}
                  </span>
                )}
              </span>
            )}
          </div>

          <div className="mt-4 md:mt-0">
            <h2 className="font-poppins font-black uppercase leading-[0.9] text-black text-[9vw] md:text-[3.8vw] lg:text-[4.2vw] xl:text-[4.8vw]">
              {title}
            </h2>
            {subtitle && (
              <p className="mt-3 max-w-md font-montserrat text-sm leading-relaxed text-black/50 md:mt-6 md:text-base">
                {subtitle}
              </p>
            )}
          </div>

          <a
            href="#"
            className="mt-4 hidden font-montserrat text-sm font-bold uppercase tracking-[0.2em] text-black/60 transition-colors hover:text-red md:inline-block"
          >
            View Project &rarr;
          </a>
        </div>

        {/* MEDIA — mobile: 9:16 portrait; desktop: fills right 60% */}
        <div className="relative flex-1 overflow-hidden px-5 pb-5 md:px-0 md:pb-0 md:pr-10 md:py-12 lg:pr-16 lg:py-16">
          <div className="relative h-full w-full overflow-hidden rounded-lg bg-black md:rounded-xl aspect-[9/16] md:aspect-auto">
            {videoSrc ? (
              <video
                src={videoSrc}
                autoPlay
                loop
                muted
                playsInline
                className="absolute inset-0 h-full w-full object-cover"
              />
            ) : imageSrc ? (
              <img
                src={imageSrc}
                alt={title}
                className="absolute inset-0 h-full w-full object-cover"
              />
            ) : (
              <div className="absolute inset-0 h-full w-full bg-zinc-800" />
            )}
          </div>
        </div>
      </div>
    </div>
  );
}