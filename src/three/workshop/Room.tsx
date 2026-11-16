/**
 * Static parts of the diorama: plinth, floor, two walls, desk, wall shelf,
 * framed sketch, pegboard with tools, stool and rug.
 */
import { useEffect, useMemo } from 'react'
import { RoundedBox } from '@react-three/drei'
import * as THREE from 'three'
import { mat } from '../materials'
import { DESK, ROOM, place } from './layout'
import { Books, MiniHouse, Plant } from './ShelfModel'

const { w: W, d: D, h: H, wall: WT } = ROOM

/* ---------------- shell ---------------- */
function Shell({ dark }: { dark: boolean }) {
  // Slightly dim the walls in dark mode so the diorama doesn't glare.
  useEffect(() => {
    mat.wall.color.set(dark ? '#e3dbcd' : '#f3ede3')
    mat.wall.emissiveIntensity = dark ? 0.04 : 0.08
    mat.floor.color.set(dark ? '#d6bf9f' : '#e2ccb0')
  }, [dark])

  return (
    <group>
      {/* plinth the diorama sits on */}
      <RoundedBox args={[W + 0.14, 0.2, D + 0.14]} radius={0.05} smoothness={3} position={[0, -0.13, 0]} material={mat.plinth} />
      <mesh position={[0, -0.02, 0]} material={mat.floor}>
        <boxGeometry args={[W, 0.04, D]} />
      </mesh>
      {/* floor boards */}
      {Array.from({ length: 7 }, (_, i) => (
        <mesh key={i} position={[-W / 2 + (i + 1) * (W / 8), 0.0005, 0]} material={mat.woodDark}>
          <boxGeometry args={[0.006, 0.001, D]} />
        </mesh>
      ))}
      {/* back wall + left wall */}
      <mesh position={[0, H / 2, -D / 2 + WT / 2]} material={mat.wall}>
        <boxGeometry args={[W, H, WT]} />
      </mesh>
      <mesh position={[-W / 2 + WT / 2, H / 2, WT / 2]} material={mat.wall}>
        <boxGeometry args={[WT, H, D - WT]} />
      </mesh>
      {/* wooden skirting */}
      <mesh position={[WT / 2, 0.04, -D / 2 + WT + 0.006]} material={mat.skirting}>
        <boxGeometry args={[W - WT, 0.08, 0.012]} />
      </mesh>
      <mesh position={[-W / 2 + WT + 0.006, 0.04, WT / 2 + 0.006]} material={mat.skirting}>
        <boxGeometry args={[0.012, 0.08, D - WT - 0.012]} />
      </mesh>
    </group>
  )
}

/* ---------------- desk ---------------- */
function Desk() {
  const { x, z, w, d, top, thickness } = DESK
  const legH = top - thickness
  const legs: [number, number][] = [
    [-w / 2 + 0.06, -d / 2 + 0.06],
    [w / 2 - 0.06, -d / 2 + 0.06],
    [-w / 2 + 0.06, d / 2 - 0.06],
    [w / 2 - 0.06, d / 2 - 0.06],
  ]
  return (
    <group position={[x, 0, z]}>
      <RoundedBox args={[w, thickness, d]} radius={0.015} smoothness={2} position={[0, top - thickness / 2, 0]} material={mat.wood} />
      {legs.map(([lx, lz]) => (
        <mesh key={`${lx}${lz}`} position={[lx, legH / 2, lz]} material={mat.slate}>
          <boxGeometry args={[0.05, legH, 0.05]} />
        </mesh>
      ))}
      {/* stretcher bar */}
      <mesh position={[0, 0.16, -d / 2 + 0.06]} material={mat.slate}>
        <boxGeometry args={[w - 0.12, 0.04, 0.03]} />
      </mesh>
      {/* cutting mat under the board */}
      <mesh position={[place.board.pos[0] - x, top + 0.002, place.board.pos[2] - z + 0.02]} rotation={[0, place.board.rotY, 0]} material={mat.slateDark}>
        <boxGeometry args={[0.56, 0.004, 0.36]} />
      </mesh>
    </group>
  )
}

/* ---------------- shelf ---------------- */
function Shelf() {
  return (
    <group position={place.shelf.pos}>
      <RoundedBox args={[0.92, 0.03, 0.22]} radius={0.008} smoothness={2} material={mat.wood} />
      {[-0.34, 0.34].map((bx) => (
        <mesh key={bx} position={[bx, -0.06, -0.08]} material={mat.slate}>
          <boxGeometry args={[0.025, 0.1, 0.06]} />
        </mesh>
      ))}
      <group position={[-0.25, 0.015, 0.0]} scale={1.25}>
        <MiniHouse />
      </group>
      <group position={[0.02, 0.015, -0.01]}>
        <Books />
      </group>
      <group position={[0.33, 0.015, 0.0]}>
        <Plant />
      </group>
    </group>
  )
}

/* ---------------- framed sketch ---------------- */
function drawSketch() {
  const c = document.createElement('canvas')
  c.width = 256
  c.height = 192
  const g = c.getContext('2d')!
  g.fillStyle = '#fbf6ec'
  g.fillRect(0, 0, 256, 192)
  g.strokeStyle = '#555b60'
  g.lineWidth = 3
  g.lineCap = 'round'
  // a hand-drawn gear + arrows, like a page from a notebook
  g.beginPath()
  for (let i = 0; i <= 48; i++) {
    const a = (i / 48) * Math.PI * 2
    const r = 42 + (Math.floor(i / 2) % 2 ? 8 : 0)
    g.lineTo(96 + Math.cos(a) * r, 96 + Math.sin(a) * r)
  }
  g.stroke()
  g.beginPath()
  g.arc(96, 96, 14, 0, Math.PI * 2)
  g.stroke()
  g.strokeStyle = '#b87961'
  g.beginPath()
  g.moveTo(160, 60)
  g.quadraticCurveTo(200, 70, 210, 120)
  g.lineTo(200, 108)
  g.moveTo(210, 120)
  g.lineTo(218, 106)
  g.stroke()
  g.strokeStyle = 'rgba(24,24,27,0.45)'
  g.lineWidth = 2
  ;[150, 162].forEach((y) => {
    g.beginPath()
    g.moveTo(150, y)
    g.lineTo(230, y)
    g.stroke()
  })
  const t = new THREE.CanvasTexture(c)
  t.colorSpace = THREE.SRGBColorSpace
  return t
}

function Frame() {
  const texture = useMemo(() => drawSketch(), [])
  const paper = useMemo(() => new THREE.MeshStandardMaterial({ map: texture, roughness: 0.9 }), [texture])
  return (
    <group position={place.frame.pos}>
      <mesh material={mat.slate}>
        <boxGeometry args={[0.46, 0.36, 0.02]} />
      </mesh>
      <mesh position={[0, 0, 0.0105]} material={paper}>
        <planeGeometry args={[0.4, 0.3]} />
      </mesh>
    </group>
  )
}

/* ---------------- pegboard with hand tools ---------------- */
function Pegboard() {
  const holes = useMemo(() => {
    const h: [number, number][] = []
    for (let y = -0.24; y <= 0.24; y += 0.08) for (let z = -0.44; z <= 0.44; z += 0.08) h.push([y, z])
    return h
  }, [])
  return (
    <group position={place.pegboard.pos} rotation={[0, Math.PI / 2, 0]} scale={0.85}>
      <RoundedBox args={[1.0, 0.58, 0.02]} radius={0.012} smoothness={2} material={mat.pegboard} />
      {holes.map(([y, z]) => (
        <mesh key={`${y}${z}`} position={[z, y, 0.0105]} material={mat.pegboardHole}>
          <circleGeometry args={[0.007, 8]} />
        </mesh>
      ))}
      {/* screwdriver */}
      <group position={[-0.28, 0.02, 0.03]}>
        <mesh position={[0, 0.06, 0]} material={mat.ochre}>
          <cylinderGeometry args={[0.016, 0.014, 0.09, 12]} />
        </mesh>
        <mesh position={[0, -0.05, 0]} material={mat.alu}>
          <cylinderGeometry args={[0.004, 0.004, 0.14, 8]} />
        </mesh>
      </group>
      {/* pliers */}
      <group position={[-0.08, 0.0, 0.03]}>
        {[-1, 1].map((s) => (
          <group key={s} rotation={[0, 0, s * 0.12]}>
            <mesh position={[0, -0.05, 0]} material={mat.terracotta}>
              <boxGeometry args={[0.018, 0.11, 0.012]} />
            </mesh>
            <mesh position={[0, 0.05, 0]} material={mat.aluDark}>
              <boxGeometry args={[0.012, 0.08, 0.012]} />
            </mesh>
          </group>
        ))}
      </group>
      {/* coil of wire */}
      <group position={[0.15, 0.04, 0.03]}>
        <mesh material={mat.copper}>
          <torusGeometry args={[0.06, 0.012, 8, 28]} />
        </mesh>
        <mesh position={[0, 0.07, -0.01]} rotation={[Math.PI / 2, 0, 0]} material={mat.alu}>
          <cylinderGeometry args={[0.005, 0.005, 0.04, 6]} />
        </mesh>
      </group>
      {/* small multimeter */}
      <group position={[0.36, -0.02, 0.025]}>
        <RoundedBox args={[0.1, 0.16, 0.03]} radius={0.012} smoothness={2} material={mat.ochre} />
        <mesh position={[0, 0.035, 0.016]} material={mat.slate}>
          <planeGeometry args={[0.07, 0.04]} />
        </mesh>
        <mesh position={[0, -0.03, 0.017]} rotation={[Math.PI / 2, 0, 0]} material={mat.slate}>
          <cylinderGeometry args={[0.022, 0.022, 0.008, 16]} />
        </mesh>
      </group>
    </group>
  )
}

/* ---------------- stool + rug ---------------- */
function Stool() {
  const legs = [0, (Math.PI * 2) / 3, (Math.PI * 4) / 3]
  return (
    <group position={place.stool.pos} scale={place.stool.scale}>
      <mesh position={[0, 0.004, 0]} material={mat.rug}>
        <cylinderGeometry args={[0.46, 0.46, 0.008, 40]} />
      </mesh>
      <RoundedBox args={[0.32, 0.05, 0.32]} radius={0.025} smoothness={2} position={[0, 0.5, 0]} material={mat.woodDark} />
      {legs.map((a) => (
        <mesh
          key={a}
          position={[Math.cos(a) * 0.11, 0.24, Math.sin(a) * 0.11]}
          rotation={[Math.sin(a) * 0.12, 0, -Math.cos(a) * 0.12]}
          material={mat.slate}
        >
          <cylinderGeometry args={[0.014, 0.014, 0.5, 8]} />
        </mesh>
      ))}
      <mesh position={[0, 0.18, 0]} rotation={[Math.PI / 2, 0, 0]} material={mat.alu}>
        <torusGeometry args={[0.125, 0.008, 6, 32]} />
      </mesh>
    </group>
  )
}

export function Room({ dark }: { dark: boolean }) {
  return (
    <group>
      <Shell dark={dark} />
      <Desk />
      <Shelf />
      <Frame />
      <Pegboard />
      <Stool />
    </group>
  )
}
