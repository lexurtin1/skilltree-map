# Today: design and implementation

## Review of the existing product

Reviewed the local implementation of ControlCentres, its dashboard components, AppShell, global tokens, account routes and the existing `artifacts/ui-review/gallery-review.png` capture. The supplied GitHub URL could not be retrieved; this workspace is a source export without `.git` metadata. This is a local implementation, not a published repository change.

Retain the Broadridge lockup, navy brand anchor, IBM Plex Sans and Plex Serif, pale surfaces, quiet borders, established module icons, search, Prepare me, account routes and explicit separation of fact from suggestion. These are already a credible foundation.

Replace the home carousel, atmospheric shader, gallery pagination and dashboard-within-a-dashboard framing. In the reviewed Growth screen, five equal KPI tiles precede a scatter plot and two recommendation/research lists. Their similar visual weight makes a count of registrations compete with an account needing intervention. A score locates an account on an abstract scale but does not explain its buyer gap, change or next step. The recommendation list repeats what the plot suggests without showing the causal relationship. Rotating among modules fragments the same account across separate views and makes preparation a navigation task.

The old components remain available in source for the existing system; `/` now renders Today. The shared shell retains identity and utility actions, with a persistent labelled destination rail replacing hover-only module labels. All nine modules and Today are reachable directly. On narrow screens the rail scrolls normally, including through keyboard focus; the existing menu also provides named destinations.

## Concept and hierarchy

The exact area labels are **Your book**, **Pipeline activity**, **Priority action**, and **What changed**. The page leads with a one-sentence editorial briefing, then an asymmetric working composition. A single dark navy priority area anchors the page. Open account branches and deal paths use fine rules rather than separate dashboard cards.

```text
+-----------------------------------------------------------------------+
| BROADRIDGE · GROWTH INTELLIGENCE                 Search  Prepare me Menu|
| TODAY  Growth Accounts Deals Markets People Delivery Graph Global Evidence|
+-----------------------------------------------------------------------+
| MONDAY 7 SEPTEMBER 2026                                  James Howard  |
| Today.                                      Strategic Account Director|
| Start with Fidelity. Distribution change → today's discovery meeting. |
| My accounts  All accounts  Focus                                      |
|                                                                       |
| 01 YOUR BOOK                         | PRIORITY ACTION                 |
| ↗ New opportunity ─ Fidelity         | Prepare for Fidelity meeting    |
|                   ├ Nordea           | Today, 09:45–10:30 BST           |
|                   └ Waystone         | [Prepare meeting]               |
| △ Needs attention ─ Schroders        | [Open account] [View evidence]   |
|                   └ Janus Henderson  |                                 |
| ! Material risk ─── M&G              | 01 Fact: distribution expansion |
| ● Stable ────────── BlackRock, Amundi | 02 Assessment: possible need    |
|                                     |                                 |
| SELECTED ACCOUNT                    | James → Sarah ┄ Marcus          |
| Change → Who matters → Next step    | Strong route   Coverage gap     |
| Assessment / product fit / evidence |                                 |
| Concentration & relationship limits  | 03 Suggested meeting goal       |
|                                     | Confidence / source freshness   |
| 02 PIPELINE ACTIVITY     This week   |                                 |
| Fidelity   ●────────●┄┄┄┄○          |                                 |
|            Change   Today Qualify   |                                 |
| Schroders  ●────────●┄┄┄┄○          |                                 |
|            ↳ economic owner absent  |                                 |
| M&G        ●┄┄┄┄┄┄┄○┄┄┄┄○          |                                 |
|            ↳ service/value concerns |                                 |
| Waystone   ●┄┄┄┄┄┄┄○┄┄┄┄○          |                                 |
|            ↳ qualify before CRM     |                                 |
|                                                                       |
| 03 WHAT CHANGED                                                       |
| Today 08:12 → Yesterday 16:38 → Friday 14:05 → Friday 11:20            |
| Fidelity      Schroders        M&G           Janus Henderson          |
| Event         Event            Event         Event                    |
| Consequence   Consequence      Consequence   Consequence              |
| Source ↗      Source ↗         Source ↗      Source ↗                  |
+-----------------------------------------------------------------------+
```

Account objects have equal visual weight; size does not imply revenue. State lanes describe commercial condition, not CRM stages. Selecting a name updates the connected explanation beneath the book. Open account always opens that scenario’s complete story, including product relevance, relationships, pipeline condition and evidence. Where an ontology ID exists, a second explicit action opens the existing account route. That record uses a separate seed scenario, disclosed before navigation, so its different illustrative commercial claims are not silently conflated with Today.

Deal paths show reached/agreed milestones as filled circles and future milestones as open circles. Dashed links indicate unresolved progression. Reasons are printed beside the path; no stage interpretation or hover is needed. Fidelity’s discovery is an agreed next step, not a fabricated formal deal advancement. Invesco, included under Team accounts, demonstrates recorded advancement. This month additionally exposes the older inactive Janus path. All account risks remain in the book regardless of this pipeline time filter.

The selected-account trace and the priority source sequence share a reading order: recorded change → interpretation → people required → proposed action. Evidence panels make the underlying source-to-claim mapping explicit. M&G’s service concern affects both its risk lane and its renewal path. Sarah’s solid contact outline and Marcus’s dashed outline distinguish a credible route from missing direct coverage. No line is decorative network connectivity.

Book health is qualitative and mixed: stable accounts coexist with growth potential and unresolved concerns. A disclosure calls out dependence on Sarah and the missing Schroders owner. Revenue concentration is explicitly unavailable because no account revenue denominator exists. Production must supply those values before displaying a concentration assessment.

### Fidelity preparation sequence

1. Read the briefing and click **Prepare meeting**, visible near the top of the priority area.
2. A labelled modal shows the meeting time, participants, proposed goal and three discovery questions.
3. Expand **Review evidence** to inspect all four timestamped example excerpts and what each supports. The source cannot establish a confirmed buying need.
4. Review Sarah’s route to Marcus, choose the question to test the need, and tick the three preparation checks. Add optional meeting notes.
5. **Mark preparation complete** becomes available when all checks are done. It closes the modal and updates the priority action to **Review meeting preparation**. Notes and checks survive reopening within this page session.
6. Escape or Close cancels the panel and restores focus. No email, calendar invitation or CRM write occurs. Reloading or navigating away clears preparation memory.

## Design system extension

| Purpose | Token / treatment | Meaning |
|---|---|---|
| Brand/action | existing `--brand: #001f5a` | Primary action and active destination |
| Working surface | warm `#fafbf9`, translucent `#eaf0f1` | Open reading space; selected context |
| Depth | pale aqua `#e9f3f2`, lilac `#e6e6f1` | Static background only |
| Stable | slate teal `#667f88`, ● + Stable | No material concern in supplied review |
| New opportunity | teal `#237d73`, ↗ + New opportunity | Change suggests a possible new need |
| Needs attention | amber `#966214`, △ + label | Coverage or progression intervention |
| Material risk | crimson `#ae3546`, outlined ! + label | Delivery/renewal exposure requiring action |
| Needs more information | dashed outline/line + explicit unknown | Missing buyer, scope or confirmed need |
| Verified evidence | existing `--ev-fact: #14477e`, check + Verified label | Reserved for a source actually verified; never applied to Today’s example excerpts |
| Assessment | muted lilac provenance line + Assessment label | Inference, with qualitative confidence |
| Selection | pale aqua fill, 2px leading rule, `aria-pressed` | Chosen account, independent of its health |

Serif is reserved for the major Today page title (48–62px); section titles and the priority heading use precise sans-serif. Body copy is 12–14px, source metadata 9–11px, with expandable source text in the panel. Production accessibility review should check comfortable reading at users’ actual display scale. Spacing uses a 4/8px rhythm with 24–48px section separation. Borders are 1px pale blue-grey; only the priority area and modal receive meaningful elevation. Avoid enclosing every piece of information in a rounded card.

Focus uses the existing 2px outline and 2px offset; navy surfaces use a pale aqua outline. State never relies on colour alone. No tooltip is required to understand any new control. Transitions are limited to 160ms colour/background changes; reduced motion removes them. There is no automatic animation or content advancement on Today.

## Component and data plan

Implemented in `src/components/today/`:

| Component / contract | Responsibility |
|---|---|
| `TodayPage` | Server route entry; renders Today within the existing shell |
| `Today` | Owns selection, scope, period, focus, tier, panel and preparation session state; composes the four areas |
| `SectionHeading` | Consistent numbered section hierarchy |
| `StateMark` | Shape and colour from one state registry |
| `TodayDialog` | Native modal for account story, evidence or preparation; focus containment, Escape and trigger restoration |
| `TodayAccount` | Stable scenario ID, optional ontology record ID, condition, change, relevance, relationship, action, confidence, sources, filters and optional deal path |
| `Source` | Source ID, source kind, display timestamp, exact illustrative excerpt and claim it supports |
| `BookState` / `Focus` | Constrained state and filtering vocabularies |
| `loading.tsx` / `error.tsx` | Non-animated route status; clear error with retry using the installed Next 16.3 API |

Types are the build contracts in `data.ts`; they are not duplicated in this document. Book and pipeline rendering stay local to Today for this first iteration. Extract `BookMap`, `SelectedAccountTrace`, `PipelineActivity`, `PriorityAction` and `ChangeSequence` when live query ownership or role variants require independent boundaries. No chart library or new application dependency is needed.

### Data and exceptional states

- **Empty:** each lane explains when no account matches. Pipeline and change sequence have explicit empty copy. Selection automatically falls back to a visible account. There is no empty metric presented as zero revenue.
- **Loading:** the route fallback announces loading with `role=status` and `aria-busy`; existing navigation remains usable. The static scenario normally prerenders without a visible wait.
- **Error:** the shared route error boundary states assessments are unavailable and offers Try again. It does not substitute healthy-looking fictional values.
- **Stale:** the entire page is explicitly a fixed 7 September briefing, not a live clock. Each evidence excerpt shows its time and the panel warns that freshness is relative to this fixed snapshot. Production adapters must use ISO `observedAt`, `retrievedAt`, verification status, source URI, entitlement, and per-source freshness policies; preserve last known facts and flag stale assessments before permitting CRM writes. No live freshness check is implemented.
- **Missing source:** scenario panels explicitly say originals are unavailable and excerpts are not verified evidence. Do not manufacture document links.
- **Preparation:** incomplete checklist disables completion with explanatory text. Completion is local and reversible by reviewing the checklist; session notes are never represented as persisted work.

At desktop widths, book and pipeline occupy the wider left column and priority spans the right. Below 760px, priority moves first and all areas stack. The change sequence becomes two columns then one. Account branches wrap, and paths remain legible without drag gestures. A native dialog provides modal semantics and focus trapping. Inputs have associated labels; selection has `aria-pressed`, active navigation `aria-current`, and changing account context a polite live region. Decorative icons are hidden from accessibility APIs. There is no hover-only information.

### Role adaptation

This implementation is the requested Strategic Account Director view. Team accounts is a scope filter, not an impersonation switch. A production role configuration should change ordering and selection of the same objects:

| Role | First emphasis | Same underlying grammar |
|---|---|---|
| Strategic Account Director | Named book, next client meeting, coverage, renewal | Account → people → deal → evidence |
| Sales Manager | Team deal blockage and coaching action | Show owner and buyer dependency on each named path |
| Commercial Leader | Revenue protection, cross-region exposure, concentration | Account groups with real revenue denominators and provenance |

Do not invent role-specific scores or present the team sample as a complete manager product. Additional role presentations are design guidance, not implemented user modes.

## Run and verify

```sh
npm install
npm run dev
npm run lint
npx tsc --noEmit
npm run build
```

Open `http://localhost:3000/`. No environment variables or API keys are required. This workspace already had a running development server; an install attempt hit a locked native image library, so validation used the existing installed packages and server.

Optional browser regression script: `node scripts/test-today.cjs`. It requires Playwright to be installed for development and a local Microsoft Edge installation. It does not add either to application dependencies. `TODAY_URL` overrides localhost:3000 and `TODAY_BROWSER` overrides the Playwright browser channel. Captures are written under `artifacts/ui-review/today-*.png`. Browser checks cover named account access, source counts and provenance, preparation completion and retained session notes, filter interactions, modal focus containment/restoration, mobile overflow and the reduced-motion workflow. Full lint, type checking and production build should also pass before delivery.

## Usability test plan

| Task for a salesperson | Success criterion |
|---|---|
| Find the most useful action before the next meeting | Identifies Fidelity and starts preparation in under 15 seconds without module navigation |
| Identify the renewal requiring intervention and explain why | Names M&G, two service concerns and 29 September within 30 seconds; does not equate risk with a lost renewal |
| Explain why Schroders has not moved and who is missing | Names executive economic owner and sponsor introduction in under 30 seconds; does not answer only with a stage |
| Explain what is known versus assumed about Fidelity | Finds market excerpt, recognises example provenance and unconfirmed need, and explains moderate confidence in under 45 seconds |
| Prepare for Fidelity using keyboard only | Reviews evidence, identifies Sarah’s route to Marcus, enters a question, completes checks and exits with correct focus within two minutes |

Measure time to identify priority action (median/p90), preparation start/completion/abandonment, evidence-view rate per assessment, selected-account-to-action conversion, accepted/deferred/rejected recommendations with seller-supplied reasons, qualified opportunity progression, and stalled-deal recovery after a documented buyer intervention. Compare progression over a realistic sales-cycle window, not immediate click activity. Live telemetry is not implemented. Keep notes and source contents out of analytics; assess recommendation quality alongside completion so superficial checkbox acceptance is not treated as commercial impact.
