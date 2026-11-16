/**
 * Soldering station + iron in its holder + a solder spool.
 * Origin at the centre of the footprint, on the desk.
 */
import { useMemo } from 'react'
import { RoundedBox } from '@react-three/drei'
import * as THREE from 'three'
import { mat } from '../materials'

const HOLDER_ANGLE = 0.75 // tilt of the iron holder, radians from vertical

export function SolderingStation() {
  const tipGlow = useMemo(
    () =>
      new THREE.MeshStandardMaterial({
        color: '#a7684f',
        emissive: new THREE.Color('#c0603a'),
        emissiveIntensity: 0.35,
        metalness: 0.3,
        roughness: 0.5,
      }),
    [],
  )
  const display = useMemo(
    () => new THREE.MeshBasicMaterial({ color: '#b9c9a4', toneMapped: false }),
    [],
  )

  // Iron cord from the back of the unit to the iron handle.
  const cord = useMemo(() => {
    const curve = new THREE.CatmullRomCurve3([
      new THREE.Vector3(-0.04, 0.03, -0.05),
      new THREE.Vector3(-0.02, 0.005, -0.12),
      new THREE.Vector3(0.1, 0.004, -0.1),
      new THREE.Vector3(0.15, 0.03, -0.04),
      new THREE.Vector3(0.155, 0.085, -0.02),
    ])
    return new THREE.TubeGeometry(curve, 32, 0.0045, 6, false)
  }, [])

  return (
    <group>
      {/* control unit */}
      <RoundedBox args={[0.15, 0.075, 0.11]} radius={0.012} smoothness={2} position={[-0.05, 0.0375, 0]} material={mat.slate} />
      <mesh position={[-0.075, 0.048, 0.0555]} material={display}>
        <planeGeometry args={[0.05, 0.022]} />
      </mesh>
      <group position={[-0.01, 0.036, 0.062]} rotation={[Math.PI / 2, 0, 0]}>
        <mesh material={mat.terracotta}>
          <cylinderGeometry args={[0.016, 0.018, 0.016, 20]} />
        </mesh>
      </group>
      <mesh geometry={cord} material={mat.rubber} />

      {/* holder: weighted base + open spring cone */}
      <group position={[0.12, 0, 0.0]}>
        <mesh position={[0, 0.008, 0]} material={mat.slate}>
          <cylinderGeometry args={[0.045, 0.05, 0.016, 24]} />
        </mesh>
        <mesh position={[0, 0.02, 0.025]} material={mat.paper}>
          <cylinderGeometry args={[0.02, 0.02, 0.012, 16]} />
        </mesh>
        <group position={[0, 0.02, -0.012]} rotation={[0, 0, -HOLDER_ANGLE]}>
          <mesh position={[0, 0.05, 0]} material={mat.alu}>
            <cylinderGeometry args={[0.022, 0.012, 0.09, 12, 1, true]} />
          </mesh>
          {/* the iron, resting in the holder */}
          <group position={[0, 0.06, 0]}>
            <mesh position={[0, 0.05, 0]} material={mat.sage}>
              <cylinderGeometry args={[0.012, 0.01, 0.1, 14]} />
            </mesh>
            <mesh position={[0, 0.02, 0]} material={mat.rubber}>
              <cylinderGeometry args={[0.0135, 0.0135, 0.04, 14]} />
            </mesh>
            <mesh position={[0, -0.04, 0]} material={mat.alu}>
              <cylinderGeometry args={[0.005, 0.005, 0.08, 10]} />
            </mesh>
            <mesh position={[0, -0.09, 0]} rotation={[Math.PI, 0, 0]} material={tipGlow}>
              <coneGeometry args={[0.005, 0.022, 10]} />
            </mesh>
          </group>
        </group>
      </group>

      {/* solder spool */}
      <group position={[-0.03, 0.022, 0.12]} rotation={[0, 0.4, Math.PI / 2]}>
        <mesh material={mat.solder}>
          <cylinderGeometry args={[0.02, 0.02, 0.03, 20]} />
        </mesh>
        <mesh position={[0, 0.017, 0]} material={mat.terracotta}>
          <cylinderGeometry args={[0.026, 0.026, 0.004, 20]} />
        </mesh>
        <mesh position={[0, -0.017, 0]} material={mat.terracotta}>
          <cylinderGeometry args={[0.026, 0.026, 0.004, 20]} />
        </mesh>
      </group>
    </group>
  )
}
