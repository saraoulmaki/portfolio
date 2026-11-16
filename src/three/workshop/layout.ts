/**
 * Where everything sits in the diorama (units ≈ metres, y = 0 is the floor).
 * Move or resize objects here without touching their components.
 * Desk objects are scaled up a little (stylised proportions) so their
 * details stay readable at hero size.
 */
import * as THREE from 'three'

type V3 = [number, number, number]

export const ROOM = { w: 2.3, d: 1.75, h: 1.35, wall: 0.07 }

const BACK = -ROOM.d / 2 + ROOM.wall // inner face of the back wall
const LEFT = -ROOM.w / 2 + ROOM.wall // inner face of the left wall

export const DESK = { x: 0.22, z: BACK + 0.31, w: 1.66, d: 0.6, top: 0.62, thickness: 0.05 }

/** y of the desk's top surface */
const T = DESK.top
const OBJ = 1.35 // desk-object scale

export interface Placement {
  pos: V3
  rotY?: number
  scale?: number
}

export const place = {
  // Placed so the open lid (it leans back ~18°) clears the back wall and the
  // shelf bracket, and the base stays clear of the board's cutting mat.
  laptop: { pos: [-0.36, T, BACK + 0.33], rotY: 0, scale: OBJ },
  board: { pos: [0.18, T + 0.015 * OBJ, BACK + 0.45], rotY: -0.14, scale: OBJ },
  soldering: { pos: [0.5, T, BACK + 0.16], rotY: -0.3, scale: OBJ },
  gears: { pos: [0.82, T, BACK + 0.3], rotY: -0.45, scale: OBJ },
  shelf: { pos: [-0.28, 1.03, BACK + 0.12] },
  frame: { pos: [0.72, 1.02, BACK + 0.012] },
  pegboard: { pos: [LEFT + 0.012, 0.84, -0.12] },
  stool: { pos: [0.28, 0, 0.12], scale: 0.85 },
} satisfies Record<string, Placement>

/** Convert a point in an object's local space to diorama space (used for the cable). */
export function toDiorama(p: Placement, local: V3): THREE.Vector3 {
  return new THREE.Vector3(...local)
    .multiplyScalar(p.scale ?? 1)
    .applyAxisAngle(new THREE.Vector3(0, 1, 0), p.rotY ?? 0)
    .add(new THREE.Vector3(...p.pos))
}
