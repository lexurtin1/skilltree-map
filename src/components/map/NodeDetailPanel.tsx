"use client";

import {
  connectionsForNode,
  DOMAIN_BY_ID,
  EXECUTIVE_PULSE,
  getNode,
  hasConstellation,
  NODE_TYPES,
  PULSE_SUMMARY,
  STATUS,
  type CompanyMapNode,
  type MapMetric,
} from "@/lib/company-map";
import { NodeGlyph } from "./MapNode";

type NodeDetailPanelProps = {
  nodeId: string;
  onClose: () => void;
  onFollow: (nodeId: string) => void;
  onDrillDown: (nodeId: string) => void;
};

/**
 * The contextual panel. One component renders every kind of node — domain,
 * entity, insight, event, risk, opportunity, decision, initiative — plus the
 * Executive Pulse summary, so the reading experience never changes shape.
 */
export function NodeDetailPanel({
  nodeId,
  onClose,
  onFollow,
  onDrillDown,
}: NodeDetailPanelProps) {
  const node = getNode(nodeId);
  if (!node) return null;

  const domain = DOMAIN_BY_ID[node.domain];
  const status = STATUS[node.status];
  const typeMeta = NODE_TYPES[node.type];
  const detail = node.detail;
  const isPulse = node.id === EXECUTIVE_PULSE.id;
  const connections = isPulse ? [] : connectionsForNode(node.id);
  const drillable = hasConstellation(node.id);

  return (
    <aside
      data-ui
      className="absolute bottom-4 left-3 top-3 z-40 flex w-[min(390px,calc(100vw-24px))] flex-col overflow-hidden rounded-lg border border-[var(--line)] bg-[var(--bg-3)] shadow-[0_12px_40px_-16px_rgba(11,31,51,0.25)] sm:left-4"
      style={{ ["--c" as string]: domain.color }}
    >
      <div className="flex items-start justify-between gap-3 border-b border-[var(--line)] px-5 pb-4 pt-5">
        <div className="min-w-0">
          <div className="mb-2 flex flex-wrap items-center gap-1.5">
            {!isPulse && (
              <Chip color={domain.color} label={domain.label.toUpperCase()} />
            )}
            <Chip
              color={status.color}
              label={status.label.toUpperCase()}
              solid={node.status === "critical"}
            />
            {!isPulse && node.type !== "domain" && (
              <span className="text-[10px] font-bold tracking-[0.16em] text-[var(--ink-3)]">
                {typeMeta.label.toUpperCase()}
              </span>
            )}
          </div>
          <h2 className="text-[21px] font-semibold leading-tight text-[var(--ivory)]">
            {node.label}
          </h2>
          {node.subtitle && (
            <p className="mt-1 text-[12px] text-[var(--ink-2)]">{node.subtitle}</p>
          )}
        </div>
        <button
          type="button"
          onClick={onClose}
          aria-label="Close"
          className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full border border-[var(--line)] text-[var(--ivory-2)] transition hover:border-[var(--copper)] hover:text-[var(--ivory)]"
        >
          ×
        </button>
      </div>

      <div className="min-h-0 flex-1 overflow-y-auto px-5 py-4">
        {detail?.headline && (
          <p className="mb-4 text-[15px] font-medium leading-snug text-[var(--ivory)]">
            {detail.headline}
          </p>
        )}

        {detail?.metrics && detail.metrics.length > 0 && (
          <div className="mb-4 grid grid-cols-2 gap-2">
            {detail.metrics.map((metric) => (
              <MetricTile key={metric.label} metric={metric} />
            ))}
          </div>
        )}

        {detail?.summary && (
          <Section title="Why it matters">
            <p className="text-[13.5px] leading-relaxed text-[var(--ivory-2)]">
              {stripWhyPrefix(detail.summary)}
            </p>
          </Section>
        )}

        {isPulse && (
          <Section title="Where to look first">
            <div className="space-y-2">
              {PULSE_SUMMARY.map((block) => (
                <div
                  key={block.key}
                  className="rounded-xl border border-[var(--line)] bg-[rgba(255,255,255,0.02)] px-3 py-3"
                >
                  <div className="flex items-baseline justify-between gap-3">
                    <p className="text-[11px] font-bold tracking-[0.14em] text-[var(--ink-2)]">
                      {block.label.toUpperCase()}
                    </p>
                    <p className="text-[13px] font-semibold text-[var(--ivory)]">
                      {block.value}
                    </p>
                  </div>
                  <p className="mt-1.5 text-[12.5px] leading-relaxed text-[var(--ivory-2)]">
                    {block.detail}
                  </p>
                  <div className="mt-2 flex flex-wrap gap-1.5">
                    {block.nodeIds.map((id) => {
                      const target = getNode(id);
                      if (!target) return null;
                      return (
                        <NodeChip key={id} node={target} onClick={() => onFollow(id)} />
                      );
                    })}
                  </div>
                </div>
              ))}
            </div>
          </Section>
        )}

        {detail?.movement && (
          <Section title="Current movement">
            <p className="text-[13px] leading-relaxed text-[var(--ivory-2)]">
              {detail.movement}
            </p>
          </Section>
        )}

        {detail?.recommendedAction && (
          <Section title="Recommended action">
            <div
              className="rounded-xl border px-3 py-3"
              style={{
                borderColor: `color-mix(in srgb, ${status.color} 45%, transparent)`,
                background: `color-mix(in srgb, ${status.color} 8%, transparent)`,
              }}
            >
              <p className="text-[13px] leading-relaxed text-[var(--ivory)]">
                {detail.recommendedAction}
              </p>
              {(detail.owner || detail.dueDate) && (
                <div className="mt-2.5 flex flex-wrap gap-x-4 gap-y-1 text-[11px] text-[var(--ink-2)]">
                  {detail.owner && (
                    <span>
                      Owner · <span className="text-[var(--ivory-2)]">{detail.owner}</span>
                    </span>
                  )}
                  {detail.dueDate && (
                    <span>
                      Next key date · <span className="text-[var(--ivory-2)]">{detail.dueDate}</span>
                    </span>
                  )}
                </div>
              )}
            </div>
          </Section>
        )}

        {drillable && (
          <button
            type="button"
            onClick={() => onDrillDown(node.id)}
            className="mb-4 flex w-full items-center justify-between rounded-xl border px-3 py-3 text-left transition hover:brightness-110"
            style={{
              borderColor: `color-mix(in srgb, ${domain.color} 45%, transparent)`,
              background: `color-mix(in srgb, ${domain.color} 8%, transparent)`,
            }}
          >
            <span className="text-[12.5px] font-semibold text-[var(--ivory)]">
              {node.constellationTitle ?? "Open constellation"}
            </span>
            <span style={{ color: domain.color }}>→</span>
          </button>
        )}

        {connections.length > 0 && (
          <Section title={`Connected entities · ${connections.length}`}>
            <div className="space-y-1.5">
              {connections.slice(0, 10).map((connection) => (
                <button
                  key={connection.node.id}
                  type="button"
                  onClick={() => onFollow(connection.node.id)}
                  className="flex w-full items-start gap-2.5 rounded-lg border border-[var(--line)] px-2.5 py-2 text-left transition hover:border-[color-mix(in_srgb,var(--c)_55%,transparent)]"
                >
                  <span
                    className="mt-0.5 grid h-5 w-5 shrink-0 place-items-center rounded-full"
                    style={{
                      background: `color-mix(in srgb, ${DOMAIN_BY_ID[connection.node.domain].color} 20%, #0B1F33)`,
                      border: `1px solid ${STATUS[connection.node.status].color}`,
                    }}
                  >
                    <NodeGlyph
                      type={connection.node.type}
                      color={STATUS[connection.node.status].color}
                      size={16}
                    />
                  </span>
                  <span className="min-w-0 flex-1">
                    <span className="block text-[10px] tracking-[0.1em] text-[var(--ink-3)]">
                      {connection.relationship.toUpperCase()} ·{" "}
                      <span style={{ color: DOMAIN_BY_ID[connection.node.domain].color }}>
                        {DOMAIN_BY_ID[connection.node.domain].label}
                      </span>
                    </span>
                    <span className="block text-[12.5px] leading-tight text-[var(--ivory-2)]">
                      {connection.node.label}
                    </span>
                  </span>
                  <span className="mt-0.5 shrink-0 text-[var(--ink-3)]">→</span>
                </button>
              ))}
            </div>
          </Section>
        )}

        {detail?.evidence && detail.evidence.length > 0 && (
          <Section title="Evidence">
            <div className="space-y-1.5">
              {detail.evidence.map((item) => (
                <div
                  key={`${item.source}-${item.label}`}
                  className="flex items-baseline justify-between gap-3 text-[11.5px]"
                >
                  <span className="text-[var(--ivory-2)]">
                    <span className="text-[var(--ink-3)]">{item.source}</span> · {item.label}
                  </span>
                  {item.freshness && (
                    <span className="shrink-0 tabular-nums text-[var(--ink-3)]">
                      {item.freshness}
                    </span>
                  )}
                </div>
              ))}
            </div>
          </Section>
        )}

        {!detail && (
          <p className="text-[13px] leading-relaxed text-[var(--ink-2)]">
            No commentary recorded against this node yet.
          </p>
        )}
      </div>
    </aside>
  );
}

/** Node copy leads with "Why it matters:" so it reads well in data; the panel
 *  supplies that as a section heading instead of repeating it inline. */
function stripWhyPrefix(summary: string): string {
  return summary.replace(/^why it matters:\s*/i, "");
}

function MetricTile({ metric }: { metric: MapMetric }) {
  const tone = metric.tone ? STATUS[metric.tone].color : "var(--ivory-2)";
  return (
    <div className="rounded-lg border border-[var(--line)] bg-[rgba(255,255,255,0.02)] px-2.5 py-2">
      <p className="text-[9.5px] font-bold uppercase tracking-[0.12em] text-[var(--ink-3)]">
        {metric.label}
      </p>
      <p className="mt-1 text-[16px] font-semibold leading-none text-[var(--ivory)]">
        {metric.value}
      </p>
      {metric.delta && (
        <p className="mt-1 text-[10.5px]" style={{ color: tone }}>
          {metric.delta}
        </p>
      )}
    </div>
  );
}

function Chip({
  color,
  label,
  solid = false,
}: {
  color: string;
  label: string;
  solid?: boolean;
}) {
  return (
    <span
      className="rounded px-1.5 py-0.5 text-[9.5px] font-bold tracking-[0.14em]"
      style={{
        color: solid ? "#0B1F33" : color,
        background: solid ? color : `color-mix(in srgb, ${color} 14%, transparent)`,
        border: `1px solid color-mix(in srgb, ${color} 45%, transparent)`,
      }}
    >
      {label}
    </span>
  );
}

function NodeChip({ node, onClick }: { node: CompanyMapNode; onClick: () => void }) {
  const domain = DOMAIN_BY_ID[node.domain];
  return (
    <button
      type="button"
      onClick={onClick}
      className="flex items-center gap-1.5 rounded-full border px-2 py-1 text-[10.5px] text-[var(--ivory-2)] transition hover:text-[var(--ivory)]"
      style={{ borderColor: `color-mix(in srgb, ${domain.color} 40%, transparent)` }}
    >
      <span
        className="h-1.5 w-1.5 rounded-full"
        style={{ background: STATUS[node.status].color }}
      />
      {node.label}
    </button>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="mb-4">
      <p className="mb-2 text-[10px] font-bold tracking-[0.16em] text-[var(--ink-3)]">
        {title.toUpperCase()}
      </p>
      {children}
    </div>
  );
}
