"use client";

import { useState } from "react";
import { getYoutubeEmbedUrl, getYoutubeThumbnailUrl } from "@/lib/youtube";

// Click-to-play facade — shows just the thumbnail image until clicked, so
// the homepage doesn't pay YouTube's heavy iframe/JS cost on every visit.
export default function YoutubeEmbed({ url, title }: { url: string; title: string }) {
  const [playing, setPlaying] = useState(false);
  const embedUrl = getYoutubeEmbedUrl(url);
  const thumbnailUrl = getYoutubeThumbnailUrl(url);

  if (!embedUrl) return null;

  return (
    <div className="relative aspect-video w-full overflow-hidden rounded-2xl bg-slate-900 shadow-[0_8px_32px_-12px_rgba(124,92,252,0.25)]">
      {playing ? (
        <iframe
          src={`${embedUrl}?autoplay=1`}
          title={title}
          className="h-full w-full"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
        />
      ) : (
        <button
          type="button"
          onClick={() => setPlaying(true)}
          className="group relative h-full w-full focus-ring"
          aria-label={`Play video: ${title}`}
        >
          {thumbnailUrl && (
            // eslint-disable-next-line @next/next/no-img-element -- external, unpredictable-domain YouTube thumbnail; next/image adds no benefit here
            <img src={thumbnailUrl} alt="" className="h-full w-full object-cover" loading="lazy" />
          )}
          <span className="absolute inset-0 bg-black/20 transition-colors group-hover:bg-black/30" />
          <span className="absolute inset-0 flex items-center justify-center">
            <span className="flex h-16 w-16 items-center justify-center rounded-full bg-white/95 shadow-lg transition-transform group-hover:scale-110">
              <svg width="26" height="26" viewBox="0 0 20 20" fill="none">
                <path d="M7 4.5v11l9-5.5-9-5.5Z" fill="#7c5cfc" />
              </svg>
            </span>
          </span>
        </button>
      )}
    </div>
  );
}
