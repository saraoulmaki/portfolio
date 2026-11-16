/**
 * Optional demo video on a project page: a self-hosted file, an embed
 * (YouTube / Vimeo), or a "coming soon" placeholder.
 */
import type { ProjectVideo as Video } from '../data/projects'
import { asset } from '../utils'
import './ProjectVideo.css'

export function ProjectVideo({ video, title, num }: { video: Video; title: string; num?: string }) {
  return (
    <section className="pv-video" aria-labelledby="video-title">
      <h2 id="video-title" className={num ? 'cs-title' : 'pv-video-title'}>
        {num && (
          <span className="cs-num" aria-hidden="true">
            {num}
          </span>
        )}
        {video.heading ?? 'Video demonstration'}
      </h2>

      {video.kind === 'coming-soon' && (
        <div className="pv-video-frame is-pending">
          <span className="pv-video-play" aria-hidden="true">
            <svg viewBox="0 0 24 24" width="22" height="22">
              <path d="M8 5.5v13l10.5-6.5Z" fill="currentColor" />
            </svg>
          </span>
          <p className="hand">video coming soon</p>
        </div>
      )}

      {video.kind === 'file' && (
        <figure
          className={`pv-video-figure${
            video.width && video.height && video.height > video.width ? ' is-portrait' : ''
          }`}
        >
          <video
            className="pv-video-frame"
            controls
            playsInline
            preload="metadata"
            poster={video.poster ? asset(video.poster) : undefined}
            width={video.width}
            height={video.height}
            style={video.width && video.height ? { aspectRatio: `${video.width} / ${video.height}` } : undefined}
            aria-label={video.heading ?? `${title} — video demonstration`}
          >
            <source src={asset(video.src)} type="video/mp4" />
            Your browser can’t play this video.
          </video>
          {video.caption && <figcaption>{video.caption}</figcaption>}
        </figure>
      )}

      {video.kind === 'embed' && (
        <figure className="pv-video-figure">
          <iframe
            className="pv-video-frame"
            src={video.url}
            title={video.title ?? `${title} — video demonstration`}
            loading="lazy"
            allow="accelerometer; encrypted-media; gyroscope; picture-in-picture; fullscreen"
            allowFullScreen
            referrerPolicy="strict-origin-when-cross-origin"
          />
          {video.caption && <figcaption>{video.caption}</figcaption>}
        </figure>
      )}
    </section>
  )
}
