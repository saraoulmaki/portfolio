import { lazy, Suspense, useRef, useState } from 'react'
import { useReducedMotion } from 'motion/react'
import { useInView } from '../hooks/useInView'
import type { Theme } from '../hooks/useTheme'
import { hasWebGL } from '../utils'
import { Annotation } from './Annotation'
import { WorkshopFallback } from './WorkshopFallback'
import { ErrorBoundary } from './ErrorBoundary'
import './HeroVisual.css'

// Three.js + R3F are only downloaded when (and if) the 3D view is needed.
const HeroScene = lazy(() => import('../three/HeroScene'))

export function HeroVisual({ theme }: { theme: Theme }) {
  const ref = useRef<HTMLDivElement>(null)
  const inView = useInView(ref)
  const reduceMotion = useReducedMotion() ?? false
  const [webgl] = useState(hasWebGL)

  return (
    <div className="hero-visual" ref={ref}>
      <div className="hv-backdrop" aria-hidden="true">
        <div className="hv-disc" />
      </div>

      <div className="hv-stage">
        {webgl ? (
          <ErrorBoundary fallback={<WorkshopFallback reason="error" />}>
            <Suspense fallback={<div className="hv-loading" aria-label="Loading 3D workshop" role="status" />}>
              <HeroScene animate={!reduceMotion} active={inView} dark={theme === 'dark'} />
            </Suspense>
          </ErrorBoundary>
        ) : (
          <WorkshopFallback reason="no-webgl" />
        )}
      </div>

      {webgl && <Annotation text="drag to look around" dir="up-left" className="an-drag" delay={1.0} rotate={-3} />}
    </div>
  )
}
