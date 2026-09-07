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
  const risk = accounts.find((a) => a.kind === "Revenue at risk");
  return {
    text: "Four accounts moved overnight. Start with the live signal, then the renewal exposure.",
    bullets: [
      `${priority.full}: ${priority.overnight}`,
      risk ? `${risk.full}: ${risk.overnight}` : "",
      "Broadridge products in play include Fund Communication Solutions, Cross-border fund distribution, Registration, Document production, Translation, SalesWatch and Regulatory workflow.",
    ].filter(Boolean),
    sources: [
      {
        label: "Illustrative briefing",
        detail: "Account health, revenue and product fit shown here are example data.",
      },
    ],
  };
}

export const ACCOUNT_CHIPS = [...ASK_SUGGESTIONS];

export const BOOK_CHIPS = [
  "What changed overnight?",
  "Where is revenue at risk?",
  "Which Broadridge products are in play?",
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

  if (q.includes("revenue at risk") || q.includes("renewal")) {
    const mg = accountById("mg") ?? accounts.find((a) => a.id === "mg");
    if (!mg) return { text: "No renewal exposure is modelled in this briefing.", sources: [], gap: true };
    return fromPair(mg.answers.default, mg.evidence);
  }

  if (q.includes("broadridge product") || q.includes("which product") || q.includes("services")) {
    const focus = account ?? accounts[0];
    return {
      text: `${focus.full} currently shows these Broadridge services in the illustrative book:`,
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
