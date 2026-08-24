import { D, E, defineDomain, g, n, s } from "../build";

/**
 * Customers — value, relationships, retention.
 *
 * Demo data for a seed-stage company selling operating intelligence into
 * financial services. Figures are illustrative and deliberately generic.
 * See `source.ts` for how to swap this for live data.
 */
export const customers = defineDomain(
  "customers",
  D(
    "£1.94m recurring revenue across 34 accounts",
    "Why it matters: the top five accounts carry 62% of the book at a stage where losing one changes the funding conversation. Two of them are showing retention signals that need a founder, not an account manager.",
    {
      movement: "Net revenue retention 104%, down from 118% two quarters ago",
      recommendedAction:
        "Re-sponsor Northstar Financial and take personal ownership of the Bramwell recovery review.",
      metrics: [
        { label: "Recurring revenue", value: "£1.94m", delta: "+31% YoY", tone: "healthy" },
        { label: "Revenue at risk", value: "£310k", delta: "+£150k QoQ", tone: "critical" },
        { label: "Net retention", value: "104%", delta: "−14pts", tone: "watch" },
        { label: "Open expansion", value: "£560k", tone: "opportunity" },
      ],
    },
  ),
  [
    g("cus-accounts", "Strategic Accounts", "who carries the book", [
      n(
        "cus-northstar",
        "Northstar Financial",
        "Largest customer · £420k ARR",
        "entity",
        "watch",
        5,
        D(
          "£420k ARR · 22% of the book",
          "Why it matters: our anchor reference and the account every investor asks about. Commercially healthy, relationally thin — the sponsor seat has been vacant since their COO left in June.",
          {
            movement: "Revenue flat QoQ, support volume +40%, last senior contact 84 days ago",
            recommendedAction:
              "Open a founder-to-CEO line before the November pricing review, not after it.",
            owner: "CEO",
            dueDate: "12 Sept 2026",
            metrics: [
              { label: "ARR", value: "£420k", delta: "flat QoQ", tone: "watch" },
              { label: "Delivery margin", value: "31%", delta: "−7pts", tone: "risk" },
              { label: "Adoption", value: "88%", tone: "healthy" },
            ],
            evidence: [
              E("CRM", "Account record and contact history", "Updated 2 days ago"),
              E("Billing", "Invoice and consumption ledger", "Updated 4 hours ago"),
              E("Support", "Ticket volume trend", "Updated 2 hours ago"),
            ],
          },
        ),
        {
          hot: true,
          constellationTitle: "Account constellation",
          linkedNodeIds: ["del-atlas", "prd-signal-core", "cap-rev-largest"],
          children: [
            s(
              "sponsors",
              "sponsors",
              n(
                "cus-northstar-stakeholders",
                "Stakeholders",
                "7 mapped · 1 economic buyer · sponsor seat vacant",
                "entity",
                "risk",
                4,
                D(
                  "No active executive sponsor",
                  "Why it matters: the day-to-day relationship is strong at operations level. Above that the map is empty — the COO who sponsored the original programme left in June and has not been replaced in the account plan.",
                  { recommendedAction: "Map and engage the incoming COO within 30 days." },
                ),
              ),
            ),
            s(
              "governed by",
              "requires",
              n(
                "cus-northstar-contract",
                "Contract",
                "Master agreement · 3-year term · uplift clause",
                "entity",
                "neutral",
                4,
                D(
                  "Renews 31 March 2027, six-month notice",
                  "Why it matters: the indexed uplift falls due in November, and two non-standard service credits added at the last renewal have never been re-priced.",
                ),
                { linkedNodeIds: ["cap-risk-renewal"] },
              ),
            ),
            s(
              "generates",
              "generates",
              n(
                "cus-northstar-revenue",
                "Revenue & billing",
                "£420k recurring · £68k services",
                "entity",
                "healthy",
                5,
                D(
                  "Billing current, no ageing debt",
                  "Why it matters: this single account funds roughly three months of payroll. Services revenue is above plan but at a margin below the portfolio average.",
                  { movement: "Delivery margin 31% against a 38% portfolio average" },
                ),
                { linkedNodeIds: ["cap-rev-largest"] },
              ),
            ),
            s(
              "uses",
              "uses",
              n(
                "cus-northstar-modules",
                "Product modules",
                "Signal Core · Connect API · Assurance Vault",
                "entity",
                "watch",
                4,
                D(
                  "Three of five modules licensed",
                  "Why it matters: Insight Analytics was scoped at the last renewal and never activated, and Assurance Vault usage sits in a single business unit.",
                ),
                { linkedNodeIds: ["prd-signal-core", "prd-insight"] },
              ),
            ),
            s(
              "belongs to",
              "contributes_to",
              n(
                "cus-northstar-usage",
                "Usage & adoption",
                "88% of licensed seats active",
                "insight",
                "healthy",
                4,
                D(
                  "Adoption is not the problem here",
                  "Why it matters: daily usage is stable and above the portfolio median. The exposure at this account is relational and commercial, not behavioural.",
                ),
              ),
            ),
            s(
              "requires",
              "requires",
              n(
                "cus-northstar-delivery",
                "Delivery & open issues",
                "Project Atlas · 2 open escalations",
                "entity",
                "risk",
                4,
                D(
                  "Project Atlas is the single biggest relationship variable",
                  "Why it matters: it is the largest active implementation in the business. Two escalations are open and both trace to the same integration dependency.",
                ),
                { linkedNodeIds: ["del-atlas"] },
              ),
            ),
            s(
              "governed by",
              "depends_on",
              n(
                "cus-northstar-renewal",
                "Renewal",
                "31 March 2027 · notice 30 Sept 2026",
                "event",
                "watch",
                5,
                D(
                  "Notice window opens in seven months",
                  "Why it matters: a quiet renewal depends on Project Atlas landing and a sponsor being in place. Neither is currently true.",
                ),
                { linkedNodeIds: ["org-dec-customer"] },
              ),
            ),
            s(
              "puts at risk",
              "puts_at_risk",
              n(
                "cus-northstar-risk",
                "Risks",
                "Sponsor vacancy · margin erosion",
                "risk",
                "risk",
                4,
                D(
                  "£420k exposed to a relationship rather than a contract",
                  "Why it matters: nothing in the commercial position is failing. The risk is that nobody senior owns the relationship when a difficult pricing conversation lands.",
                ),
                { linkedNodeIds: ["cus-risk-sponsor"] },
              ),
            ),
            s(
              "expands into",
              "enables",
              n(
                "cus-northstar-expansion",
                "Expansion opportunities",
                "Insight Analytics · third business unit",
                "opportunity",
                "opportunity",
                3,
                D(
                  "£110k identified, none in pipeline",
                  "Why it matters: the analytics module was scoped and dropped, and the third business unit runs on a competitor platform whose contract ends next year.",
                ),
                { linkedNodeIds: ["cus-exp-crosssell"] },
              ),
            ),
            s(
              "requires",
              "requires",
              n(
                "cus-northstar-meetings",
                "Upcoming meetings",
                "Executive business review · 12 Sept",
                "event",
                "watch",
                3,
                D(
                  "One executive touchpoint in the next 90 days",
                  "Why it matters: the September business review is the only scheduled senior contact before the pricing review.",
                ),
                { linkedNodeIds: ["cus-ev-qbr"] },
              ),
            ),
          ],
        },
      ),
      n(
        "cus-calder",
        "Calder Wealth",
        "Highest-growth customer · £180k ARR",
        "entity",
        "opportunity",
        4,
        D(
          "£180k ARR · +64% year on year",
          "Why it matters: the fastest-growing account in the book and the cleanest reference story we have. Consumption is running well ahead of the contracted plan.",
          {
            movement: "Consumption at 128% of contracted volume, five months running",
            recommendedAction:
              "Convert overage into a committed uplift before the US rollout starts.",
            owner: "Head of Customer",
            metrics: [
              { label: "ARR", value: "£180k", delta: "+64% YoY", tone: "opportunity" },
              { label: "Consumption", value: "128%", delta: "of plan", tone: "opportunity" },
              { label: "Adoption", value: "94%", tone: "healthy" },
            ],
            evidence: [E("Usage", "Consumption against contracted volume", "Updated 2 hours ago")],
          },
        ),
        {
          hot: true,
          constellationTitle: "Account constellation",
          linkedNodeIds: ["gro-calder-tier2", "prd-insight", "mkt-seg-wealth"],
          children: [
            s("sponsors", "sponsors", n("cus-calder-stakeholders", "Stakeholders", "CEO sponsor · engaged buying committee", "entity", "healthy", 4, D("Strongest sponsor relationship in the book", "Why it matters: their CEO has presented the programme externally twice this year and introduced two peers unprompted."))),
            s("governed by", "requires", n("cus-calder-contract", "Contract", "Volume-tiered · renews Jan 2027", "entity", "watch", 3, D("Tiering has not kept up with usage", "Why it matters: overage is billed monthly rather than committed annually, which understates the account and leaves the price open every month."), { linkedNodeIds: ["prd-opp-packaging"] })),
            s("generates", "generates", n("cus-calder-revenue", "Revenue & billing", "£180k recurring · £34k overage", "entity", "opportunity", 4, D("Overage is now material", "Why it matters: monthly overage has run above plan for five consecutive months and is approaching the value of a full additional tier."), { linkedNodeIds: ["cap-rev-fastest"] })),
            s("uses", "uses", n("cus-calder-modules", "Product modules", "Signal Core · Flow Studio", "entity", "healthy", 3, D("Two modules, both fully adopted", "Why it matters: Insight Analytics is the natural third and the sponsor has already asked for it."), { linkedNodeIds: ["prd-insight"] })),
            s("belongs to", "contributes_to", n("cus-calder-usage", "Usage & adoption", "94% of licensed seats active", "insight", "healthy", 3, D("Highest adoption in the book", "Why it matters: this is the behavioural profile we should be selecting for in targeting."), { linkedNodeIds: ["mkt-tgt-similar"] })),
            s("expands into", "enables", n("cus-calder-expansion", "Expansion opportunities", "Tier 2 uplift · US entity", "opportunity", "opportunity", 4, D("£210k across two plays", "Why it matters: both are sponsor-supported and neither is contested by a competitor."), { linkedNodeIds: ["gro-calder-tier2", "cus-exp-geo"] })),
            s("requires", "requires", n("cus-calder-meetings", "Upcoming meetings", "US scoping session · 26 Sept", "event", "neutral", 2, D("Scoping session already booked", "Why it matters: the commercial framing for the uplift should land in the same meeting rather than a separate one."))),
          ],
        },
      ),
      n(
        "cus-bramwell",
        "Bramwell Trustees",
        "Most at-risk customer · £150k ARR",
        "entity",
        "critical",
        5,
        D(
          "£150k ARR · actively evaluating alternatives",
          "Why it matters: adoption never reached contracted scope, a reconciliation defect has recurred three times, and a competitor has been on site twice this quarter.",
          {
            movement: "Usage −11% month on month · third repeat incident logged 9 days ago",
            recommendedAction:
              "Executive recovery plan with named owners at the 2 September steering committee. This does not belong with account management.",
            owner: "CEO",
            dueDate: "2 Sept 2026",
            metrics: [
              { label: "ARR at risk", value: "£150k", tone: "critical" },
              { label: "Seat adoption", value: "46%", delta: "−11% MoM", tone: "critical" },
              { label: "Repeat incidents", value: "3", delta: "in 90 days", tone: "critical" },
            ],
            evidence: [
              E("Support", "Incident history and repeat classification", "Updated 9 days ago"),
              E("Usage", "Seat activation trend", "Updated 2 hours ago"),
              E("Field note", "Competitor presence reported by delivery lead", "Evidence incomplete · 3 weeks old"),
            ],
          },
        ),
        {
          hot: true,
          constellationTitle: "Account constellation",
          linkedNodeIds: ["del-bramwell-recovery", "mkt-comp-strategic", "prd-signal-core"],
          children: [
            s("sponsors", "sponsors", n("cus-bramwell-stakeholders", "Stakeholders", "Original sponsor departed · new COO unmapped", "entity", "critical", 4, D("The people who bought this have gone", "Why it matters: neither executive who signed the original agreement is still in post, and the incoming COO has met a competitor before meeting us."))),
            s("governed by", "requires", n("cus-bramwell-contract", "Contract", "Renews 30 June 2027 · 90-day notice", "entity", "risk", 4, D("Break clause tied to service levels", "Why it matters: two of the three repeat incidents fall inside the clause definition, and a third qualifying event opens an exit route."), { linkedNodeIds: ["cap-risk-renewal"] })),
            s("generates", "generates", n("cus-bramwell-revenue", "Revenue & billing", "£150k recurring · service credits issued", "entity", "risk", 4, D("Credits are now recurring", "Why it matters: service credits have been issued in each of the last two quarters, which normalises them as an expectation."), { linkedNodeIds: ["cap-rev-atrisk"] })),
            s("uses", "uses", n("cus-bramwell-modules", "Product modules", "Signal Core only", "entity", "risk", 3, D("Single-module dependency", "Why it matters: one module, one workflow, one point of failure in the whole relationship."), { linkedNodeIds: ["prd-signal-core"] })),
            s("belongs to", "contributes_to", n("cus-bramwell-usage", "Usage & adoption", "46% of licensed seats", "insight", "critical", 5, D("Adoption never reached contracted scope", "Why it matters: seat activation peaked at 61% during implementation and has fallen every month since. Under-adoption is our strongest churn predictor."), { linkedNodeIds: ["prd-adopt-declining"] })),
            s("requires", "requires", n("cus-bramwell-delivery", "Delivery & open issues", "Reconciliation defect · 3 repeats", "risk", "critical", 5, D("Same defect, third occurrence", "Why it matters: root cause was closed twice without a permanent fix. The pattern is more damaging than the outage."), { linkedNodeIds: ["del-bramwell-recovery", "del-ops-repeat"] })),
            s("governed by", "depends_on", n("cus-bramwell-renewal", "Renewal", "30 June 2027 · notice 1 April 2027", "event", "critical", 5, D("The decision will be made long before the date", "Why it matters: competitive evaluations at accounts of this size typically conclude two quarters before the notice window."))),
            s("puts at risk", "puts_at_risk", n("cus-bramwell-risk", "Risks", "Competitor evaluation in progress", "risk", "critical", 5, D("A live replacement evaluation", "Why it matters: the competitor has been on site twice and has already met the new COO."), { linkedNodeIds: ["mkt-comp-strategic"] })),
            s("expands into", "enables", n("cus-bramwell-expansion", "Expansion opportunities", "None until the relationship is stable", "opportunity", "neutral", 1, D("Deliberately paused", "Why it matters: no expansion motion should run at this account this quarter."))),
            s("requires", "requires", n("cus-bramwell-meetings", "Upcoming meetings", "Recovery steering committee · 2 Sept", "event", "critical", 5, D("The meeting that decides the account", "Why it matters: first executive-level contact since the third incident."), { linkedNodeIds: ["cus-ev-steerco"] })),
          ],
        },
      ),
      n(
        "cus-apex",
        "Apex Fund Services",
        "Highest expansion potential · £210k ARR",
        "entity",
        "opportunity",
        4,
        D(
          "£210k ARR · £340k identified expansion",
          "Why it matters: one business unit live, three more addressable, and the sponsor also sits on the board of two other target firms. The relationship is real but single-threaded.",
          {
            movement: "Renewal notice window opens in 62 days",
            recommendedAction: "Widen the relationship before the renewal conversation opens, not during it.",
            owner: "Head of Customer",
          },
        ),
        {
          constellationTitle: "Account constellation",
          linkedNodeIds: ["mkt-eco-pe", "gro-apex-privatecredit", "cus-exp-bu"],
          children: [
            s("sponsors", "sponsors", n("cus-apex-stakeholders", "Stakeholders", "One contact · no executive relationship", "entity", "risk", 4, D("Single-threaded", "Why it matters: everything at this account runs through one operations director who has been in post for two years."), { linkedNodeIds: ["cus-risk-single"] })),
            s("governed by", "requires", n("cus-apex-contract", "Contract", "Renews 31 Dec 2026 · notice 30 Oct", "entity", "watch", 4, D("Notice date falls inside the quarter", "Why it matters: sixty-two days until the window opens and we have one scheduled contact before it."))),
            s("generates", "generates", n("cus-apex-revenue", "Revenue & billing", "£210k recurring · one business unit", "entity", "healthy", 3, D("Clean commercial position", "Why it matters: no credits, no ageing debt, no disputes — the growth constraint here is access, not satisfaction."))),
            s("belongs to", "contributes_to", n("cus-apex-usage", "Usage & adoption", "Deep in one unit, absent elsewhere", "insight", "watch", 3, D("Concentrated adoption", "Why it matters: high usage in the live unit is the proof point for the other three."))),
            s("expands into", "enables", n("cus-apex-expansion", "Expansion opportunities", "Private credit desk · two further units", "opportunity", "opportunity", 4, D("£340k addressable inside the existing relationship", "Why it matters: three business units run on spreadsheets and a legacy tool that loses support next year."), { linkedNodeIds: ["gro-apex-privatecredit"] })),
            s("belongs to", "introduces", n("cus-apex-portfolio", "Portfolio access", "Sponsor holds 40+ portfolio companies", "opportunity", "opportunity", 4, D("The account is also a route to market", "Why it matters: their portfolio contains at least six companies matching our best-fit profile, and we have asked for none of them."), { linkedNodeIds: ["mkt-eco-pe", "gro-route-pe"] })),
            s("requires", "requires", n("cus-apex-meetings", "Upcoming meetings", "Renewal framing call · 18 Sept", "event", "watch", 3, D("One call before the notice window", "Why it matters: the only scheduled contact before 30 October."))),
          ],
        },
      ),
      n(
        "cus-kestrel",
        "Kestrel Life",
        "Newly onboarded customer · £96k ARR",
        "entity",
        "watch",
        3,
        D(
          "£96k ARR · 90 days live",
          "Why it matters: the first 90 days set the retention curve. Migration is three weeks behind and their new CTO has not yet been briefed.",
          {
            movement: "UAT sign-off moved from 29 Aug to 19 Sept",
            recommendedAction: "Brief the incoming CTO before UAT, not at go-live.",
            owner: "Delivery Lead",
          },
        ),
        {
          constellationTitle: "Account constellation",
          linkedNodeIds: ["del-kestrel-onboarding", "org-talent-key"],
          children: [
            s("sponsors", "sponsors", n("cus-kestrel-stakeholders", "Stakeholders", "New CTO appointed, unbriefed", "entity", "watch", 3, D("A fresh decision-maker", "Why it matters: appointed six weeks ago with a stated platform agenda and no contact from us yet."), { linkedNodeIds: ["cus-mv-dm"] })),
            s("governed by", "requires", n("cus-kestrel-contract", "Contract", "3-year term · renews 2029", "entity", "healthy", 3, D("Long runway", "Why it matters: no commercial pressure for two years, which is exactly why delivery matters now."))),
            s("generates", "generates", n("cus-kestrel-revenue", "Revenue & billing", "£96k recurring · billing on go-live", "entity", "watch", 3, D("Revenue is gated by delivery", "Why it matters: £24k of first-year billing does not start until sign-off."), { linkedNodeIds: ["cap-rev-golive"] })),
            s("requires", "requires", n("cus-kestrel-delivery", "Delivery & open issues", "Onboarding programme · 3 weeks late", "entity", "risk", 4, D("Slipping in the window that matters most", "Why it matters: data migration is on the critical path and has no float left."), { linkedNodeIds: ["del-kestrel-onboarding"] })),
            s("expands into", "enables", n("cus-kestrel-expansion", "Expansion opportunities", "Parent group insurer", "opportunity", "opportunity", 3, D("The parent is the real prize", "Why it matters: Kestrel is one of four entities under the same group holding company."), { linkedNodeIds: ["cus-exp-parent"] })),
            s("requires", "requires", n("cus-kestrel-meetings", "Upcoming meetings", "UAT sign-off · 19 Sept", "event", "watch", 3, D("Sign-off gate", "Why it matters: go-live cannot move without it and it has already moved once."))),
          ],
        },
      ),
      n(
        "cus-vantage",
        "Vantage Registry",
        "Dormant · reactivation candidate · £28k ARR",
        "entity",
        "neutral",
        2,
        D(
          "£28k ARR · minimal engagement for three quarters",
          "Why it matters: the contract renews automatically and usage is stable but low. No contact, no complaints, no growth — and no one has looked at it.",
          { recommendedAction: "One reactivation attempt this quarter, then reclassify the account." },
        ),
        {
          constellationTitle: "Account constellation",
          children: [
            s("sponsors", "sponsors", n("cus-vantage-stakeholders", "Stakeholders", "No named sponsor", "entity", "watch", 2, D("Relationship has gone quiet", "Why it matters: last executive contact was eleven months ago."))),
            s("generates", "generates", n("cus-vantage-revenue", "Revenue & billing", "£28k recurring · auto-renewing", "entity", "neutral", 2, D("Small and stable", "Why it matters: neither growing nor at risk, which is why nobody looks at it."))),
            s("belongs to", "contributes_to", n("cus-vantage-usage", "Usage & adoption", "Low but steady", "insight", "neutral", 2, D("Habitual usage only", "Why it matters: one workflow, one team, unchanged for two years."), { linkedNodeIds: ["prd-adopt-cohort"] })),
            s("expands into", "enables", n("cus-vantage-expansion", "Expansion opportunities", "Unqualified", "opportunity", "neutral", 1, D("Nothing qualified", "Why it matters: no discovery has been done in three quarters."))),
            s("requires", "requires", n("cus-vantage-meetings", "Upcoming meetings", "No activity scheduled", "event", "neutral", 1, D("No contact planned", "Why it matters: this is the definition of the dormant state."))),
          ],
        },
      ),
    ]),

    g("cus-movement", "Account Movement", "what changed this quarter", [
      n("cus-mv-usage", "Usage declining", "Bramwell Trustees · −11% month on month", "insight", "risk", 5, D("Three consecutive months of decline", "Why it matters: seat activation has fallen every month since the second repeat incident. This is the leading indicator for the renewal, not a support metric.", { recommendedAction: "Treat as a retention signal and escalate with the recovery programme.", evidence: [E("Usage", "Seat activation trend", "Updated 2 hours ago")] }), { linkedNodeIds: ["cus-bramwell", "cus-risk-adoption"] }),
      n("cus-mv-revenue", "Revenue increased materially", "Calder Wealth · +64% ARR year on year", "insight", "opportunity", 4, D("Growth is outrunning the contract", "Why it matters: consumption-driven growth is being billed as overage rather than committed as an uplift, so it is neither predictable nor defensible at renewal."), { linkedNodeIds: ["cus-calder", "gro-calder-tier2", "cap-rev-fastest"] }),
      n("cus-mv-sponsor", "Executive sponsor inactive", "Northstar Financial · 84 days since senior contact", "insight", "watch", 4, D("The largest account has gone quiet at the top", "Why it matters: operational contact is unchanged; executive contact has stopped entirely, and a pricing review is due in November."), { linkedNodeIds: ["cus-northstar", "cus-risk-sponsor"] }),
      n("cus-mv-competitor", "Competitor detected", "Bramwell · rival on site twice this quarter", "insight", "risk", 4, D("Competitive presence confirmed", "Why it matters: it was reported by the delivery lead rather than the account team, which is its own signal."), { linkedNodeIds: ["cus-bramwell", "mkt-comp-strategic"] }),
      n("cus-mv-renewal", "Renewal window opened", "Apex Fund Services · notice date in 62 days", "insight", "watch", 3, D("Notice window now open", "Why it matters: expansion should be framed before the renewal, not alongside it."), { linkedNodeIds: ["cus-apex"] }),
      n("cus-mv-dm", "New decision-maker identified", "Kestrel Life appointed a CTO", "insight", "opportunity", 3, D("A new buyer inside a live account", "Why it matters: appointed six weeks ago with a stated platform consolidation agenda."), { linkedNodeIds: ["cus-kestrel"] }),
      n("cus-mv-support", "Support volume increasing", "Northstar Financial · tickets +40% quarter on quarter", "insight", "watch", 3, D("Volume without escalation", "Why it matters: no breach yet, but the trend is a quarter old and accelerating on our largest account."), { linkedNodeIds: ["cus-northstar", "prd-adopt-support"] }),
      n("cus-mv-consumption", "Consumption ahead of plan", "Calder Wealth · 128% of contracted volume", "insight", "opportunity", 3, D("Five months above plan", "Why it matters: this is a pricing conversation that has not yet been had."), { linkedNodeIds: ["cus-calder", "prd-opp-packaging"] }),
    ]),

    g("cus-events", "Upcoming Customer Events", "the next 90 days", [
      n("cus-ev-steerco", "Steering committee", "Bramwell recovery · 2 Sept", "event", "critical", 5, D("First executive contact since the third incident", "Why it matters: the recovery plan either lands here or the account moves to a competitive process.", { owner: "CEO", dueDate: "2 Sept 2026" }), { linkedNodeIds: ["cus-bramwell", "del-bramwell-recovery"] }),
      n("cus-ev-qbr", "Executive business review", "Northstar Financial · 12 Sept", "event", "watch", 4, D("The only senior touchpoint before pricing", "Why it matters: use it to re-establish the sponsor relationship, not to present a status deck.", { dueDate: "12 Sept 2026" }), { linkedNodeIds: ["cus-northstar", "cus-risk-sponsor"] }),
      n("cus-ev-milestone", "Implementation milestone", "Kestrel Life UAT sign-off · 19 Sept", "event", "watch", 3, D("Gate for go-live", "Why it matters: already moved once from 29 August, and £24k of billing sits behind it."), { linkedNodeIds: ["cus-kestrel", "del-kestrel-onboarding"] }),
      n("cus-ev-launch", "Product launch", "Insight Analytics 3.0 · 24 Sept", "event", "opportunity", 2, D("Cross-sell trigger", "Why it matters: three accounts have the module scoped and unactivated."), { linkedNodeIds: ["prd-insight", "cus-exp-crosssell"] }),
      n("cus-ev-renewal", "Renewal notice date", "Apex Fund Services · 30 Oct", "event", "watch", 4, D("Hard commercial date", "Why it matters: auto-renews if neither side serves notice, so the expansion conversation has to happen first."), { linkedNodeIds: ["cus-apex", "org-dec-customer"] }),
      n("cus-ev-industry", "Industry event with customer stakeholders", "Asset Operations Summit · 8 Oct", "event", "neutral", 2, D("Nine customer stakeholders attending", "Why it matters: including two Northstar executives and the incoming Bramwell COO."), { linkedNodeIds: ["mkt-sig-event", "gro-ev-industry"] }),
      n("cus-ev-pricing", "Contract & pricing review", "Northstar Financial uplift clause · November", "event", "watch", 3, D("Indexed uplift falls due", "Why it matters: a difficult conversation to have without a sponsor in place."), { linkedNodeIds: ["cus-northstar", "cap-alloc-lowreturn"] }),
    ]),

    g("cus-risks", "Customer Risks", "where retention is exposed", [
      n("cus-risk-sponsor", "No senior sponsor", "Northstar Financial · £420k exposed to one relationship", "risk", "risk", 5, D("Our largest account has no executive owner on either side", "Why it matters: nothing is failing commercially. The exposure is that a pricing review and a delivery re-baseline land in the same quarter with nobody senior to absorb either.", { recommendedAction: "Assign an executive sponsor this week and brief them before 12 September.", owner: "CEO", dueDate: "12 Sept 2026", evidence: [E("CRM", "Contact activity by seniority", "Updated 2 days ago")] }), { hot: true, linkedNodeIds: ["cus-northstar", "org-own-accountability"] }),
      n("cus-risk-adoption", "Adoption below contracted scope", "Bramwell · 46% of licensed seats", "risk", "critical", 5, D("Half the contract is unused", "Why it matters: under-adoption is the strongest predictor of non-renewal anywhere in the book."), { linkedNodeIds: ["cus-bramwell", "prd-adopt-declining"] }),
      n("cus-risk-competitor", "Active competitor evaluation", "Bramwell · replacement programme forming", "risk", "critical", 5, D("A live evaluation, not a threat", "Why it matters: the competitor has met the new COO and been on site twice."), { linkedNodeIds: ["cus-bramwell", "mkt-comp-strategic"] }),
      n("cus-risk-support", "Critical support issue", "Bramwell · reconciliation defect, 3 repeats", "risk", "critical", 4, D("Closed twice without a permanent fix", "Why it matters: the third occurrence triggers the contractual service-level clause."), { linkedNodeIds: ["cus-bramwell", "del-ops-repeat"] }),
      n("cus-risk-single", "Single-threaded relationship", "Apex Fund Services · one contact, no sponsor", "risk", "risk", 4, D("One person holds the whole account", "Why it matters: £210k of revenue and a £340k expansion depend on a single operations director."), { linkedNodeIds: ["cus-apex"] }),
      n("cus-risk-slip", "Delivery slip", "Kestrel Life · three weeks behind", "risk", "risk", 4, D("Slipping in the first 90 days", "Why it matters: this is the window where retention behaviour is set for the life of the account."), { linkedNodeIds: ["cus-kestrel", "del-kestrel-onboarding"] }),
      n("cus-risk-margin", "Margin deterioration", "Northstar Financial · delivery margin −7 points", "risk", "risk", 4, D("Growth in low-margin services", "Why it matters: services revenue is up; the margin on it is down seven points, and it is our largest account."), { linkedNodeIds: ["cus-northstar", "cap-fc-margin"] }),
    ]),

    g("cus-expansion", "Expansion Plays", "growth without a new logo", [
      n("cus-exp-crosssell", "Cross-sell module", "Insight Analytics into Calder Wealth", "opportunity", "opportunity", 4, D("Expansion route identified · £95k, uncontested", "Why it matters: the module is scoped, the sponsor has asked for it, and no competitor is in the conversation.", { recommendedAction: "Attach it to the US scoping session on 26 September.", owner: "Head of Customer" }), { hot: true, linkedNodeIds: ["cus-calder", "prd-insight", "gro-calder-tier2"] }),
      n("cus-exp-bu", "New business unit", "Apex private credit desk", "opportunity", "opportunity", 4, D("£120k inside an existing relationship", "Why it matters: the desk currently runs on spreadsheets and a legacy tool losing support next year."), { linkedNodeIds: ["cus-apex", "gro-apex-privatecredit"] }),
      n("cus-exp-geo", "Geographic rollout", "Calder Wealth US entity", "opportunity", "opportunity", 3, D("£65k, scoping session booked", "Why it matters: same platform, new legal entity, minimal additional delivery load — and it opens the US segment with a reference."), { linkedNodeIds: ["cus-calder", "mkt-seg-usfintech"] }),
      n("cus-exp-parent", "Parent-company introduction", "Kestrel Life → group insurer", "opportunity", "opportunity", 3, D("Four entities, one relationship", "Why it matters: a successful go-live is the price of entry to the group conversation."), { linkedNodeIds: ["cus-kestrel"] }),
      n("cus-exp-reference", "Reference & case study", "Calder Wealth story, unpublished", "opportunity", "opportunity", 2, D("Approved in July, still unused", "Why it matters: two live deals have asked for exactly this proof point and it is sitting in a folder."), { linkedNodeIds: ["cus-calder", "gro-meridian", "mkt-seg-reference"] }),
      n("cus-exp-referral", "Referral opportunity", "Northstar Financial CFO peer network", "opportunity", "opportunity", 2, D("A warm route into three target accounts", "Why it matters: their CFO chairs an industry operations forum with exactly the right attendees."), { linkedNodeIds: ["cus-northstar", "mkt-eco-referral"] }),
    ]),
  ],
);
