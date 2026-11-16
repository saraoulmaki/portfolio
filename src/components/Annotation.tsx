import { motion } from 'motion/react'
import type { CSSProperties } from 'react'

export type ArrowDir = 'down-right' | 'down-left' | 'up-right' | 'up-left'

const flips: Record<ArrowDir, string> = {
  'down-right': 'none',
  'down-left': 'scaleX(-1)',
  'up-right': 'scaleY(-1)',
  'up-left': 'scale(-1, -1)',
}

/** Handwritten note + sketchy arrow, drawn in when it appears. */
export function Annotation({
  text,
  dir,
  style,
  className = '',
  delay = 0,
  rotate = -4,
}: {
  text: string
  dir: ArrowDir
  style?: CSSProperties
  className?: string
  delay?: number
  rotate?: number
}) {
  const up = dir.startsWith('up')
  const arrow = (
    <svg className="annotation-arrow" viewBox="0 0 90 60" width="70" height="46" style={{ transform: flips[dir] }} aria-hidden="true">
      <motion.path
        d="M6 6 C 28 4, 62 14, 80 50"
        initial={{ pathLength: 0 }}
        animate={{ pathLength: 1 }}
        transition={{ duration: 0.8, delay: delay + 0.25, ease: 'easeInOut' }}
      />
      <motion.path
        d="M68 44 L81 52 L84 37"
        initial={{ pathLength: 0 }}
        animate={{ pathLength: 1 }}
        transition={{ duration: 0.3, delay: delay + 1.0 }}
      />
    </svg>
  )

  return (
    <motion.div
      className={`annotation annotation-${dir} ${className}`}
      style={style}
      initial={{ opacity: 0, y: 6 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay }}
      aria-hidden="true"
    >
      {up && arrow}
      <span className="annotation-text hand" style={{ transform: `rotate(${rotate}deg)` }}>
        {text}
      </span>
      {!up && arrow}
    </motion.div>
  )
}
