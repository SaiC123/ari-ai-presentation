# Ari: six-founder pilot operating plan

Researched October 17, 2026. Proposed planning model, not verified invoices. Current model replaces the former staffed-budget assumption. Pricing and packaging are proposed, not validated demand.

## Fixed monthly planning budget

| Item | Basis | Monthly |
|---|---|---:|
| Claude Team Standard | Six separate seats at $25, monthly billing | $150 |
| ChatGPT Business including Codex | Six separate seats at $25, monthly billing | $150 |
| Vercel Pro | Six deploying seats at $20; base fee includes first seat | $120 |
| Custom domain allowance | Provisional; registrar, TLD and renewal invoice not confirmed | $10 |
| Operating contingency | Planning reserve for small overages/incidentals, not a provider quote | $70 |
| **Total fixed planning budget** | **Before product API/customer delivery costs, taxes and unexpected overages** | **$500** |

Founder salaries are $0 during pilots under the agreed policy. Revenue covers operating costs first; surplus is reinvested. Founder compensation begins only when funding or recurring revenue supports it. This does not value founder labor at zero or promise permanent unpaid work.

Claude and Codex subscriptions are development tools with usage limits. They do not include the separately billed Claude API used by Ari's product agents. Additional capacity, premium seats and taxes are not assumed free. No subscriptions, hosting changes or domain purchases have been made.

Vercel counts deploying seats, not just team size. This model intentionally budgets all six founders as deployers; if fewer need paid deployment permissions, revise that line accordingly without sharing logins. GitHub Free/public-repository collaboration and existing personal email are assumed; paid GitHub, business email, legal/accounting, insurance or compliance services must be added if required.

The domain allowance is not an actual IONOS quote. The user wrote “ios”; registrar and domain extension remain unconfirmed. Domain registration is commonly paid annually; divide the actual renewal invoice by 12 for monthly planning rather than relying on an introductory promotion.

## Expanded assessment plans

Proposed monthly workspace subscriptions, not per-seat prices. Founder: $49.99 for10 full assessments and1M assessed source lines; Growth: $249 for25 assessments and5M lines; Scale: $599 for60 assessments and20M lines. Pools are shared across connected repositories. Each repeat assessment counts source volume again. Exclude generated/vendor/dependency code. Both assessment and line allowances apply. Enterprise scope, code volume and onboarding negotiated. Core code review, seven-agent investigation and fix verification included. Monitoring and re-check work remain separately budgeted, not unlimited continuous protection. Extra scoped assessment $25 needs volume and budget approval. The initial five free pilots are a scoped user plan, not an open-ended trial entitlement. No invented integration, SSO or staffed support entitlement.

Structure inspired by [Kairo pricing](https://kairo.security/pricing), observed October17,2026, for explicit shared usage, code volume and enterprise scope, not copied quantities or prices. Ari's complete assessments are not equivalent to lightweight PR reviews. Routine review counts are not sold as a separate unlimited entitlement.

## Forecast delivery cost per customer/month

Assume all included full assessments are consumed. API $1.90/run is team-reported demo usage, not an audited production average and not validated across larger repositories. Sandbox $1/run and support/storage $5/$12/$30 remain forecasts and may be inadequate at expanded usage. AWS $7/account is the team's allocation, not an independently verified bill; check no overlap with reserves/storage. Payment assumption2.9%+0.30.

| Item | Founder | Growth | Scale |
|---|---:|---:|---:|
| Price | $49.99 | $249 | $599 |
| Full assessments | 10 | 25 | 60 |
| API | $19 | $47.50 | $114 |
| Sandbox reserve | $10 | $25 | $60 |
| Payments | $1.74971 | $7.521 | $17.671 |
| Support/storage | $5 | $12 | $30 |
| AWS allocation | $7 | $7 | $7 |
| **Total modeled cost** | **$42.74971** | **$99.021** | **$228.671** |
| **Contribution before fixed costs** | **$7.24029** | **$149.979** | **$370.329** |
| **Contribution margin** | **14.5%** | **60.2%** | **61.8%** |

Founder is an entry pilot price with only about14.5% modeled contribution margin before shared costs. It is vulnerable to unmeasured support or usage costs and is not a proven sustainable acquisition strategy. Higher tiers support greater usage. They are not validated willingness to pay or a claim that larger codebases cost the same as the demo. Benchmark across representative repositories and set per-run scope/budgets before launch. The $25 extra-assessment price is only a scoped proposal, not an uncapped custom pentest offer.

## Pilot cash coverage and funding

The current monthly graph is Founder-only; it uses the 70-account threshold below. The older mixed-tier calculation in this paragraph is a separate sensitivity, not the new pilot forecast.

At assumed40%Founder/45%Growth/15%Scale mix: revenue221.896/customer/month; modeled deliverycost95.959984; contribution125.936016; margin56.75%. Cashcost500+95.959984×customers; revenue221.896×customers. Coverage500/125.936016=3.97 ->approximately4 blendedcustomers. At10customers: revenue2218.96, modeledcashcost1459.59984. Founder-only contribution7.24029 means500/7.24029=69.06 ->70 Founder customers. The assumed mix is not actual traction and cannot be represented exactly by four customers.

This is pilot cash coverage, not full economic profitability. Actual four-customer tier mix differs from a smooth blend. Excludes founder salaries/labor, taxes, legal/compliance, extra developer credits, unmeasured monitoring/re-check usage and unexpected overages. At20extra re-checks capped at3APIeach, up to60extraAPI moves blended coverage to5, before other overhead.3is a cap not average. RLnoClaudeAPI doesnotmean zeroCPU. No additional Railway production baseline is added on top of AWS.

Six founders, no hiring and no initial salaries. Founder-funded pilots; customer receipts first cover costs, surplus reinvested. No unsupported external fundraising ask;500/month is a planning budget, not all-in startup launch cost.

## Twelve-month pilot forecast

The slide 12 graph now follows the user's initial cohort: five free pilots in Month 1; new pilots pay $49.99/month from Month 2. It uses only Founder pricing, with no assumed Growth/Scale upgrades. Two new paying pilots/month and 2% monthly paid churn are explicit planning assumptions. First Page Sage's 18.2% organic opt-in trial conversion average is a proxy for the initial cohort, giving 0.91 expected conversions in Month 2, not a guaranteed customer or a pilot-retention average. Timing in Month 2 is assumed. The slide offers 5% and 21.9% conversion sensitivities, with different source populations disclosed in notes.

Five free accounts at $41 each plus $500 shared tools cost $705 in Month 1, with no revenue or payment fees. Paid cost stays $42.74971/account and contribution $7.24029. Monthly coverage therefore needs about 70 whole active Founder accounts once free pilots end. The former 40/45/15 blended acquisition scenario and M3 crossing are superseded for this graph.

The base case has about20.67 expected paying accounts in M12: $1,033.31 revenue, $1,383.65 total cost, $350.34 monthly shortfall. Peak Year 1 cash funding is $5,244.57. Neither monthly coverage nor cumulative recovery is reached within 12 months; no later date is invented. Fractional expected accounts are not actual customers.

See [pilot-forecast.md](pilot-forecast.md) for primary-source links, population/timing limits, formulas, scenarios and exclusions, [pilot-forecast.csv](pilot-forecast.csv) for all 12 monthly rows, and `public/pilot-forecast.js` for the calculation source. Research: [a16z initial design-partner cohort guidance](https://a16z.com/a-framework-for-finding-a-design-partner/), [First Page Sage trial conversion](https://firstpagesage.com/seo-blog/saas-free-trial-conversion-rate-benchmarks/), [ChartMogul 2026 no-card trial conversion](https://chartmogul.com/reports/saas-conversion-report/). None is a measured monthly acquisition or selected-pilot retention benchmark for Ari.

## Replacement financial script

We start with five free pilots in month one, then charge new pilots forty-nine ninety-nine. A trial conversion benchmark suggests about one of those first five might pay. That is a proxy, not Ari evidence. Our twelve-month model includes the cost of free pilots, new paid customers and churn. At two new paid pilots per month, we do not cover costs in year one. Monthly coverage needs about seventy active Founder customers. Recovering earlier losses takes longer. Change the assumptions to test the path.

## Official pricing sources

- Claude Team Standard: https://claude.com/resources/articles/claude-team-updates . $25/seat/month on monthly billing; $20 equivalent with annual discount. Usage limits and additional capacity apply.
- ChatGPT Business including Codex: https://learn.chatgpt.com/docs/pricing . $25/user/month billed monthly; $20 equivalent billed annually, with at least two users. Product API billing remains separate.
- Vercel Pro: https://vercel.com/docs/plans/pro-plan . $20 platform fee includes one deploying seat; additional deploying seats $20 each. Extra usage and taxes can apply; hosting is not unlimited or guaranteed merely by buying Pro.
- Domain-price context only: https://www.ionos.com/domains/domain-names . Exact registrar/TLD/renewal not confirmed; the $10 planning allowance is not sourced as the user's actual bill.

OpenAI Docs was used to verify the six-seat Codex/Business subscription cost and the distinction between subscription usage and product API charges.
