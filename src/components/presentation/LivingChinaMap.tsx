import { useEffect, useLayoutEffect, useMemo, useRef, useState, type ReactNode } from 'react'
import { Canvas, useFrame, useThree } from '@react-three/fiber'
import { CatmullRomCurve3, Group, MathUtils, Mesh, Path, Shape, Vector3 } from 'three'
import gsap from 'gsap'
import sourceText from '../../../public/assets/maps/china-source.geojson?raw'

type Coordinate = [number, number]
type Polygon = Coordinate[][]
const source = JSON.parse(sourceText) as { geometry: { type: string; coordinates: Polygon[] | Polygon } }
const polygons = (source.geometry.type === 'MultiPolygon' ? source.geometry.coordinates : [source.geometry.coordinates]) as Polygon[]
const project = ([longitude, latitude]: Coordinate): Coordinate => [longitude * Math.cos(35 * Math.PI / 180), latitude]
const projected = polygons.flat(2).map(project)
const bounds = {
  minX: Math.min(...projected.map(([x]) => x)), maxX: Math.max(...projected.map(([x]) => x)),
  minY: Math.min(...projected.map(([, y]) => y)), maxY: Math.max(...projected.map(([, y]) => y)),
}
const mapPoint = (coordinate: Coordinate) => {
  const [x, y] = project(coordinate)
  const scale = 7.2 / (bounds.maxX - bounds.minX)
  return new Vector3((x - (bounds.minX + bounds.maxX) / 2) * scale, (y - (bounds.minY + bounds.maxY) / 2) * scale, 0)
}

// Decorative regional nodes only: these are not a station/route dataset.
const nodePositions = [[86, 42], [104, 38], [114, 40], [104, 30], [119, 31], [112, 24]].map((p) => {
  const v = mapPoint(p as Coordinate)
  v.z = 0.17
  return v
})
const links = [[0, 1], [1, 2], [1, 3], [2, 4], [3, 5], [5, 4]] as const
const extrudeOptions = { depth: 0.11, bevelEnabled: true, bevelThickness: 0.015, bevelSize: 0.012, bevelSegments: 1, steps: 1 }

function MapLifecycle({ onContextLost }: { onContextLost: () => void }) {
  const { gl, camera, size, invalidate } = useThree()
  useEffect(() => {
    const canvas = gl.domElement
    canvas.addEventListener('webglcontextlost', onContextLost)
    return () => canvas.removeEventListener('webglcontextlost', onContextLost)
  }, [gl, onContextLost])
  useLayoutEffect(() => {
    camera.position.setZ(Math.max(10.5, 4.2 / Math.tan(MathUtils.degToRad(19)) / (size.width / size.height)))
    camera.updateProjectionMatrix()
    invalidate()
  }, [camera, size.width, size.height, invalidate])
  return null
}

function EnergyLink({ start, end, offset, playing }: { start: Vector3; end: Vector3; offset: number; playing: boolean }) {
  const particle = useRef<Mesh>(null)
  const progress = useRef(offset)
  const curve = useMemo(() => {
    const middle = start.clone().lerp(end, 0.5)
    middle.z += 0.42
    return new CatmullRomCurve3([start, middle, end])
  }, [start, end])
  useFrame((_, delta) => {
    if (!playing || !particle.current) return
    progress.current = (progress.current + Math.min(delta, 0.05) * 0.12) % 1
    curve.getPoint(progress.current, particle.current.position)
  })
  return <group>
    <mesh><tubeGeometry args={[curve, 36, 0.012, 4, false]} /><meshBasicMaterial color="#169de0" transparent opacity={0.4} /></mesh>
    <mesh ref={particle} position={curve.getPoint(offset)}><sphereGeometry args={[0.034, 10, 8]} /><meshBasicMaterial color="#0753c8" /></mesh>
  </group>
}

function MapGeometry({ playing, reducedMotion }: { playing: boolean; reducedMotion: boolean }) {
  const entrance = useRef<Group>(null)
  const drift = useRef<Group>(null)
  const pulse = useRef<Group>(null)
  const outlineGroup = useRef<Group>(null)
  const elapsed = useRef(0)
  const animation = useRef<gsap.core.Timeline | null>(null)
  const { shapes, outlines } = useMemo(() => {
    const shapes: Shape[] = []
    const outlines: Float32Array[] = []
    for (const polygon of polygons) {
      const shape = new Shape()
      polygon.forEach((ring, index) => {
        const path = index === 0 ? shape : new Path()
        const points = ring.map(mapPoint)
        points.forEach((point, i) => i === 0 ? path.moveTo(point.x, point.y) : path.lineTo(point.x, point.y))
        if (index > 0) shape.holes.push(path)
        outlines.push(new Float32Array(points.flatMap((p) => [p.x, p.y, 0.105])))
      })
      shapes.push(shape)
    }
    return { shapes, outlines }
  }, [])

  useLayoutEffect(() => {
    if (!entrance.current || reducedMotion) return
    const context = gsap.context(() => {
      animation.current = gsap.timeline({ paused: true })
        .from(entrance.current!.scale, { x: 0.88, y: 0.88, z: 0.88, duration: 1.6, ease: 'power3.out' }, 0)
        .from(entrance.current!.rotation, { x: -0.55, z: -0.1, duration: 1.6, ease: 'power3.out' }, 0)
      for (const line of outlineGroup.current?.children ?? []) {
        animation.current.from((line as Mesh).material, { opacity: 0, duration: 1.2, ease: 'power2.out' }, 0.25)
      }
    })
    return () => { context.revert(); animation.current = null }
  }, [reducedMotion])

  useEffect(() => {
    if (playing) animation.current?.play()
    else if (animation.current?.progress() === 0) animation.current.progress(1)
    else animation.current?.pause()
  }, [playing, reducedMotion])

  useFrame((_, delta) => {
    if (!playing || !drift.current) return
    elapsed.current += Math.min(delta, 0.05)
    const time = elapsed.current
    drift.current.rotation.y = Math.sin(time * 0.15) * 0.035
    drift.current.rotation.x = -0.1 + Math.sin(time * 0.12) * 0.025
    drift.current.position.y = Math.sin(time * 0.2) * 0.035
    pulse.current?.children.forEach((child, index) => {
      const phase = (time * 0.3 + index * 0.17) % 1
      child.scale.setScalar(1 + phase * 1.7)
      const material = (child as Mesh).material
      if (!Array.isArray(material) && 'opacity' in material) material.opacity = 0.38 * (1 - phase)
    })
  })

  return <group ref={entrance} rotation={[0, 0, -0.035]}>
    <group ref={drift} rotation={[-0.1, 0, 0]}>
      <mesh position={[0, 0, -0.04]}>
        <extrudeGeometry args={[shapes, extrudeOptions]} />
        <meshStandardMaterial color="#c4e7fa" metalness={0.12} roughness={0.6} />
      </mesh>
      <group ref={outlineGroup}>{outlines.map((points, index) => <lineLoop key={index}>
        <bufferGeometry><bufferAttribute attach="attributes-position" args={[points, 3]} /></bufferGeometry>
        <lineBasicMaterial color="#0753c8" transparent opacity={0.65} />
      </lineLoop>)}</group>
      {links.map(([from, to], index) => <EnergyLink key={index} start={nodePositions[from]!} end={nodePositions[to]!} offset={index / links.length} playing={playing} />)}
      {nodePositions.map((point, index) => <group key={index} position={point}>
        <mesh><circleGeometry args={[0.07, 20]} /><meshBasicMaterial color="#0753c8" /></mesh>
        <mesh position={[0, 0, 0.006]}><circleGeometry args={[0.023, 12]} /><meshBasicMaterial color="white" /></mesh>
      </group>)}
      <group ref={pulse}>{nodePositions.map((point, index) => <mesh key={index} position={point}>
        <ringGeometry args={[0.095, 0.11, 24]} /><meshBasicMaterial color="#00a8e8" transparent opacity={0.3} />
      </mesh>)}</group>
    </group>
  </group>
}

function canUseWebGL() {
  try {
    const canvas = document.createElement('canvas')
    const context = canvas.getContext('webgl2', { failIfMajorPerformanceCaveat: true })
    if (!context) return false
    context.getExtension('WEBGL_lose_context')?.loseContext()
    return true
  } catch { return false }
}

export default function LivingChinaMap({ playing, reducedMotion, fallback }: { playing: boolean; reducedMotion: boolean; fallback: ReactNode }) {
  const [available] = useState(canUseWebGL)
  const [contextLost, setContextLost] = useState(false)
  const [inView, setInView] = useState(true)
  const frame = useRef<HTMLDivElement>(null)
  useEffect(() => {
    if (!frame.current) return
    const observer = new IntersectionObserver(([entry]) => setInView(entry?.isIntersecting ?? false), { threshold: 0.05 })
    observer.observe(frame.current)
    return () => observer.disconnect()
  }, [available, contextLost])
  if (!available || contextLost) return fallback
  return <div ref={frame} className="living-map__renderer"><Canvas
    frameloop={playing && inView ? 'always' : 'demand'} dpr={[1, 1.5]}
    camera={{ position: [0, 0, 10.5], fov: 38 }}
    gl={{ antialias: true, alpha: true, powerPreference: 'low-power' }}
    fallback={fallback}
  >
    <MapLifecycle onContextLost={() => setContextLost(true)} />
    <ambientLight intensity={1.8} /><directionalLight position={[-3, 5, 8]} intensity={2.2} />
    <MapGeometry playing={playing && inView} reducedMotion={reducedMotion} />
  </Canvas></div>
}
