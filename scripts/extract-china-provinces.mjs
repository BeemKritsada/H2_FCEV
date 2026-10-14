// Builds public/assets/maps/china-provinces-50m.geojson from Natural Earth 1:50m data.
// Sources (public domain):
//   https://raw.githubusercontent.com/nvkelso/natural-earth-vector/master/geojson/ne_50m_admin_1_states_provinces.geojson
//   https://raw.githubusercontent.com/nvkelso/natural-earth-vector/master/geojson/ne_50m_admin_0_countries.geojson
// Usage: node scripts/extract-china-provinces.mjs <admin1.geojson> <admin0.geojson> [out]
import { readFileSync, writeFileSync } from 'node:fs'

const [admin1Path, admin0Path, out = 'public/assets/maps/china-provinces-50m.geojson'] = process.argv.slice(2)
if (!admin1Path || !admin0Path) throw new Error('Usage: extract-china-provinces.mjs <admin1> <admin0> [out]')

const round = (value) => Math.round(value * 100) / 100
const cleanRing = (ring) => ring.map(([x, y]) => [round(x), round(y)]).filter((point, index, all) => index === 0 || point[0] !== all[index - 1][0] || point[1] !== all[index - 1][1])
const polygonsOf = (geometry) => (geometry.type === 'MultiPolygon' ? geometry.coordinates : [geometry.coordinates])
  .map((polygon) => polygon.map(cleanRing).filter((ring) => ring.length >= 4))
  .filter((polygon) => polygon.length)

const admin1 = JSON.parse(readFileSync(admin1Path, 'utf8'))
const admin0 = JSON.parse(readFileSync(admin0Path, 'utf8'))
const slug = (name) => name.toLowerCase().replace(/[^a-z]+/g, '-').replace(/^-|-$/g, '')

const provinces = admin1.features.filter((feature) => feature.properties.adm0_a3 === 'CHN').map((feature) => ({
  type: 'Feature',
  properties: { id: slug(feature.properties.name), name: feature.properties.name, iso: feature.properties.iso_3166_2 },
  geometry: { type: 'MultiPolygon', coordinates: polygonsOf(feature.geometry) },
}))
const sars = admin0.features.filter((feature) => ['HKG', 'MAC'].includes(feature.properties.ADM0_A3)).map((feature) => ({
  type: 'Feature',
  properties: { id: feature.properties.ADM0_A3 === 'HKG' ? 'hong-kong' : 'macao', name: feature.properties.NAME, iso: feature.properties.ISO_A2 },
  geometry: { type: 'MultiPolygon', coordinates: polygonsOf(feature.geometry) },
}))

writeFileSync(out, JSON.stringify({
  type: 'FeatureCollection',
  source: 'Natural Earth 1:50m Cultural Vectors (admin-1 provinces of CHN, admin-0 HKG/MAC), public domain; coordinates rounded to 0.01°',
  features: [...provinces, ...sars],
}))
console.log(`${provinces.length} provinces + ${sars.length} SARs → ${out}`)
