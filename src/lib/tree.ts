export type AutonomyLevel = "manual" | "assisted" | "autonomous";

export type Job = {
  name: string;
  desc: string;
  skills: string[];
  tools: string[];
  level: AutonomyLevel;
  replaces?: string;
  ladder?: {
    manual: string;
    assisted: string;
    autonomous: string;
  };
  human?: string;
  notes?: string;
};

export type Fn = {
  name: string;
  jobs: Job[];
};

export type Department = {
  name: string;
  sub: string;
  color: string;
  intro: string;
  functions: Fn[];
};

const L = (
  name: string,
  desc: string,
  skills: string[],
  tools: string[] = [],
  level: AutonomyLevel = "autonomous",
  extras: Partial<Job> = {},
): Job => ({ name, desc, skills, tools, level, ...extras });

const F = (name: string, jobs: Job[]): Fn => ({ name, jobs });

export const LEVEL_LABEL: Record<AutonomyLevel, string> = {
  manual: "HUMAN-LED",
  assisted: "HUMAN-ASSISTED",
  autonomous: "FULLY AUTONOMOUS",
};

/** Full TREE ported from SkillTree map.html — drives exact sky mini-fan silhouettes. */
export const TREE: Department[] = [
  {
    name: "Sales",
    sub: "targeting · outreach · sequencing",
    color: "#FF9D5C",
    intro: "The top of the funnel · finding the right companies, learning enough about them to be worth a reply, and reaching out at scale without sounding like a robot. This is the department most businesses try to hire their way out of. It is the one agents change first, because every job here is research, writing, and timing · and machines never get tired of any of it.",
    functions: [
      F("Targeting", [
        L("ICP Definition", "Define and refine ideal customer profiles per vertical · firmographics, pain patterns, buying triggers.", ["icp-profiler","vertical-scorer","pain-pattern-library"]),
        L("Market Mapping", "Map the total addressable companies in a target vertical before a campaign.", ["tam-mapper","vertical-census"], ["Exa","Apollo"]),
        L("Trigger Detection", "Watch for buying signals · hiring, funding, tech changes, leadership moves.", ["hiring-signal-watcher","funding-tracker","tech-change-detector"], ["Exa","Apify"], "assisted"),
        L("Lookalike Modeling", "Build new target lists off the shape of your closed-won accounts.", ["lookalike-builder","pattern-extractor"], ["Apollo"], "assisted"),
      ]),
      F("Lead Sourcing", [
        L("Database Mining", "Pull targeted company and contact lists from structured databases.", ["apollo-query-builder","saved-search-runner"], ["Apollo"]),
        L("Web & Maps Scraping", "Scrape local businesses, directories, and niche sources for leads.", ["maps-scraper","directory-harvester"], ["Apify"]),
        L("Social Mining", "Harvest engaged audiences · post commenters, followers, group members.", ["comment-harvester","engagement-miner","profile-collector"], ["Apify","HeyReach"]),
        L("List Building", "Merge, dedupe, and segment raw leads into campaign-ready lists.", ["list-deduper","segmenter","csv-normalizer"]),
      ]),
      F("Enrichment", [
        L("Contact Enrichment", "Find and append emails, phones, and LinkedIn profiles to every lead.", ["email-finder","phone-appender","linkedin-matcher"], ["Apollo","Apify"]),
        L("Email Verification", "Validate every address before it ever gets a send.", ["smtp-verifier","catch-all-detector"], ["Instantly"]),
        L("Account Enrichment", "Layer firmographics, tech stack, and headcount trends onto target accounts.", ["firmographic-appender","tech-stack-detector","growth-signal-scorer"], ["Exa","Firecrawl"]),
        L("Fit Scoring", "Score every lead against ICP so outreach spends effort where it converts.", ["fit-scorer","tier-assigner","disqualifier"]),
      ]),
      F("Outreach Writing", [
        L("Personalization Research", "Build a personalization dossier per prospect · hooks, context, common ground.", ["prospect-dossier","hook-finder","common-ground-scanner"], ["Exa","Firecrawl"]),
        L("Cold Email Drafting", "Write multi-step cold email sequences tuned to the vertical and offer.", ["sequence-writer","subject-line-generator","spintax-builder"]),
        L("LinkedIn Messaging", "Draft connection notes and DM sequences that read human.", ["connection-note-writer","dm-sequencer"]),
        L("Proof Matching", "Match the right case study to each prospect’s industry and problem.", ["case-study-matcher","proof-point-selector"]),
        L("Cold-Call Scripting", "Call and voicemail scripts with branching objection handling that read human.", ["call-scripter","objection-brancher"]),
        L("Video Prospecting", "Personalized video scripts · the hook, the personal line, the CTA, under 90 seconds.", ["video-scripter","personalization-writer"]),
      ]),
      F("Sequencing & Send", [
        L("Campaign Orchestration", "Build multi-channel cadences · email, LinkedIn, phone touches in order.", ["cadence-builder","channel-router"]),
        L("Campaign Launch", "Push finished campaigns into sending platforms with correct settings.", ["instantly-syncer","heyreach-syncer"], ["Instantly","HeyReach"]),
        L("Deliverability", "Keep domains healthy · warmup, spam testing, inbox rotation.", ["warmup-monitor","spam-score-tester","domain-health-auditor"], ["Instantly"], "assisted"),
        L("Send Optimization", "Schedule sends by timezone and pace volume to protect reply rates.", ["timezone-scheduler","volume-pacer"]),
      ]),
    ],
  },
  {
    name: "Deals",
    sub: "replies · calls · closing · pipeline",
    color: "#EF4444",
    intro: "What happens after someone raises their hand · the reply gets read and routed, the meeting gets booked, the proposal gets written, the pipeline stays honest. Speed wins deals here, and speed is exactly what a human team loses as volume grows. The agents answer in minutes, draft before the next call, and never let a deal go quiet without flagging it.",
    functions: [
      F("Reply Handling", [
        L("Reply Classification", "Read every reply and tag it · interested, objection, referral, not now, never.", ["intent-classifier","sentiment-tagger","auto-labeler"]),
        L("Objection Response", "Draft responses to common objections from a tuned library.", ["objection-library","response-drafter"], [], "assisted"),
        L("Hot-Lead Routing", "Route interested replies to the calendar and the pipeline instantly.", ["hot-lead-alerter","crm-promoter"], ["Attio"]),
        L("Meeting Booking", "Propose slots, book calls, chase no-shows.", ["slot-proposer","cal-booker","no-show-recoverer"], ["Cal.com"]),
        L("Referral Capture", "Spot the \"talk to my colleague\" replies and action the warm intro.", ["referral-spotter","intro-router"]),
      ]),
      F("Inbound", [
        L("Speed-to-Lead", "Acknowledge and engage every inbound lead within minutes.", ["instant-responder","intake-acknowledger"]),
        L("Lead Qualification", "Parse intake forms and score inbound leads before a human looks.", ["qual-scorer","intake-parser","budget-detector"]),
        L("Comment-CTA Fulfillment", "Detect keyword comments on content and deliver the promised asset by DM.", ["keyword-listener","dm-fulfiller"], ["Instagram API"]),
        L("Inbox Triage", "Sort inbound email and DMs · client, lead, brand deal, noise.", ["inbox-triager","priority-router"]),
      ]),
      F("Call Cycle", [
        L("Pre-Call Briefing", "Build a brief before every call · who, company, history, objectives, talking points.", ["prep-brief-builder","attendee-researcher"], ["Fireflies","Attio"]),
        L("Call Capture", "Record, transcribe, and file every meeting automatically.", ["transcript-ingester","meeting-filer"], ["Fireflies"]),
        L("Post-Call Debrief", "Extract outcomes, action items, and deal updates from the transcript.", ["action-extractor","deal-updater","commitment-tracker"]),
        L("Follow-Up Drafting", "Draft the recap email with next steps before the prospect forgets the call.", ["recap-writer","next-step-drafter"]),
        L("Objection Library", "Mine every call for the objections that come up · build the rebuttals that win.", ["objection-miner","rebuttal-builder"], ["Fireflies"], "assisted"),
      ]),
      F("Deal Artifacts", [
        L("Demo Prototyping", "Turn discovery notes into a working visual prototype before the next meeting.", ["dream-prototyper","sandbox-builder"]),
        L("Proposal Generation", "Generate branded proposals rendered to PDF from call context.", ["proposal-writer","pdf-renderer"]),
        L("Deal Room Assembly", "Spin up tracked, password-gated deal rooms per prospect.", ["room-builder","magic-link-issuer","engagement-tracker"]),
        L("Agreement Drafting", "Produce the services agreement the moment a deal closes verbally.", ["contract-generator","esign-preparer"], [], "assisted"),
        L("Pricing Support", "Model anchors, phase structures, and ROI comparisons per deal.", ["anchor-calculator","roi-modeler","phase-structurer"]),
      ]),
      F("Pipeline Ops", [
        L("CRM Hygiene", "Keep records deduped, fields normalized, stages honest.", ["record-deduper","field-normalizer","stage-auditor"], ["Attio"]),
        L("Pipeline Reporting", "Weekly pipeline state · what moved, what stalled, what closes next.", ["pipeline-reporter","funnel-analyzer"]),
        L("Forecasting", "Probability-weight the pipeline into a revenue forecast.", ["close-probability-scorer","revenue-forecaster"], [], "assisted"),
        L("Reactivation", "Revive dormant deals and win back lost ones on a schedule.", ["dormant-deal-reviver","winback-sequencer"]),
        L("Win/Loss Analysis", "Tag why deals close or die; feed patterns back into targeting.", ["loss-tagger","pattern-miner"], [], "manual"),
      ]),
    ],
  },
  {
    name: "Marketing",
    sub: "content · brand · distribution",
    color: "#A78BFA",
    intro: "The engine that makes you known · reading what works, making more of it, and pushing one good idea across every surface before the trend moves. Most teams post and pray. This department measures every piece against the median, doubles down on the winners, and turns a single reel into nine assets · so output stops depending on whoever felt inspired that week.",
    functions: [
      F("Insights", [
        L("Performance Mining", "Rank your own content corpus · what worked, what to re-hash.", ["corpus-ranker","rehash-finder","era-analyzer"]),
        L("Trend Monitoring", "Watch the niche for breaking topics and rising formats.", ["news-watcher","format-spotter"], ["Exa"]),
        L("Competitor Analysis", "Scrape and transcribe competitor content; extract hook patterns.", ["reel-transcriber","hook-pattern-miner"], ["Apify","Deepgram"]),
        L("Audience Analysis", "Mine comments and DMs for questions, objections, and content ideas.", ["comment-miner","question-clusterer"]),
      ]),
      F("Creation", [
        L("Hook Writing", "Generate and rank hooks per platform from proven patterns.", ["hook-generator","hook-ranker"]),
        L("Script Writing", "Full reel and video scripts in the house voice.", ["script-writer","voice-matcher"]),
        L("Caption Writing", "Platform-correct captions with CTA placement rules baked in.", ["caption-writer","cta-placer"]),
        L("Carousel Production", "Design and export branded carousel slides.", ["carousel-builder","slide-exporter"]),
        L("Video Production", "Programmatic video · overlays, captions, motion graphics on recordings.", ["reel-compositor","caption-syncer","overlay-animator"], ["Remotion"]),
        L("Image Generation", "Brand-consistent images from reference libraries.", ["brand-image-generator","character-consistency"], ["FAL"], "assisted"),
        L("Thumbnail & Cover Design", "Scroll-stopping thumbnails and covers tuned to earn the click.", ["thumbnail-designer","cover-tester"], ["FAL"], "assisted"),
        L("Ad Creative", "Generate and iterate paid-ad variations · hooks, angles, formats.", ["ad-variation-builder","angle-tester"], ["FAL"], "assisted"),
        L("Landing Page Copy", "Conversion copy for the whole page · hero, proof, offer, FAQ, CTA.", ["page-copywriter","offer-framer"]),
        L("Deck Production", "Webinar and talk decks in the brand design system.", ["deck-builder","slide-templater"]),
      ]),
      F("Repurposing", [
        L("Cross-Platform Adaptation", "One idea → native formats for every platform.", ["format-adapter","platform-translator"]),
        L("Clip Extraction", "Cut long recordings into short-form clips worth posting.", ["clip-finder","highlight-extractor"], ["Deepgram"], "assisted"),
        L("Lead-Magnet Builds", "Turn content themes into gated guides and landing pages.", ["guide-builder","gated-page-generator"]),
      ]),
      F("Distribution", [
        L("Publishing", "Schedule and post across platforms via API.", ["post-scheduler","api-publisher"], ["Zernio"], "assisted"),
        L("Newsletter & Broadcast", "Design and send the weekly email in the brand system.", ["newsletter-builder","broadcast-sender"], ["Beehiiv","Resend"]),
        L("SEO & GEO", "Make the site legible to search engines and LLMs.", ["schema-marker","llms-txt-maintainer","sitemap-builder"]),
        L("OG & Share Surface", "Every page ships with share-ready open-graph imagery.", ["og-image-generator"]),
      ]),
      F("Brand Deals", [
        L("Deal Scripting", "Sponsored scripts in the proven format, per brand brief.", ["brand-script-writer","claim-fact-checker"]),
        L("Approval Docs", "Brand-safe formatted docs for sponsor sign-off.", ["approval-doc-generator"], ["Google Docs"]),
      ]),
    ],
  },
  {
    name: "Operations",
    sub: "onboarding · builds · client ops",
    color: "#5EEAD4",
    intro: "Where promises become delivery · onboarding a new client, wiring the systems, testing the work, and reporting status before anyone has to ask. Delivery dies in week one or it doesn’t. This department makes the first week feel like the tenth, catches the broken batch before the client sees it, and sends the Friday update that keeps trust alive through the quiet stretches.",
    functions: [
      F("Onboarding", [
        L("Kickoff Pack", "Welcome email, access checklist, and project scaffold the day a deal closes.", ["kickoff-generator","access-checklister"]),
        L("Access Collection", "Chase and verify every credential and API key needed to build.", ["credential-chaser","access-verifier"], [], "assisted"),
        L("Project Scaffolding", "Stand up the repo, context files, and plan for a new engagement.", ["repo-scaffolder","context-writer"]),
      ]),
      F("Build Ops", [
        L("Document Extraction", "High-volume structured extraction from client documents.", ["extraction-pipeline","schema-mapper","accuracy-benchmarker"]),
        L("Integration Builds", "Wire client systems together · CRMs, calendars, transcripts, payments.", ["api-integrator","webhook-wirer"], ["Inngest"]),
        L("Data Migration", "Move and clean data between systems without losing or mangling a row.", ["migration-runner","field-mapper","dedupe-validator"], ["Inngest"], "assisted"),
        L("Portal Provisioning", "Spin up client-scoped delivery portals with live status.", ["portal-provisioner","portal-theming"]),
        L("QA & Verification", "Verify every build against real data before the client sees it.", ["output-verifier","regression-checker"], [], "assisted"),
        L("Agent Evaluation", "Test agent outputs against a benchmark before they touch real work.", ["eval-harness","regression-checker"], [], "assisted"),
      ]),
      F("Reliability", [
        L("Monitoring & Alerting", "Watch every automation for failures and silent stalls · know before the client does.", ["uptime-watcher","failure-alerter"], ["Inngest"], "assisted"),
        L("Cost & Usage Tracking", "Token and API spend tracked against budget · no surprise bills.", ["spend-tracker","budget-guard"]),
        L("Incident Response", "When an automation breaks · triage, root-cause, fix, and write the note.", ["incident-triager","rootcause-finder","postmortem-writer"], [], "assisted"),
      ]),
      F("Client Comms", [
        L("Status Updates", "Clients see progress without asking for it.", ["status-poster","milestone-notifier"]),
        L("Meeting Follow-Ups", "Client call transcripts → action items → assigned and tracked.", ["followup-processor","action-assigner"], ["Fireflies"]),
        L("Portal Sync", "Session summaries and deliverables flow into the client portal automatically.", ["portal-syncer","deliverable-publisher"]),
      ]),
      F("Knowledge", [
        L("Transcript Processing", "Every meeting becomes searchable, structured context.", ["transcript-structurer","entity-extractor"]),
        L("Context Maintenance", "Per-client context files stay current as work happens.", ["context-updater","memory-writer"]),
        L("SOP Generation", "Turn delivered work into reusable playbooks.", ["sop-writer","playbook-extractor"], [], "manual"),
        L("Handoff Docs", "Clean documentation when a system ships to the client.", ["handoff-writer","runbook-generator"], [], "assisted"),
      ]),
    ],
  },
  {
    name: "Intelligence",
    sub: "companies · people · markets",
    color: "#7DD3FC",
    intro: "The floor that makes everyone else sharper · company dossiers before every call, the trends worth filming, the competitors you can’t afford to be surprised by. Research is cheap and being wrong is expensive. This department turns two-day digging jobs into twenty-minute briefs, so no one upstairs ever walks into a room guessing.",
    functions: [
      F("Companies", [
        L("Company Deep-Dive", "Financials, growth signals, org structure, strategic posture.", ["company-profiler","signal-collector"], ["Exa","Firecrawl"]),
        L("Tech-Stack Detection", "What a target company runs, and where the gaps are.", ["stack-detector","gap-analyzer"]),
        L("Funding & Financials Lookup", "Rounds, investors, revenue estimates, filings · who just got budget.", ["funding-tracker","financials-reader"], ["Exa"]),
        L("Buying-Committee Mapping", "Who actually decides · economic buyer, champion, blockers, their roles.", ["committee-mapper","role-classifier"], [], "assisted"),
      ]),
      F("People", [
        L("Person Research", "Background, content trail, interests, mutual ground for any contact.", ["person-profiler","content-trail-scanner"]),
        L("Network Mapping", "Who knows whom · paths into a target account.", ["connection-mapper"], [], "manual"),
        L("Warm-Path Finding", "The shortest real intro path into a target account · who can connect you.", ["path-finder","intro-drafter"], [], "assisted"),
      ]),
      F("Markets", [
        L("Competitor Teardown", "Pricing, positioning, strengths, weaknesses, exploitable gaps.", ["competitor-teardown","positioning-mapper"]),
        L("Vertical Analysis", "Is this vertical worth entering · demand, budgets, buying behavior.", ["vertical-analyzer","opportunity-scorer"]),
        L("Pricing Research", "What the market charges, anchors, and packaging patterns.", ["pricing-scanner","packaging-analyzer"]),
        L("TAM / Market Sizing", "How many companies actually fit · the real size of the prize.", ["tam-sizer","segment-counter"], ["Exa","Apollo"]),
      ]),
      F("Monitoring", [
        L("Account Monitoring", "Watch a target list for funding, hiring, leadership, and tech changes · ongoing.", ["account-watcher","change-detector"], ["Exa","Firecrawl"], "assisted"),
        L("News & Mention Tracking", "Every mention of your brand, competitors, and topics · as it lands.", ["mention-tracker","news-watcher"], ["Exa"], "assisted"),
        L("Alert Routing", "The signals that matter reach the right person · the noise gets filtered.", ["signal-scorer","alert-router"]),
      ]),
      F("Synthesis", [
        L("Research Reports", "Any question → structured, cited report with diagrams.", ["report-builder","diagram-generator","source-citer"]),
        L("Data Visualization", "Turn a pile of research into charts and diagrams that explain themselves.", ["chart-builder","diagram-generator"]),
        L("Adversarial Verification", "Claims get attacked before they get believed.", ["claim-verifier","source-cross-checker"]),
      ]),
    ],
  },
  {
    name: "Customer",
    sub: "support · success · community",
    color: "#FB7185",
    intro: "Everything that happens after the sale · answering the repeat questions, watching for the accounts about to slip, and keeping the community alive. Churn rarely comes from bad work · it comes from silence. This department deflects the tickets that don’t need a human, spots the amber before it goes red, and renews accounts months early.",
    functions: [
      F("Support", [
        L("Ticket Triage", "Classify, prioritize, and route every support request the moment it lands.", ["ticket-classifier","priority-router","sla-watcher"], [], "assisted"),
        L("FAQ & Self-Serve", "Answer the questions that repeat · and turn them into living help content.", ["faq-responder","help-article-writer"]),
        L("Escalations", "Spot the angry, the churn-risk, and the edge case · and get a human there fast.", ["sentiment-flagger","escalation-router"], [], "assisted"),
        L("Macro Authoring", "Turn the tickets that repeat into canned, on-brand responses agents reuse.", ["macro-writer","response-templater"]),
      ]),
      F("Success", [
        L("Onboarding Journeys", "Guide every new customer through activation, step by step.", ["journey-sequencer","activation-tracker"]),
        L("Health Scoring", "Score every account on usage, sentiment, and engagement · before renewal season.", ["health-scorer","churn-predictor"], [], "assisted"),
        L("Churn Prediction", "Predict which accounts are about to slip · before the usage even dips.", ["churn-modeler","risk-forecaster"], [], "assisted"),
        L("Renewals & Expansion", "Time renewal conversations and spot upsell openings.", ["renewal-scheduler","expansion-spotter"], [], "manual"),
        L("Advocacy & Referrals", "Turn your happiest customers into referrals, reviews, and case studies.", ["advocate-finder","referral-asker"], [], "assisted"),
        L("QBR Prep", "Build the quarterly business review from real account data.", ["qbr-builder","value-recap-writer"]),
      ]),
      F("Community", [
        L("Engagement & Replies", "Every member question and mention gets a response in the house voice.", ["community-responder","mention-watcher"]),
        L("Moderation", "Keep the space clean · spam, conduct, and noise handled quietly.", ["spam-filter","conduct-monitor"], [], "assisted"),
        L("Member Spotlights", "Find and celebrate member wins · the retention engine.", ["win-detector","spotlight-writer"], [], "manual"),
        L("Event Coordination", "Run the AMAs, calls, and spotlights on a cadence the community can count on.", ["event-scheduler","session-runner"], ["Cal.com"], "manual"),
      ]),
    ],
  },
  {
    name: "Back Office",
    sub: "money in · books · office · people",
    color: "#FACC15",
    intro: "The unglamorous floor that keeps the lights on · invoices out and money in, the numbers reporting themselves every Monday, contracts and records that never go missing. Nobody starts a company to chase late payments. This department runs the admin on a schedule so the founder stops being the bottleneck for getting paid.",
    functions: [
      F("Money In", [
        L("Invoice Generation", "Branded invoices per entity, currency, and tax treatment.", ["invoice-generator","entity-router"]),
        L("Payment Tracking", "Know what’s paid, due, and late · without opening a bank app.", ["payment-watcher","reconciler"], ["Stripe","Wise"]),
        L("Collections", "Overdue invoices get chased politely and persistently.", ["overdue-nudger","escalation-sequencer"], [], "assisted"),
      ]),
      F("Reporting", [
        L("Revenue Reporting", "Monthly revenue truth across entities and currencies.", ["revenue-reporter","currency-normalizer"]),
        L("Goal Pacing", "Tracking against the income target, with pace forecasts.", ["goal-pacer","runway-projector"]),
      ]),
      F("Finance Ops", [
        L("Cash-Flow Forecasting", "Project cash in and out · know your runway before it becomes an emergency.", ["cashflow-projector","runway-calculator","scenario-modeler"], ["Xero","Stripe"], "assisted"),
        L("Budget Tracking", "Spend vs budget by category, with overruns flagged early.", ["budget-tracker","variance-flagger"], ["Xero"]),
      ]),
      F("Records", [
        L("CRM Sync", "Deals, contacts, and statuses stay current everywhere.", ["crm-syncer","two-way-updater"], ["Attio"]),
        L("Expense Categorization", "Spend categorized for the accountant before they ask.", ["expense-categorizer"], [], "assisted"),
        L("Document Filing & Retrieval", "Every document named, filed, and findable in ten seconds.", ["document-filer","retrieval-indexer"]),
        L("Contract Lifecycle", "Renewals, expiries, and obligations tracked so nothing sneaks up.", ["contract-tracker","renewal-notifier"], [], "assisted"),
        L("Entity Compliance", "Filings and obligations per entity, tracked and scheduled.", ["compliance-calendar","filing-tracker"], [], "manual"),
      ]),
      F("Office", [
        L("Calendar Management", "Scheduling, conflicts, buffers, and timezone math handled.", ["calendar-manager","conflict-resolver"], ["Cal.com"]),
        L("Email Triage", "The inbox sorted by what actually needs the human.", ["email-triager","draft-responder"]),
      ]),
      F("Talent", [
        L("Candidate Sourcing", "Find and rank candidates for open roles across platforms.", ["candidate-finder","profile-ranker"], [], "manual"),
        L("Screening & Scheduling", "First-pass screens and interview logistics, handled.", ["screen-summarizer","interview-scheduler"], [], "assisted"),
        L("Onboarding & Training", "New hires get the playbooks, access, and 30-day plan automatically.", ["hire-onboarder","training-sequencer"]),
        L("HR & Policy Assistant", "Answer staff policy questions from the real handbook · leave, expenses, onboarding admin.", ["policy-answerer","handbook-keeper"], [], "assisted"),
      ]),
    ],
  },
];

export function deptJobCount(d: Department) {
  return d.functions.reduce((s, f) => s + f.jobs.length, 0);
}

export function findJob(dept: Department, jobName: string): { job: Job; fnName: string } | null {
  for (const fn of dept.functions) {
    const job = fn.jobs.find((j) => j.name === jobName);
    if (job) return { job, fnName: fn.name };
  }
  return null;
}
