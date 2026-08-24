import { D, E, defineDomain, g, n, s } from "../build";

/**
 * Delivery — execution, capacity, commitments.
 * Demo data. Figures are illustrative and deliberately generic.
 */
export const delivery = defineDomain(
  "delivery",
  D(
    "£840k of signed commitments in flight across 9 programmes",
    "Why it matters: two programmes carry most of the exposure and both depend on the same two integration engineers. Capacity, not capability, is the binding constraint this quarter — and it is deferring revenue we have already sold.",
    {
      movement: "Three go-live dates moved this month · one service-level breach",
      recommendedAction:
        "Resolve the integration engineer shortage before committing to a Q1 Meridian mobilisation.",
      metrics: [
        { label: "Commitments in flight", value: "£840k", tone: "neutral" },
        { label: "Revenue awaiting go-live", value: "£186k", delta: "£94k delayed", tone: "risk" },
        { label: "Programmes off plan", value: "4 of 9", tone: "watch" },
        { label: "Delivery margin", value: "34%", delta: "−4pts", tone: "risk" },
      ],
    },
  ),
  [
    g("del-critical", "Critical Deliveries", "the programmes that carry the risk", [
      n(
        "del-atlas",
        "Project Atlas",
        "Largest implementation · Northstar Financial · £260k",
        "initiative",
        "risk",
        5,
        D(
          "Go-live moved from 30 Nov to 31 Jan",
          "Why it matters: the largest implementation in the business, running for our largest customer, in the same quarter as that customer's pricing review. Two integration engineers are the critical path and £94k of billing sits behind the go-live.",
          {
            movement: "Go-live +2 months · effort variance +18% · two escalations open",
            recommendedAction:
              "Protect the two engineers from reassignment and re-baseline the plan with the customer before the September business review.",
            owner: "Delivery Lead",
            dueDate: "31 Jan 2027",
            metrics: [
              { label: "Contract value", value: "£260k", tone: "neutral" },
              { label: "Effort variance", value: "+18%", tone: "risk" },
              { label: "Go-live", value: "31 Jan", delta: "+2 months", tone: "risk" },
            ],
            evidence: [
              E("Programme plan", "Milestone baseline and current forecast", "Updated 3 hours ago"),
              E("Timesheets", "Effort against estimate", "Updated last week"),
            ],
          },
        ),
        {
          hot: true,
          constellationTitle: "Implementation constellation",
          linkedNodeIds: ["cus-northstar", "del-con-specialist", "cap-rev-golive"],
          children: [
            s("delivers for", "generates", n("del-atlas-commitment", "Customer commitment", "Northstar Financial · £260k contracted scope", "entity", "neutral", 5, D("Fixed scope, fixed price", "Why it matters: two contractual milestones carry payment triggers."), { linkedNodeIds: ["cus-northstar", "cus-northstar-contract"] })),
            s("commits to", "requires", n("del-atlas-workstreams", "Workstreams", "Migration · integration · reporting · training", "entity", "watch", 4, D("Four workstreams, one behind", "Why it matters: integration is the only one off plan, and it gates two others."))),
            s("requires", "requires", n("del-atlas-team", "Team", "7 people · 2 integration engineers", "entity", "risk", 5, D("Two people are the programme", "Why it matters: the same two engineers are named on the Meridian mobilisation plan and the US residency pilot."), { linkedNodeIds: ["del-con-specialist", "org-talent-key"] })),
            s("gates", "blocks", n("del-atlas-milestones", "Milestones", "6 of 9 complete · 2 slipped", "entity", "risk", 4, D("Slippage is concentrated late", "Why it matters: the two slipped milestones both sit on the critical path."))),
            s("requires", "requires", n("del-atlas-integrations", "Integrations", "3 custodian feeds · 1 unstable", "entity", "risk", 4, D("One feed is the root cause", "Why it matters: the same integration underlies both open escalations."), { linkedNodeIds: ["prd-opp-integration", "prd-health-integration"] })),
            s("constrains", "depends_on", n("del-atlas-custdeps", "Customer dependencies", "Data cleanse · 5 weeks late", "risk", "risk", 4, D("The customer is also late", "Why it matters: reference data cleansing was a customer obligation and has not been delivered."), { linkedNodeIds: ["del-con-customer"] })),
            s("puts at risk", "puts_at_risk", n("del-atlas-risks", "Risks", "Key-person dependency · effort overrun", "risk", "risk", 5, D("Two risks, one root", "Why it matters: both trace to the integration engineer shortage, so one fix addresses both."), { linkedNodeIds: ["del-con-keyperson"] })),
            s("gates", "blocks", n("del-atlas-golive", "Go-live", "31 Jan 2027 · moved once", "event", "risk", 5, D("A date that has already moved", "Why it matters: a second move would land inside the renewal notice window."), { linkedNodeIds: ["cus-northstar-renewal"] })),
            s("unlocks", "enables", n("del-atlas-billing", "Revenue activation", "£94k billing milestone at go-live", "entity", "risk", 5, D("Cash follows the go-live date", "Why it matters: two months of slippage moves £94k out of the financial year at a stage where runway is measured in months."), { linkedNodeIds: ["cap-rev-golive", "cap-fc-recognition"] })),
          ],
        },
      ),
      n(
        "del-bramwell-recovery",
        "Bramwell recovery programme",
        "Commercially sensitive project · retention-critical",
        "initiative",
        "critical",
        5,
        D(
          "Mobilised 9 days ago after the third repeat incident",
          "Why it matters: not a delivery programme in the normal sense — this exists to change the customer's mind before a competitive evaluation concludes.",
          {
            movement: "Root cause reopened · permanent fix scheduled for 26 Sept",
            recommendedAction:
              "Present a permanent fix with a named owner at the 2 September steering committee. A workaround will not hold.",
            owner: "CEO",
            dueDate: "2 Sept 2026",
            evidence: [E("Incident record", "Repeat classification and root-cause history", "Updated 9 days ago")],
          },
        ),
        {
          hot: true,
          constellationTitle: "Programme constellation",
          linkedNodeIds: ["cus-bramwell", "mkt-comp-strategic", "del-ops-repeat"],
          children: [
            s("delivers for", "generates", n("del-bramwell-commitment", "Customer commitment", "£150k recurring at risk", "entity", "critical", 5, D("The commitment is the relationship", "Why it matters: there is no new scope here, only trust to be rebuilt."), { linkedNodeIds: ["cus-bramwell"] })),
            s("requires", "requires", n("del-bramwell-team", "Team", "4 people · reassigned from other work", "entity", "watch", 4, D("Borrowed capacity", "Why it matters: every person on this programme was taken from another commitment."), { linkedNodeIds: ["del-con-overload", "org-team-imbalance"] })),
            s("gates", "blocks", n("del-bramwell-fix", "Permanent fix", "Scheduled 26 Sept", "initiative", "critical", 5, D("Third attempt at the same root cause", "Why it matters: two previous fixes closed the symptom rather than the cause."), { linkedNodeIds: ["prd-health-availability"] })),
            s("puts at risk", "puts_at_risk", n("del-bramwell-risks", "Risks", "Competitor evaluation concludes first", "risk", "critical", 5, D("A race, not a project", "Why it matters: the evaluation timetable is shorter than the fix timetable."), { linkedNodeIds: ["mkt-comp-strategic"] })),
            s("impacts", "influences", n("del-bramwell-revenue", "Revenue consequence", "£150k recurring · service credits issued", "entity", "critical", 5, D("Revenue at risk", "Why it matters: this is 8% of ARR at a company with fourteen months of runway."), { linkedNodeIds: ["cap-rev-atrisk"] })),
            s("requires", "requires", n("del-bramwell-steerco", "Steering committee", "2 Sept · executive attendance", "event", "critical", 5, D("The decisive meeting", "Why it matters: first executive contact since the third incident."), { linkedNodeIds: ["cus-ev-steerco"] })),
          ],
        },
      ),
      n(
        "del-kestrel-onboarding",
        "Kestrel Life onboarding",
        "Delayed project · first 90 days",
        "initiative",
        "risk",
        4,
        D(
          "Three weeks behind · UAT moved to 19 Sept",
          "Why it matters: a new customer's first experience of delivery. Data migration is the critical path and there is no float left in the plan.",
          {
            movement: "UAT sign-off moved from 29 Aug to 19 Sept",
            recommendedAction: "Add a data engineer this week rather than moving the date a second time.",
            owner: "Delivery Lead",
            dueDate: "19 Sept 2026",
          },
        ),
        {
          hot: true,
          constellationTitle: "Implementation constellation",
          linkedNodeIds: ["cus-kestrel", "del-con-data"],
          children: [
            s("delivers for", "generates", n("del-kestrel-commitment", "Customer commitment", "Kestrel Life · £96k recurring", "entity", "neutral", 4, D("Newly signed", "Why it matters: ninety days into a three-year term, in the window that sets retention behaviour."), { linkedNodeIds: ["cus-kestrel"] })),
            s("requires", "requires", n("del-kestrel-migration", "Data migration", "Critical path · 3 weeks late", "initiative", "risk", 4, D("Source data quality is worse than surveyed", "Why it matters: roughly 14% of records need manual remediation that was not scoped."), { linkedNodeIds: ["del-ops-dataquality"] })),
            s("requires", "requires", n("del-kestrel-team", "Team", "3 people · no data engineer assigned", "entity", "risk", 4, D("The missing skill is the critical path", "Why it matters: the remediation work needs a skill nobody on the programme has."), { linkedNodeIds: ["org-talent-vacancy"] })),
            s("gates", "blocks", n("del-kestrel-uat", "UAT", "19 Sept · already moved once", "event", "risk", 4, D("Sign-off gate", "Why it matters: go-live cannot move without it."), { linkedNodeIds: ["cus-ev-milestone"] })),
            s("unlocks", "enables", n("del-kestrel-billing", "Revenue activation", "£24k at go-live", "entity", "watch", 3, D("Billing follows sign-off", "Why it matters: a further slip moves the revenue a quarter."), { linkedNodeIds: ["cap-rev-golive"] })),
          ],
        },
      ),
      n("del-crit-golive", "Fenwick Trustees go-live", "Go-live imminent · 26 Sept", "initiative", "watch", 4, D("On plan, four weeks out", "Why it matters: the only large programme currently running to its original baseline — worth understanding why."), { linkedNodeIds: ["del-ev-golive"] }),
      n("del-crit-margin", "Apex fund services rollout", "Highest-margin programme · 46%", "initiative", "healthy", 3, D("The programme shape we want more of", "Why it matters: standard configuration, no bespoke development, repeatable — and twelve points above portfolio margin."), { linkedNodeIds: ["mkt-seg-fundservices", "cap-alloc-highreturn", "cus-apex"] }),
      n("del-crit-renewal", "Apex platform extension", "Renewal-exposed account", "initiative", "watch", 4, D("Delivery quality is the renewal argument", "Why it matters: the notice window opens 62 days before this completes."), { linkedNodeIds: ["cus-apex", "cus-ev-renewal"] }),
      n("del-crit-specialist", "US residency pilot", "Single-specialist dependency", "initiative", "risk", 3, D("One person, no backup", "Why it matters: the only engineer with the relevant regulatory experience, and they are also on Project Atlas."), { linkedNodeIds: ["del-con-keyperson", "prd-road-regulatory", "mkt-seg-usfintech"] }),
      n("del-crit-mobilisation", "Ostara Bank mobilisation", "Newly signed · awaiting mobilisation", "initiative", "watch", 3, D("Signed, unmobilised for five weeks", "Why it matters: no delivery lead has been assigned and nobody has noticed."), { linkedNodeIds: ["gro-ostara", "org-own-noowner"] }),
    ]),

    g("del-movement", "Delivery Movement", "what changed on the plans", [
      n("del-mv-golive", "Go-live moved", "3 programmes · £94k revenue deferred", "insight", "risk", 5, D("Three dates moved in one month", "Why it matters: all three trace to integration or data-migration capacity rather than to scope changes. This is a capacity decision, not a delivery performance issue.", { recommendedAction: "Fund the capacity rather than re-planning the dates.", evidence: [E("Programme plans", "Baseline versus current go-live dates", "Updated 3 hours ago")] }), { hot: true, linkedNodeIds: ["del-atlas", "del-kestrel-onboarding", "cap-rev-golive"] }),
      n("del-mv-milestone-hit", "Milestone achieved", "Fenwick environment review passed", "insight", "healthy", 2, D("Clean pass", "Why it matters: no conditions attached, on a programme with no capacity contention."), { linkedNodeIds: ["del-crit-golive"] }),
      n("del-mv-milestone-slip", "Milestone slipped", "Project Atlas integration testing · +3 weeks", "insight", "risk", 4, D("Second slip on the same milestone", "Why it matters: both slips have the same cause and neither was a surprise."), { linkedNodeIds: ["del-atlas"] }),
      n("del-mv-scope", "Scope change", "Ostara added a second entity", "insight", "watch", 3, D("Scope up before mobilisation", "Why it matters: the change was accepted before a delivery lead was assigned to assess it."), { linkedNodeIds: ["del-crit-mobilisation"] }),
      n("del-mv-dependency", "New dependency", "Kestrel · third-party data provider", "insight", "watch", 3, D("A dependency nobody owns", "Why it matters: introduced by the customer four weeks into the plan, with no contract and no service level."), { linkedNodeIds: ["del-con-thirdparty"] }),
      n("del-mv-approval", "Customer approval outstanding", "Northstar data cleanse · 5 weeks late", "insight", "risk", 4, D("The customer is late too", "Why it matters: a contractual customer obligation, unfulfilled, and we have not invoked it."), { linkedNodeIds: ["del-con-customer"] }),
      n("del-mv-effort", "Effort variance", "Project Atlas +18% against estimate", "insight", "risk", 4, D("Margin is being consumed by rework", "Why it matters: the variance is entirely in the integration workstream."), { linkedNodeIds: ["del-ops-margin", "cap-fc-margin"] }),
      n("del-mv-escalation", "Risk escalated", "Bramwell moved to executive oversight", "insight", "critical", 4, D("Escalated after the third repeat", "Why it matters: it should have been escalated after the second."), { linkedNodeIds: ["del-bramwell-recovery", "org-own-escalation"] }),
      n("del-mv-sla", "SLA degradation", "Reconciliation window missed twice", "insight", "risk", 4, D("Two misses in one quarter", "Why it matters: both at the same customer, and both inside a break-clause definition."), { linkedNodeIds: ["del-ops-sla"] }),
    ]),

    g("del-constraints", "Constraints", "what limits execution", [
      n("del-con-specialist", "Specialist capacity shortage", "2 integration engineers · 3 programmes", "risk", "critical", 5, D("Capacity is gating close · the binding constraint on the whole plan", "Why it matters: two people are named on the largest live implementation, the largest pipeline deal's mobilisation plan and the US residency pilot. Two of those three will be late.", { recommendedAction: "Approve two contract hires or explicitly choose which programme slips.", owner: "COO", dueDate: "15 Sept 2026", evidence: [E("Resource plan", "Named allocations across programmes", "Updated 3 hours ago")] }), { hot: true, linkedNodeIds: ["del-atlas", "gro-blk-capacity", "org-talent-key", "cap-alloc-hiring"] }),
      n("del-con-vacancy", "Critical vacancy", "Integration lead · open 14 weeks", "risk", "risk", 4, D("Fourteen weeks and two failed offers", "Why it matters: this is the role that would relieve the engineer constraint, and both declines cited compensation."), { linkedNodeIds: ["org-talent-vacancy", "cap-risk-unfunded"] }),
      n("del-con-data", "Data integration delay", "Kestrel migration · source quality", "risk", "risk", 4, D("Survey underestimated the problem", "Why it matters: about 14% of records require manual remediation that was not priced."), { linkedNodeIds: ["del-kestrel-onboarding"] }),
      n("del-con-customer", "Customer-side dependency", "Northstar data cleanse outstanding", "risk", "risk", 4, D("Contractual and unfulfilled", "Why it matters: five weeks late with no revised commitment and no escalation."), { linkedNodeIds: ["del-atlas"] }),
      n("del-con-thirdparty", "Third-party supplier dependency", "Kestrel data provider · unmanaged", "risk", "watch", 3, D("No contract, no service level", "Why it matters: introduced by the customer mid-plan and never formalised."), { linkedNodeIds: ["del-mv-dependency"] }),
      n("del-con-keyperson", "Key-person dependency", "One engineer holds US regulatory knowledge", "risk", "risk", 4, D("No documented backup", "Why it matters: the same person is required for the pilot and for two proposals."), { linkedNodeIds: ["del-crit-specialist", "org-talent-key", "prd-road-regulatory"] }),
      n("del-con-overload", "Concurrent delivery overload", "9 programmes · 6 delivery staff", "risk", "risk", 4, D("More programmes than owners", "Why it matters: three programmes share a delivery lead, and all three of those have slipped."), { linkedNodeIds: ["org-team-workload", "org-own-overloaded"] }),
      n("del-con-infra", "Infrastructure readiness", "US region environment not provisioned", "risk", "watch", 3, D("A prerequisite nobody has scheduled", "Why it matters: required before any US customer can go live."), { linkedNodeIds: ["prd-health-deployment", "mkt-seg-usfintech"] }),
      n("del-con-approval", "Security / regulatory approval", "Meridian environment sign-off pending", "risk", "watch", 3, D("Approval feeds the same review that blocks the deal", "Why it matters: one process, two consequences."), { linkedNodeIds: ["gro-blk-security", "prd-health-security"] }),
    ]),

    g("del-events", "Upcoming Delivery Events", "the delivery calendar", [
      n("del-ev-steerco", "Programme steering committee", "Bramwell recovery · 2 Sept", "event", "critical", 5, D("Retention decision point", "Why it matters: executive attendance on both sides, first since the third incident."), { linkedNodeIds: ["del-bramwell-recovery", "cus-ev-steerco"] }),
      n("del-ev-uat", "UAT", "Kestrel Life · 19 Sept", "event", "risk", 4, D("Already moved once", "Why it matters: a second move puts go-live into the next quarter and the revenue with it."), { linkedNodeIds: ["del-kestrel-onboarding"] }),
      n("del-ev-golive", "Go-live decision", "Fenwick Trustees · 26 Sept", "event", "watch", 4, D("On plan", "Why it matters: environment review already passed with no conditions."), { linkedNodeIds: ["del-crit-golive"] }),
      n("del-ev-migration", "Data migration", "Kestrel Life · 12–14 Sept", "event", "risk", 4, D("A fixed weekend window", "Why it matters: missing it costs a month."), { linkedNodeIds: ["del-con-data"] }),
      n("del-ev-milestone", "Contractual milestone", "Project Atlas integration sign-off · 30 Oct", "event", "risk", 5, D("Payment-triggering milestone", "Why it matters: £94k of billing depends on it."), { linkedNodeIds: ["del-atlas", "cap-rev-billing"] }),
      n("del-ev-envreview", "Environment review", "Meridian pre-mobilisation · 10 Oct", "event", "watch", 3, D("Conditional on the residency review", "Why it matters: cannot proceed until that review closes."), { linkedNodeIds: ["gro-blk-security"] }),
      n("del-ev-training", "Customer training", "Fenwick Trustees · 22 Sept", "event", "neutral", 2, D("Adoption groundwork", "Why it matters: delivered before go-live rather than after it, which is the pattern that correlates with adoption."), { linkedNodeIds: ["prd-adopt-retention"] }),
      n("del-ev-pir", "Post-implementation review", "Calder Flow Studio · 3 Oct", "event", "opportunity", 2, D("Reference material", "Why it matters: the source of the unpublished case study two live deals have asked for."), { linkedNodeIds: ["cus-exp-reference"] }),
    ]),

    g("del-oprisk", "Operational Risk", "where service quality is exposed", [
      n("del-ops-repeat", "Repeat support issue", "Bramwell reconciliation defect · 3 occurrences", "risk", "critical", 5, D("The same defect three times in 90 days", "Why it matters: closed twice without a permanent fix. The pattern has done more damage to the relationship than any single outage.", { recommendedAction: "Permanent fix with a named engineering owner, presented to the customer on 2 September.", owner: "CTO", evidence: [E("Incident record", "Repeat classification", "Updated 9 days ago")] }), { linkedNodeIds: ["cus-bramwell", "del-bramwell-recovery", "prd-health-availability"] }),
      n("del-ops-sla", "SLA breach", "Reconciliation window missed twice", "risk", "critical", 4, D("Contractually significant", "Why it matters: both misses fall inside the Bramwell break-clause definition."), { linkedNodeIds: ["cus-bramwell-contract"] }),
      n("del-ops-incident", "Critical incident", "Regional latency event · 4 hours", "risk", "watch", 3, D("Resolved, root cause open", "Why it matters: affected three customers, none escalated — this time."), { linkedNodeIds: ["prd-health-latency"] }),
      n("del-ops-escalation", "Customer escalation", "2 open at executive level", "risk", "risk", 4, D("Both at the same account", "Why it matters: both trace to one integration on our largest customer."), { linkedNodeIds: ["cus-northstar", "del-atlas"] }),
      n("del-ops-margin", "Delivery margin erosion", "34% against a 38% target", "insight", "risk", 4, D("Rework, not pricing", "Why it matters: the gap is almost entirely effort variance on two programmes."), { linkedNodeIds: ["cap-fc-margin", "del-mv-effort"] }),
      n("del-ops-complexity", "Non-standard implementation complexity", "3 programmes with bespoke scope", "risk", "watch", 3, D("Bespoke work carries the margin loss", "Why it matters: all three sit below the portfolio margin average, and we keep accepting it."), { linkedNodeIds: ["cap-alloc-deliverycost", "prd-opp-reusable"] }),
      n("del-ops-compliance", "Compliance exception", "One environment outside standard controls", "risk", "watch", 3, D("Granted as a temporary exception 7 months ago", "Why it matters: the temporary arrangement has no end date and the certification audit is due."), { linkedNodeIds: ["prd-health-security", "org-dec-policy"] }),
      n("del-ops-dataquality", "Data-quality risk", "Kestrel source records · 14% remediation", "risk", "risk", 3, D("Discovered after contract", "Why it matters: the survey understated the remediation effort and the cost is ours."), { linkedNodeIds: ["del-con-data", "prd-health-freshness"] }),
    ]),
  ],
);
