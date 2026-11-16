/**
 * Static illustration shown when WebGL is unavailable (or the 3D scene
 * fails). It is labelled honestly as a still image.
 */
export function WorkshopFallback({ reason }: { reason: 'no-webgl' | 'error' }) {
  return (
    <figure className="workshop-fallback">
      <svg
        viewBox="0 -20 320 270"
        role="img"
        aria-label="Illustration of a miniature workshop: a desk with a laptop, a circuit board and gears, a shelf and a pegboard"
      >
        <g strokeLinejoin="round" strokeLinecap="round">
          {/* plinth, floor, walls */}
          <path d="M20 160 160 232 300 160v12l-140 72-140-72Z" fill="#24262c" />
          <path d="M20 160 160 88l140 72-140 72Z" fill="#e6d2ae" />
          <path d="M20 160 160 88V-12L20 60Z" fill="#ece3d3" />
          <path d="M160 88 300 160V60L160-12Z" fill="#f7f1e6" />
          <path d="M20 160 160 88l140 72" fill="none" stroke="#3d63ff" strokeWidth="3" />
          {/* pegboard */}
          <path d="M62 93.4 111 68.2v-30L62 63.4Z" fill="#3a5cff" />
          <path d="M78 74v-14M95 66v-12" stroke="#ff7a1a" strokeWidth="3" />
          {/* shelf + house + books */}
          <path d="M190 23.6 240 49.3l-8 4.1-50-25.7Z" fill="#d6b281" />
          <path d="M196 22l12 6v-9l-12-6Z" fill="#fffaf0" />
          <path d="M194 13.5 210 21.5 204 6Z" fill="#ff7a1a" />
          <path d="M218 33v-14l4 2v14ZM224 36v-12l4 2v12Z" fill="#3d63ff" />
          {/* desk */}
          <path d="M180 53 270 100l-28 14.6-90-46.9Z" fill="#d6b281" />
          <path d="M152 67.7v45M242 114.6v45M270 100v45" stroke="#2a2c33" strokeWidth="4" />
          {/* laptop */}
          <path d="M170 69 190 79l-6 3-20-10Z" fill="#c7cbd3" />
          <path d="M170 69 190 79V61L170 51Z" fill="#16204a" />
          <path d="M174 62l10 5M174 57l8 4" stroke="#7d95ff" strokeWidth="1.6" />
          {/* board */}
          <path d="M205 90 225 100l-6 3-20-10Z" fill="#2147e0" />
          <circle cx="210" cy="95" r="1.6" fill="#9fb4ff" />
          <circle cx="215" cy="97.5" r="1.6" fill="#9fb4ff" />
          {/* gears */}
          <circle cx="248" cy="96" r="8" fill="none" stroke="#ff7a1a" strokeWidth="4.5" strokeDasharray="3 2.2" />
          <circle cx="259" cy="102" r="5" fill="none" stroke="#3d63ff" strokeWidth="3.5" strokeDasharray="2.4 1.8" />
          {/* rug + stool */}
          <ellipse cx="178" cy="176" rx="34" ry="17" fill="#c9d3ff" />
          <path d="M171 152v24M185 152v24" stroke="#2a2c33" strokeWidth="3" />
          <ellipse cx="178" cy="150" rx="15" ry="7.5" fill="#ff7a1a" />
        </g>
      </svg>
      <figcaption>
        {reason === 'no-webgl'
          ? 'Static preview — the interactive 3D workshop needs WebGL.'
          : 'Static preview — the 3D workshop could not start on this device.'}
      </figcaption>
    </figure>
  )
}
