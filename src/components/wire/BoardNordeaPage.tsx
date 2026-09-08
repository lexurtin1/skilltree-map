import "./wire.css";
import {
  BOARD_CELLS,
  BOARD_COMPARABLES,
  BOARD_CRITERIA,
  BOARD_STAKEHOLDERS,
  NORDEA_BOARD,
} from "@/lib/gi/wire-demo";
import { DensePanel, EvidenceCellMark, StatusPill } from "./primitives";

export function BoardNordeaPage() {
  const dayPct = Math.min(
    100,
    (BOARD_COMPARABLES.thisDealDay / BOARD_COMPARABLES.medianDeath) * 100,
  );
  const wonPct = (BOARD_COMPARABLES.won / BOARD_COMPARABLES.total) * 100;

  return (
    <div className="wire-page">
      <div className="wire-shell wire-shell--wide">
        <header className="wire-board-head">
          <h1 className="wire-title">{NORDEA_BOARD.name}</h1>
          <div className="wire-board-pills">
            {NORDEA_BOARD.pills.map((p) => (
              <StatusPill key={p.label} label={p.label} tone={p.tone} />
            ))}
          </div>
          <p className="wire-sub" style={{ marginTop: 10 }}>
            {NORDEA_BOARD.summary}
          </p>
        </header>

        <div className="wire-coverage">
          <strong>Evidence coverage {NORDEA_BOARD.coverage}%</strong>
          <div className="wire-coverage__bar" aria-hidden>
            <span
              style={{
                width: `${NORDEA_BOARD.confirmedPct}%`,
                background: "#1c7a52",
              }}
            />
            <span
              style={{
                width: `${NORDEA_BOARD.inferredPct}%`,
                background: "#e6c35c",
              }}
            />
          </div>
          <div className="wire-legend">
            <span>
              <EvidenceCellMark state="confirmed" /> Confirmed
            </span>
            <span>
              <EvidenceCellMark state="inferred" /> Inferred
            </span>
            <span>
              <EvidenceCellMark state="nothing" /> Nothing
            </span>
          </div>
        </div>

        <div className="wire-board-layout">
          <DensePanel>
            <div className="wire-matrix-scroll">
              <table className="wire-matrix">
                <thead>
                  <tr>
                    <th>Decision criteria</th>
                    {BOARD_STAKEHOLDERS.map((s) => (
                      <th key={s.id}>
                        {s.name}
                        <span>{s.role}</span>
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {BOARD_CRITERIA.map((c, ri) => (
                    <tr key={c.id}>
                      <td>{c.label}</td>
                      {BOARD_CELLS[ri].map((cell, ci) => (
                        <td key={`${c.id}-${BOARD_STAKEHOLDERS[ci].id}`}>
                          <EvidenceCellMark state={cell} />
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <p className="wire-sub" style={{ marginTop: 12 }}>
              {NORDEA_BOARD.footer}
            </p>
          </DensePanel>

          <DensePanel title="Deals with this evidence shape">
            <p className="wire-sub">{BOARD_COMPARABLES.total} comparable deals</p>
            <div className="wire-compare-bar" aria-hidden>
              <div className="wire-compare-bar__won" style={{ width: `${wonPct}%` }} />
              <div
                className="wire-compare-bar__died"
                style={{ width: `${100 - wonPct}%` }}
              />
            </div>
            <div className="wire-legend" style={{ marginBottom: 12 }}>
              <span style={{ color: "#1c7a52", fontWeight: 700 }}>
                {BOARD_COMPARABLES.won} won
              </span>
              <span style={{ color: "#9b1c3a", fontWeight: 700 }}>
                {BOARD_COMPARABLES.died} died
              </span>
            </div>
            <p style={{ fontSize: 12.5, marginBottom: 4 }}>
              Median days to close:{" "}
              <strong style={{ color: "#1c7a52" }}>{BOARD_COMPARABLES.medianClose}</strong>
            </p>
            <p style={{ fontSize: 12.5, marginBottom: 12 }}>
              Median days to death:{" "}
              <strong style={{ color: "#c41e3a" }}>{BOARD_COMPARABLES.medianDeath}</strong>
            </p>
            <p style={{ fontSize: 12.5, fontWeight: 600 }}>
              This deal is at day {BOARD_COMPARABLES.thisDealDay}
            </p>
            <div className="wire-day-bar" aria-hidden>
              <span style={{ width: `${dayPct}%` }} />
            </div>
            <p className="wire-ledger-note" style={{ marginTop: 12 }}>
              {BOARD_COMPARABLES.insight}
            </p>
          </DensePanel>
        </div>
      </div>
    </div>
  );
}
