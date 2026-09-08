"use client";

import { useMemo, useState } from "react";
import { BrandLogo } from "@/components/BrandLogo";
import {
  ACCOUNT_LIST,
  STUDIO_KIND_LABEL,
  STUDIO_TEMPLATES,
  getDossier,
  type StudioTemplate,
} from "@/lib/gi/accounts-demo";
import "./studio.css";

export function StudioPage() {
  const [templateId, setTemplateId] = useState(STUDIO_TEMPLATES[0].id);
  const [accountId, setAccountId] = useState(ACCOUNT_LIST[0].id);
  const [generated, setGenerated] = useState(false);

  const template = STUDIO_TEMPLATES.find((t) => t.id === templateId) ?? STUDIO_TEMPLATES[0];
  const dossier = getDossier(accountId);
  const accountName = dossier?.name ?? ACCOUNT_LIST.find((a) => a.id === accountId)?.name ?? "Account";

  const previewBlocks = useMemo(() => {
    if (!generated || !dossier) return template.slidesOrSections;
    return template.slidesOrSections.map((section, i) => {
      if (i === 0) return `${section} · ${accountName}`;
      if (section.toLowerCase().includes("consequence") || section.toLowerCase().includes("headline")) {
        return `${section} — ${dossier.opsConcerns[0]?.title ?? dossier.relationship.value}`;
      }
      if (section.toLowerCase().includes("peer")) {
        return `${section} — held vs peer: ${dossier.productMix.map((p) => `${p.label} ${p.held}/${p.peer}`).join(", ")}`;
      }
      if (section.toLowerCase().includes("ask") || section.toLowerCase().includes("cta") || section.toLowerCase().includes("plan")) {
        return `${section} — ${dossier.notes.value}`;
      }
      return `${section} · sourced from ${dossier.lastContact.source}`;
    });
  }, [generated, dossier, template, accountName]);

  const byKind = useMemo(() => {
    const map = new Map<string, StudioTemplate[]>();
    for (const t of STUDIO_TEMPLATES) {
      const list = map.get(t.kind) ?? [];
      list.push(t);
      map.set(t.kind, list);
    }
    return map;
  }, []);

  return (
    <div className="studio-page">
      <div className="studio-shell">
        <header className="studio-head">
          <div>
            <h1>Studio</h1>
            <p>
              Create Broadridge-branded sales assets for the funds industry — decks, discovery
              packs, one-pagers and memos.
            </p>
          </div>
          <BrandLogo variant="lockup" height={36} />
        </header>

        <div className="studio-layout">
          <aside className="studio-rail">
            <h2>Asset types</h2>
            {[...byKind.entries()].map(([kind, items]) => (
              <div key={kind} className="studio-kind">
                <p className="studio-kind__label">{STUDIO_KIND_LABEL[kind as keyof typeof STUDIO_KIND_LABEL]}</p>
                <ul>
                  {items.map((t) => (
                    <li key={t.id}>
                      <button
                        type="button"
                        className={templateId === t.id ? "is-active" : undefined}
                        onClick={() => {
                          setTemplateId(t.id);
                          setGenerated(false);
                        }}
                      >
                        {t.title}
                      </button>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </aside>

          <section className="studio-main">
            <div className="studio-config">
              <div>
                <label htmlFor="studio-account">Account context</label>
                <select
                  id="studio-account"
                  value={accountId}
                  onChange={(e) => {
                    setAccountId(e.target.value);
                    setGenerated(false);
                  }}
                >
                  {ACCOUNT_LIST.map((a) => (
                    <option key={a.id} value={a.id}>
                      {a.name}
                    </option>
                  ))}
                </select>
              </div>
              <div className="studio-actions">
                <button
                  type="button"
                  className="studio-btn studio-btn--primary"
                  onClick={() => setGenerated(true)}
                >
                  Generate with Broadridge brand
                </button>
                <button
                  type="button"
                  className="studio-btn"
                  onClick={() => window.print()}
                  disabled={!generated}
                >
                  Export / print
                </button>
              </div>
            </div>

            <article className="studio-preview" data-generated={generated || undefined}>
              <div className="studio-preview__brand">
                <BrandLogo variant="lockup" height={28} />
                <span>Growth Intelligence · Studio</span>
              </div>
              <h2>{template.title}</h2>
              <p className="studio-preview__blurb">{template.blurb}</p>
              <p className="studio-preview__meta">
                For <strong>{accountName}</strong>
                {dossier ? (
                  <>
                    {" "}
                    · health <span className={`studio-health studio-health--${dossier.health}`}>{dossier.health}</span>
                  </>
                ) : null}
              </p>
              <ol className="studio-slides">
                {previewBlocks.map((block) => (
                  <li key={block}>
                    <span className="studio-slide-card">{block}</span>
                  </li>
                ))}
              </ol>
              <footer className="studio-preview__foot">
                <span>{template.brandNote}</span>
                <span>Illustrative · Broadridge branded</span>
              </footer>
            </article>

            {template.kind === "ops-questions" && generated && dossier ? (
              <div className="studio-ops">
                <h3>Starter questions for {accountName}</h3>
                <ul>
                  <li>Who owns {dossier.opsConcerns[0]?.title ?? "the operating model"} today, and where does budget sit?</li>
                  <li>What changed since {dossier.lastContact.when} with {dossier.lastContact.who}?</li>
                  <li>How do you want evidence for {dossier.upcoming[0]?.title ?? "the next deadline"} captured?</li>
                  <li>Which peer outcomes would make a Broadridge path credible here?</li>
                  <li>What would a mutual next step look like in the next 14 days?</li>
                </ul>
              </div>
            ) : null}
          </section>
        </div>
      </div>
    </div>
  );
}
