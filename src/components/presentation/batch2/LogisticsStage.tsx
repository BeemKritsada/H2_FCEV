import { useEffect, useLayoutEffect, useMemo, useRef, useState, type ReactNode } from 'react'
import { Canvas, useFrame, useThree } from '@react-three/fiber'
import { CatmullRomCurve3, Group, OrthographicCamera, Vector3 } from 'three'
import gsap from 'gsap'
import { ElectrolyzerModel, StorageTankModel } from '../batch1/IndustrialModels'

type Point = [number, number, number]
function Box({ position, size, color = '#dce8f0' }: { position: Point; size: Point; color?: string }) {
  return <mesh position={position}><boxGeometry args={size} /><meshStandardMaterial color={color} metalness={0.25} roughness={0.42} /></mesh>
}

function TubeTrailer({ playing }: { playing: boolean }) {
  const truck = useRef<Group>(null)
  const elapsed = useRef(0)
  useFrame((_, delta) => {
    if (!playing || !truck.current) return
    elapsed.current += Math.min(delta, 0.05)
    truck.current.position.x = Math.sin(elapsed.current * 0.35) * 0.14
  })
  return <group ref={truck}>
    <Box position={[-0.25, 0.45, 0]} size={[2.85, 0.2, 1.08]} color="#07398f" />
    <Box position={[1.28, 0.78, 0]} size={[0.85, 1.08, 1.12]} color="#0753c8" />
    <Box position={[1.4, 1.03, 0]} size={[0.67, 0.38, 1.14]} color="#a8d5ea" />
    <Box position={[1.72, 0.55, 0]} size={[0.05, 0.2, 0.77]} color="#e9f4fc" />
    {[-0.33, 0, 0.33].flatMap((z) => [0.8, 1.16].map((y) => <mesh key={`${z}-${y}`} position={[-0.33, y, z]} rotation={[0, 0, Math.PI / 2]}><capsuleGeometry args={[0.155, 2.08, 5, 12]} /><meshStandardMaterial color="#d4e5ef" metalness={0.5} roughness={0.32} /></mesh>))}
    {[-1.25, -0.67, 1.22].flatMap((x) => [-0.57, 0.57].map((z) => <mesh key={`${x}-${z}`} position={[x, 0.3, z]} rotation={[Math.PI / 2, 0, 0]}><cylinderGeometry args={[0.27, 0.27, 0.17, 16]} /><meshStandardMaterial color="#31485c" roughness={0.8} /></mesh>))}
    {[-1.4, 0.75].map((x) => <Box key={x} position={[x, 1, 0]} size={[0.07, 0.84, 1.07]} color="#739bb5" />)}
  </group>
}

function RefuelingStation() {
  const hose = useMemo(() => new CatmullRomCurve3([new Vector3(0.26, 0.96, 0.25), new Vector3(0.65, 0.8, 0.3), new Vector3(0.65, 0.25, 0.3), new Vector3(0.32, 0.6, 0.32)]), [])
  return <group>
    <Box position={[0, 0.04, 0]} size={[2.5, 0.1, 1.95]} color="#dfeaf3" />
    <Box position={[-0.93, 0.98, -0.62]} size={[0.11, 1.92, 0.11]} color="#7295b3" />
    <Box position={[0.93, 0.98, -0.62]} size={[0.11, 1.92, 0.11]} color="#7295b3" />
    <Box position={[0, 1.95, -0.15]} size={[2.5, 0.16, 1.7]} color="#0753c8" />
    <Box position={[0, 0.67, 0]} size={[0.6, 1.25, 0.46]} color="#f4f8fc" />
    <Box position={[0, 0.99, 0.237]} size={[0.37, 0.25, 0.02]} color="#07398f" />
    <Box position={[0, 0.51, 0.237]} size={[0.37, 0.3, 0.02]} color="#00a8e8" />
    <mesh><tubeGeometry args={[hose, 20, 0.03, 6, false]} /><meshStandardMaterial color="#214b71" /></mesh>
  </group>
}

function StorageIndicator({ playing }: { playing: boolean }) {
  const needle = useRef<Group>(null)
  const elapsed = useRef(0)
  useFrame((_, delta) => {
    if (!playing || !needle.current) return
    elapsed.current += Math.min(delta, 0.05)
    needle.current.rotation.z = Math.sin(elapsed.current * 0.6) * 0.3
  })
  return <group position={[-1.75, 1.25, 0.5]}>
    <mesh><circleGeometry args={[0.24, 24]} /><meshBasicMaterial color="#e3f3fc" /></mesh>
    <group ref={needle}><Box position={[0.05, 0.07, 0.01]} size={[0.025, 0.22, 0.025]} color="#0753c8" /></group>
  </group>
}

function Flow({ playing }: { playing: boolean }) {
  const packets = useRef<Group>(null)
  const elapsed = useRef(0)
  const curve = useMemo(() => new CatmullRomCurve3([
    new Vector3(-5.2, 0.17, 0.95), new Vector3(-2, 0.17, 0.95),
    new Vector3(1.8, 0.17, 0.95), new Vector3(5.3, 0.17, 0.95),
  ]), [])
  useFrame((_, delta) => {
    if (!playing || !packets.current) return
    elapsed.current += Math.min(delta, 0.05) * 0.13
    packets.current.children.forEach((packet, index) => curve.getPoint((elapsed.current + index / 4) % 1, packet.position))
  })
  return <group>
    {/* An illustrative flow guide, not a physical interregional pipe. */}
    <group ref={packets}>{[0, 1, 2, 3].map((index) => <mesh key={index} position={curve.getPoint(index / 4)}><sphereGeometry args={[0.065, 10, 8]} /><meshBasicMaterial color="#00a8e8" /></mesh>)}</group>
    {/* Only this short, local pilot segment is represented as a physical pipe. */}
    <mesh position={[-3.8, 0.16, 1.35]} rotation={[0, 0, Math.PI / 2]}><cylinderGeometry args={[0.07, 0.07, 3, 12]} /><meshStandardMaterial color="#16a56a" metalness={0.3} roughness={0.4} /></mesh>
    {[-5.3, -2.3].map((x) => <mesh key={x} position={[x, 0.4, 1.35]}><cylinderGeometry args={[0.07, 0.07, 0.55, 12]} /><meshStandardMaterial color="#16a56a" /></mesh>)}
  </group>
}

function Assembly({ playing, reducedMotion }: { playing: boolean; reducedMotion: boolean }) {
  const root = useRef<Group>(null)
  const timeline = useRef<gsap.core.Timeline | null>(null)
  useLayoutEffect(() => {
    if (!root.current || reducedMotion) return
    const context = gsap.context(() => {
      timeline.current = gsap.timeline({ paused: true })
      root.current!.children.forEach((child, index) => {
        timeline.current!.from(child.scale, { x: child.scale.x * 0.82, y: child.scale.y * 0.82, z: child.scale.z * 0.82, duration: 0.7, ease: 'power2.out' }, index * 0.3)
        timeline.current!.from(child.position, { y: '-=0.15', duration: 0.7 }, index * 0.3)
      })
    })
    return () => { context.revert(); timeline.current = null }
  }, [reducedMotion])
  useEffect(() => {
    if (playing) timeline.current?.play()
    else if (timeline.current?.progress() === 0) timeline.current.progress(1).pause()
    else timeline.current?.pause()
  }, [playing, reducedMotion])
  return <group>
    <Box position={[0, -0.07, 0.05]} size={[14, 0.12, 4]} color="#f0f5f9" />
    <group ref={root}>
      <group position={[-5.3, 0, 0]} scale={0.83}><ElectrolyzerModel /></group>
      <group position={[-1.95, 0, -0.1]} scale={0.67}><StorageTankModel /><group position={[0, 0, -1.3]}><StorageTankModel /></group></group>
      <group position={[1.65, 0, 0]} scale={0.86}><TubeTrailer playing={playing} /></group>
      <group position={[5.3, 0, 0]}><RefuelingStation /></group>
    </group>
    <StorageIndicator playing={playing} /><Flow playing={playing} />
  </group>
}

function Lifecycle({ onLost }: { onLost: () => void }) {
  const { camera, size, invalidate, gl } = useThree()
  useLayoutEffect(() => {
    if (!(camera instanceof OrthographicCamera)) return
    camera.position.set(2.8, 6.2, 14)
    camera.lookAt(0, 0.7, 0)
    // R3F owns this mutable Three camera.
    // eslint-disable-next-line react-hooks/immutability
    camera.zoom = Math.min(size.width / 15.5, size.height / 5.7)
    camera.updateProjectionMatrix(); invalidate()
  }, [camera, size.width, size.height, invalidate])
  useEffect(() => {
    const canvas = gl.domElement
    canvas.addEventListener('webglcontextlost', onLost)
    return () => canvas.removeEventListener('webglcontextlost', onLost)
  }, [gl, onLost])
  return null
}
function supportsWebGL() {
  try {
    const context = document.createElement('canvas').getContext('webgl2', { failIfMajorPerformanceCaveat: true })
    if (!context) return false
    context.getExtension('WEBGL_lose_context')?.loseContext()
    return true
  } catch { return false }
}
export default function LogisticsStage({ playing, reducedMotion, fallback }: { playing: boolean; reducedMotion: boolean; fallback: ReactNode }) {
  const [available] = useState(supportsWebGL)
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
  return <div className="logistics-stage__renderer" ref={frame}><Canvas orthographic camera={{ position: [2.8, 6.2, 14], zoom: 45, near: 0.1, far: 80 }} frameloop={moving ? 'always' : 'demand'} dpr={[1, 1.5]} gl={{ antialias: true, alpha: true, powerPreference: 'low-power' }} fallback={fallback}>
    <Lifecycle onLost={() => setLost(true)} />
    <ambientLight intensity={1.4} /><hemisphereLight args={['#e1f3ff', '#8fa3b5', 1.6]} />
    <directionalLight position={[-4, 8, 6]} intensity={3} />
    <Assembly playing={moving} reducedMotion={reducedMotion} />
  </Canvas></div>
}
