/** Textos de perfil provistos por Sofía. */
export const profile = {
  title: 'Diseñar es investigar, explorar y materializar ideas.',
  intro: [
    'Soy Sofía Furno Sola, estudiante de Diseño Industrial en la Universidad Católica de Santa Fe, en Rosario.',
    'Me interesa diseñar productos de uso cotidiano que combinen funcionalidad, durabilidad y una mirada consciente sobre los materiales y su fabricación.',
    'Me gusta abordar cada proyecto desde la investigación, explorar alternativas y transformar las ideas en productos concretos, trabajando desde el modelado y la representación hasta los planos y el prototipo.',
  ],
  education: {
    career: 'Diseño Industrial',
    university: 'Universidad Católica de Santa Fe',
    short: 'UCSF',
    city: 'Rosario',
  },
}

export interface PracticeEntry {
  key: string
  label: string
  title: string
  text?: string
  list?: string[]
}

export const practice: PracticeEntry[] = [
  {
    key: 'intereses',
    label: 'Intereses',
    title: 'Objetos cotidianos, materiales y nuevas formas de producir.',
    text: 'Me interesan especialmente el mobiliario, la iluminación y los objetos de uso cotidiano. Me atrae explorar materiales reciclados, aprovechar recursos disponibles y pensar en productos que puedan fabricarse localmente, repararse y mantenerse en el tiempo.',
  },
  {
    key: 'metodo',
    label: 'Forma de proyectar',
    title: 'De la investigación a un producto que funciona.',
    text: 'Entiendo el diseño como un proceso que comienza por investigar y comprender una necesidad. A partir de ahí, exploro alternativas, desarrollo la propuesta mediante herramientas CAD, trabajo su representación y documentación técnica, y avanzo hacia la construcción de prototipos que permitan evaluar su funcionamiento y fabricación.',
  },
  {
    key: 'fortalezas',
    label: 'Fortalezas',
    title: 'Investigar, resolver y materializar.',
    list: [
      'Investigación y fundamentación a partir de fuentes.',
      'Diseño orientado a la fabricación real.',
      'Desarrollo de modelos CAD y documentación técnica.',
      'Construcción de prototipos funcionales.',
      'Exploración de materiales y procesos productivos.',
    ],
  },
  {
    key: 'aspiraciones',
    label: 'Aspiraciones',
    title: 'Diseñar productos con sentido y proyección.',
    text: 'Busco participar en proyectos de diseño y desarrollo de productos junto a estudios y PyMEs fabricantes de Argentina y la región. Me interesa involucrarme en distintas etapas del proceso, desde la investigación y el desarrollo conceptual hasta la documentación y el prototipado, aportando a la creación de productos durables y posibles de fabricar localmente.',
  },
]

/** Secuencia de trabajo, tal como Sofía la describe en "Forma de proyectar". */
export const method = [
  'Investigar y comprender una necesidad',
  'Explorar alternativas',
  'Desarrollar en CAD',
  'Representar y documentar',
  'Prototipar y evaluar',
]

/**
 * Herramientas y capacidades. `used` solo enlaza proyectos donde está documentado
 * (competencias declaradas en cada proyecto). No hay niveles de dominio.
 */
export const tools: { name: string; kind: string; used: string[] }[] = [
  { name: 'SolidWorks', kind: 'Modelado CAD', used: [] },
  { name: 'SolidWorks Visualize', kind: 'Render', used: [] },
  { name: 'Modelado CAD', kind: 'Desarrollo', used: ['01', '02'] },
  { name: 'Impresión 3D', kind: 'Fabricación', used: ['02', '03'] },
  { name: 'Fibra de vidrio', kind: 'Fabricación', used: [] },
  { name: 'Planos técnicos IRAM', kind: 'Documentación', used: ['02'] },
  { name: 'Desarrollo de prototipos', kind: 'Materialización', used: ['03'] },
]
