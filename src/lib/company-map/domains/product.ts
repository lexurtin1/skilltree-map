import { D, E, defineDomain, g, n, s } from "../build";

/**
 * Product — adoption, differentiation, readiness.
 * Demo data. Figures are illustrative and deliberately generic.
 */
export const product = defineDomain(
  "product",
  D(
    "Five modules · 71% average adoption of licensed scope",
    "Why it matters: one module carries the platform and every material relationship. The strategic module that should be carrying growth is licensed by three times as many customers as actually use it, and the capability that opens the fastest-growing segment does not exist yet.",
    {
      movement: "Attach rate 2.1 modules per account, flat for four quarters",
      recommendedAction:
        "Decide the US residency question this quarter. It gates a segment, a roadmap and the largest deal simultaneously.",
      metrics: [
        { label: "Modules", value: "5", tone: "neutral" },
        { label: "Average adoption", value: "71%", delta: "−3pts", tone: "watch" },
        { label: "Attach rate", value: "2.1", delta: "flat", tone: "watch" },
        { label: "Licensed but unused", value: "£180k", tone: "opportunity" },
      ],
    },
  ),
  [
    g("prd-adoption", "Product Adoption", "what customers actually use", [
      n(
        "prd-signal-core",
        "Signal Core",
        "Most adopted module · 94% of accounts",
        "entity",
        "healthy",
        5,
        D(
          "The module the company runs on",
          "Why it matters: licensed by almost every customer and genuinely used by almost all of them. It is also the single point of concentration — every material relationship depends on it working, and the Bramwell defect lives here.",
          {
            movement: "Adoption stable · support burden 62% of all tickets",
            recommendedAction:
              "Protect reliability investment here ahead of new module work. Concentration is the risk, not adoption.",
            owner: "CTO",
            metrics: [
              { label: "Account coverage", value: "94%", tone: "healthy" },
              { label: "Daily active use", value: "88%", tone: "healthy" },
              { label: "Share of support load", value: "62%", tone: "watch" },
            ],
            evidence: [E("Telemetry", "Module usage by account", "Updated 2 hours ago")],
          },
        ),
        {
          hot: true,
          constellationTitle: "Module constellation",
          linkedNodeIds: ["cus-northstar", "cus-bramwell", "prd-health-availability"],
          children: [
            s("adopts", "uses", n("prd-signal-cohorts", "Customer cohorts", "94% of accounts · 5 of the top 6", "entity", "healthy", 5, D("Universal adoption", "Why it matters: every top-six account depends on it, which is both the moat and the exposure."))),
            s("adopts", "uses", n("prd-signal-usage", "Usage and adoption", "88% daily active · stable", "insight", "healthy", 4, D("Behaviour is habitual", "Why it matters: daily use rather than periodic use is what makes it hard to displace."))),
            s("monetises", "generates", n("prd-signal-revenue", "Revenue impact", "£1.16m of recurring revenue", "entity", "healthy", 5, D("60% of the book", "Why it matters: concentration is a strength commercially and a risk operationally."), { linkedNodeIds: ["cap-rev-largest"] })),
            s("supports", "influences", n("prd-signal-support", "Support signals", "62% of tickets · 1 repeat defect", "risk", "risk", 4, D("Support load follows usage", "Why it matters: the Bramwell reconciliation defect sits in this module and has recurred three times."), { linkedNodeIds: ["del-ops-repeat", "prd-adopt-support"] })),
            s("improves", "contributes_to", n("prd-signal-requests", "Product requests", "14 tickets asking for the same export", "insight", "opportunity", 3, D("A clear, repeated ask", "Why it matters: not currently on the roadmap despite appearing in fourteen tickets this quarter."), { linkedNodeIds: ["prd-mv-request", "prd-road-pattern"] })),
            s("requires", "requires", n("prd-signal-roadmap", "Roadmap items", "Reliability hardening · Q4", "initiative", "watch", 4, D("Competing with new-module work", "Why it matters: both cannot be funded at current headcount."), { linkedNodeIds: ["prd-road-debt", "cap-alloc-product"] })),
            s("depends on", "depends_on", n("prd-signal-platform", "Platform dependencies", "Custodian feeds · reconciliation engine", "entity", "watch", 4, D("Three feeds, one unstable", "Why it matters: the unstable feed is also the root cause of the Project Atlas escalations."), { linkedNodeIds: ["prd-health-integration"] })),
            s("differentiates against", "competes_with", n("prd-signal-competitive", "Competitive relevance", "Reconciliation accuracy under load", "opportunity", "opportunity", 3, D("Our one verified differentiator", "Why it matters: independently benchmarked and cited in exactly one deal this year."), { linkedNodeIds: ["prd-opp-differentiated", "mkt-comp-proof"] })),
          ],
        },
      ),
      n(
        "prd-insight",
        "Insight Analytics",
        "Low-adoption strategic product · 34% of licensed accounts",
        "entity",
        "watch",
        5,
        D(
          "£180k licensed and unused",
          "Why it matters: it sells well and lands badly. Nine accounts have paid for it, three use it, and the difference is almost entirely activation effort rather than product capability. Every one of those nine has a renewal inside eighteen months.",
          {
            movement: "Momentum improving · adoption +4 points since the guided activation pilot",
            recommendedAction:
              "Make guided activation the default before the 3.0 launch, or the launch will add licences without adding usage.",
            owner: "CTO",
            dueDate: "24 Sept 2026",
            metrics: [
              { label: "Licensed accounts", value: "9", tone: "neutral" },
              { label: "Active accounts", value: "3", tone: "risk" },
              { label: "Unused licence value", value: "£180k", tone: "opportunity" },
            ],
            evidence: [
              E("Telemetry", "Activation and usage by account", "Updated 2 hours ago"),
              E("CS notes", "Activation pilot results", "Updated 3 weeks ago"),
            ],
          },
        ),
        {
          hot: true,
          constellationTitle: "Module constellation",
          linkedNodeIds: ["cus-exp-crosssell", "prd-opp-segment", "gro-calder-tier2"],
          children: [
            s("adopts", "uses", n("prd-insight-cohorts", "Customer cohorts", "9 licensed · 3 active", "entity", "risk", 4, D("A two-thirds activation gap", "Why it matters: six accounts pay for something they have never switched on."), { linkedNodeIds: ["prd-adopt-cohort"] })),
            s("adopts", "uses", n("prd-insight-usage", "Usage and adoption", "11-day median time to first value", "insight", "risk", 4, D("Activation friction is the real product problem", "Why it matters: median time to first value is four times that of Signal Core."))),
            s("monetises", "generates", n("prd-insight-revenue", "Revenue impact", "£275k licensed · £180k unused", "entity", "watch", 4, D("Revenue without value", "Why it matters: renewal exposure is concentrated in the unused licences."), { linkedNodeIds: ["cap-risk-renewal"] })),
            s("supports", "influences", n("prd-insight-support", "Support signals", "9% of tickets · low because usage is low", "insight", "neutral", 2, D("A misleading metric", "Why it matters: few tickets because few people use it, not because it works well."))),
            s("improves", "contributes_to", n("prd-insight-requests", "Product requests", "Sponsor-led asks at two accounts", "insight", "opportunity", 3, D("Genuine pull exists", "Why it matters: the demand is real; the activation path is not."), { linkedNodeIds: ["cus-exp-crosssell"] })),
            s("requires", "requires", n("prd-insight-roadmap", "Roadmap items", "3.0 launch · 24 Sept", "event", "watch", 4, D("Launching into an activation gap", "Why it matters: new capability will not fix an onboarding problem."), { linkedNodeIds: ["cus-ev-launch", "prd-road-investment"] })),
            s("depends on", "depends_on", n("prd-insight-platform", "Platform dependencies", "Data freshness · nightly batch", "entity", "watch", 3, D("Freshness limits the use case", "Why it matters: intraday questions cannot be answered by a nightly batch."), { linkedNodeIds: ["prd-health-freshness"] })),
            s("differentiates against", "competes_with", n("prd-insight-competitive", "Competitive relevance", "Parity, not advantage", "insight", "watch", 3, D("Nobody wins on this module", "Why it matters: it is a retention and attach play, not a differentiator."))),
          ],
        },
      ),
      n("prd-flow-studio", "Flow Studio", "Fastest-growing module · +41% accounts", "entity", "opportunity", 4, D("Growing without being sold", "Why it matters: attached to two-thirds of new contracts and increasingly requested by existing customers, with no attach play behind it."), { linkedNodeIds: ["cus-calder-modules", "prd-opp-expansion", "prd-mv-adoption"] }),
      n("prd-adopt-expansion", "Feature driving expansion", "Automated reconciliation controls", "insight", "opportunity", 4, D("The feature that starts expansion conversations", "Why it matters: accounts using it buy a second module at roughly twice the rate of those that do not."), { linkedNodeIds: ["prd-signal-core", "gro-route-expansion"] }),
      n("prd-adopt-declining", "Declining usage feature", "Manual exception queue · −23% this quarter", "insight", "watch", 3, D("Usage falling for the right reason", "Why it matters: automation is removing the need for it, which is a sunset candidate rather than a problem."), { linkedNodeIds: ["prd-road-sunset", "prd-mv-manual"] }),
      n("prd-adopt-cohort", "High-value / low-usage cohort", "6 accounts · £180k licensed, unused", "insight", "risk", 4, D("A renewal problem disguised as a product metric", "Why it matters: every account in this group has a renewal inside eighteen months and no reason to renew this line."), { linkedNodeIds: ["prd-insight", "cus-risk-adoption", "cap-risk-renewal"] }),
      n("prd-adopt-support", "High-support module", "Signal Core · 62% of all tickets", "insight", "watch", 3, D("Concentration is rising", "Why it matters: up five points over the year, on six delivery and support staff."), { linkedNodeIds: ["prd-signal-core", "org-team-workload"] }),
      n("prd-adopt-retention", "Retention-critical capability", "Reconciliation controls · renewal correlation", "insight", "healthy", 4, D("The strongest retention correlation in the product", "Why it matters: accounts using it renew at materially higher rates, which makes it the thing to protect in any roadmap trade-off."), { linkedNodeIds: ["prd-adopt-expansion", "prd-road-renewal"] }),
    ]),

    g("prd-movement", "Product Movement", "what shifted in usage", [
      n("prd-mv-adoption", "Adoption increased", "Insight Analytics +4 points after pilot", "insight", "opportunity", 4, D("Momentum improving · a pilot that worked", "Why it matters: guided activation lifted adoption more in six weeks than the previous two feature releases combined."), { linkedNodeIds: ["prd-insight", "prd-opp-segment", "cap-alloc-highreturn"] }),
      n("prd-mv-release", "Feature released", "Flow Studio 2.4 · shipped 14 Aug", "insight", "healthy", 3, D("On time, low adoption so far", "Why it matters: 58% of accounts on the latest version after 90 days."), { linkedNodeIds: ["prd-flow-studio"] }),
      n("prd-mv-request", "Repeated customer request", "Same export requested in 14 tickets", "insight", "opportunity", 3, D("A clear, repeated ask", "Why it matters: fourteen tickets this quarter and it is not on the roadmap."), { linkedNodeIds: ["prd-road-pattern", "prd-signal-requests"] }),
      n("prd-mv-threshold", "Usage threshold crossed", "Calder Wealth · 128% of contracted volume", "insight", "opportunity", 4, D("A commercial trigger, not a technical one", "Why it matters: five consecutive months above plan and no pricing conversation has happened."), { linkedNodeIds: ["cus-mv-consumption", "prd-opp-packaging"] }),
      n("prd-mv-reliability", "Reliability degradation", "99.7% against a 99.9% commitment", "insight", "risk", 4, D("Below the contractual commitment", "Why it matters: two service-level misses and one four-hour latency event this quarter."), { linkedNodeIds: ["prd-health-availability", "del-ops-sla"] }),
      n("prd-mv-feedback", "Feedback theme intensified", "Onboarding effort raised in 3 of 4 reviews", "insight", "watch", 3, D("The same theme from different customers", "Why it matters: it matches the activation data exactly, so it is not anecdote."), { linkedNodeIds: ["prd-insight", "prd-opp-codesign"] }),
      n("prd-mv-manual", "Manual work reduced", "Exception handling down 23% per account", "insight", "opportunity", 3, D("The value story, quantified", "Why it matters: this is the number that belongs in the renewal deck and the investor deck."), { linkedNodeIds: ["prd-adopt-declining", "cap-fund-readiness"] }),
      n("prd-mv-integration", "Integration enabled", "Third custodian feed live at two accounts", "insight", "opportunity", 3, D("Ecosystem coverage widened", "Why it matters: every account on this custodian is now technically pre-qualified."), { linkedNodeIds: ["prd-opp-integration", "gro-route-tech"] }),
    ]),

    g("prd-roadmap", "Roadmap Decisions", "what to fund and what to stop", [
      n("prd-road-regulatory", "Regulatory requirement", "US data residency · mandate July 2027", "decision", "critical", 5, D("Decision required · the choice that sets the next two years of growth", "Why it matters: a £58m segment has a mandatory residency requirement effective July 2027. Building it costs roughly two engineers for three quarters. Not building it concedes the segment, keeps losing deals on the same gap, and blocks the largest deal in the pipeline today.", { movement: "Named in four of six competitive losses this year", recommendedAction: "Take a funded decision this quarter. Deferring is the same as conceding, but more expensive.", owner: "CTO", dueDate: "30 Sept 2026", metrics: [{ label: "Segment value", value: "£58m", tone: "opportunity" }, { label: "Build cost", value: "~£260k", tone: "neutral" }, { label: "Window", value: "Jul 2027", tone: "watch" }], evidence: [E("Regulator", "Published mandate", "Updated 6 weeks ago"), E("Win/loss", "Loss reasons by deal", "Updated 1 month ago")] }), { hot: true, linkedNodeIds: ["mkt-seg-usfintech", "mkt-sig-regulation", "cap-alloc-awaiting", "gro-blk-security", "org-own-founder"] }),
      n("prd-road-closedeal", "Capability required to close a deal", "Meridian Markets · residency controls", "decision", "critical", 5, D("Decision required · £680k depends on it", "Why it matters: the same capability as the regulatory requirement, but with a close date attached."), { linkedNodeIds: ["gro-meridian", "prd-road-regulatory"] }),
      n("prd-road-renewal", "Capability needed to protect renewal", "Bramwell · permanent reconciliation fix", "decision", "critical", 4, D("Decision required · £150k of retention", "Why it matters: the third repeat of the same defect is what put this account in play."), { linkedNodeIds: ["cus-bramwell", "del-bramwell-fix", "prd-adopt-retention"] }),
      n("prd-road-pattern", "Cross-customer request pattern", "Same export asked for by 5 accounts", "decision", "opportunity", 3, D("A pattern, not a request", "Why it matters: five accounts asking for one thing is a roadmap item; one account asking is a services job."), { linkedNodeIds: ["prd-mv-request"] }),
      n("prd-road-investment", "Investment needed", "Guided activation · extend the pilot", "decision", "opportunity", 4, D("The cheapest adoption lever available", "Why it matters: the pilot moved adoption four points in six weeks at negligible cost, and it is still unfunded."), { linkedNodeIds: ["prd-opp-segment", "cap-alloc-awaiting", "prd-mv-adoption"] }),
      n("prd-road-debt", "Technical debt", "Integration layer · 3 concurrent versions", "decision", "risk", 4, D("Debt sits exactly where the constraint is", "Why it matters: the integration layer carries both the technical debt and the engineer shortage, so every fix is slower than it should be."), { linkedNodeIds: ["del-con-specialist", "prd-health-integration", "cap-alloc-product"] }),
      n("prd-road-buildbuy", "Build versus buy", "Data enrichment · six-month build or a partner", "decision", "neutral", 3, D("A classic build-or-partner call", "Why it matters: a partner already exists in the ecosystem and would cost a quarter of the build."), { linkedNodeIds: ["mkt-eco-tech", "cap-alloc-buildbuy"] }),
      n("prd-road-sunset", "Product sunset decision", "Manual exception queue · 3 accounts remain", "decision", "watch", 3, D("Announced, never executed", "Why it matters: carrying support cost for eleven months past the announced date."), { linkedNodeIds: ["prd-adopt-declining"] }),
    ]),

    g("prd-platform", "Platform Health", "readiness underneath the product", [
      n("prd-health-security", "Security issue", "One environment outside standard controls", "risk", "risk", 5, D("Certification is now a sales dependency", "Why it matters: a £680k deal is behind a customer residency review while one environment sits outside standard controls under a seven-month 'temporary' exception, and the certification audit is due in October.", { recommendedAction: "Close the exception before the audit and before the Meridian review escalates.", owner: "CTO", dueDate: "31 Oct 2026", evidence: [E("Audit plan", "Scope and open findings", "Updated 2 weeks ago")] }), { hot: true, linkedNodeIds: ["gro-blk-security", "del-ops-compliance", "org-talent-role"] }),
      n("prd-health-availability", "Service availability", "99.7% against a 99.9% commitment", "insight", "risk", 4, D("Below the contractual commitment", "Why it matters: two service-level misses this quarter, both at the account we are trying to retain."), { linkedNodeIds: ["del-ops-sla", "prd-mv-reliability"] }),
      n("prd-health-freshness", "Data freshness", "Nightly batch · 14h median age", "insight", "watch", 3, D("Freshness limits the analytics use case", "Why it matters: intraday questions cannot be answered by a nightly batch, which caps what Insight Analytics can be sold as."), { linkedNodeIds: ["prd-insight", "del-ops-dataquality"] }),
      n("prd-health-errors", "API error rate", "0.4% · within tolerance", "insight", "healthy", 2, D("No action required", "Why it matters: worth stating plainly so attention goes elsewhere."), {}),
      n("prd-health-latency", "Latency", "p95 320ms · one 4-hour regional event", "insight", "watch", 3, D("Stable with one incident", "Why it matters: the incident affected three customers and the root cause is still open."), { linkedNodeIds: ["del-ops-incident"] }),
      n("prd-health-integration", "Integration uptime", "One custodian feed at 97.2%", "risk", "risk", 4, D("One feed is dragging three programmes", "Why it matters: it is the root cause of both Project Atlas escalations and it sits in the most debt-laden layer."), { linkedNodeIds: ["del-atlas-integrations", "prd-road-debt"] }),
      n("prd-health-deployment", "Deployment readiness", "US region not provisioned", "risk", "watch", 3, D("A prerequisite with no owner", "Why it matters: required before any US customer can go live, and it is on nobody's plan."), { linkedNodeIds: ["del-con-infra", "prd-road-regulatory", "cap-alloc-infra"] }),
      n("prd-health-capacity", "Capacity utilisation", "Peak load at 61% of capacity", "insight", "healthy", 2, D("Comfortable", "Why it matters: no capacity work required for at least a year, so no capital is needed here."), {}),
    ]),

    g("prd-opportunity", "Product Opportunity", "where product creates commercial upside", [
      n("prd-opp-segment", "Segment-unlocking feature", "US residency controls · opens £58m", "opportunity", "opportunity", 5, D("Expansion route identified · one capability, one segment", "Why it matters: a single, scoped capability converts an unsellable segment into an addressable one with a dated buying trigger. Nothing else on the product map has this leverage.", { recommendedAction: "Fund it as market entry, not as a feature.", owner: "CEO" }), { hot: true, linkedNodeIds: ["mkt-seg-usfintech", "prd-road-regulatory", "cap-alloc-awaiting"] }),
      n("prd-opp-integration", "Integration opportunity", "Connect API surface · 5 ecosystem partners", "opportunity", "opportunity", 4, D("Distribution left on the table", "Why it matters: integrations exist but are not discoverable or co-marketed, and the one partner who does co-sell out-sources our whole campaign programme."), { linkedNodeIds: ["mkt-eco-tech", "mkt-eco-integration", "gro-route-tech", "del-atlas-integrations"] }),
      n("prd-opp-reusable", "Reusable delivery component", "Migration toolkit · used bespoke 3 times", "opportunity", "opportunity", 3, D("Margin hiding in repeated work", "Why it matters: the same migration work has been rebuilt three times at below-target margin."), { linkedNodeIds: ["del-ops-complexity", "cap-alloc-deliverycost"] }),
      n("prd-opp-packaging", "Packaging / pricing opportunity", "Tiering has not kept pace with consumption", "opportunity", "opportunity", 3, D("Overage is doing the work of a pricing model", "Why it matters: at least two accounts are paying overage that should be committed tiers, which understates ARR in a fundraising year."), { linkedNodeIds: ["cus-calder-contract", "cap-fund-readiness", "prd-mv-threshold"] }),
      n("prd-opp-codesign", "Customer co-design opportunity", "Calder Wealth · US entity build", "opportunity", "opportunity", 4, D("A design partner who is already a customer", "Why it matters: they are opening a US entity anyway, which makes them the cheapest possible anchor for residency work."), { linkedNodeIds: ["cus-exp-geo", "cap-fund-anchor", "mkt-seg-reference"] }),
      n("prd-opp-differentiated", "Differentiated competitor position", "Reconciliation accuracy under load", "opportunity", "opportunity", 3, D("Independently verified and barely used", "Why it matters: benchmarked against two competitors, cited in one deal this year."), { linkedNodeIds: ["mkt-comp-proof", "gro-ev-demo"] }),
      n("prd-opp-expansion", "Product-led expansion trigger", "Flow Studio attach on 66% of new contracts", "opportunity", "opportunity", 3, D("Attach without a play", "Why it matters: no structured attach motion exists; this is happening organically and could be doubled."), { linkedNodeIds: ["prd-flow-studio", "gro-route-expansion"] }),
    ]),
  ],
);
