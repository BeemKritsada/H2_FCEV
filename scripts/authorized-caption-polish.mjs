import { readFileSync } from 'node:fs'

// Global caption polish (2026-10-15): each entry is one explicitly authorized wording change.
// Protected-file checks swap every `after` back to its `before`, so the reconstructed file must
// still match the original baseline byte for byte; any other edit keeps failing those checks.
const record = JSON.parse(readFileSync('docs/caption-polish-authorized.json', 'utf8'))
export const captionPolishChanges = record.changes

export function revertCaptionPolish(path, text) {
  let result = text
  for (const { path: file, key, before, after } of captionPolishChanges) {
    if (file !== path) continue
    const from = JSON.stringify(after)
    if (result.split(from).length !== 2) throw new Error(`${path}: authorized caption ${key} not found exactly once`)
    result = result.replace(from, () => JSON.stringify(before))
  }
  return result
}

/** File contents as they were before the authorized caption polish. */
export const readPrePolish = (path) => revertCaptionPolish(path, readFileSync(path, 'utf8'))
