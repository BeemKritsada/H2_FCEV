import { useLayoutEffect, useMemo, useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import { Group, InstancedMesh, Object3D, Shape } from 'three'

type Vec3 = [number, number, number]
const silver = '#dce5eb'
const navy = '#174975'
const blue = '#0753c8'

function Block({ size, position = [0, 0, 0], color = silver, rotation = [0, 0, 0] }: { size: Vec3; position?: Vec3; color?: string; rotation?: Vec3 }) {
  return <mesh position={position} rotation={rotation}><boxGeometry args={size} /><meshStandardMaterial color={color} metalness={0.3} roughness={0.38} /></mesh>
}

function Rod({ length, radius = 0.035, position, color = silver }: { length: number; radius?: number; position: Vec3; color?: string }) {
  return <mesh position={position} rotation={[0, 0, Math.PI / 2]}><cylinderGeometry args={[radius, radius, length, 12]} /><meshStandardMaterial color={color} metalness={0.6} roughness={0.32} /></mesh>
}

/** Repeated plates are illustrative, not a manufacturer cell count or dimension. */
function Plates({ round = false, count = 22, width = 1.55 }: { round?: boolean; count?: number; width?: number }) {
  const instances = useRef<InstancedMesh>(null)
  useLayoutEffect(() => {
    if (!instances.current) return
    const transform = new Object3D()
    for (let index = 0; index < count; index++) {
      transform.position.set(-width / 2 + index * width / (count - 1), 0, 0)
      transform.rotation.set(0, 0, round ? Math.PI / 2 : 0)
      transform.updateMatrix()
      instances.current.setMatrixAt(index, transform.matrix)
    }
    instances.current.instanceMatrix.needsUpdate = true
  }, [count, width, round])
  return <instancedMesh ref={instances} args={[undefined, undefined, count]} frustumCulled={false}>
    {round ? <cylinderGeometry args={[0.58, 0.58, 0.045, 28]} /> : <boxGeometry args={[0.048, 1.13, 0.98]} />}
    <meshStandardMaterial color={round ? '#b8cbd6' : '#566a7c'} metalness={0.55} roughness={0.32} />
  </instancedMesh>
}

export function ElectrolyzerModel() {
  return <group>
    <Block size={[2.65, 0.14, 1.48]} position={[0.18, 0.15, 0]} color={navy} />
    {[-0.9, 0.9].map((x) => <Block key={x} size={[0.16, 0.43, 1.2]} position={[x, 0.4, 0]} color={blue} />)}
    <group position={[0, 0.95, 0]}>
      <Plates round />
      {[-0.86, 0.86].map((x) => <Rod key={x} position={[x, 0, 0]} length={0.12} radius={0.65} color={blue} />)}
      {[-0.42, 0.42].flatMap((y) => [-0.42, 0.42].map((z) => <Rod key={`${y}-${z}`} position={[0, y, z]} length={1.96} radius={0.032} />))}
    </group>
    <Block size={[0.48, 1.22, 0.73]} position={[1.14, 0.83, -0.15]} color="#edf3f7" />
    <Block size={[0.3, 0.26, 0.025]} position={[1.14, 1.12, 0.225]} color={navy} />
    <mesh position={[1.14, 0.87, 0.25]}><circleGeometry args={[0.036, 12]} /><meshBasicMaterial color="#16a56a" /></mesh>
    <Rod position={[-1.08, 1.05, 0.2]} radius={0.065} length={0.35} />
  </group>
}

export function StorageTankModel() {
  return <group>
    <Block size={[3.32, 0.12, 1.05]} position={[0, 0.13, 0]} color={navy} />
    {[-0.85, 0.85].map((x) => <Block key={x} size={[0.2, 0.45, 0.92]} position={[x, 0.38, 0]} color="#7595ac" />)}
    <mesh position={[0, 0.91, 0]} rotation={[0, 0, Math.PI / 2]}><capsuleGeometry args={[0.47, 2.1, 8, 28]} /><meshStandardMaterial color="#dce8ef" metalness={0.38} roughness={0.3} /></mesh>
    {[-0.9, 0.9].map((x) => <mesh key={x} position={[x, 0.91, 0]} rotation={[0, Math.PI / 2, 0]}><torusGeometry args={[0.475, 0.018, 6, 32]} /><meshStandardMaterial color="#607e94" metalness={0.5} roughness={0.4} /></mesh>)}
    <Rod position={[1.58, 0.91, 0]} length={0.25} radius={0.09} />
    <Block size={[0.12, 0.21, 0.19]} position={[1.72, 0.96, 0]} color={blue} />
  </group>
}

export function FuelCellModel() {
  return <group>
    <Block size={[2.5, 0.12, 1.36]} position={[0, 0.16, 0]} color={navy} />
    <group position={[0, 0.87, 0]}>
      <Plates width={1.72} count={26} />
      {[-0.98, 0.98].map((x) => <Block key={x} size={[0.16, 1.28, 1.14]} position={[x, 0, 0]} color={blue} />)}
      {[-0.48, 0.48].flatMap((y) => [-0.46, 0.46].map((z) => <Rod key={`${y}-${z}`} position={[0, y, z]} length={2.28} radius={0.035} />))}
      <Rod position={[1.15, 0.23, 0.22]} length={0.25} radius={0.1} />
      <Rod position={[1.15, -0.22, -0.22]} length={0.25} radius={0.085} />
    </group>
  </group>
}

const blade = new Shape().moveTo(-0.08, 0).lineTo(-0.1, 0.38).lineTo(0.045, 1.48).lineTo(0.115, 1.48).lineTo(0.16, 0.4).lineTo(0.08, 0).closePath()
const bladeOptions = { depth: 0.035, bevelEnabled: false, steps: 1 }

export function WindTurbine({ playing }: { playing: boolean }) {
  const rotor = useRef<Group>(null)
  useFrame((_, delta) => {
    if (playing && rotor.current) rotor.current.rotation.z -= Math.min(delta, 0.05) * 0.55
  })
  return <group>
    <mesh position={[0, 1.56, 0]}><cylinderGeometry args={[0.06, 0.135, 3.1, 12]} /><meshStandardMaterial color="#edf3f8" metalness={0.28} roughness={0.42} /></mesh>
    <Block size={[0.25, 0.24, 0.47]} position={[0, 3.15, -0.04]} color="#d5e3ec" />
    <group ref={rotor} position={[0, 3.15, 0.27]}>
      {[0, 1, 2].map((index) => <mesh key={index} rotation={[0, 0, index * Math.PI * 2 / 3]}>
        <extrudeGeometry args={[blade, bladeOptions]} /><meshStandardMaterial color="#e8f0f6" metalness={0.22} roughness={0.35} />
      </mesh>)}
      <mesh position={[0, 0, 0.06]}><sphereGeometry args={[0.125, 16, 12]} /><meshStandardMaterial color={blue} metalness={0.3} roughness={0.4} /></mesh>
    </group>
  </group>
}

export function SolarArray() {
  const panels = useRef<InstancedMesh>(null)
  const cells = useMemo(() => {
    const points: number[] = []
    for (let row = 0; row < 3; row++) for (let column = 0; column < 3; column++) {
      const x = column * 0.7 - 0.7
      const z = row * 0.96 - 0.96
      for (let line = 0; line <= 3; line++) {
        const cx = x - 0.31 + line * 0.62 / 3
        points.push(cx, 0.033, z - 0.43, cx, 0.033, z + 0.43)
      }
      for (let line = 0; line <= 4; line++) {
        const cz = z - 0.43 + line * 0.86 / 4
        points.push(x - 0.31, 0.033, cz, x + 0.31, 0.033, cz)
      }
    }
    return new Float32Array(points)
  }, [])
  useLayoutEffect(() => {
    if (!panels.current) return
    const transform = new Object3D()
    for (let row = 0; row < 3; row++) for (let column = 0; column < 3; column++) {
      transform.position.set(column * 0.7 - 0.7, 0, row * 0.96 - 0.96)
      transform.updateMatrix()
      panels.current.setMatrixAt(row * 3 + column, transform.matrix)
    }
    panels.current.instanceMatrix.needsUpdate = true
  }, [])
  return <group>
    {[-0.7, 0.7].flatMap((x) => [-0.9, 0.9].map((z) => <Block key={`${x}-${z}`} size={[0.06, 0.4, 0.06]} position={[x, 0.2, z]} color="#a0b4c6" />))}
    <group position={[0, 0.5, 0]} rotation={[-0.15, 0, 0]}>
      <instancedMesh ref={panels} args={[undefined, undefined, 9]} frustumCulled={false}><boxGeometry args={[0.65, 0.05, 0.9]} /><meshStandardMaterial color="#0d467d" metalness={0.35} roughness={0.25} /></instancedMesh>
      <lineSegments><bufferGeometry><bufferAttribute attach="attributes-position" args={[cells, 3]} /></bufferGeometry><lineBasicMaterial color="#77aecb" transparent opacity={0.65} /></lineSegments>
    </group>
  </group>
}
