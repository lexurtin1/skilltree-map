import { D, E, defineDomain, g, n, s } from "../build";

/**
 * Growth — pipeline, expansion, conversion.
 * Demo data. Figures are illustrative and deliberately generic.
 */
export const growth = defineDomain(
  "growth",
  D(
    "£1.6m weighted pipeline against a £1.1m target",
    "Why it matters: coverage looks adequate in aggregate and thin where it matters. 44% of the weighted number sits in three deals, two of which are held by an external dependency rather than a commercial one.",
    {
      movement: "£240k moved out of quarter last month · win rate 31%, down 4 points",
      recommendedAction:
        "Unblock the Meridian Markets data residency review personally. It gates a third of the quarter.",
      metrics: [
        { label: "Weighted pipeline", value: "£1.6m", delta: "+£180k QoQ", tone: "healthy" },
        { label: "Slipped this month", value: "£240k", tone: "risk" },
        { label: "Win rate", value: "31%", delta: "−4pts", tone: "watch" },
        { label: "Blocked value", value: "£920k", tone: "critical" },
      ],
    },
  ),
  [
    g("gro-opportunities", "Priority Opportunities", "the deals that decide the quarter", [
      n(
        "gro-meridian",
        "Meridian Markets",
        "Largest pipeline opportunity · £680k",
        "opportunity",
        "watch",
        5,
        D(
          "£680k · 55% · close date 12 Dec",
          "Why it matters: our first genuinely enterprise deal, across two divisions. Commercially well-shaped and executively sponsored, but sitting behind a data residency review that has not moved in five weeks.",
          {
            movement: "No activity scheduled · close date moved once, from 28 Nov",
            recommendedAction:
              "Escalate the Data Residency Review to their CISO directly. Everything else in this deal is ready.",
            owner: "Commercial Lead",
            dueDate: "12 Dec 2026",
            metrics: [
              { label: "Value", value: "£680k", tone: "opportunity" },
              { label: "Probability", value: "55%", delta: "held", tone: "watch" },
              { label: "Days in stage", value: "63", delta: "+28 over median", tone: "risk" },
            ],
            evidence: [
              E("CRM", "Opportunity record and stage history", "Updated yesterday"),
              E("Deal room", "Residency questionnaire, no actions closed", "Evidence incomplete · 5 weeks old"),
            ],
          },
        ),
        {
          hot: true,
          constellationTitle: "Deal reality map",
          linkedNodeIds: ["prd-health-security", "org-talent-role", "mkt-seg-banking"],
          children: [
            s("pursues", "generates", n("gro-meridian-account", "Account", "Meridian Markets · two divisions in scope", "entity", "neutral", 4, D("Not yet a customer", "Why it matters: first platform purchase in this institution for six years."), { linkedNodeIds: ["mkt-seg-banking"] })),
            s("owned by", "owns", n("gro-meridian-owner", "Owner", "Commercial Lead", "entity", "healthy", 3, D("Correctly assigned, thinly covered", "Why it matters: the same person owns two of the top three deals."), { linkedNodeIds: ["org-team-workload"] })),
            s("sponsors", "sponsors", n("gro-meridian-committee", "Buying committee", "6 mapped · CISO unengaged", "entity", "risk", 4, D("One gap, and it is the one that matters", "Why it matters: every seat is mapped and engaged except the CISO, who owns the blocking review."), { linkedNodeIds: ["gro-blk-security"] })),
            s("sponsors", "sponsors", n("gro-meridian-champion", "Champion", "Divisional COO · active and credible", "entity", "healthy", 4, D("A genuine champion", "Why it matters: has presented the business case internally twice without prompting."))),
            s("contributes to", "contributes_to", n("gro-meridian-case", "Commercial case", "3-year payback · signed off by their finance team", "entity", "healthy", 4, D("The business case is not the obstacle", "Why it matters: their own finance function has validated the payback model."))),
            s("requires", "requires", n("gro-meridian-proposition", "Product proposition", "Signal Core · Connect API · Assurance Vault", "entity", "healthy", 4, D("Standard configuration", "Why it matters: no bespoke development is required to win this."), { linkedNodeIds: ["prd-signal-core"] })),
            s("conditions close", "depends_on", n("gro-meridian-delivery", "Delivery feasibility", "Q1 mobilisation · needs 2 integration engineers", "entity", "risk", 4, D("Capacity is gating close", "Why it matters: mobilising in Q1 collides with Project Atlas for the same two engineers."), { linkedNodeIds: ["del-con-specialist", "org-talent-key"] })),
            s("blocks", "blocks", n("gro-meridian-residency", "Data Residency Review", "Open 5 weeks · no actions closed", "risk", "critical", 5, D("The single gate on £680k", "Why it matters: five weeks open, no closed actions, no scheduled follow-up, and no relationship with the reviewer.", { recommendedAction: "Founder-to-CISO escalation this week." }), { linkedNodeIds: ["gro-blk-security", "prd-health-security"] })),
            s("contributes to", "contributes_to", n("gro-meridian-forecast", "Forecast contribution", "£374k weighted · 34% of the quarter", "insight", "watch", 5, D("A quarter with a single point of failure", "Why it matters: a third of the forecast depends on one unblocked review."), { linkedNodeIds: ["cap-fc-coverage"] })),
            s("requires", "requires", n("gro-meridian-next", "Next action & meeting", "Residency workshop · unscheduled", "event", "critical", 4, D("No activity scheduled", "Why it matters: the most valuable deal in the pipeline has no booked next contact."))),
          ],
        },
      ),
      n(
        "gro-calder-tier2",
        "Calder Wealth — Tier 2 uplift",
        "Highest-probability deal · £145k",
        "opportunity",
        "opportunity",
        4,
        D(
          "£145k · 85% · close date 30 Sept",
          "Why it matters: expansion inside the best-performing account in the book. Consumption already exceeds the contracted tier, so the commercial case makes itself.",
          {
            movement: "Momentum improving · probability raised from 70% to 85% after the sponsor call",
            recommendedAction: "Close it in the US scoping session rather than as a separate motion.",
            owner: "Head of Customer",
            dueDate: "30 Sept 2026",
          },
        ),
        {
          hot: true,
          constellationTitle: "Deal reality map",
          linkedNodeIds: ["cus-calder", "cus-exp-crosssell", "prd-insight"],
          children: [
            s("pursues", "generates", n("gro-calder-account", "Account", "Calder Wealth · existing customer", "entity", "healthy", 4, D("Existing relationship", "Why it matters: fastest-growing account in the book."), { linkedNodeIds: ["cus-calder"] })),
            s("owned by", "owns", n("gro-calder-owner", "Owner", "Head of Customer", "entity", "healthy", 3, D("Owned inside the account team", "Why it matters: no handover required."))),
            s("sponsors", "sponsors", n("gro-calder-champion", "Champion", "CEO · has already asked for it", "entity", "healthy", 4, D("Buyer-initiated", "Why it matters: the sponsor raised the uplift before we did."))),
            s("sponsors", "sponsors", n("gro-calder-committee", "Buying committee", "3 mapped · all engaged", "entity", "healthy", 3, D("Full coverage", "Why it matters: no unmapped seats and no procurement layer at this value."))),
            s("contributes to", "contributes_to", n("gro-calder-case", "Commercial case", "Overage already exceeds the uplift", "entity", "opportunity", 4, D("The case is arithmetic", "Why it matters: they are paying more in monthly overage than the committed tier would cost."), { linkedNodeIds: ["prd-opp-packaging"] })),
            s("requires", "requires", n("gro-calder-proposition", "Product proposition", "Insight Analytics attach", "entity", "healthy", 3, D("Natural third module", "Why it matters: already scoped and requested."), { linkedNodeIds: ["prd-insight"] })),
            s("conditions close", "depends_on", n("gro-calder-feasibility", "Delivery feasibility", "No new implementation required", "entity", "healthy", 3, D("Nothing to build", "Why it matters: a tier change and a contract amendment, no delivery load."))),
            s("contributes to", "contributes_to", n("gro-calder-forecast", "Forecast contribution", "£123k weighted · in-quarter", "insight", "opportunity", 4, D("Clean in-quarter revenue", "Why it matters: the highest-confidence line in the forecast."), { linkedNodeIds: ["cap-fc-increase"] })),
            s("requires", "requires", n("gro-calder-next", "Next action & meeting", "US scoping session · 26 Sept", "event", "opportunity", 3, D("Booked and imminent", "Why it matters: the uplift should be signed in this meeting."))),
          ],
        },
      ),
      n(
        "gro-thornbury",
        "Thornbury Insurance",
        "Stalled late-stage deal · £240k",
        "opportunity",
        "risk",
        4,
        D(
          "£240k · 70% on paper · 91 days in stage",
          "Why it matters: everything was agreed in June. Since then the champion has left, procurement has restarted its process, and the forecast still carries it at 70%.",
          {
            movement: "No activity scheduled · no customer-side contact for 34 days",
            recommendedAction:
              "Re-qualify honestly. If a new champion cannot be found this month, move it out of the quarter rather than carrying it.",
            owner: "Commercial Lead",
            evidence: [E("CRM", "Activity log, last customer contact", "Evidence incomplete · 34 days old")],
          },
        ),
        {
          constellationTitle: "Deal reality map",
          linkedNodeIds: ["gro-blk-champion", "gro-mv-noactivity", "cap-fc-reduction"],
          children: [
            s("pursues", "generates", n("gro-thornbury-account", "Account", "Thornbury Insurance", "entity", "watch", 3, D("Mid-market insurer", "Why it matters: strong fit on paper, weak access in practice."))),
            s("owned by", "owns", n("gro-thornbury-owner", "Owner", "Commercial Lead", "entity", "watch", 3, D("Same owner as Meridian", "Why it matters: attention is going where the larger number is."))),
            s("sponsors", "sponsors", n("gro-thornbury-champion", "Champion", "Departed in July · not replaced", "risk", "critical", 5, D("The deal lost its advocate", "Why it matters: the only person carrying the business case internally has left the company."), { linkedNodeIds: ["gro-blk-champion"] })),
            s("sponsors", "sponsors", n("gro-thornbury-committee", "Buying committee", "4 mapped · 2 now unreachable", "entity", "risk", 4, D("Coverage has degraded", "Why it matters: half the mapped committee has stopped responding."))),
            s("contributes to", "contributes_to", n("gro-thornbury-case", "Commercial case", "Agreed in June, never re-tested", "entity", "watch", 3, D("A business case nobody owns", "Why it matters: the numbers were built with a person who has gone."), { linkedNodeIds: ["gro-blk-case"] })),
            s("blocks", "blocks", n("gro-thornbury-procurement", "Procurement dependency", "Restarted from the beginning", "risk", "risk", 4, D("Process reset", "Why it matters: a new procurement lead has reopened requirements that were closed in May."), { linkedNodeIds: ["gro-blk-legal"] })),
            s("contributes to", "contributes_to", n("gro-thornbury-forecast", "Forecast contribution", "£168k weighted · probably wrong", "insight", "risk", 4, D("The forecast is carrying a stalled deal", "Why it matters: 70% probability is not defensible with no champion and no activity."), { linkedNodeIds: ["cap-fc-reduction"] })),
            s("requires", "requires", n("gro-thornbury-next", "Next action & meeting", "None scheduled", "event", "critical", 4, D("No activity scheduled", "Why it matters: there is no meeting, no owner action, and no date."))),
          ],
        },
      ),
      n("gro-ostara", "Ostara Bank", "Strategic logo · £320k", "opportunity", "watch", 4, D("£320k · 40% · close date 28 Feb", "Why it matters: not the largest deal, but the reference value in mid-market banking is worth more than the contract at this stage."), { linkedNodeIds: ["mkt-seg-banking", "gro-blk-pricing", "del-crit-mobilisation"] }),
      n("gro-apex-privatecredit", "Apex private credit desk", "Executive-sponsored deal · £190k", "opportunity", "opportunity", 4, D("£190k · 65% · expansion inside a live account", "Why it matters: sponsored by the operations director who owns the existing relationship. The only real question is renewal timing."), { linkedNodeIds: ["cus-apex", "cus-exp-bu"] }),
      n("gro-pinnacle", "Pinnacle Markets", "Weak buyer coverage deal · £120k", "opportunity", "risk", 3, D("£120k · 45% · one contact, no economic buyer", "Why it matters: advancing on the strength of a single enthusiastic user with no visible budget authority."), { linkedNodeIds: ["gro-blk-buyer"] }),
      n("gro-lattice", "Lattice Fund Services", "Deal most likely to slip · £95k", "opportunity", "risk", 3, D("£95k · 50% · close date already moved twice", "Why it matters: legal review has been open longer than the deal has been in late stage."), { linkedNodeIds: ["gro-blk-legal", "mkt-seg-fundservices"] }),
    ]),

    g("gro-movement", "Pipeline Movement", "what moved and what did not", [
      n("gro-mv-ageing", "Stage ageing threshold breached", "Meridian & Thornbury · 63 and 91 days", "insight", "risk", 5, D("£920k sitting past the ageing threshold", "Why it matters: two deals account for most of the ageing in the pipeline, and both are aged for external reasons rather than commercial ones. Ageing here is a dependency problem, not a selling problem.", { recommendedAction: "Fix the dependency, not the sales activity." }), { linkedNodeIds: ["gro-meridian", "gro-thornbury"] }),
      n("gro-mv-newpipeline", "New qualified pipeline", "£310k added this month", "insight", "healthy", 3, D("Above the monthly run rate", "Why it matters: £140k of it came through partner and portfolio routes rather than outbound."), { linkedNodeIds: ["gro-route-pe", "gro-route-partner"] }),
      n("gro-mv-progression", "Stage progression", "4 deals advanced · £280k", "insight", "healthy", 3, D("Healthy mid-funnel movement", "Why it matters: all four advanced on completed customer actions rather than optimism."), {}),
      n("gro-mv-probability", "Probability changed", "Calder raised to 85% · Pinnacle cut to 45%", "insight", "watch", 3, D("Two honest revisions", "Why it matters: one up on a sponsor commitment, one down on missing buyer coverage."), { linkedNodeIds: ["gro-calder-tier2", "gro-pinnacle"] }),
      n("gro-mv-closedate", "Close date moved", "£240k pushed out of quarter", "insight", "risk", 4, D("Third consecutive month of slippage", "Why it matters: the same two deals have moved in each of the last three months."), { linkedNodeIds: ["gro-thornbury", "gro-lattice", "cap-fc-dealmoved"] }),
      n("gro-mv-value", "Deal value changed", "Meridian scope widened to two divisions", "insight", "opportunity", 3, D("Value up £160k on scope", "Why it matters: the second division was added by the customer, not proposed by us."), { linkedNodeIds: ["gro-meridian"] }),
      n("gro-mv-competitor", "Competitor identified", "Named in 3 of the top 6 deals", "insight", "watch", 3, D("Competitive density is rising", "Why it matters: the same competitor appears in all three."), { linkedNodeIds: ["mkt-comp-strategic", "mkt-comp-winloss"] }),
      n("gro-mv-noactivity", "No next activity scheduled", "£1.0m with no booked next step", "insight", "risk", 4, D("No activity scheduled on two-thirds of the pipeline value", "Why it matters: including the largest and the most stalled deals."), { linkedNodeIds: ["gro-meridian", "gro-thornbury"] }),
    ]),

    g("gro-blockers", "Growth Blockers", "what is stopping the money", [
      n("gro-blk-security", "Data Residency Review", "Meridian Markets · open 5 weeks", "risk", "critical", 5, D("£680k behind one unclosed security review", "Why it matters: no actions closed, no follow-up scheduled, and no relationship with the reviewer. It is also the same gap that will appear in every US deal we run.", { recommendedAction: "Founder-to-CISO escalation this week, and fund the residency work in the roadmap.", owner: "CTO", dueDate: "5 Sept 2026", evidence: [E("Deal room", "Residency questionnaire status", "Evidence incomplete · 5 weeks old")] }), { hot: true, linkedNodeIds: ["gro-meridian", "prd-health-security", "prd-road-regulatory", "mkt-seg-usfintech"] }),
      n("gro-blk-champion", "Champion departure", "Thornbury · champion left in July", "risk", "critical", 4, D("The deal has no internal advocate", "Why it matters: no replacement has been identified in seven weeks."), { linkedNodeIds: ["gro-thornbury"] }),
      n("gro-blk-capacity", "Delivery capacity", "Q1 mobilisation collides with Project Atlas", "risk", "risk", 4, D("Capacity is gating close", "Why it matters: two deals need the same two engineers. Winning Meridian without adding capacity delays Project Atlas."), { linkedNodeIds: ["del-con-specialist", "org-talent-key", "cap-alloc-hiring"] }),
      n("gro-blk-legal", "Legal / procurement review", "Lattice open 47 days · Thornbury restarted", "risk", "risk", 3, D("Two deals held in process", "Why it matters: one non-standard liability clause and one procurement reset, neither of which anyone owns."), { linkedNodeIds: ["gro-lattice", "gro-thornbury"] }),
      n("gro-blk-productgap", "Product gap", "US data residency and regional reporting", "risk", "risk", 4, D("Named in two open deals", "Why it matters: it is currently on the roadmap for the quarter after next, which is after both close dates."), { linkedNodeIds: ["prd-road-regulatory", "mkt-comp-gap"] }),
      n("gro-blk-buyer", "Missing executive relationship", "Pinnacle · no economic buyer identified", "risk", "risk", 3, D("Selling below the budget line", "Why it matters: one enthusiastic user, no budget holder, and a forecast that assumes otherwise."), { linkedNodeIds: ["gro-pinnacle"] }),
      n("gro-blk-case", "Unclear business case", "Thornbury · case agreed with a departed champion", "risk", "risk", 3, D("Evidence incomplete", "Why it matters: the payback model was never re-tested with anyone still in post."), { linkedNodeIds: ["gro-thornbury"] }),
      n("gro-blk-pricing", "Pricing exception", "Ostara Bank · 18% below list", "decision", "watch", 3, D("Decision required", "Why it matters: a discount framed as a reference argument. The reference value is real but it needs a number attached to it.", { owner: "CEO" }), { linkedNodeIds: ["gro-ostara", "cap-alloc-lowreturn", "org-dec-policy"] }),
    ]),

    g("gro-routes", "Routes to Market", "how the pipeline gets created", [
      n("gro-route-pe", "PE portfolio route", "Apex Fund Services · 40+ portfolio companies", "opportunity", "opportunity", 4, D("Expansion route identified · the best-converting source we barely use", "Why it matters: portfolio-sourced opportunities convert at roughly twice the rate of outbound, and we have run three this year.", { recommendedAction: "Make portfolio introductions a standing item in the account plan.", owner: "CEO" }), { hot: true, linkedNodeIds: ["cus-apex", "mkt-eco-pe", "cap-alloc-highreturn"] }),
      n("gro-route-partner", "Partner-sourced opportunity", "Integration partner co-sell · £160k sourced YTD", "opportunity", "opportunity", 3, D("Working, under-resourced", "Why it matters: one partner has sourced more qualified pipeline this year than the whole campaign programme."), { linkedNodeIds: ["mkt-eco-tech"] }),
      n("gro-route-tech", "Technology partner", "Shared custodian integration · 3 joint accounts", "opportunity", "opportunity", 3, D("Distribution through the integration surface", "Why it matters: every account on this custodian is pre-qualified for us."), { linkedNodeIds: ["mkt-eco-integration", "prd-opp-integration"] }),
      n("gro-route-referral", "Customer referral", "Northstar Financial CFO peer forum", "opportunity", "opportunity", 3, D("Three target accounts in one room", "Why it matters: the forum meets quarterly and our customer chairs it."), { linkedNodeIds: ["cus-exp-referral", "mkt-eco-referral"] }),
      n("gro-route-expansion", "Existing-customer expansion", "£560k identified across 6 accounts", "opportunity", "opportunity", 4, D("The cheapest pipeline available", "Why it matters: expansion deals close in roughly half the time of new logos and cost a third as much to win."), { hot: true, linkedNodeIds: ["cus-exp-crosssell", "cus-exp-bu", "cap-alloc-highreturn"] }),
      n("gro-route-vc", "VC portfolio route", "Two funds · early relationship", "opportunity", "neutral", 2, D("Unproven", "Why it matters: four months old, no sourced opportunities yet."), { linkedNodeIds: ["mkt-eco-vc"] }),
      n("gro-route-event", "Industry event", "Asset Operations Summit · 8 Oct", "opportunity", "watch", 2, D("Nine customers and four targets attending", "Why it matters: historically produces two qualified opportunities for the cost of a stand."), { linkedNodeIds: ["mkt-sig-event", "gro-ev-industry"] }),
      n("gro-route-campaign", "Campaign engagement", "US residency campaign · 34 engaged accounts", "insight", "watch", 2, D("Engagement without conversion", "Why it matters: high content engagement, low meeting conversion — we are creating demand for something we cannot yet sell."), { linkedNodeIds: ["mkt-seg-usfintech", "cap-alloc-lowreturn"] }),
    ]),

    g("gro-events", "Upcoming Commercial Events", "dates that move the number", [
      n("gro-ev-security", "Legal review", "Meridian Data Residency Review · unscheduled", "event", "critical", 5, D("The meeting that is not in the diary", "Why it matters: until this is booked, £680k has no path forward.", { dueDate: "No activity scheduled" }), { linkedNodeIds: ["gro-meridian", "gro-blk-security"] }),
      n("gro-ev-decision", "Decision date", "Calder Tier 2 uplift · 30 Sept", "event", "opportunity", 4, D("In-quarter close", "Why it matters: the sponsor has confirmed the date."), { linkedNodeIds: ["gro-calder-tier2"] }),
      n("gro-ev-procurement", "Procurement deadline", "Thornbury · 15 Oct submission", "event", "risk", 3, D("A deadline we may not want to meet", "Why it matters: submitting without a champion repeats the June outcome."), { linkedNodeIds: ["gro-thornbury"] }),
      n("gro-ev-demo", "Product demonstration", "Ostara Bank · 17 Sept", "event", "watch", 3, D("Differentiation moment", "Why it matters: the competitive comparison is decided in this session."), { linkedNodeIds: ["gro-ostara", "prd-opp-differentiated"] }),
      n("gro-ev-board", "Target-account board meeting", "Meridian Markets board · 3 Nov", "event", "watch", 4, D("Where the spend is approved", "Why it matters: the business case is presented for approval at this meeting, residency review or not."), { linkedNodeIds: ["gro-meridian"] }),
      n("gro-ev-clientmeeting", "Client meeting", "Apex renewal framing · 18 Sept", "event", "opportunity", 3, D("Renewal and expansion in one conversation", "Why it matters: also the moment to ask for portfolio introductions."), { linkedNodeIds: ["cus-apex", "gro-route-pe"] }),
      n("gro-ev-industry", "Industry event", "Asset Operations Summit · 8 Oct", "event", "neutral", 2, D("Highest-density customer contact of the year", "Why it matters: nine customers, four targets and one open speaking slot."), { linkedNodeIds: ["mkt-sig-event", "cus-ev-industry"] }),
      n("gro-ev-review", "Internal deal review", "Quarterly pipeline review · 26 Sept", "event", "neutral", 2, D("Forecast honesty checkpoint", "Why it matters: Thornbury's 70% probability should not survive this meeting."), { linkedNodeIds: ["gro-thornbury", "cap-fc-confidence"] }),
    ]),
  ],
);
