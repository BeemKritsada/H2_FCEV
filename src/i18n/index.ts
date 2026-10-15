import i18n from 'i18next'
import { initReactI18next } from 'react-i18next'
import en from '../content/en/common.json'
import th from '../content/th/common.json'
import enBatchTwo from '../content/en/batch-two.json'
import thBatchTwo from '../content/th/batch-two.json'
import enBatchThree from '../content/en/batch-three.json'
import thBatchThree from '../content/th/batch-three.json'
import enBatchFour from '../content/en/batch-four.json'
import thBatchFour from '../content/th/batch-four.json'
import enBatchFive from '../content/en/batch-five.json'
import thBatchFive from '../content/th/batch-five.json'
import enBatchSeven from '../content/en/batch-seven.json'
import thBatchSeven from '../content/th/batch-seven.json'
import enBatchEight from '../content/en/batch-eight.json'
import thBatchEight from '../content/th/batch-eight.json'
import enColdChainScene from '../content/en/cold-chain-scene.json'
import thColdChainScene from '../content/th/cold-chain-scene.json'
import enBatchNine from '../content/en/batch-nine.json'
import thBatchNine from '../content/th/batch-nine.json'
import enRegionalMap from '../content/en/regional-map.json'
import thRegionalMap from '../content/th/regional-map.json'
import enOpeningHero from '../content/en/opening-hero.json'
import thOpeningHero from '../content/th/opening-hero.json'
import enShell from '../content/en/shell.json'
import thShell from '../content/th/shell.json'

export const i18nReady = i18n.use(initReactI18next).init({
  resources: {
    en: { common: { ...en, batchTwo: enBatchTwo, batchThree: enBatchThree, batchFour: enBatchFour, batchFive: enBatchFive, batchSeven: enBatchSeven, batchEight: enBatchEight, coldChainScene: enColdChainScene, batchNine: enBatchNine, regionalMap: enRegionalMap, openingHero: enOpeningHero, shell: enShell } },
    th: { common: { ...th, batchTwo: thBatchTwo, batchThree: thBatchThree, batchFour: thBatchFour, batchFive: thBatchFive, batchSeven: thBatchSeven, batchEight: thBatchEight, coldChainScene: thColdChainScene, batchNine: thBatchNine, regionalMap: thRegionalMap, openingHero: thOpeningHero, shell: thShell } },
  },
  lng: 'en',
  fallbackLng: 'en',
  defaultNS: 'common',
  interpolation: {
    escapeValue: false,
  },
})

export default i18n
