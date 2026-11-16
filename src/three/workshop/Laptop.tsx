/**
 * Laptop — origin at the centre of its base, on the desk surface.
 * The screen image is drawn once into a CanvasTexture (no image files).
 */
import { useEffect, useMemo, useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import { RoundedBox } from '@react-three/drei'
import * as THREE from 'three'
import { mat } from '../materials'

const W = 0.36
const D = 0.25
const LID_H = 0.235

function drawScreen(): THREE.CanvasTexture {
  const c = document.createElement('canvas')
  c.width = 512
  c.height = 336
  const g = c.getContext('2d')!
  g.fillStyle = '#26292c'
  g.fillRect(0, 0, c.width, c.height)

  // window chrome
  g.fillStyle = '#33373b'
  g.fillRect(0, 0, c.width, 30)
  ;['#c98b72', '#e8dcc6', '#9fb08a'].forEach((col, i) => {
    g.fillStyle = col
    g.beginPath()
    g.arc(20 + i * 20, 15, 6, 0, Math.PI * 2)
    g.fill()
  })

  // "code" lines (deterministic)
  const palette = ['#a9b994', '#d39a80', '#e8dcc6', '#d9b77a', '#9aa3a8']
  let seed = 7
  const rnd = () => ((seed = (seed * 9301 + 49297) % 233280) / 233280)
  const indents = [0, 1, 1, 2, 2, 1, 0, 1, 2, 2, 1, 0, 1]
  indents.forEach((ind, row) => {
    let x = 22 + ind * 22
    const y = 52 + row * 21
    const parts = 1 + Math.floor(rnd() * 3)
    for (let p = 0; p < parts; p++) {
      const w = 18 + rnd() * 60
      g.fillStyle = palette[Math.floor(rnd() * palette.length)]
      g.globalAlpha = 0.9
      g.fillRect(x, y, w, 8)
      x += w + 8
      if (x > 250) break
    }
  })
  g.globalAlpha = 1

  // right panel: a simulated waveform view
  g.fillStyle = '#2f3336'
  g.fillRect(300, 46, 196, 270)
  g.strokeStyle = 'rgba(255,255,255,0.08)'
  g.lineWidth = 1
  for (let x = 300; x <= 496; x += 28) {
    g.beginPath()
    g.moveTo(x, 46)
    g.lineTo(x, 316)
    g.stroke()
  }
  const wave = (y0: number, col: string, period: number) => {
    g.strokeStyle = col
    g.lineWidth = 3
    g.beginPath()
    let high = false
    g.moveTo(306, y0 + 18)
    for (let x = 306; x < 490; x += period) {
      const y = high ? y0 : y0 + 18
      g.lineTo(x, y)
      high = !high
      g.lineTo(x, high ? y0 : y0 + 18)
    }
    g.stroke()
  }
  wave(70, '#d39a80', 14)
  wave(120, '#a9b994', 28)
  wave(170, '#a9b994', 56)
  wave(220, '#e8dcc6', 112)

  const tex = new THREE.CanvasTexture(c)
  tex.colorSpace = THREE.SRGBColorSpace
  tex.anisotropy = 4
  return tex
}

export function Laptop({ screenOn, animate }: { screenOn: boolean; animate: boolean }) {
  const texture = useMemo(() => drawScreen(), [])
  const screenMat = useMemo(
    () => new THREE.MeshBasicMaterial({ map: texture, toneMapped: false }),
    [texture],
  )
  const cursorMat = useMemo(
    () => new THREE.MeshBasicMaterial({ color: '#e0a88d', toneMapped: false, transparent: true }),
    [],
  )
  const level = useRef(screenOn ? 1 : 0)

  useEffect(
    () => () => {
      texture.dispose()
      screenMat.dispose()
      cursorMat.dispose()
    },
    [texture, screenMat, cursorMat],
  )

  useFrame(({ clock }, delta) => {
    level.current = THREE.MathUtils.damp(level.current, screenOn ? 1 : 0, 8, Math.min(delta, 0.05))
    const l = level.current
    screenMat.color.setScalar(0.03 + l * 0.97)
    const blink = animate ? (Math.sin(clock.elapsedTime * 5) > 0 ? 1 : 0) : 1
    cursorMat.opacity = l * blink
  })

  return (
    <group>
      {/* base */}
      <RoundedBox args={[W, 0.018, D]} radius={0.008} smoothness={2} position={[0, 0.009, 0]} material={mat.slate} />
      <mesh position={[0, 0.0185, -0.03]} material={mat.slateDark}>
        <boxGeometry args={[W * 0.86, 0.002, D * 0.42]} />
      </mesh>
      <mesh position={[0, 0.0185, 0.075]} material={mat.slateLight}>
        <boxGeometry args={[0.11, 0.002, 0.065]} />
      </mesh>

      {/* lid, hinged at the back edge */}
      <group position={[0, 0.018, -D / 2 + 0.006]} rotation={[-0.32, 0, 0]}>
        <RoundedBox args={[W, LID_H, 0.012]} radius={0.006} smoothness={2} position={[0, LID_H / 2, 0]} material={mat.slate} />
        {/* bezel + screen */}
        <mesh position={[0, LID_H / 2, 0.0065]} material={mat.rubber}>
          <planeGeometry args={[W - 0.016, LID_H - 0.016]} />
        </mesh>
        <mesh position={[0, LID_H / 2 + 0.004, 0.007]} material={screenMat}>
          <planeGeometry args={[W - 0.03, LID_H - 0.04]} />
        </mesh>
        <mesh position={[-0.11, 0.07, 0.0075]} material={cursorMat}>
          <planeGeometry args={[0.012, 0.004]} />
        </mesh>
        {/* stickers on the back of the lid */}
        <mesh position={[0.08, LID_H * 0.62, -0.0065]} rotation={[0, Math.PI, 0]} material={mat.terracotta}>
          <circleGeometry args={[0.022, 24]} />
        </mesh>
        <mesh position={[-0.06, LID_H * 0.4, -0.0065]} rotation={[0, Math.PI, 0.3]} material={mat.sage}>
          <planeGeometry args={[0.05, 0.03]} />
        </mesh>
      </group>
    </group>
  )
}
