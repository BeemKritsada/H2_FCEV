const base = `${import.meta.env.BASE_URL}assets/images/`
export const logisticsImage = (id: string) => `${base}logistics/${id}.webp`
export const railImage = (id: string) => `${base}rail/${id}.webp`
export const coldChainImage = (id: 'bev' | 'fcev') => `${base}cold-chain/${id}-refrigerated-truck.webp`
export const performanceTruck = `${base}logistics/performance-truck.webp`
export const railSources = {
  suburban: 'https://www.hubersuhner.com/en/newsroom/blog-and-literature/blog/development-of-hydrogen-powered-trains-in-china',
  laterTest: 'https://kw.beijing.gov.cn/xwdt/kcyx/xwdtcyfz/202403/t20240326_3818123.html',
  foshan: 'https://www.crrcgc.cc/sfgf/2020-01/07/article_F719648915B84137BE9AA13F75060793.html',
  foshanPhoto: 'https://m.thepaper.cn/newsDetail_forward_5109775',
  changchun: 'https://www.crrcgc.cc/en/2025-11/06/article_2025110609290125210.html',
  changchunPhoto: 'https://photo.china.com.cn/2025-10/17/content_118128154.shtml',
  jilin: 'https://jl.ifeng.com/c/8r3UlGyQmj2',
}
export const nextSceneImages: Record<string, string[]> = {
  'scene-heavy-duty-logistics': ['port', 'mine', 'steel', 'highway'].map(logisticsImage),
  'scene-truck-performance': [performanceTruck],
  'scene-suburban-train': [railImage('suburban')],
  'scene-foshan-tram': [railImage('foshan')],
  'scene-tourism-trams': [railImage('changchun'), railImage('jilin')],
  'scene-freight-locomotive': [railImage('freight-2400')],
  'scene-mining-locomotives': [railImage('mining-700'), railImage('industrial-1400')],
  'scene-cold-chain-comparison': [coldChainImage('bev'), coldChainImage('fcev')],
  'scene-industry-advantages': [performanceTruck, `${base}challenges/refueling-station.webp`, ...['mine', 'steel', 'port'].map(logisticsImage)],
  'scene-industry-barriers': [performanceTruck, `${base}challenges/refueling-station.webp`, `${base}challenges/fcev-sedan.webp`],
  'scene-challenges': ['fcev-sedan', 'refueling-station', 'hydrogen-nozzle'].map((id) => `${base}challenges/${id}.webp`),
  'scene-market-structure': ['รถบรรทุกไฮโดรเจนสีขาวฟ้าล้ำสมัย', 'รถบัสไฮโดรเจนล้ำสมัยสีขาวมุก', 'รถซีดานไฮโดรเจนหรูสีขาวประกายเงิน'].map((name) => `${base}vehicles/${name}.webp`),
  'scene-closing': [`${base}speaker/thibodee-harnprasert.jpg`],
  'scene-regional-map': [railImage('foshan'), ...['steel', 'port', 'mine'].map(logisticsImage), coldChainImage('fcev')],
}
