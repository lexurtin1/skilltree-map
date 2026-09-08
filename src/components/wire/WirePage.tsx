import "./wire.css";
import {
  LEDGER,
  LEDGER_NOTE,
  SILENCE,
  WIRE_FEED,
  WIRE_META,
} from "@/lib/gi/wire-demo";
import { ActionButton, DensePanel, SourceTags, StatusPill } from "./primitives";

function silenceTone(months: number): "hot" | "warm" | "ok" {
  if (months >= 8) return "hot";
  if (months >= 3) return "warm";
  return "ok";
}

export function WirePage() {
  return (
    <div className="wire-page">
      <div className="wire-shell wire-shell--wide">
        <header>
          <h1 className="wire-title">
            {WIRE_META.title} — {WIRE_META.stamp}
          </h1>
        </header>

        <div className="wire-layout">
          <div className="wire-feed">
            {WIRE_FEED.map((card) => (
              <article key={card.rank} className="wire-card">
                <div className="wire-card__rank">{card.rank}</div>
                <div>
                  <p className="wire-card__account">{card.account}</p>
                  <div className="wire-card__head">
                    <h2 className="wire-card__headline">{card.headline}</h2>
                    <StatusPill label={card.tag} tone={card.tagTone} />
                  </div>
                  <ul className="wire-card__bullets">
                    {card.bullets.map((b) => (
                      <li key={b}>{b}</li>
                    ))}
                  </ul>
                  <div className="wire-card__actions">
                    {card.actions.map((a) => (
                      <ActionButton
                        key={a.label}
                        href={a.href}
                        label={a.label}
                        primary={a.primary}
                      />
                    ))}
                  </div>
                  <SourceTags sources={card.sources} />
                </div>
              </article>
            ))}
          </div>

          <aside className="wire-side">
            <DensePanel title="Your ledger">
              {LEDGER.map((item) => (
                <div key={item.title} className="wire-ledger-item">
                  <span>{item.title}</span>
                  <StatusPill label={item.due} tone={item.dueTone} />
                </div>
              ))}
              <p className="wire-ledger-note">{LEDGER_NOTE}</p>
            </DensePanel>

            <DensePanel title="Silence detection">
              <p className="wire-sub" style={{ marginBottom: 10 }}>
                Months since last commercial contact
              </p>
              {SILENCE.map((row) => {
                const tone = silenceTone(row.months);
                const width = Math.min(100, (row.months / 11) * 100);
                return (
                  <div key={row.name} className="wire-silence-row">
                    <span>{row.name}</span>
                    <div className={`wire-silence-bar wire-silence-bar--${tone}`}>
                      <span style={{ width: `${Math.max(width, 6)}%` }} />
                    </div>
                    <span style={{ textAlign: "right", fontVariantNumeric: "tabular-nums" }}>
                      {row.label}
                    </span>
                  </div>
                );
              })}
            </DensePanel>
          </aside>
        </div>
      </div>
    </div>
  );
}
