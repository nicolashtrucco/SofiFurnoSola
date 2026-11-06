import {
  ACESFilmicToneMapping,
  AmbientLight,
  Box3,
  DirectionalLight,
  Group,
  LoadingManager,
  Mesh,
  MeshStandardMaterial,
  NeutralToneMapping,
  PCFShadowMap,
  PerspectiveCamera,
  PlaneGeometry,
  PMREMGenerator,
  Scene,
  ShadowMaterial,
  SRGBColorSpace,
  Texture,
  Vector3,
  WebGLRenderer,
} from 'three'
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js'
import { MeshoptDecoder } from 'three/examples/jsm/libs/meshopt_decoder.module.js'
import { RoomEnvironment } from 'three/examples/jsm/environments/RoomEnvironment.js'
import { createCameraPath, type CameraSample } from './cameraPath'

export interface StageOptions {
  canvas: HTMLCanvasElement
  modelUrl: string
  mobile: boolean
  reducedMotion: boolean
  onProgress?: (ratio: number) => void
  onReady?: () => void
  onError?: (e: unknown) => void
}

/** Rotación base del modelo para mostrarlo en 3/4 frontal. */
const BASE_YAW = -0.62

/**
 * Escena Three.js de la silla Thonet N.º 14.
 * Sin dependencias de Vue: el componente solo monta/desmonta y le pasa progreso.
 * Renderiza únicamente cuando algo cambió (scroll, intro, puntero, resize).
 */
export class ThonetStage {
  private renderer: WebGLRenderer
  private scene = new Scene()
  private camera = new PerspectiveCamera(28, 1, 0.01, 20)
  private chair = new Group()
  private pivot = new Group()
  private pmrem: PMREMGenerator
  private envTexture: Texture
  private sample: CameraSample = { pos: new Vector3(), target: new Vector3(), fov: 28 }
  private path = createCameraPath()
  private raf = 0
  private running = false
  private disposed = false
  private dirty = true
  private ro: ResizeObserver

  /** Progreso objetivo del scroll (0..1) */
  private targetProgress = 0
  private current = 0
  private pointer = { x: 0, y: 0, cx: 0, cy: 0 }
  private _intro = 0
  private ready = false

  private opts: StageOptions

  constructor(opts: StageOptions) {
    this.opts = opts
    const { canvas, mobile } = opts
    this.renderer = new WebGLRenderer({ canvas, antialias: !mobile, alpha: true, powerPreference: 'high-performance' })
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, mobile ? 1.5 : 2))
    this.renderer.outputColorSpace = SRGBColorSpace
    this.renderer.toneMapping = typeof NeutralToneMapping === 'number' ? NeutralToneMapping : ACESFilmicToneMapping
    this.renderer.toneMappingExposure = 1.12
    this.renderer.shadowMap.enabled = true
    this.renderer.shadowMap.type = PCFShadowMap
    this.renderer.setClearColor(0x000000, 0)

    // Entorno de estudio (sin HDR externo)
    this.pmrem = new PMREMGenerator(this.renderer)
    this.envTexture = this.pmrem.fromScene(new RoomEnvironment(), 0.04).texture
    this.scene.environment = this.envTexture
    this.scene.environmentIntensity = 0.85

    // Luces: key cálida lateral + relleno suave
    const key = new DirectionalLight(0xfff1de, 2.2)
    key.position.set(-2.2, 3.2, 2.4)
    key.castShadow = true
    key.shadow.mapSize.set(mobile ? 1024 : 2048, mobile ? 1024 : 2048)
    key.shadow.camera.left = -1
    key.shadow.camera.right = 1
    key.shadow.camera.top = 1
    key.shadow.camera.bottom = -1
    key.shadow.camera.near = 0.5
    key.shadow.camera.far = 8
    key.shadow.bias = -0.0004
    key.shadow.normalBias = 0.01
    key.shadow.radius = 5
    // Contraluz cálido: separa el contorno curvo del fondo y da profundidad a la veta
    const rim = new DirectionalLight(0xffd9b0, 1.1)
    rim.position.set(2.4, 2.2, -3)
    this.scene.add(key, rim, new AmbientLight(0xf4f1ea, 0.2))

    this.pivot.add(this.chair)
    this.scene.add(this.pivot)

    this.ro = new ResizeObserver(() => this.resize())
    this.ro.observe(canvas.parentElement ?? canvas)
    this.resize()
    this.applyCamera()
    this.load()
  }

  private load() {
    const manager = new LoadingManager()
    manager.onProgress = (_u, loaded, total) => this.opts.onProgress?.(total ? loaded / total : 0)
    const loader = new GLTFLoader(manager)
    loader.setMeshoptDecoder(MeshoptDecoder)
    loader.load(
      this.opts.modelUrl,
      (gltf) => {
        if (this.disposed) {
          this.disposeObject(gltf.scene)
          return
        }
        const model = gltf.scene
        // Normalizar: 1 unidad de alto, centrado, apoyado sobre y = -0.5
        const box = new Box3().setFromObject(model)
        const size = box.getSize(new Vector3())
        const center = box.getCenter(new Vector3())
        const s = 1 / size.y
        model.scale.setScalar(s)
        model.position.set(-center.x * s, -center.y * s, -center.z * s)
        model.traverse((o) => {
          const m = o as Mesh
          if (!m.isMesh) return
          m.castShadow = true
          m.receiveShadow = true
          const mat = m.material as MeshStandardMaterial
          if (mat && 'envMapIntensity' in mat) {
            mat.roughness = Math.max(mat.roughness ?? 0.6, 0.55)
            mat.needsUpdate = true
          }
        })
        this.chair.add(model)

        // Plano receptor de sombra (solo sombra, sin color)
        const floor = new Mesh(new PlaneGeometry(40, 40), new ShadowMaterial({ opacity: 0.16, color: 0x3a2d20 }))
        floor.rotation.x = -Math.PI / 2
        floor.position.y = -0.5
        floor.receiveShadow = true
        this.scene.add(floor)

        this.ready = true
        this.dirty = true
        this.opts.onReady?.()
      },
      undefined,
      (e) => this.opts.onError?.(e),
    )
  }

  get isReady() {
    return this.ready
  }

  set intro(v: number) {
    this._intro = v
    this.dirty = true
    this.wake()
  }
  get intro() {
    return this._intro
  }

  setProgress(p: number) {
    this.targetProgress = p
    this.wake()
  }

  setPointer(x: number, y: number) {
    this.pointer.x = x
    this.pointer.y = y
    this.wake()
  }

  /** Salta directamente a un progreso (sin amortiguación). */
  jumpTo(p: number) {
    this.targetProgress = this.current = p
    this.dirty = true
    this.wake()
  }

  start() {
    this.wake()
  }

  private wake() {
    if (this.running || this.disposed) return
    this.running = true
    this.raf = requestAnimationFrame(this.tick)
  }

  private resize() {
    const el = this.opts.canvas.parentElement ?? this.opts.canvas
    const w = Math.max(el.clientWidth, 1)
    const h = Math.max(el.clientHeight, 1)
    this.renderer.setSize(w, h, false)
    this.camera.aspect = w / h
    this.dirty = true
    this.wake()
  }

  private applyCamera() {
    this.path(this.current, this.sample)
    const e = easeOutCubic(this._intro)
    // Retrato: ampliar el campo para que la silla entre completa en el ancho
    const aspect = this.camera.aspect
    const fit = aspect < 0.9 ? 1 / Math.max(aspect * 1.7, 0.55) : 1
    this.camera.fov = this.sample.fov * (this.current < 0.35 ? fit : 1 + (fit - 1) * (1 - (this.current - 0.35) / 0.65))
    this.camera.position.copy(this.sample.pos)
    // Parallax suave del puntero, se apaga al avanzar el scroll
    const damp = Math.max(0, 1 - this.current * 3)
    this.camera.position.x += this.pointer.cx * 0.12 * damp
    this.camera.position.y += this.pointer.cy * 0.05 * damp
    this.camera.lookAt(this.sample.target)
    this.camera.updateProjectionMatrix()

    // Entrada del modelo: posición, escala y rotación
    this.pivot.position.y = (1 - e) * -0.14
    this.pivot.scale.setScalar(0.9 + 0.1 * e)
    this.pivot.rotation.y = BASE_YAW + (1 - e) * -0.9
  }

  private tick = () => {
    this.raf = 0
    if (this.disposed) return
    const k = this.opts.reducedMotion ? 1 : 0.085
    const dp = this.targetProgress - this.current
    this.current += Math.abs(dp) < 0.0002 ? dp : dp * k
    const px = this.pointer.x - this.pointer.cx
    const py = this.pointer.y - this.pointer.cy
    this.pointer.cx += Math.abs(px) < 0.0005 ? px : px * 0.06
    this.pointer.cy += Math.abs(py) < 0.0005 ? py : py * 0.06
    const moving =
      Math.abs(dp) > 0.0002 || Math.abs(px) > 0.0005 || Math.abs(py) > 0.0005

    if (moving || this.dirty) {
      this.applyCamera()
      if (this.ready) this.renderer.render(this.scene, this.camera)
      this.dirty = false
    }
    if (moving || this.dirty || !this.ready) {
      this.raf = requestAnimationFrame(this.tick)
    } else {
      this.running = false
    }
  }

  private disposeObject(root: Group | Scene) {
    root.traverse((o) => {
      const m = o as Mesh
      if (!m.isMesh) return
      m.geometry.dispose()
      const mats = Array.isArray(m.material) ? m.material : [m.material]
      for (const mat of mats) {
        for (const v of Object.values(mat)) if (v && (v as Texture).isTexture) (v as Texture).dispose()
        mat.dispose()
      }
    })
  }

  dispose() {
    this.disposed = true
    cancelAnimationFrame(this.raf)
    this.ro.disconnect()
    this.disposeObject(this.scene)
    this.envTexture.dispose()
    this.pmrem.dispose()
    this.renderer.dispose()
    this.renderer.forceContextLoss()
  }
}

const easeOutCubic = (t: number) => 1 - Math.pow(1 - t, 3)

export function hasWebGL(): boolean {
  try {
    const c = document.createElement('canvas')
    return !!(c.getContext('webgl2') || c.getContext('webgl'))
  } catch {
    return false
  }
}
