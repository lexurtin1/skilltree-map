"use client";

import { useEffect, useMemo, useState } from "react";
import { useSearchParams } from "next/navigation";
import {
  ACCOUNT_LIST,
  getDossier,
  type AccountDossier,
  type Tone,
} from "@/lib/gi/accounts-demo";
import "./accounts.css";

function toneClass(t: Tone) {
  return `acc-tone--${t}`;
}

function SourceTag({ source, asOf }: { source: string; asOf?: string }) {
  return (
    <span className="acc-source" title={asOf ? `As of ${asOf}` : source}>
      {source}
      {asOf ? <em> · {asOf}</em> : null}
    </span>
  );
}

function Sparkline({ values, tone }: { values: number[]; tone: Tone }) {
  const max = Math.max(...values, 1);
  const min = Math.min(...values, 0);
  const span = Math.max(max - min, 1);
  const w = 160;
  const h = 36;
  const pts = values
    .map((v, i) => {
      const x = (i / Math.max(values.length - 1, 1)) * w;
      const y = h - ((v - min) / span) * (h - 4) - 2;
      return `${x},${y}`;
    })
    .join(" ");
  return (
    <svg className={`acc-spark ${toneClass(tone)}`} viewBox={`0 0 ${w} ${h}`} width={w} height={h} aria-hidden>
      <polyline fill="none" strokeWidth="2" points={pts} />
    </svg>
  );
}

function ShareChart({ dossier }: { dossier: AccountDossier }) {
  const series = dossier.shareSeries;
  const hasData = series.some((p) => p.close !== 0);
  if (!hasData) {
    return (
      <div className="acc-chart-empty">
        <p>No listed share series</p>
        <SourceTag source={dossier.shareDelta.source} asOf={dossier.shareDelta.asOf} />
      </div>
    );
  }
  const values = series.map((p) => p.close);
  const max = Math.max(...values);
  const min = Math.min(...values);
  const span = Math.max(max - min, 0.01);
  const w = 280;
  const h = 88;
  const pts = values
    .map((v, i) => {
      const x = (i / Math.max(values.length - 1, 1)) * w;
      const y = h - ((v - min) / span) * (h - 12) - 6;
      return `${x},${y}`;
    })
    .join(" ");
  const last = values[values.length - 1];
  return (
    <div className="acc-share">
      <div className="acc-share__head">
        <div>
          <strong>
            {dossier.shareTicker} · {dossier.shareCurrency}
            {last.toFixed(2)}
          </strong>
          <span className={`acc-pill ${toneClass(dossier.health)}`}>{dossier.shareDelta.value}</span>
        </div>
        <SourceTag source={dossier.shareDelta.source} asOf={dossier.shareDelta.asOf} />
      </div>
      <svg viewBox={`0 0 ${w} ${h}`} width="100%" height={h} className="acc-share__chart" aria-label="Share price">
        <polyline fill="none" stroke="var(--brand)" strokeWidth="2.2" points={pts} />
      </svg>
      <div className="acc-share__axis">
        {series.map((p) => (
          <span key={p.date}>{p.date}</span>
        ))}
      </div>
    </div>
  );
}

function ProductBars({ dossier }: { dossier: AccountDossier }) {
  return (
    <div className="acc-bars">
      {dossier.productMix.map((row) => (
        <div key={row.label} className="acc-bar-row">
          <span className="acc-bar-label">{row.label}</span>
          <div className="acc-bar-tracks">
            <div className="acc-bar acc-bar--held" style={{ width: `${row.held}%` }} title={`Held ${row.held}%`} />
            <div className="acc-bar acc-bar--peer" style={{ width: `${row.peer}%` }} title={`Peer ${row.peer}%`} />
          </div>
          <span className="acc-bar-nums">
            {row.held}% / {row.peer}%
          </span>
        </div>
      ))}
      <div className="acc-bar-legend">
        <span>
          <i className="acc-bar acc-bar--held" /> Held
        </span>
        <span>
          <i className="acc-bar acc-bar--peer" /> Peer density
        </span>
      </div>
    </div>
  );
}

function AccountDetail({ dossier }: { dossier: AccountDossier }) {
  return (
    <div className="acc-detail">
      <header className="acc-detail__head">
        <div className={`acc-avatar ${toneClass(dossier.health)}`}>{dossier.initials}</div>
        <div className="acc-detail__titles">
          <h1>{dossier.name}</h1>
          <p>
            {dossier.legalName} · {dossier.hq} · Owner {dossier.owner}
          </p>
        </div>
        <span className={`acc-pill acc-pill--lg ${toneClass(dossier.health)}`}>{dossier.health}</span>
      </header>

      <div className="acc-kpi-row">
        <div className={`acc-kpi ${toneClass(dossier.health)}`}>
          <strong>{dossier.arr.value}</strong>
          <span>ARR / pipeline</span>
          <SourceTag source={dossier.arr.source} asOf={dossier.arr.asOf} />
        </div>
        <div className="acc-kpi acc-tone--neutral">
          <strong>{dossier.productsHeld.value}</strong>
          <span>Products</span>
          <SourceTag source={dossier.productsHeld.source} />
        </div>
        <div className={`acc-kpi ${toneClass(dossier.health === "risk" || dossier.health === "attention" ? "attention" : "neutral")}`}>
          <strong>{dossier.nextRenewal.value}</strong>
          <span>Renewal / deal</span>
          <SourceTag source={dossier.nextRenewal.source} />
        </div>
        <div className={`acc-kpi ${toneClass(dossier.health)}`}>
          <strong>{dossier.relationship.value}</strong>
          <span>Relationship</span>
          <SourceTag source={dossier.relationship.source} asOf={dossier.relationship.asOf} />
        </div>
      </div>

      <div className="acc-primary-grid">
        <section className="acc-panel">
          <h2>Most recent contact</h2>
          <p className="acc-contact-when">{dossier.lastContact.when}</p>
          <p>
            <strong>{dossier.lastContact.who}</strong> · {dossier.lastContact.channel}
          </p>
          <p className="acc-muted">{dossier.lastContact.summary}</p>
          <SourceTag source={dossier.lastContact.source} />
          <div className="acc-eng">
            <p className="acc-eng__label">Engagement (6 months)</p>
            <Sparkline values={dossier.engagementTrend} tone={dossier.health} />
          </div>
        </section>

        <section className="acc-panel">
          <h2>Share price</h2>
          <ShareChart dossier={dossier} />
        </section>

        <section className="acc-panel acc-panel--wide">
          <h2>Product hold vs peers</h2>
          <ProductBars dossier={dossier} />
        </section>
      </div>

      <div className="acc-secondary-grid">
        <section className="acc-panel">
          <h2>Operational concerns</h2>
          <ul className="acc-list">
            {dossier.opsConcerns.map((c) => (
              <li key={c.title} className={toneClass(c.severity)}>
                <div className="acc-list__top">
                  <strong>{c.title}</strong>
                  <span className={`acc-pill ${toneClass(c.severity)}`}>{c.severity}</span>
                </div>
                <p>{c.detail}</p>
                <SourceTag source={c.source} />
              </li>
            ))}
          </ul>
        </section>

        <section className="acc-panel">
          <h2>Upcoming events</h2>
          <ul className="acc-list">
            {dossier.upcoming.map((e) => (
              <li key={`${e.date}-${e.title}`}>
                <div className="acc-list__top">
                  <strong>{e.title}</strong>
                  <span className="acc-pill acc-tone--neutral">{e.date}</span>
                </div>
                <p>{e.kind}</p>
                <SourceTag source={e.source} />
              </li>
            ))}
          </ul>
        </section>

        <section className="acc-panel">
          <h2>News</h2>
          <ul className="acc-list">
            {dossier.news.map((n) => (
              <li key={n.headline}>
                <div className="acc-list__top">
                  <strong>{n.headline}</strong>
                  <span className="acc-pill acc-tone--neutral">{n.date}</span>
                </div>
                <SourceTag source={n.source} />
              </li>
            ))}
          </ul>
        </section>

        <section className="acc-panel">
          <h2>Working note</h2>
          <p>{dossier.notes.value}</p>
          <SourceTag source={dossier.notes.source} asOf={dossier.notes.asOf} />
        </section>
      </div>
    </div>
  );
}

export function AccountsPage() {
  const params = useSearchParams();
  const fromUrl = params.get("id");
  const [selected, setSelected] = useState(
    () => (fromUrl && getDossier(fromUrl) ? fromUrl : ACCOUNT_LIST[0].id),
  );
  const [query, setQuery] = useState("");

  useEffect(() => {
    if (fromUrl && getDossier(fromUrl)) setSelected(fromUrl);
  }, [fromUrl]);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return ACCOUNT_LIST;
    return ACCOUNT_LIST.filter(
      (a) =>
        a.name.toLowerCase().includes(q) ||
        a.relationship.toLowerCase().includes(q) ||
        a.owner.toLowerCase().includes(q),
    );
  }, [query]);

  const dossier = getDossier(selected);

  return (
    <div className="acc-page">
      <aside className="acc-rail" aria-label="Accounts">
        <div className="acc-rail__head">
          <h1>Accounts</h1>
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Filter accounts"
            aria-label="Filter accounts"
          />
        </div>
        <ul className="acc-rail__list">
          {filtered.map((a) => (
            <li key={a.id}>
              <button
                type="button"
                className={selected === a.id ? "is-active" : undefined}
                onClick={() => setSelected(a.id)}
              >
                <span className={`acc-rail__dot ${toneClass(a.health)}`} aria-hidden />
                <span className="acc-rail__main">
                  <strong>{a.name}</strong>
                  <em>
                    {a.relationship} · {a.aum}
                  </em>
                </span>
              </button>
            </li>
          ))}
        </ul>
      </aside>
      <main className="acc-main">
        {dossier ? (
          <AccountDetail dossier={dossier} />
        ) : (
          <p className="acc-empty">Select an account to see the dossier.</p>
        )}
      </main>
    </div>
  );
}
