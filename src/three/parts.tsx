/**
 * Small reusable parts built from primitives. Flat parts (chips, traces…)
 * are modelled in a local XY plane facing +Z (z = 0 is the board surface);
 * rotate the parent group to lay them flat.
 */
import { useMemo, useRef, type ReactNode, type RefObject } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'
import { mat } from './materials'

type V2 = [number, number]
type V3 = [number, number, number]

/* ---------------- IC chip with gull-wing pins ---------------- */
export function Chip({
  position = [0, 0],
  size = 0.3,
  pins = 6,
  height = 0.05,
}: {
  position?: V2
  size?: number
  pins?: number
  height?: number
}) {
  const pinGeo = useMemo(() => new THREE.BoxGeometry(0.022, 0.06, 0.014), [])
  const pinList = useMemo(() => {
    const out: { p: V3; r: number }[] = []
    const step = (size * 0.8) / (pins - 1)
    for (let side = 0; side < 4; side++) {
      for (let i = 0; i < pins; i++) {
        const t = -size * 0.4 + i * step
        const o = size / 2 + 0.022
        const pos: V3 =
          side === 0 ? [t, o, 0.008] : side === 1 ? [t, -o, 0.008] : side === 2 ? [o, t, 0.008] : [-o, t, 0.008]
        out.push({ p: pos, r: side < 2 ? 0 : Math.PI / 2 })
      }
    }
    return out
  }, [size, pins])

  return (
    <group position={[position[0], position[1], 0]}>
      <mesh position={[0, 0, height / 2]} material={mat.chip}>
        <boxGeometry args={[size, size, height]} />
      </mesh>
      <mesh position={[-size * 0.32, size * 0.32, height + 0.001]} rotation={[Math.PI / 2, 0, 0]} material={mat.aluDark}>
        <cylinderGeometry args={[0.018, 0.018, 0.004, 12]} />
      </mesh>
      {pinList.map(({ p, r }, i) => (
        <mesh key={i} geometry={pinGeo} position={p} rotation={[0, 0, r]} material={mat.alu} />
      ))}
    </group>
  )
}

/* ---------------- Copper trace (polyline of thin boxes) ---------------- */
export function Trace({ points, width = 0.018 }: { points: V2[]; width?: number }) {
  const segments = useMemo(() => {
    const segs: { pos: V3; len: number; angle: number }[] = []
    for (let i = 0; i < points.length - 1; i++) {
      const [x1, y1] = points[i]
      const [x2, y2] = points[i + 1]
      const len = Math.hypot(x2 - x1, y2 - y1)
      segs.push({ pos: [(x1 + x2) / 2, (y1 + y2) / 2, 0.004], len: len + width, angle: Math.atan2(y2 - y1, x2 - x1) })
    }
    return segs
  }, [points, width])
  const end = points[points.length - 1]

  return (
    <group>
      {segments.map((s, i) => (
        <mesh key={i} position={s.pos} rotation={[0, 0, s.angle]} material={mat.copper}>
          <boxGeometry args={[s.len, width, 0.006]} />
        </mesh>
      ))}
      <mesh position={[end[0], end[1], 0.005]} rotation={[Math.PI / 2, 0, 0]} material={mat.gold}>
        <cylinderGeometry args={[0.03, 0.03, 0.01, 14]} />
      </mesh>
    </group>
  )
}

/* ---------------- Header pin row ---------------- */
export function Header({ position = [0, 0], count = 6, rotation = 0 }: { position?: V2; count?: number; rotation?: number }) {
  const pitch = 0.07
  const width = count * pitch
  return (
    <group position={[position[0], position[1], 0]} rotation={[0, 0, rotation]}>
      <mesh position={[0, 0, 0.025]} material={mat.rubber}>
        <boxGeometry args={[width, 0.07, 0.05]} />
      </mesh>
      {Array.from({ length: count }, (_, i) => (
        <mesh key={i} position={[-width / 2 + pitch / 2 + i * pitch, 0, 0.08]} material={mat.gold}>
          <boxGeometry args={[0.018, 0.018, 0.1]} />
        </mesh>
      ))}
    </group>
  )
}

/* ---------------- SMD passive (resistor / capacitor) ---------------- */
export function Smd({ position, rotation = 0 }: { position: V2; rotation?: number }) {
  return (
    <group position={[position[0], position[1], 0.012]} rotation={[0, 0, rotation]}>
      <mesh material={mat.cream}>
        <boxGeometry args={[0.06, 0.03, 0.022]} />
      </mesh>
      <mesh position={[0.034, 0, 0]} material={mat.alu}>
        <boxGeometry args={[0.012, 0.032, 0.024]} />
      </mesh>
      <mesh position={[-0.034, 0, 0]} material={mat.alu}>
        <boxGeometry args={[0.012, 0.032, 0.024]} />
      </mesh>
    </group>
  )
}

/* ---------------- Electrolytic capacitor ---------------- */
export function Capacitor({ position, radius = 0.05, height = 0.12 }: { position: V2; radius?: number; height?: number }) {
  return (
    <group position={[position[0], position[1], height / 2]} rotation={[Math.PI / 2, 0, 0]}>
      <mesh material={mat.slateDark}>
        <cylinderGeometry args={[radius, radius, height, 20]} />
      </mesh>
      <mesh position={[0, height / 2 + 0.002, 0]} material={mat.alu}>
        <cylinderGeometry args={[radius * 0.92, radius * 0.92, 0.006, 20]} />
      </mesh>
    </group>
  )
}

/* ---------------- Gear (extruded shape, rotates about local Z) ---------------- */
function gearShape(teeth: number, outer: number, root: number, hole: number) {
  const shape = new THREE.Shape()
  const step = (Math.PI * 2) / teeth
  for (let i = 0; i < teeth; i++) {
    const a = i * step
    const pts: [number, number][] = [
      [root, a],
      [outer, a + step * 0.18],
      [outer, a + step * 0.48],
      [root, a + step * 0.66],
    ]
    pts.forEach(([r, ang], j) => {
      const x = Math.cos(ang) * r
      const y = Math.sin(ang) * r
      if (i === 0 && j === 0) shape.moveTo(x, y)
      else shape.lineTo(x, y)
    })
  }
  shape.closePath()
  const holePath = new THREE.Path()
  holePath.absarc(0, 0, hole, 0, Math.PI * 2, true)
  shape.holes.push(holePath)
  return shape
}

export function Gear({
  teeth,
  outer,
  root,
  depth = 0.05,
  material,
  speed,
  drive,
  phase = 0,
  position = [0, 0],
  children,
}: {
  teeth: number
  outer: number
  root: number
  depth?: number
  material: THREE.Material
  /** radians / second at full drive */
  speed: number
  /** 0..1 multiplier shared by a gear train so it starts/stops together */
  drive: RefObject<number>
  phase?: number
  position?: V2
  /** extra parts that turn with the gear (e.g. a crank handle) */
  children?: ReactNode
}) {
  const ref = useRef<THREE.Group>(null)
  const geometry = useMemo(
    () =>
      new THREE.ExtrudeGeometry(gearShape(teeth, outer, root, root * 0.28), {
        depth,
        bevelEnabled: true,
        bevelSize: 0.006,
        bevelThickness: 0.006,
        bevelSegments: 1,
        curveSegments: 6,
      }),
    [teeth, outer, root, depth],
  )

  useFrame((_, delta) => {
    if (ref.current) ref.current.rotation.z += speed * drive.current * Math.min(delta, 0.05)
  })

  return (
    <group position={[position[0], position[1], 0.02]}>
      <group ref={ref} rotation={[0, 0, phase]}>
        <mesh geometry={geometry} material={material} />
        {children}
      </group>
      <mesh position={[0, 0, depth / 2]} rotation={[Math.PI / 2, 0, 0]} material={mat.alu}>
        <cylinderGeometry args={[root * 0.2, root * 0.2, depth + 0.06, 16]} />
      </mesh>
    </group>
  )
}
