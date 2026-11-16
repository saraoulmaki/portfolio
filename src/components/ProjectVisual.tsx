/**
 * Project image — shows the real photo when provided, otherwise a drawn
 * placeholder that is clearly labelled as such.
 */
import type { PlaceholderMotif, ProjectImage } from '../data/projects'
import { asset } from '../utils'
import './ProjectVisual.css'

export function ProjectVisual({
  image,
  motif = 'generic',
  title,
}: {
  image?: ProjectImage
  motif?: PlaceholderMotif
  title: string
}) {
  if (image) {
    return (
      <div className="project-visual">
        <img
          src={asset(image.src)}
          alt={image.alt}
          width={image.width}
          height={image.height}
          loading="lazy"
          decoding="async"
        />
      </div>
    )
  }

  return (
    <div
      className={`project-visual is-placeholder motif-${motif}`}
      role="img"
      aria-label={`Placeholder illustration for ${title}. Project photo coming soon.`}
    >
      <svg viewBox="0 0 400 250" preserveAspectRatio="xMidYMid slice" aria-hidden="true">
        <defs>
          <pattern id={`grid-${motif}`} width="20" height="20" patternUnits="userSpaceOnUse">
            <path d="M20 0H0V20" fill="none" stroke="currentColor" strokeOpacity="0.08" />
          </pattern>
        </defs>
        <rect width="400" height="250" fill={`url(#grid-${motif})`} />
        <Motif motif={motif} />
      </svg>
      <span className="placeholder-badge">Placeholder image</span>
    </div>
  )
}

function Motif({ motif }: { motif: PlaceholderMotif }) {
  switch (motif) {
    case 'fpga':
      return (
        <g className="pv-draw">
          {/* chip with pins + a VGA-like test pattern */}
          <rect x="70" y="70" width="110" height="110" rx="10" className="pv-fill" />
          {Array.from({ length: 6 }, (_, i) => (
            <g key={i}>
              <line x1={84 + i * 17} y1="58" x2={84 + i * 17} y2="70" />
              <line x1={84 + i * 17} y1="180" x2={84 + i * 17} y2="192" />
              <line x1="58" y1={84 + i * 17} x2="70" y2={84 + i * 17} />
              <line x1="180" y1={84 + i * 17} x2="192" y2={84 + i * 17} />
            </g>
          ))}
          <path d="M192 125h40" className="pv-accent" />
          <rect x="232" y="72" width="110" height="106" rx="6" />
          {['#2a54ff', '#ff7a1a', '#f1ede4', '#6f8bff', '#2d2f35'].map((c, i) => (
            <rect key={c} x={240 + i * 19} y="80" width="19" height="90" fill={c} stroke="none" opacity="0.85" />
          ))}
        </g>
      )
    case 'sensor':
      return (
        <g className="pv-draw">
          <circle cx="120" cy="125" r="46" className="pv-fill" />
          {[-24, -8, 8, 24].map((y) => (
            <line key={y} x1={96} y1={125 + y} x2={144} y2={125 + y} />
          ))}
          {[30, 52, 74].map((r, i) => (
            <path
              key={r}
              d={`M${210 + i * 4} ${125 - r * 0.7}a${r} ${r} 0 0 1 0 ${r * 1.4}`}
              className={i === 0 ? 'pv-accent' : undefined}
            />
          ))}
          <path d="M260 170c15-30 25-60 45-60s25 40 45 40" className="pv-accent" />
          <path d="M260 190h90" />
        </g>
      )
    case 'audio':
      return (
        <g className="pv-draw">
          {Array.from({ length: 7 }, (_, i) => (
            <rect key={i} x={60 + i * 26} y="90" width="24" height="90" rx="3" className="pv-fill" />
          ))}
          {[0, 1, 3, 4, 5].map((i) => (
            <rect key={i} x={76 + i * 26} y="90" width="14" height="52" rx="2" fill="currentColor" stroke="none" opacity="0.8" />
          ))}
          <path
            d="M260 125q10-50 20 0t20 0 20 0 20 0 20 0"
            className="pv-accent"
          />
          <circle cx="300" cy="190" r="10" />
          <circle cx="330" cy="190" r="10" />
        </g>
      )
    default:
      return (
        <g className="pv-draw">
          <rect x="140" y="70" width="120" height="110" rx="12" className="pv-fill" />
          <path d="M170 125h60" className="pv-accent" />
        </g>
      )
  }
}
