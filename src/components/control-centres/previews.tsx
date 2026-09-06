"use client";

/**
 * Card previews.
 *
 * Each of these is a genuine miniature of the module it fronts, rendering real
 * derived data — not a screenshot and not a decorative graphic. The point of
 * the carousel is that a user can decide which view they need without opening
 * anything, and that only works if the preview is telling the truth.
 *
 * They are inert: `aria-hidden` and non-interactive, because the card itself is
 * the control. Screen-reader users get the card's metrics and insight instead.
 */
import { MARKETS } from "@/lib/gi/taxonomy";
import {
  allAccounts,
  allEvidence,
  allOpportunities,
  dealState,
  getAccount,
  healthScore,
  renewalsWithin,
} from "@/lib/gi/select";
import { lifecycleCounts, marketActivity } from "@/lib/gi/metrics";
import { rankedOpportunities } from "@/lib/gi/score";
import { DEAL_STAGES, EVIDENCE_STATES, STATE_MARKERS } from "@/lib/gi/taxonomy";
import type { StateMarker } from "@/lib/gi/types";

/* ── Shared miniature furniture ───────────────────────────────────────────── */

function Bar({ w, tone = "line" }: { w: number; tone?: "line" | "brand" | "soft" }) {
  const bg =
    tone === "brand" ? "var(--brand)" : tone === "soft" ? "var(--brand-soft)" : "var(--line)";
  return <span className="block h-[3px] rounded-full" style={{ width: `${w}%`, background: bg }} />;
}

function Dot({ marker }: { marker: StateMarker }) {
  return (
    <span
      className="block h-[6px] w-[6px] shrink-0 rounded-full"
      style={{ background: STATE_MARKERS[marker].color }}
    />
  );
}

function MiniPanel({
  children,
  className = "",
  title,
}: {
  children: React.ReactNode;
  className?: string;
  title?: string;
}) {
  return (
    <div
      className={`min-h-0 overflow-hidden rounded-[5px] border border-[var(--line-soft)] bg-[var(--surface-1)] p-2 ${className}`}
    >
      {title && (
        <p className="mb-1.5 text-[6.5px] font-bold uppercase tracking-[0.1em] text-[var(--text-4)]">
          {title}
        </p>
      )}
      {children}
    </div>
  );
}

/* ── Geography helpers ────────────────────────────────────────────────────── */

/** Equirectangular projection tuned to the European window. */
function europe(lon: number, lat: number): { x: number; y: number } {
  const x = ((lon + 12) / 42) * 100;
  const y = ((64 - lat) / 26) * 100;
  return { x: Math.max(2, Math.min(98, x)), y: Math.max(2, Math.min(98, y)) };
}

/** Orthographic projection for the globe preview, centred near the Atlantic. */
function ortho(lon: number, lat: number, rotLon = 10, rotLat = 22) {
  const λ = ((lon - rotLon) * Math.PI) / 180;
  const φ = (lat * Math.PI) / 180;
  const φ0 = (rotLat * Math.PI) / 180;
  const cosc = Math.sin(φ0) * Math.sin(φ) + Math.cos(φ0) * Math.cos(φ) * Math.cos(λ);
  return {
    x: 50 + Math.cos(φ) * Math.sin(λ) * 46,
    y: 50 - (Math.cos(φ0) * Math.sin(φ) - Math.sin(φ0) * Math.cos(φ) * Math.cos(λ)) * 46,
    visible: cosc >= 0,
  };
}

/* ── Growth ───────────────────────────────────────────────────────────────── */

export function GrowthPreview() {
  const ranked = rankedOpportunities(5);
  const hot = marketActivity().slice(0, 7);

  return (
    <div className="grid h-full grid-cols-[1.05fr_0.85fr_0.9fr] gap-1.5">
      <MiniPanel title="Priority">
        <div className="space-y-[7px]">
          {ranked.map(({ hypothesis, score }) => {
            const account = getAccount(hypothesis.accountId);
            return (
              <div key={hypothesis.id} className="space-y-[3px]">
                <div className="flex items-center gap-1">
                  <Dot marker={score.band === "high" ? "new" : "uncertain"} />
                  <span className="truncate text-[7px] font-semibold text-[var(--text-1)]">
                    {account?.name}
                  </span>
                  <span className="ml-auto text-[6.5px] font-bold text-[var(--brand)] tabular-nums">
                    {score.total}
                  </span>
                </div>
                <Bar w={score.total} tone="brand" />
              </div>
            );
          })}
        </div>
      </MiniPanel>

      <MiniPanel title="Field">
        <div className="relative h-full min-h-[54px]">
          {hot.map((m, i) => {
            const market = MARKETS.find((x) => x.id === m.marketId);
            if (!market) return null;
            const p = europe(market.lon, market.lat);
            const size = 4 + Math.min(m.events, 8) * 0.8;
            return (
              <span
                key={m.marketId}
                className="absolute rounded-full"
                style={{
                  left: `${p.x}%`,
                  top: `${p.y}%`,
                  width: size,
                  height: size,
                  marginLeft: -size / 2,
                  marginTop: -size / 2,
                  background: i < 2 ? "var(--state-new)" : "var(--brand-soft)",
                  opacity: i < 2 ? 0.95 : 0.7,
                }}
              />
            );
          })}
        </div>
      </MiniPanel>

      <MiniPanel title="Why now">
        <div className="space-y-[6px]">
          {["What changed", "Why Broadridge may be relevant", "What we know", "Still to learn"].map((label, i) => (
            <div key={label} className="space-y-[3px]">
              <p className="text-[6.5px] font-semibold text-[var(--text-2)]">{label}</p>
              <Bar w={92} />
              <Bar w={i === 3 ? 48 : 68} tone={i === 3 ? "line" : "soft"} />
            </div>
          ))}
        </div>
      </MiniPanel>
    </div>
  );
}

/* ── Accounts ─────────────────────────────────────────────────────────────── */

export function AccountsPreview() {
  const rows = allAccounts()
    .filter((a) => a.hero)
    .slice(0, 5);

  return (
    <MiniPanel className="h-full" title="Portfolio">
      <div className="space-y-[6px]">
        {rows.map((a) => (
          <div key={a.id} className="flex items-center gap-1.5">
            <Dot marker={a.marker} />
            <span className="w-[64px] shrink-0 truncate text-[7px] font-semibold text-[var(--text-1)]">
              {a.name}
            </span>
            <span className="min-w-0 flex-1">
              <Bar w={a.relationship === "existing-client" ? 88 : 54} tone="soft" />
            </span>
            <span
              className="shrink-0 rounded-[2px] px-1 py-[1px] text-[5.5px] font-bold uppercase tracking-[0.06em]"
              style={{
                color: STATE_MARKERS[a.marker].color,
                background: STATE_MARKERS[a.marker].bg,
              }}
            >
              {a.relationship === "existing-client" ? "Client" : "Prospect"}
            </span>
          </div>
        ))}
      </div>
    </MiniPanel>
  );
}

/* ── Deals ────────────────────────────────────────────────────────────────── */

export function DealsPreview() {
  const deals = allOpportunities();
  const focus = deals.find((d) => d.id === "opp-nordea-xborder") ?? deals[0];
  const stageIdx = DEAL_STAGES.findIndex((s) => s.id === focus.stage);

  return (
    <div className="grid h-full grid-cols-[1.5fr_1fr] gap-1.5">
      <MiniPanel title="Deal timeline">
        <div className="mb-2 flex items-center gap-[3px]">
          {DEAL_STAGES.map((stage, i) => (
            <div key={stage.id} className="flex-1">
              <span
                className="block h-[4px] rounded-full"
                style={{
                  background:
                    i < stageIdx
                      ? "var(--state-progress)"
                      : i === stageIdx
                        ? "var(--state-attention)"
                        : "var(--line)",
                }}
              />
              <p className="mt-[3px] truncate text-[5.5px] font-medium text-[var(--text-4)]">
                {stage.label}
              </p>
            </div>
          ))}
        </div>
        <div className="space-y-[5px] border-t border-[var(--line-soft)] pt-1.5">
          {deals.slice(0, 4).map((d) => {
            const state = dealState(d);
            return (
              <div key={d.id} className="flex items-center gap-1.5">
                <Dot
                  marker={state === "healthy" ? "progress" : state === "watch" ? "attention" : "risk"}
                />
                <span className="min-w-0 flex-1">
                  <Bar w={40 + healthScore(d) * 55} tone="soft" />
                </span>
                <span className="shrink-0 text-[6px] font-semibold text-[var(--text-3)] tabular-nums">
                  £{Math.round(d.value / 1000)}k
                </span>
              </div>
            );
          })}
        </div>
      </MiniPanel>

      <MiniPanel title="What is missing">
        <div className="space-y-[6px]">
          {focus.gaps.slice(0, 4).map((gap) => (
            <div key={gap} className="flex items-start gap-1.5">
              <span className="mt-[1px] block h-[6px] w-[6px] shrink-0 rounded-[1px] border border-[var(--state-attention)]" />
              <span className="min-w-0 flex-1 space-y-[3px]">
                <Bar w={86} />
                <Bar w={52} />
              </span>
            </div>
          ))}
        </div>
      </MiniPanel>
    </div>
  );
}

/* ── Markets ──────────────────────────────────────────────────────────────── */

export function MarketsPreview() {
  const activity = marketActivity();
  const top = activity.slice(0, 4);
  const max = activity[0]?.events ?? 1;

  return (
    <div className="grid h-full grid-cols-[1.35fr_1fr] gap-1.5">
      <MiniPanel title="Europe">
        <div className="relative h-full min-h-[62px]">
          {activity.slice(0, 12).map((m) => {
            const market = MARKETS.find((x) => x.id === m.marketId);
            if (!market || market.region !== "europe") return null;
            const p = europe(market.lon, market.lat);
            const intensity = m.events / max;
            const size = 5 + intensity * 9;
            return (
              <span key={m.marketId}>
                <span
                  className="absolute rounded-full"
                  style={{
                    left: `${p.x}%`,
                    top: `${p.y}%`,
                    width: size * 2.1,
                    height: size * 2.1,
                    marginLeft: -size * 1.05,
                    marginTop: -size * 1.05,
                    background: "var(--state-new)",
                    opacity: 0.1 + intensity * 0.12,
                  }}
                />
                <span
                  className="absolute rounded-full"
                  style={{
                    left: `${p.x}%`,
                    top: `${p.y}%`,
                    width: size,
                    height: size,
                    marginLeft: -size / 2,
                    marginTop: -size / 2,
                    background: intensity > 0.6 ? "var(--state-new)" : "var(--brand-soft)",
                  }}
                />
              </span>
            );
          })}
        </div>
      </MiniPanel>

      <MiniPanel title="Ranked">
        <div className="space-y-[7px]">
          {top.map((m) => {
            const market = MARKETS.find((x) => x.id === m.marketId);
            return (
              <div key={m.marketId} className="space-y-[3px]">
                <div className="flex items-baseline gap-1">
                  <span className="truncate text-[7px] font-semibold text-[var(--text-1)]">
                    {market?.name}
                  </span>
                  <span className="ml-auto text-[6.5px] font-bold text-[var(--text-3)] tabular-nums">
                    {m.events}
                  </span>
                </div>
                <Bar w={(m.events / max) * 100} tone="brand" />
              </div>
            );
          })}
        </div>
      </MiniPanel>
    </div>
  );
}

/* ── People ───────────────────────────────────────────────────────────────── */

export function PeoplePreview() {
  const nodes = [
    { x: 50, y: 16, r: 8, role: "Executive", missing: true },
    { x: 22, y: 46, r: 6.5, role: "Business", missing: false },
    { x: 78, y: 44, r: 6, role: "Legal", missing: false },
    { x: 34, y: 78, r: 7, role: "Operations", missing: false },
    { x: 70, y: 76, r: 5.5, role: "Procurement", missing: true },
  ];

  return (
    <MiniPanel className="h-full" title="Buying system">
      <div className="relative h-full min-h-[70px]">
        <svg viewBox="0 0 100 100" preserveAspectRatio="none" className="absolute inset-0 h-full w-full">
          <line x1="50" y1="16" x2="22" y2="46" stroke="var(--line)" strokeWidth="0.6" strokeDasharray="2 1.6" />
          <line x1="50" y1="16" x2="78" y2="44" stroke="var(--line)" strokeWidth="0.6" strokeDasharray="2 1.6" />
          <line x1="22" y1="46" x2="34" y2="78" stroke="var(--brand-soft)" strokeWidth="0.9" />
          <line x1="78" y1="44" x2="70" y2="76" stroke="var(--line)" strokeWidth="0.6" strokeDasharray="2 1.6" />
          <line x1="34" y1="78" x2="70" y2="76" stroke="var(--brand-soft)" strokeWidth="0.9" />
        </svg>
        {nodes.map((n) => (
          <span
            key={n.role}
            className="absolute rounded-full"
            style={{
              left: `${n.x}%`,
              top: `${n.y}%`,
              width: n.r * 2,
              height: n.r * 2,
              marginLeft: -n.r,
              marginTop: -n.r,
              background: n.missing ? "var(--surface-1)" : "var(--brand)",
              border: n.missing ? "1.4px dashed var(--state-risk)" : "none",
            }}
          />
        ))}
      </div>
    </MiniPanel>
  );
}

/* ── Delivery ─────────────────────────────────────────────────────────────── */

export function DeliveryPreview() {
  const counts = lifecycleCounts();
  const stages = [
    { id: "onboarding", label: "Onboarding" },
    { id: "live", label: "Live service" },
    { id: "change", label: "Change" },
    { id: "renewal", label: "Renewal" },
    { id: "expansion", label: "Expansion" },
  ];
  const max = Math.max(...Object.values(counts), 1);
  const renewals = renewalsWithin(180).length;

  return (
    <MiniPanel className="h-full" title="Client lifecycle">
      <div className="flex h-full flex-col justify-between">
        <div className="flex items-end gap-[5px]">
          {stages.map((s) => {
            const n = counts[s.id] ?? 0;
            return (
              <div key={s.id} className="flex flex-1 flex-col items-center gap-1">
                <span className="text-[6px] font-bold text-[var(--text-3)] tabular-nums">{n}</span>
                <span
                  className="w-full rounded-t-[2px]"
                  style={{
                    height: 8 + (n / max) * 30,
                    background:
                      s.id === "renewal"
                        ? "var(--state-attention)"
                        : s.id === "expansion"
                          ? "var(--state-progress)"
                          : "var(--brand-soft)",
                  }}
                />
                <span className="w-full truncate text-center text-[5.5px] text-[var(--text-4)]">
                  {s.label}
                </span>
              </div>
            );
          })}
        </div>
        <div className="mt-2 flex items-center gap-1.5 border-t border-[var(--line-soft)] pt-1.5">
          <Dot marker="attention" />
          <span className="text-[6.5px] font-medium text-[var(--text-2)]">
            {renewals} renewals inside 180 days
          </span>
        </div>
      </div>
    </MiniPanel>
  );
}

/* ── Knowledge Graph ──────────────────────────────────────────────────────── */

export function KnowledgeGraphPreview() {
  const satellites = [
    { x: 20, y: 24, r: 4.5 },
    { x: 80, y: 22, r: 4 },
    { x: 15, y: 62, r: 3.6 },
    { x: 84, y: 66, r: 4.2 },
    { x: 38, y: 84, r: 3.4 },
    { x: 66, y: 86, r: 3.8 },
    { x: 50, y: 12, r: 3.2 },
  ];

  return (
    <MiniPanel className="h-full" title="Connected view">
      <div className="relative h-full min-h-[70px]">
        <svg viewBox="0 0 100 100" preserveAspectRatio="none" className="absolute inset-0 h-full w-full">
          {satellites.map((s, i) => (
            <line
              key={i}
              x1="50"
              y1="50"
              x2={s.x}
              y2={s.y}
              stroke={i < 3 ? "var(--brand-soft)" : "var(--line)"}
              strokeWidth={i < 3 ? 0.9 : 0.6}
            />
          ))}
          <line x1="20" y1="24" x2="15" y2="62" stroke="var(--line)" strokeWidth="0.5" />
          <line x1="80" y1="22" x2="84" y2="66" stroke="var(--line)" strokeWidth="0.5" />
        </svg>
        {satellites.map((s, i) => (
          <span
            key={i}
            className="absolute rounded-full"
            style={{
              left: `${s.x}%`,
              top: `${s.y}%`,
              width: s.r * 2,
              height: s.r * 2,
              marginLeft: -s.r,
              marginTop: -s.r,
              background: i < 3 ? "var(--brand)" : "var(--brand-soft)",
            }}
          />
        ))}
        <span
          className="absolute rounded-full border-2 border-[var(--surface-1)]"
          style={{
            left: "50%",
            top: "50%",
            width: 20,
            height: 20,
            marginLeft: -10,
            marginTop: -10,
            background: "var(--brand)",
            boxShadow: "0 0 0 3px var(--brand-tint)",
          }}
        />
      </div>
    </MiniPanel>
  );
}

/* ── Global ───────────────────────────────────────────────────────────────── */

export function GlobalPreview() {
  const active = marketActivity();
  const activeIds = new Set(active.map((a) => a.marketId));
  const points = MARKETS.filter((m) => activeIds.has(m.id)).map((m) => ({
    market: m,
    p: ortho(m.lon, m.lat),
    weight: active.find((a) => a.marketId === m.id)?.events ?? 1,
  }));

  const lu = ortho(6.13, 49.61);
  const arcs = [
    ortho(8.68, 50.11), /* Frankfurt */
    ortho(9.19, 45.46), /* Milan */
    ortho(-3.7, 40.42), /* Madrid */
    ortho(103.82, 1.35), /* Singapore */
  ];

  return (
    <MiniPanel className="h-full" title="Global footprint">
      <div className="relative h-full min-h-[70px]">
        <svg viewBox="0 0 100 100" className="absolute inset-0 h-full w-full">
          <circle cx="50" cy="50" r="46" fill="var(--surface-2)" stroke="var(--line)" strokeWidth="0.6" />
          {[-60, -30, 0, 30, 60].map((lat) => {
            const ry = 46 * Math.cos((lat * Math.PI) / 180);
            const cy = 50 - 46 * Math.sin((lat * Math.PI) / 180) * Math.cos((22 * Math.PI) / 180);
            return (
              <ellipse
                key={lat}
                cx="50"
                cy={cy}
                rx={ry}
                ry={ry * 0.26}
                fill="none"
                stroke="var(--line)"
                strokeWidth="0.4"
                opacity="0.75"
              />
            );
          })}
          {[0, 1, 2, 3].map((i) => (
            <ellipse
              key={i}
              cx="50"
              cy="50"
              rx={46 * Math.abs(Math.cos(((i * 45 - 20) * Math.PI) / 180))}
              ry="46"
              fill="none"
              stroke="var(--line)"
              strokeWidth="0.4"
              opacity="0.6"
            />
          ))}
          {arcs.map((a, i) =>
            a.visible && lu.visible ? (
              <path
                key={i}
                d={`M ${lu.x} ${lu.y} Q ${(lu.x + a.x) / 2 + (a.y - lu.y) * 0.22} ${
                  (lu.y + a.y) / 2 - (a.x - lu.x) * 0.22
                } ${a.x} ${a.y}`}
                fill="none"
                stroke="var(--brand-bright)"
                strokeWidth="0.7"
                opacity="0.75"
              />
            ) : null,
          )}
        </svg>
        {points.map(({ market, p, weight }) =>
          p.visible ? (
            <span
              key={market.id}
              className="absolute rounded-full"
              style={{
                left: `${p.x}%`,
                top: `${p.y}%`,
                width: 3 + Math.min(weight, 8) * 0.5,
                height: 3 + Math.min(weight, 8) * 0.5,
                marginLeft: -(3 + Math.min(weight, 8) * 0.5) / 2,
                marginTop: -(3 + Math.min(weight, 8) * 0.5) / 2,
                background: weight > 5 ? "var(--state-new)" : "var(--brand)",
              }}
            />
          ) : null,
        )}
      </div>
    </MiniPanel>
  );
}

/* ── Evidence ─────────────────────────────────────────────────────────────── */

export function EvidencePreview() {
  /* One record per state, so the preview shows the vocabulary rather than
     five copies of whichever state happens to sort first. */
  const all = allEvidence();
  const picked = new Map<string, (typeof all)[number]>();
  for (const state of [
    "verified-fact",
    "system-suggestion",
    "seller-hypothesis",
    "still-to-learn",
  ] as const) {
    const hit = all.find((e) => e.state === state);
    if (hit) picked.set(hit.id, hit);
  }
  /* A record needing review may already be one of the four above. */
  const flagged = all.find((e) => e.needsReview && !picked.has(e.id));
  if (flagged) picked.set(flagged.id, flagged);
  const rows = [...picked.values()];

  return (
    <MiniPanel className="h-full" title="Source timeline">
      <div className="space-y-[7px]">
        {rows.map((e) => {
          const meta = EVIDENCE_STATES[e.state];
          return (
            <div key={e.id} className="flex items-start gap-1.5">
              <span
                className="mt-[2px] block h-[6px] w-[6px] shrink-0 rounded-full"
                style={{
                  background: e.state === "still-to-learn" ? "transparent" : meta.color,
                  border: e.state === "still-to-learn" ? `1.2px dashed ${meta.color}` : "none",
                }}
              />
              <span className="min-w-0 flex-1 space-y-[3px]">
                <span className="flex items-center gap-1">
                  <span
                    className="rounded-[2px] px-1 py-[1px] text-[5.5px] font-bold uppercase tracking-[0.05em]"
                    style={{ color: meta.color, background: meta.bg }}
                  >
                    {meta.label}
                  </span>
                  {e.sourceIds.length > 0 && (
                    <span className="text-[5.5px] text-[var(--text-4)]">
                      {e.sourceIds.length} src
                    </span>
                  )}
                </span>
                <Bar w={90} />
                <Bar w={58} />
              </span>
            </div>
          );
        })}
      </div>
    </MiniPanel>
  );
}

/* ── Registry ─────────────────────────────────────────────────────────────── */

export const PREVIEWS = {
  growth: GrowthPreview,
  accounts: AccountsPreview,
  deals: DealsPreview,
  markets: MarketsPreview,
  people: PeoplePreview,
  delivery: DeliveryPreview,
  "knowledge-graph": KnowledgeGraphPreview,
  global: GlobalPreview,
  evidence: EvidencePreview,
} as const;
