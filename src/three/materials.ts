import * as THREE from 'three'

/**
 * Shared materials — created once and reused by every mesh to keep the
 * scene light (few shader programs, no image textures).
 *
 * Palette (warm, natural, slightly muted):
 *   cream wall  #F3EDE3 · light wood #E9D7C0 · sage #8C9A7B
 *   terracotta  #B87961 · slate      #555B60
 * Surfaces are mostly matte; metals are kept soft so nothing looks
 * glossy or "lab-like".
 */
const std = (color: string, metalness = 0, roughness = 0.75, extra: THREE.MeshStandardMaterialParameters = {}) =>
  new THREE.MeshStandardMaterial({ color, metalness, roughness, ...extra })

export const mat = {
  // room
  wall: std('#f3ede3', 0, 0.95, { emissive: new THREE.Color('#f3e6d3'), emissiveIntensity: 0.08 }),
  floor: std('#e2ccb0', 0, 0.85),
  plinth: std('#4a433d', 0, 0.8),
  wood: std('#e9d7c0', 0, 0.78),
  woodDark: std('#bfa384', 0, 0.8),
  skirting: std('#d9c3a5', 0, 0.8),
  pegboard: std('#8c9a7b', 0, 0.85),
  pegboardHole: std('#6e7b60', 0, 0.9),
  rug: std('#d8cfbf', 0, 1),

  // accents
  sage: std('#8c9a7b', 0, 0.7),
  terracotta: std('#b87961', 0, 0.7),
  ochre: std('#c9a35f', 0, 0.7),

  // neutrals
  slate: std('#555b60', 0.15, 0.6),
  slateLight: std('#727a80', 0.1, 0.6),
  slateDark: std('#3d4246', 0.1, 0.7),
  alu: std('#bdbab4', 0.45, 0.45),
  aluDark: std('#8a8b8c', 0.4, 0.5),
  rubber: std('#2f3134', 0, 0.85),
  cream: std('#efe6d8', 0, 0.8),
  paper: std('#fbf6ec', 0, 0.9),

  // electronics
  pcb: std('#4e6b4f', 0.05, 0.55), // muted green solder mask
  chip: std('#2c2e31', 0.15, 0.5),
  chipTop: std('#3a3c40', 0.1, 0.6),
  copper: std('#b98a5e', 0.55, 0.45),
  gold: std('#cdb07a', 0.6, 0.4),
  solder: std('#b7b9bb', 0.6, 0.4),
}

/** LEDs get their own material so each can light independently. */
export const makeLedMaterial = (color: string, intensity = 0.15) =>
  new THREE.MeshStandardMaterial({
    color,
    emissive: new THREE.Color(color),
    emissiveIntensity: intensity,
    roughness: 0.35,
    toneMapped: false,
  })
