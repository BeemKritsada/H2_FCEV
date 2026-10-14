// Batch 5/6 explicitly requests a global count-up migration, restart control,
// and removal of the visible 900,000-unit warning. These six component files
// are covered by SSR value/qualifier checks and browser interaction checks.
// Original facts, locale content, scene styles and assets stay hash-protected.
export const numberMigrationFiles = new Set([
  'src/components/presentation/ReferenceScenes.tsx',
  'src/components/presentation/AnimatedNumber.tsx',
  'src/app/App.tsx',
  'src/components/presentation/PresentationControls.tsx',
  'src/components/presentation/batch1/BatchOneScenes.tsx',
  'src/components/presentation/batch2/BatchTwoScenes.tsx',
])
