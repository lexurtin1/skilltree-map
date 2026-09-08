import Link from "next/link";
import "./wire.css";
import {
  AT_RISK,
  EXEC_UNBLOCKS,
  EXECUTIVE,
  NORDEA_TIMELINE,
  QUEUE_NOTE,
  QUEUE_STAGES,
} from "@/lib/gi/wire-demo";
import { ActionButton, DensePanel } from "./primitives";

const maxP90 = Math.max(...QUEUE_STAGES.map((s) => s.p90));

export function ExecutivePage() {
  return (
    <div className="wire-page">
      <div className="wire-shell wire-shell--wide">
        <header>
          <p className="wire-sub">
            {EXECUTIVE.stamp} · {EXECUTIVE.person}
          </p>
          <h1 className="wire-title" style={{ marginTop: 4 }}>
            Executive
          </h1>
        </header>

        <div className="wire-exec-grid">
          <DensePanel title="Queue time by stage — the number nobody measures">
            {QUEUE_STAGES.map((s) => (
              <div key={s.stage} className="wire-queue-row">
                <span>{s.stage}</span>
                <div className={`wire-queue-bar${s.hot ? " wire-queue-bar--hot" : ""}`}>
                  <span style={{ width: `${(s.p90 / maxP90) * 100}%` }} />
                </div>
                <span
                  style={{
                    fontVariantNumeric: "tabular-nums",
                    fontWeight: s.hot ? 700 : 500,
                    color: s.hot ? "#c41e3a" : undefined,
                  }}
                >
                  p90 {s.p90}
                </span>
              </div>
            ))}
            <p className="wire-ledger-note">{QUEUE_NOTE}</p>
          </DensePanel>

          <DensePanel title="At risk, ranked by evidence gap">
            {AT_RISK.map((d) => (
              <div key={d.name} className="wire-risk-row">
                <div className="wire-risk-meta">
                  <span>
                    {d.name === "Nordea AM" ? (
                      <Link href="/board" style={{ color: "inherit", textDecoration: "none" }}>
                        {d.name}
                      </Link>
                    ) : (
                      d.name
                    )}{" "}
                    <span style={{ fontWeight: 500, color: "var(--text-3)" }}>({d.value})</span>
                  </span>
                </div>
                <p className="wire-risk-status">{d.status}</p>
                <div className="wire-risk-bar" aria-hidden>
                  <span style={{ width: `${d.confirmed}%`, background: "#1c7a52" }} />
                  <span style={{ width: `${d.inferred}%`, background: "#e6c35c" }} />
                </div>
              </div>
            ))}
          </DensePanel>

          <DensePanel title="Needs you — three items only you can unblock">
            {EXEC_UNBLOCKS.map((u) => (
              <div key={u.title} className="wire-unblock">
                <div>
                  <strong style={{ fontSize: 13 }}>{u.title}</strong>
                  <span style={{ fontSize: 13 }}> — {u.detail}</span>
                  <p className="wire-sub">{u.note}</p>
                </div>
                <ActionButton href={u.href} label={u.action} primary />
              </div>
            ))}
          </DensePanel>

          <DensePanel title="Nordea — what we knew on day 12">
            <div className="wire-timeline">
              {NORDEA_TIMELINE.markers.map((m) => (
                <div key={m.label} className="wire-timeline__mark">
                  <div
                    className={`wire-timeline__dot${m.hot ? " wire-timeline__dot--hot" : ""}`}
                  />
                  {m.label}
                </div>
              ))}
            </div>
            {NORDEA_TIMELINE.beats.map((b) => (
              <div key={b.title} className="wire-beat">
                <p
                  className={`wire-beat__title${b.tone === "risk" ? " wire-beat__title--risk" : ""}`}
                >
                  {b.title}
                </p>
                <p>{b.body}</p>
              </div>
            ))}
          </DensePanel>
        </div>
      </div>
    </div>
  );
}
