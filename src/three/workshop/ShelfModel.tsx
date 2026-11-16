/**
 * Things on the wall shelf: a miniature house model (the kind of kit build
 * the Playground section is about), a few books and a small plant.
 * Each export has its origin on the shelf surface.
 */
import { useMemo } from 'react'
import * as THREE from 'three'
import { mat } from '../materials'

const leaf = new THREE.MeshStandardMaterial({ color: '#7f9070', roughness: 0.85 })
const pot = new THREE.MeshStandardMaterial({ color: '#b87961', roughness: 0.85 })
const windowMat = new THREE.MeshStandardMaterial({ color: '#a9b7bd', roughness: 0.4, metalness: 0 })

export function MiniHouse() {
  const roof = useMemo(() => {
    const s = new THREE.Shape()
    s.moveTo(-0.07, 0)
    s.lineTo(0.07, 0)
    s.lineTo(0, 0.055)
    s.closePath()
    const g = new THREE.ExtrudeGeometry(s, { depth: 0.1, bevelEnabled: false })
    g.translate(0, 0, -0.05)
    return g
  }, [])

  return (
    <group>
      {/* display base */}
      <mesh position={[0, 0.008, 0]} material={mat.woodDark}>
        <boxGeometry args={[0.2, 0.016, 0.15]} />
      </mesh>
      <mesh position={[0, 0.0165, 0]} material={mat.rug}>
        <boxGeometry args={[0.18, 0.002, 0.13]} />
      </mesh>
      {/* house */}
      <mesh position={[-0.02, 0.054, -0.01]} material={mat.paper}>
        <boxGeometry args={[0.11, 0.075, 0.085]} />
      </mesh>
      <mesh geometry={roof} position={[-0.02, 0.0915, -0.01]} material={mat.terracotta} />
      <mesh position={[-0.045, 0.06, 0.0335]} material={windowMat}>
        <planeGeometry args={[0.022, 0.022]} />
      </mesh>
      <mesh position={[0.008, 0.046, 0.0335]} material={mat.woodDark}>
        <planeGeometry args={[0.022, 0.04]} />
      </mesh>
      {/* tiny tree */}
      <mesh position={[0.065, 0.03, 0.03]} material={mat.woodDark}>
        <cylinderGeometry args={[0.004, 0.004, 0.03, 6]} />
      </mesh>
      <mesh position={[0.065, 0.06, 0.03]} material={leaf}>
        <coneGeometry args={[0.02, 0.05, 8]} />
      </mesh>
    </group>
  )
}

export function Books() {
  const books: { w: number; h: number; m: THREE.Material; tilt?: number }[] = [
    { w: 0.03, h: 0.2, m: mat.sage },
    { w: 0.025, h: 0.17, m: mat.cream },
    { w: 0.035, h: 0.19, m: mat.slateDark },
    { w: 0.028, h: 0.16, m: mat.terracotta, tilt: -0.3 },
  ]
  let x = 0
  return (
    <group>
      {books.map((b, i) => {
        const cx = x + b.w / 2
        x += b.w + 0.004 + (b.tilt ? 0.03 : 0)
        return (
          <mesh
            key={i}
            position={[cx + (b.tilt ? 0.025 : 0), b.h / 2 - (b.tilt ? 0.012 : 0), 0]}
            rotation={[0, 0, b.tilt ?? 0]}
            material={b.m}
          >
            <boxGeometry args={[b.w, b.h, 0.14]} />
          </mesh>
        )
      })}
    </group>
  )
}

export function Plant() {
  return (
    <group>
      <mesh position={[0, 0.035, 0]} material={pot}>
        <cylinderGeometry args={[0.04, 0.03, 0.07, 16]} />
      </mesh>
      {[0, 1.3, 2.6, 3.9, 5.2].map((a, i) => (
        <mesh
          key={a}
          position={[Math.cos(a) * 0.02, 0.09 + (i % 2) * 0.015, Math.sin(a) * 0.02]}
          rotation={[Math.sin(a) * 0.5, 0, -Math.cos(a) * 0.5]}
          material={leaf}
        >
          <sphereGeometry args={[0.028, 8, 6]} />
        </mesh>
      ))}
    </group>
  )
}
