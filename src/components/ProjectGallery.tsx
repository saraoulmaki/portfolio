/**
 * Photo gallery for a project page: a main viewer, thumbnails (when there
 * are several photos) and a full-screen lightbox built on the native
 * <dialog> element (focus trapping + Escape to close for free).
 */
import { useCallback, useEffect, useRef, useState, type CSSProperties } from 'react'
import type { ProjectImage } from '../data/projects'
import { asset } from '../utils'
import { ArrowLeftIcon, ArrowRightIcon, CloseIcon } from './Icons'
import './ProjectGallery.css'

/** Never enlarge a photo by more than this factor (small photos stay crisp-ish). */
const MAX_UPSCALE = 1.6

export function ProjectGallery({ images, title }: { images: ProjectImage[]; title: string }) {
  const [index, setIndex] = useState(0)
  const dialog = useRef<HTMLDialogElement>(null)
  const count = images.length
  const current = images[Math.min(index, count - 1)]

  const go = useCallback((step: number) => setIndex((i) => (i + step + count) % count), [count])

  const open = () => dialog.current?.showModal()
  const close = () => dialog.current?.close()

  // Arrow keys inside the lightbox
  useEffect(() => {
    const d = dialog.current
    if (!d || count < 2) return
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'ArrowRight') go(1)
      else if (e.key === 'ArrowLeft') go(-1)
    }
    d.addEventListener('keydown', onKey)
    return () => d.removeEventListener('keydown', onKey)
  }, [go, count])

  if (!current) return null

  const capStyle = (im: ProjectImage): CSSProperties => ({
    maxWidth: `min(100%, ${Math.round(im.width * MAX_UPSCALE)}px)`,
    maxHeight: `min(100%, ${Math.round(im.height * MAX_UPSCALE)}px)`,
  })

  return (
    <section className="gallery" aria-label={`Photos of ${title}`}>
      <div className="gallery-stage">
        <button type="button" className="gallery-main" onClick={open} aria-label={`Enlarge photo ${index + 1} of ${count}`}>
          <img
            key={current.src}
            src={asset(current.src)}
            alt={current.alt}
            width={current.width}
            height={current.height}
            style={capStyle(current)}
            decoding="async"
          />
          <span className="gallery-zoom" aria-hidden="true">
            Enlarge
          </span>
        </button>
        {count > 1 && (
          <>
            <button type="button" className="gallery-nav is-prev" onClick={() => go(-1)} aria-label="Previous photo">
              <ArrowLeftIcon width={18} height={18} />
            </button>
            <button type="button" className="gallery-nav is-next" onClick={() => go(1)} aria-label="Next photo">
              <ArrowRightIcon width={18} height={18} />
            </button>
          </>
        )}
      </div>

      <p className="gallery-caption">
        {count > 1 && (
          <span className="gallery-count">
            {String(index + 1).padStart(2, '0')} / {String(count).padStart(2, '0')}
          </span>
        )}
        {current.caption ?? current.alt}
      </p>

      {count > 1 && (
        <ul className="gallery-thumbs">
          {images.map((im, i) => (
            <li key={im.src}>
              <button
                type="button"
                className="gallery-thumb"
                aria-current={i === index ? 'true' : undefined}
                aria-label={`Show photo ${i + 1}: ${im.alt}`}
                onClick={() => setIndex(i)}
              >
                <img src={asset(im.src)} alt="" loading="lazy" decoding="async" />
              </button>
            </li>
          ))}
        </ul>
      )}

      <dialog
        ref={dialog}
        className="lightbox"
        aria-label={`${title} — photo ${index + 1} of ${count}`}
        onClick={(e) => {
          if (e.target === e.currentTarget) close() // click on the backdrop
        }}
      >
        <figure className="lightbox-figure">
          <img src={asset(current.src)} alt={current.alt} style={capStyle(current)} />
          <figcaption>
            {count > 1 && <span className="gallery-count">{index + 1} / {count}</span>}
            {current.caption ?? current.alt}
          </figcaption>
        </figure>
        <button type="button" className="lightbox-btn lightbox-close" onClick={close} aria-label="Close" autoFocus>
          <CloseIcon />
        </button>
        {count > 1 && (
          <>
            <button type="button" className="lightbox-btn lightbox-prev" onClick={() => go(-1)} aria-label="Previous photo">
              <ArrowLeftIcon />
            </button>
            <button type="button" className="lightbox-btn lightbox-next" onClick={() => go(1)} aria-label="Next photo">
              <ArrowRightIcon />
            </button>
          </>
        )}
      </dialog>
    </section>
  )
}
