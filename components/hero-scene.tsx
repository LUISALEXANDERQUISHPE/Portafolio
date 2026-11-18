"use client"

import { Canvas, useFrame, useThree } from "@react-three/fiber"
import { useEffect, useMemo, useRef, useState } from "react"
import * as THREE from "three"
import { RoomEnvironment } from "three/examples/jsm/environments/RoomEnvironment.js"

// Colores de la escena. Coinciden con las variables --brand-* de app/globals.css.
const ACCENT = "#dcec6b"
const ACCENT_SOFT = "#eef6a6"
const SECONDARY = "#d9d3c3"

// Posición del puntero normalizada (-1 a 1). Se lee desde window porque el
// canvas va detrás del contenido y no recibe eventos.
const pointer = { x: 0, y: 0 }

function Particles({ count }: { count: number }) {
  const ref = useRef<THREE.Points>(null)

  const positions = useMemo(() => {
    const array = new Float32Array(count * 3)
    for (let i = 0; i < count; i++) {
      // Punto aleatorio en una cáscara esférica alrededor de la cámara
      const radius = 4 + Math.random() * 7
      const theta = Math.random() * Math.PI * 2
      const phi = Math.acos(2 * Math.random() - 1)
      array[i * 3] = radius * Math.sin(phi) * Math.cos(theta)
      array[i * 3 + 1] = radius * Math.sin(phi) * Math.sin(theta)
      array[i * 3 + 2] = radius * Math.cos(phi) - 4
    }
    return array
  }, [count])

  useFrame((_, delta) => {
    if (!ref.current) return
    ref.current.rotation.y += delta * 0.025
    ref.current.rotation.x += delta * 0.008
  })

  return (
    <points ref={ref}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[positions, 3]} />
      </bufferGeometry>
      <pointsMaterial size={0.035} color={ACCENT_SOFT} sizeAttenuation transparent opacity={0.75} depthWrite={false} />
    </points>
  )
}

export type ShapeVariant = "blob" | "globe" | "network" | "wave"

// Dónde y de qué tamaño va la figura. Escritorio (>= 1024px): columna derecha del hero.
// Móvil: pequeña en la esquina superior derecha, sin tapar el texto.
function usePlacement(desktopPx: number, mobilePx: number) {
  const { viewport, size } = useThree()
  const wide = size.width >= 1024
  const unitsPerPixel = viewport.width / size.width
  const containerWidth = Math.min(1152, size.width - 64)
  const baseX = wide ? containerWidth * 0.3 * unitsPerPixel : viewport.width * 0.47
  const baseY = wide ? -0.1 : viewport.height * 0.4
  const scale = (wide ? desktopPx : mobilePx) * unitsPerPixel
  // Centro de la figura en coordenadas de pantalla (-1..1), para comparar con el puntero
  const screenX = baseX / (viewport.width / 2)
  const screenY = -baseY / (viewport.height / 2)
  // Puntero convertido a coordenadas locales de la figura
  const pointerLocal = () => ({
    x: ((pointer.x - screenX) * (viewport.width / 2)) / scale,
    y: (-(pointer.y - screenY) * (viewport.height / 2)) / scale,
  })
  return { wide, baseX, baseY, scale, screenX, screenY, pointerLocal }
}

// Deformación del blob (GLSL). Suma de ondas suaves que cambian con el tiempo,
// más un bulto que apunta hacia el mouse cuando el cursor está cerca.
const BLOB_GLSL = /* glsl */ `
uniform float uTime;
uniform float uAmp;
uniform float uHover;
uniform vec3 uPointerDir;

float blobDisplace(vec3 n) {
  float d = sin(n.x * 2.2 + uTime * 0.9) * sin(n.y * 2.6 + uTime * 0.7) * sin(n.z * 2.0 + uTime * 1.1);
  d += 0.55 * sin(n.x * 4.1 - uTime * 1.3 + n.y * 3.1) * sin(n.z * 3.6 + uTime * 0.6);
  d += 0.25 * sin(n.y * 6.3 + uTime * 1.7) * sin(n.x * 5.2 - n.z * 4.4 - uTime * 0.9);
  float bulge = pow(max(dot(n, uPointerDir), 0.0), 4.0);
  return d * uAmp + bulge * uHover * 0.32;
}

vec3 blobPoint(vec3 n) {
  return n * (1.0 + blobDisplace(n));
}
`

function Blob() {
  const mesh = useRef<THREE.Mesh>(null)
  const { gl, scene } = useThree()
  const uniforms = useMemo(
    () => ({
      uTime: { value: 0 },
      uAmp: { value: 0.12 },
      uHover: { value: 0 },
      uPointerDir: { value: new THREE.Vector3(0, 0, 1) },
    }),
    [],
  )

  // Reflejos tipo estudio para que el material se vea como vidrio/metal pulido
  useEffect(() => {
    const pmrem = new THREE.PMREMGenerator(gl)
    const environment = pmrem.fromScene(new RoomEnvironment(), 0.04).texture
    scene.environment = environment
    return () => {
      scene.environment = null
      environment.dispose()
      pmrem.dispose()
    }
  }, [gl, scene])

  const material = useMemo(() => {
    const physical = new THREE.MeshPhysicalMaterial({
      color: "#a9be2c",
      roughness: 0.22,
      metalness: 0.65,
      clearcoat: 1,
      clearcoatRoughness: 0.08,
      iridescence: 0.35,
      iridescenceIOR: 1.4,
      envMapIntensity: 0.55,
    })
    physical.onBeforeCompile = (shader) => {
      Object.assign(shader.uniforms, uniforms)
      shader.vertexShader = BLOB_GLSL + shader.vertexShader
      // Normal recalculada a partir de dos puntos vecinos sobre la superficie deformada
      shader.vertexShader = shader.vertexShader.replace(
        "#include <beginnormal_vertex>",
        `vec3 blobN = normalize(position);
        vec3 blobT = normalize(cross(blobN, abs(blobN.y) < 0.99 ? vec3(0.0, 1.0, 0.0) : vec3(1.0, 0.0, 0.0)));
        vec3 blobB = cross(blobN, blobT);
        vec3 blobP = blobPoint(blobN);
        vec3 blobPT = blobPoint(normalize(blobN + blobT * 0.01));
        vec3 blobPB = blobPoint(normalize(blobN + blobB * 0.01));
        vec3 objectNormal = normalize(cross(blobPT - blobP, blobPB - blobP));
        #ifdef USE_TANGENT
          vec3 objectTangent = vec3(tangent.xyz);
        #endif`,
      )
      shader.vertexShader = shader.vertexShader.replace("#include <begin_vertex>", "vec3 transformed = blobP;")
    }
    return physical
  }, [uniforms])

  const { wide, baseX, baseY, scale, screenX: blobX, screenY: blobY } = usePlacement(210, 62)

  useFrame((state, delta) => {
    const t = state.clock.elapsedTime
    uniforms.uTime.value = t
    // ¿El cursor está cerca del blob? (coordenadas de pantalla -1..1)
    const near = Math.hypot(pointer.x - blobX, pointer.y - blobY) < 0.55 ? 1 : 0
    uniforms.uHover.value = THREE.MathUtils.lerp(uniforms.uHover.value, near, 0.06)
    uniforms.uAmp.value = 0.12 + uniforms.uHover.value * 0.06
    // Dirección del bulto: hacia el cursor (en el espacio del propio blob)
    const target = new THREE.Vector3((pointer.x - blobX) * 1.6, -(pointer.y - blobY) * 1.6, 1).normalize()
    if (mesh.current) {
      target.applyQuaternion(mesh.current.quaternion.clone().invert())
      uniforms.uPointerDir.value.lerp(target, 0.1).normalize()
      mesh.current.position.y = baseY + Math.sin(t * 0.8) * 0.1
      mesh.current.rotation.y += delta * 0.15
      mesh.current.rotation.x = THREE.MathUtils.lerp(mesh.current.rotation.x, -pointer.y * 0.3, 0.04)
    }
  })

  return (
    <mesh ref={mesh} position={[baseX, baseY, 0]} scale={scale} material={material}>
      <icosahedronGeometry args={[1, wide ? 48 : 24]} />
    </mesh>
  )
}

// ---------- Globo de puntos con arcos de luz ----------
function Globe() {
  const { wide, baseX, baseY, scale } = usePlacement(215, 62)
  const group = useRef<THREE.Group>(null)

  const positions = useMemo(() => {
    // Puntos repartidos de forma uniforme sobre la esfera (espiral de Fibonacci)
    const count = wide ? 2200 : 900
    const array = new Float32Array(count * 3)
    const golden = Math.PI * (3 - Math.sqrt(5))
    for (let i = 0; i < count; i++) {
      const y = 1 - (i / (count - 1)) * 2
      const radius = Math.sqrt(1 - y * y)
      array[i * 3] = Math.cos(golden * i) * radius
      array[i * 3 + 1] = y
      array[i * 3 + 2] = Math.sin(golden * i) * radius
    }
    return array
  }, [wide])

  // Arcos entre puntos al azar que se dibujan y se borran en bucle
  const arcs = useMemo(() => {
    const randomPoint = () => new THREE.Vector3().randomDirection()
    return Array.from({ length: 12 }, (_, index) => {
      const start = randomPoint()
      const end = randomPoint()
      const middle = start
        .clone()
        .add(end)
        .normalize()
        .multiplyScalar(1 + start.distanceTo(end) * 0.45)
      const curve = new THREE.QuadraticBezierCurve3(start, middle, end)
      const geometry = new THREE.BufferGeometry().setFromPoints(curve.getPoints(60))
      const material = new THREE.LineBasicMaterial({ color: ACCENT, transparent: true, opacity: 0.9 })
      return { line: new THREE.Line(geometry, material), offset: index / 12 }
    })
  }, [])

  useFrame((state, delta) => {
    const t = state.clock.elapsedTime
    if (group.current) {
      group.current.rotation.y += delta * 0.12
      group.current.rotation.x = THREE.MathUtils.lerp(group.current.rotation.x, 0.35 - pointer.y * 0.3, 0.04)
      group.current.rotation.z = THREE.MathUtils.lerp(group.current.rotation.z, -pointer.x * 0.15, 0.04)
      group.current.position.y = baseY + Math.sin(t * 0.8) * 0.08
    }
    for (const arc of arcs) {
      // Cada arco avanza (cabeza) y luego se recoge (cola)
      const progress = (t * 0.28 + arc.offset * 1.6) % 1.6
      const head = Math.min(progress, 1) * 61
      const tail = Math.max(0, Math.min(progress - 0.6, 1)) * 61
      arc.line.geometry.setDrawRange(Math.floor(tail), Math.max(0, Math.floor(head - tail)))
    }
  })

  return (
    <group ref={group} position={[baseX, baseY, 0]} scale={scale}>
      {/* Esfera oscura interior: atenúa los puntos de la cara de atrás y da volumen */}
      <mesh>
        <sphereGeometry args={[0.985, 48, 48]} />
        <meshBasicMaterial color="#0f1d26" transparent opacity={0.75} />
      </mesh>
      <points>
        <bufferGeometry>
          <bufferAttribute attach="attributes-position" args={[positions, 3]} />
        </bufferGeometry>
        <pointsMaterial size={wide ? 0.022 : 0.02} color={ACCENT} sizeAttenuation transparent opacity={0.9} />
      </points>
      {arcs.map((arc, index) => (
        <primitive key={index} object={arc.line} />
      ))}
    </group>
  )
}

// ---------- Constelación de red: nodos que se conectan cuando están cerca ----------
const NETWORK_RADIUS = 1.25
const LINK_DISTANCE = 0.42

function Network() {
  const { wide, baseX, baseY, scale, pointerLocal } = usePlacement(200, 62)
  const count = wide ? 80 : 40
  const group = useRef<THREE.Group>(null)
  const pointsGeometry = useRef<THREE.BufferGeometry>(null)
  const linesGeometry = useRef<THREE.BufferGeometry>(null)

  const nodes = useMemo(() => {
    const positions = new Float32Array(count * 3)
    const velocities = new Float32Array(count * 3)
    for (let i = 0; i < count; i++) {
      const point = new THREE.Vector3().randomDirection().multiplyScalar(Math.cbrt(Math.random()) * NETWORK_RADIUS)
      positions.set([point.x, point.y, point.z], i * 3)
      const velocity = new THREE.Vector3().randomDirection().multiplyScalar(0.08 + Math.random() * 0.08)
      velocities.set([velocity.x, velocity.y, velocity.z], i * 3)
    }
    // Espacio para todas las líneas posibles (nodo-nodo y nodo-puntero)
    const maxSegments = (count * (count - 1)) / 2 + count
    return {
      positions,
      velocities,
      linePositions: new Float32Array(maxSegments * 6),
      lineColors: new Float32Array(maxSegments * 6),
    }
  }, [count])

  const color = useMemo(() => new THREE.Color(ACCENT), [])

  useFrame((state, delta) => {
    const t = state.clock.elapsedTime
    const step = Math.min(delta, 0.05)
    const { positions, velocities, linePositions, lineColors } = nodes
    const mouse = pointerLocal()
    const mouseNear = Math.hypot(mouse.x, mouse.y) < 1.9

    for (let i = 0; i < count; i++) {
      const index = i * 3
      // El puntero atrae un poco a los nodos cercanos
      if (mouseNear) {
        const dx = mouse.x - positions[index]
        const dy = mouse.y - positions[index + 1]
        if (Math.hypot(dx, dy) < 0.7) {
          velocities[index] += dx * step * 0.12
          velocities[index + 1] += dy * step * 0.12
        }
      }
      for (let axis = 0; axis < 3; axis++) {
        velocities[index + axis] *= 0.995
        positions[index + axis] += velocities[index + axis] * step
      }
      // Límite de velocidad para que los nodos no se amontonen
      const speed = Math.hypot(velocities[index], velocities[index + 1], velocities[index + 2])
      if (speed > 0.22) {
        for (let axis = 0; axis < 3; axis++) velocities[index + axis] *= 0.22 / speed
      }
      // Rebote al llegar al borde de la esfera
      const length = Math.hypot(positions[index], positions[index + 1], positions[index + 2])
      if (length > NETWORK_RADIUS) {
        for (let axis = 0; axis < 3; axis++) {
          positions[index + axis] *= NETWORK_RADIUS / length
          velocities[index + axis] *= -1
        }
      }
    }

    let segment = 0
    const addLine = (ax: number, ay: number, az: number, bx: number, by: number, bz: number, strength: number) => {
      const offset = segment * 6
      linePositions.set([ax, ay, az, bx, by, bz], offset)
      const r = color.r * strength
      const g = color.g * strength
      const b = color.b * strength
      lineColors.set([r, g, b, r, g, b], offset)
      segment++
    }
    for (let a = 0; a < count; a++) {
      const ia = a * 3
      for (let b = a + 1; b < count; b++) {
        const ib = b * 3
        const distance = Math.hypot(
          positions[ia] - positions[ib],
          positions[ia + 1] - positions[ib + 1],
          positions[ia + 2] - positions[ib + 2],
        )
        if (distance < LINK_DISTANCE) {
          const strength = (1 - distance / LINK_DISTANCE) * 0.8
          addLine(
            positions[ia],
            positions[ia + 1],
            positions[ia + 2],
            positions[ib],
            positions[ib + 1],
            positions[ib + 2],
            strength,
          )
        }
      }
      // Líneas hacia el puntero
      if (mouseNear) {
        const distance = Math.hypot(mouse.x - positions[ia], mouse.y - positions[ia + 1])
        if (distance < 0.6) {
          addLine(positions[ia], positions[ia + 1], positions[ia + 2], mouse.x, mouse.y, 0, 1 - distance / 0.6)
        }
      }
    }

    if (pointsGeometry.current) pointsGeometry.current.attributes.position.needsUpdate = true
    if (linesGeometry.current) {
      linesGeometry.current.attributes.position.needsUpdate = true
      linesGeometry.current.attributes.color.needsUpdate = true
      linesGeometry.current.setDrawRange(0, segment * 2)
    }
    if (group.current) {
      group.current.rotation.y = Math.sin(t * 0.15) * 0.4
      group.current.position.y = baseY + Math.sin(t * 0.8) * 0.08
    }
  })

  return (
    <group ref={group} position={[baseX, baseY, 0]} scale={scale}>
      <points>
        <bufferGeometry ref={pointsGeometry}>
          <bufferAttribute attach="attributes-position" args={[nodes.positions, 3]} />
        </bufferGeometry>
        <pointsMaterial size={0.06} color={ACCENT_SOFT} sizeAttenuation transparent opacity={0.95} />
      </points>
      <lineSegments>
        <bufferGeometry ref={linesGeometry}>
          <bufferAttribute attach="attributes-position" args={[nodes.linePositions, 3]} />
          <bufferAttribute attach="attributes-color" args={[nodes.lineColors, 3]} />
        </bufferGeometry>
        <lineBasicMaterial vertexColors transparent blending={THREE.AdditiveBlending} depthWrite={false} />
      </lineSegments>
    </group>
  )
}

// ---------- Onda de partículas: superficie de puntos que ondula ----------
function Wave() {
  const { wide, baseX, baseY, scale, pointerLocal } = usePlacement(140, 48)
  const columns = wide ? 90 : 50
  const rows = wide ? 46 : 26
  const geometry = useRef<THREE.BufferGeometry>(null)
  const hover = useRef(0)

  const positions = useMemo(() => {
    const array = new Float32Array(columns * rows * 3)
    for (let row = 0; row < rows; row++) {
      for (let column = 0; column < columns; column++) {
        const index = (row * columns + column) * 3
        array[index] = (column / (columns - 1) - 0.5) * 3.4
        array[index + 2] = (row / (rows - 1) - 0.5) * 2.4
      }
    }
    return array
  }, [columns, rows])

  useFrame((state) => {
    const t = state.clock.elapsedTime
    const mouse = pointerLocal()
    const near = Math.abs(mouse.x) < 1.8 && Math.abs(mouse.y) < 1.2 ? 1 : 0
    hover.current = THREE.MathUtils.lerp(hover.current, near, 0.05)
    // El plano está inclinado: la altura del puntero en pantalla se traduce en profundidad (z)
    const mouseZ = -mouse.y * 1.4
    for (let i = 0; i < columns * rows; i++) {
      const index = i * 3
      const x = positions[index]
      const z = positions[index + 2]
      let y = Math.sin(x * 2.2 + t * 1.1) * 0.12 + Math.sin(z * 3 + t * 0.8) * 0.08
      y += Math.sin((x + z) * 1.4 - t * 0.6) * 0.06
      // Onda circular donde está el puntero
      const distance = Math.hypot(x - mouse.x, z - mouseZ)
      y += Math.exp(-distance * distance * 3) * Math.sin(distance * 9 - t * 5) * 0.22 * hover.current
      positions[index + 1] = y
    }
    if (geometry.current) geometry.current.attributes.position.needsUpdate = true
  })

  return (
    <group position={[baseX, baseY, 0]} scale={scale} rotation={[0.55, -0.35, 0]}>
      <points>
        <bufferGeometry ref={geometry}>
          <bufferAttribute attach="attributes-position" args={[positions, 3]} />
        </bufferGeometry>
        <pointsMaterial size={wide ? 0.03 : 0.028} color={ACCENT} sizeAttenuation transparent opacity={0.9} />
      </points>
    </group>
  )
}

function supportsWebGL() {
  try {
    const canvas = document.createElement("canvas")
    return Boolean(canvas.getContext("webgl2") || canvas.getContext("webgl"))
  } catch {
    return false
  }
}

export default function HeroScene({ variant = "network" }: { variant?: ShapeVariant }) {
  const wrapper = useRef<HTMLDivElement>(null)
  const [enabled, setEnabled] = useState(false)
  const [visible, setVisible] = useState(true)
  const [reducedMotion, setReducedMotion] = useState(false)
  const [particleCount, setParticleCount] = useState(1400)

  useEffect(() => {
    setEnabled(supportsWebGL())
    setReducedMotion(window.matchMedia("(prefers-reduced-motion: reduce)").matches)
    if (window.innerWidth < 768) setParticleCount(600)

    const onPointerMove = (event: PointerEvent) => {
      pointer.x = (event.clientX / window.innerWidth) * 2 - 1
      pointer.y = (event.clientY / window.innerHeight) * 2 - 1
    }
    window.addEventListener("pointermove", onPointerMove, { passive: true })
    return () => window.removeEventListener("pointermove", onPointerMove)
  }, [])

  // Pausa el render cuando el hero no está en pantalla
  useEffect(() => {
    const element = wrapper.current
    if (!element) return
    const observer = new IntersectionObserver(([entry]) => setVisible(entry.isIntersecting))
    observer.observe(element)
    return () => observer.disconnect()
  }, [])

  const frameloop = reducedMotion ? "demand" : visible ? "always" : "never"

  return (
    <div ref={wrapper} className="absolute inset-0 pointer-events-none" aria-hidden="true">
      {enabled && (
        <Canvas
          camera={{ position: [0, 0, 6], fov: 50 }}
          dpr={[1, 1.5]}
          frameloop={frameloop}
          gl={{ antialias: true, alpha: true, powerPreference: "high-performance" }}
        >
          <ambientLight intensity={0.25} />
          <directionalLight position={[3, 4, 5]} intensity={1.4} />
          <pointLight position={[-4, -2, 3]} intensity={40} color={SECONDARY} />
          <pointLight position={[4, -3, 2]} intensity={25} color={ACCENT} />
          <Particles count={particleCount} />
          {variant === "blob" && <Blob />}
          {variant === "globe" && <Globe />}
          {variant === "network" && <Network />}
          {variant === "wave" && <Wave />}
        </Canvas>
      )}
    </div>
  )
}
