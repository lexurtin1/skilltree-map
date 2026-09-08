"use client";

import Link from "next/link";
import { useEffect, useId, useRef, useState } from "react";
import { BrandLogo } from "../BrandLogo";
import { AccountsMap } from "./AccountsMap";
import { answerQuery } from "./askQuery";
import {
  ACCOUNTS,
  ASK_SUGGESTIONS,
  COVERAGE_CELL_STYLE,
  COVERAGE_ROLES,
  COVERAGE_ROWS,
  DAILY_BRIEFING,
  ENGAGEMENT_TRENDS,
  RENEWAL_BARS,
  RENEWAL_MONTHS,
  STATE_LEGEND,
  TEXT_FOR_STATE,
  haloFor,
  type TodayAccount,
} from "./data";
import "./today.css";

function PreparePanel({
  account,
  prepared,
  checked,
  notes,
  onCheck,
  onNotes,
  onComplete,
  onClose,
}: {
  account: TodayAccount;
  prepared: boolean;
  checked: string[];
  notes: string;
  onCheck: (id: string) => void;
  onNotes: (v: string) => void;
  onComplete: () => void;
  onClose: () => void;
}) {
  const titleId = useId();
  const ref = useRef<HTMLDivElement>(null);
  const checks = [
    { id: "read", label: "Read the overnight change and product relevance" },
    { id: "people", label: "Confirm who to involve from the people list" },
    { id: "questions", label: "Choose one discovery question to open with" },
  ];
  const allDone = checks.every((c) => checked.includes(c.id));

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    document.addEventListener("keydown", onKey);
    ref.current?.querySelector<HTMLElement>("button, [href]")?.focus();
    return () => document.removeEventListener("keydown", onKey);
  }, [onClose]);

  return (
    <div className="today-prepare-overlay" role="dialog" aria-modal="true" aria-labelledby={titleId}>
      <button type="button" className="today-prepare-scrim" aria-label="Close" onClick={onClose} />
      <div className="today-prepare-sheet" ref={ref}>
        <header>
          <p className="today-kicker">Prepare me</p>
          <h2 id={titleId}>{account.action.title}</h2>
          <p>{account.action.when}</p>
        </header>

        <section>
          <h3>Suggested meeting goal</h3>
          <p>{account.talk[0]}</p>
        </section>

        <section>
          <h3>Discovery questions</h3>
          <ol>
            {account.prepareQuestions.map((q) => (
              <li key={q}>{q}</li>
            ))}
          </ol>
        </section>

        <section>
          <h3>Broadridge products in play</h3>
          <div className="today-prepare-products">
            {account.services.map((s) => (
              <span key={s}>{s}</span>
            ))}
          </div>
        </section>

        <details>
          <summary>Review evidence · {account.evidence.length} illustrative sources</summary>
          <ul>
            {account.evidence.map((e) => (
              <li key={e}>{e}</li>
            ))}
          </ul>
          <p className="today-prepare-caveat">
            Facts come from sources · product fit is the system’s inference · illustrative data
          </p>
        </details>

        <section>
          <h3>People at this account</h3>
          <ul className="today-prepare-people">
            {account.people.map(([name, role]) => (
              <li key={name}>
                <strong>{name}</strong>
                <span>{role}</span>
              </li>
            ))}
          </ul>
        </section>

        <fieldset>
          <legend>Preparation checks</legend>
          {checks.map((c) => (
            <label key={c.id}>
              <input
                type="checkbox"
                checked={checked.includes(c.id)}
                onChange={() => onCheck(c.id)}
              />
              {c.label}
            </label>
          ))}
        </fieldset>

        <label className="today-prepare-notes">
          <span>Your meeting notes</span>
          <textarea
            value={notes}
            onChange={(e) => onNotes(e.target.value)}
            rows={3}
            placeholder="Optional notes for this session"
          />
        </label>

        <footer>
          <button type="button" className="today-btn-ghost" onClick={onClose}>
            Close
          </button>
          {account.recordId && (
            <Link href={`/accounts/${account.recordId}`} className="today-btn-ghost">
              Open account record
            </Link>
          )}
          <button
            type="button"
            className="today-btn-primary"
            disabled={!allDone && !prepared}
            onClick={onComplete}
          >
            {prepared ? "Preparation saved" : "Mark preparation complete"}
          </button>
        </footer>
      </div>
    </div>
  );
}

export function Today() {
  const [selectedId, setSelectedId] = useState(ACCOUNTS[0].id);
  const [askDraft, setAskDraft] = useState("");
  const [asked, setAsked] = useState<string | null>(null);
  const [prepareOpen, setPrepareOpen] = useState(false);
  const [preparedIds, setPreparedIds] = useState<string[]>([]);
  const [checked, setChecked] = useState<string[]>([]);
  const [notes, setNotes] = useState("");

  const selected = ACCOUNTS.find((a) => a.id === selectedId) ?? ACCOUNTS[0];
  const prepared = preparedIds.includes(selected.id);
  const queue = ACCOUNTS.filter((a) => a.id !== selected.id).slice(0, 4);
  const answer = answerQuery(asked ?? "", selected.id, { accounts: ACCOUNTS });
  const headWords = selected.head.split(" ");
  const confBars = [0, 1, 2].map((i) => (i < selected.conf ? selected.state : "rgba(10,37,64,0.12)"));

  const pick = (id: string) => {
    setSelectedId(id);
    setAsked(null);
    setAskDraft("");
  };

  const runAsk = (q: string) => {
    const text = q.trim();
    if (!text) return;
    setAsked(text);
    setAskDraft("");
  };

  const toggleCheck = (id: string) => {
    setChecked((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id],
    );
  };

  const completePrepare = () => {
    setPreparedIds((prev) => (prev.includes(selected.id) ? prev : [...prev, selected.id]));
    setPrepareOpen(false);
  };

  const openPrepare = () => {
    setPrepareOpen(true);
  };

  return (
    <div className="today-redesign">
      <div className="today-atmosphere" aria-hidden>
        <span className="today-blob today-blob-a" />
        <span className="today-blob today-blob-b" />
        <span className="today-blob today-blob-c" />
      </div>

      <div className="today-inner">
        <header className="today-brand-strip">
          <div className="today-brand-lockup">
            <BrandLogo variant="lockup" height={48} className="today-brand-logo" priority />
            <span className="today-brand-rule" aria-hidden />
            <span className="today-brand-product">Growth Intelligence</span>
          </div>
          <p className="today-brand-tag">
            Broadridge fund distribution, communications and market intelligence —
            illustrative book for James Howard
          </p>
        </header>

        <section className="today-editorial">
          <p className="today-kicker">{DAILY_BRIEFING.dateLabel}</p>
          <h1>{DAILY_BRIEFING.lead}</h1>
        </section>

        <div className="today-hero-row">
          <article className="today-priority">
            <div className="today-priority-inner">
              <div className="today-priority-meta">
                <span className="today-priority-pill">
                  <span className="today-priority-dot" aria-hidden>
                    <i />
                    <i />
                  </span>
                  Priority action
                </span>
                <span>
                  Found 08:12 today · {ACCOUNTS.findIndex((a) => a.id === selected.id) + 1} of{" "}
                  {ACCOUNTS.length}
                </span>
              </div>

              <div className="today-priority-client">
                <p className="today-kicker">Client</p>
                <div className="today-priority-client-row">
                  <h2 className="today-priority-client-name">{selected.full}</h2>
                  <span
                    className="today-priority-client-kind"
                    style={{
                      color: TEXT_FOR_STATE[selected.state],
                      background: haloFor(selected.state),
                    }}
                  >
                    <i style={{ background: selected.state }} aria-hidden />
                    {selected.kind}
                  </span>
                </div>
                <p className="today-priority-client-meta">
                  £{selected.rev}m with us · HQ {selected.hq}
                  {selected.recordId ? (
                    <>
                      {" · "}
                      <Link
                        href={`/accounts/${selected.recordId}`}
                        className="today-priority-client-link"
                      >
                        Open account record
                      </Link>
                    </>
                  ) : null}
                </p>
              </div>

              <h3 className="today-priority-head" aria-live="polite">
                {headWords.map((w, i) => (
                  <span
                    key={`${selected.id}-${i}-${w}`}
                    style={{ animationDelay: `${0.1 + i * 0.045}s` }}
                  >
                    {w}&nbsp;
                  </span>
                ))}
              </h3>

              <div className="today-chain">
                {selected.chain.map((st) => (
                  <div key={st.k} className="today-chain-step">
                    <div className="today-chain-line">
                      <span
                        style={{
                          background: st.dot,
                          boxShadow: `0 0 0 4px ${haloFor(st.dot)}`,
                        }}
                      />
                      <i />
                    </div>
                    <p className="today-kicker">{st.k}</p>
                    <p className="today-chain-title">{st.t}</p>
                    <p className="today-chain-meta">{st.m}</p>
                  </div>
                ))}
              </div>

              <div className="today-stats">
                {selected.stats.map(([label, value]) => (
                  <div key={label}>
                    <span>{label}</span>
                    <strong>{value}</strong>
                  </div>
                ))}
              </div>

              <div className="today-products">
                <p className="today-kicker">Broadridge products</p>
                <div className="today-product-chips">
                  {selected.services.map((s) => (
                    <span key={s}>{s}</span>
                  ))}
                </div>
              </div>

              <div className="today-dual">
                <div>
                  <p className="today-kicker">What to say in the meeting</p>
                  <ol className="today-talk">
                    {selected.talk.map((t, i) => (
                      <li key={t}>
                        <span>{i + 1}</span>
                        <p>{t}</p>
                      </li>
                    ))}
                  </ol>
                </div>
                <div>
                  <p className="today-kicker">People at this account</p>
                  <ul className="today-people">
                    {selected.people.map(([name, role]) => (
                      <li key={name}>
                        <strong>{name}</strong>
                        <span>{role}</span>
                      </li>
                    ))}
                  </ul>
                  <div className="today-evidence">
                    {selected.evidence.map((e) => (
                      <span key={e}>{e}</span>
                    ))}
                  </div>
                </div>
              </div>

              <div className="today-priority-footer">
                <button type="button" className="today-cta" onClick={openPrepare}>
                  <span className="today-cta-shine" aria-hidden />
                  <span>{prepared ? "Review meeting preparation" : selected.action.cta}</span>
                  <span aria-hidden>→</span>
                </button>
                <div>
                  <p className="today-cta-title">{selected.action.title}</p>
                  <p className="today-cta-when">{selected.action.when}</p>
                </div>
                <div className="today-conf">
                  <div className="today-conf-bars" aria-hidden>
                    {confBars.map((c, i) => (
                      <span key={i} style={{ background: c }} />
                    ))}
                  </div>
                  <span>{selected.confLabel}</span>
                  <p>Facts come from sources · the conclusion is the system’s · illustrative data</p>
                </div>
              </div>
            </div>
          </article>

          <aside className="today-side">
            <div className="today-glass today-queue">
              <p className="today-kicker">The other three changes</p>
              <ul>
                {queue.map((q) => (
                  <li key={q.id}>
                    <button type="button" onClick={() => pick(q.id)}>
                      <i style={{ background: q.state }} />
                      <span>
                        <strong>{q.full}</strong>
                        <em>{q.note}</em>
                      </span>
                      <b>{q.kind}</b>
                    </button>
                  </li>
                ))}
              </ul>
            </div>

            <div className="today-glass today-ask-card">
              <div className="today-ask-title">
                <span className="today-ask-orb" aria-hidden />
                <p>Ask a question about {selected.short}</p>
              </div>
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  runAsk(askDraft);
                }}
              >
                <label className="sr-only" htmlFor="today-ask-field">
                  Type a question about this account
                </label>
                <input
                  id="today-ask-field"
                  value={askDraft}
                  onChange={(e) => setAskDraft(e.target.value)}
                  placeholder="Type a question about this account"
                  autoComplete="off"
                />
              </form>
              <div className="today-ask-suggestions" role="group" aria-label="Suggested questions">
                {ASK_SUGGESTIONS.map((s) => (
                  <button
                    key={s}
                    type="button"
                    className={asked === s ? "is-active" : undefined}
                    onClick={() => runAsk(s)}
                  >
                    {s}
                  </button>
                ))}
              </div>
              <div className="today-ask-answer" aria-live="polite">
                <p>{answer.text}</p>
                {answer.bullets && answer.bullets.length > 0 && (
                  <ul>
                    {answer.bullets.map((b) => (
                      <li key={b}>{b}</li>
                    ))}
                  </ul>
                )}
                <span>
                  {answer.sources[0]?.detail ??
                    "From the illustrative briefing for this account."}
                </span>
              </div>
            </div>
          </aside>
        </div>

        <section className="today-glass today-map-section">
          <div className="today-map-heading">
            <div>
              <p className="today-kicker">Accounts on a map</p>
              <h2>Account locations and fund distribution</h2>
            </div>
            <div className="today-legend">
              {STATE_LEGEND.map((l) => (
                <span key={l.t}>
                  <i style={{ background: l.c }} />
                  {l.t}
                </span>
              ))}
            </div>
          </div>
          <AccountsMap selectedId={selected.id} onSelect={pick} />
        </section>

        <section className="today-charts">
          <div className="today-glass">
            <p className="today-kicker">Revenue at risk</p>
            <h2>Contract renewals in the next 12 months</h2>
            <div className="today-renewal-bars" aria-hidden>
              {RENEWAL_BARS.map((r, i) => (
                <span
                  key={i}
                  style={{
                    height: `${r.h}%`,
                    background: r.hot
                      ? CRIM_BAR
                      : r.warm
                        ? AMBER_BAR
                        : "rgba(140,163,188,0.32)",
                  }}
                >
                  {r.label && (
                    <b style={{ color: r.hot ? "#96453E" : "#8A5E12" }}>{r.label}</b>
                  )}
                </span>
              ))}
            </div>
            <div className="today-renewal-months" aria-hidden>
              {RENEWAL_MONTHS.map((m, i) => (
                <span key={`${m}-${i}`} style={{ color: i === 1 ? "#96453E" : undefined }}>
                  {m}
                </span>
              ))}
            </div>
            <p className="today-chart-note">
              M&G renews in 22 days with three Fund Communication Solutions support tickets
              still open. It is the largest amount of revenue you could lose.
            </p>
          </div>

          <div className="today-glass">
            <p className="today-kicker">Relationship gap</p>
            <h2>Contacts you have at each account</h2>
            <div
              className="today-coverage"
              style={{
                gridTemplateColumns: `82px repeat(${COVERAGE_ROLES.length}, minmax(0, 1fr))`,
              }}
            >
              <span />
              {COVERAGE_ROLES.map((r) => (
                <span key={r} className="today-coverage-role">
                  {r}
                </span>
              ))}
              {COVERAGE_ROWS.map((row) => (
                <CoverageRow
                  key={row.accountId}
                  name={row.name}
                  cells={row.cells}
                  active={row.accountId === selected.id}
                  onSelect={() => pick(row.accountId)}
                />
              ))}
            </div>
            <div className="today-coverage-legend">
              {(["a", "t", "n", "g"] as const).map((k) => (
                <span key={k}>
                  <i
                    style={{
                      background: COVERAGE_CELL_STYLE[k].bg,
                      border: COVERAGE_CELL_STYLE[k].bd,
                    }}
                  />
                  {COVERAGE_CELL_STYLE[k].label}
                </span>
              ))}
            </div>
          </div>

          <div className="today-glass">
            <p className="today-kicker">What changed</p>
            <h2>Meetings and contact over the last 6 months</h2>
            <div className="today-trends">
              {ENGAGEMENT_TRENDS.map((t) => (
                <button
                  key={t.accountId}
                  type="button"
                  className={t.accountId === selected.id ? "is-active" : undefined}
                  onClick={() => pick(t.accountId)}
                >
                  <span>{t.name}</span>
                  <svg viewBox="0 0 100 26" preserveAspectRatio="none" aria-hidden>
                    <polyline
                      points={t.pts}
                      fill="none"
                      stroke={t.c}
                      strokeWidth="1.8"
                      strokeLinecap="round"
                      vectorEffect="non-scaling-stroke"
                    />
                  </svg>
                  <strong style={{ color: t.tc }}>{t.delta}</strong>
                </button>
              ))}
            </div>
            <p className="today-chart-note">
              Three accounts are contacting you more, two have stopped. Less contact plus a
              Fund Communication Solutions renewal date soon is the case to act on.
            </p>
          </div>
        </section>

        <footer className="today-footer">
          <span>{DAILY_BRIEFING.stamp}</span>
          <span>Fund sources checked 7 Sep 2026</span>
        </footer>
      </div>

      {prepareOpen && (
        <PreparePanel
          account={selected}
          prepared={prepared}
          checked={checked}
          notes={notes}
          onCheck={toggleCheck}
          onNotes={setNotes}
          onComplete={completePrepare}
          onClose={() => setPrepareOpen(false)}
        />
      )}
    </div>
  );
}

const CRIM_BAR = "#C4675F";
const AMBER_BAR = "#D99A3E";

function CoverageRow({
  name,
  cells,
  active,
  onSelect,
}: {
  name: string;
  cells: (keyof typeof COVERAGE_CELL_STYLE)[];
  active: boolean;
  onSelect: () => void;
}) {
  return (
    <>
      <button
        type="button"
        className={`today-coverage-name${active ? " is-active" : ""}`}
        onClick={onSelect}
      >
        {name}
      </button>
      {cells.map((c, i) => (
        <span
          key={`${name}-${i}`}
          className="today-coverage-cell"
          style={{
            background: COVERAGE_CELL_STYLE[c].bg,
            border: COVERAGE_CELL_STYLE[c].bd,
          }}
        />
      ))}
    </>
  );
}
