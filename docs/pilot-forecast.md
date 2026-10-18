# Ari pilot forecast

Researched October 17, 2026. This is a proposed planning scenario, not traction or a probability-calibrated forecast.

## Assumptions

- Plans: Founder $49.99 / 7 assessments, Growth $129.99 / 20, Scale $359.99 / 60. Both assessment and source-line limits apply. These are pilot prices, subject to validation.
- The first month includes 50 free pilot workspaces to collect usage data and feedback. This is a proposed cohort, not 50 signed or active pilots. No new free pilots are added from month two onward.
- The model uses Founder accounts at full seven-assessment usage, no tier upgrades, 2% monthly paid churn, and $500/month shared tools.
- An 18.2% opt-in organic trial-to-paid rate from [FirstPageSage](https://firstpagesage.com/seo-blog/saas-free-trial-conversion-rate-benchmarks/) is used only as a proxy for the assisted pilot cohort. It implies 9.1 expected conversions from 50; it is not Ari evidence and actual outcomes must be whole accounts.
- [ChartMogul's Go-To-Market Report](https://chartmogul.com/reports/saas-go-to-market-report/) reports a median of about 24 months to 1,000 B2B subscribers in its SaaS sample. The model's 42 new paid accounts/month from M2 is round(1,000/24), a derived linear planning target, not a published monthly average, matched acquisition benchmark, Ari traction, or guarantee. Churn and the M1 free cohort mean this does not imply 1,000 net subscribers by M24.

## Unit costs and break-even

Free Founder full-use delivery cost is $32.30/month: $13.30 API + $7 sandbox + $7 AWS + $5 support/storage. M1 therefore models $1,615 delivery for 50 workspaces plus $500 shared tools, totaling **$2,115**, with no revenue or payment fees. The peak modeled funding gap is $2,115.

Paid Founder variable cost is $34.04971 including estimated payment fees, leaving $15.94029 contribution before the $500 shared tools and excluded labor. Monthly cash coverage requires 32 whole active Founder accounts. Under the 42-new-paid/month planning scenario, monthly cash coverage is conditional in M2; cumulative recovery of the initial gap is conditional in M4. These are scenario outputs, not proof of sustainable acquisition or full-business profitability.

Delivery inputs are not audited production costs: $1.90 API/run is team-reported demo usage; sandbox, AWS, and support allocations are estimates. Founder pay/labor, paid acquisition, taxes, legal/compliance, onboarding labor, extra re-checks, and overages are excluded. Collect consented pilot measurements before treating costs, conversion, or acquisition assumptions as validated.

## Twelve-month scenario

| Month | Free accounts | Expected paying accounts | Revenue | Cost | Monthly net | Cumulative net |
|---|---:|---:|---:|---:|---:|---:|
| M1 | 50 | 0.00 | $0.00 | $2,115.00 | -$2,115.00 | -$2,115.00 |
| M2 | 0 | 51.10 | $2,554.49 | $2,239.94 | $314.55 | -$1,800.45 |
| M3 | 0 | 92.08 | $4,602.98 | $3,635.23 | $967.75 | -$832.70 |
| M4 | 0 | 132.24 | $6,610.50 | $5,002.61 | $1,607.89 | $775.19 |
| M5 | 0 | 171.59 | $8,577.87 | $6,342.65 | $2,235.22 | $3,010.41 |
| M6 | 0 | 210.16 | $10,505.89 | $7,655.88 | $2,850.01 | $5,860.42 |
| M7 | 0 | 247.96 | $12,395.35 | $8,942.85 | $3,452.50 | $9,312.92 |
| M8 | 0 | 285.00 | $14,247.03 | $10,204.08 | $4,042.94 | $13,355.86 |
| M9 | 0 | 321.30 | $16,061.67 | $11,440.09 | $4,621.58 | $17,977.44 |
| M10 | 0 | 356.87 | $17,840.01 | $12,651.38 | $5,188.64 | $23,166.08 |
| M11 | 0 | 391.73 | $19,582.79 | $13,838.44 | $5,744.36 | $28,910.43 |
| M12 | 0 | 425.90 | $21,290.72 | $15,001.76 | $6,288.96 | $35,199.40 |

The expected account counts are fractional scenario values, not booked customers. M2 includes 9.1 expected conversions from the M1 cohort plus the separate 42-account paid-intake assumption. The full twelve-month series is shown without autoplay or selectors.

## Reproduce

Calculation source: `public/pilot-forecast.js`. Export: [pilot-forecast.csv](pilot-forecast.csv). Regenerate with `scripts/export_pilot_forecast.cjs`, then run the model and navigation tests. Keep unrounded intermediates and format only display amounts.
