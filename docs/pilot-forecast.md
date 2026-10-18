# Ari pilot forecast

Researched October17,2026. Proposed scenario, not traction or probability-calibrated forecast.

## Current conservative pilot forecast

This baseline supersedes the42-new-paid/month scenario. Prices and allowances stay unchanged: Founder49.99/7, Growth129.99/20, Scale359.99/60. All modeled payers use Founder at full included usage; no upgrades assumed.

Five unpaid pilots in M1 cost661.50:500sharedtools plus161.50delivery.18.2%initialcohortconversion is an organic opt-in trial proxy from [FirstPageSage](https://firstpagesage.com/seo-blog/saas-free-trial-conversion-rate-benchmarks/), not measured Ari assisted-pilot conversion. It yields0.91expectedM2converts, actual0–5. Add **two new direct-paid accounts/month from M2**, an explicit founder-outreach planning target, not a research benchmark.2%monthlypaidchurn is a separate assumption. M2total2.91expectedpayers approximately matches the initial three-buyer adoption goal, but it does NOT mean3/5freepilots converted: about1is modeled from the free cohort and2from separate direct-paid acquisition. No ongoing free assessments for new prospects are modeled; add their cost before offering them.

The outreach target requires validation through contact→call→paid tracking, channel attribution and founder time. No evidence establishes2newpaid/month. It is a conservative planning choice, not statistically calibrated. Do not claim ChartMogul median time to1,000subscribers proves constant acquisition; that42/month arithmetic is not the baseline.

Free Founderunitcost32.30, paidunitcost34.04971, contribution15.94029. Monthly cash coverage requires32wholeactivepayingFounderaccounts. The12monthbaseline reaches **20.67expectedpayers in M12**, revenue1033.31, cost1203.82. Neither monthly coverage nor cumulative recovery occurs inYear1. **Peak cash funding need:4047.02 acrossYear1**, not an all-in launch budget or external funding request. Five new paid/month sensitivity reaches monthly coverage inM8, but cumulative recovery still not inYear1; do not present it as proven growth.

Delivery cost provenance:1.90API/run is team demo input, not independently measured production average. Sandbox1/run, AWS7/account and support/storage5/12/30 are unvalidated estimates; reconcile overlaps. Payment estimate2.9%+0.30 is for standard U.S. domestic online cards, not every payment method or country; fees vary. Source: https://stripe.com/pricing .

Proposed cost-validation gate: record every pilot assessment's repository size, tokens and billed API cost, retries, sandbox runtime, AWS allocation, stored evidence, support minutes, test/verification result and repair acceptance. Compare actual cohort contribution at full promised allowance before expanding; record founder support time even though salaries are excluded. This is a plan, NOT completed measurement or passed gate.

Excluded: founder compensation/labor, paid acquisition, taxes, legal/compliance, unmeasured onboarding and additional rechecks/overages.500monthly tools is not total cost. Fixed tooling and usage costs may rise; update from invoices. Maintain a cash runway cap and scope approval; no unlimited monitoring promise. No cost or growth values have been fabricated as observations.

Three forecast callouts: M1launch, M2conversion/acquisition plan, M12funding review. Full12months visible, no selectors or auto month playback; right panel displays current expected payers/cash. Coverage and recovery correctly say not inYear1.
## Twelve-month table

| Month | Free accounts | Expected paying accounts | Revenue | Cost | Monthly net | Cumulative net |
|---|---:|---:|---:|---:|---:|---:|
| M1 | 5 | 0.00 | $0.00 | $661.50 | $-661.50 | $-661.50 |
| M2 | 0 | 2.91 | | Month | Free accounts | Expected paying accounts | Revenue | Cost | Monthly net | Cumulative net |
|---|---:|---:|---:|---:|---:|---:|
45.47 | $599.08 | $-453.61 | $-1115.11 |
| M3 | 0 | 4.85 | $242.54 | $665.20 | $-422.66 | $-1537.77 |
| M4 | 0 | 6.75 | $337.67 | $730.00 | $-392.33 | $-1930.10 |
| M5 | 0 | 8.62 | $430.90 | $793.50 | $-362.60 | $-2292.70 |
| M6 | 0 | 10.45 | $522.26 | $855.73 | $-333.47 | $-2626.17 |
| M7 | 0 | 12.24 | $611.79 | $916.71 | $-304.92 | $-2931.09 |
| M8 | 0 | 13.99 | $699.54 | $976.48 | $-276.94 | $-3208.03 |
| M9 | 0 | 15.71 | $785.53 | | Month | Free accounts | Expected paying accounts | Revenue | Cost | Monthly net | Cumulative net |
|---|---:|---:|---:|---:|---:|---:|
035.05 | $-249.52 | $-3457.54 |
| M10 | 0 | 17.40 | $869.80 | | Month | Free accounts | Expected paying accounts | Revenue | Cost | Monthly net | Cumulative net |
|---|---:|---:|---:|---:|---:|---:|
092.45 | $-222.65 | $-3680.19 |
| M11 | 0 | 19.05 | $952.38 | | Month | Free accounts | Expected paying accounts | Revenue | Cost | Monthly net | Cumulative net |
|---|---:|---:|---:|---:|---:|---:|
148.70 | $-196.31 | $-3876.51 |
| M12 | 0 | 20.67 | | Month | Free accounts | Expected paying accounts | Revenue | Cost | Monthly net | Cumulative net |
|---|---:|---:|---:|---:|---:|---:|
033.31 | | Month | Free accounts | Expected paying accounts | Revenue | Cost | Monthly net | Cumulative net |
|---|---:|---:|---:|---:|---:|---:|
203.82 | $-170.51 | $-4047.02 |

## Reproduce

Calculation source: public/pilot-forecast.js. Table: [pilot-forecast.csv](pilot-forecast.csv). Regenerate with scripts/export_pilot_forecast.cjs and run Node model/navigation tests. Keep unrounded intermediates; format only display amounts. Expected accounts are fractional scenario values, not booked customers.
