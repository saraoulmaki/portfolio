/**
 * Canvas, lighting, input handling and the small control bar for the hero
 * workshop diorama. Default-exported so it can be lazy-loaded (keeps
 * Three.js out of the initial bundle).
 */
import { useCallback, useEffect, useRef, useState, type FocusEvent, type KeyboardEvent, type PointerEvent } from 'react'
import { Canvas } from '@react-three/fiber'
import { ContactShadows, Environment, Lightformer } from '@react-three/drei'
import { createSceneInput, type SceneInput } from './sceneInput'
import { Workshop } from './workshop/Workshop'
import type { WorkshopObjectId } from './workshop/Interactive'
import { LED_SEQUENCE_SECONDS } from './workshop/CircuitBoard'

interface Props {
  /** false when the user prefers reduced motion */
  animate: boolean
  /** false when scrolled off-screen → render loop paused */
  active: boolean
  dark: boolean
}

const DRAG_SPEED = 0.0075
const DRAG_THRESHOLD = 5 // px before a press becomes a drag (taps stay clicks)
const MAX_VEL = 8

export default function HeroScene({ animate, active, dark }: Props) {
  const input = useRef<SceneInput>(createSceneInput())
  const press = useRef<{ x: number; y: number; t: number; id: number } | null>(null)

  const [screenOn, setScreenOn] = useState(true)
  const [ledTrigger, setLedTrigger] = useState(0)
  const [ledsRunning, setLedsRunning] = useState(false)
  const ledTimer = useRef<number | undefined>(undefined)
  const [gearsOn, setGearsOn] = useState(animate)
  const [highlight, setHighlight] = useState<WorkshopObjectId | null>(null)

  // One LED sequence per click: (re)start it, and reset the button's
  // indicator when it ends. A click mid-sequence restarts the timer too.
  const runLeds = useCallback(() => {
    setLedTrigger((n) => n + 1)
    setLedsRunning(true)
    window.clearTimeout(ledTimer.current)
    ledTimer.current = window.setTimeout(() => setLedsRunning(false), LED_SEQUENCE_SECONDS * 1000)
  }, [])
  useEffect(() => () => window.clearTimeout(ledTimer.current), [])

  const activate = useCallback(
    (id: WorkshopObjectId) => {
      if (id === 'laptop') setScreenOn((s) => !s)
      else if (id === 'board') runLeds()
      else setGearsOn((g) => !g)
    },
    [runLeds],
  )

  /* ---------- drag to rotate ---------- */
  const onPointerDown = useCallback((e: PointerEvent<HTMLDivElement>) => {
    if (e.pointerType === 'mouse' && e.button !== 0) return
    press.current = { x: e.clientX, y: e.clientY, t: performance.now(), id: e.pointerId }
  }, [])

  const onPointerMove = useCallback((e: PointerEvent<HTMLDivElement>) => {
    const p = press.current
    const i = input.current
    if (!p || p.id !== e.pointerId) return
    if (!i.dragging) {
      if (Math.hypot(e.clientX - p.x, e.clientY - p.y) < DRAG_THRESHOLD) return
      // Only capture once it's clearly a drag, so taps still reach the 3D objects.
      i.dragging = true
      i.velX = i.velY = 0
      e.currentTarget.setPointerCapture(e.pointerId)
    }
    const now = performance.now()
    const dt = Math.max((now - p.t) / 1000, 1 / 240)
    const dx = (e.clientX - p.x) * DRAG_SPEED
    const dy = (e.clientY - p.y) * DRAG_SPEED
    i.rotY += dx
    i.rotX += dy
    const clamp = (v: number) => Math.max(-MAX_VEL, Math.min(MAX_VEL, v))
    i.velY = clamp(i.velY * 0.5 + (dx / dt) * 0.5)
    i.velX = clamp(i.velX * 0.5 + (dy / dt) * 0.5)
    i.lastInteraction = now
    press.current = { x: e.clientX, y: e.clientY, t: now, id: e.pointerId }
  }, [])

  const endPress = useCallback((e: PointerEvent<HTMLDivElement>) => {
    const i = input.current
    const p = press.current
    press.current = null
    if (!i.dragging) return
    i.dragging = false
    i.lastInteraction = performance.now()
    if (p && performance.now() - p.t > 80) i.velX = i.velY = 0 // paused before release: no fling
    if (e.currentTarget.hasPointerCapture(e.pointerId)) e.currentTarget.releasePointerCapture(e.pointerId)
  }, [])

  const onKeyDown = useCallback((e: KeyboardEvent<HTMLDivElement>) => {
    const i = input.current
    const kick = 2.4
    switch (e.key) {
      case 'ArrowLeft':
        i.velY -= kick
        break
      case 'ArrowRight':
        i.velY += kick
        break
      case 'ArrowUp':
        i.velX -= kick
        break
      case 'ArrowDown':
        i.velX += kick
        break
      default:
        return
    }
    e.preventDefault()
    i.lastInteraction = performance.now()
  }, [])

  /* ---------- control bar ---------- */
  const hoverProps = (id: WorkshopObjectId) => ({
    onMouseEnter: () => setHighlight(id),
    onMouseLeave: () => setHighlight(null),
    // Only keyboard focus highlights the object; after a mouse click the
    // button keeps focus, which must not leave the object looking "active".
    onFocus: (e: FocusEvent<HTMLButtonElement>) => {
      if (e.currentTarget.matches(':focus-visible')) setHighlight(id)
    },
    onBlur: () => setHighlight(null),
  })

  return (
    <>
      <div
        className="hero-scene"
        tabIndex={0}
        role="group"
        aria-roledescription="interactive 3D scene"
        aria-label="Miniature maker workshop: a desk with a laptop, a circuit board, a soldering iron and a gear model, with a shelf and tools on the walls. Drag or use the arrow keys to look around."
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        onPointerUp={endPress}
        onPointerCancel={endPress}
        onKeyDown={onKeyDown}
      >
        <Canvas
          frameloop={active ? 'always' : 'never'}
          dpr={[1, 1.75]}
          shadows
          camera={{ position: [0, 0.3, 6.4], fov: 30 }}
          gl={{ antialias: true, alpha: true }}
          aria-hidden="true"
        >
          <hemisphereLight args={['#fff1df', '#c8b090', dark ? 0.6 : 0.85]} />
          <directionalLight
            position={[2.5, 5, 4]}
            intensity={dark ? 1.7 : 2.0}
            color="#ffe2bf"
            castShadow
            shadow-mapSize={[1024, 1024]}
            shadow-bias={-0.0004}
            shadow-normalBias={0.02}
            shadow-camera-left={-2.6}
            shadow-camera-right={2.6}
            shadow-camera-top={2.6}
            shadow-camera-bottom={-2.6}
            shadow-camera-near={1}
            shadow-camera-far={14}
          />
          <directionalLight position={[-4, 2, 3]} intensity={0.35} color="#e9e2d6" />

          {/* Local, texture-free environment for soft metal reflections (no network fetch). */}
          <Environment resolution={64} environmentIntensity={0.55}>
            <Lightformer form="rect" intensity={1.6} color="#fff3e2" position={[0, 3, 2]} scale={[6, 2, 1]} />
            <Lightformer form="rect" intensity={0.8} color="#e8e4da" position={[-4, 0, 1]} scale={[2, 5, 1]} />
            <Lightformer form="rect" intensity={0.8} color="#f4c9a4" position={[4, -1, 2]} scale={[2, 4, 1]} />
          </Environment>

          <Workshop
            input={input}
            animate={animate}
            dark={dark}
            screenOn={screenOn}
            ledTrigger={ledTrigger}
            gearsOn={gearsOn}
            highlight={highlight}
            onActivate={activate}
          />

          <ContactShadows
            position={[0, -1.05, 0]}
            scale={5}
            blur={2.8}
            far={2}
            opacity={dark ? 0.6 : 0.3}
            resolution={256}
            color={dark ? '#000000' : '#4a3626'}
          />
        </Canvas>
      </div>

      <div className="ws-controls" role="toolbar" aria-label="Workshop controls">
        <span className="ws-controls-label">Try</span>
        <button type="button" className="ws-btn" aria-pressed={screenOn} onClick={() => activate('laptop')} {...hoverProps('laptop')}>
          <span className="ws-dot" aria-hidden="true" />
          Screen
        </button>
        <button
          type="button"
          className={`ws-btn${ledsRunning ? ' is-running' : ''}`}
          onClick={() => activate('board')}
          {...hoverProps('board')}
        >
          <span className="ws-dot" aria-hidden="true" />
          Blink LEDs
        </button>
        <button type="button" className="ws-btn" aria-pressed={gearsOn} onClick={() => activate('gears')} {...hoverProps('gears')}>
          <span className="ws-dot" aria-hidden="true" />
          Gears
        </button>
      </div>
    </>
  )
}
