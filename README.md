# Broadridge Growth Intelligence

A React / TypeScript commercial intelligence prototype built with Next.js 16.3.

The home route is **Today**, a personalised briefing for James Howard: a named
account book, causal account context, pipeline movement, evidence-linked changes,
Fidelity meeting preparation, and a persistent **Ask** dock that answers from the
same mocked scenario data. Existing modules, account records, search and
Prepare me remain available through the shared application shell.

## Develop

```sh
npm install
npm run dev
```

Open http://localhost:3000. No API keys are required.

## Demo sequence (executive pitch)

1. Load `/` — the Fidelity **Priority action** is already visible (no interaction).
2. Select **Fidelity International** in Your book (or leave it selected). In Ask,
   ask *How confident are we that this is real?* — the answer cites the same
   market / meeting evidence as the priority card.
3. Click **Clear context** (Ask header or selected-account Clear). Ask *Which of
   my accounts have the weakest executive coverage right now?* — the panel ranks
   coverage gaps from the shared people records (Fidelity / Schroders / Janus).
4. Leave Ask open. Use the bottom-right **Demo → Simulate new signal** control.
   A new Amundi item appears under **What changed**; the chat history is unchanged.

Suggested Ask chips switch automatically between book-level and account-level
questions. Collapse Ask if you need a wider feed; expand restores the dock.

## Verify

```sh
npm run lint
npx tsc --noEmit
npm run build
```

Optional browser checks: `node scripts/test-today.cjs` (requires a development
installation of Playwright and Microsoft Edge). See [Today design and implementation](TODAY-DESIGN.md)
for the critique, ASCII wireframe, state system, data contracts, role adaptation,
exceptional states, browser-test setup and five-task usability plan.

## Data and scope

Today uses an explicitly labelled, fixed illustrative scenario for 7 September
2026 in `src/components/today/data.ts` (accounts, people, changes, priority
action, daily briefing). The Ask panel queries that same file via keyword /
entity matching — it does not call an LLM. Honest gap statements are returned
when the scenario has no grounding (for example, delivery history outside M&G’s
renewal note).

People, meetings, source excerpts and commercial conditions are examples, not
verified client records. Preparation notes and checklist completion are held
only in memory for the current page session; there are no CRM writes.

The existing modules use the broader shared ontology in `src/lib/gi/`. Today
links to those account records where an ID exists, with a disclosure that their
separate illustrative commercial state may differ. Revenue concentration and live
source verification are unavailable rather than inferred from invented metrics.

## Layout

- `src/components/today/`: Today feed, Ask dock, query matcher, scenario data and scoped styles.
- `src/components/AppShell.tsx`: shared identity, labelled navigation and utilities.
- `src/lib/gi/`: existing ontology, selectors, metrics and illustrative records.
- `src/app/`: routes and loading/error boundaries.
- `scripts/test-today.cjs`: optional browser regression checks.
- `artifacts/ui-review/today-*.png`: captured Today views.
