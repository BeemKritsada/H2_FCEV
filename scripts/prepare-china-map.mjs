import { readFileSync, writeFileSync } from 'node:fs'

// Input: Natural Earth 1:110m admin-0 GeoJSON, CHN feature; public domain.
// No points, routes, or unverified regional geometry are added.
const input = JSON.parse(readFileSync(process.argv[2] ?? 'public/assets/maps/china-source.geojson', 'utf8'))
const china = input.type === 'FeatureCollection'
  ? input.features.find((feature) => feature.properties.ADM0_A3 === 'CHN')
  : input
if (!china || china.properties.ADM0_A3 !== 'CHN') throw new Error('Expected Natural Earth CHN feature')
const polygons = china.geometry.type === 'MultiPolygon' ? china.geometry.coordinates : [china.geometry.coordinates]
const coordinates = polygons.flat(2)
// Equirectangular projection with standard parallel at 35 degrees north.
const project = ([lon, lat]) => [lon * Math.cos(35 * Math.PI / 180), -lat]
const points = coordinates.map(project)
const minX = Math.min(...points.map(([x]) => x))
const minY = Math.min(...points.map(([, y]) => y))
const maxX = Math.max(...points.map(([x]) => x))
const maxY = Math.max(...points.map(([, y]) => y))
const scale = Math.min(568 / (maxX - minX), 328 / (maxY - minY))
const point = (coordinate) => {
  const [x, y] = project(coordinate)
  return [(x - minX) * scale + (600 - (maxX - minX) * scale) / 2,
    (y - minY) * scale + (360 - (maxY - minY) * scale) / 2].map((v) => v.toFixed(2)).join(',')
}
const path = polygons.map((polygon) => polygon.map((ring) => `M${ring.map(point).join('L')}Z`).join('')).join('')
writeFileSync('public/assets/maps/china-source.geojson', JSON.stringify(china) + '\n')
writeFileSync('public/assets/maps/china-outline.svg', `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 600 360"><defs><linearGradient id="land" x2=".6" y2="1"><stop stop-color="#e0f2ff"/><stop offset="1" stop-color="#a6cfee"/></linearGradient></defs><path d="${path}" fill="url(#land)" stroke="#80b6de" stroke-width="1.1" stroke-linejoin="round" fill-rule="evenodd"/></svg>\n`)
console.log('Prepared geographic silhouette without city markers or routes.')
