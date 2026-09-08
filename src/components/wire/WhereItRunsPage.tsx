import "./wire.css";
import { WHERE_IT_RUNS } from "@/lib/gi/wire-demo";
import { DensePanel } from "./primitives";

export function WhereItRunsPage() {
  return (
    <div className="wire-page">
      <div className="wire-shell wire-shell--wide">
        <h1 className="wire-title">{WHERE_IT_RUNS.title}</h1>
        <p className="wire-sub" style={{ marginTop: 6, maxWidth: "64ch" }}>
          {WHERE_IT_RUNS.lede}
        </p>

        <div className="wire-flow">
          {WHERE_IT_RUNS.flow.map((node, i) => (
            <div key={node.id} className="wire-flow__node">
              <strong>
                {i + 1}. {node.label}
              </strong>
              <span className="wire-sub">{node.examples}</span>
            </div>
          ))}
        </div>

        <DensePanel title="Source systems behind Wire footers">
          <table className="wire-sys-table">
            <thead>
              <tr>
                <th>System</th>
                <th>What it feeds</th>
                <th>Surfaces</th>
              </tr>
            </thead>
            <tbody>
              {WHERE_IT_RUNS.systems.map((s) => (
                <tr key={s.name}>
                  <td>
                    <strong>{s.name}</strong>
                  </td>
                  <td>{s.feeds}</td>
                  <td>{s.usedBy}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </DensePanel>
      </div>
    </div>
  );
}
