import i18n from 'i18next'
import { initReactI18next } from 'react-i18next'
import en from '../content/en/common.json'
import th from '../content/th/common.json'
import enBatchTwo from '../content/en/batch-two.json'
import thBatchTwo from '../content/th/batch-two.json'
import enBatchThree from '../content/en/batch-three.json'
import thBatchThree from '../content/th/batch-three.json'

export const i18nReady = i18n.use(initReactI18next).init({
  resources: {
    en: { common: { ...en, batchTwo: enBatchTwo, batchThree: enBatchThree } },
    th: { common: { ...th, batchTwo: thBatchTwo, batchThree: thBatchThree } },
  },
  lng: 'en',
  fallbackLng: 'en',
  defaultNS: 'common',
  interpolation: {
    escapeValue: false,
  },
})

export default i18n
