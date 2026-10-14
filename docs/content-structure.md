# Content architecture

## Purpose and scope

This phase organizes the source presentation as typed, locale-ready content. It does not implement website screens, navigation, scenes, 3D assets, or animation. The PowerPoint supplied for this phase is treated as source material; the Phase 2 brief is the instruction set.

## Source and locale layout

- src/content/schema.ts defines the shared TypeScript content model.
- src/content/th/sections/index.json and src/content/en/sections/index.json contain one content section for each source slide 2–19.
- src/content/th/presentation.ts and src/content/en/presentation.ts bind localized sections and glossary entries to the shared model.
- src/content/th/glossary.json and src/content/en/glossary.json hold parallel terminology records; each locale's glossary.ts provides its typed export.
- docs/source-number-ledger.json stores numeric tokens extracted from each original slide, including list markers and the 2 in H2.
- docs/content-integrity-report.md and docs/editorial-review.md record the comparison method and unresolved source questions.

Slide 1 is represented by presentation title metadata. Slides 2–19 are represented by 18 content sections. Each section has a stable ID and records its source slide and source section number so future layouts can link back to the source.

## Shared model

PresentationLocale contains the language, title metadata, sections, and glossary. PresentationSection provides:

- id: stable content identifier, shared between Thai and English.
- sourceSectionNumber and sourceSlideNumber: traceability back to the source deck.
- narrativeGroup: broad editorial grouping for future content selection.
- heading, optional subheading, and paragraphs: authored text in reading order.
- bulletLists: source-ordered grouped points; labels are optional.
- emphasis: optional short phrases for later presentation treatment.
- facts: optional structured facts for later reuse; source claims remain in authored text unless separately modeled.
- editorialNoteIds: links to unresolved questions or source-quality notes in the editorial review.

Narrative groups are industry-overview, hydrogen-supply, vehicle-deployment, applications, commercial-logistics, rail-transport, advantages-limitations, and regional-deployment. They describe content topic only and do not dictate a UI or narrative transition.

## Editorial handling

The Thai text is the source language in the supplied deck. The English text is a faithful translation of its meaning and quantities, not an independent fact-check. Clear typographical errors and obvious spacing issues were normalized in the Thai content; material ambiguities and source inconsistencies are logged rather than silently corrected. Place names whose intended form is uncertain are kept transliterated and flagged. Where the source slide contains a numeric list marker, it is retained in the content so the original sequence remains visible and verifiable.

## Extension rules

1. Keep Thai and English section IDs and source-slide mapping identical.
2. Add new content only with a source reference or an explicit editorial note.
3. Preserve values, units, comparison baselines, denominators, and qualifiers from the source.
4. Keep editorial commentary in documentation, separate from presentation copy.
5. Store future verified external citations alongside the specific claim and its source; do not infer a citation from a place name or institution mentioned in the deck.
