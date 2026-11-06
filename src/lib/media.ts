/**
 * Resuelve imágenes optimizadas: 'projects/x/foto' → { src, srcset, w, h }.
 * Los archivos se llaman `<base>-<ancho>.webp` y el manifest guarda la proporción real.
 */
import manifest from '@/assets/images/manifest.json'

const files = import.meta.glob('/src/assets/images/**/*.webp', {
  eager: true,
  query: '?url',
  import: 'default',
}) as Record<string, string>

export interface Media {
  src: string
  srcset: string
  w: number
  h: number
}

const index = new Map<string, { w: number; url: string }[]>()
for (const [path, url] of Object.entries(files)) {
  const m = path.match(/^\/src\/assets\/images\/(.+)-(\d+)\.webp$/)
  if (!m) continue
  const list = index.get(m[1]!) ?? []
  list.push({ w: Number(m[2]), url })
  index.set(m[1]!, list.sort((a, b) => a.w - b.w))
}

const dims = manifest as Record<string, { w: number; h: number }>

export function media(id: string): Media | undefined {
  const list = index.get(id)
  if (!list?.length) return undefined
  const largest = list[list.length - 1]!
  const d = dims[id] ?? { w: largest.w, h: largest.w }
  return {
    src: largest.url,
    srcset: list.map((f) => `${f.url} ${f.w}w`).join(', '),
    w: d.w,
    h: d.h,
  }
}
