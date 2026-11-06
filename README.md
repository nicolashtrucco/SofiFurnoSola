# Sofía Furno Sola — Archivo de objetos

Portfolio de una sola página. Vue 3 + TypeScript (strict) + Vite + Tailwind 4 · Three.js · GSAP/ScrollTrigger · Motion for Vue (microinteracciones).

```bash
npm run dev               # desarrollo
npm run build             # typecheck + build
npm run optimize:images   # genera WebP (2 tamaños) + manifest desde /assets-source
npm run optimize:model    # regenera los GLB livianos desde src/assets/models/thonet-14.glb
```

## Contenido
| Qué | Dónde |
| --- | --- |
| Email, LinkedIn, ciudad | `src/data/site.ts` |
| Perfil, práctica, herramientas | `src/data/profile.ts` |
| Proyectos (textos, imágenes, planos) | `src/data/projects.ts` |

### Agregar imágenes o planos
1. Copiar el original a `assets-source/projects/<proyecto>/…` (los originales no entran al bundle).
2. `npm run optimize:images`.
3. Referenciarla en `projects.ts` por su ruta sin extensión, p. ej. `projects/lampara-cintas/planos/plano_N3_…`.

- Planos de la lámpara de cintas: las 10 láminas (N1–N10) ya están en `sheets`; para sumar o reordenar se edita ese array.
- Optimización topológica de la reposera: agregar imágenes a `topology.images` y aparecen solas. Los valores de 89 kg / 30 kg / 12 % no se publican hasta verificar su contexto.

## Composición
Cada proyecto tiene su propio componente (`src/components/projects/`): la reposera es técnica y material, la lámpara de cintas trabaja geometría y planos, la texturada es nocturna y centrada en la luz.
Las líneas SVG aparecen solo donde explican algo: la transición de la silla, la convergencia del proceso de la reposera, el esquema de cintas y la silla del cierre.
