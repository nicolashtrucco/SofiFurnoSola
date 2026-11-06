/**
 * Archivo de proyectos.
 * Las imágenes se referencian por su ruta base dentro de src/assets/images (sin sufijo de ancho):
 * se generan con `npm run optimize:images` a partir de /assets-source.
 * Agregar imágenes, planos o textos = editar este archivo; la composición vive en cada componente de proyecto.
 */
export interface Img {
  id: string
  alt: string
  caption?: string
}

export interface ProjectBase {
  n: string
  anchor: string
  title: string
  category: string
  /** Una línea para el índice del archivo */
  material: string
  skills: string[]
  concept: string[]
  thumb: Img
}

/* ───────────── 01 — Reposera ───────────── */
export const reposera = {
  n: '01',
  anchor: 'reposera',
  title: 'Reposera de autos siniestrados',
  category: 'Mobiliario / Diseño sustentable',
  material: 'Aluminio de llantas · cinturones de seguridad',
  skills: ['Investigación', 'CAD', 'Render', 'Desarrollo', 'Fabricación'],
  concept: [
    'Una reposera construida a partir de aluminio recuperado de llantas de vehículos y cinturones de seguridad reutilizados.',
    'El proyecto propone repensar la vida útil de los objetos, priorizando la durabilidad, la reparación y la posibilidad de reemplazar componentes individuales.',
  ],
  thumb: { id: 'projects/reposera/REPOSERAS.26', alt: 'Render de la reposera' },
  hero: { id: 'projects/reposera/REPOSERAS.26', alt: 'Reposera: estructura de aluminio y cintas de cinturón de seguridad', caption: 'Render — vista general' },
  context: { id: 'projects/reposera/contexto-pileta', alt: 'Dos reposeras junto a una pileta', caption: 'Render en contexto' },
  research: {
    lead: 'El proyecto parte de una reflexión sobre la cultura de consumo y la producción de objetos de vida útil corta.',
    text: 'Se investigaron modelos de producción y consumo, economía circular, obsolescencia y reparación.',
    references: ['Bauman (2007)', 'Chapman (2005)', 'Directiva Europea 2024/1799', 'Proyecto argentino 5938-D-2025'],
  },
  proposal: 'Una reposera fabricada con materiales recuperados, pensada para durar y poder repararse.',
  materials: [
    { code: 'A', name: 'Aluminio fundido', origin: 'Recuperado de llantas', role: 'Estructura' },
    { code: 'B', name: 'Cinturones de seguridad', origin: 'Reutilizados', role: 'Superficie de apoyo' },
  ],
  process: {
    aluminio: [
      'Recuperación y preparación de llantas',
      'Limpieza y corte del aluminio',
      'Fundición e inyección a aproximadamente 700 °C',
      'Enfriamiento, granallado y lavado',
    ],
    cintas: ['Limpieza y preparación de los cinturones', 'Costura de las cintas'],
    montaje: 'Montaje y tensado mediante un tensor',
  },
  construction: {
    exploded: { id: 'projects/reposera/REPOSERAS.29', alt: 'Vista explosionada: dos laterales de aluminio, varillas y cintas', caption: 'Vista explosionada' },
    notes: [
      'Las cintas no utilizan remaches. Cada una envuelve la estructura y vuelve sobre sí misma mediante una costura.',
      'Si una cinta se deteriora, puede reemplazarse individualmente sin tener que cambiar toda la superficie de apoyo.',
    ],
    details: [
      { id: 'projects/reposera/REPOSERAS.27', alt: 'Detalle: cintas sobre el lateral de aluminio y varillas roscadas', caption: 'Detalle — cintas y estructura' },
      { id: 'projects/reposera/REPOSERAS.28', alt: 'Detalle: tensor roscado entre varillas', caption: 'Detalle — tensor' },
    ] as Img[],
  },
  topology: {
    text: 'El proyecto también explora la optimización topológica de la estructura. Se trabajó sobre distintas alternativas de geometría y distribución de material, buscando reducir el uso de material y mantener la resistencia necesaria.',
    /** Agregar aquí las imágenes del estudio cuando estén disponibles (se muestran automáticamente). */
    images: [] as Img[],
  },
} satisfies ProjectBase & Record<string, unknown>

/* ───────────── 02 — Lámpara de cintas ───────────── */
export interface Sheet {
  n: string
  title: string
  scale: string
  img: Img
}

export const cintas = {
  n: '02',
  anchor: 'lampara-cintas',
  title: 'Lámpara de cintas',
  category: 'Iluminación / Diseño de producto',
  material: 'Cintas de madera · estructura PLA impresa en 3D',
  skills: ['CAD', 'Render', 'Planos IRAM'],
  concept: [
    'Una lámpara construida mediante cintas de madera dispuestas y torsionadas entre dos anillos.',
    'La geometría genera espacios por donde pasa la luz, produciendo distintas percepciones del objeto según el ángulo desde el que se observa.',
  ],
  thumb: { id: 'projects/lampara-cintas/render', alt: 'Render de la lámpara de cintas' },
  render: { id: 'projects/lampara-cintas/render', alt: 'Render: cintas de madera torsionadas entre dos anillos blancos', caption: 'Render' },
  specs: [
    { k: 'Estructura', v: 'PLA — impresión 3D' },
    { k: 'Fijaciones', v: '80 piezas' },
    { k: 'Documentación', v: '10 planos — normas IRAM' },
    { k: 'Altura total', v: '197 mm', src: 'Plano N1' },
    { k: 'Aro perforado', v: 'Ø 125 mm', src: 'Plano N4' },
  ],
  totalSheets: 10,
  /** Planos publicados. Agregar los restantes (N3, N5…) en orden. */
  sheets: [
    { n: 'N1', title: 'Ensamblaje lámpara', scale: '1:2', img: { id: 'projects/lampara-cintas/planos/plano_N1_ensamblaje', alt: 'Plano N1 — ensamblaje de la lámpara, vistas y perspectiva' } },
    { n: 'N2', title: 'Explosionada lámpara', scale: '1:2', img: { id: 'projects/lampara-cintas/planos/plano_N2_explosionada', alt: 'Plano N2 — vista explosionada con lista de piezas' } },
    { n: 'N4', title: 'Aro perforado inferior', scale: '1:1', img: { id: 'projects/lampara-cintas/planos/plano_N4_aro_perforado_inf', alt: 'Plano N4 — aro perforado inferior, corte A-A y cotas' } },
  ] as Sheet[],
} satisfies ProjectBase & Record<string, unknown>

/* ───────────── 03 — Lámpara texturada ───────────── */
export interface LightState {
  key: string
  label: string
  swatch: string
  img: Img
  /** Encuadre: punto focal (%) y ampliación para centrar el objeto */
  focus: [number, number]
  zoom: number
}

export const texturada = {
  n: '03',
  anchor: 'lampara-texturada',
  title: 'Lámpara texturada',
  category: 'Iluminación / Experimentación material',
  material: 'Pantalla impresa en 3D · base LED RGB',
  skills: ['Diseño', 'Experimentación', 'Impresión 3D', 'Prototipo funcional'],
  concept: [
    'Una lámpara desarrollada mediante una pantalla impresa en 3D, con una superficie ondulada y texturada, montada sobre una base con iluminación LED RGB.',
    'Cuando se enciende, la luz resalta la geometría de la superficie y las capas de impresión, generando un efecto visual particular.',
  ],
  development: 'El proyecto explora la relación entre geometría, textura, material y luz. Existe un prototipo físico funcional.',
  thumb: { id: 'projects/lampara-texturada/foto_luz_calida', alt: 'Prototipo encendido con luz cálida' },
  lights: [
    { key: 'calida', label: 'Cálida', swatch: '#f3d9a8', img: { id: 'projects/lampara-texturada/foto_luz_calida', alt: 'Prototipo encendido con luz cálida' }, focus: [48, 70], zoom: 1.9 },
    { key: 'fria', label: 'Fría', swatch: '#e8f1f6', img: { id: 'projects/lampara-texturada/foto_luz_fria', alt: 'Prototipo encendido con luz fría' }, focus: [53, 74], zoom: 1.95 },
    { key: 'celeste', label: 'Celeste', swatch: '#5fd3e6', img: { id: 'projects/lampara-texturada/foto_luz_celeste', alt: 'Prototipo encendido con luz celeste' }, focus: [51, 72], zoom: 1.85 },
  ] as LightState[],
  strip: { id: 'projects/lampara-texturada/tira_colores', alt: 'El prototipo en rojo, celeste, verde y naranja', caption: 'Base LED RGB — variaciones de color' },
  notes: ['Pantalla impresa en 3D', 'Superficie ondulada y texturada', 'Capas de impresión visibles', 'Base con iluminación LED RGB', 'Prototipo físico funcional'],
} satisfies ProjectBase & Record<string, unknown>

export const projects: ProjectBase[] = [reposera, cintas, texturada]
