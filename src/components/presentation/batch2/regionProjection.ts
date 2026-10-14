import geography from '../../../../public/assets/maps/china-source.geojson?raw'

type Point = [number, number]
const geo = JSON.parse(geography) as { geometry: { type: string; coordinates: number[][][][] } }
const polygons = geo.geometry.coordinates
const project = ([lon, lat]: number[]) => [lon! * Math.cos(35 * Math.PI / 180), -lat!] as Point
const points = polygons.flat(2).map(project)
const minX = Math.min(...points.map(([x]) => x)), maxX = Math.max(...points.map(([x]) => x))
const minY = Math.min(...points.map(([, y]) => y)), maxY = Math.max(...points.map(([, y]) => y))
const scale = Math.min(568 / (maxX - minX), 328 / (maxY - minY))
export const projectRegion = (coordinate: number[]): Point => {
  const [x, y] = project(coordinate)
  return [(x - minX) * scale + (600 - (maxX - minX) * scale) / 2,
    (y - minY) * scale + (360 - (maxY - minY) * scale) / 2]
}
export const regionOutline = polygons.map((polygon) => polygon.map((ring) => `M${ring.map((point) => projectRegion(point).join(',')).join('L')}Z`).join('')).join('')
