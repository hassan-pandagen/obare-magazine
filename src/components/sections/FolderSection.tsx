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
    <div className="folder-card relative flex h-screen w-full flex-col overflow-hidden bg-[#f2f2f2] shadow-[0_-20px_60px_rgba(0,0,0,0.45)]"
      style={{ borderRadius: "24px 24px 0 0" }}
    >
      {/* Viewfinder lines */}
      <div className="pointer-events-none absolute inset-6 border border-dashed border-black/[0.05] md:inset-10">
        <span className="absolute -top-3 left-0 font-montserrat text-[8px] uppercase tracking-[0.3em] text-black/15">
          Overscan
        </span>
        <span className="absolute -top-3 right-0 font-montserrat text-[8px] text-black/15">
          1920 &times; 1080
        </span>
        <span className="absolute bottom-0 left-0 font-montserrat text-[8px] uppercase tracking-[0.3em] text-black/10">
          Crop [ 16:9 ]
        </span>
      </div>

      {/* Header */}
      <div className="relative z-10 flex flex-shrink-0 items-start justify-between p-6 md:p-10">
        <div>
          {category && (
            <span className="mb-2 block font-montserrat text-[10px] font-bold uppercase tracking-[0.4em] text-black/25">
              {category}
              {author && (
                <span className="ml-3 font-normal text-black/15">
                  | by {author}
                </span>
              )}
            </span>
          )}
          <h2 className="font-poppins text-[7vw] font-black leading-[0.9] text-black md:text-[5vw] lg:text-[4vw]">
            {title}
          </h2>
          {subtitle && (
            <p className="mt-2 max-w-lg font-montserrat text-sm font-medium text-black/35 md:text-base">
              {subtitle}
            </p>
          )}
        </div>
        <a
          href="#"
          className="mt-2 hidden shrink-0 font-montserrat text-sm font-bold text-black/40 transition-colors hover:text-red md:block"
        >
          View Project &rarr;
        </a>
      </div>

      {/* Content */}
      <div className="relative mx-6 mb-6 flex-grow overflow-hidden rounded-lg border border-black/10 bg-zinc-900 md:mx-10 md:mb-10">
        {videoSrc ? (
          <video
            src={videoSrc}
            autoPlay
            loop
            muted
            playsInline
            className="h-full w-full object-cover"
          />
        ) : imageSrc ? (
          <img
            src={imageSrc}
            alt={title}
            className="h-full w-full object-cover"
          />
        ) : (
          <div className="h-full w-full bg-zinc-800" />
        )}
      </div>
    </div>
  );
}
