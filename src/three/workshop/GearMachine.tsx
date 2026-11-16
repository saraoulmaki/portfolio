/**
 * A small gear-train model on a wooden stand, with a crank handle.
 * Origin at the centre of the base, on the desk. Modelled in larger
 * "model units" and scaled down.
 *
 * `running` smoothly spins the whole train up or down.
 */
import { useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import { RoundedBox } from '@react-three/drei'
import * as THREE from 'three'
import { mat } from '../materials'
import { Gear } from '../parts'

const SCALE = 0.36
const BASE_SPEED = 0.9

// gear sizes (teeth / outer / root) and meshing positions on the back plate
const big = { teeth: 14, outer: 0.22, root: 0.18 }
const small = { teeth: 8, outer: 0.14, root: 0.1 }
const third = { teeth: 10, outer: 0.165, root: 0.125 }
const P_BIG: [number, number] = [-0.2, 0.38]
const a1 = -0.35
const P_SMALL: [number, number] = [P_BIG[0] + Math.cos(a1) * 0.32, P_BIG[1] + Math.sin(a1) * 0.32]
const a2 = 1.0
const P_THIRD: [number, number] = [P_SMALL[0] + Math.cos(a2) * 0.27, P_SMALL[1] + Math.sin(a2) * 0.27]

export function GearMachine({ running }: { running: boolean }) {
  const drive = useRef(running ? 1 : 0)

  useFrame((_, delta) => {
    drive.current = THREE.MathUtils.damp(drive.current, running ? 1 : 0, 2.5, Math.min(delta, 0.05))
  })

  const w = BASE_SPEED
  return (
    <group scale={SCALE}>
      {/* base */}
      <RoundedBox args={[0.95, 0.06, 0.36]} radius={0.02} smoothness={2} position={[0, 0.03, 0]} material={mat.woodDark} />
      {/* back plate */}
      <RoundedBox args={[0.85, 0.78, 0.04]} radius={0.03} smoothness={2} position={[0, 0.45, -0.1]} material={mat.cream} />
      {/* gears mounted in front of the plate */}
      <group position={[0, 0.06, -0.08]}>
        <Gear {...big} position={P_BIG} material={mat.terracotta} speed={w} drive={drive}>
          {/* crank handle turning with the big gear */}
          <mesh position={[0.13, 0, 0.09]} rotation={[Math.PI / 2, 0, 0]} material={mat.alu}>
            <cylinderGeometry args={[0.012, 0.012, 0.12, 8]} />
          </mesh>
          <mesh position={[0.13, 0, 0.16]} rotation={[Math.PI / 2, 0, 0]} material={mat.slate}>
            <cylinderGeometry args={[0.025, 0.025, 0.06, 12]} />
          </mesh>
        </Gear>
        <Gear
          {...small}
          position={P_SMALL}
          material={mat.sage}
          speed={-w * (big.teeth / small.teeth)}
          phase={Math.PI / small.teeth}
          drive={drive}
        />
        <Gear
          {...third}
          position={P_THIRD}
          material={mat.aluDark}
          speed={w * (big.teeth / third.teeth)}
          phase={0.2}
          drive={drive}
        />
      </group>
    </group>
  )
}
