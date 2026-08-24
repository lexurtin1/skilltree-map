import { D, E, defineDomain, g, n, s } from "../build";

/**
 * Organisation — ownership, capability, momentum.
 * Demo data. Figures are illustrative and deliberately generic.
 */
export const organisation = defineDomain(
  "organisation",
  D(
    "24 people · 3 material commitments without a named owner",
    "Why it matters: the plan is not short of capability in aggregate. It is short of it in two specific places, and short of clear ownership in three more — and at this size an unowned commitment simply does not happen.",
    {
      movement: "Delivery attrition 14% · integration lead vacancy open 14 weeks · 4 decisions overdue",
      recommendedAction:
        "Name owners for the three unowned commitments this week. Most of this branch is downstream of that.",
      metrics: [
        { label: "Headcount", value: "24", delta: "+3 YTD", tone: "neutral" },
        { label: "Unowned commitments", value: "3", tone: "critical" },
        { label: "Delivery attrition", value: "14%", delta: "+5pts", tone: "risk" },
        { label: "Decisions overdue", value: "4", tone: "risk" },
      ],
    },
  ),
  [
    g("org-ownership", "Strategic Ownership", "who is actually accountable", [
      n(
        "org-own-noowner",
        "Enterprise Expansion Programme",
        "Initiative without an owner · unstarted for 5 weeks",
        "initiative",
        "critical",
        5,
        D(
          "The largest revenue initiative in the plan, and nobody owns it",
          "Why it matters: it exists in the board pack, it has a target attached, and five weeks after approval no one has been named against it. The Ostara mobilisation and the Apex expansion both sit inside it and both have slipped as a consequence.",
          {
            movement: "Approved 5 weeks ago · no owner, no milestones, no spend",
            recommendedAction:
              "Assign a named owner this week. This is a five-minute decision that is costing a quarter.",
            owner: "Unassigned",
            dueDate: "5 Sept 2026",
            evidence: [E("Plan", "Commitment register, owner field", "Updated 3 hours ago")],
          },
        ),
        {
          hot: true,
          constellationTitle: "Initiative constellation",
          linkedNodeIds: ["del-crit-mobilisation", "cus-exp-bu", "gro-route-expansion"],
          children: [
            s("governs", "sponsors", n("org-noowner-sponsor", "Executive sponsor", "CEO · nominal", "entity", "watch", 4, D("Sponsorship in name only", "Why it matters: sponsorship without a delivery owner produces board updates, not outcomes."))),
            s("accountable for", "owns", n("org-noowner-owner", "Owner", "Unassigned", "risk", "critical", 5, D("The gap itself", "Why it matters: every other node on this constellation is waiting on this one decision."), { linkedNodeIds: ["org-dec-overdue"] })),
            s("delivers", "contributes_to", n("org-noowner-teams", "Contributing teams", "Commercial · Delivery · Product", "entity", "watch", 4, D("Three teams, no convening authority", "Why it matters: cross-functional work without an owner defaults to whoever has spare time, which is nobody."), { linkedNodeIds: ["org-team-dependency"] })),
            s("requires", "requires", n("org-noowner-milestones", "Milestones", "None defined", "risk", "critical", 4, D("Evidence incomplete", "Why it matters: there is nothing to track, so nothing has been tracked."))),
            s("requires", "requires", n("org-noowner-budget", "Budget", "£120k allocated, £0 committed", "entity", "watch", 4, D("Money sitting idle against an unowned plan", "Why it matters: the budget was the easy part and it is the only part that happened."), { linkedNodeIds: ["cap-run-uncommitted"] })),
            s("requires", "requires", n("org-noowner-capability", "Capability requirements", "Commercial lead time · delivery mobilisation", "entity", "risk", 4, D("Both currently oversubscribed", "Why it matters: the two capabilities it needs are the two that are already constrained."), { linkedNodeIds: ["org-team-workload", "del-con-specialist"] })),
            s("depends on", "depends_on", n("org-noowner-dependencies", "Dependencies", "Ostara mobilisation · Apex renewal timing", "entity", "risk", 4, D("Two live dependencies, both slipping", "Why it matters: neither has been escalated because neither has an owner to escalate."), { linkedNodeIds: ["del-crit-mobilisation", "cus-apex"] })),
            s("requires", "requires", n("org-noowner-decisions", "Decisions", "Owner assignment · overdue 5 weeks", "decision", "critical", 5, D("Decision required", "Why it matters: one name unblocks the entire initiative."), { linkedNodeIds: ["org-dec-overdue"] })),
            s("contributes to", "contributes_to", n("org-noowner-outcome", "Target business outcome", "£340k expansion revenue by Q2", "opportunity", "risk", 5, D("A target with no path", "Why it matters: the number is still in the forecast."), { linkedNodeIds: ["cap-fc-coverage"] })),
          ],
        },
      ),
      n(
        "org-own-founder",
        "US Fintech Market Entry",
        "Founder-led workstream · no delegated owner",
        "initiative",
        "watch",
        5,
        D(
          "The most important initiative in the company, run in the founder's spare time",
          "Why it matters: it is the segment decision, the roadmap decision and the funding story in one. Founder-led is right for the decision and wrong for the execution, and the execution has not started.",
          {
            movement: "Segment mandate confirmed · residency capability unfunded · no delegated owner",
            recommendedAction:
              "Keep the strategy with the founder and delegate the programme before the roadmap decision, not after it.",
            owner: "CEO",
            dueDate: "30 Sept 2026",
            evidence: [E("Plan", "Initiative register", "Updated 3 hours ago")],
          },
        ),
        {
          hot: true,
          constellationTitle: "Initiative constellation",
          linkedNodeIds: ["mkt-seg-usfintech", "prd-road-regulatory", "cap-alloc-awaiting"],
          children: [
            s("governs", "sponsors", n("org-founder-sponsor", "Executive sponsor", "CEO", "entity", "watch", 5, D("Sponsor and operator are the same person", "Why it matters: that works until it competes with the fundraise."))),
            s("accountable for", "owns", n("org-founder-owner", "Owner", "CEO · not delegated", "risk", "watch", 4, D("Concentration of the most important work", "Why it matters: 38% of executive time is already going to a recovery programme."), { linkedNodeIds: ["org-own-overloaded"] })),
            s("delivers", "contributes_to", n("org-founder-teams", "Contributing teams", "Product · Commercial", "entity", "watch", 4, D("Two teams, no dedicated capacity", "Why it matters: nobody has this in their objectives."))),
            s("requires", "requires", n("org-founder-milestones", "Milestones", "Residency build · pilot · first US logo", "entity", "watch", 4, D("Three milestones, none scheduled", "Why it matters: the mandate date is fixed even if our plan is not."), { linkedNodeIds: ["del-crit-specialist"] })),
            s("requires", "requires", n("org-founder-budget", "Budget", "£260k requested, unapproved", "decision", "critical", 5, D("Decision required", "Why it matters: this is the largest single line in the allocation decision."), { linkedNodeIds: ["cap-alloc-awaiting"] })),
            s("requires", "requires", n("org-founder-capability", "Capability requirements", "US regulatory expertise · 1 person, no backup", "risk", "risk", 5, D("A segment strategy resting on one CV", "Why it matters: the same person is on Project Atlas and two proposals."), { linkedNodeIds: ["org-talent-key", "del-con-keyperson"] })),
            s("depends on", "depends_on", n("org-founder-dependencies", "Dependencies", "Residency roadmap · US environment · anchor customer", "entity", "risk", 4, D("Three dependencies, one funded", "Why it matters: only the anchor customer is in place, and only informally."), { linkedNodeIds: ["prd-health-deployment", "cap-fund-anchor"] })),
            s("requires", "requires", n("org-founder-decisions", "Decisions", "Fund, partner or concede · overdue", "decision", "critical", 5, D("Decision required", "Why it matters: deferring is the same as conceding, but more expensive."), { linkedNodeIds: ["prd-road-regulatory", "org-dec-investment"] })),
            s("contributes to", "contributes_to", n("org-founder-outcome", "Target business outcome", "First US logo by Q3 · £58m segment access", "opportunity", "opportunity", 5, D("Expansion route identified", "Why it matters: it is also the growth story the next round is priced on."), { linkedNodeIds: ["cap-fund-readiness"] })),
          ],
        },
      ),
      n("org-own-overloaded", "Overloaded owner", "CEO carries 3 of the 7 strategic initiatives", "risk", "risk", 4, D("Concentration at the top", "Why it matters: 38% of executive time is going to one recovery programme while the market-entry decision waits."), { linkedNodeIds: ["org-own-founder", "del-bramwell-recovery"] }),
      n("org-own-accountability", "Unclear cross-functional accountability", "Account sponsorship · 4 of top 6 uncovered", "risk", "risk", 5, D("Nobody senior owns the largest relationships", "Why it matters: sponsorship sits between commercial and delivery, so it sits nowhere, including on our largest account.", { recommendedAction: "Assign named executive sponsors to the top six accounts this week.", owner: "CEO" }), { linkedNodeIds: ["cus-risk-sponsor", "org-dec-awaiting"] }),
      n("org-own-objective", "Objective behind plan", "Q3 expansion revenue · 41% of target", "insight", "risk", 4, D("Behind, with a known cause", "Why it matters: the shortfall sits entirely in the unowned expansion programme."), { linkedNodeIds: ["org-own-noowner", "cap-fc-coverage"] }),
      n("org-own-escalation", "Sponsor escalation required", "Bramwell recovery · executive oversight", "risk", "critical", 4, D("Escalated after the third repeat", "Why it matters: it should have been escalated after the second, and the escalation path was not defined."), { linkedNodeIds: ["del-bramwell-recovery", "del-mv-escalation"] }),
      n("org-own-decision-pending", "Decision awaiting approval", "Contract integration cover · £48k", "decision", "critical", 4, D("Decision required · the cheapest unblock available", "Why it matters: it costs less than one month of the revenue currently deferred by the capacity shortage."), { linkedNodeIds: ["cap-alloc-hiring", "del-con-specialist"] }),
      n("org-own-governance", "Governance forum", "Weekly operating review · attendance 60%", "insight", "watch", 3, D("The forum exists, the discipline does not", "Why it matters: three of the four overdue decisions have been tabled at it twice."), { linkedNodeIds: ["org-dec-bottleneck", "org-ev-operating"] }),
    ]),

    g("org-teams", "Teams and Capacity", "where the work actually lands", [
      n("org-team-workload", "Highest-workload team", "Delivery · 9 programmes, 6 people", "insight", "risk", 4, D("More programmes than owners", "Why it matters: three programmes share a delivery lead and all three have slipped."), { linkedNodeIds: ["del-con-overload", "org-talent-retention"] }),
      n("org-team-constrained", "Capacity-constrained team", "Integration engineering · 2 people", "risk", "critical", 5, D("Capacity is gating close", "Why it matters: two people are named on the largest implementation, the largest deal's mobilisation and the US pilot."), { linkedNodeIds: ["del-con-specialist", "org-talent-key"] }),
      n("org-team-strategic", "Team required for strategic delivery", "Product · US residency build", "entity", "watch", 4, D("The team the strategy depends on", "Why it matters: currently fully committed to reliability hardening."), { linkedNodeIds: ["prd-road-regulatory", "prd-road-debt"] }),
      n("org-team-underused", "Underutilised capability", "Design · 40% allocated", "insight", "opportunity", 3, D("Spare capacity in the wrong place", "Why it matters: the guided activation work that lifted adoption four points is exactly this team's job."), { linkedNodeIds: ["prd-road-investment"] }),
      n("org-team-imbalance", "Workload imbalance", "5 people reassigned to one recovery", "insight", "watch", 4, D("Recovery work is staffed from live commitments", "Why it matters: every person on the Bramwell programme was taken from another customer's plan."), { linkedNodeIds: ["del-bramwell-team", "org-team-workload"] }),
      n("org-team-coverage", "Role-coverage gap", "No data engineering coverage", "risk", "risk", 4, D("A missing skill on the critical path", "Why it matters: the Kestrel remediation work needs a skill nobody on the programme has."), { linkedNodeIds: ["del-kestrel-team", "org-talent-hiring"] }),
      n("org-team-performance", "Team performance trend", "Delivery throughput per head −11%", "insight", "risk", 3, D("Doing less with the same people", "Why it matters: rework and reassignment account for most of the decline, not effort."), { linkedNodeIds: ["del-mv-effort"] }),
      n("org-team-dependency", "Cross-functional dependency cluster", "Commercial · Delivery · Product on 3 initiatives", "insight", "watch", 4, D("Three teams, three initiatives, one bottleneck", "Why it matters: all three route through the same two integration engineers."), { linkedNodeIds: ["org-team-constrained", "org-own-noowner"] }),
    ]),

    g("org-talent", "Critical Talent", "the people the plan depends on", [
      n("org-talent-key", "Key-person dependency", "2 integration engineers · 3 programmes", "risk", "critical", 5, D("The capability constraint on the entire plan", "Why it matters: two people are named on the largest live implementation, the largest pipeline deal's mobilisation plan and the US residency pilot. Two of those three will be late, and the lead role that would relieve them has been open fourteen weeks.", { movement: "Two failed offers · attrition took a third engineer in May", recommendedAction: "Approve contract cover now and treat permanent hiring as a separate, slower problem.", owner: "COO", dueDate: "15 Sept 2026", metrics: [{ label: "Engineers", value: "2", delta: "−1 YTD", tone: "critical" }, { label: "Programmes needing them", value: "3", tone: "critical" }, { label: "Lead vacancy", value: "14 weeks", tone: "risk" }], evidence: [E("Resource plan", "Named allocations across programmes", "Updated 3 hours ago"), E("Recruitment", "Vacancy age and offer history", "Updated last week")] }), { hot: true, linkedNodeIds: ["del-con-specialist", "gro-blk-capacity", "prd-road-regulatory", "cap-alloc-hiring"] }),
      n("org-talent-vacancy", "Critical vacancy", "Integration lead · open 14 weeks, 2 offers declined", "risk", "risk", 5, D("The vacancy that would relieve the constraint", "Why it matters: both declined offers cited compensation against market, and the band has not been reviewed.", { recommendedAction: "Review the band or stop running the search.", owner: "COO" }), { hot: true, linkedNodeIds: ["org-talent-key", "del-con-vacancy", "cap-risk-unfunded"] }),
      n("org-talent-role", "Role required for commitment", "Security & compliance · 0.5 FTE", "risk", "risk", 4, D("Half a person gates a £680k deal", "Why it matters: customer residency reviews, the certification audit and the open environment exception all sit with the same part-time resource."), { linkedNodeIds: ["gro-blk-security", "prd-health-security", "cap-alloc-security"] }),
      n("org-talent-retention", "Retention risk", "Delivery lead · third recovery in a year", "risk", "risk", 4, D("The person holding it together is the one most likely to leave", "Why it matters: attrition in delivery is already double the company average."), { linkedNodeIds: ["org-team-workload", "org-team-imbalance"] }),
      n("org-talent-overload", "Specialist overload", "US regulatory expert on 3 workstreams", "risk", "risk", 4, D("One person, three claims", "Why it matters: the pilot, Project Atlas and two proposals all need the same individual."), { linkedNodeIds: ["del-con-keyperson", "org-own-founder"] }),
      n("org-talent-fractional", "Fractional adviser", "Sector adviser · 2 days a month", "entity", "opportunity", 3, D("Cheap capability we barely use", "Why it matters: they sit on the operations forum of a live target account and have never been asked for an introduction."), { linkedNodeIds: ["mkt-eco-adviser", "mkt-tgt-window"] }),
      n("org-talent-succession", "Succession gap", "4 roles with no documented backup", "risk", "risk", 4, D("Four single points of failure", "Why it matters: three of them appear elsewhere on this map as delivery or product risks."), { linkedNodeIds: ["del-con-keyperson", "org-talent-key"] }),
      n("org-talent-hiring", "Future hiring opportunity", "Data engineer · unfunded, high leverage", "opportunity", "watch", 3, D("A role that pays for itself", "Why it matters: it removes the Kestrel remediation risk and the recurring migration cost at once."), { linkedNodeIds: ["org-team-coverage", "cap-risk-unfunded"] }),
    ]),

    g("org-decisions", "Decision Flow", "what is waiting on a name", [
      n("org-dec-overdue", "Overdue decision", "4 executive decisions open longer than 30 days", "risk", "critical", 5, D("Decision required · four decisions are holding four branches of this map", "Why it matters: the US roadmap, contract capacity cover, executive sponsorship and the pricing exception have all been open longer than a month. Each is blocking work downstream, and three of the four cost less than the revenue they are deferring.", { recommendedAction: "Clear all four at the next leadership meeting rather than sequencing them.", owner: "CEO", dueDate: "15 Sept 2026" }), { hot: true, linkedNodeIds: ["prd-road-regulatory", "org-dec-investment", "org-own-accountability", "cap-alloc-awaiting"] }),
      n("org-dec-awaiting", "Decision awaiting approval", "Executive sponsors for the top six accounts", "decision", "risk", 4, D("Decision required · a decision that costs nothing", "Why it matters: four names against four accounts, this week, and the largest account in the book stops being unsponsored."), { linkedNodeIds: ["org-own-accountability", "cus-risk-sponsor"] }),
      n("org-dec-evidence", "Decision blocked by evidence gap", "Build versus buy · no partner evaluation", "decision", "watch", 3, D("Evidence incomplete", "Why it matters: the decision has been deferred twice for want of a two-day evaluation nobody has been asked to do."), { linkedNodeIds: ["prd-road-buildbuy", "cap-alloc-buildbuy"] }),
      n("org-dec-bottleneck", "Repeated bottleneck", "Pricing exceptions all escalate to the CEO", "insight", "watch", 3, D("Decisions escalating that should not", "Why it matters: every discount above 10% reaches the executive team, roughly two a week."), { linkedNodeIds: ["org-dec-policy", "mkt-comp-pricing"] }),
      n("org-dec-policy", "Policy exception", "One environment outside standard controls · 7 months", "decision", "risk", 4, D("A temporary exception with no end date", "Why it matters: the certification audit is due in October and this is the open finding."), { linkedNodeIds: ["prd-health-security", "del-ops-compliance"] }),
      n("org-dec-board", "Board decision", "Seed extension · raise now or after the US decision", "decision", "critical", 5, D("Decision required · sequencing the raise", "Why it matters: raising before the US decision means selling a plan; raising after means selling a proof point — with four months less runway.", { owner: "CEO", dueDate: "9 Oct 2026" }), { linkedNodeIds: ["cap-fund-milestone", "cap-fund-readiness", "org-ev-board"] }),
      n("org-dec-investment", "Investment decision", "US residency build · £260k", "decision", "critical", 5, D("Decision required · the largest allocation open", "Why it matters: it opens a £58m segment with a dated trigger, or concedes it."), { linkedNodeIds: ["cap-alloc-awaiting", "prd-road-regulatory", "org-own-founder"] }),
      n("org-dec-customer", "Customer-impacting decision", "Strategic Account Renewal · Northstar uplift", "decision", "watch", 4, D("Decision required · enforce, phase or waive the indexed uplift", "Why it matters: a contractual right and a relationship risk, falling due in a quarter with no sponsor and an open implementation.", { owner: "CEO", dueDate: "14 Nov 2026" }), { linkedNodeIds: ["cus-northstar", "cus-ev-pricing", "cap-risk-renewal"] }),
    ]),

    g("org-events", "Upcoming Organisation Events", "the leadership calendar", [
      n("org-ev-leadership", "Leadership meeting", "Weekly · 8 Sept", "event", "critical", 4, D("Where the four overdue decisions get cleared", "Why it matters: they have been tabled twice already."), { linkedNodeIds: ["org-dec-overdue"] }),
      n("org-ev-board", "Board meeting", "9 Oct · seed extension on the agenda", "event", "critical", 5, D("The raise sequencing decision", "Why it matters: the US decision should be taken before this meeting, not at it."), { linkedNodeIds: ["org-dec-board", "cap-fund-milestone"] }),
      n("org-ev-interview", "Hiring interview", "Integration lead · third candidate, 11 Sept", "event", "risk", 4, D("Third attempt at the same role", "Why it matters: two previous offers were declined on compensation and the band is unchanged."), { linkedNodeIds: ["org-talent-vacancy"] }),
      n("org-ev-offer", "Offer decision", "Integration lead · band review required", "event", "risk", 4, D("Decision required before the offer, not after", "Why it matters: making the same offer a third time produces the same answer."), { linkedNodeIds: ["org-talent-vacancy", "cap-risk-unfunded"] }),
      n("org-ev-operating", "Operating review", "Monthly · 30 Sept", "event", "watch", 3, D("Attendance is the problem", "Why it matters: 60% attendance is why decisions get tabled twice."), { linkedNodeIds: ["org-own-governance"] }),
      n("org-ev-offsite", "Strategy off-site", "US market entry · 21 Oct", "event", "watch", 3, D("After the decision it is meant to inform", "Why it matters: the funding decision is due 30 September; this is three weeks late to be useful."), { linkedNodeIds: ["org-own-founder", "mkt-seg-usfintech"] }),
      n("org-ev-performance", "Performance review", "Half-year cycle · 3 Oct", "event", "neutral", 2, D("Retention checkpoint", "Why it matters: the delivery lead most at risk of leaving is in this cycle."), { linkedNodeIds: ["org-talent-retention"] }),
      n("org-ev-governance", "Governance review", "Certification audit readiness · 16 Oct", "event", "risk", 4, D("The audit that the open exception fails", "Why it matters: it is also the certification two live deals are waiting on."), { linkedNodeIds: ["org-dec-policy", "prd-health-security"] }),
    ]),
  ],
);
