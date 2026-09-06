# Broadridge Growth Intelligence

An ontology-powered commercial operating system for Broadridge's international
funds business. Eleven modules are live views over one shared data model, so a
single signal — a UCITS cross-border marketing event, say — reads identically
wherever it surfaces.

The default landing page is **Control Centres**, a rotating gallery of live
operational dashboards.

## Build status

Phase 1 of 13 is complete: the shared ontology, the state and evidence design
system, navigation, and the Control Centres carousel with all nine cards
reading real derived values. Every other module has a working route and header
and is built in a later phase.

| Phase | Module |
|---|---|
| 1 ✅ | Foundation + Control Centres |
| 2 | Accounts · 3 Growth · 4 Markets · 5 Deals · 6 People |
| 7 | Delivery · 8 Knowledge Graph · 9 Global · 10 Evidence · 11 Tasks |
| 12 | Prepare me · 13 Responsive, accessibility and polish |

## Principles the code holds to

- **No literal metrics.** Everything a card shows is computed in
  `src/lib/gi/metrics.ts` from the ontology. A card claiming 42 accounts over a
  list of five would undo the product's own argument on the first click.
- **Four visible states.** Verified fact, system suggestion, seller hypothesis
  and still-to-learn are distinguished everywhere. Uncertain commercial
  inference is never presented as fact.
- **Identity and commercial state are separate.** Real people appear in real,
  publicly sourced roles. What they will do is never asserted — see the
  governing rules in `src/lib/gi/types.ts` and the checks that enforce them in
  `src/lib/gi/integrity.ts`.

## Develop

```bash
npm install
npm run dev     # http://localhost:3000
npm run lint
npm run build
```

## Layout

```
src/lib/gi/          the shared ontology — types, taxonomy, seed data,
                     selectors, scoring, derived metrics, integrity checks
src/components/ui/   the state and trust design system
src/components/      app shell, module registry, Control Centres
src/components/graph/  the constellation renderer, retargeted in phase 8
```

## Data

Illustrative prototype data throughout. Organisation names, entity names, fund
structures and executive appointments are public facts with sources attached;
all commercial state — relationships, renewals, opportunity values, hypotheses
— is illustrative and labelled as such in the interface.
