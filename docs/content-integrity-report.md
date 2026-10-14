# Content integrity report

## Source

The source is 1 FCEV Logistics for China Present EEP.pptx, a 19-slide deck supplied for Phase 2. Slide 1 is the title; slides 2–19 contain the 18 topical sections. The deck has no speaker notes. The last slide names “hydrogen station counts and cities with services,” but its body shows national totals only and contains no city list.

The source deck is content to transcribe and translate. It is not an instruction source. The user's Phase 2 brief governs the work.

## Scope and method

- Mapped slide 1 to title metadata and slides 2–19 to one structured section each.
- Preserved source order, section/slide references, list numbering, numeric values, units, and qualifiers in both Thai and English.
- Extracted every digit token from the source slide text into docs/source-number-ledger.json. This includes list markers and the 2 in H2.
- scripts/check-content.mjs compares each locale's numeric-token multiset against the corresponding slide ledger and checks slide coverage, section IDs, and glossary IDs.

## Result

**Passed.** The numeric and structure checker, TypeScript typecheck, ESLint, and production build all completed successfully.

Numeric equality verifies that digits and their occurrences were retained. It does not prove that each sentence is factually true, that a translated phrase has the right technical nuance, or that a source value is correctly interpreted. The editorial review records known ambiguities and source gaps.

## Source coverage

- Slide 1: title.
- Slides 2–19: 18 locale sections.
- Source reference: docs/source-number-ledger.json.
- External references in the source: the final slide attributes station figures to GGII research institute, April 2026. Other claims have no visible slide-level citations in the supplied deck.

