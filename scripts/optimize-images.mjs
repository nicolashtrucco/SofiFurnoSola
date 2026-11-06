/**
 * Genera las imágenes web del portfolio a partir de los originales en /assets-source.
 *   npm run optimize:images
 * Salida: src/assets/images/<misma ruta>-<ancho>.webp (sin agrandar nunca el original).
 * Los originales pesados quedan fuera del bundle.
 */
import sharp from 'sharp'
import { readdir, mkdir, stat, writeFile } from 'node:fs/promises'
import path from 'node:path'

const SRC = 'assets-source'
const OUT = 'src/assets/images'

// Ajustes por archivo: anchos a generar y si se recorta el fondo blanco sobrante de los renders.
const rules = [
  { test: /planos\//, widths: [2400, 900], quality: 88 },
  { test: /reposera\/REPOSERAS\.(26|29)/, widths: [2000, 1000], trim: true },
  { test: /.*/, widths: [1800, 900] },
]

async function* walk(dir) {
  for (const e of await readdir(dir, { withFileTypes: true })) {
    const p = path.join(dir, e.name)
    if (e.isDirectory()) yield* walk(p)
    else if (/\.(png|jpe?g|webp|tiff?)$/i.test(e.name)) yield p
  }
}

/** Proporciones reales (post recorte) para reservar espacio y evitar saltos de layout. */
const manifest = {}

for await (const file of walk(SRC)) {
  const rel = path.relative(SRC, file).replace(/\.[^.]+$/, '')
  const rule = rules.find((r) => r.test.test(rel.replaceAll(path.sep, '/')))
  await mkdir(path.join(OUT, path.dirname(rel)), { recursive: true })
  for (const w of rule.widths) {
    const out = path.join(OUT, `${rel}-${w}.webp`)
    let img = sharp(file, { limitInputPixels: false })
    if (rule.trim) img = img.trim({ threshold: 4 }) // fondo transparente: recorta el aire alrededor del objeto
    await img.resize({ width: w, withoutEnlargement: true }).webp({ quality: rule.quality ?? 80, effort: 5 }).toFile(out)
    const { size } = await stat(out)
    console.log(`${out}  ${(size / 1024).toFixed(0)} KB`)
    if (w === rule.widths[0]) {
      const meta = await sharp(out).metadata()
      manifest[rel.replaceAll(path.sep, '/')] = { w: meta.width, h: meta.height }
    }
  }
}
await writeFile(path.join(OUT, 'manifest.json'), JSON.stringify(manifest, null, 2) + '\n')
