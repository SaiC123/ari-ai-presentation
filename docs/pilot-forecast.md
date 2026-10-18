# Ari pilot forecast

Researched October 17, 2026. This is a conditional planning model, not traction or a probability-calibrated prediction. It replaces the former six-month blended-tier graph on slide 12. Prices, included assessments, market sizing, and prototype evidence are unchanged.

## User plan and planning inputs

| Input | Base | Status |
|---|---:|---|
| Free pilots in Month 1 | 5 | User instruction; one cohort only |
| New pilots from Month 2 | Paid at $49.99/month | User instruction; Founder price |
| New paying pilots per month, M2 onward | 2 | Planning assumption, not a measured monthly startup average |
| First free cohort to paid | 18.2% | External trial proxy, not Ari pilot retention |
| Paid customer churn per month | 2% | Sensitivity assumption; not measured or sourced retention |
| Shared monthly cash budget | $500 | Retained planning budget; not verified invoices |
| Full assessments/account/month | 10 | Retained Founder allowance; assumed consumed by free pilots too |
| Forecast horizon | 12 months | No break-even dates extrapolated past it |

New acquisition is separate from conversion of the original five free pilots. New paying pilots start contributing revenue in Month 2. A single conversion event is assumed at the beginning of Month 2, after the free month. There are no further free cohorts, no automatic upgrades, and no blended Growth/Scale revenue. Converted and newly paid accounts start facing churn the following month. All months represent full service months and all receipts are assumed collected that month.

## Research and fit

- [a16z, A Framework for Finding a Design Partner](https://a16z.com/a-framework-for-finding-a-design-partner/), September 14, 2022: recommends an initial group of 5–10 design partners. This is cohort-size guidance, not a monthly acquisition average. The two-new-paid-per-month input is our own scenario.
- [First Page Sage, SaaS Free Trial Conversion Rate Benchmarks](https://firstpagesage.com/seo-blog/saas-free-trial-conversion-rate-benchmarks/), September 5, 2025: reports 18.2% average organic opt-in trial-to-paid conversion. Its agency sample contains 86 SaaS companies, 71% B2B and 29% B2C, from Q1 2022 to Q3 2025. The industry table gives cybersecurity 21.9%, but does not isolate trial mechanics. We use 18.2% as the opt-in proxy and 21.9% only as sensitivity. Neither measures Ari's selected, assisted pilots or establishes when they will convert.
- [ChartMogul, The Conversion Report](https://chartmogul.com/reports/saas-conversion-report/), February 4, 2026: its survey of 200 software products reports a 4–6% “good” range for no-card trials, described as a 50th-percentile guide. Its outcome window is conversion within six months. The 5% sensitivity is the midpoint of that range, not a published average of one-month pilots. Different cohorts and definitions explain why these figures cannot be pooled into one rate.

There is no matched pilot-conversion average in these sources. The 18.2% figure is a transparent substitute until Ari measures its own. Five times 18.2% is 0.91 expected payers, approximately one. Actual results are integer counts from zero to five; the forecast does not promise even one conversion. Applying the proxy in Month 2 is an explicit timing assumption. Conversion is a one-time free-to-paid transition, while paid retention is a separate recurring process. The 2% monthly paid churn assumption means 98% monthly paid retention, not 98% free-pilot conversion.

## Cost and revenue model

Retained full-usage delivery assumptions per account: API $19 (10 × $1.90), sandbox $10 (10 × $1), AWS allocation $7, support/storage $5. These total **$41** before payment processing. Free pilots incur these costs and no processing fee. Five free pilots therefore cost $205, plus $500 shared tools: **$705 total in Month 1, with $0 revenue**.

Paid processing is 2.9% × $49.99 + $0.30 = $1.74971 per paying account. Paid variable cost is **$42.74971** and contribution is **$7.24029**. These are retained forecast assumptions, not newly verified provider costs. Free onboarding may require additional human effort not costed here.

For month t:

```text
Free_t = 5 in Month 1, otherwise 0
Converted_t = 5 × conversion in Month 2, otherwise 0
NewPaid_t = chosen monthly intake from Month 2, otherwise 0
Paid_t = Paid_(t-1) × (1 − churn) + Converted_t + NewPaid_t
Revenue_t = Paid_t × 49.99
Cost_t = 500 + (Free_t + Paid_t) × 41 + Paid_t × 1.74971
Net_t = Revenue_t − Cost_t
CumulativeNet_t = sum of Net through month t
```

The white cost line includes all six components: shared tools, API, sandbox, AWS, payments and support/storage. Both free and paid service costs are included; payment fees apply only to payers. The presentation shows one fixed monthly revenue/cost base case. Cumulative totals remain in the summary and model, not a selectable chart view. Tooltips show account expectations and reconcile the costs. The screen-reader description includes the full monthly table.

**Monthly coverage** is the first modeled month with revenue at least that month's cash cost. Once the free cohort ends, this requires ceil($500 / $7.24029) = **70 actual active paying Founder accounts**. The fractional expected-value model is not a count of actual contracts. **Cumulative recovery** also repays earlier modeled losses. **Funding needed** is the largest cumulative cash deficit, not necessarily the final deficit and not an external fundraising ask.

The base case reaches neither milestone in Year 1. Its largest deficit is **$5,244.57**. Month 12 has about 20.67 expected paying accounts, $1,033.31 revenue, $1,383.65 cost, and a $350.34 monthly shortfall. These outputs are conditional arithmetic, not a forecast confidence interval. Higher conversion, higher paid intake, lower costs, or different plan adoption would change them. No assumptions are selectable on the slide. Alternative scenarios can still be calculated offline, not presented as achieved sales.

## Reproduce and inspect

The single calculation source is `public/pilot-forecast.js`. The base monthly table is in [pilot-forecast.csv](pilot-forecast.csv). Regenerate it and run the checks from the repository root:

```sh
rtk proxy node scripts/export_pilot_forecast.cjs
rtk proxy node --test tests/pilot-forecast.test.cjs tests/presentation-navigation.test.cjs
```

Do not round accounts or intermediate costs before calculating totals. The CSV retains eight decimals and display values round afterward. The model tests separately cover free-account cost, no free payment fees, conversion timing, recurring churn, no-intake failure to break even, monthly versus cumulative crossings, peak funding, and invalid inputs.

The model excludes founder salaries and labor, taxes, legal/compliance, paid acquisition, setup labor, extra monitoring/re-checks and unexpected overages. It assumes unchanged prices, shared-tool seats, full assessment usage, and no setup purchases or receivables delays. The API demo average, AWS allocation, support allowance and production usage still require validation. Replace intake, conversion, paid churn and costs with observed cohort data after launch. The five free pilots do not imply interviews, product validation, or deployments have already happened.


## Month-by-month presentation

The full twelve-month graph is shown immediately. No forecast selectors or nested click-per-month states remain. Fixed assumptions are five free M1 pilots,18.2% conversion proxy,+2newpaid/monthfromM2 and2%monthlychurn. All12monthly data points stay visible while a highlight/callout automatically progresses fromM1toM12 (2.6secondsinitialhold,1.8secondsperfollowingmonth). It stops atM12. Callouts show original free-cohort conversion, new paid users, churn and monthly receipts/cost/net plus cost change/cumulative gap. Click goes directly to the shared budget; Left returns to unit economics. Leaving the slide/build stops timers, re-entry restartsM1. Reduced motion shows the full chart with staticM1callout and no timer. Monthly auto-updates do not trigger screen-reader live announcements. The full accessible table remains available.

The base case remains two new paid pilots/month, an assumption. The primary sources reviewed do not establish an average monthly acquisition count for comparable prelaunch cybersecurity startups. a16z recommends five to ten **initial** design partners, not five to ten per month. First Page Sage reports 18.2% organic opt-in free-trial conversion from 86 SaaS companies; this is a proxy for the initial cohort, not measured assisted-pilot conversion. ChartMogul's 200-product survey provides a different six-month conversion population. No monthly intake rate is claimed as a research finding.

At ten new paid pilots/month and zero paid churn (an illustrative faster scenario), the retained model covers monthly costs in Month 8, while cumulative losses remain unrecovered within Year 1. This alternative remains an offline scenario; the pitch shows the disclosed base case only. Do not present this scenario as an expected sales forecast.
