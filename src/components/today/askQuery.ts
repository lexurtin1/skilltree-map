import {
  ACCOUNTS,
  CHANGES,
  PEOPLE,
  PRIORITY,
  type ChangeItem,
  type Person,
  type Source,
  type TodayAccount,
} from "./data";

export type AskSourceCite = {
  label: string;
  detail: string;
};

export type AskAnswer = {
  text: string;
  bullets?: string[];
  sources: AskSourceCite[];
  gap?: boolean;
};

export type AskDataSnapshot = {
  accounts: TodayAccount[];
  people: Person[];
  changes: ChangeItem[];
};

const defaultData = (): AskDataSnapshot => ({
  accounts: ACCOUNTS,
  people: PEOPLE,
  changes: CHANGES,
});

function citeSource(s: Source): AskSourceCite {
  return {
    label: `Source: ${s.kind}, ${s.time}`,
    detail: s.excerpt,
  };
}

function norm(q: string): string {
  return q.toLowerCase().replace(/[’']/g, "'").trim();
}

function findAccount(
  query: string,
  accounts: TodayAccount[],
  selectedId: string | null,
): TodayAccount | undefined {
  const q = norm(query);
  const byName = accounts.find((a) => q.includes(a.name.toLowerCase()));
  if (byName) return byName;
  if (selectedId) return accounts.find((a) => a.id === selectedId);
  return undefined;
}

function weakestCoverage(people: Person[], accounts: TodayAccount[]): AskAnswer {
  const gaps = people
    .filter((p) => p.executive && (!p.covered || p.relationshipStrength === "gap" || p.relationshipStrength === "weak"))
    .map((p) => {
      const account = accounts.find((a) => a.id === p.accountId);
      return { person: p, account };
    })
    .filter((row) => row.account);

  if (!gaps.length) {
    return {
      text: "I don’t have enough relationship records in this pilot to rank executive coverage across the book.",
      sources: [],
      gap: true,
    };
  }

  const bullets = gaps.map(({ person, account }) => {
    const strength =
      person.relationshipStrength === "gap"
        ? "no direct coverage"
        : person.relationshipStrength === "weak"
          ? "weak / going quiet"
          : "limited coverage";
    return `${account!.name}: ${person.name} (${person.role}) — ${strength}. ${person.note}`;
  });

  const cites = gaps.flatMap(({ account }) =>
    (account?.sources ?? []).slice(0, 1).map(citeSource),
  );

  return {
    text: "These accounts show the weakest executive coverage in the current briefing:",
    bullets,
    sources: cites.slice(0, 4),
  };
}

function stalledDeals(accounts: TodayAccount[]): AskAnswer {
  const withBlockers = accounts.filter((a) => a.deal?.blocker);
  const overThirty = withBlockers.filter((a) => {
    const blob = `${a.deal?.movement ?? ""} ${a.deal?.blocker ?? ""}`;
    const days = blob.match(/(\d+)\s*days?/i)?.[1];
    return days ? Number(days) >= 18 : false;
  });
  const focused = withBlockers.filter((a) => {
    const blob = `${a.deal?.movement ?? ""} ${a.deal?.blocker ?? ""}`.toLowerCase();
    return (
      blob.includes("day") ||
      blob.includes("risk") ||
      blob.includes("delayed") ||
      blob.includes("no progress") ||
      blob.includes("quiet") ||
      blob.includes("unknown") ||
      blob.includes("unconfirmed")
    );
  });

  const rows = overThirty.length ? overThirty : focused.length ? focused : withBlockers;
  if (!rows.length) {
    return {
      text: "I don’t have stalled-deal records matching that question in this pilot.",
      sources: [],
      gap: true,
    };
  }

  return {
    text: "Named deals with an open blocker in this briefing:",
    bullets: rows.map((a) => {
      const days = `${a.deal!.movement} ${a.deal!.blocker}`.match(
        /(\d+)\s*days?/i,
      )?.[1];
      const dayNote = days ? ` (${days} days noted)` : "";
      return `${a.name} — ${a.deal!.name}: ${a.deal!.blocker}${dayNote}`;
    }),
    sources: rows.flatMap((a) => a.sources.slice(0, 1).map(citeSource)).slice(0, 4),
  };
}

function whatChanged(changes: ChangeItem[], accounts: TodayAccount[]): AskAnswer {
  if (!changes.length) {
    return {
      text: "I don’t have change events for this view in the current briefing.",
      sources: [],
      gap: true,
    };
  }
  return {
    text: "Material updates in this briefing window:",
    bullets: changes.map((c) => {
      const a = accounts.find((x) => x.id === c.accountId);
      const summary = c.summary ?? a?.change ?? "Update recorded";
      return `${c.time} · ${a?.name ?? c.accountId}: ${summary} → ${c.consequence}`;
    }),
    sources: changes
      .map((c) => accounts.find((a) => a.id === c.accountId))
      .filter(Boolean)
      .flatMap((a) => a!.sources.slice(0, 1).map(citeSource))
      .slice(0, 4),
  };
}

function confidenceFor(
  account: TodayAccount | undefined,
): AskAnswer {
  if (!account) {
    return {
      text: "Select an account, or name one, and I can explain confidence from its evidence.",
      sources: [],
      gap: true,
    };
  }

  if (account.id === PRIORITY.accountId) {
    return {
      text: `Confidence is ${PRIORITY.assessment.confidence}. ${PRIORITY.assessment.confidenceReason}`,
      bullets: [
        `Fact: ${PRIORITY.fact.detail}`,
        `Assessment: ${PRIORITY.assessment.detail}`,
        `Suggested next step: ${PRIORITY.suggestedNextStep}`,
      ],
      sources: account.sources.slice(0, 3).map(citeSource),
    };
  }

  return {
    text: `Confidence for ${account.name} is ${account.confidence}. ${account.relevance}`,
    bullets: [
      `Fact: ${account.change}`,
      `Suggested next step: ${account.next}`,
    ],
    sources: account.sources.slice(0, 2).map(citeSource),
  };
}

function whoToTalk(account: TodayAccount, people: Person[]): AskAnswer {
  const related = people.filter((p) => p.accountId === account.id);
  if (!related.length) {
    return {
      text: `I don’t have named contacts for ${account.name} in this pilot beyond the account relationship note.`,
      bullets: [account.relationship],
      sources: account.sources.slice(0, 1).map(citeSource),
      gap: true,
    };
  }
  return {
    text: `People to involve for ${account.name}:`,
    bullets: related.map(
      (p) =>
        `${p.name} — ${p.role}. ${p.covered ? "Covered" : "Coverage gap"}. ${p.note}`,
    ),
    sources: account.sources
      .filter((s) => /crm|meeting|calendar/i.test(s.kind))
      .slice(0, 2)
      .map(citeSource),
  };
}

function whyMatters(account: TodayAccount): AskAnswer {
  return {
    text: account.relevance,
    bullets: [
      `What changed: ${account.change}`,
      `Suggested next step: ${account.next}`,
    ],
    sources: account.sources.slice(0, 2).map(citeSource),
  };
}

function accountSummary(account: TodayAccount): AskAnswer {
  return {
    text: `${account.name} is marked ${account.condition}.`,
    bullets: [
      `What changed: ${account.change}`,
      `Who matters: ${account.relationship}`,
      `Suggested next step: ${account.next}`,
      `Confidence: ${account.confidence}`,
    ],
    sources: account.sources.slice(0, 2).map(citeSource),
  };
}

function deliveryGap(account?: TodayAccount): AskAnswer {
  const name = account?.name ?? "this account";
  if (account?.id === "mg") {
    return {
      text: `For ${name}, the briefing has a delivery update tied to renewal risk — not a full delivery history.`,
      bullets: [
        account.change,
        account.deal?.blocker ?? account.next,
      ],
      sources: account.sources.map(citeSource),
    };
  }
  return {
    text: `I don’t have delivery data for ${name} in this pilot.`,
    sources: [],
    gap: true,
  };
}

/**
 * Keyword / entity matcher over the shared Today scenario.
 * Never fabricates answers outside the supplied snapshot.
 */
export function answerQuery(
  query: string,
  selectedId: string | null,
  data: AskDataSnapshot = defaultData(),
): AskAnswer {
  const q = norm(query);
  if (!q) {
    return {
      text: "Ask a question about your book, an account, coverage, pipeline or what changed.",
      sources: [],
      gap: true,
    };
  }

  const { accounts, people, changes } = data;
  const account = findAccount(q, accounts, selectedId);

  if (
    /deliver(y|ies)|sla|incident|uptime|implement/.test(q) &&
    !/renewal|service theme|m&g|mg/.test(q)
  ) {
    return deliveryGap(account);
  }

  if (
    /confiden|is this real|how sure|evidence strength|how certain/.test(q)
  ) {
    return confidenceFor(account ?? (selectedId ? accounts.find((a) => a.id === selectedId) : undefined));
  }

  if (
    /weakest.*cover|executive cover|coverage gap|who.*(missing|uncovered)|relationship gap/.test(
      q,
    )
  ) {
    return weakestCoverage(people, accounts);
  }

  if (
    /stall|blocker|no progress|over\s*30|30\s*day|pipeline|deal.*(stuck|blocked)/.test(
      q,
    )
  ) {
    return stalledDeals(accounts);
  }

  if (/what changed|this week|material update|what'?s new/.test(q)) {
    return whatChanged(changes, accounts);
  }

  if (/who (else )?(should|to) (i )?talk|who to involve|who matters|contact/.test(q)) {
    if (!account) {
      return {
        text: "Select an account (or name one) and I can list who to involve from the relationship records.",
        sources: [],
        gap: true,
      };
    }
    return whoToTalk(account, people);
  }

  if (/why (does )?this matter|why it matters|assessment/.test(q)) {
    if (!account) {
      return {
        text: "Select an account to explain why the latest change matters.",
        sources: [],
        gap: true,
      };
    }
    return whyMatters(account);
  }

  if (/next step|suggest|what should i|prepare/.test(q)) {
    if (account?.id === PRIORITY.accountId || (!account && selectedId === PRIORITY.accountId)) {
      const a = accounts.find((x) => x.id === PRIORITY.accountId)!;
      return {
        text: PRIORITY.suggestedNextStep,
        bullets: PRIORITY.prepareQuestions,
        sources: a.sources.slice(0, 2).map(citeSource),
      };
    }
    if (account) {
      return {
        text: account.next,
        sources: account.sources.slice(0, 1).map(citeSource),
      };
    }
  }

  if (/priority|meeting|fidelity/.test(q) && (!account || account.id === "fidelity")) {
    const a = accounts.find((x) => x.id === "fidelity")!;
    return {
      text: `${PRIORITY.title}. ${PRIORITY.meetingTime}.`,
      bullets: [
        `Fact: ${PRIORITY.fact.detail}`,
        `Assessment (${PRIORITY.assessment.confidence}): ${PRIORITY.assessment.detail}`,
        `Suggested next step: ${PRIORITY.suggestedNextStep}`,
      ],
      sources: a.sources.slice(0, 3).map(citeSource),
    };
  }

  if (account) {
    return accountSummary(account);
  }

  // Named person lookup
  const person = people.find((p) => q.includes(p.name.toLowerCase()));
  if (person) {
    const a = accounts.find((x) => x.id === person.accountId);
    return {
      text: `${person.name} is ${person.role} at ${a?.name ?? "an account in this book"}.`,
      bullets: [
        person.note,
        `Coverage: ${person.covered ? "covered" : "gap"} · ${person.relationshipStrength}`,
        `Last interaction: ${person.lastInteraction}`,
      ],
      sources: (a?.sources ?? [])
        .filter((s) => s.excerpt.toLowerCase().includes(person.name.split(" ")[0].toLowerCase()))
        .slice(0, 2)
        .map(citeSource),
    };
  }

  return {
    text: "I don’t have grounding for that question in this pilot’s mocked data. Try coverage, stalled deals, what changed, confidence, or a named account.",
    sources: [],
    gap: true,
  };
}

export const BOOK_CHIPS = [
  "Which accounts have the weakest executive coverage?",
  "Show me stalled deals over 30 days",
  "What changed this week?",
] as const;

export const ACCOUNT_CHIPS = [
  "Why does this matter?",
  "Who else should I talk to?",
  "What's the confidence level?",
] as const;
