export type SceneVisualKind =
  | 'abstract'
  | 'truck'
  | 'production'
  | 'renewable'
  | 'equipment'
  | 'station'
  | 'fleet'
  | 'cold-chain'
  | 'industry'
  | 'power'
  | 'rail'
  | 'map'
  | 'barriers'

export type SceneContentPreview =
  | { sectionId: string; kind: 'paragraph'; index: number }
  | { sectionId: string; kind: 'list'; index: number }
  | { sectionId: string; kind: 'bullet'; listIndex: number; itemIndex: number }

export interface PresentationScene {
  id: string
  labelKey: string
  contentIds: readonly string[]
  visual: SceneVisualKind
  previews?: readonly SceneContentPreview[]
}

export const presentationScenes = [
  { id: 'scene-opening', labelKey: 'sceneLabels.opening', contentIds: [], visual: 'truck' },
  {
    id: 'scene-china-scale',
    labelKey: 'sceneLabels.chinaScale',
    contentIds: ['china-hydrogen-overview'],
    visual: 'map',
    previews: [{ sectionId: 'china-hydrogen-overview', kind: 'paragraph', index: 1 }],
  },
  {
    id: 'scene-production-mix',
    labelKey: 'sceneLabels.productionMix',
    contentIds: ['hydrogen-production-structure'],
    visual: 'production',
    previews: [{ sectionId: 'hydrogen-production-structure', kind: 'list', index: 0 }],
  },
  {
    id: 'scene-green-hydrogen',
    labelKey: 'sceneLabels.greenHydrogen',
    contentIds: ['hydrogen-production-structure'],
    visual: 'renewable',
    previews: [
      { sectionId: 'hydrogen-production-structure', kind: 'paragraph', index: 0 },
      { sectionId: 'hydrogen-production-structure', kind: 'bullet', listIndex: 1, itemIndex: 0 },
    ],
  },
  {
    id: 'scene-equipment-technology',
    labelKey: 'sceneLabels.equipment',
    contentIds: ['hydrogen-production-structure'],
    visual: 'equipment',
  },
  {
    id: 'scene-infrastructure',
    labelKey: 'sceneLabels.infrastructure',
    contentIds: ['hydrogen-infrastructure', 'station-counts-and-service-cities'],
    visual: 'station',
    previews: [{ sectionId: 'hydrogen-infrastructure', kind: 'paragraph', index: 1 }],
  },
  {
    id: 'scene-infrastructure-expansion',
    labelKey: 'batchTwo.expansion.title',
    contentIds: ['hydrogen-infrastructure'],
    visual: 'station',
  },
  {
    id: 'scene-hydrogen-transport',
    labelKey: 'batchTwo.transport.title',
    contentIds: ['hydrogen-infrastructure'],
    visual: 'industry',
  },
  {
    id: 'scene-vehicle-deployment',
    labelKey: 'sceneLabels.vehicleDeployment',
    contentIds: ['vehicle-deployment'],
    visual: 'fleet',
    previews: [{ sectionId: 'vehicle-deployment', kind: 'paragraph', index: 1 }],
  },
  {
    id: 'scene-market-transition',
    labelKey: 'batchThree.transition.title',
    contentIds: ['vehicle-deployment'],
    visual: 'fleet',
  },
  {
    id: 'scene-market-structure',
    labelKey: 'batchThree.structure.title',
    contentIds: ['vehicle-deployment'],
    visual: 'fleet',
  },
  {
    id: 'scene-power-storage',
    labelKey: 'sceneLabels.powerStorage',
    contentIds: ['power-and-energy-storage'],
    visual: 'power',
    previews: [{ sectionId: 'power-and-energy-storage', kind: 'bullet', listIndex: 0, itemIndex: 0 }],
  },
  {
    id: 'scene-distributed-power',
    labelKey: 'batchFour.distributed.eyebrow',
    contentIds: ['power-and-energy-storage'],
    visual: 'power',
  },
  {
    id: 'scene-hydrogen-cofiring',
    labelKey: 'batchFour.cofiring.eyebrow',
    contentIds: ['power-and-energy-storage'],
    visual: 'power',
  },
  {
    id: 'scene-heavy-duty-logistics',
    labelKey: 'sceneLabels.heavyDutyLogistics',
    contentIds: ['four-application-sectors-transport', 'heavy-duty-truck-logistics'],
    visual: 'truck',
    previews: [
      { sectionId: 'four-application-sectors-transport', kind: 'bullet', listIndex: 0, itemIndex: 0 },
      { sectionId: 'heavy-duty-truck-logistics', kind: 'bullet', listIndex: 1, itemIndex: 0 },
    ],
  },
  {
    id: 'scene-truck-performance',
    labelKey: 'batchFive.performance.title',
    contentIds: ['heavy-duty-truck-logistics'],
    visual: 'truck',
  },
  {
    id: 'scene-heavy-logistics-regions',
    labelKey: 'batchFive.regions.title',
    contentIds: ['heavy-duty-truck-logistics'],
    visual: 'map',
  },
  {
    id: 'scene-suburban-train',
    labelKey: 'batchFive.suburban.title',
    contentIds: ['passenger-rail'],
    visual: 'rail',
  },
  {
    id: 'scene-foshan-tram',
    labelKey: 'batchFive.foshan.title',
    contentIds: ['passenger-rail'],
    visual: 'rail',
  },
  {
    id: 'scene-tourism-trams',
    labelKey: 'batchFive.tourism.title',
    contentIds: ['passenger-rail'],
    visual: 'rail',
  },
  { id: 'scene-freight-locomotive', labelKey: 'batchSeven.freight.title', contentIds: ['freight-and-mining-locomotives'], visual: 'rail' },
  { id: 'scene-mining-locomotives', labelKey: 'batchSeven.mining.title', contentIds: ['freight-and-mining-locomotives'], visual: 'rail' },
  { id: 'scene-rail-deployment', labelKey: 'batchSeven.deployment.title', contentIds: ['freight-and-mining-locomotives'], visual: 'map' },
  { id: 'scene-cold-chain-comparison', labelKey: 'coldChainScene.title', contentIds: ['refrigerated-transport'], visual: 'cold-chain' },
  { id: 'scene-industry-advantages', labelKey: 'batchNine.advantages.title', contentIds: ['hydrogen-industry-advantages'], visual: 'production' },
  { id: 'scene-industry-barriers', labelKey: 'batchNine.barriers.title', contentIds: ['industry-barriers', 'remaining-challenges'], visual: 'barriers' },
  {
    id: 'scene-challenges',
    labelKey: 'sceneLabels.challenges',
    contentIds: ['adoption-barriers', 'industry-barriers', 'remaining-challenges'],
    visual: 'barriers',
    previews: [
      { sectionId: 'adoption-barriers', kind: 'bullet', listIndex: 0, itemIndex: 0 },
      { sectionId: 'remaining-challenges', kind: 'bullet', listIndex: 0, itemIndex: 0 },
    ],
  },
  { id: 'scene-regional-map', labelKey: 'regionalMap.title', contentIds: ['regional-deployment'], visual: 'map' },
  { id: 'scene-closing', labelKey: 'sceneLabels.closing', contentIds: [], visual: 'truck' },
] as const satisfies readonly PresentationScene[]
