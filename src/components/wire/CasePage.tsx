import Link from "next/link";
import "./wire.css";
import { CASE_THESIS } from "@/lib/gi/wire-demo";

export function CasePage() {
  return (
    <div className="wire-page">
      <div className="wire-shell">
        <p className="wire-sub">{CASE_THESIS.title}</p>
        <h1 className="wire-title" style={{ fontSize: 28, marginTop: 6 }}>
          {CASE_THESIS.headline}
        </h1>
        <p className="wire-sub" style={{ marginTop: 10, maxWidth: "62ch", fontSize: 15 }}>
          {CASE_THESIS.lede}
        </p>

        <div className="wire-steps">
          {CASE_THESIS.steps.map((step, i) => (
            <Link key={step.href} href={step.href} className="wire-step">
              <span className="wire-step__label">
                {i + 1}. {step.label}
              </span>
              <p className="wire-step__text">{step.text}</p>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
