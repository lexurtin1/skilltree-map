import { D, E, defineDomain, g, n, s } from "../build";

/**
 * Capital — economics, investment, runway.
 * Demo data. Figures are illustrative and deliberately generic.
 */
export const capital = defineDomain(
  "capital",
  D(
    "£2.1m cash · 14 months of runway · £480k uncommitted",
    "Why it matters: the economics are sound and the allocation is not. Uncommitted investment capacity is sitting idle while four cases wait, and £94k of contracted revenue has slipped out of the year on a capacity shortage that costs £48k to fix.",
    {
      movement: "Delivery margin −4 points · discount depth +5 points · £94k revenue deferred",
      recommendedAction:
        "Allocate the uncommitted £480k at the 8 September leadership meeting. Deferring the allocation is itself an allocation.",
      metrics: [
        { label: "Cash", value: "£2.1m", tone: "healthy" },
        { label: "Runway", value: "14 months", delta: "−2 months QoQ", tone: "watch" },
        { label: "Uncommitted", value: "£480k", tone: "opportunity" },
        { label: "Revenue deferred", value: "£94k", tone: "risk" },
      ],
    },
  ),
  [
    g("cap-revenue", "Revenue Reality", "where the money actually comes from", [
      n(
        "cap-rev-largest",
        "Northstar Financial revenue stream",
        "Largest revenue contributor · £420k",
        "entity",
        "watch",
        5,
        D(
          "£420k recurring · 22% of ARR",
          "Why it matters: this single account funds roughly three months of payroll. It is commercially healthy, relationally unsponsored, and carries an indexed uplift decision in November.",
          {
            movement: "Flat QoQ · delivery margin on it down 7 points",
            recommendedAction: "Protect it with a named sponsor before the uplift conversation.",
            owner: "CEO",
            metrics: [
              { label: "Recurring", value: "£420k", delta: "flat QoQ", tone: "watch" },
              { label: "Share of ARR", value: "22%", tone: "risk" },
              { label: "Delivery margin", value: "31%", delta: "−7pts", tone: "risk" },
            ],
            evidence: [E("Finance", "Revenue by account", "Updated 4 hours ago")],
          },
        ),
        {
          constellationTitle: "Revenue constellation",
          linkedNodeIds: ["cus-northstar", "del-atlas", "cap-risk-concentration"],
          children: [
            s("generates", "generates", n("cap-rev-largest-customer", "Customer", "Northstar Financial", "entity", "watch", 5, D("Our anchor reference", "Why it matters: the account every investor asks about in diligence."), { linkedNodeIds: ["cus-northstar"] })),
            s("defines", "requires", n("cap-rev-largest-contract", "Contract", "3-year term · indexed uplift · renews Mar 2027", "entity", "neutral", 4, D("Uplift falls due in November", "Why it matters: a contractual right worth £34k and a relationship risk at the same time."), { linkedNodeIds: ["cus-northstar-contract", "org-dec-customer"] })),
            s("defines", "requires", n("cap-rev-largest-billing", "Billing schedule", "Quarterly in advance · £94k milestone at go-live", "entity", "risk", 5, D("Cash timing is gated by delivery", "Why it matters: the milestone moved two months when the go-live moved."), { linkedNodeIds: ["cap-rev-billing"] })),
            s("depends on", "depends_on", n("cap-rev-largest-delivery", "Usage & delivery dependencies", "Project Atlas · 88% adoption", "entity", "risk", 4, D("Adoption strong, delivery late", "Why it matters: the revenue is safe; the timing is not."), { linkedNodeIds: ["del-atlas"] })),
            s("supports", "contributes_to", n("cap-rev-largest-forecast", "Forecast", "£420k held · £94k reclassified to Q1", "insight", "risk", 4, D("A forecast that moved without a lost deal", "Why it matters: almost all of the guidance cut is timing, not loss."), { linkedNodeIds: ["cap-fc-recognition"] })),
            s("increases", "influences", n("cap-rev-largest-costs", "Costs", "£178k delivery cost to serve", "entity", "watch", 4, D("Cost to serve is rising", "Why it matters: effort variance on Project Atlas is being absorbed, not billed."), { linkedNodeIds: ["cap-alloc-deliverycost"] })),
            s("supports", "contributes_to", n("cap-rev-largest-margin", "Margin", "31% against a 38% target", "insight", "risk", 4, D("Seven points below target on our largest account", "Why it matters: the gap is rework, not pricing."), { linkedNodeIds: ["cap-fc-margin"] })),
            s("extends", "enables", n("cap-rev-largest-runway", "Cash & runway impact", "≈3 months of payroll", "insight", "watch", 5, D("Concentration expressed as time", "Why it matters: losing this account costs a quarter of the runway."), { linkedNodeIds: ["cap-run-cash", "cap-risk-concentration"] })),
            s("puts at risk", "puts_at_risk", n("cap-rev-largest-risks", "Risks & decision points", "Sponsor vacancy · uplift decision", "risk", "risk", 5, D("Decision required", "Why it matters: both open items land in the same quarter."), { linkedNodeIds: ["cus-risk-sponsor", "org-dec-customer"] })),
          ],
        },
      ),
      n("cap-rev-atrisk", "Revenue at risk", "£310k across two accounts", "risk", "critical", 5, D("Revenue at risk · 16% of ARR in play", "Why it matters: £150k in a live competitive evaluation and £160k exposed to an unsponsored relationship. At fourteen months of runway this is the difference between raising on strength and raising on need.", { movement: "+£150k this quarter", recommendedAction: "Recovery plan on 2 September and a named sponsor on the largest account this week.", owner: "CEO", evidence: [E("Finance", "Revenue at risk analysis", "Updated 4 hours ago")] }), { hot: true, linkedNodeIds: ["cus-bramwell", "cus-risk-sponsor", "del-bramwell-recovery"] }),
      n("cap-rev-golive", "Revenue awaiting go-live", "£186k contracted, not yet live", "insight", "risk", 5, D("Revenue we have sold and cannot yet recognise", "Why it matters: £94k of it moved out of the year this month on a capacity shortage that costs £48k to fix.", { recommendedAction: "Fund the capacity cover and re-baseline the affected milestones.", owner: "CFO" }), { hot: true, linkedNodeIds: ["del-mv-golive", "del-atlas", "cap-alloc-hiring"] }),
      n("cap-rev-concentration", "Revenue concentration risk", "Top 5 accounts carry 62%", "insight", "risk", 4, D("Structural concentration", "Why it matters: two of the top five carry active retention risk, and diligence will ask about exactly this."), { linkedNodeIds: ["cap-risk-concentration", "cap-fund-diligence"] }),
      n("cap-rev-fastest", "Fastest-growing revenue source", "Calder Wealth · +64% YoY", "insight", "opportunity", 4, D("Growth outrunning the contract", "Why it matters: it is being billed as overage rather than committed, which understates ARR in a fundraising year."), { linkedNodeIds: ["cus-calder", "prd-opp-packaging", "cap-fund-readiness"] }),
      n("cap-rev-belowplan", "Revenue below plan", "Expansion revenue · 41% of target", "insight", "risk", 4, D("Behind, with a known cause", "Why it matters: the shortfall sits entirely in an initiative that has no owner."), { linkedNodeIds: ["org-own-noowner", "cap-fc-coverage"] }),
      n("cap-rev-billing", "Revenue awaiting billing", "£94k milestone not yet invoiced", "insight", "risk", 4, D("Work done, cash not requested", "Why it matters: the milestone is contractual and the trigger moved with the go-live date."), { linkedNodeIds: ["del-ev-milestone", "cap-risk-invoicing"] }),
      n("cap-rev-retention", "Retention opportunity", "Net retention 104% · a point is worth £19k", "insight", "opportunity", 3, D("Retention moves the number faster than new business", "Why it matters: fourteen points of lost net retention is worth more than the entire quarter's new-logo target."), { linkedNodeIds: ["cus-risk-adoption", "prd-adopt-cohort"] }),
    ]),

    g("cap-forecast", "Forecast Movement", "what changed in the numbers", [
      n("cap-fc-margin", "Margin deterioration", "Delivery margin 34% against 38%", "insight", "risk", 5, D("Four points of margin lost to rework and bespoke scope", "Why it matters: the gap is not pricing. Two programmes with effort overruns and three with bespoke scope account for almost all of it, and both patterns are avoidable.", { movement: "Down 4 points over the year", recommendedAction: "Price bespoke scope at a premium or decline it, and fix the capacity shortage driving the rework.", owner: "CFO", evidence: [E("Finance", "Programme margin by engagement", "Updated last week"), E("Timesheets", "Effort against estimate", "Updated last week")] }), { linkedNodeIds: ["del-ops-margin", "del-mv-effort", "cap-alloc-deliverycost"] }),
      n("cap-fc-increase", "Forecast increase", "Calder Tier 2 raised to 85% · +£26k weighted", "insight", "opportunity", 3, D("Momentum improving", "Why it matters: raised on a sponsor commitment rather than optimism."), { linkedNodeIds: ["gro-calder-tier2"] }),
      n("cap-fc-reduction", "Forecast reduction", "Full-year guidance cut £160k", "insight", "risk", 4, D("The cut is almost entirely deferral", "Why it matters: very little of it is lost business; most is timing we control."), { linkedNodeIds: ["cap-rev-golive", "gro-mv-closedate"] }),
      n("cap-fc-coverage", "Pipeline coverage gap", "1.45x against a 3x target", "insight", "risk", 5, D("Coverage is thin where it matters", "Why it matters: 44% of the weighted number sits in three deals, two of which are externally blocked."), { linkedNodeIds: ["gro-meridian", "gro-thornbury", "cap-rev-belowplan"] }),
      n("cap-fc-dealmoved", "Material deal moved", "£240k pushed out of quarter", "insight", "risk", 4, D("Third consecutive month of slippage", "Why it matters: the same two deals have moved each month."), { linkedNodeIds: ["gro-thornbury", "gro-mv-closedate"] }),
      n("cap-fc-recognition", "Revenue-recognition delay", "£94k reclassified to Q1", "insight", "risk", 4, D("Recognition follows go-live", "Why it matters: two months of delivery slippage moves the revenue across the year end."), { linkedNodeIds: ["del-atlas-billing", "cap-risk-recognition"] }),
      n("cap-fc-budget", "Budget variance", "Contractor spend +£62k against plan", "insight", "watch", 3, D("Covering a capacity gap inefficiently", "Why it matters: ad-hoc contractor spend is costing more than the planned cover would."), { linkedNodeIds: ["cap-alloc-hiring"] }),
      n("cap-fc-cash", "Cash forecast change", "Runway 14 months, down from 16", "insight", "watch", 4, D("Two months of runway lost in a quarter", "Why it matters: mostly deferred collections rather than overspend, which makes it recoverable."), { linkedNodeIds: ["cap-run-cash", "cap-risk-invoicing"] }),
      n("cap-fc-confidence", "Reduced scenario confidence", "Thornbury still forecast at 70%", "insight", "risk", 3, D("Evidence incomplete", "Why it matters: a stalled deal with no champion and no activity should not survive the 26 September review at that probability."), { linkedNodeIds: ["gro-thornbury", "gro-ev-review"] }),
    ]),

    g("cap-allocation", "Capital Allocation", "where the next pound goes", [
      n(
        "cap-alloc-awaiting",
        "Investment case awaiting approval",
        "4 open cases · £560k against £480k uncommitted",
        "decision",
        "critical",
        5,
        D(
          "Decision required · the allocation behind almost every other blockage on this map",
          "Why it matters: four investment cases are open. Together they cost slightly more than the uncommitted budget, so this is a genuine choice — but three of the four unblock commitments we have already made rather than funding new ambition.",
          {
            movement: "All four open longer than a month",
            recommendedAction:
              "Take capacity cover and guided activation immediately; make the US residency decision explicitly rather than by deferral.",
            owner: "CFO",
            dueDate: "8 Sept 2026",
            metrics: [
              { label: "Open cases", value: "4", tone: "critical" },
              { label: "Requested", value: "£560k", tone: "neutral" },
              { label: "Uncommitted", value: "£480k", tone: "opportunity" },
            ],
            evidence: [E("Finance", "Investment case register", "Updated last week")],
          },
        ),
        {
          hot: true,
          constellationTitle: "Allocation constellation",
          linkedNodeIds: ["prd-road-regulatory", "org-dec-overdue", "cap-run-uncommitted"],
          children: [
            s("funds", "enables", n("cap-alloc-awaiting-capacity", "Capacity cover", "£48k · recovers £94k deferred revenue", "decision", "critical", 5, D("Highest return, lowest cost", "Why it matters: there is no argument against this one and it has been open five weeks."), { linkedNodeIds: ["cap-alloc-hiring"] })),
            s("funds", "enables", n("cap-alloc-awaiting-activation", "Guided activation", "£40k · proven adoption lift", "decision", "opportunity", 4, D("Measured, small, fast", "Why it matters: it extends a pilot that already moved adoption four points."), { linkedNodeIds: ["prd-road-investment"] })),
            s("funds", "enables", n("cap-alloc-awaiting-us", "US residency build", "£260k · opens a £58m segment", "decision", "critical", 5, D("The genuine strategic choice", "Why it matters: everything else here is housekeeping by comparison."), { linkedNodeIds: ["prd-road-regulatory", "org-own-founder"] })),
            s("funds", "enables", n("cap-alloc-awaiting-platform", "Platform hardening", "£212k · reliability below commitment", "decision", "watch", 4, D("Deferrable, but not indefinitely", "Why it matters: availability is already below the contractual level."), { linkedNodeIds: ["cap-alloc-product"] })),
            s("validates", "validates", n("cap-alloc-awaiting-budget", "Budget", "£480k uncommitted this year", "entity", "opportunity", 5, D("Capacity sitting idle", "Why it matters: nothing is being traded off; the decisions simply have not been taken."), { linkedNodeIds: ["cap-run-uncommitted"] })),
            s("puts at risk", "puts_at_risk", n("cap-alloc-awaiting-cost", "Cost of deferral", "£94k deferred · 4 branches blocked", "risk", "critical", 5, D("Deferral has a running price", "Why it matters: each month of delay costs more than three of the four cases individually."), { linkedNodeIds: ["cap-rev-golive"] })),
          ],
        },
      ),
      n("cap-alloc-highreturn", "Highest-return initiative", "Existing-customer expansion · £0.09 per £1", "insight", "opportunity", 4, D("The cheapest revenue available", "Why it matters: portfolio and expansion routes cost roughly a third of outbound and produced 14% of pipeline."), { linkedNodeIds: ["gro-route-expansion", "gro-route-pe", "del-crit-margin"] }),
      n("cap-alloc-lowreturn", "Low-return spend area", "US campaign · £68k committed, 1 opportunity", "insight", "risk", 4, D("Spending to create demand we cannot serve", "Why it matters: 34 accounts are engaged with content for a capability that does not exist."), { linkedNodeIds: ["gro-route-campaign", "mkt-comp-pricing", "cap-alloc-awaiting"] }),
      n("cap-alloc-product", "Product investment tied to revenue", "Platform hardening · £212k", "decision", "watch", 4, D("Reliability is a retention line, not an engineering line", "Why it matters: availability is below the contractual commitment at the account we are trying to retain."), { linkedNodeIds: ["prd-road-debt", "prd-health-availability"] }),
      n("cap-alloc-hiring", "Hiring investment tied to capacity", "Contract integration cover · £48k", "decision", "critical", 5, D("Decision required · £48k standing in front of £94k", "Why it matters: the smallest investment on the map and the one with the clearest return. It unblocks three programmes and recovers deferred revenue inside the year."), { linkedNodeIds: ["org-own-decision-pending", "del-con-specialist", "cap-rev-golive"] }),
      n("cap-alloc-infra", "Infrastructure cost / utilisation", "Peak load at 61% · US region unprovisioned", "insight", "watch", 3, D("Comfortable here, absent there", "Why it matters: no capacity spend is needed in the current region and none is planned for the one we want to enter."), { linkedNodeIds: ["prd-health-capacity", "prd-health-deployment", "cap-risk-infra"] }),
      n("cap-alloc-deliverycost", "Customer delivery cost", "Cost to serve +14% on bespoke programmes", "insight", "risk", 4, D("Bespoke work carries the margin loss", "Why it matters: every below-target programme this year contained bespoke scope, and we keep accepting it."), { linkedNodeIds: ["del-ops-complexity", "prd-opp-reusable", "cap-fc-margin"] }),
      n("cap-alloc-buildbuy", "Build versus buy case", "Data enrichment · build £180k or partner £45k", "decision", "neutral", 3, D("Evidence incomplete", "Why it matters: deferred twice for want of a two-day partner evaluation."), { linkedNodeIds: ["prd-road-buildbuy", "org-dec-evidence"] }),
      n("cap-alloc-security", "Compliance capacity investment", "£32k · relieve a 0.5 FTE function", "decision", "watch", 4, D("A small function gating a large deal", "Why it matters: the certification audit, customer reviews and the open exception all sit with the same part-time resource."), { linkedNodeIds: ["org-talent-role", "prd-health-security", "gro-blk-security"] }),
    ]),

    g("cap-runway", "Runway and Funding", "how much time the plan has", [
      n("cap-run-cash", "Cash runway", "£2.1m · 14 months at current burn", "insight", "watch", 5, D("Fourteen months, down from sixteen", "Why it matters: nothing on this map is limited by cash today. Several things are limited by allocation, and the runway is what converts a deferred decision into an expensive one.", { movement: "Monthly burn £150k · two months of runway lost this quarter", recommendedAction: "Recover the deferred collections before treating this as a fundraising problem.", owner: "CFO", metrics: [{ label: "Cash", value: "£2.1m", tone: "healthy" }, { label: "Runway", value: "14 months", delta: "−2", tone: "watch" }, { label: "Monthly burn", value: "£150k", tone: "neutral" }] }), { hot: true, linkedNodeIds: ["cap-fc-cash", "cap-fund-milestone", "cap-risk-invoicing"] }),
      n(
        "cap-fund-milestone",
        "Series Seed Readiness",
        "Funding milestone · board decision 9 Oct",
        "initiative",
        "critical",
        5,
        D(
          "£6m seed extension · raise before or after the US decision",
          "Why it matters: raising before the US residency decision means selling a plan. Raising after means selling a proof point, with four months less runway. That sequencing is the single highest-leverage decision open to the board.",
          {
            movement: "Two funds in early conversation · anchor design partner informal",
            recommendedAction:
              "Take the US investment decision on 30 September so the raise on 9 October has a story rather than a question.",
            owner: "CEO",
            dueDate: "9 Oct 2026",
            metrics: [
              { label: "Target", value: "£6m", tone: "opportunity" },
              { label: "Runway at close", value: "10 months", tone: "watch" },
              { label: "Readiness gaps", value: "3", tone: "risk" },
            ],
            evidence: [
              E("Finance", "Data room readiness checklist", "Updated last week"),
              E("Board pack", "Raise sequencing options", "Updated 2 weeks ago"),
            ],
          },
        ),
        {
          hot: true,
          constellationTitle: "Funding constellation",
          linkedNodeIds: ["org-dec-board", "mkt-seg-usfintech", "cap-run-cash"],
          children: [
            s("generates", "generates", n("cap-fund-milestone-investor", "Investor", "Two funds in early conversation", "entity", "watch", 4, D("Warm, not committed", "Why it matters: neither has seen a data room and both know the sector."), { linkedNodeIds: ["cap-fund-investor", "mkt-eco-vc"] })),
            s("defines", "requires", n("cap-fund-milestone-round", "Funding round", "£6m seed extension · priced", "entity", "watch", 5, D("Sized against the US plan", "Why it matters: the round only makes sense if the segment entry is funded."))),
            s("validates", "validates", n("cap-fund-milestone-anchor", "Anchor design partner", "Calder Wealth US entity · LOI unsigned", "opportunity", "opportunity", 5, D("The proof point the round needs", "Why it matters: an existing customer opening a US entity is the cheapest possible validation of the segment thesis, and the letter of intent has not been asked for."), { linkedNodeIds: ["cap-fund-anchor", "cus-exp-geo"] })),
            s("supports", "contributes_to", n("cap-fund-milestone-metrics", "Forecast & metrics", "104% NRR · 44% segment win rate", "insight", "watch", 4, D("A mixed metric story", "Why it matters: win rate is strong, net retention has fallen fourteen points and diligence will find it."), { linkedNodeIds: ["cap-fund-readiness", "cap-rev-retention"] })),
            s("extends", "enables", n("cap-fund-milestone-runway", "Cash & runway impact", "14 months now · 10 at close", "insight", "risk", 5, D("The clock inside the decision", "Why it matters: every month of deferral is a month of leverage lost in the negotiation."), { linkedNodeIds: ["cap-run-cash"] })),
            s("requires", "requires", n("cap-fund-milestone-diligence", "Diligence requirement", "Concentration · retention · certification", "risk", "risk", 4, D("Three questions we cannot yet answer well", "Why it matters: all three are visible elsewhere on this map today."), { linkedNodeIds: ["cap-fund-diligence", "cap-risk-concentration"] })),
            s("puts at risk", "puts_at_risk", n("cap-fund-milestone-risks", "Risks & decision points", "Raise sequencing · US decision", "decision", "critical", 5, D("Decision required", "Why it matters: the two decisions are the same decision taken in a different order."), { linkedNodeIds: ["org-dec-board", "cap-alloc-awaiting"] })),
          ],
        },
      ),
      n("cap-fund-anchor", "Anchor design partner / LOI", "Calder Wealth US entity · unsigned", "opportunity", "opportunity", 4, D("Expansion route identified · the cheapest validation available", "Why it matters: an existing customer opening a US entity anyway would anchor the segment thesis, and nobody has asked them for a letter of intent."), { linkedNodeIds: ["cus-exp-geo", "prd-opp-codesign", "cap-fund-milestone"] }),
      n("cap-fund-investor", "Investor relationship", "Two funds · four months warm", "entity", "watch", 3, D("Early and untested", "Why it matters: neither has seen the numbers and both have portfolio companies in our target segment."), { linkedNodeIds: ["mkt-eco-vc"] }),
      n("cap-fund-readiness", "Fundraising readiness gap", "3 open items in the data room", "risk", "risk", 4, D("Evidence incomplete", "Why it matters: concentration, net retention and certification are all live issues on this map and all three will be asked about."), { linkedNodeIds: ["cap-rev-concentration", "cap-rev-retention", "prd-health-security"] }),
      n("cap-fund-scenario", "Funding scenario", "Raise now, raise post-decision, or bridge", "decision", "watch", 4, D("Three options, one clock", "Why it matters: the bridge option preserves optionality and costs the most."), { linkedNodeIds: ["org-dec-board", "cap-run-cash"] }),
      n("cap-fund-meeting", "Investor meeting", "Lead fund partner session · 25 Sept", "event", "watch", 4, D("Before the board, after the US decision", "Why it matters: the sequencing only works if 30 September moves to before this date."), { linkedNodeIds: ["cap-fund-milestone", "org-dec-investment"] }),
      n("cap-fund-diligence", "Diligence requirement", "Customer concentration disclosure", "risk", "watch", 4, D("The question we will be asked first", "Why it matters: 62% in five accounts with two carrying retention risk."), { linkedNodeIds: ["cap-risk-concentration", "cap-rev-atrisk"] }),
      n("cap-run-uncommitted", "Uncommitted capacity", "£480k unallocated this year", "opportunity", "opportunity", 5, D("Idle capacity while four decisions wait", "Why it matters: the open investment cases total roughly the uncommitted budget, so nothing is being traded off — the decisions simply have not been taken."), { linkedNodeIds: ["cap-alloc-awaiting", "org-dec-overdue"] }),
    ]),

    g("cap-risk", "Financial Risk", "what could break the model", [
      n("cap-risk-concentration", "Customer concentration", "Top 5 accounts carry 62% of ARR", "risk", "risk", 5, D("Structural, disclosed, and about to be diligenced", "Why it matters: two of the top five carry active retention risk, and losing the largest costs a quarter of the runway."), { linkedNodeIds: ["cap-rev-concentration", "cap-fund-diligence", "cus-northstar"] }),
      n("cap-risk-renewal", "Contract renewal exposure", "£360k renewing within 12 months", "risk", "risk", 4, D("Revenue at risk on dates we already know", "Why it matters: two of the three renewals have an open adoption or sponsorship issue against them."), { linkedNodeIds: ["cus-apex", "cus-bramwell", "prd-adopt-cohort"] }),
      n("cap-risk-overrun", "Cost overrun", "Project Atlas effort +18%", "risk", "risk", 4, D("Absorbed, not billed", "Why it matters: the overrun is entirely in the integration workstream and entirely our cost."), { linkedNodeIds: ["del-mv-effort", "cap-fc-margin"] }),
      n("cap-risk-unfunded", "Unfunded hiring plan", "Integration lead · band below market", "risk", "risk", 4, D("A plan that cannot be executed at the funded band", "Why it matters: two offers have been declined on compensation and the band has not moved."), { linkedNodeIds: ["org-talent-vacancy", "org-talent-hiring", "cap-alloc-hiring"] }),
      n("cap-risk-margin", "Margin pressure", "Discount depth 12%, up from 7%", "insight", "risk", 4, D("Discipline is slipping", "Why it matters: five points of discount across new business is worth more than the entire uncommitted budget, and most is granted late to recover slipped timelines."), { linkedNodeIds: ["mkt-comp-pricing", "gro-blk-pricing", "org-dec-bottleneck"] }),
      n("cap-risk-invoicing", "Delayed invoicing", "£94k milestone uninvoiced · DSO 47 days", "risk", "risk", 4, D("Cash we have earned and not asked for", "Why it matters: two months of runway were lost to collections timing rather than overspend."), { linkedNodeIds: ["cap-rev-billing", "cap-fc-cash"] }),
      n("cap-risk-recognition", "Revenue-recognition uncertainty", "£94k across the year end", "risk", "watch", 4, D("Recognition follows go-live", "Why it matters: a second delivery slip moves it into the next financial year entirely."), { linkedNodeIds: ["cap-fc-recognition", "del-atlas-golive"] }),
      n("cap-risk-infra", "Infrastructure capital requirement", "US region provisioning · £34k", "risk", "watch", 3, D("Small, unscheduled, and a hard prerequisite", "Why it matters: no US customer can go live without it and it is on nobody's plan."), { linkedNodeIds: ["prd-health-deployment", "cap-alloc-infra"] }),
    ]),
  ],
);
