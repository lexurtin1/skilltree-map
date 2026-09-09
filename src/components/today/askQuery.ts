import {
  ACCOUNTS,
  ASK_SUGGESTIONS,
  accountById,
  type AskPair,
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
};

const defaultData = (): AskDataSnapshot => ({ accounts: ACCOUNTS });

function norm(q: string): string {
  return q.toLowerCase().replace(/[’']/g, "'").trim();
}

function findAccount(
  query: string,
  accounts: TodayAccount[],
  selectedId: string | null,
): TodayAccount | undefined {
  const q = norm(query);
  const byName = accounts.find(
    (a) =>
      q.includes(a.name.toLowerCase()) ||
      q.includes(a.full.toLowerCase()) ||
      q.includes(a.short.toLowerCase()),
  );
  if (byName) return byName;
  if (selectedId) return accounts.find((a) => a.id === selectedId);
  return undefined;
}

function fromPair(pair: AskPair, evidence: string[]): AskAnswer {
  return {
    text: pair.body,
    sources: [
      { label: "Sources", detail: pair.src },
      ...evidence.slice(0, 2).map((e) => ({ label: e, detail: e })),
    ],
  };
}

function pairFor(account: TodayAccount, asked: string | null): AskPair {
  if (asked && account.answers[asked]) return account.answers[asked];
  const key = ASK_SUGGESTIONS.find((s) => s.toLowerCase() === norm(asked ?? ""));
  if (key && account.answers[key]) return account.answers[key];
  return account.answers.default;
}

function bookOverview(accounts: TodayAccount[]): AskAnswer {
  const priority = accounts[0];
  const risk = accounts.find((a) => a.kind === "At risk");
  return {
    text: "Five of 17 cleared the bar. £8.2m short of FY, £800k worse since Friday. Start with Fidelity, then abrdn.",
    bullets: [
      `${priority.full}: ${priority.overnight}`,
      risk ? `${risk.full}: ${risk.overnight}` : "",
      "Products in play: order routing, transfers, automated onboarding, data services, DMI.",
    ].filter(Boolean),
    sources: [
      {
        label: "Salesforce, Jira, NetSuite",
        detail: "Read 08:12. Gap is target £48.0m minus committed £39.8m.",
      },
    ],
  };
}

export const ACCOUNT_CHIPS = [...ASK_SUGGESTIONS];

export const BOOK_CHIPS = [
  "What changed overnight?",
  "Where is revenue at risk?",
  "Which products are in play?",
];

export function answerQuery(
  question: string,
  selectedId: string | null,
  data: AskDataSnapshot = defaultData(),
): AskAnswer {
  const q = norm(question);
  const { accounts } = data;
  const account = findAccount(question, accounts, selectedId);

  if (
    q.includes("what changed") ||
    q.includes("overnight") ||
    q.includes("since yesterday")
  ) {
    if (account) {
      return {
        text: account.overnight,
        bullets: account.chain.map((c) => `${c.k}: ${c.t}`),
        sources: account.evidence.map((e) => ({ label: e, detail: e })),
      };
    }
    return bookOverview(accounts);
  }

  if (q.includes("revenue at risk") || q.includes("renewal") || q.includes("abrdn")) {
    const risk = accountById("abrdn") ?? accounts.find((a) => a.kind === "At risk");
    if (!risk) return { text: "Nothing crossed the at-risk bar this week.", sources: [], gap: true };
    return fromPair(risk.answers.default, risk.evidence);
  }

  if (q.includes("broadridge product") || q.includes("which product") || q.includes("calastone product") || q.includes("services")) {
    const focus = account ?? accounts[0];
    return {
      text: `${focus.full} currently shows these Calastone products:`,
      bullets: focus.services,
      sources: focus.evidence.map((e) => ({ label: e, detail: e })),
    };
  }

  if (account) {
    return fromPair(pairFor(account, question), account.evidence);
  }

  if (!selectedId) return bookOverview(accounts);

  return {
    text: "I can answer from the illustrative briefing for the selected account. Try one of the suggested questions, or name an account.",
    sources: [],
    gap: true,
  };
}
