/**
 * The miniature maker workshop — assembles the room and the interactive
 * objects, and turns the whole diorama in response to drag input.
 *
 * To swap an object later, replace its component in the JSX below and
 * adjust its entry in ./layout.ts.
 */
import { useLayoutEffect, useMemo, useRef, type ReactNode, type RefObject } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'
import { REST_TILT, REST_TURN, type SceneInput } from '../sceneInput'
import { mat } from '../materials'
import { CircuitBoard } from './CircuitBoard'
import { GearMachine } from './GearMachine'
import { Interactive, type WorkshopObjectId } from './Interactive'
import { Laptop } from './Laptop'
import { DESK, place, toDiorama, type Placement } from './layout'
import { Room } from './Room'
import { SolderingStation } from './SolderingStation'

export interface WorkshopState {
  screenOn: boolean
  ledTrigger: number
  gearsOn: boolean
  highlight: WorkshopObjectId | null
}

interface Props extends WorkshopState {
  input: RefObject<SceneInput>
  animate: boolean
  dark: boolean
  onActivate: (id: WorkshopObjectId) => void
}

function Placed({ at, children }: { at: Placement; children: ReactNode }) {
  return (
    <group position={at.pos} rotation={[0, at.rotY ?? 0, 0]} scale={at.scale ?? 1}>
      {children}
    </group>
  )
}
const TURN_RANGE = 1.05 // ≈ ±60° around the resting view
const IDLE_DELAY = 2500 // ms after the last drag before the view drifts home

/** USB cable from the laptop's side port to the board's connector, resting on the desk. */
function Cable() {
  const geometry = useMemo(() => {
    const T = DESK.top
    // ports in each object's local space (see Laptop.tsx / CircuitBoard.tsx)
    const from = toDiorama(place.laptop, [0.185, 0.009, 0.02])
    const to = toDiorama(place.board, [-0.17, 0.008, 0.036])
    const mid1 = from.clone().lerp(to, 0.3).setY(T + 0.006)
    const mid2 = from.clone().lerp(to, 0.7).setY(T + 0.006)
    mid1.z += 0.05
    mid2.x -= 0.04
    const curve = new THREE.CatmullRomCurve3([from, mid1, mid2, to])
    return new THREE.TubeGeometry(curve, 40, 0.008, 6, false)
  }, [])
  return <mesh geometry={geometry} material={mat.rubber} />
}

export function Workshop({ input, animate, dark, screenOn, ledTrigger, gearsOn, highlight, onActivate }: Props) {
  const root = useRef<THREE.Group>(null)

  // Every opaque mesh casts and receives soft shadows.
  useLayoutEffect(() => {
    root.current?.traverse((o) => {
      if ((o as THREE.Mesh).isMesh) {
        const m = o as THREE.Mesh
        const transparent = (m.material as THREE.Material).transparent
        m.castShadow = !transparent
        m.receiveShadow = !transparent
      }
    })
  }, [])

  useFrame((state, rawDelta) => {
    const g = root.current
    const i = input.current
    if (!g || !i) return
    const delta = Math.min(rawDelta, 1 / 20)

    if (!i.dragging) {
      i.rotY += i.velY * delta
      i.rotX += i.velX * delta
      const decay = Math.exp(-delta * 3.2)
      i.velY *= decay
      i.velX *= decay

      if (performance.now() - i.lastInteraction > IDLE_DELAY) {
        const sway = animate ? Math.sin(state.clock.elapsedTime * 0.35) * 0.22 : 0
        i.rotY = THREE.MathUtils.damp(i.rotY, REST_TURN + sway, 0.8, delta)
        i.rotX = THREE.MathUtils.damp(i.rotX, REST_TILT, 0.8, delta)
      }
    }
    // Keep the open side of the diorama towards the viewer: the turn is
    // limited with an elastic edge, and we never look from below the floor.
    const min = REST_TURN - TURN_RANGE
    const max = REST_TURN + TURN_RANGE
    if (i.rotY < min || i.rotY > max) {
      const edge = i.rotY < min ? min : max
      i.velY *= 0.5
      i.rotY = i.dragging
        ? edge + (i.rotY - edge) * 0.35 // resistance while dragging past the edge
        : THREE.MathUtils.damp(i.rotY, edge, 8, delta)
    }
    i.rotX = THREE.MathUtils.clamp(i.rotX, 0.05, 1.05)

    g.rotation.x = THREE.MathUtils.damp(g.rotation.x, i.rotX, 9, delta)
    g.rotation.y = THREE.MathUtils.damp(g.rotation.y, i.rotY, 9, delta)
  })

  const p = place
  return (
    <group ref={root} rotation={[REST_TILT, REST_TURN, 0]}>
      {/* pivot around the middle of the room, not the floor */}
      <group position={[0, -0.55, 0.05]}>
        <Room dark={dark} />

        <Placed at={p.laptop}>
          <Interactive id="laptop" highlighted={highlight === 'laptop'} onActivate={onActivate} ringRadius={0.26}>
            <Laptop screenOn={screenOn} animate={animate} />
          </Interactive>
        </Placed>

        <Placed at={p.board}>
          <Interactive id="board" highlighted={highlight === 'board'} onActivate={onActivate} ringRadius={0.22}>
            <CircuitBoard ledTrigger={ledTrigger} animate={animate} />
          </Interactive>
        </Placed>

        <Placed at={p.soldering}>
          <SolderingStation />
        </Placed>

        <Placed at={p.gears}>
          <Interactive id="gears" highlighted={highlight === 'gears'} onActivate={onActivate} ringRadius={0.22}>
            <GearMachine running={gearsOn} />
          </Interactive>
        </Placed>

        <Cable />
      </group>
    </group>
  )
}
