/**
 * Wraps an object in the scene to make it hoverable + clickable.
 * Hover feedback: the object lifts and grows very slightly, a soft ring
 * appears beneath it and the cursor becomes a pointer.
 * Clicks that end a drag (rotation) are ignored.
 */
import { useRef, useState, type ReactNode } from 'react'
import { useFrame, useThree, type ThreeEvent } from '@react-three/fiber'
import * as THREE from 'three'

export type WorkshopObjectId = 'laptop' | 'board' | 'gears'

const ringMaterial = new THREE.MeshBasicMaterial({
  color: '#b87961',
  transparent: true,
  opacity: 0,
  depthWrite: false,
  toneMapped: false,
})

export function Interactive({
  id,
  highlighted,
  onActivate,
  onHoverChange,
  ringRadius = 0.25,
  children,
}: {
  id: WorkshopObjectId
  /** externally highlighted (e.g. the matching button is hovered / focused) */
  highlighted: boolean
  onActivate: (id: WorkshopObjectId) => void
  onHoverChange?: (id: WorkshopObjectId, hovered: boolean) => void
  ringRadius?: number
  children: ReactNode
}) {
  const group = useRef<THREE.Group>(null)
  const ring = useRef<THREE.Mesh>(null)
  const level = useRef(0)
  const [hovered, setHovered] = useState(false)
  const canvas = useThree((s) => s.gl.domElement)
  // one material per instance so rings fade independently
  const [material] = useState(() => ringMaterial.clone())

  useFrame((_, delta) => {
    const target = hovered || highlighted ? 1 : 0
    level.current = THREE.MathUtils.damp(level.current, target, 12, Math.min(delta, 0.05))
    const l = level.current
    if (group.current) {
      group.current.position.y = l * 0.025
      group.current.scale.setScalar(1 + l * 0.035)
    }
    if (ring.current) {
      material.opacity = l * 0.35
      ring.current.visible = l > 0.01
    }
  })

  const setHover = (h: boolean) => {
    setHovered(h)
    canvas.style.cursor = h ? 'pointer' : ''
    onHoverChange?.(id, h)
  }

  return (
    <group>
      <mesh ref={ring} rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.002, 0]} material={material} visible={false}>
        <ringGeometry args={[ringRadius * 0.86, ringRadius, 48]} />
      </mesh>
      <group
        ref={group}
        onPointerOver={(e: ThreeEvent<PointerEvent>) => {
          e.stopPropagation()
          setHover(true)
        }}
        onPointerOut={() => setHover(false)}
        onClick={(e: ThreeEvent<MouseEvent>) => {
          e.stopPropagation()
          if (e.delta > 6) return // that was a drag, not a click
          onActivate(id)
        }}
      >
        {children}
      </group>
    </group>
  )
}
