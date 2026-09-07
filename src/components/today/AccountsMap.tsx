"use client";

import { useMemo, useState } from "react";
import { EUROPE_COUNTRIES } from "@/lib/gi/geo/atlas";
import { arcThrough, shapePath, windowed } from "@/lib/gi/geo/project";
import {
  ACCOUNTS,
  CITY_COORDS,
  TEXT_FOR_STATE,
  type TodayAccount,
} from "./data";

type AccountsMapProps = {
  selectedId: string;
  onSelect: (id: string) => void;
};

function cityPoint(
  name: string,
  project: (lon: number, lat: number) => { x: number; y: number },
) {
  const c = CITY_COORDS[name];
  if (!c) return null;
  return project(c[0], c[1]);
}

export function AccountsMap({ selectedId, onSelect }: AccountsMapProps) {
  const [expanded, setExpanded] = useState(false);
  const width = expanded ? 920 : 640;
  const height = expanded ? 560 : 420;
  const selected = ACCOUNTS.find((a) => a.id === selectedId) ?? ACCOUNTS[0];
  const text = TEXT_FOR_STATE[selected.state] ?? "#5A7391";

  const project = useMemo(
    () =>
      windowed({
        lon: [-14, 32],
        lat: [36, 64],
        width,
        height,
      }),
    [width, height],
  );

  const byCity = useMemo(() => {
    const map: Record<string, TodayAccount[]> = {};
    for (const a of ACCOUNTS) {
      (map[a.hq] ??= []).push(a);
    }
    return map;
  }, []);

  const domicileCities = useMemo(() => {
    const set = new Set<string>();
    for (const f of selected.funds) set.add(f.dom);
    return [...set];
  }, [selected]);

  const arcs = useMemo(() => {
    const out: { d: string; key: string }[] = [];
    for (const f of selected.funds) {
      const from = cityPoint(f.dom, project);
      if (!from) continue;
      for (const city of f.to) {
        const to = cityPoint(city, project);
        if (!to) continue;
        out.push({
          key: `${f.name}-${city}`,
          d: arcThrough(from.x, from.y, to.x, to.y, 0.28),
        });
      }
    }
    return out;
  }, [selected, project]);

  return (
    <div className={`today-map ${expanded ? "is-expanded" : ""}`}>
      <div className="today-map-canvas">
        <svg
          viewBox={`0 0 ${width} ${height}`}
          role="img"
          aria-label="European account locations and fund distribution"
        >
          <g strokeLinejoin="round">
            {Object.entries(EUROPE_COUNTRIES).map(([iso, rings]) => (
              <path
                key={iso}
                d={shapePath(rings, project)}
                fill="rgba(10,37,64,0.075)"
                stroke="rgba(255,255,255,0.95)"
                strokeWidth={1}
              />
            ))}
          </g>

          <g
            fill="none"
            stroke={selected.state}
            strokeWidth={1.4}
            strokeLinecap="round"
            opacity={0.8}
            strokeDasharray="5 6"
            className="today-map-flow"
          >
            {arcs.map((a) => (
              <path key={a.key} d={a.d} />
            ))}
          </g>

          {selected.funds.flatMap((f) =>
            f.to.map((city) => {
              const p = cityPoint(city, project);
              if (!p) return null;
              return (
                <g key={`sale-${f.name}-${city}`}>
                  <circle
                    cx={p.x}
                    cy={p.y}
                    r={3.4}
                    fill="#fff"
                    stroke={selected.state}
                    strokeWidth={1.6}
                  />
                  <text
                    x={p.x}
                    y={p.y - 8}
                    textAnchor="middle"
                    className="today-map-label"
                    fill={text}
                  >
                    {city}
                  </text>
                </g>
              );
            }),
          )}

          {domicileCities.map((city) => {
            const p = cityPoint(city, project);
            if (!p) return null;
            return (
              <g key={`dom-${city}`}>
                <rect
                  x={p.x - 4.5}
                  y={p.y - 4.5}
                  width={9}
                  height={9}
                  rx={2}
                  fill={selected.state}
                  stroke="#fff"
                  strokeWidth={1.4}
                />
                <text
                  x={p.x}
                  y={p.y - 12}
                  textAnchor="middle"
                  className="today-map-label today-map-label-strong"
                  fill={text}
                >
                  {city} · domicile
                </text>
              </g>
            );
          })}

          {Object.entries(byCity).map(([city, list]) => {
            const base = cityPoint(city, project);
            if (!base) return null;
            const hasSel = list.some((a) => a.id === selected.id);
            const west = base.x < width * 0.52;
            const sx = base.x + (west ? -58 : 58);
            const step = 30;
            const y0 = base.y - ((list.length - 1) * step) / 2;
            const dim = hasSel ? 1 : 0.4;

            return (
              <g key={`hq-${city}`} opacity={dim}>
                <circle cx={base.x} cy={base.y} r={3.2} fill="#33506F" opacity={0.5} />
                <text
                  x={base.x}
                  y={base.y + 16}
                  textAnchor="middle"
                  className="today-map-label"
                  fill="#5A7391"
                >
                  {city}
                </text>
                {list.map((a, i) => {
                  const on = a.id === selected.id;
                  const r = on ? 11 : 8;
                  const cy = list.length === 1 ? base.y : y0 + i * step;
                  return (
                    <g
                      key={a.id}
                      className="today-map-node"
                      opacity={on ? 1 : 0.35}
                      onClick={() => onSelect(a.id)}
                      role="button"
                      tabIndex={0}
                      aria-label={`Select ${a.full}`}
                      onKeyDown={(e) => {
                        if (e.key === "Enter" || e.key === " ") {
                          e.preventDefault();
                          onSelect(a.id);
                        }
                      }}
                    >
                      <path
                        d={`M${base.x},${base.y} L${sx},${cy}`}
                        stroke="rgba(10,37,64,0.22)"
                        strokeWidth={1}
                        fill="none"
                      />
                      {on && (
                        <circle
                          cx={sx}
                          cy={cy}
                          r={r + 8}
                          fill={a.state}
                          opacity={0.15}
                        />
                      )}
                      <circle
                        cx={sx}
                        cy={cy}
                        r={r}
                        fill={on ? a.state : "rgba(255,255,255,0.92)"}
                        stroke={on ? "#fff" : a.state}
                        strokeWidth={on ? 2 : 1.8}
                      />
                      <text
                        x={sx + (west ? -(r + 8) : r + 8)}
                        y={cy + 4}
                        textAnchor={west ? "end" : "start"}
                        className={
                          on
                            ? "today-map-label today-map-label-strong"
                            : "today-map-label"
                        }
                        fill={on ? "#0A2540" : "#33506F"}
                      >
                        {a.short}
                      </text>
                    </g>
                  );
                })}
              </g>
            );
          })}
        </svg>

        <div className="today-map-tools">
          <button type="button" onClick={() => setExpanded((v) => !v)}>
            {expanded ? "Shrink" : "Expand"}
          </button>
        </div>
      </div>

      <aside className="today-map-panel">
        <p className="today-kicker">Changed since yesterday · {selected.short}</p>
        <h3>{selected.overnight}</h3>
        <p className="today-map-meta">
          HQ {selected.hq} · £{selected.rev}m with us · {selected.funds.length}{" "}
          sub-fund{selected.funds.length === 1 ? "" : "s"}
        </p>

        <div className="today-map-funds">
          {selected.funds.map((f) => (
            <div key={f.name} className="today-map-fund">
              <div className="today-map-fund-top">
                <span>{f.name}</span>
                <span>{f.aum}</span>
              </div>
              <p>Domiciled in {f.dom}</p>
              <div className="today-map-chips">
                {f.to.map((c) => (
                  <span key={c} style={{ color: text, borderColor: `${selected.state}44` }}>
                    {c}
                  </span>
                ))}
              </div>
            </div>
          ))}
        </div>

        <div className="today-map-others">
          <p>Look at another account</p>
          <div className="today-map-chips">
            {ACCOUNTS.filter((a) => a.id !== selected.id).map((a) => (
              <button
                key={a.id}
                type="button"
                onClick={() => onSelect(a.id)}
              >
                <i style={{ background: a.state }} />
                {a.short}
              </button>
            ))}
          </div>
        </div>
      </aside>

      <p className="today-map-caption">
        Dot = account head office · filled circle = selected account · square =
        country the fund is registered in · line = city the fund is sold in
      </p>
    </div>
  );
}
