"use client";

import Link from "next/link";
import { useEffect, useMemo, useRef, useState } from "react";
import { ArrowRightIcon, PrepareIcon, CheckIcon } from "../ui/Icons";
import { AskPanel } from "./AskPanel";
import {
  ACCOUNTS,
  BOOK_STATES,
  CHANGES,
  DAILY_BRIEFING,
  DEMO_SIGNAL,
  PEOPLE,
  PRIORITY,
  personById,
  type BookState,
  type ChangeItem,
  type Focus,
  type TodayAccount,
} from "./data";
import "./today.css";

type Panel = {
  kind: "account" | "evidence" | "prepare";
  account: TodayAccount;
};
const FOCUSES: Focus[] = [
  "All priorities",
  "Growth",
  "Deals",
  "Renewal risk",
  "Relationship coverage",
];

function StateMark({ state }: { state: BookState }) {
  return (
    <span className={`today-mark ${state}`} aria-hidden="true">
      {BOOK_STATES[state].mark}
    </span>
  );
}

function cloneAccounts(): TodayAccount[] {
  return ACCOUNTS.map((a) => ({
    ...a,
    sources: [...a.sources],
    focus: [...a.focus],
    deal: a.deal ? { ...a.deal, steps: [...a.deal.steps] as [string, string, string] } : undefined,
  }));
}

export function Today() {
  const [selectedId, setSelectedId] = useState<string | null>("fidelity");
  const [scope, setScope] = useState("My accounts");
  const [period, setPeriod] = useState("This week");
  const [tier, setTier] = useState("All accounts");
  const [focus, setFocus] = useState<Focus>("All priorities");
  const [panel, setPanel] = useState<Panel | null>(null);
  const [prepared, setPrepared] = useState(false);
  const [checked, setChecked] = useState<string[]>([]);
  const [notes, setNotes] = useState("");
  const [askCollapsed, setAskCollapsed] = useState(false);
  const [accounts, setAccounts] = useState<TodayAccount[]>(cloneAccounts);
  const [changes, setChanges] = useState<ChangeItem[]>(() => [...CHANGES]);
  const [signalFlashId, setSignalFlashId] = useState<string | null>(null);
  const [demoUsed, setDemoUsed] = useState(false);

  const visible = accounts.filter(
    (a) =>
      (scope === "Team accounts" || !a.teamOnly) &&
      (tier === "All accounts" || a.strategic) &&
      (focus === "All priorities" || a.focus.includes(focus)),
  );
  const selected = selectedId
    ? (visible.find((a) => a.id === selectedId) ??
      accounts.find((a) => a.id === selectedId) ??
      null)
    : null;
  const fidelity =
    accounts.find((a) => a.id === PRIORITY.accountId) ?? accounts[0];
  const deals = visible.filter(
    (a) => a.deal && (period === "This month" || !a.deal.older),
  );
  const visibleChanges = changes.filter((c) =>
    visible.some((a) => a.id === c.accountId),
  );
  const askData = useMemo(
    () => ({ accounts, people: PEOPLE, changes }),
    [accounts, changes],
  );

  const open = (kind: Panel["kind"], account: TodayAccount) =>
    setPanel({ kind, account });

  const selectAccount = (id: string) => {
    setSelectedId((prev) => (prev === id ? null : id));
  };

  const simulateSignal = () => {
    if (demoUsed) return;
    const { accountPatch, source, ...change } = DEMO_SIGNAL;
    setAccounts((prev) =>
      prev.map((a) =>
        a.id === change.accountId
          ? {
              ...a,
              ...accountPatch,
              focus: accountPatch.focus ?? a.focus,
              sources: [source, ...a.sources],
            }
          : a,
      ),
    );
    setChanges((prev) => [change, ...prev]);
    setSignalFlashId(change.id);
    setDemoUsed(true);
    window.setTimeout(() => setSignalFlashId(null), 1200);
  };

  return (
    <div className="today-page">
      <div className="today-workspace">
        <div className="today-feed">
          <div className="today-content">
            <header className="today-heading">
              <div>
                <p className="today-eyebrow">
                  MONDAY, 7 SEPTEMBER 2026 <span> / </span> JAMES HOWARD
                </p>
                <h1>
                  Today<span>.</span>
                </h1>
                <p>A clear view of your book. A considered next move.</p>
              </div>
              <div className="today-identity">
                <span className="today-avatar">JH</span>
                <div>
                  <strong>James Howard</strong>
                  <small>Strategic Account Director</small>
                </div>
              </div>
            </header>
            <div className="today-briefing">
              <span className="today-live" aria-hidden="true" />
              <p>
                <strong>{DAILY_BRIEFING.lead}</strong> {DAILY_BRIEFING.body}
              </p>
              <span className="today-sample">{DAILY_BRIEFING.stamp}</span>
            </div>
            <div className="today-filters" aria-label="Book and pipeline filters">
              <label>
                <span className="sr-only">Account ownership</span>
                <select
                  aria-label="Account ownership"
                  value={scope}
                  onChange={(e) => setScope(e.target.value)}
                >
                  <option>My accounts</option>
                  <option>Team accounts</option>
                </select>
              </label>
              <label>
                <span className="sr-only">Account tier</span>
                <select
                  aria-label="Account tier"
                  value={tier}
                  onChange={(e) => setTier(e.target.value)}
                >
                  <option>All accounts</option>
                  <option>Strategic accounts</option>
                </select>
              </label>
              <details className="today-focus">
                <summary>Focus: {focus}</summary>
                <div>
                  {FOCUSES.map((f) => (
                    <button
                      key={f}
                      aria-pressed={focus === f}
                      onClick={() => setFocus(f)}
                    >
                      {f}
                    </button>
                  ))}
                </div>
              </details>
              <span className="today-filter-note">
                Book & pipeline view · ask panel stays open beside the feed
              </span>
            </div>

            <div className="today-layout">
              <section className="today-book" aria-labelledby="book-title">
                <SectionHeading
                  number="01"
                  title="Your book"
                  id="book-title"
                  aside={`${visible.length} named accounts`}
                />
                <p className="today-section-intro">
                  {focus === "All priorities"
                    ? "Growth is opening up. Executive access and one renewal need attention."
                    : `Showing ${focus.toLowerCase()} across ${visible.length} accounts. Select a name to focus Ask.`}
                </p>
                <div
                  className="today-book-map"
                  aria-label="Accounts grouped by commercial condition"
                >
                  {(["growth", "attention", "risk", "stable"] as BookState[]).map(
                    (state) => {
                      const bandAccounts = visible.filter((a) => a.state === state);
                      return (
                        <div className={`today-book-band ${state}`} key={state}>
                          <div className="today-band-label">
                            <StateMark state={state} />
                            <span>{BOOK_STATES[state].label}</span>
                          </div>
                          <div className="today-account-names">
                            {bandAccounts.length ? (
                              bandAccounts.map((a) => (
                                <div
                                  key={a.id}
                                  className={`today-account-object ${selected?.id === a.id ? "selected" : ""}`}
                                >
                                  <button
                                    className="today-account-select"
                                    aria-pressed={selected?.id === a.id}
                                    aria-label={`Select ${a.name}: ${a.condition}`}
                                    onClick={() => selectAccount(a.id)}
                                  >
                                    <strong>{a.name}</strong>
                                    <small>{a.condition}</small>
                                  </button>
                                  <button
                                    className="today-account-open"
                                    aria-label={`Open account: ${a.name}`}
                                    onClick={() => open("account", a)}
                                  >
                                    Open account <span aria-hidden="true">↗</span>
                                  </button>
                                </div>
                              ))
                            ) : (
                              <p className="today-muted">
                                No accounts in this view
                              </p>
                            )}
                          </div>
                        </div>
                      );
                    },
                  )}
                </div>
                {selected ? (
                  <div className="today-selected-story" aria-live="polite">
                    <div className="today-selected-title">
                      <span className="today-eyebrow">SELECTED ACCOUNT</span>
                      <strong>{selected.name}</strong>
                      <button type="button" onClick={() => setSelectedId(null)}>
                        Clear
                      </button>
                      <button onClick={() => open("evidence", selected)}>
                        View evidence ({selected.sources.length})
                      </button>
                    </div>
                    <ol className="today-causal-trace">
                      <li>
                        <span>What changed</span>
                        <p>{selected.change}</p>
                      </li>
                      <li>
                        <span>Who matters</span>
                        <p>{selected.relationship}</p>
                      </li>
                      <li>
                        <span>Suggested next step</span>
                        <p>{selected.next}</p>
                      </li>
                    </ol>
                    <p className="today-trace-assessment">
                      <strong>
                        Assessment · {selected.confidence} confidence.
                      </strong>{" "}
                      {selected.relevance}
                    </p>
                  </div>
                ) : (
                  <div className="today-selected-story is-empty" aria-live="polite">
                    <p className="today-muted">
                      No account selected. Ask is scoped to your whole book —
                      or select a name above to focus questions.
                    </p>
                  </div>
                )}
                <details className="today-concentration">
                  <summary>
                    Relationship dependence & revenue concentration
                  </summary>
                  <p>
                    Fidelity’s route to Marcus currently depends on Sarah.
                    Schroders lacks an engaged economic owner. These are
                    coverage dependencies, not revenue weights.
                  </p>
                  <p>
                    Revenue concentration cannot be assessed: account revenue
                    and total book revenue are not included in this scenario.
                  </p>
                  <button onClick={() => open("evidence", fidelity)}>
                    View Fidelity coverage evidence
                  </button>
                  <button
                    onClick={() =>
                      open(
                        "evidence",
                        accounts.find((a) => a.id === "schroders")!,
                      )
                    }
                  >
                    View Schroders coverage evidence
                  </button>
                </details>
              </section>

              <aside className="today-priority" aria-labelledby="priority-title">
                <div className="today-priority-kicker">
                  <span>PRIORITY ACTION</span>
                  <span>{PRIORITY.meetingLabel}</span>
                </div>
                <h2 id="priority-title">
                  Prepare for <br />
                  Fidelity meeting
                </h2>
                <p className="today-meeting-time">
                  {PRIORITY.meetingTime.replace(" BST", "")}{" "}
                  <span>BST</span>
                </p>
                <button
                  className="today-prepare-button"
                  onClick={() => {
                    setSelectedId(PRIORITY.accountId);
                    open("prepare", fidelity);
                  }}
                >
                  <PrepareIcon size={17} />
                  {prepared ? "Review meeting preparation" : "Prepare meeting"}
                  <ArrowRightIcon size={17} />
                </button>
                {prepared && (
                  <p className="today-prepared" role="status">
                    ✓ Preparation completed in this session
                  </p>
                )}
                <div className="today-priority-links">
                  <button
                    onClick={() => {
                      setSelectedId(PRIORITY.accountId);
                      open("account", fidelity);
                    }}
                  >
                    Open Fidelity account ↗
                  </button>
                  <button
                    onClick={() => {
                      setSelectedId(PRIORITY.accountId);
                      open("evidence", fidelity);
                    }}
                  >
                    View evidence ↗
                  </button>
                </div>
                <div className="today-priority-rule" />
                <div className="today-priority-block">
                  <span className="today-proof-label">
                    01 <b>{PRIORITY.fact.label}</b>
                    <small>
                      {PRIORITY.fact.sourceKind} · {PRIORITY.fact.sourceTime}
                    </small>
                  </span>
                  <p>{PRIORITY.fact.detail}</p>
                </div>
                <div className="today-priority-block">
                  <span className="today-proof-label">
                    02 <b>{PRIORITY.assessment.label}</b>
                    <small>{PRIORITY.assessment.confidence} confidence</small>
                  </span>
                  <p>{PRIORITY.assessment.detail}</p>
                  <small>{PRIORITY.assessment.caveat}</small>
                  <p className="today-confidence-reason">
                    <strong>Confidence · {PRIORITY.assessment.confidence}.</strong>{" "}
                    {PRIORITY.assessment.confidenceReason}
                  </p>
                </div>
                <div className="today-people-route">
                  <span className="today-eyebrow">WHO TO INVOLVE</span>
                  {PRIORITY.whoToInvolve.map((row, index) => {
                    const person = personById(row.personId);
                    if (!person) return null;
                    return (
                      <div key={person.id}>
                        {row.introduction && index > 0 && (
                          <div className="today-introduction">
                            {row.introduction}
                          </div>
                        )}
                        <div className="today-person">
                          <span
                            className={`today-person-initial${person.covered ? "" : " gap"}`}
                          >
                            {person.initials}
                          </span>
                          <div>
                            <strong>{person.name}</strong>
                            <small>{person.role}</small>
                            <em
                              className={
                                person.covered ? undefined : "today-coverage-gap"
                              }
                            >
                              {person.covered
                                ? person.note
                                : `△ ${person.note}`}
                            </em>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
                <div className="today-meeting-goal">
                  <span className="today-proof-label">
                    03 <b>Suggested next step</b>
                  </span>
                  <p>{PRIORITY.suggestedNextStep}</p>
                </div>
                <p className="today-priority-foot">
                  {fidelity.sources.length} illustrative sources · latest today,
                  08:12
                  <br />
                  People, meeting and commercial context are illustrative.
                </p>
              </aside>

              <section className="today-pipeline" aria-labelledby="pipeline-title">
                <SectionHeading
                  number="02"
                  title="Pipeline activity"
                  id="pipeline-title"
                  aside={
                    <label>
                      <span className="sr-only">Pipeline activity period</span>
                      <select
                        aria-label="Pipeline activity period"
                        value={period}
                        onChange={(e) => setPeriod(e.target.value)}
                      >
                        <option>This week</option>
                        <option>This month</option>
                      </select>
                    </label>
                  }
                />
                <p className="today-section-intro">
                  Movement matters. So does what stands in the way.
                </p>
                <p className="today-pipeline-legend">
                  ● Reached / agreed <span>○ Not yet reached</span>{" "}
                  <span>┄ Unresolved dependency</span>
                </p>
                {deals.length ? (
                  deals.map((a) => (
                    <article
                      className={`today-deal ${a.state} ${selected?.id === a.id ? "is-selected" : ""}`}
                      key={a.id}
                    >
                      <div className="today-deal-title">
                        <button
                          onClick={() => {
                            setSelectedId(a.id);
                            open("account", a);
                          }}
                          aria-label={`Open account: ${a.name}, ${a.deal!.name}`}
                        >
                          <StateMark state={a.state} />
                          <strong>{a.name}</strong>
                          <span>↗</span>
                        </button>
                        <small>{a.deal!.name}</small>
                      </div>
                      <div className="today-deal-body">
                        <ol
                          className="today-deal-path"
                          aria-label={`${a.name} deal path`}
                        >
                          {a.deal!.steps.map((step, i) => (
                            <li
                              key={step}
                              className={i <= a.deal!.reached ? "reached" : ""}
                            >
                              <span aria-hidden="true" />
                              {step}
                              <span className="sr-only">
                                {i <= a.deal!.reached
                                  ? ", reached or agreed"
                                  : ", not yet reached"}
                              </span>
                            </li>
                          ))}
                        </ol>
                        <div className="today-deal-reason">
                          <span>{a.deal!.movement}</span>
                          {a.deal!.blocker && (
                            <p>
                              <b>↳</b> {a.deal!.blocker}
                            </p>
                          )}
                          <button
                            aria-label={`View evidence: ${a.name} pipeline assessment`}
                            onClick={() => {
                              setSelectedId(a.id);
                              open("evidence", a);
                            }}
                          >
                            View evidence
                          </button>
                        </div>
                      </div>
                    </article>
                  ))
                ) : (
                  <p className="today-empty">
                    No pipeline activity matches these filters. Choose All
                    priorities or This month.
                  </p>
                )}
                <p className="today-data-note">
                  {deals.some((a) => a.id === "invesco")
                    ? "Invesco advanced to an agreed scope workshop."
                    : "No formal deal advancement recorded in this view."}{" "}
                  {deals.some((a) => a.id === "fidelity") &&
                    "Fidelity has an agreed discovery step."}{" "}
                  {period === "This week" &&
                    "Older inactive paths appear under This month."}
                </p>
              </section>

              <section className="today-changes" aria-labelledby="changes-title">
                <SectionHeading
                  number="03"
                  title="What changed"
                  id="changes-title"
                  aside="Material updates · source linked"
                />
                <div className="today-change-sequence">
                  {visibleChanges.length ? (
                    visibleChanges.map((c) => {
                      const a = accounts.find((x) => x.id === c.accountId)!;
                      return (
                        <article
                          key={c.id}
                          className={`today-change ${a.state}${signalFlashId === c.id ? " is-flash" : ""}${c.injected ? " is-injected" : ""}`}
                        >
                          <p className="today-change-time">
                            <StateMark state={a.state} />
                            {c.time}
                            {c.injected && (
                              <span className="today-change-new">New</span>
                            )}
                          </p>
                          <button
                            className="today-change-account"
                            onClick={() => {
                              setSelectedId(a.id);
                              open("account", a);
                            }}
                            aria-label={`Open account: ${a.name}`}
                          >
                            {a.name} ↗
                          </button>
                          <p>{c.summary ?? a.change}</p>
                          <div className="today-change-consequence">
                            <span aria-hidden="true">↳</span>
                            {c.consequence}
                          </div>
                          <button
                            className="today-change-source"
                            onClick={() => {
                              setSelectedId(a.id);
                              open("evidence", a);
                            }}
                            aria-label={`View evidence: ${a.name}, ${a.sources[0].kind}`}
                          >
                            {a.sources[0].kind} <span>View evidence ↗</span>
                          </button>
                        </article>
                      );
                    })
                  ) : (
                    <p className="today-empty">
                      No material updates match these account filters.
                    </p>
                  )}
                </div>
              </section>
            </div>
            <p className="today-bottom-note">
              Illustrative scenario, fixed at 7 September 2026 · Source excerpts
              are examples, not verified client records. Assessments require
              seller validation.
            </p>
          </div>
        </div>

        <AskPanel
          selectedId={selectedId}
          selectedName={selected?.name ?? null}
          data={askData}
          collapsed={askCollapsed}
          onToggleCollapse={() => setAskCollapsed((v) => !v)}
          onClearContext={() => setSelectedId(null)}
        />
      </div>

      <div className="today-demo-bar" aria-label="Demo controls">
        <span>Demo</span>
        <button
          type="button"
          onClick={simulateSignal}
          disabled={demoUsed}
          title="Injects a new Amundi market signal into What changed"
        >
          {demoUsed ? "Signal simulated" : "Simulate new signal"}
        </button>
      </div>

      {panel && (
        <TodayDialog
          panel={panel}
          onClose={() => setPanel(null)}
          onEvidence={() =>
            setPanel({ kind: "evidence", account: panel.account })
          }
          checked={checked}
          setChecked={setChecked}
          notes={notes}
          setNotes={setNotes}
          prepared={prepared}
          onComplete={() => {
            setPrepared(true);
            setPanel(null);
          }}
        />
      )}
    </div>
  );
}

function SectionHeading({
  number,
  title,
  id,
  aside,
}: {
  number: string;
  title: string;
  id: string;
  aside: React.ReactNode;
}) {
  return (
    <div className="today-section-heading">
      <h2 id={id}>
        <span>{number}</span>
        {title}
      </h2>
      <div>{aside}</div>
    </div>
  );
}

function TodayDialog({
  panel,
  onClose,
  onEvidence,
  checked,
  setChecked,
  notes,
  setNotes,
  prepared,
  onComplete,
}: {
  panel: Panel;
  onClose: () => void;
  onEvidence: () => void;
  checked: string[];
  setChecked: (v: string[]) => void;
  notes: string;
  setNotes: (v: string) => void;
  prepared: boolean;
  onComplete: () => void;
}) {
  const ref = useRef<HTMLDialogElement>(null);
  useEffect(() => {
    const dialog = ref.current;
    const trigger = document.activeElement as HTMLElement | null;
    dialog?.showModal();
    return () => {
      dialog?.close();
      trigger?.focus();
    };
  }, []);
  const a = panel.account;
  const checklist = [
    "Review the evidence and its limits",
    "Confirm Sarah’s route to Marcus",
    "Agree a question to test the client need",
  ];
  return (
    <dialog
      ref={ref}
      className="today-dialog"
      aria-labelledby="today-dialog-title"
      onCancel={onClose}
      onKeyDown={(event) => {
        if (event.key !== "Tab") return;
        const controls = Array.from(
          event.currentTarget.querySelectorAll<HTMLElement>(
            'button:not(:disabled), a[href], input:not(:disabled), textarea:not(:disabled), select:not(:disabled), summary, [tabindex="0"]',
          ),
        ).filter((element) => element.getClientRects().length > 0);
        const first = controls[0];
        const last = controls[controls.length - 1];
        if (event.shiftKey && document.activeElement === first) {
          event.preventDefault();
          last?.focus();
        } else if (!event.shiftKey && document.activeElement === last) {
          event.preventDefault();
          first?.focus();
        }
      }}
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div className="today-dialog-inner">
        <div className="today-dialog-top">
          <span className="today-eyebrow">
            {panel.kind === "evidence"
              ? "EVIDENCE"
              : panel.kind === "prepare"
                ? "MEETING PREPARATION"
                : "ACCOUNT STORY"}
          </span>
          <button autoFocus onClick={onClose} aria-label="Close panel">
            Close ×
          </button>
        </div>
        <h2 id="today-dialog-title">{a.name}</h2>
        <p className="today-dialog-disclaimer">
          Illustrative briefing · 7 September 2026. People, sources and
          commercial conditions below are fictional scenario data.
        </p>
        {panel.kind === "evidence" ? (
          <>
            <p>
              <strong>{a.confidence} confidence in the assessment.</strong> This
              reflects the scenario’s evidence coverage, not a statistical
              probability. Client need remains unconfirmed.
            </p>
            <div className="today-evidence-chain">
              <span>Source</span> → <span>Recorded fact</span> →{" "}
              <span>Assessment</span> → <span>Suggested action</span>
            </div>
            {a.sources.map((s) => (
              <article className="today-source" key={s.id}>
                <div>
                  <span>{s.kind}</span>
                  <time>{s.time}</time>
                </div>
                <h3>Illustrative source · {s.id}</h3>
                <blockquote>{s.excerpt}</blockquote>
                <p>
                  <strong>Supports:</strong> {s.supports}
                </p>
                <small>
                  Example excerpt only. Original document unavailable; this is
                  not verified evidence.
                </small>
              </article>
            ))}
            <h3>Assessment</h3>
            <p>{a.relevance}</p>
            <h3>Suggested next step</h3>
            <p>{a.next}</p>
            <p className="today-data-note">
              Freshness is relative to this fixed briefing. In live use, recheck
              source timestamps before acting.
            </p>
          </>
        ) : panel.kind === "account" ? (
          <>
            <span className={`today-state-text ${a.state}`}>
              <StateMark state={a.state} />
              {BOOK_STATES[a.state].label} · {a.condition}
            </span>
            <h3>Fact in this scenario</h3>
            <p>{a.change}</p>
            <h3>Why this matters · assessment</h3>
            <p>{a.relevance}</p>
            <h3>Who matters</h3>
            <p>{a.relationship}</p>
            {a.deal && (
              <>
                <h3>Pipeline activity</h3>
                <p>
                  {a.deal.name} — {a.deal.movement}
                </p>
                <p>{a.deal.blocker}</p>
              </>
            )}
            <h3>Suggested next step</h3>
            <p>{a.next}</p>
            <button className="today-primary" onClick={onEvidence}>
              View evidence · {a.sources.length} sources
            </button>
            {a.recordId && (
              <>
                <Link
                  className="today-record-link"
                  href={`/accounts/${a.recordId}`}
                >
                  Open underlying account record ↗
                </Link>
                <small>
                  The broader prototype record uses a separate illustrative
                  scenario; its commercial state may differ.
                </small>
              </>
            )}
          </>
        ) : (
          <>
            <p className="today-prep-time">
              {PRIORITY.meetingTime} · Sarah Coleman & Marcus Lee
            </p>
            <h3>Suggested meeting goal</h3>
            <p>{PRIORITY.suggestedNextStep}</p>
            <h3>People & route</h3>
            <p>
              Sarah Coleman — Head of Distribution, strong existing
              relationship. Ask Sarah to include Marcus Lee — COO,
              International, limited direct coverage.
            </p>
            <h3>Questions to take into the room</h3>
            <ol className="today-questions">
              {PRIORITY.prepareQuestions.map((q) => (
                <li key={q}>{q}</li>
              ))}
            </ol>
            <details className="today-prep-evidence">
              <summary>
                Review evidence · {a.sources.length} illustrative sources
              </summary>
              {a.sources.map((s) => (
                <div key={s.id}>
                  <strong>
                    {s.kind} · {s.time}
                  </strong>
                  <p>{s.excerpt}</p>
                  <small>{s.supports}</small>
                </div>
              ))}
            </details>
            <fieldset className="today-checklist">
              <legend>Preparation checklist</legend>
              {checklist.map((item) => (
                <label key={item}>
                  <input
                    type="checkbox"
                    checked={checked.includes(item)}
                    onChange={(e) =>
                      setChecked(
                        e.target.checked
                          ? [...checked, item]
                          : checked.filter((c) => c !== item),
                      )
                    }
                  />
                  {item}
                </label>
              ))}
            </fieldset>
            <label className="today-notes">
              Your meeting notes
              <textarea
                rows={4}
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="Capture the question you most need answered…"
              />
            </label>
            <p className="today-data-note">
              Notes and checklist stay in memory for this page session. Nothing
              is sent or saved to CRM.
            </p>
            <button
              className="today-primary"
              disabled={checked.length !== checklist.length}
              onClick={onComplete}
            >
              <CheckIcon size={16} />
              {prepared
                ? "Update completed preparation"
                : "Mark preparation complete"}
            </button>
            {checked.length !== checklist.length && (
              <small>
                Review all three checklist items to complete preparation.
              </small>
            )}
          </>
        )}
      </div>
    </dialog>
  );
}
