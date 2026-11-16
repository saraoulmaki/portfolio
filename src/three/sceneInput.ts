/** Mutable interaction state shared between DOM input handlers and the render loop. */
export interface SceneInput {
  dragging: boolean
  /** target rotation (radians) */
  rotX: number
  rotY: number
  /** angular velocity (radians / second) for inertia */
  velX: number
  velY: number
  /** performance.now() of the last user rotation — idle sway resumes after a pause */
  lastInteraction: number
}

/** Resting view: looking into the open corner of the diorama. */
export const REST_TILT = 0.38
export const REST_TURN = -0.5

export const createSceneInput = (): SceneInput => ({
  dragging: false,
  rotX: REST_TILT,
  rotY: REST_TURN,
  velX: 0,
  velY: 0,
  lastInteraction: -Infinity,
})
