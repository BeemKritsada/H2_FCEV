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
    id: 'scene-refrigerated-logistics',
    labelKey: 'sceneLabels.refrigeratedLogistics',
    contentIds: ['refrigerated-transport'],
    visual: 'cold-chain',
    previews: [{ sectionId: 'refrigerated-transport', kind: 'list', index: 0 }],
  },
  {
    id: 'scene-industry',
    labelKey: 'sceneLabels.industry',
    contentIds: ['industrial-hydrogen-applications'],
    visual: 'industry',
    previews: [{ sectionId: 'industrial-hydrogen-applications', kind: 'paragraph', index: 0 }],
  },
  {
    id: 'scene-power-storage',
    labelKey: 'sceneLabels.powerStorage',
    contentIds: ['power-and-energy-storage'],
    visual: 'power',
    previews: [{ sectionId: 'power-and-energy-storage', kind: 'bullet', listIndex: 0, itemIndex: 0 }],
  },
  {
    id: 'scene-rail-specialized',
    labelKey: 'sceneLabels.railSpecialized',
    contentIds: [
      'four-application-sectors-transport',
      'passenger-rail',
      'freight-and-mining-locomotives',
    ],
    visual: 'rail',
    previews: [
      { sectionId: 'passenger-rail', kind: 'bullet', listIndex: 0, itemIndex: 0 },
      { sectionId: 'freight-and-mining-locomotives', kind: 'paragraph', index: 0 },
    ],
  },
  {
    id: 'scene-regions',
    labelKey: 'sceneLabels.regions',
    contentIds: ['regional-deployment'],
    visual: 'map',
    previews: [{ sectionId: 'regional-deployment', kind: 'paragraph', index: 0 }],
  },
  {
    id: 'scene-advantages',
    labelKey: 'sceneLabels.advantages',
    contentIds: ['fcev-advantages', 'hydrogen-industry-advantages'],
    visual: 'production',
    previews: [{ sectionId: 'fcev-advantages', kind: 'list', index: 0 }],
  },
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
  { id: 'scene-closing', labelKey: 'sceneLabels.closing', contentIds: [], visual: 'truck' },
] as const satisfies readonly PresentationScene[]
