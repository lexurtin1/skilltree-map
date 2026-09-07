/** Issuer-page snapshots, checked 7 September 2026. No live price feed. */
export const PUBLIC_FUNDS = [
  {
    id: "vanguard-all-world", accountId: "acc-vanguard", name: "Vanguard FTSE All-World UCITS ETF", isin: "IE00BK5BQT80",
    benchmark: "FTSE All-World Index", income: "Accumulating", currency: "USD",
    holdings: 3782, holdingsDate: "31 July 2026", fee: null,
    scope: "Developed and emerging markets",
    story: "One global equity portfolio spans developed and emerging markets. Its GBP, EUR and USD exchange listings illustrate why a distribution team needs to distinguish the fund, share class and trading line.",
    question: "Which exchange listings and investor documents need to be supported in each target market?",
    source: "https://www.vanguard.co.uk/professional/product/etf/equity/9679/ftse-all-world-ucits-etf-usd-accumulating",
    publisher: "Vanguard",
  },
  {
    id: "ishares-core-world", accountId: "acc-blackrock", name: "iShares Core MSCI World UCITS ETF", isin: "IE00B4L5Y983",
    benchmark: "MSCI World Index (Net)", income: "Accumulating", currency: "USD",
    holdings: 1252, holdingsDate: "4 September 2026", fee: "0.20%",
    scope: "Developed markets",
    story: "A developed-market equity portfolio provides a useful comparison with an all-world fund. The different benchmark explains the investment coverage; it does not establish a new distribution registration or a commercial opportunity.",
    question: "Does the distribution team's market coverage match the audience for its developed-market range?",
    source: "https://www.ishares.com/uk/individual/en/products/251882/ishares-core-msci-world-ucits-etf-acc-fund",
    publisher: "BlackRock / iShares",
  },
  {
    id: "ishares-core-sp500", accountId: "acc-blackrock", name: "iShares Core S&P 500 UCITS ETF", isin: "IE00B5BMR087",
    benchmark: "S&P 500 Index", income: "Accumulating", currency: "USD",
    holdings: 504, holdingsDate: "4 September 2026", fee: "0.07%",
    scope: "US large-cap equities",
    story: "A US equity benchmark in a UCITS vehicle separates investment exposure from the markets where the product is distributed. Compare this focused portfolio with the wider MSCI World and FTSE All-World products.",
    question: "How are local disclosures and distribution reporting managed for a US-focused UCITS product?",
    source: "https://www.ishares.com/uk/individual/en/products/253743/ishares-sp-500-b-ucits-etf-acc-fund",
    publisher: "BlackRock / iShares",
  },
] as const;
