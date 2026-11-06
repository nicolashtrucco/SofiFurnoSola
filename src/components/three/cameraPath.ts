import { Vector3 } from 'three'

/**
 * Recorrido de cámara de la secuencia de scroll.
 * El modelo se normaliza a 1 unidad de alto, centrado en el origen (suelo en y = -0.5).
 * Cada keyframe: posición, objetivo de mirada y fov. Se interpola con curvas Catmull-Rom
 * para obtener un movimiento continuo, sin quiebres.
 *
 * Fases: 1 vista completa → 2 acercamiento → 3 respaldo curvado → 4 estructura de madera → 5 ingreso.
 */
export interface Keyframe {
  pos: [number, number, number]
  target: [number, number, number]
  fov: number
}

export const keyframes: Keyframe[] = [
  { pos: [0, 0.06, 2.8], target: [0, -0.03, 0], fov: 28 },
  { pos: [0.7, 0.3, 1.7], target: [0, 0.08, 0], fov: 28 },
  { pos: [0.55, 0.58, 0.8], target: [0.1, 0.35, -0.15], fov: 28 },
  { pos: [0.3, 0.62, 0.3], target: [0.15, 0.5, -0.2], fov: 26 },
  { pos: [0.162, 0.514, -0.165], target: [0.156, 0.5, -0.215], fov: 24 },
]

export interface CameraSample {
  pos: Vector3
  target: Vector3
  fov: number
}

const smooth = (t: number) => t * t * (3 - 2 * t)

/** Devuelve el estado de cámara para un progreso 0..1. */
export function createCameraPath(frames: Keyframe[] = keyframes) {
  const n = frames.length - 1
  const pts = frames.map((f) => new Vector3(...f.pos))
  const tgs = frames.map((f) => new Vector3(...f.target))

  const catmull = (arr: Vector3[], u: number, out: Vector3) => {
    const f = Math.min(Math.floor(u), n - 1)
    const t = u - f
    const p0 = arr[Math.max(f - 1, 0)]!
    const p1 = arr[f]!
    const p2 = arr[f + 1]!
    const p3 = arr[Math.min(f + 2, n)]!
    const t2 = t * t
    const t3 = t2 * t
    for (const k of ['x', 'y', 'z'] as const) {
      out[k] =
        0.5 *
        (2 * p1[k] +
          (-p0[k] + p2[k]) * t +
          (2 * p0[k] - 5 * p1[k] + 4 * p2[k] - p3[k]) * t2 +
          (-p0[k] + 3 * p1[k] - 3 * p2[k] + p3[k]) * t3)
    }
    return out
  }

  return (progress: number, out: CameraSample) => {
    const u = Math.min(Math.max(progress, 0), 1) * n
    catmull(pts, u, out.pos)
    catmull(tgs, u, out.target)
    const f = Math.min(Math.floor(u), n - 1)
    const t = smooth(u - f)
    out.fov = frames[f]!.fov + (frames[f + 1]!.fov - frames[f]!.fov) * t
    return out
  }
}
