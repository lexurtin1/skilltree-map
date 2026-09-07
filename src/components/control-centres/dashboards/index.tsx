"use client";

/**
 * The nine screens.
 *
 * Each answers a different question, so each is drawn in a different form: a
 * distribution for Growth, a divided whole for Accounts, a funnel for Deals, a
 * map for Markets, an orbit for People, a time axis for Delivery, a network for
 * the Knowledge Graph, a globe for Global, a flow for Evidence. Nothing here
 * shares a layout with anything else — from across the room the ring should read
 * as nine different objects, not one object nine times.
 *
 * Two rules hold everywhere:
 *
 * **Every figure is read from the ontology.** Deltas appear only where a real
 * period-on-period comparison exists; `deltaOf` returns null rather than
 * inventing one, and the figure simply omits it.
 *
 * **Every figure goes somewhere.** A screen used to be a picture of a module;
 * now the marks on it are the module's own objects, and clicking an account
 * cell, a fund line or a deal opens that account, that fund, that deal. That is
 * what the extra room bought: not more decoration, more places to press. Empty
 * space still falls through to the module link underneath — see the note on
 * `gi-passthrough` in `ControlCentreCard`.
 */
import { AccountGrid, HealthLegend } from "../viz/AccountGrid";
import { Globe, RegionMap } from "../viz/geo";
import { Beeswarm, BarList, Funnel, Horizon, Segments } from "../viz/plots";
import { FlowChain, Network, RadialGroups } from "../viz/structure";
import { GlassStat, Head, Legend, Note, Plot, Rail, Story, StoryList } from "./shell";
import { MODULE_PALETTE } from "@/lib/gi/palette";
import type { ModuleId } from "@/lib/gi/metrics";
import { PUBLIC_FUNDS } from "@/lib/gi/public-funds";
import { graphScale } from "@/lib/gi/metrics";
import {
  buyingGroups,
  dealFunnel,
  deliveryStats,
  gbpShort,
  globeMarkers,
  latestChanges,
  marketHeat,
  movedMarkets,
  ontologyGraph,
  peopleCoverage,
  prioritySwarm,
  provenanceFlow,
  regionRows,
  renewalHorizon,
  topHubs,
  topReasons,
} from "@/lib/gi/gallery";
import {
  crossBorderFootprint,
  daysAgo,
  expandingAccounts,
  fundStories,
  keyPeople,
  portfolioGrid,
  portfolioTotals,
} from "@/lib/gi/portfolio-view";
import {
  buyingRoleCoverage,
  deliveryByLifecycle,
  deltaOf,
  evidenceByMonth,
  eventsByMonth,
  hypothesesByMonth,
  topMarkets,
  trendOrNull,
} from "@/lib/gi/series";
import {
  allEvents,
  allEvidence,
  allHypotheses,
  allOpportunities,
  allServiceRelationships,
  dealState,
  getAccount,
  healthScore,
  recentEvents,
} from "@/lib/gi/select";

const shell = "flex h-full min-h-0 flex-col gap-3";

/* ── Growth — a distribution ──────────────────────────────────────────────── */

function GrowthDashboard() {
  const palette = MODULE_PALETTE.growth;
  const swarm = prioritySwarm();
  const reasons = topReasons(3);
  const funds = PUBLIC_FUNDS;
  const events = eventsByMonth();
  const hyp = hypothesesByMonth();
  const footprint = crossBorderFootprint();
  const high = swarm.filter((s) => s.x >= 60).length;
  const value = allHypotheses().reduce((sum, h) => sum + (h.potentialValue ?? 0), 0);

  return (
    <div className={shell}>
      <Head question="Which accounts changed in a way that makes us relevant?" range="45d" palette={palette} />

      <div className="grid shrink-0 grid-cols-5 gap-3">
        <GlassStat label="Scored high" value={String(high)} note={`of ${swarm.length} accounts`} href="/growth" />
        <GlassStat label="Indicative value" value={gbpShort(value)} note="across open reasons" href="/growth" />
        <GlassStat
          label="New registrations"
          value={String(footprint.fresh)}
          note={`across ${footprint.funds} fund ranges`}
          href="/markets"
        />
        <GlassStat
          label="Verified changes"
          value={String(recentEvents(45).length)}
          note="last 45 days"
          href="/evidence"
          palette={palette}
          spark={trendOrNull(events)}
          {...(deltaOf(events) ?? {})}
        />
        <GlassStat
          label="Open reasons"
          value={String(allHypotheses().length)}
          note="hypotheses on file"
          href="/growth"
          palette={palette}
          spark={trendOrNull(hyp)}
          {...(deltaOf(hyp) ?? {})}
        />
      </div>

      <Plot
        title="Priority across the portfolio"
        subtitle="one dot per account · filled = existing client"
        className="shrink-0"
      >
        <Beeswarm
          points={swarm}
          palette={palette}
          bands={[
            { from: 0, to: 35, label: "low" },
            { from: 35, to: 60, label: "medium" },
            { from: 60, to: 100, label: "high" },
          ]}
          width={1080}
          height={120}
        />
      </Plot>

      {/* The reasons as sentences, and the fund facts underneath them. A number
          tells a seller where to look; only the sentence tells them what to say,
          and only the fund line tells them what to say it about. */}
      <div className="grid min-h-0 flex-1 grid-cols-2 gap-3">
        <StoryList title="Highest-scoring reasons" subtitle="score out of 100">
          {reasons.map((r) => (
            <Story
              key={r.id}
              href={`/accounts/${r.accountId}`}
              lead={r.account}
              rest={r.title}
              value={String(r.score)}
              palette={palette}
              pulse
            />
          ))}
        </StoryList>

        <StoryList title="Real fund research" subtitle="issuer snapshots · open for source and date">
          {funds.map((f) => (
            <Story
              key={f.id}
              href={`/funds/${f.id}`}
              lead={f.name}
              rest={`${f.scope} · ${f.holdings.toLocaleString("en-GB")} holdings · ${f.holdingsDate}`}
              value={f.fee ?? "UCITS"}
              palette={palette}
              pulse={false}
            />
          ))}
        </StoryList>
      </div>

      <Note>Priority is 0–100, after a penalty for what we still do not know about the account.</Note>
    </div>
  );
}

/* ── Accounts — a divided whole ───────────────────────────────────────────── */

function AccountsDashboard() {
  const palette = MODULE_PALETTE.accounts;
  const cells = portfolioGrid();
  const totals = portfolioTotals();

  return (
    <div className={shell}>
      <Head question="What is the current picture across the portfolio?" palette={palette}>
        <span className="shrink-0 text-[10px] font-semibold uppercase tracking-[0.1em] text-[var(--text-4)]">
          {totals.accounts} accounts · {totals.clients} clients
        </span>
      </Head>

      <div className="grid shrink-0 grid-cols-4 gap-3">
        <GlassStat
          label="Opportunity spotted"
          value={String(totals.opportunities)}
          note="accounts carrying a reason"
          href="/growth"
        />
        <GlassStat
          label="Problem accounts"
          value={String(totals.problems)}
          note="health below the midpoint"
          tone={totals.problems ? "var(--state-risk)" : undefined}
          href="/delivery"
        />
        <GlassStat label="Healthy" value={String(totals.healthy)} note="stable or better" href="/delivery" />
        <GlassStat
          label="Share classes"
          value={totals.shareClasses.toLocaleString("en-GB")}
          note={`across ${totals.funds} fund ranges`}
          href="/knowledge-graph"
        />
      </div>

      {/* Sized by footprint, coloured by health, pulsing where an opportunity
          has been spotted — and every cell opens that account. */}
      <div className="gi-plot flex min-h-0 flex-1 items-center justify-center overflow-hidden rounded-xl p-2">
        <AccountGrid cells={cells} width={1080} height={274} />
      </div>

      <div className="flex shrink-0 items-center justify-between gap-4">
        <HealthLegend opportunities={totals.opportunities} />
        <Note>Area is the number of markets an account&rsquo;s funds are sold into. Colour is composed health.</Note>
      </div>
    </div>
  );
}

/* ── Deals — a funnel ─────────────────────────────────────────────────────── */

function DealsDashboard() {
  const palette = MODULE_PALETTE.deals;
  const deals = allOpportunities();
  const stages = dealFunnel();
  const total = deals.reduce((s, d) => s + d.value, 0);
  const intervene = deals.filter((d) => dealState(d) === "intervene").length;
  const slips = deals.reduce((s, d) => s + d.closeDateMoves, 0);
  const avg = Math.round((deals.reduce((s, d) => s + healthScore(d), 0) / Math.max(deals.length, 1)) * 100);
  const worst = [...deals].sort((a, b) => healthScore(a) - healthScore(b)).slice(0, 3);

  return (
    <div className={shell}>
      <Head question="What would have to be true for these to close?" palette={palette} />

      <div className="grid shrink-0 grid-cols-4 gap-3">
        <GlassStat label="Open pipeline" value={gbpShort(total)} note={`${deals.length} opportunities`} href="/deals" />
        <GlassStat label="Average health" value={`${avg}%`} note="across six conditions" href="/deals" />
        <GlassStat
          label="Need intervention"
          value={String(intervene)}
          note="a condition is missing"
          tone={intervene ? "var(--state-risk)" : undefined}
          href="/deals"
        />
        <GlassStat
          label="Close dates moved"
          value={String(slips)}
          note="times, across the book"
          tone={slips ? "var(--state-attention)" : undefined}
          href="/deals"
        />
      </div>

      <div className="grid min-h-0 flex-1 grid-cols-[0.82fr_1.18fr] gap-3">
        <Plot title="Value by stage" subtitle="a snapshot, not a conversion rate">
          <Funnel stages={stages} palette={palette} width={420} height={206} />
        </Plot>

        <StoryList title="Weakest conditions" subtitle="lowest health first">
          {worst.map((d) => {
            const account = getAccount(d.accountId);
            return (
              <div key={d.id} className="min-w-0">
                <Story
                  href={`/deals/${d.id}`}
                  lead={d.name}
                  rest={`${account?.name ?? ""} · ${d.mainGap.replace(/-/g, " ")}`}
                  value={gbpShort(d.value)}
                  palette={palette}
                  mark={dealState(d) === "intervene" ? "var(--state-risk)" : palette.base}
                />
                <div className="px-2.5 pb-1">
                  <Segments values={Object.values(d.health)} palette={palette} />
                </div>
              </div>
            );
          })}
        </StoryList>
      </div>

      <Note>Each segment is one of the six conditions a deal needs. Faint means unproven, not absent.</Note>
    </div>
  );
}

/* ── Markets — a map ──────────────────────────────────────────────────────── */

function MarketsDashboard() {
  const palette = MODULE_PALETTE.markets;
  const heat = marketHeat();
  const moved = movedMarkets(4);
  const changes = latestChanges(2);
  const expanding = expandingAccounts(3);

  return (
    <div className={shell}>
      <Head question="Where are fund groups moving, and does it create a reason?" range="Europe" palette={palette} />

      <div className="grid min-h-0 flex-1 grid-cols-[1.25fr_1fr] gap-3">
        <div className="gi-plot min-h-0 overflow-hidden rounded-xl p-2">
          <RegionMap values={heat} markers={moved} palette={palette} width={560} height={362} />
        </div>

        <div className="flex min-h-0 flex-col gap-3">
          <div className="grid shrink-0 grid-cols-2 gap-3">
            <GlassStat
              label="Markets moving"
              value={String(Object.keys(heat).length)}
              note="with recorded change"
              href="/markets"
            />
            <GlassStat
              label="Verified changes"
              value={String(allEvents().filter((e) => e.state === "verified-fact").length)}
              note="sourced and dated"
              href="/evidence"
            />
          </div>

          <Plot title="Most change" subtitle="numbered on the map" className="shrink-0">
            <BarList rows={topMarkets(5)} palette={palette} labelWidth={82} ranked />
          </Plot>

          <StoryList title="What moved" subtitle="verified, newest first" className="shrink-0">
            {changes.map((c) => (
              <Story
                key={c.id}
                href={`/accounts/${c.accountId}`}
                lead={c.market}
                rest={c.headline}
                value={daysAgo(c.detected)}
                palette={palette}
              />
            ))}
          </StoryList>

          <Rail
            title="Ranges taking new ground"
            palette={palette}
            items={expanding.map((a) => ({
              id: a.id,
              lead: a.label,
              rest: `registered in ${a.markets.join(", ")}`,
              href: a.href,
            }))}
          />
        </div>
      </div>

      <Note>Shading is the count of recorded changes, on a root scale so Luxembourg does not flatten the rest.</Note>
    </div>
  );
}

/* ── People — an orbit ────────────────────────────────────────────────────── */

function PeopleDashboard() {
  const palette = MODULE_PALETTE.people;
  const groups = buyingGroups();
  const coverage = peopleCoverage();
  const people = keyPeople(2);

  return (
    <div className={shell}>
      <Head question="Who matters here, and what is the route to them?" palette={palette} />

      <div className="grid min-h-0 flex-1 grid-cols-[1fr_1.05fr] gap-3">
        <div className="gi-plot min-h-0 overflow-hidden rounded-xl p-1.5">
          <RadialGroups groups={groups} palette={palette} centreLabel="BR" width={500} height={392} />
        </div>

        <div className="flex min-h-0 flex-col gap-3">
          <div className="grid shrink-0 grid-cols-2 gap-3">
            <GlassStat
              label="People identified"
              value={String(coverage.mapped)}
              note={`across ${coverage.orgs} organisations`}
              href="/people"
            />
            <GlassStat
              label="Relationships recorded"
              value={String(coverage.withRelationship)}
              note={coverage.withRelationship === 0 ? "none yet — this is the gap" : "with a route in"}
              tone={coverage.withRelationship === 0 ? "var(--state-attention)" : undefined}
              href="/people"
            />
          </div>

          {/* The key to the numbered nodes on the orbit. */}
          <div className="gi-tile shrink-0 rounded-xl px-3 py-2.5">
            <p className="text-[10px] font-semibold uppercase tracking-[0.1em] text-[var(--text-4)]">
              Organisations
            </p>
            <ul className="mt-2 grid grid-cols-2 gap-x-4 gap-y-[6px]">
              {groups.map((g, i) => (
                <li key={g.id} className="flex min-w-0 items-baseline gap-1.5">
                  <span
                    className="shrink-0 text-[9.5px] font-bold tabular-nums"
                    style={{ color: palette.ink }}
                  >
                    {i + 1}
                  </span>
                  <span className="truncate text-[11px] text-[var(--text-2)]">{g.label}</span>
                  <span className="ml-auto shrink-0 text-[10px] tabular-nums text-[var(--text-4)]">
                    {g.members.length}
                  </span>
                </li>
              ))}
            </ul>
          </div>

          <Plot
            title="Buying roles covered"
            subtitle={`${coverage.rolesCovered} of ${coverage.rolesExpected} filled`}
            className="shrink-0"
          >
            <BarList rows={buyingRoleCoverage()} palette={palette} labelWidth={82} />
          </Plot>

          {/* Named individuals, with what we still have to find out about each
              — never with what they are going to do. */}
          <StoryList title="Who matters most" subtitle="by decision relevance" className="min-h-0 flex-1">
            {people.map((person) => (
              <Story
                key={person.id}
                href={person.href}
                lead={`${person.name} — ${person.title}`}
                rest={person.need}
                value={person.known ? "route in" : "no route"}
                mark={person.known ? palette.base : "var(--state-quiet)"}
                palette={palette}
              />
            ))}
          </StoryList>

        </div>
      </div>

      <Note>Names and titles come from sources. A buying role is always inferred — it is never asserted as fact.</Note>
    </div>
  );
}

/* ── Delivery — a time axis ───────────────────────────────────────────────── */

function DeliveryDashboard() {
  const palette = MODULE_PALETTE.delivery;
  const stats = deliveryStats();
  const horizon = renewalHorizon();

  /* The renewals actually coming at us, soonest first, each one a client. */
  const soonest = allServiceRelationships()
    .filter((r) => r.renewalInDays !== undefined)
    .sort((a, b) => (a.renewalInDays as number) - (b.renewalInDays as number))
    .slice(0, 3);

  return (
    <div className={shell}>
      <Head question="Are we delivering, and what is coming toward us?" range="12m" palette={palette} />

      <div className="grid shrink-0 grid-cols-4 gap-3">
        <GlassStat label="Live services" value={String(stats.live)} note={`of ${stats.services} relationships`} href="/delivery" />
        <GlassStat label="Renewals in 180d" value={String(stats.renewals180)} note="windows open" href="/delivery" />
        <GlassStat label="Value at renewal" value={gbpShort(stats.value180)} note="recurring, next 180 days" href="/delivery" />
        <GlassStat
          label="Needs support"
          value={String(stats.atRisk)}
          note="health below stable"
          tone={stats.atRisk ? "var(--state-attention)" : undefined}
          href="/delivery"
        />
      </div>

      <Plot title="Every renewal, on the date it falls" subtitle="sized by recurring value" className="shrink-0">
        <Horizon items={horizon} palette={palette} width={1080} height={120} />
      </Plot>

      <div className="grid min-h-0 flex-1 grid-cols-[1fr_1.15fr] gap-3">
        <div className="gi-tile flex min-h-0 flex-col justify-center rounded-xl px-3 py-2.5">
          <BarList rows={deliveryByLifecycle()} palette={palette} labelWidth={86} />
        </div>

        <StoryList title="Coming at us first" subtitle="soonest renewal date">
          {soonest.map((r) => {
            const account = getAccount(r.accountId);
            const risky = r.health === "risk" || r.health === "attention";
            return (
              <Story
                key={r.id}
                href={`/accounts/${r.accountId}`}
                lead={account?.name ?? r.accountId}
                rest={`${r.lifecycle} · ${risky ? "needs support" : "healthy"}${r.note ? ` · ${r.note}` : ""}`}
                value={`${r.renewalInDays}d`}
                mark={risky ? "var(--state-risk)" : palette.base}
                palette={palette}
              />
            );
          })}
        </StoryList>
      </div>

      <div className="flex shrink-0 items-center justify-between gap-4">
        <Legend
          items={[
            { label: "Renewal", tone: palette.base },
            { label: "Needs support", tone: "var(--state-risk)", hollow: true },
          ]}
        />
        <Note>Clustering matters more than the count: two renewals in one week is one conversation.</Note>
      </div>
    </div>
  );
}

/* ── Knowledge Graph — a network ──────────────────────────────────────────── */

function KnowledgeGraphDashboard() {
  const palette = MODULE_PALETTE["knowledge-graph"];
  const { nodes, links } = ontologyGraph();
  const scale = graphScale();
  const funds = fundStories(5);
  const footprint = crossBorderFootprint();

  return (
    <div className={shell}>
      <Head question="How are account, fund, market, person, deal and evidence connected?" palette={palette}>
        <span className="shrink-0 text-[10px] font-semibold uppercase tracking-[0.1em] text-[var(--text-4)]">
          {scale.entities} objects · {scale.links} links
        </span>
      </Head>

      <div className="grid min-h-0 flex-1 grid-cols-[1.15fr_1fr] gap-3">
        <div className="gi-plot min-h-0 overflow-hidden rounded-xl p-2">
          <Network nodes={nodes} links={links} palette={palette} width={580} height={382} />
        </div>

        <div className="flex min-h-0 flex-col gap-3">
          <div className="grid shrink-0 grid-cols-2 gap-3">
            <GlassStat
              label="Source-linked"
              value={`${scale.sourceLinkedPct}%`}
              note="of evidence cites a source"
              href="/evidence"
            />
            <GlassStat
              label="Host registrations"
              value={String(footprint.registrations)}
              note={`${footprint.domiciles} domiciles`}
              href="/markets"
            />
          </div>

          {/* The graph drawn to the left is the ontology's skeleton. This is the
              mass hanging on it: real fund records, each one an object you can
              open and walk out from. */}
          <StoryList title="Funds in the graph" subtitle="range · structure · footprint" className="min-h-0 flex-1">
            {funds.map((f) => (
              <Story
                key={f.id}
                href={f.href}
                lead={f.fund}
                rest={`${f.structure} · ${f.assetClass} · ${f.domicile}`}
                value={`${f.hosts} mkts`}
                palette={palette}
                pulse={f.newHosts.length > 0}
              />
            ))}
          </StoryList>
        </div>
      </div>

      <Note>Every number is a live count. The skeleton is authored; the mass on it is not.</Note>
    </div>
  );
}

/* ── Global — a globe ─────────────────────────────────────────────────────── */

function GlobalDashboard() {
  const palette = MODULE_PALETTE.global;
  const markers = globeMarkers();
  const regions = regionRows();
  const hubs = topHubs(5);
  const active = markers.filter((m) => m.weight > 0).length;
  const footprint = crossBorderFootprint();

  return (
    <div className={shell}>
      <Head question="Where in the world do we have interest, and what is live there?" palette={palette} />

      <div className="grid min-h-0 flex-1 grid-cols-[0.95fr_1fr] gap-3">
        <div className="min-h-0 overflow-hidden">
          <Globe markers={markers} palette={palette} originId="gb" id="global" size={392} />
        </div>

        <div className="flex min-h-0 flex-col gap-3">
          <div className="grid shrink-0 grid-cols-3 gap-3">
            <GlassStat label="Markets covered" value={String(markers.length)} note={`${active} with activity`} href="/markets" />
            <GlassStat label="Regions live" value={String(regions.length)} note="carrying open work" href="/markets" />
            <GlassStat
              label="Registrations"
              value={String(footprint.registrations)}
              note={`${footprint.shareClasses.toLocaleString("en-GB")} share classes`}
              href="/knowledge-graph"
            />
          </div>

          <Plot title="Where the change is" subtitle="by region" className="shrink-0">
            <BarList rows={regions} palette={palette} labelWidth={104} />
          </Plot>

          <StoryList title="Busiest hubs" subtitle="by recorded change" className="min-h-0 flex-1">
            {hubs.map((h) => (
              <Story
                key={h.id}
                href={`/markets?market=${h.id}`}
                lead={h.hub}
                rest={`${h.market} · ${h.accounts} accounts active`}
                value={`${h.events} changes`}
                palette={palette}
              />
            ))}
          </StoryList>
        </div>
      </div>

      <Note>Arcs run from London to every market with recorded activity, along the great circle.</Note>
    </div>
  );
}

/* ── Evidence — a flow ────────────────────────────────────────────────────── */

function EvidenceDashboard() {
  const palette = MODULE_PALETTE.evidence;
  const flow = provenanceFlow();
  const trend = evidenceByMonth();

  /* The most recent claims, each one openable back to what it was drawn from. */
  const seen = new Set<string>();
  const recent = [...allEvidence()]
    .filter((e) => e.state !== "still-to-learn")
    .filter((e) => {
      if (seen.has(e.matchedToId)) return false;
      seen.add(e.matchedToId);
      return true;
    })
    .slice(0, 4)
    .map((e) => ({
      id: e.id,
      account: getAccount(e.matchedToId)?.name ?? "Portfolio",
      claim: e.statement,
      sources: e.sourceIds.length,
    }));

  return (
    <div className={shell}>
      <Head question="Why should I trust this fact, score or recommendation?" palette={palette} />

      <div className="grid shrink-0 grid-cols-4 gap-3">
        <GlassStat
          label="Evidence records"
          value={String(flow.stats.records)}
          note="claims on file"
          href="/evidence"
          palette={palette}
          spark={trendOrNull(trend)}
          {...(deltaOf(trend) ?? {})}
        />
        <GlassStat
          label="Carry a source"
          value={`${Math.round((flow.stats.sourced / Math.max(flow.stats.records, 1)) * 100)}%`}
          note={`${flow.stats.sourced} of ${flow.stats.records}`}
          href="/evidence"
        />
        <GlassStat label="Verified fact" value={String(flow.stats.verified)} note="the rest is inference" href="/evidence" />
        <GlassStat
          label="Conflicting"
          value={String(flow.stats.conflicts)}
          note={flow.stats.conflicts ? "two sources disagree" : "none recorded"}
          tone={flow.stats.conflicts ? "var(--state-attention)" : undefined}
          href="/evidence"
        />
      </div>

      <div className="grid min-h-0 flex-1 grid-cols-[1.3fr_1fr] gap-3">
        <div className="gi-plot min-h-0 overflow-hidden rounded-xl px-3 pb-2 pt-2.5">
          <FlowChain
            columns={flow.columns as Parameters<typeof FlowChain>[0]["columns"]}
            links={flow.links as Parameters<typeof FlowChain>[0]["links"]}
            palette={palette}
            width={620}
            height={306}
          />
        </div>

        <StoryList title="Latest claims" subtitle="with the sources behind them">
          {recent.map((r) => (
            <Story
              key={r.id}
              href="/evidence"
              lead={r.account}
              rest={r.claim}
              value={r.sources ? `${r.sources} src` : "—"}
              palette={palette}
              mark={r.sources ? palette.base : "var(--state-quiet)"}
            />
          ))}
        </StoryList>
      </div>

      <div className="flex shrink-0 items-center justify-between gap-4">
        <Legend
          items={[
            { label: "Verified fact", tone: palette.base },
            { label: "Inference", tone: palette.ink, hollow: true },
          ]}
        />
        <Note>Ribbons are counted from the records themselves — nothing here is a connection we assumed.</Note>
      </div>
    </div>
  );
}

/* ── Registry ─────────────────────────────────────────────────────────────── */

export const DASHBOARDS: Record<ModuleId, () => React.JSX.Element> = {
  growth: GrowthDashboard,
  accounts: AccountsDashboard,
  deals: DealsDashboard,
  markets: MarketsDashboard,
  people: PeopleDashboard,
  delivery: DeliveryDashboard,
  "knowledge-graph": KnowledgeGraphDashboard,
  global: GlobalDashboard,
  evidence: EvidenceDashboard,
};
