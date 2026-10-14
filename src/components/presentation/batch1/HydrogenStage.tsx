import { useEffect, useLayoutEffect, useMemo, useRef, useState, type ReactNode, type RefObject } from 'react'
import { Canvas, useFrame, useThree } from '@react-three/fiber'
import { CatmullRomCurve3, Group, Mesh, OrthographicCamera, Vector3 } from 'three'
import gsap from 'gsap'
import { ElectrolyzerModel, FuelCellModel, SolarArray, StorageTankModel, WindTurbine } from './IndustrialModels'

type Kind = 'facility' | 'equipment'
type Point = [number, number, number]
const electricityPaths: Point[][] = [
  [[-3.2, 0.12, -1.4], [-3.2, 0.12, -0.2], [-1.65, 0.12, 0.55]],
  [[-3.3, 0.12, 1.4], [-2.2, 0.12, 1.4], [-1.65, 0.12, 0.55]],
  [[-1.65, 0.12, 0.55], [-0.8, 0.12, 0.55], [0.15, 0.32, 0.35]],
]
const hydrogenPath: Point[] = [[1.1, 0.36, 0.1], [2.25, 0.12, 0.1], [2.6, 0.12, -0.55], [3.5, 0.33, -0.55]]

function StageLifecycle({ kind, onLost }: { kind: Kind; onLost: () => void }) {
  const { camera, gl, size, invalidate } = useThree()
  useLayoutEffect(() => {
    if (!(camera instanceof OrthographicCamera)) return
    camera.position.set(...(kind === 'facility' ? [8, 6.6, 10] as Point : [0, 3.2, 14] as Point))
    camera.lookAt(0, kind === 'facility' ? 1.3 : 0.84, 0)
    // R3F owns an imperative Three camera, not immutable React state.
    // eslint-disable-next-line react-hooks/immutability
    camera.zoom = Math.min(size.width / (kind === 'facility' ? 12.5 : 12.6), size.height / (kind === 'facility' ? 7 : 2.7))
    camera.updateProjectionMatrix()
    invalidate()
  }, [camera, size.width, size.height, invalidate, kind])
  useEffect(() => {
    const canvas = gl.domElement
    canvas.addEventListener('webglcontextlost', onLost)
    return () => canvas.removeEventListener('webglcontextlost', onLost)
  }, [gl, onLost])
  return null
}

function EnergyConduit({ points, color, playing, offset = 0 }: { points: Point[]; color: string; playing: boolean; offset?: number }) {
  const packet = useRef<Mesh>(null)
  const phase = useRef(offset)
  const curve = useMemo(() => new CatmullRomCurve3(points.map((p) => new Vector3(...p)), false, 'centripetal'), [points])
  useFrame((_, delta) => {
    if (!playing || !packet.current) return
    phase.current = (phase.current + Math.min(delta, 0.05) * 0.2) % 1
    curve.getPoint(phase.current, packet.current.position)
  })
  return <group>
    <mesh><tubeGeometry args={[curve, 28, 0.024, 6, false]} /><meshBasicMaterial color={color} transparent opacity={0.45} /></mesh>
    <mesh ref={packet} position={curve.getPoint(offset)}><sphereGeometry args={[0.06, 10, 8]} /><meshBasicMaterial color={color} /></mesh>
  </group>
}

function TechnicalScan({ playing, offset }: { playing: boolean; offset: number }) {
  const scan = useRef<Mesh>(null)
  const elapsed = useRef(offset)
  useFrame((_, delta) => {
    if (!playing || !scan.current) return
    elapsed.current += Math.min(delta, 0.05)
    scan.current.position.y = 0.34 + (Math.sin(elapsed.current * 0.55) * 0.5 + 0.5) * 1.18
  })
  return <mesh ref={scan} position={[0, 0.7, 0]}>
    <boxGeometry args={[3.2, 0.016, 1.45]} /><meshBasicMaterial color="#329aca" transparent opacity={0.12} depthWrite={false} />
  </mesh>
}

function useAssemblyEntrance(root: RefObject<Group | null>, playing: boolean, reducedMotion: boolean) {
  const timeline = useRef<gsap.core.Timeline | null>(null)
  useLayoutEffect(() => {
    if (!root.current || reducedMotion) return
    const context = gsap.context(() => {
      timeline.current = gsap.timeline({ paused: true })
      for (const [index, object] of root.current!.children.entries()) {
        timeline.current.from(object.position, { y: '-=0.22', duration: 1.25, ease: 'power3.out' }, index * 0.17)
        timeline.current.from(object.scale, { x: object.scale.x * 0.88, y: object.scale.y * 0.88, z: object.scale.z * 0.88, duration: 1.25, ease: 'power3.out' }, index * 0.17)
      }
    })
    return () => { context.revert(); timeline.current = null }
  }, [root, reducedMotion])
  useEffect(() => {
    if (playing) timeline.current?.play()
    else if (timeline.current?.progress() === 0) timeline.current.progress(1)
    else timeline.current?.pause()
  }, [playing, reducedMotion])
}

function Facility({ playing, reducedMotion }: { playing: boolean; reducedMotion: boolean }) {
  const assembly = useRef<Group>(null)
  useAssemblyEntrance(assembly, playing, reducedMotion)
  return <group>
    <mesh position={[0, -0.09, 0]}><boxGeometry args={[10.8, 0.12, 5.9]} /><meshStandardMaterial color="#f1f6f9" roughness={0.8} /></mesh>
    <group ref={assembly}>
      <group position={[-3.2, 0, -1.4]} scale={0.78} rotation={[0, -0.28, 0]}><WindTurbine playing={playing} /></group>
      <group position={[-1.45, 0, -2.15]} scale={0.54} rotation={[0, -0.28, 0]}><WindTurbine playing={playing} /></group>
      <group position={[-3.3, 0, 1.4]}><SolarArray /></group>
      <group position={[0.2, 0.05, 0.05]} scale={0.9}><ElectrolyzerModel /></group>
      <group position={[3.45, 0.05, -0.55]} scale={0.69}><StorageTankModel /></group>
      <group position={[3.45, 0.05, 0.8]} scale={0.69}><StorageTankModel /></group>
    </group>
    <mesh position={[-1.65, 0.2, 0.55]}><boxGeometry args={[0.34, 0.32, 0.4]} /><meshStandardMaterial color="#9cb5c6" metalness={0.3} roughness={0.5} /></mesh>
    {electricityPaths.map((points, index) => <EnergyConduit key={index} points={points} color="#16a56a" playing={playing} offset={index * 0.2} />)}
    <EnergyConduit points={hydrogenPath} color="#0753c8" playing={playing} offset={0.3} />
  </group>
}

function Equipment({ playing, reducedMotion }: { playing: boolean; reducedMotion: boolean }) {
  const assembly = useRef<Group>(null)
  useAssemblyEntrance(assembly, playing, reducedMotion)
  return <group ref={assembly}>
    {[ElectrolyzerModel, StorageTankModel, FuelCellModel].map((Model, index) => <group key={index} position={[(index - 1) * 4.2, 0, 0]} rotation={[0, -0.35, 0]}>
      <mesh position={[0, 0, 0]}><cylinderGeometry args={[1.8, 1.8, 0.035, 48]} /><meshStandardMaterial color="#f0f5f9" roughness={0.9} /></mesh>
      <Model /><TechnicalScan playing={playing} offset={index * 2.1} />
    </group>)}
  </group>
}

function canUseWebGL() {
  try {
    const context = document.createElement('canvas').getContext('webgl2', { failIfMajorPerformanceCaveat: true })
    if (!context) return false
    context.getExtension('WEBGL_lose_context')?.loseContext()
    return true
  } catch { return false }
}

export default function HydrogenStage({ kind, playing, reducedMotion, fallback }: { kind: Kind; playing: boolean; reducedMotion: boolean; fallback: ReactNode }) {
  const [available] = useState(canUseWebGL)
  const [lost, setLost] = useState(false)
  const [inView, setInView] = useState(true)
  const frame = useRef<HTMLDivElement>(null)
  useEffect(() => {
    if (!frame.current) return
    const observer = new IntersectionObserver(([entry]) => setInView(entry?.isIntersecting ?? false), { threshold: 0.05 })
    observer.observe(frame.current)
    return () => observer.disconnect()
  }, [available, lost])
  if (!available || lost) return fallback
  const moving = playing && inView
  return <div ref={frame} className="batch-stage__renderer"><Canvas orthographic camera={{ position: [8, 6.6, 10], zoom: 50, near: 0.1, far: 100 }}
    frameloop={moving ? 'always' : 'demand'} dpr={[1, 1.5]} gl={{ antialias: true, alpha: true, powerPreference: 'low-power' }} fallback={fallback}>
    <StageLifecycle kind={kind} onLost={() => setLost(true)} />
    <ambientLight intensity={1.35} /><hemisphereLight args={['#e1f3ff', '#9fadb8', 1.8]} />
    <directionalLight position={[-4, 8, 6]} intensity={3.4} /><directionalLight position={[5, 3, -4]} intensity={1.2} color="#b9dfff" />
    {kind === 'facility' ? <Facility playing={moving} reducedMotion={reducedMotion} /> : <Equipment playing={moving} reducedMotion={reducedMotion} />}
  </Canvas></div>
}
