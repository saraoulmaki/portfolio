/**
 * Development board lying on the desk — origin at its centre on the desk.
 * Modelled in "board units" (≈ 1 × 0.66) and scaled down, reusing the
 * shared electronic parts. Muted green solder mask, metallic parts.
 *
 * LEDs: a small red power LED stays softly lit. Each change of
 * `ledTrigger` (re)starts one blink sequence of LED_SEQUENCE_SECONDS on
 * the four amber LEDs; afterwards they return to their idle (off) state.
 * A new trigger during a sequence restarts it from the beginning.
 */
import { useMemo, useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import { RoundedBox } from '@react-three/drei'
import * as THREE from 'three'
import { makeLedMaterial, mat } from '../materials'
import { Capacitor, Chip, Header, Smd, Trace } from '../parts'

/** Duration of one blink sequence. Shared with the UI so the button resets in sync. */
export const LED_SEQUENCE_SECONDS = 2.4

const SCALE = 0.3
const LED_X = [-0.3, -0.18, -0.06, 0.06]
const LED_IDLE = 0.04
const LED_ON = 1.5
const POWER_IDLE = 0.7

function LedBody({ x, y, material }: { x: number; y: number; material: THREE.Material }) {
  return (
    <group position={[x, y, 0]}>
      <mesh position={[0, 0, 0.012]} material={mat.cream}>
        <boxGeometry args={[0.07, 0.05, 0.024]} />
      </mesh>
      <mesh position={[0, 0, 0.026]} rotation={[Math.PI / 2, 0, 0]} material={material}>
        <sphereGeometry args={[0.03, 16, 10, 0, Math.PI * 2, 0, Math.PI / 2]} />
      </mesh>
    </group>
  )
}

/** Brightness of LED `i` at `dt` seconds into a sequence. */
function sequenceLevel(i: number, dt: number, animate: boolean) {
  if (!animate) {
    // Reduced motion: no flashing — one slow, gentle glow that fades back out.
    const p = Math.sin((dt / LED_SEQUENCE_SECONDS) * Math.PI * 2 - Math.PI / 2) * 0.5 + 0.5
    return LED_IDLE + p * LED_ON * 0.8
  }
  const tail = 0.7
  if (dt > LED_SEQUENCE_SECONDS - tail) {
    // finish with two blinks of all LEDs
    return Math.sin(((dt - (LED_SEQUENCE_SECONDS - tail)) / tail) * Math.PI * 4) > 0 ? LED_ON : LED_IDLE
  }
  // bouncing scanner
  const pos = (dt * 6) % 6
  const head = pos < 3 ? pos : 6 - pos
  return LED_IDLE + Math.max(0, 1 - Math.abs(head - i)) * LED_ON
}

export function CircuitBoard({ ledTrigger, animate }: { ledTrigger: number; animate: boolean }) {
  const leds = useMemo(() => LED_X.map(() => makeLedMaterial('#f0b56c', LED_IDLE)), [])
  const power = useMemo(() => makeLedMaterial('#d9705a', POWER_IDLE), [])
  const seen = useRef(ledTrigger)
  const start = useRef<number | null>(null)

  useFrame(({ clock }) => {
    const t = clock.elapsedTime
    if (seen.current !== ledTrigger) {
      seen.current = ledTrigger
      start.current = t // restart cleanly — never two sequences at once
    }
    let dt = start.current === null ? Infinity : t - start.current
    if (dt >= LED_SEQUENCE_SECONDS) {
      start.current = null // sequence finished → back to idle
      dt = Infinity
    }
    leds.forEach((m, i) => {
      m.emissiveIntensity = dt === Infinity ? LED_IDLE : sequenceLevel(i, dt, animate)
    })
    power.emissiveIntensity = POWER_IDLE
  })

  return (
    <group rotation={[-Math.PI / 2, 0, 0]} scale={SCALE}>
      <RoundedBox args={[1, 0.66, 0.05]} radius={0.03} smoothness={2} position={[0, 0, -0.025]} material={mat.pcb} />
      <Chip position={[0.14, 0.05]} size={0.22} pins={6} />
      <Header position={[0, 0.27]} count={10} />
      <Capacitor position={[-0.36, 0.1]} radius={0.045} height={0.1} />
      <Smd position={[0.36, 0.12]} rotation={Math.PI / 2} />
      <Smd position={[0.36, -0.02]} rotation={Math.PI / 2} />
      <Trace points={[[0.02, 0.05], [-0.12, 0.05], [-0.18, -0.01], [-0.18, -0.16]]} />
      <Trace points={[[0.14, -0.08], [0.14, -0.16], [0.06, -0.2]]} />
      <Trace points={[[0.26, 0.05], [0.36, 0.05]]} />
      {/* USB connector where the cable plugs in (left edge) */}
      <RoundedBox args={[0.14, 0.12, 0.07]} radius={0.015} position={[-0.47, -0.12, 0.035]} material={mat.alu} />
      {LED_X.map((x, i) => (
        <LedBody key={x} x={x} y={-0.24} material={leds[i]} />
      ))}
      <LedBody x={0.36} y={-0.24} material={power} />
      {/* mounting holes */}
      {[[-0.45, 0.28], [0.45, 0.28], [0.45, -0.28]].map(([x, y]) => (
        <mesh key={`${x}${y}`} position={[x, y, 0.001]} rotation={[Math.PI / 2, 0, 0]} material={mat.gold}>
          <cylinderGeometry args={[0.03, 0.03, 0.004, 16]} />
        </mesh>
      ))}
    </group>
  )
}
