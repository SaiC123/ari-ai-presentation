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

## Customer delivery model supplied by the team

| Monthly, per customer | Founder | Growth | Scale |
|---|---:|---:|---:|
| Price | $39 | $99 | $249 |
| Included assessments | 2 | 4 | 10 |
| Claude API, $1.90 per reported demo assessment | $3.80 | $7.60 | $19.00 |
| Sandbox/infrastructure forecast reserve | $2 | $4 | $10 |
| Estimated payment processing | $1.431 | $3.171 | $7.521 |
| Support/storage forecast allowance | $5 | $12 | $30 |
| Base modeled cost | $12.231 | $26.771 | $66.521 |
| User-supplied AWS platform allocation | $7 | $7 | $7 |
| **AWS-adjusted modeled cost** | **$19.231** | **$33.771** | **$73.521** |
| **Contribution before fixed budget** | **$19.769** | **$65.229** | **$175.479** |
| **Modeled contribution margin** | **50.7%** | **65.9%** | **70.5%** |

The $7 AWS share is a user-provided allocation, not an independently verified AWS quote or a measured marginal cost. It is counted once in customer delivery cost, not again in the $500 fixed budget. No simultaneous Railway production charge is added. Confirm that AWS platform costs are distinct from the sandbox reserve and storage allowance; if they overlap, reconcile against the bill. A shared AWS bill may not scale linearly with customer count, particularly at very low volume.

## Cash-coverage scenario

Retain the 40% Founder / 45% Growth / 15% Scale mix:

- Average monthly revenue: $97.50/customer.
- AWS-adjusted modeled delivery cost: $33.9175/customer.
- Contribution before fixed costs: $63.5825/customer, or 65.21%.
- Planned cash cost: $500 + $33.9175 × customers.
- Planned revenue: $97.50 × customers.
- Arithmetic coverage point: $500 / $63.5825 = 7.86, rounded up to approximately eight blended customers.
- At ten blended customers: modeled monthly cash cost $839.18 and revenue $975.

This is pilot cash coverage, not full economic profitability. It excludes founder pay, taxes, one-time legal/compliance setup, unbudgeted development-tool credits and extra product re-check volume. An actual eight-customer tier mix can differ from the assumed blend. The supplied $3 push re-check cap is a maximum API budget, not an average or included subscription entitlement. Twenty additional capped re-checks could add up to $60 API cost alone and move cash coverage to approximately nine blended customers. Define usage budgets/paid overages before offering ongoing reassessment.

## Funding policy

Remove the $750K raise from the current pitch unless the team supplies a separate, justified use-of-funds plan. Current plan: founder-funded pilots, customer receipts reinvested, no external hiring. The $500 budget is $6,000/year before customer delivery costs and exclusions; it is not a claim that $6,000 funds every aspect of launching a security company.

## Proposed packaging

Workspace subscriptions, not per-seat charges. Monthly pools: 2/4/10 full assessments and 100K/500K/2M assessed source lines. Allowance is shared across connected repositories; proposed plans do not cap connection count, but do cap assessment and source usage. Each repeated assessment counts source lines again; exclude generated/vendor/dependency code. All tiers include the core review, seven-agent investigation and fix-verification workflow. Monitoring and extra work require explicit budgets; continuous unlimited re-checks are not an entitlement. $25/scoped extra assessment is a proposed price requiring volume and budget approval. Validate support and execution costs before promising arbitrary repository sizes. Enterprise assessment scope, code volume and onboarding are negotiated.

Structure inspired by the official [Kairo pricing page](https://kairo.security/pricing), accessed October 17, 2026: its packaging makes shared usage and code volume explicit and separates custom enterprise scope. Ari does not copy Kairo's review quantities, pricing, integrations, SSO, compliance or staffed support promises. Ari's full assessments are not equivalent to lightweight pull-request reviews. Packaging and enforcement need pilot validation.

## Replacement financial script

Our proposed plans are thirty-nine, ninety-nine and two forty-nine dollars a month. Every plan includes code review, seven-agent assessments and fix verification. Teams share assessment and code-volume allowances across connected repositories; extra work needs budget approval. Growth costs about thirty-four dollars per customer, leaving about sixty-five before shared costs. With our five-hundred-dollar monthly pilot budget, around eight customers at our assumed mix cover modeled cash costs. Founders take no salaries initially and reinvest surplus. Pricing, usage and production costs still need pilot validation.

## Official pricing sources

- Claude Team Standard: https://claude.com/resources/articles/claude-team-updates . $25/seat/month on monthly billing; $20 equivalent with annual discount. Usage limits and additional capacity apply.
- ChatGPT Business including Codex: https://learn.chatgpt.com/docs/pricing . $25/user/month billed monthly; $20 equivalent billed annually, with at least two users. Product API billing remains separate.
- Vercel Pro: https://vercel.com/docs/plans/pro-plan . $20 platform fee includes one deploying seat; additional deploying seats $20 each. Extra usage and taxes can apply; hosting is not unlimited or guaranteed merely by buying Pro.
- Domain-price context only: https://www.ionos.com/domains/domain-names . Exact registrar/TLD/renewal not confirmed; the $10 planning allowance is not sourced as the user's actual bill.

OpenAI Docs was used to verify the six-seat Codex/Business subscription cost and the distinction between subscription usage and product API charges.
