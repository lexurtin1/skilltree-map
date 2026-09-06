"use client";

/**
 * The nine dashboards.
 *
 * Each answers a different question, so each is drawn in a different form: a
 * distribution for Growth, a divided whole for Accounts, a funnel for Deals, a
 * map for Markets, an orbit for People, a time axis for Delivery, a network for
 * the Knowledge Graph, a globe for Global, a flow for Evidence. Nothing here
 * shares a layout with anything else — from across the room the ring should read
 * as nine different objects, not one object nine times.
 *
 * Every figure is read from the ontology. Deltas appear only where a real
 * period-on-period comparison exists; `deltaOf` returns null rather than
 * inventing one, and the figure simply omits it.
 */
import { Globe, RegionMap } from "../viz/geo";
import { Beeswarm, BarList, Funnel, Horizon, Segments } from "../viz/plots";
import { FlowChain, Network, RadialGroups, Treemap } from "../viz/structure";
import { GlassStat, Head, Legend, Note, Plot, Rail, Stat } from "./shell";
import { MODULE_PALETTE } from "@/lib/gi/palette";
import type { ModuleId } from "@/lib/gi/metrics";
import { graphScale } from "@/lib/gi/metrics";
import {
  buyingGroups,
  dealFunnel,
  deliveryStats,
  gbpShort,
  globeMarkers,
  latestChanges,
  marketHeat,
  markerCounts,
  movedMarkets,
  ontologyGraph,
  peopleCoverage,
  portfolioCells,
  prioritySwarm,
  provenanceFlow,
  regionRows,
  renewalHorizon,
  topHubs,
  topReasons,
} from "@/lib/gi/gallery";
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
  allAccounts,
  allEvents,
  allHypotheses,
  allOpportunities,
  dealState,
  healthScore,
  recentEvents,
} from "@/lib/gi/select";

const shell = "flex h-full min-h-0 flex-col gap-2.5";

/* ── Growth — a distribution ──────────────────────────────────────────────── */

function GrowthDashboard() {
  const palette = MODULE_PALETTE.growth;
  const swarm = prioritySwarm();
  const reasons = topReasons(3);
  const events = eventsByMonth();
  const hyp = hypothesesByMonth();
  const high = swarm.filter((s) => s.x >= 60).length;
  const value = allAccounts().reduce(
    (sum, a) =>
      sum +
      allHypotheses()
        .filter((h) => h.accountId === a.id)
        .reduce((s, h) => s + (h.potentialValue ?? 0), 0),
    0,
  );

  return (
    <div className={shell}>
      <Head question="Which accounts changed in a way that makes us relevant?" range="45d" palette={palette} />

      <div className="grid shrink-0 grid-cols-4 gap-4">
        <Stat label="Scored high" value={String(high)} note={`of ${swarm.length} accounts`} palette={palette} />
        <Stat label="Indicative value" value={gbpShort(value)} note="across open reasons" palette={palette} />
        <Stat
          label="Verified changes"
          value={String(recentEvents(45).length)}
          note="last 45 days"
          palette={palette}
          spark={trendOrNull(events)}
          {...(deltaOf(events) ?? {})}
        />
        <Stat
          label="Open reasons"
          value={String(allHypotheses().length)}
          note="hypotheses on file"
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
          height={116}
        />
      </Plot>

      {/* The three highest-scoring reasons, as sentences rather than as scores.
          A number tells a seller where to look; only the sentence tells them
          what to say. */}
      <div className="grid min-h-0 flex-1 grid-cols-3 gap-2">
        {reasons.map((r) => (
          <div key={r.id} className="gi-tile flex min-w-0 flex-col justify-center overflow-hidden rounded-xl px-3 py-2">
            <div className="flex items-baseline gap-2">
              <p className="min-w-0 flex-1 truncate text-[10.5px] font-semibold text-[var(--text-1)]">
                {r.account}
              </p>
              <span
                className="shrink-0 text-[9px] font-bold tabular-nums"
                style={{ color: palette.ink }}
              >
                {r.score}
              </span>
            </div>
            <p className="mt-1 truncate text-[9.5px] leading-tight text-[var(--text-3)]">{r.title}</p>
          </div>
        ))}
      </div>

      <Note>Priority is 0–100, after a penalty for what we still do not know about the account.</Note>
    </div>
  );
}

/* ── Accounts — a divided whole ───────────────────────────────────────────── */

function AccountsDashboard() {
  const palette = MODULE_PALETTE.accounts;
  const cells = portfolioCells();
  const markers = markerCounts();
  const clients = allAccounts().filter((a) => a.relationship === "existing-client").length;

  return (
    <div className={shell}>
      <Head question="What is the current picture across the portfolio?" palette={palette}>
        <span className="shrink-0 text-[9px] font-semibold uppercase tracking-[0.1em] text-[var(--text-4)]">
          {cells.length} accounts · {clients} clients
        </span>
      </Head>

      <div className="gi-plot min-h-0 flex-1 overflow-hidden rounded-xl p-2">
        <Treemap cells={cells} width={840} height={272} />
      </div>

      <div className="flex shrink-0 items-center justify-between gap-4">
        <Legend items={markers.map((m) => ({ label: `${m.label} · ${m.count}`, tone: m.tone }))} />
        <Note>Sized by the number of markets an account&rsquo;s funds are sold into.</Note>
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
  const worst = [...deals].sort((a, b) => healthScore(a) - healthScore(b)).slice(0, 4);

  return (
    <div className={shell}>
      <Head question="What would have to be true for these to close?" palette={palette} />

      <div className="grid shrink-0 grid-cols-4 gap-2.5">
        <GlassStat label="Open pipeline" value={gbpShort(total)} note={`${deals.length} opportunities`} />
        <GlassStat label="Average health" value={`${avg}%`} note="across six conditions" />
        <GlassStat
          label="Need intervention"
          value={String(intervene)}
          note="a condition is missing"
          tone={intervene ? "var(--state-risk)" : undefined}
        />
        <GlassStat
          label="Close dates moved"
          value={String(slips)}
          note="times, across the book"
          tone={slips ? "var(--state-attention)" : undefined}
        />
      </div>

      <div className="grid min-h-0 flex-1 grid-cols-[1fr_0.85fr] gap-2.5">
        <Plot title="Value by stage" subtitle="a snapshot, not a conversion rate">
          <Funnel stages={stages} palette={palette} width={252} height={208} />
        </Plot>

        <div className="gi-tile flex min-h-0 flex-col rounded-xl px-3 py-2.5">
          <p className="shrink-0 text-[9px] font-semibold uppercase tracking-[0.1em] text-[var(--text-4)]">
            Weakest conditions
          </p>
          <ul className="mt-2 flex min-h-0 flex-1 flex-col justify-between">
            {worst.map((d) => (
              <li key={d.id} className="min-w-0">
                <div className="flex items-baseline justify-between gap-2">
                  <p className="truncate text-[10px] font-semibold text-[var(--text-1)]">{d.name}</p>
                  <span className="shrink-0 text-[9.5px] font-semibold tabular-nums text-[var(--text-3)]">
                    {gbpShort(d.value)}
                  </span>
                </div>
                <div className="mt-1.5">
                  <Segments values={Object.values(d.health)} palette={palette} />
                </div>
              </li>
            ))}
          </ul>
        </div>
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
  const changes = latestChanges(3);

  return (
    <div className={shell}>
      <Head question="Where are fund groups moving, and does it create a reason?" range="Europe" palette={palette} />

      <div className="grid min-h-0 flex-1 grid-cols-[1.42fr_1fr] gap-2.5">
        <div className="gi-plot min-h-0 overflow-hidden rounded-xl p-1.5">
          <RegionMap values={heat} markers={moved} palette={palette} width={470} height={288} />
        </div>

        <div className="flex min-h-0 flex-col gap-2.5">
          <div className="grid shrink-0 grid-cols-2 gap-4">
            <Stat
              label="Markets moving"
              value={String(Object.keys(heat).length)}
              note="with recorded change"
              palette={palette}
              size="sm"
            />
            <Stat
              label="Verified changes"
              value={String(allEvents().filter((e) => e.state === "verified-fact").length)}
              note="sourced and dated"
              palette={palette}
              size="sm"
            />
          </div>

          <Plot title="Most change" subtitle="numbered on the map" className="shrink-0">
            <BarList rows={topMarkets(5)} palette={palette} labelWidth={74} ranked />
          </Plot>

          <Rail
            title="What moved"
            palette={palette}
            items={changes.map((c) => ({
              id: c.id,
              lead: c.market,
              rest: c.headline,
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

  return (
    <div className={shell}>
      <Head question="Who matters here, and what is the route to them?" palette={palette} />

      <div className="grid min-h-0 flex-1 grid-cols-[1fr_1.05fr] gap-2.5">
        <div className="gi-plot min-h-0 overflow-hidden rounded-xl p-1">
          <RadialGroups groups={groups} palette={palette} centreLabel="BR" width={330} height={286} />
        </div>

        <div className="flex min-h-0 flex-col gap-2.5">
          <div className="grid shrink-0 grid-cols-2 gap-4">
            <Stat
              label="People identified"
              value={String(coverage.mapped)}
              note={`across ${coverage.orgs} organisations`}
              palette={palette}
              size="sm"
            />
            <Stat
              label="Relationships recorded"
              value={String(coverage.withRelationship)}
              note={coverage.withRelationship === 0 ? "none yet — this is the gap" : "with a route in"}
              palette={palette}
              size="sm"
            />
          </div>

          {/* The key to the numbered nodes on the orbit. */}
          <div className="gi-tile shrink-0 rounded-xl px-3 py-2.5">
            <p className="text-[9px] font-semibold uppercase tracking-[0.1em] text-[var(--text-4)]">
              Organisations
            </p>
            <ul className="mt-2 grid grid-cols-2 gap-x-3 gap-y-[5px]">
              {groups.map((g, i) => (
                <li key={g.id} className="flex min-w-0 items-baseline gap-1.5">
                  <span
                    className="shrink-0 text-[8.5px] font-bold tabular-nums"
                    style={{ color: palette.ink }}
                  >
                    {i + 1}
                  </span>
                  <span className="truncate text-[9.5px] text-[var(--text-2)]">{g.label}</span>
                  <span className="ml-auto shrink-0 text-[9px] tabular-nums text-[var(--text-4)]">
                    {g.members.length}
                  </span>
                </li>
              ))}
            </ul>
          </div>

          <Plot title="Buying roles covered" subtitle={`${coverage.rolesCovered} of ${coverage.rolesExpected} filled`} className="min-h-0 flex-1">
            <BarList rows={buyingRoleCoverage()} palette={palette} labelWidth={72} />
          </Plot>

          <Legend
            items={[
              { label: "Relationship recorded", tone: palette.base },
              { label: "Identified only", tone: palette.ink, hollow: true },
            ]}
          />
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

  return (
    <div className={shell}>
      <Head question="Are we delivering, and what is coming toward us?" range="12m" palette={palette} />

      <div className="grid shrink-0 grid-cols-4 gap-4">
        <Stat label="Live services" value={String(stats.live)} note={`of ${stats.services} relationships`} palette={palette} />
        <Stat label="Renewals in 180d" value={String(stats.renewals180)} note="windows open" palette={palette} />
        <Stat label="Value at renewal" value={gbpShort(stats.value180)} note="recurring, next 180 days" palette={palette} />
        <Stat label="Needs support" value={String(stats.atRisk)} note="health below stable" palette={palette} />
      </div>

      <Plot title="Every renewal, on the date it falls" subtitle="sized by recurring value" className="min-h-0 flex-1">
        <Horizon items={horizon} palette={palette} height={150} />
      </Plot>

      <div className="grid shrink-0 grid-cols-[1.3fr_1fr] items-end gap-4">
        <div className="gi-tile rounded-xl px-3 py-2.5">
          <BarList rows={deliveryByLifecycle()} palette={palette} labelWidth={78} />
        </div>
        <div className="flex flex-col gap-2">
          <Legend items={[{ label: "Renewal", tone: palette.base }, { label: "Needs support", tone: "var(--state-risk)", hollow: true }]} />
          <Note>Clustering matters more than the count: two renewals in one week is one conversation.</Note>
        </div>
      </div>
    </div>
  );
}

/* ── Knowledge Graph — a network ──────────────────────────────────────────── */

function KnowledgeGraphDashboard() {
  const palette = MODULE_PALETTE["knowledge-graph"];
  const { nodes, links } = ontologyGraph();
  const scale = graphScale();

  return (
    <div className={shell}>
      <Head question="How are account, fund, market, person, deal and evidence connected?" palette={palette}>
        <span className="shrink-0 text-[9px] font-semibold uppercase tracking-[0.1em] text-[var(--text-4)]">
          {scale.entities} objects · {scale.links} links
        </span>
      </Head>

      <div className="gi-plot min-h-0 flex-1 overflow-hidden rounded-xl p-2">
        <Network nodes={nodes} links={links} palette={palette} width={840} height={278} />
      </div>

      <div className="flex shrink-0 items-center justify-between gap-4">
        <div className="flex items-center gap-6">
          <Stat label="Source-linked" value={`${scale.sourceLinkedPct}%`} note="of evidence cites a source" palette={palette} size="sm" />
          <Stat label="Object classes" value={String(nodes.length)} note="one shared vocabulary" palette={palette} size="sm" />
        </div>
        <Note>Every number is a live count. The skeleton is authored; the mass on it is not.</Note>
      </div>
    </div>
  );
}

/* ── Global — a globe ─────────────────────────────────────────────────────── */

function GlobalDashboard() {
  const palette = MODULE_PALETTE.global;
  const markers = globeMarkers();
  const regions = regionRows();
  const hubs = topHubs(4);
  const active = markers.filter((m) => m.weight > 0).length;

  return (
    <div className={shell}>
      <Head question="Where in the world do we have interest, and what is live there?" palette={palette} />

      <div className="grid min-h-0 flex-1 grid-cols-[0.92fr_1fr] gap-3">
        <div className="min-h-0 overflow-hidden">
          <Globe markers={markers} palette={palette} originId="gb" id="global" size={300} />
        </div>

        <div className="flex min-h-0 flex-col gap-2.5">
          <div className="grid shrink-0 grid-cols-2 gap-4">
            <Stat label="Markets covered" value={String(markers.length)} note={`${active} with activity`} palette={palette} size="sm" />
            <Stat label="Regions live" value={String(regions.length)} note="carrying open work" palette={palette} size="sm" />
          </div>

          <Plot title="Where the change is" subtitle="by region" className="shrink-0">
            <BarList rows={regions} palette={palette} labelWidth={96} />
          </Plot>

          <div className="gi-tile flex min-h-0 flex-1 flex-col rounded-xl px-3 py-2.5">
            <p className="shrink-0 text-[9px] font-semibold uppercase tracking-[0.1em] text-[var(--text-4)]">
              Busiest hubs
            </p>
            <ul className="mt-2 flex min-h-0 flex-1 flex-col justify-between">
              {hubs.map((h) => (
                <li key={h.id} className="flex min-w-0 items-baseline gap-2">
                  <span className="truncate text-[10px] font-semibold text-[var(--text-1)]">{h.hub}</span>
                  <span className="truncate text-[9px] text-[var(--text-4)]">{h.market}</span>
                  <span className="ml-auto shrink-0 text-[9.5px] font-semibold tabular-nums text-[var(--text-2)]">
                    {h.events} changes
                  </span>
                </li>
              ))}
            </ul>
          </div>
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

  return (
    <div className={shell}>
      <Head question="Why should I trust this fact, score or recommendation?" palette={palette} />

      <div className="grid shrink-0 grid-cols-4 gap-4">
        <Stat
          label="Evidence records"
          value={String(flow.stats.records)}
          note="claims on file"
          palette={palette}
          spark={trendOrNull(trend)}
          {...(deltaOf(trend) ?? {})}
        />
        <Stat label="Carry a source" value={`${Math.round((flow.stats.sourced / Math.max(flow.stats.records, 1)) * 100)}%`} note={`${flow.stats.sourced} of ${flow.stats.records}`} palette={palette} />
        <Stat label="Verified fact" value={String(flow.stats.verified)} note="the rest is inference" palette={palette} />
        <Stat
          label="Conflicting"
          value={String(flow.stats.conflicts)}
          note={flow.stats.conflicts ? "two sources disagree" : "none recorded"}
          palette={palette}
        />
      </div>

      <div className="gi-plot min-h-0 flex-1 overflow-hidden rounded-xl px-3 pb-2 pt-2.5">
        <FlowChain
          columns={flow.columns as Parameters<typeof FlowChain>[0]["columns"]}
          links={flow.links as Parameters<typeof FlowChain>[0]["links"]}
          palette={palette}
          width={824}
          height={244}
        />
      </div>

      <Note>Ribbons are counted from the records themselves — nothing here is a connection we assumed.</Note>
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
