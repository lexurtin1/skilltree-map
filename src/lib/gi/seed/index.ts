/**
 * Assembles the seed files into one dataset.
 *
 * This is the only place hero data and composed portfolio data are joined.
 * Everything downstream reads through `select.ts`, so replacing this with an
 * API-backed loader is a change in one file.
 */
import { MARKET_BY_ID } from "../taxonomy";
import type {
  Account,
  EvidenceRecord,
  Fund,
  Hypothesis,
  LegalEntity,
  MarketEvent,
  Opportunity,
  Person,
  RecommendedAction,
  ServiceRelationship,
  Source,
  Task,
  Territory,
} from "../types";
import { HERO_ACCOUNTS, HERO_ENTITIES, HERO_FUNDS } from "./accounts";
import { HYPOTHESES, OPPORTUNITIES, RECOMMENDED_ACTIONS, SERVICE_RELATIONSHIPS } from "./commercial";
import { PEOPLE } from "./people";
import { buildPortfolio } from "./portfolio";
import { EVENTS, EVIDENCE } from "./signals";
import { SOURCES } from "./sources";
import { TASKS } from "./tasks";

const portfolio = buildPortfolio(MARKET_BY_ID);

export const TERRITORIES: Territory[] = [
  { id: "ter-uk-ie", name: "UK and Ireland", marketIds: ["gb", "ie"], leadPersonId: "bp-james-howard" },
  { id: "ter-dach", name: "DACH", marketIds: ["de", "at", "ch"], leadPersonId: "bp-david-lange" },
  { id: "ter-nordics", name: "Nordics", marketIds: ["se", "dk", "no", "fi"], leadPersonId: "bp-tom-eriksen" },
  { id: "ter-southern", name: "Southern Europe", marketIds: ["it", "es", "pt"], leadPersonId: "bp-marta-oliveira" },
  { id: "ter-benelux-fr", name: "France and Benelux", marketIds: ["fr", "be", "nl", "lu"], leadPersonId: "bp-marta-oliveira" },
  { id: "ter-intl", name: "International", marketIds: ["us", "ca", "sg", "hk", "jp", "au", "ae", "za", "cl", "pl"], leadPersonId: "bp-lucy-chen" },
];

export interface GiDataset {
  accounts: Account[];
  entities: LegalEntity[];
  funds: Fund[];
  people: Person[];
  serviceRelationships: ServiceRelationship[];
  events: MarketEvent[];
  evidence: EvidenceRecord[];
  sources: Source[];
  hypotheses: Hypothesis[];
  actions: RecommendedAction[];
  opportunities: Opportunity[];
  tasks: Task[];
  territories: Territory[];
}

export const GI_DATA: GiDataset = {
  accounts: [...HERO_ACCOUNTS, ...portfolio.accounts],
  entities: [...HERO_ENTITIES, ...portfolio.entities],
  funds: [...HERO_FUNDS, ...portfolio.funds],
  people: PEOPLE,
  serviceRelationships: SERVICE_RELATIONSHIPS,
  events: EVENTS,
  evidence: EVIDENCE,
  sources: SOURCES,
  hypotheses: HYPOTHESES,
  actions: RECOMMENDED_ACTIONS,
  opportunities: OPPORTUNITIES,
  tasks: TASKS,
  territories: TERRITORIES,
};
