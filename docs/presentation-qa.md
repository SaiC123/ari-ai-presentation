# Presentation QA and PR handoff

The October 17, 2026 QA pass is on `codex/presentation-qa-fixes`, in [PR 1](https://github.com/SaiC123/ari-ai-presentation/pull/1). It incorporates main commit `0306a51d9cb7a0c9779e3e0d9ea06f98da7e6ded`, including the latest pricing and monthly forecast. The requested series contains 50 nonempty commits after integration commit `fb9ae51672fd6f85ecab704995bd7254b4a49506`: 15 focused UI changes with regressions, one fixture extension, 33 additional regression commits, and this handoff.

## Behavior covered

- Invalid slide hashes recover without losing the active slide. Buttons, keyboard shortcuts, pointer regions, counters, progress, deep links, and staged rewind retain their behavior.
- Browser shortcuts, canceled events, text entry, IME composition, links, disclosures, and interactive descendants keep their native actions. Held notes/fullscreen shortcuts do not repeatedly toggle.
- The notes button exposes its expanded state. Opening notes focuses their named region; scrolling keys stay inside notes. N or Escape closes notes and restores focus to the toggle.
- Fullscreen has an accurate pressed state and label, serializes pending requests, disables unsupported controls, and announces rejected requests without an unhandled promise.
- Inactive slides and unrevealed content are inert. Explanation/finance panels and the closing recap follow their visible state.

## Repeatable checks

Run from the repository root:

```sh
rtk proxy node --test tests/presentation-navigation.test.cjs
rtk proxy python3 -m unittest discover -s tests -v
rtk proxy git diff --check
```

The 59 Node tests execute the actual inline script in a minimal DOM fixture. They cover navigation contracts and simulated browser API outcomes, including denied fullscreen entry/exit and a complete 17-slide tour. The Python integration test checks lock ownership, the push guard, coordination messages, and release. Fixture scaling tests check calculations for portrait and landscape dimensions; they do not verify mobile rendering.

For browser verification, serve `public/` locally and compare with the production URL. Use native buttons and keys. Check notes scrolling and Escape focus, fullscreen entry/exit, malformed hashes, each staged reveal in both directions, the roadmap during movement, and the settled final animation. Inspect console errors and broken images. Allow the final animation and charts to settle before assessing them.

## Recorded browser checks

- Candidate at 1280 by 720: all 75 slide/build states forward and all 75 backward matched the expected index/build, with exactly one active and exposed slide.
- Notes button focus, expanded state, Page Down isolation, and Escape restoration passed. Native fullscreen entry and exit passed; label and pressed state followed the browser.
- Sixty roadmap samples across forward and reverse transitions stayed within the deck, remained visible, and did not intersect visible roadmap cards. The final settled frame displayed the ant and ARI, with the recap hidden. No broken images or captured warning/error logs.
- A malformed hash change kept the current slide and repaired the URL. Initial malformed hashes are also covered by automated tests.
- Production slide 12 advanced through the monthly forecast and rendered its settled chart with the cost breakdown. No captured warning/error logs. The candidate retains the exact slide markup, notes, and chart code from the incorporated main commit, preserving financial values, research, and prototype claims.

This pass does not claim mobile layout, other browsers, screen-reader speech, chart hover tooltips, or every intermediate animation frame was tested. Rejected fullscreen outcomes were simulated in the fixture. The PR is unmerged and these QA fixes have not been deployed to production. After merging, follow the shared lock protocol and deploy the exact new main commit to the existing Vercel project.

## Pilot forecast follow-up

The later pilot-model pass incorporates main `68c054a`, preserving ai-2's visible-chart pointer-events fix. It changes slide 12's forecast, notes and narration as requested; the other 16 rendered slides are byte-identical to integration commit `172a6f4`. The earlier chart-code equivalence statement describes the earlier QA snapshot, not this model change. The user explicitly instructed this editor not to acquire locks, so this follow-up uses the PR branch without a shared lock.

There are now 76 Node tests: 12 model tests, five additional chart-wiring/control/fallback regressions, and the existing navigation coverage. An independent closed-form calculation reconciled all 12 CSV rows. At 1280 by 720, the browser rendered the base monthly graph, cumulative view and changed acquisition/conversion/churn scenarios; controls preserved build 3, build 4 hid and deactivated them, and rewind restored them. The chart and summary fit within the finance stage, with readable labels and no captured warning/error logs. Tooltip callbacks reconcile free costs and paid-only processing in automated tests; real mouse-hover tooltips were not retested in this pass. See [pilot-forecast.md](pilot-forecast.md) for assumptions, sources and limits.


## Monthly graph follow-up

Month reveals added on top of the existing pilot model. 79 Node tests pass. Chrome 1280×720 checked Month 1, Month 2, all twelve reveals, forward into budget, rewind to Month 12, and scenario changes at the selected month. At ten paid starts/month and zero churn, Month 8 highlights positive monthly cash while cumulative recovery remains pending. Monthly/cumulative switching retains the month; reduced motion sets chart interpolation to zero. Mobile scaling exercised at 390×844. No page errors captured. Initial visual inspection found stage clipping; the forecast layout was tightened and its old whole-chart wipe removed. A second screenshot pass confirmed the graph, narration and milestone panel fit; the assumptions footnote was then moved into the summary panel to avoid the stage edge. No production deploy or merge performed.


## Current fixed forecast playback

Supersedes the earlier interactive-control and click-per-month descriptions above. The full twelve-month monthly series is visible from entry, with fixed2newpaid/month,18.2%conversionproxy and2%churn. Month callouts advance on a timer without user clicks. Click/Next goes directly to budget; Left returns to unit economics. Re-entry restartsM1; leaving stops timers; reduced motion shows the full graph statically. Updated regressions cover full-series visibility, all12timedcallouts, no selectors, no duplicate timers, exit/re-entry, reduced motion, chart fallback and unchanged model arithmetic.


## Current benchmark-derived milestone interaction

Supersedes automatic month highlighting above. Three key forecast steps only: free-pilot launch, research-derived conversion/acquisition, monthly cash coverage. Full series always shown; no timers/dropdowns. Defaultintake42derivedfrom1000/24, not a published monthly average. Updated regressions assert M3coverage/M5recovery, citations, current right-panel users, full chart and milestone rewind/fallback.

## Current override: seven-assessment pricing and milestone forecast

## Current benchmark-derived pilot forecast

Proposed workspace plans: Founder $49.99 / 7 assessments, Growth $129.99 / 20, Scale $359.99 / 60. Effective included-assessment prices are $7.14, $6.50 and $6.00 respectively. Both monthly run and assessed-line limits apply; extra usage is not unlimited. These are pilot prices; future changes require measured delivery costs and customer-value validation.

Finance is slide13 in the18-slide deck. Initial cohort: five unpaid pilots in M1. All modeled paid accounts use Founder, with seven full assessments consumed monthly. No tier upgrades assumed. Conversion of18.2% gives0.91 expected initial-cohort payers in M2, not a fractional real customer. Actual conversion is0–5. Monthly paid churn2% is a separate unvalidated assumption.

[ChartMogul's Go-To-Market Report](https://chartmogul.com/reports/saas-go-to-market-report/) reports a median B2B time of about two years to1,000 subscribers across its SaaS sample. The approved planning intake is round(1,000/24) = **42 new paid accounts/month from M2**. This is a derived linear gross-intake scenario, **not a published monthly average**, matched acquisition benchmark, Ari traction or guarantee. Time-to-milestone does not imply constant acquisition; churn and the initial free period mean this scenario does not reach1,000 net subscribers by M24.

[FirstPageSage's trial report](https://firstpagesage.com/seo-blog/saas-free-trial-conversion-rate-benchmarks/) reports18.2% organic opt-in trial-to-paid conversion. This is not evidence for Ari's assisted pilots. The M2 conversion timing is assumed.

Shared fixed tools budget: $500/month. Free Founder account: $32.30 = $13.30 API + $7 sandbox + $7 AWS + $5 support/storage. M1: $500 + five × $32.30 = **$661.50**, with no revenue or payment fees. Paid Founder variable cost: **$34.04971**, including $1.74971 payment processing. Contribution: $15.94029; minimum monthly cash coverage: **32 whole active paying Founder accounts**.

With the approved42/month intake, monthly cash coverage occurs in **M2** at42.91 expected payers: revenue $2,145.07, cost $1,961.07, net $184.00. Earlier losses recover in **M3**. Peak modeled funding gap is **$661.50**, in M1. These are conditional cash-model outputs, not full-business profitability or proof of sustainable acquisition.

The full twelve-month graph is always visible. Three manual milestone callouts show M1 launch, M2 conversion/growth and monthly break-even (also M2 under current assumptions). The right panel shows users, revenue, cost and net. No month-by-month autoplay or selectors. Forward/rewind and reduced-motion states are tested.

Excludes founder pay/labor, taxes, legal/compliance, paid acquisition, onboarding labor, extra re-checks and unforeseen overages. API $1.90/assessment is team-reported demo usage, not an audited production average; sandbox, AWS and support allowances remain forecasts. Validate across repository sizes before selling. Future pilot price increases are not modeled. The100–200 customer growth target and market proxies are separate from break-even.

Finance narration: Our introductory workspace plans start at forty-nine ninety-nine for seven full assessments. Growth offers twenty for one hundred twenty-nine ninety-nine, and Scale offers sixty for three hundred fifty-nine ninety-nine. The effective price per included assessment falls as usage grows. These are pilot prices to validate demand, with future pricing based on measured costs and customer value. Our six-founder team budgets five hundred dollars monthly for shared tools, before customer delivery. Five unpaid pilots bring month-one costs to about six hundred sixty-two dollars. We use an eighteen-point-two percent trial-conversion proxy and derive forty-two new paid users monthly from ChartMogul’s two-year subscriber milestone. These are assumptions, not Ari results. On Founder-only pricing, this scenario covers monthly cash costs in month two at about forty-three paying users, and recovers earlier losses in month three. Founder pay, acquisition and extra usage are excluded.

## Current conservative pilot forecast

This baseline supersedes the42-new-paid/month scenario. Prices and allowances stay unchanged: Founder49.99/7, Growth129.99/20, Scale359.99/60. All modeled payers use Founder at full included usage; no upgrades assumed.

Five unpaid pilots in M1 cost661.50:500sharedtools plus161.50delivery.18.2%initialcohortconversion is an organic opt-in trial proxy from [FirstPageSage](https://firstpagesage.com/seo-blog/saas-free-trial-conversion-rate-benchmarks/), not measured Ari assisted-pilot conversion. It yields0.91expectedM2converts, actual0–5. Add **two new direct-paid accounts/month from M2**, an explicit founder-outreach planning target, not a research benchmark.2%monthlypaidchurn is a separate assumption. M2total2.91expectedpayers approximately matches the initial three-buyer adoption goal, but it does NOT mean3/5freepilots converted: about1is modeled from the free cohort and2from separate direct-paid acquisition. No ongoing free assessments for new prospects are modeled; add their cost before offering them.

The outreach target requires validation through contact→call→paid tracking, channel attribution and founder time. No evidence establishes2newpaid/month. It is a conservative planning choice, not statistically calibrated. Do not claim ChartMogul median time to1,000subscribers proves constant acquisition; that42/month arithmetic is not the baseline.

Free Founderunitcost32.30, paidunitcost34.04971, contribution15.94029. Monthly cash coverage requires32wholeactivepayingFounderaccounts. The12monthbaseline reaches **20.67expectedpayers in M12**, revenue1033.31, cost1203.82. Neither monthly coverage nor cumulative recovery occurs inYear1. **Peak cash funding need:4047.02 acrossYear1**, not an all-in launch budget or external funding request. Five new paid/month sensitivity reaches monthly coverage inM8, but cumulative recovery still not inYear1; do not present it as proven growth.

Delivery cost provenance:1.90API/run is team demo input, not independently measured production average. Sandbox1/run, AWS7/account and support/storage5/12/30 are unvalidated estimates; reconcile overlaps. Payment estimate2.9%+0.30 is for standard U.S. domestic online cards, not every payment method or country; fees vary. Source: https://stripe.com/pricing .

Proposed cost-validation gate: record every pilot assessment's repository size, tokens and billed API cost, retries, sandbox runtime, AWS allocation, stored evidence, support minutes, test/verification result and repair acceptance. Compare actual cohort contribution at full promised allowance before expanding; record founder support time even though salaries are excluded. This is a plan, NOT completed measurement or passed gate.

Excluded: founder compensation/labor, paid acquisition, taxes, legal/compliance, unmeasured onboarding and additional rechecks/overages.500monthly tools is not total cost. Fixed tooling and usage costs may rise; update from invoices. Maintain a cash runway cap and scope approval; no unlimited monitoring promise. No cost or growth values have been fabricated as observations.

Three forecast callouts: M1launch, M2conversion/acquisition plan, M12funding review. Full12months visible, no selectors or auto month playback; right panel displays current expected payers/cash. Coverage and recovery correctly say not inYear1.

Current finance script: Our pilot prices start at forty-nine ninety-nine. Growth costs an estimated eighty-one dollars to deliver, leaving a modeled thirty-eight percent contribution margin before shared costs. API usage comes from our demo assumption; infrastructure and support remain estimates. During five pilots, we will log billed tokens, sandbox runtime, storage and support time for every assessment. We will expand only after observing positive contribution at the promised allowance. Our conservative plan assumes two new paid accounts monthly, plus initial pilot conversions, not forty-two. It does not break even in year one: monthly coverage requires thirty-two Founder accounts, and the model needs about four thousand dollars of funding across the year. Founders initially fund operations and reinvest receipts. These figures exclude founder pay, paid acquisition and extra usage.

## Current user-approved growth scenario: 42 new paid accounts/month

Supersedes the two/month baseline. Founder49.99/7, Growth129.99/20 and Scale359.99/60 and team-supplied cost inputs are retained. No cost information needs to be resubmitted.

Citation immediately below42: [ChartMogul2025 Go-To-Market Report](https://chartmogul.com/reports/saas-go-to-market-report/) reports median B2B time of about24months to1,000subscribers.42=round(1000/24) is our derived linear **planning target**, NOT measured average monthly new customers, an acquisition guarantee or a matched Ari pilot benchmark. Separate2%monthlychurn andM1freeperiod mean this model does not replicate1,000netaccountsbyM24. No stronger direct benchmark for42found; do not invent one.

With18.2%initial-cohort conversion proxy, M2expectedpayers42.91, firstmonthlycashcoverageM2, cumulative recoveryM3, peakfundinggap661.50. Minimummonthlycoverage32wholeactiveFounderaccounts. These are conditional model outputs, not fullbusinessprofitability; founderpay,paidacquisition,extrausage/legal/taxes remain excluded. Full12monthseries and3keycallouts retained.

The adoption slide's three total paid is an initial pilot recruitment goal, separate from this expanded growth scenario, not3/5measuredconversion. Costs are the user's supplied planning breakdown, not a provider invoice audit; per-run measurement template remains available without claiming data collection has occurred. Latest Alan/ai4feedbackimages/date/highlight updates are preserved.

## All-slide evidence and rubric pass, October17–18,2026

This entry supersedes historical scope/script descriptions above. Same18-slide order, palette, original five feedback screenshots, pricing and approved42-new-paid planning scenario. Supporting source inventory/master brief now point to current canonical plans. Exact20 criterion names were supplied by Sai in coordination and mapped with attributed provenance in `presentation-coverage.md`; no score prediction.

Executed checks:13Python tests and81Node tests pass. Added script/role alignment, slide5 HTML attribute validity, evidence/planning labels, originality-permission attribution, and economic stress-case regressions. `git diff --check` passes. The forecast JavaScript and five screenshot binaries are unchanged from9059c3b; all five screenshot bytes also match the user's attached originals exactly.

Chrome at1280×720 exercised all18slides forward and backward through their builds, including finance's internal milestone steps. Changed slides were also exercised with reduced motion. No page errors were captured. Inspected26selected build screenshots and a960×540scaled view. The first inspection identified slide5 malformed attribute remnants and roadmap-card overlap with the ant; these were corrected, and the full navigation pass and visual checks repeated. The attack-chart screenshot was captured mid-reveal; its2.6second draw animation is retained. No product tests, demo rehearsal, timed human pitch or customer assessment was run.

Current non-demo script draft:438words; ai-2 owns subsequent script polishing. Production deployment is pending access to the existing Vercel project and handoff to ai-1; no production success is claimed by this QA entry.
