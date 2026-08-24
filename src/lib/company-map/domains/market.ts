import { D, E, defineDomain, g, n, s } from "../build";

/**
 * Market — segments, whitespace, routes to market.
 * Demo data. Figures are illustrative and deliberately generic.
 */
export const market = defineDomain(
  "market",
  D(
    "£240m addressable across four priority segments",
    "Why it matters: one segment carries the current book and the fastest-growing one has a regulatory window opening in nine months with a product gap standing in front of it. This is the segment choice the next funding round is judged on.",
    {
      movement: "US data residency mandate confirmed for July 2027 · one competitor consolidating",
      recommendedAction:
        "Decide whether to fund US Fintech Market Entry now or concede the window.",
      metrics: [
        { label: "Addressable", value: "£240m", tone: "neutral" },
        { label: "Penetration, core segment", value: "6%", delta: "+1pt", tone: "healthy" },
        { label: "Penetration, growth segment", value: "0.4%", tone: "opportunity" },
        { label: "Competitive losses YTD", value: "6", delta: "4 on one gap", tone: "risk" },
      ],
    },
  ),
  [
    g("mkt-segments", "Priority Segments", "where the next book comes from", [
      n(
        "mkt-seg-wealth",
        "UK wealth & platform operators",
        "Highest-performing segment · 6% penetrated",
        "entity",
        "healthy",
        4,
        D(
          "£96m addressable · 58% of current revenue",
          "Why it matters: the segment the company was built for. Win rates, margins and reference density are all strongest here, and growth has slowed to the pace of the segment itself.",
          {
            movement: "Segment revenue +22% YoY · win rate 44%",
            recommendedAction:
              "Defend margin and reference position; do not fund growth here at the expense of the US.",
          },
        ),
        {
          constellationTitle: "Segment constellation",
          linkedNodeIds: ["cus-calder", "cus-northstar"],
          children: [
            s("belongs to", "contributes_to", n("mkt-seg-wealth-proof", "Existing customer proof points", "Northstar Financial · Calder Wealth", "entity", "healthy", 4, D("Two nameable references", "Why it matters: one published, one approved and unpublished — and two live deals have asked for the unpublished one."), { linkedNodeIds: ["cus-calder", "cus-exp-reference"] })),
            s("best fit for", "influences", n("mkt-seg-wealth-targets", "Target companies", "14 unengaged best-fit accounts", "entity", "opportunity", 3, D("A defined, finite list", "Why it matters: fourteen companies match the best-customer profile and have no relationship with us."), { linkedNodeIds: ["mkt-tgt-similar", "mkt-tgt-bestfit"] })),
            s("competes with", "competes_with", n("mkt-seg-wealth-competitors", "Competitors", "One incumbent, two challengers", "entity", "watch", 3, D("Stable competitive set", "Why it matters: no new entrant in two years, and the incumbent is distracted."), { linkedNodeIds: ["mkt-comp-strategic", "mkt-comp-category"] })),
            s("powers", "enables", n("mkt-seg-wealth-tech", "Technology ecosystem", "Three custodians, two data providers", "entity", "healthy", 3, D("We integrate with all five", "Why it matters: integration coverage is a genuine advantage in this segment and competitors cover three."), { linkedNodeIds: ["mkt-eco-integration"] })),
            s("introduces", "introduces", n("mkt-seg-wealth-partners", "Partners & introducers", "Industry association · two advisers", "entity", "neutral", 2, D("Under-used", "Why it matters: the association route has produced one opportunity this year and there is an unfilled speaking slot."), { linkedNodeIds: ["mkt-eco-association", "mkt-eco-adviser"] })),
            s("applies to", "influences", n("mkt-seg-wealth-props", "Relevant propositions", "Signal Core · Insight Analytics", "entity", "healthy", 3, D("Proposition fit is proven", "Why it matters: both modules have segment-specific reference data."), { linkedNodeIds: ["prd-signal-core", "prd-insight"] })),
            s("opens access to", "generates", n("mkt-seg-wealth-opps", "Open opportunities", "£380k across 4 deals", "opportunity", "healthy", 3, D("Steady rather than spectacular", "Why it matters: no single deal dominates the segment pipeline, which is what a healthy core segment looks like."))),
          ],
        },
      ),
      n(
        "mkt-seg-usfintech",
        "US fintech & digital asset operators",
        "Fastest-growing segment · 0.4% penetrated",
        "entity",
        "opportunity",
        5,
        D(
          "£58m addressable · growing 34% a year",
          "Why it matters: the clearest whitespace on the map. A confirmed data residency mandate lands in July 2027 and every firm in the segment will need a compliant answer before it does. We currently cannot sell one.",
          {
            movement: "Mandate confirmed · 34 accounts engaged with campaign content, 1 in pipeline",
            recommendedAction:
              "This is the investment decision of the year. Fund US Fintech Market Entry or stop spending on the campaign.",
            owner: "CEO",
            dueDate: "30 Sept 2026",
            metrics: [
              { label: "Addressable", value: "£58m", tone: "opportunity" },
              { label: "Penetration", value: "0.4%", tone: "opportunity" },
              { label: "Window closes", value: "Jul 2027", tone: "watch" },
            ],
            evidence: [
              E("Regulator", "Published residency mandate and timetable", "Updated 6 weeks ago"),
              E("Campaign", "Engagement by account", "Updated 3 hours ago"),
            ],
          },
        ),
        { hot: true, linkedNodeIds: ["prd-road-regulatory", "gro-blk-productgap", "cap-alloc-awaiting", "org-own-founder", "cus-exp-geo"] },
      ),
      n("mkt-seg-fundservices", "Fund services & administration", "Highest-margin segment · 2% penetrated", "entity", "healthy", 4, D("£44m addressable · 46% delivery margin", "Why it matters: smallest of the priority segments and the most profitable. Deals are slower and stickier, and Apex is already a reference."), { linkedNodeIds: ["cus-apex", "cap-alloc-highreturn", "gro-lattice"] }),
      n("mkt-seg-banking", "Mid-market banking", "Underpenetrated segment · 0.9% penetrated", "entity", "opportunity", 4, D("£42m addressable · two live opportunities", "Why it matters: one of them is the largest deal in the pipeline. A win here creates the reference that unlocks the rest of the segment."), { linkedNodeIds: ["gro-meridian", "gro-ostara"] }),
      n("mkt-seg-regtailwind", "Regulatory tailwind", "US data residency mandate · July 2027", "insight", "opportunity", 4, D("A dated, mandatory buying trigger", "Why it matters: every firm in the segment must comply, none can build it in the time available, and the deadline does not move."), { linkedNodeIds: ["mkt-sig-regulation", "mkt-seg-usfintech"] }),
      n("mkt-seg-compweak", "Competitor weakness", "Incumbent consolidating after acquisition", "insight", "opportunity", 3, D("Eighteen months of distraction", "Why it matters: the incumbent has frozen its roadmap while it integrates an acquisition."), { linkedNodeIds: ["mkt-comp-category", "mkt-sig-acquisition"] }),
      n("mkt-seg-pmf", "Strong product-market fit", "UK wealth · 44% win rate", "insight", "healthy", 3, D("Where we win most often", "Why it matters: win rate here is thirteen points above the company average, which is the number to quote in a raise."), { linkedNodeIds: ["mkt-seg-wealth", "cap-fund-readiness"] }),
      n("mkt-seg-reference", "Reference-customer segment", "UK wealth 2 references · US 0", "insight", "watch", 3, D("No proof where the growth is", "Why it matters: the fastest-growing segment has no nameable customer, and the Calder US entity would be the first."), { linkedNodeIds: ["cus-exp-reference", "cus-exp-geo", "mkt-seg-usfintech"] }),
    ]),

    g("mkt-targets", "Target Accounts", "the named list", [
      n(
        "mkt-tgt-window",
        "Cobalt Fund Services",
        "Account entering buying window",
        "entity",
        "opportunity",
        4,
        D(
          "Legacy contract expires June 2027 · evaluation starts this quarter",
          "Why it matters: a best-fit account whose incumbent contract is ending, with a new operations director appointed in June who ran a comparable programme elsewhere. Evaluations in this segment are effectively decided before an RFP is issued.",
          {
            movement: "Job posting for a platform migration lead published 11 days ago",
            recommendedAction: "Engage now. There is no opportunity record and the signal is eleven days old.",
            owner: "Commercial Lead",
            evidence: [
              E("Market signal", "Public job posting", "Updated 11 days ago"),
              E("Registry", "Filed contract expiry", "Updated 2 months ago"),
            ],
          },
        ),
        {
          hot: true,
          constellationTitle: "Target account constellation",
          linkedNodeIds: ["mkt-seg-fundservices", "mkt-sig-appointment"],
          children: [
            s("belongs to", "contributes_to", n("mkt-tgt-window-segment", "Segment", "Fund services & administration", "entity", "healthy", 3, D("Highest-margin segment", "Why it matters: a win here is worth more than its contract value."), { linkedNodeIds: ["mkt-seg-fundservices"] })),
            s("backs", "validates", n("mkt-tgt-window-proof", "Existing customer proof points", "Apex Fund Services · two comparable migrations", "entity", "healthy", 3, D("Directly relevant references", "Why it matters: both migrations were from the same incumbent platform."), { linkedNodeIds: ["cus-apex"] })),
            s("competes with", "competes_with", n("mkt-tgt-window-competitor", "Competitors", "Incumbent · contract expires June 2027", "entity", "watch", 4, D("Incumbency is the main obstacle", "Why it matters: twelve-year relationship, but the sponsor who owned it has left."))),
            s("powers", "enables", n("mkt-tgt-window-tech", "Technology ecosystem", "Custodian we already integrate with", "entity", "healthy", 3, D("Integration is already built", "Why it matters: no new connectivity work required to serve them."), { linkedNodeIds: ["mkt-eco-integration"] })),
            s("introduces", "introduces", n("mkt-tgt-window-intro", "Partners & introducers", "Adviser relationship · one degree", "opportunity", "opportunity", 3, D("A warm path exists", "Why it matters: one of our advisers sits on their operations forum."), { linkedNodeIds: ["mkt-eco-adviser"] })),
            s("applies to", "influences", n("mkt-tgt-window-signal", "Market signals", "New operations director · migration hire", "insight", "opportunity", 4, D("Two signals in eight weeks", "Why it matters: both point to a platform decision inside twelve months."), { linkedNodeIds: ["mkt-sig-appointment"] })),
            s("applies to", "influences", n("mkt-tgt-window-props", "Relevant propositions", "Signal Core · Flow Studio", "entity", "healthy", 3, D("Standard configuration", "Why it matters: nothing bespoke is required to serve this account."), { linkedNodeIds: ["prd-flow-studio"] })),
            s("opens access to", "generates", n("mkt-tgt-window-opp", "Open opportunities", "None created", "opportunity", "watch", 3, D("No activity scheduled", "Why it matters: the signal has been visible for eleven days and nothing has been raised."))),
          ],
        },
      ),
      n("mkt-tgt-bestfit", "Ironvale Asset Management", "Best-fit unengaged account", "entity", "opportunity", 4, D("Highest profile match in the segment, no relationship", "Why it matters: scores highest of any unengaged account against the best-customer profile and has never been contacted at executive level."), { linkedNodeIds: ["mkt-seg-wealth", "mkt-tgt-similar"] }),
      n("mkt-tgt-warm", "Solent Pensions", "High-value account with warm introduction", "entity", "opportunity", 4, D("£220k potential · one introduction away", "Why it matters: our customer's CFO chairs the forum their operations director sits on, and we have not asked."), { linkedNodeIds: ["mkt-eco-referral", "cus-exp-referral"] }),
      n("mkt-tgt-tech", "Larkfield Investments", "Account using a relevant technology provider", "entity", "watch", 3, D("Integration-led route", "Why it matters: shares a custodian integration with three of our customers, so the technical case is already proven."), { linkedNodeIds: ["mkt-eco-tech", "gro-route-tech"] }),
      n("mkt-tgt-funded", "Aurelia Digital Assets", "Newly funded · newly led account", "entity", "opportunity", 3, D("Series C closed in June · new COO in July", "Why it matters: funded, mandated to scale operations, and buying infrastructure now."), { linkedNodeIds: ["mkt-sig-funding", "mkt-eco-vc", "mkt-seg-usfintech"] }),
      n("mkt-tgt-comp", "Havenport Group", "Competitor customer with a trigger event", "entity", "opportunity", 3, D("Incumbent froze its roadmap post-acquisition", "Why it matters: their published integration timetable slipped by a year and they have said so publicly."), { linkedNodeIds: ["mkt-seg-compweak", "mkt-comp-replacement"] }),
      n("mkt-tgt-similar", "Marlowe Wealth", "Similar-to-best-customer account", "entity", "opportunity", 3, D("Same shape as Calder Wealth", "Why it matters: same size, same operating model, same growth trajectory as our highest-adoption account."), { linkedNodeIds: ["cus-calder"] }),
      n("mkt-tgt-dormant", "Westbourne Trustees", "Dormant prospect", "entity", "neutral", 2, D("Lost on price in 2024", "Why it matters: the reason we lost has since been removed from the pricing model and nobody has gone back."), { linkedNodeIds: ["mkt-comp-pricing"] }),
    ]),

    g("mkt-eco", "Ecosystem Routes", "who can open the door", [
      n("mkt-eco-pe", "Apex Capital Partners", "PE firm · customer and introducer", "entity", "opportunity", 5, D("Expansion route identified · 40+ portfolio companies, 6 best-fit", "Why it matters: already a customer, already sponsored, and the highest-converting route we have. Three introductions requested this year, none followed up.", { recommendedAction: "Make portfolio introductions a standing item in the account plan.", owner: "CEO", evidence: [E("Portfolio registry", "Holdings matched to best-fit profile", "Updated 1 month ago")] }), { hot: true, linkedNodeIds: ["cus-apex", "gro-route-pe", "cus-apex-portfolio"] }),
      n("mkt-eco-tech", "Strategic technology partner", "Co-sell agreement · £160k sourced YTD", "entity", "opportunity", 4, D("Best-performing partner", "Why it matters: has sourced more qualified pipeline this year than the entire campaign programme, on no incentive."), { linkedNodeIds: ["gro-route-partner", "prd-opp-integration"] }),
      n("mkt-eco-integration", "Integration ecosystem", "Five custodians and data providers", "entity", "healthy", 3, D("Coverage is a moat in the core segment", "Why it matters: competitors integrate with three of the five."), { linkedNodeIds: ["prd-opp-integration", "gro-route-tech"] }),
      n("mkt-eco-portfolio", "Portfolio company", "6 best-fit within the Apex portfolio", "entity", "opportunity", 3, D("A pre-qualified list", "Why it matters: all six match the profile of our two most profitable accounts."), { linkedNodeIds: ["mkt-eco-pe"] }),
      n("mkt-eco-referral", "Client referral path", "Northstar Financial CFO peer forum", "opportunity", "opportunity", 3, D("Three target accounts in one room", "Why it matters: the forum meets quarterly and our customer chairs it."), { linkedNodeIds: ["cus-exp-referral", "mkt-tgt-warm"] }),
      n("mkt-eco-vc", "VC fund", "Two funds · early relationship", "entity", "neutral", 2, D("Unproven route, useful for the raise", "Why it matters: four months old, no sourced opportunities yet, but both funds are plausible participants in a seed extension."), { linkedNodeIds: ["mkt-tgt-funded", "cap-fund-investor"] }),
      n("mkt-eco-adviser", "Adviser or influencer", "Two sector advisers under agreement", "entity", "neutral", 2, D("Quiet but well-placed", "Why it matters: one sits on the operations forum of a live target account."), { linkedNodeIds: ["mkt-tgt-window", "org-talent-fractional"] }),
      n("mkt-eco-association", "Industry association", "Segment body · speaking slot available", "entity", "neutral", 2, D("Credibility channel", "Why it matters: a speaking slot at the autumn conference is still unfilled and free."), { linkedNodeIds: ["mkt-sig-event"] }),
    ]),

    g("mkt-signals", "Market Signals", "what changed outside the building", [
      n("mkt-sig-regulation", "Regulation change", "US data residency mandate · effective July 2027", "insight", "opportunity", 5, D("A mandatory, dated buying trigger for a whole segment", "Why it matters: every firm in the segment must comply. None can build it in the time available. We currently cannot sell it, and it is the same gap blocking our largest deal.", { movement: "Confirmed six weeks ago after two years of consultation", recommendedAction: "Convert the mandate into a funded roadmap commitment this quarter.", owner: "CTO", evidence: [E("Regulator", "Final rules and timetable", "Updated 6 weeks ago")] }), { hot: true, linkedNodeIds: ["mkt-seg-usfintech", "prd-road-regulatory", "cap-alloc-awaiting", "gro-blk-security"] }),
      n("mkt-sig-appointment", "Senior executive appointment", "Cobalt Fund Services · new operations director", "insight", "opportunity", 4, D("A new decision-maker with a mandate", "Why it matters: ran a comparable platform migration in a previous role and is hiring a migration lead."), { linkedNodeIds: ["mkt-tgt-window"] }),
      n("mkt-sig-funding", "Funding round", "Aurelia Digital Assets · Series C closed", "insight", "opportunity", 3, D("Funded and buying", "Why it matters: operations scale-up is a stated use of proceeds."), { linkedNodeIds: ["mkt-tgt-funded"] }),
      n("mkt-sig-acquisition", "Acquisition or PE sale process", "Incumbent competitor acquired a rival", "insight", "opportunity", 4, D("Eighteen months of integration ahead", "Why it matters: their roadmap is frozen while they consolidate two platforms, and their customers know it."), { linkedNodeIds: ["mkt-seg-compweak", "mkt-comp-category"] }),
      n("mkt-sig-techchange", "Technology-provider change", "Two target accounts changing custodian", "insight", "opportunity", 3, D("Migration moments create windows", "Why it matters: platform decisions cluster around custodian changes."), { linkedNodeIds: ["mkt-tgt-tech"] }),
      n("mkt-sig-geo", "Geography expansion", "Calder Wealth opening a US entity", "insight", "opportunity", 3, D("A customer entering our growth segment", "Why it matters: the cheapest possible route into the US is an existing customer who already trusts us."), { linkedNodeIds: ["cus-exp-geo", "mkt-seg-usfintech"] }),
      n("mkt-sig-compwin", "Competitor win", "Lost a mid-market banking deal in July", "insight", "risk", 3, D("Fourth loss on the same gap", "Why it matters: all four losses cite the same missing capability."), { linkedNodeIds: ["mkt-comp-gap", "mkt-comp-winloss"] }),
      n("mkt-sig-news", "News-driven urgency", "Segment operational failure reported", "insight", "opportunity", 2, D("A public failure at a peer firm", "Why it matters: historically raises inbound interest in reconciliation controls for about six weeks."), { linkedNodeIds: ["prd-signal-core"] }),
      n("mkt-sig-event", "Industry event", "Asset Operations Summit · 8 Oct", "event", "watch", 2, D("Nine customers, four targets, one open speaking slot", "Why it matters: the highest-density customer contact of the year."), { linkedNodeIds: ["cus-ev-industry", "gro-route-event"] }),
    ]),

    g("mkt-competitive", "Competitive Position", "where we win and lose", [
      n("mkt-comp-strategic", "Competitor in a strategic account", "Bramwell Trustees · on site twice", "risk", "critical", 5, D("Revenue at risk · a live replacement evaluation inside the book", "Why it matters: the competitor has met the new COO, been on site twice, and is running a structured evaluation against our weakest adoption story.", { recommendedAction: "Win this on delivery recovery, not on product comparison.", owner: "CEO", evidence: [E("Field note", "Delivery lead observation", "Evidence incomplete · 3 weeks old")] }), { hot: true, linkedNodeIds: ["cus-bramwell", "cus-risk-competitor", "del-bramwell-recovery"] }),
      n("mkt-comp-gap", "Capability gap", "US data residency and regional reporting", "risk", "risk", 4, D("Named in four of six losses this year", "Why it matters: the single most expensive gap in the product, and it blocks the fastest-growing segment."), { linkedNodeIds: ["prd-road-regulatory", "gro-blk-productgap"] }),
      n("mkt-comp-proof", "Differentiated proof point", "Reconciliation accuracy under load", "opportunity", "opportunity", 3, D("Independently verified, rarely used", "Why it matters: benchmarked against two competitors and cited in one deal this year."), { linkedNodeIds: ["prd-opp-differentiated", "gro-ev-demo"] }),
      n("mkt-comp-replacement", "Active replacement programme", "Havenport Group reviewing its incumbent", "opportunity", "opportunity", 3, D("A competitor customer in play", "Why it matters: triggered by their incumbent's roadmap freeze, not by us."), { linkedNodeIds: ["mkt-tgt-comp"] }),
      n("mkt-comp-pricing", "Pricing pressure", "Average discount 12%, up from 7%", "insight", "watch", 4, D("Discipline is slipping", "Why it matters: discount depth has increased in each of the last three quarters, and five points of discount is worth more than our entire uncommitted budget."), { linkedNodeIds: ["cap-alloc-lowreturn", "gro-blk-pricing"] }),
      n("mkt-comp-winloss", "Win/loss pattern", "We win on delivery, we lose on scope", "insight", "watch", 3, D("A consistent, actionable pattern", "Why it matters: wins cite implementation confidence; losses cite missing capability. Both point at the same roadmap decision."), { linkedNodeIds: ["mkt-comp-gap", "del-atlas"] }),
      n("mkt-comp-category", "Category opening", "Incumbent distracted for 18 months", "opportunity", "opportunity", 4, D("A window that will not stay open", "Why it matters: integration distraction historically lasts about six quarters, and we are one quarter in."), { linkedNodeIds: ["mkt-seg-compweak", "mkt-sig-acquisition"] }),
    ]),
  ],
);
