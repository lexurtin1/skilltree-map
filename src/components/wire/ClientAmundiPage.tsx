import "./wire.css";
import {
  AMUNDI,
  AMUNDI_CLOCK,
  AMUNDI_CLOCK_NOTE,
  AMUNDI_HOLDINGS,
  AMUNDI_RELS,
} from "@/lib/gi/wire-demo";
import { DensePanel, HoldCell } from "./primitives";

export function ClientAmundiPage() {
  return (
    <div className="wire-page">
      <div className="wire-shell wire-shell--wide">
        <header className="wire-client-head">
          <div className="wire-avatar" aria-hidden>
            {AMUNDI.initials}
          </div>
          <div>
            <h1 className="wire-title">{AMUNDI.name}</h1>
            <p className="wire-sub">{AMUNDI.summary}</p>
          </div>
        </header>

        <div className="wire-kpis" aria-label="Key metrics, most important first">
          {AMUNDI.kpis.map((k) => (
            <div key={k.label} className={`wire-kpi wire-kpi--${k.tone}`}>
              <div className="wire-kpi__value">{k.value}</div>
              <div className="wire-kpi__label">{k.label}</div>
            </div>
          ))}
        </div>

        <DensePanel title={AMUNDI.matrixTitle} className="wire-primary-panel">
          <div style={{ overflowX: "auto" }}>
            <table className="wire-hold-table">
              <thead>
                <tr>
                  <th>Broadridge product</th>
                  {AMUNDI.entities.map((e) => (
                    <th key={e}>{e}</th>
                  ))}
                  <th>Peer set</th>
                </tr>
              </thead>
              <tbody>
                {AMUNDI_HOLDINGS.map((row) => (
                  <tr key={row.product}>
                    <td>{row.product}</td>
                    <td>
                      <HoldCell state={row.paris} />
                    </td>
                    <td>
                      <HoldCell state={row.lux} />
                    </td>
                    <td>
                      <HoldCell state={row.dublin} />
                    </td>
                    <td>
                      <HoldCell state={row.cpr} />
                    </td>
                    <td>
                      <div className="wire-peer-bar">
                        <div className="wire-peer-bar__track">
                          <span style={{ width: `${row.peerPct}%` }} />
                        </div>
                        <span>{row.peer}</span>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="wire-legend">
            <span>
              <HoldCell state="held" /> Held
            </span>
            <span>
              <HoldCell state="partial" /> Partial
            </span>
            <span>
              <HoldCell state="peer-gap" /> Held by peers, not here
            </span>
            <span>
              <HoldCell state="na" /> Not applicable
            </span>
          </div>
          <p className="wire-sub" style={{ marginTop: 12 }}>
            Peer set: {AMUNDI.peerSet}
          </p>
        </DensePanel>

        <div className="wire-secondary-row">
          <DensePanel title="Regulatory clock">
            {AMUNDI_CLOCK.map((item) => (
              <div key={item.label} className="wire-clock-item">
                <div className={`wire-clock-days wire-clock-days--${item.tone}`}>
                  {item.days}d
                </div>
                <div>
                  <strong>{item.label}</strong>
                  <div className="wire-sub">{item.detail}</div>
                </div>
              </div>
            ))}
            <p className="wire-ledger-note">{AMUNDI_CLOCK_NOTE}</p>
          </DensePanel>

          <DensePanel title="Who knows whom">
            <div className="wire-rel">
              {AMUNDI_RELS.map((edge) => (
                <div key={`${edge.from}-${edge.to}`}>
                  <div className="wire-rel-edge">
                    <div className="wire-rel-node">{edge.from}</div>
                    <div className={`wire-rel-line wire-rel-line--${edge.strength}`} />
                    <div className="wire-rel-node">{edge.to}</div>
                  </div>
                  <p
                    className={`wire-rel-note${edge.strength === "none" ? " wire-rel-note--none" : ""}`}
                  >
                    {edge.note}
                  </p>
                </div>
              ))}
            </div>
          </DensePanel>
        </div>

        <p className="wire-sub wire-history-note">{AMUNDI.historyNote}</p>
      </div>
    </div>
  );
}
