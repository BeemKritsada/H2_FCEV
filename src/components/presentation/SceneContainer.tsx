import { useTranslation } from 'react-i18next'
import type { PresentationLocale, PresentationSection } from '../../content/schema'
import type { PresentationScene, SceneContentPreview } from '../../scenes/scene-config'
import { SceneVisual } from './SceneVisual'
import { SourceStatisticText } from './SourceStatisticText'
import { OpeningScene } from './OpeningScene'
import { ChinaOverviewScene, ProductionMixScene } from './ReferenceScenes'
import { EquipmentTechnologyScene, GreenHydrogenScene } from './batch1/BatchOneScenes'
import { HydrogenTransportScene, InfrastructureExpansionScene, RefuelingNetworkScene } from './batch2/BatchTwoScenes'
import { MarketStructureScene, MarketTransitionScene, VehicleFleetScene } from './batch3/BatchThreeScenes'
import { DistributedPowerScene, HydrogenCofiringScene, PowerStorageScene } from './batch4/BatchFourScenes'
import { FoshanTramScene, HeavyLogisticsRegionsScene, LogisticsApplicationsScene, SuburbanTrainScene, TourismTramsScene, TruckPerformanceScene } from './batch5/BatchFiveScenes'
import { FreightLocomotiveScene, MiningLocomotivesScene, RailDeploymentScene } from './batch7/BatchSevenScenes'
import { ChallengesScene } from './batch8/ChallengesScene'
import { ColdChainComparisonScene } from './coldchain/ColdChainComparisonScene'
import { IndustryScene } from './batch9/IndustryScenes'
import { RegionalMapScene } from './batch11/RegionalMapScene'
import { SpeakerClosingScene } from './closing/SpeakerClosingScene'
import { ExecutiveHeroScene } from './opening/ExecutiveHeroScene'

interface SceneContainerProps {
  scene: PresentationScene
  sceneNumber: number
  sceneCount: number
  presentation: PresentationLocale
}

interface PreviewBlock {
  id: string
  items: string[]
}

function findSection(presentation: PresentationLocale, sectionId: string): PresentationSection | undefined {
  return presentation.sections.find((section) => section.id === sectionId)
}

function resolvePreview(
  presentation: PresentationLocale,
  selection: SceneContentPreview,
  index: number,
): PreviewBlock | undefined {
  const section = findSection(presentation, selection.sectionId)
  if (!section) return undefined

  if (selection.kind === 'paragraph') {
    const paragraph = section.paragraphs?.[selection.index]
    return paragraph ? { id: selection.sectionId + '-paragraph-' + index, items: [paragraph] } : undefined
  }

  if (selection.kind === 'list') {
    const items = section.bulletLists?.[selection.index]?.items
    return items?.length ? { id: selection.sectionId + '-list-' + index, items } : undefined
  }

  const item = section.bulletLists?.[selection.listIndex]?.items[selection.itemIndex]
  return item ? { id: selection.sectionId + '-bullet-' + index, items: [item] } : undefined
}

export function SceneContainer({
  scene,
  sceneNumber,
  sceneCount,
  presentation,
}: SceneContainerProps) {
  const { t } = useTranslation()
  const sourceSections = scene.contentIds
    .map((id) => findSection(presentation, id))
    .filter((section): section is PresentationSection => Boolean(section))
  const primarySection = sourceSections[0]
  const isTitleScene = scene.contentIds.length === 0
  const title = isTitleScene
    ? presentation.title.translatedText ?? presentation.title.text
    : primarySection?.heading ?? t('content.unavailable')
  const previews = (scene.previews ?? [])
    .map((selection, index) => resolvePreview(presentation, selection, index))
    .filter((preview): preview is PreviewBlock => Boolean(preview))
  const sourceSlides = Array.from(
    new Set(sourceSections.flatMap((section) => section.sourceSlideNumber)),
  )
  const sourceSlide = primarySection?.sourceSlideNumber ?? 0
  if (isTitleScene) sourceSlides.push(presentation.title.sourceSlideNumber)

  if (scene.id === 'scene-opening') return <ExecutiveHeroScene />
  if (scene.id === 'scene-closing') return <SpeakerClosingScene count={sceneCount} number={sceneNumber} />

  if (isTitleScene) {
    return <OpeningScene presentation={presentation} closing={scene.id === 'scene-closing'} />
  }

  if (scene.id === 'scene-china-scale') return <ChinaOverviewScene count={sceneCount} />
  if (scene.id === 'scene-production-mix') return <ProductionMixScene count={sceneCount} />
  if (scene.id === 'scene-green-hydrogen') return <GreenHydrogenScene count={sceneCount} number={sceneNumber} />
  if (scene.id === 'scene-equipment-technology') return <EquipmentTechnologyScene count={sceneCount} number={sceneNumber} />
  if (scene.id === 'scene-infrastructure') return <RefuelingNetworkScene count={sceneCount} number={sceneNumber} />
  if (scene.id === 'scene-infrastructure-expansion') return <InfrastructureExpansionScene count={sceneCount} number={sceneNumber} />
  if (scene.id === 'scene-hydrogen-transport') return <HydrogenTransportScene count={sceneCount} number={sceneNumber} />
  if (scene.id === 'scene-vehicle-deployment') return <VehicleFleetScene count={sceneCount} number={sceneNumber} />
  if (scene.id === 'scene-market-transition') return <MarketTransitionScene count={sceneCount} number={sceneNumber} />
  if (scene.id === 'scene-market-structure') return <MarketStructureScene count={sceneCount} number={sceneNumber} />
  if (scene.id === 'scene-power-storage') return <PowerStorageScene count={sceneCount} number={sceneNumber} sourceSlide={sourceSlide} />
  if (scene.id === 'scene-distributed-power') return <DistributedPowerScene count={sceneCount} number={sceneNumber} sourceSlide={sourceSlide} />
  if (scene.id === 'scene-hydrogen-cofiring') return <HydrogenCofiringScene count={sceneCount} number={sceneNumber} sourceSlide={sourceSlide} />
  if (scene.id === 'scene-heavy-duty-logistics') return <LogisticsApplicationsScene count={sceneCount} number={sceneNumber} />
  if (scene.id === 'scene-truck-performance') return <TruckPerformanceScene count={sceneCount} number={sceneNumber} />
  if (scene.id === 'scene-heavy-logistics-regions') return <HeavyLogisticsRegionsScene count={sceneCount} number={sceneNumber} />
  if (scene.id === 'scene-suburban-train') return <SuburbanTrainScene count={sceneCount} number={sceneNumber} />
  if (scene.id === 'scene-foshan-tram') return <FoshanTramScene count={sceneCount} number={sceneNumber} />
  if (scene.id === 'scene-tourism-trams') return <TourismTramsScene count={sceneCount} number={sceneNumber} />
  if (scene.id === 'scene-freight-locomotive') return <FreightLocomotiveScene count={sceneCount} number={sceneNumber} />
  if (scene.id === 'scene-mining-locomotives') return <MiningLocomotivesScene count={sceneCount} number={sceneNumber} />
  if (scene.id === 'scene-rail-deployment') return <RailDeploymentScene count={sceneCount} number={sceneNumber} />
  if (scene.id === 'scene-cold-chain-comparison') return <ColdChainComparisonScene count={sceneCount} number={sceneNumber} />
  if (scene.id === 'scene-industry-advantages') return <IndustryScene kind="advantages" count={sceneCount} number={sceneNumber} />
  if (scene.id === 'scene-industry-barriers') return <IndustryScene kind="barriers" count={sceneCount} number={sceneNumber} />
  if (scene.id === 'scene-challenges') return <ChallengesScene count={sceneCount} number={sceneNumber} />
  if (scene.id === 'scene-regional-map') return <RegionalMapScene count={sceneCount} number={sceneNumber} />

  return (
    <section aria-labelledby="scene-title" className={`scene-container scene-container--${scene.visual}`}>
      <div className="scene-copy">
        <div className="scene-copy__eyebrow">
          <span className="scene-copy__scene-label">{t(scene.labelKey)}</span>
          <span aria-hidden="true" className="scene-copy__eyebrow-divider" />
          <span className="scene-copy__position">
            {String(sceneNumber).padStart(2, '0')} / {String(sceneCount).padStart(2, '0')}
          </span>
        </div>

        <h1 aria-live="polite" className="scene-copy__title" id="scene-title">
          {title}
        </h1>

        {primarySection?.subheading && (
          <p className="scene-copy__subheading">{primarySection.subheading}</p>
        )}

        {previews.length > 0 ? (
          <div className="scene-copy__preview">
            {previews.map((preview) => (
              <div className="scene-copy__preview-block" key={preview.id}>
                {preview.items.length === 1 ? (
                  <p><SourceStatisticText text={preview.items[0]!} sectionId={preview.id} /></p>
                ) : (
                  <ul>
                    {preview.items.map((item, itemIndex) => (
                      <li key={preview.id + '-' + itemIndex}><SourceStatisticText text={item} sectionId={preview.id} /></li>
                    ))}
                  </ul>
                )}
              </div>
            ))}
          </div>
        ) : isTitleScene ? (
          <p className="scene-copy__intro">{t('brand.descriptor')}</p>
        ) : (
          <p className="scene-copy__intro">{primarySection?.paragraphs?.[0] ?? primarySection?.bulletLists?.[0]?.items[0] ?? t('content.unavailable')}</p>
        )}

        <div aria-label={t('navigation.sourceSlides')} className="scene-copy__sources">
          <span className="scene-copy__sources-label">{t('navigation.sourceSlides')}</span>
          {sourceSlides.map((slideNumber) => (
            <span className="source-chip" key={slideNumber}>
              {String(slideNumber).padStart(2, '0')}
            </span>
          ))}
        </div>
      </div>

      <div className="scene-container__visual">
        <span className="scene-visual__tag">{t('navigation.scenePreview')}</span>
        <SceneVisual scene={scene} presentation={presentation} />
      </div>
    </section>
  )
}
