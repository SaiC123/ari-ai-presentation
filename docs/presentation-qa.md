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

## Superseded: five-pilot forecast

Proposed workspace plans: Founder $49.99 / 7 assessments, Growth $129.99 / 20, Scale $359.99 / 60. Effective included-assessment prices are $7.14, $6.50 and $6.00 respectively. Both monthly run and assessed-line limits apply; extra usage is not unlimited. These are pilot prices; future changes require measured delivery costs and customer-value validation.

Historical scenario only. It assumed five unpaid pilots in M1. This is superseded by the approved one-time cohort of 50 proposed free pilot workspaces in M1, then zero new free pilots from M2. Do not use this archived section for current slide figures.

[ChartMogul's Go-To-Market Report](https://chartmogul.com/reports/saas-go-to-market-report/) reports a median B2B time of about two years to1,000 subscribers across its SaaS sample. The approved planning intake is round(1,000/24) = **42 new paid accounts/month from M2**. This is a derived linear gross-intake scenario, **not a published monthly average**, matched acquisition benchmark, Ari traction or guarantee. Time-to-milestone does not imply constant acquisition; churn and the initial free period mean this scenario does not reach1,000 net subscribers by M24.

[FirstPageSage's trial report](https://firstpagesage.com/seo-blog/saas-free-trial-conversion-rate-benchmarks/) reports18.2% organic opt-in trial-to-paid conversion. This is not evidence for Ari's assisted pilots. The M2 conversion timing is assumed.

Historical scenario only: shared fixed tools budget $500/month and free Founder full-use cost $32.30. Under the superseded five-pilot assumption M1 cost was $661.50. Current M1 cost is $2,115 for 50 proposed free workspaces plus shared tools. Paid Founder variable cost remains $34.04971, contribution $15.94029, and monthly cash threshold 32 whole accounts.

Historical scenario only: with five pilots, 42 new paid/month and the other retained assumptions, M2 had 42.91 expected payers and cumulative recovery in M3. Current 50-pilot scenario has 51.10 expected M2 payers, conditional monthly coverage in M2, cumulative recovery in M4, and a $2,115 peak modeled funding gap. See `pilot-forecast.md` for canonical current outputs.

The full twelve-month graph is always visible. Three manual milestone callouts show M1 launch, M2 conversion/growth and monthly break-even (also M2 under current assumptions). The right panel shows users, revenue, cost and net. No month-by-month autoplay or selectors. Forward/rewind and reduced-motion states are tested.

Excludes founder pay/labor, taxes, legal/compliance, paid acquisition, onboarding labor, extra re-checks and unforeseen overages. API $1.90/assessment is team-reported demo usage, not an audited production average; sandbox, AWS and support allowances remain forecasts. Validate across repository sizes before selling. Future pilot price increases are not modeled. The100–200 customer growth target and market proxies are separate from break-even.

Finance narration: Our introductory workspace plans start at forty-nine ninety-nine for seven full assessments. Growth offers twenty for one hundred twenty-nine ninety-nine, and Scale offers sixty for three hundred fifty-nine ninety-nine. The effective price per included assessment falls as usage grows. These are pilot prices to validate demand, with future pricing based on measured costs and customer value. Our six-founder team budgets five hundred dollars monthly for shared tools, before customer delivery. Five unpaid pilots bring month-one costs to about six hundred sixty-two dollars. We use an eighteen-point-two percent trial-conversion proxy and derive forty-two new paid users monthly from ChartMogul’s two-year subscriber milestone. These are assumptions, not Ari results. On Founder-only pricing, this scenario covers monthly cash costs in month two at about forty-three paying users, and recovers earlier losses in month three. Founder pay, acquisition and extra usage are excluded.

## Superseded: conservative two-new-paid/month pilot forecast

This baseline supersedes the42-new-paid/month scenario. Prices and allowances stay unchanged: Founder49.99/7, Growth129.99/20, Scale359.99/60. All modeled payers use Founder at full included usage; no upgrades assumed.

Five unpaid pilots in M1 cost661.50:500sharedtools plus161.50delivery.18.2%initialcohortconversion is an organic opt-in trial proxy from [FirstPageSage](https://firstpagesage.com/seo-blog/saas-free-trial-conversion-rate-benchmarks/), not measured Ari assisted-pilot conversion. It yields0.91expectedM2converts, actual0–5. Add **two new direct-paid accounts/month from M2**, an explicit founder-outreach planning target, not a research benchmark.2%monthlypaidchurn is a separate assumption. M2total2.91expectedpayers approximately matches the initial three-buyer adoption goal, but it does NOT mean3/5freepilots converted: about1is modeled from the free cohort and2from separate direct-paid acquisition. No ongoing free assessments for new prospects are modeled; add their cost before offering them.

The outreach target requires validation through contact→call→paid tracking, channel attribution and founder time. No evidence establishes2newpaid/month. It is a conservative planning choice, not statistically calibrated. Do not claim ChartMogul median time to1,000subscribers proves constant acquisition; that42/month arithmetic is not the baseline.

Free Founderunitcost32.30, paidunitcost34.04971, contribution15.94029. Monthly cash coverage requires32wholeactivepayingFounderaccounts. The12monthbaseline reaches **20.67expectedpayers in M12**, revenue1033.31, cost1203.82. Neither monthly coverage nor cumulative recovery occurs inYear1. **Peak cash funding need:4047.02 acrossYear1**, not an all-in launch budget or external funding request. Five new paid/month sensitivity reaches monthly coverage inM8, but cumulative recovery still not inYear1; do not present it as proven growth.

Delivery cost provenance:1.90API/run is team demo input, not independently measured production average. Sandbox1/run, AWS7/account and support/storage5/12/30 are unvalidated estimates; reconcile overlaps. Payment estimate2.9%+0.30 is for standard U.S. domestic online cards, not every payment method or country; fees vary. Source: https://stripe.com/pricing .

Proposed cost-validation gate: record every pilot assessment's repository size, tokens and billed API cost, retries, sandbox runtime, AWS allocation, stored evidence, support minutes, test/verification result and repair acceptance. Compare actual cohort contribution at full promised allowance before expanding; record founder support time even though salaries are excluded. This is a plan, NOT completed measurement or passed gate.

Excluded: founder compensation/labor, paid acquisition, taxes, legal/compliance, unmeasured onboarding and additional rechecks/overages.500monthly tools is not total cost. Fixed tooling and usage costs may rise; update from invoices. Maintain a cash runway cap and scope approval; no unlimited monitoring promise. No cost or growth values have been fabricated as observations.

Three forecast callouts: M1launch, M2conversion/acquisition plan, M12funding review. Full12months visible, no selectors or auto month playback; right panel displays current expected payers/cash. Coverage and recovery correctly say not inYear1.

Historical script for the superseded two-new-paid/month sensitivity. Do not present as current narration. Current slide13 script is in `speaker-script.md`.

## Superseded: user-approved growth scenario before 50-pilot revision

Supersedes the two/month baseline. Founder49.99/7, Growth129.99/20 and Scale359.99/60 and team-supplied cost inputs are retained. No cost information needs to be resubmitted.

Citation immediately below42: [ChartMogul2025 Go-To-Market Report](https://chartmogul.com/reports/saas-go-to-market-report/) reports median B2B time of about24months to1,000subscribers.42=round(1000/24) is our derived linear **planning target**, NOT measured average monthly new customers, an acquisition guarantee or a matched Ari pilot benchmark. Separate2%monthlychurn andM1freeperiod mean this model does not replicate1,000netaccountsbyM24. No stronger direct benchmark for42found; do not invent one.

This historical variant used five initial free pilots: M2expectedpayers42.91, conditional monthly cash coverageM2, cumulative recoveryM3, and peak funding gap$661.50. It is superseded. The current 50-pilot figures and presentation checks are documented in `pilot-forecast.md` and the latest QA entry below.

The adoption slide's three total paid is an initial pilot recruitment goal, separate from this expanded growth scenario, not3/5measuredconversion. Costs are the user's supplied planning breakdown, not a provider invoice audit; per-run measurement template remains available without claiming data collection has occurred. Latest Alan/ai4feedbackimages/date/highlight updates are preserved.

## All-slide evidence and rubric pass, October17–18,2026

This entry supersedes historical scope/script descriptions above. Same18-slide order, palette, original five feedback screenshots, pricing and approved42-new-paid planning scenario. Supporting source inventory/master brief now point to current canonical plans. Exact20 criterion names were supplied by Sai in coordination and mapped with attributed provenance in `presentation-coverage.md`; no score prediction.

Executed checks:13Python tests and81Node tests pass. Added script/role alignment, slide5 HTML attribute validity, evidence/planning labels, originality-permission attribution, and economic stress-case regressions. `git diff --check` passes. The forecast JavaScript and five screenshot binaries are unchanged from9059c3b; all five screenshot bytes also match the user's attached originals exactly.

Chrome at1280×720 exercised all18slides forward and backward through their builds, including finance's internal milestone steps. Changed slides were also exercised with reduced motion. No page errors were captured. Inspected26selected build screenshots and a960×540scaled view. The first inspection identified slide5 malformed attribute remnants and roadmap-card overlap with the ant; these were corrected, and the full navigation pass and visual checks repeated. The attack-chart screenshot was captured mid-reveal; its2.6second draw animation is retained. No product tests, demo rehearsal, timed human pitch or customer assessment was run.

At ai-4 handoff:438-word short alignment draft. ai-2 subsequently polished the canonical speaker script to661 prepared words (697 with hyphenated compounds split), including the brief demo introduction but excluding the full demo. Public slide notes were not rewritten. Production deployment is pending access to the existing Vercel project and handoff to ai-1; no production success is claimed by this QA entry.

## Coordinated Sarosh script and slide-note alignment

After Sarosh's `5383790` script handoff, ai-4 aligned all18`data-spoken` attributes and SPOKEN note passages verbatim to the651slide words. The10-word Vihaan introduction remains in the script at the demo boundary. All REFERENCE blocks remain identical, and removing note/spoken attributes from the before/after HTML produces byte-identical content: visuals, navigation, images, costs and model behavior were untouched.

13Python and81Node tests pass; the existing script regression now also enforces exact slide/script/note equality. Chrome checks confirmed all18note panels show the corresponding full slide note, N opens, Escape closes, and the longer finance note scrolls within the viewport (682px visible,779px content at1280×720). Finance notes screenshot inspected;0page errors. `git diff --check` passes. No timed rehearsal or production deployment is claimed. The661-word prepared script's preliminary-pitch timing constraint remains explicit in the timing guide.

## Email key-result highlighting

User clarified to highlight key results, rather than numeric dates/times. Added yellow CSS overlays to all five original previews and tightened Jordan's enlarged check marker; emphasized the full check quote. Original screenshot files, all spoken/reference notes and other17slide sections remain unchanged. Four existing prototype-feedback tests pass; diff check passes. Chrome1280×720 gallery/focus and five individual previews visually inspected, rewind checked, overlay bounds checked at960×540, reduced-motion near-zero duration retained,0page errors. These are presentation markers over reported outcomes, with no image-pixel edits or new numerical claims. Deployment handoff required to ai-1's existing project access.

## Live review and readable email results

User reported that the highlights were not visible after redeployment. Inspected production atd8b23a4: all five overlays were present and correctly positioned, but were too thin at gallery size. Corrected slide12 with five16px verbatim result excerpts on solid yellow, plus the full Jordan quote in dark text on yellow. Enlarged the gallery container and adjusted local spacing. Screenshot originals, all notes/script and other17slide sections preserved.

13Python tests anddiffcheckpass. Chrome localgallery/focus inspected after the correction; five individual preview markers, forward/rewind,960×540containment and reducedmotion checked with0pageerrors. The earlierlivegallery/focus were also inspected to identify the presentation-size visibility failure. Production publication of this correction remains pending; no updated-live claim.

## Slide12 supplied portrait integration

Added the user's unmodified `IMG_9889.png` as `public/feedback/video-call.png`, beside Jordan's featured email in the existing second reveal.220×477portrait panel preserves the complete image with object-fit:contain; email width/height and marker coordinates adjusted locally. Large highlighted quote and attribution remain readable. No identity or testimonial inferred from the photo. The five-email gallery and existing two-build navigation are retained.

13Python tests pass;diffcheckpasses. Chrome1280×720featured composition inspected, originalfivepreview markers/rewind/960×540scaledcontainment/reducedmotion checked,0pageerrors. Newasset byte-identical to supplied original; onlyslide12markup changed andallspoken/reference attrs unchanged. Other17slides/model untouched. Commit/push requested; deployment remains a separate existing-project handoff.

## Second call screenshot on slide12

Converted supplied `IMG_2538.heic` to1206×2622PNG using sips and added it as `public/feedback/video-call-2.png`. Both call images appear uncropped in matched212×460panels on the right of the existing featured-email reveal. Email/quote left width664px; quote uses balanced wrapping; marker is relative to full email-image dimensions for stable alignment. No new identities or claims added, no new slide/build.

13Python tests pass anddiffcheckpasses. Chrome gallery/focus/rewind/reducedmotion checked with0pageerrors; final1280×720 and960×540captures inspected, bothimagesload/object-fitcontain, portraits fitviewport and do not overlap quote. Onlyslide12markup changed; allspoken/reference attrs and other17slides retained,includingai-2's latestslide10. NewassetmatchesconvertedPNGbytes;originalHEIC read-only. Production publication not claimed.

## Replacement Jordan email screenshot

Replaced `public/feedback/jordan.png` byte-for-byte with the latest user-supplied screenshot in both slide12 views. Four markers now follow the new reported20minutes,400response,78regressiontests and12newinjectiontests. Gallery excerpt and large verbatim quote updated; attribution explicitly says staging; reference note corrects superseded merged/parameterized-query wording and treats the few-hours alternative as the sender's estimate. Both call photos retained; no new outcome execution claimed.

13Python tests pass, including updated exact-quote provenance assertion;diffcheckpasses. Chrome gallery/focus screenshots visually inspected,8gallerymarkers/4featuredmarkers,rewind/scaledcontainment/reducedmotion checked with0pageerrors. Newimagebytes matchattachment;onlyslide12section changed,allspokenattrs unchanged. Commit/push requested;production publication not claimed.

## Call conversations moved to the end of slide10

User corrected placement fromslide12toslide10and clarified this was pitch feedback without Ari use. Addedslide10build3as a full-screen founder/developer conversation view with both supplied images, user-provided backgrounds and casual paraphrases of their general positive reaction, monitoring differentiation and vibe-coding relevance. No fabricated quotes, trials or specific experiences added. Footer distinguishes pitch feedback, proposed monitoring and simulation-only Defense Lab. Slide12photos removed and full-width highlighted email restored. Spoken script unchanged.

13Python+81Node tests pass anddiffcheckpasses; updated existing landscape staging assertion forbuild3. Chrome verifiedslide10builds0/1/2/3,inert/aria states,counter10/18,forward11,rewind10final/priorbuild,desktop/scaledphotoandfooterbounds,reducedmotion,restoredslide12maxbuild1andnophotos;0pageerrors. Desktop call view and slide12email view visually inspected. Other16slide sections untouched;18slide count retained. No timed rehearsal, product test or production publication claimed.

## Call reveal redesign, email cleanup and Defense Lab copy

User requested a professional call layout, removal of email highlighter effects and removal of repeated Defense Lab simulation wording. Slide10nowuses square CSS face crops without phoneUI/blackbars, compact bios and one shared reported takeaway. No assets were pixel-edited or quotes fabricated. Slide12has no marker spans, yellowmark tags or duplicate gallery excerpts; the featured result is a plain quote. Slide9 labels Defense Lab a research prototype and describes modeled/evaluated defensive choices; SPOKEN notes and canonical narration match, retain no autonomous production actions. Slide10footerno longer repeats DefenseLabscope. Detailed implementation scope remains accurate in source/product documentation.

Final13Python+81Node tests pass,diffcheckpasses. Chrome confirms18slides,slide10build0–3/inert/forward11/rewind/scaled/reducedmotion and portrait/footerfit;slide12gallery/focus/rewind has0highlight elements;slide9research label visible;0pageerrors. Desktopcalls,cleangallery,emailfocus,DefenseLab and scaledcallview inspected. First verification caught a section-boundary edit and one-word script-budget overrun; both corrected before the final passing checks. Spoken budget remains658/700compound-split. Source comparison confirms onlyslides9/10/12 sections changed and all image/model assets retained. Mechanical layout scan reports pre-existing whole-deck spacing warnings; no unrelated redesign performed. Production not claimed.

## Closing-slide footer removed

Per the user's screenshot request, removed both visible design-partner ask lines beneath the Ari mark onslide18 and their unused CSS. Finale logo/animation, recap, navigation and prepared narration remain unchanged. Five presentation-evidence tests anddiffcheckpass;Chrome finalbuild8confirmedonlyARItextinsidebrandfinale,andclosingstatecaptured/inspected. No deployment claim.

## Aarav label and stronger shared feedback

The user clarified Aarav is the non-GT participant/former Kairo intern. Changed his heading to Stanford student and role to Former intern at Kairo Securities; adjusted alt/reference copy. Replaced shared paragraph with two concise points on continuous monitoring as the pitch differentiator and AI-assisted coding making ongoing checks timely. No invented individual experiences or product use. Eight targeted presentation/rubric tests anddiffcheckpass;Chrome desktop/scaled label,2bullets andfooterfit checked,desktop screenshot inspected. Assets,script,other17slides and allnavigation unchanged.

## Shared takeaway reformatted without bullets

User rejected the lower What they liked section and asked for a different visual structure. Replaced the heading/list/divider/standalone caption with one charcoal strip matching Ari's established comparison palette: More AI-written code → Continuous monitoring, short supporting lines and one reported-pitch takeaway. Portraits/bios/top section retained, no fabricated details added. Eight targeted rubric/evidence tests anddiffcheckpass. Chrome1280/960stripbounds/overflow,absenceofoldlist/footer,rewind2→3and0pageerrors checked;desktop/scaledcaptures inspected. Onlyslide10sectionchanged;allspoken/referenceattrs,assets,script/model/other17slides unchanged. No deployment claim.

## Defense Lab live-defense positioning

User explicitly confirmed a newer live deployment with live signals/active defense, while saying a URL/run reference was unavailable during their debugging. Based on that owner confirmation, slide9nowlabelsDEFENSELAB/LIVEDEFENSEanddescribesobservingliveactivity,recommendingadefensiveresponseandlearningfromoutcomes. Canonicalspokenpassage/notesaligned;no simulationwording inpublicHTML. Team-confirmedstatusandlackofindependentdeploymentverification are recorded in source notes. Earlier research-only product README was inspected; no production code was changed or live run executed. No inventeduptime/effectiveness/autonomous-control claims.

Eight targeted evidence/rubric tests anddiffcheckpass. Chrome1280/960LiveDefenseheading/processfits checked,desktop/scaled screenshots inspected. Prepared script657words,699compound-split. Onlyslide9visuals/spokenpassageand10referencenotechanged;assets/model/other16slides preserved. Publication pending existing-project editor;notclaimeddeployed.

## One-time 50-pilot cohort forecast update

Current proposal: 50 free pilot workspaces in M1 for usage data and feedback; no new free pilots begin in M2 or later. Full-use M1 delivery is $1,615 plus $500 shared tools, totaling $2,115. The 18.2% conversion input remains an outside proxy, not Ari evidence; modeled expected conversion is 9.1 accounts. The separate 42-new-paid/month figure remains an arithmetic planning target, not observed acquisition. Conditional monthly cash coverage is M2; cumulative recovery moves to M4. Slide13 narration and accessible forecast, adoption/roadmap notes, source inventory, operating plan, CSV and forecast docs were aligned.

Verification: 81 Node navigation/model tests and 13 Python tests pass; `git diff --check` passes; the forecast export regenerates with M1 free cohort 50, M1 total cost $2,115, monthly coverage M2, and cumulative recovery M4. Word-budget regression confirms the prepared script is 700 words under its compound-splitting counter. Browser/deployment checks are not claimed in this entry.

## Three-layer overview and dedicated Defense Lab slides

The current deck has20slides. Slide8 gives the three-column product overview; slide9 retains the seven-agent spotlight builds and HackATL contribution; slide10 gives code-change monitoring plus reinforcement learning training/evaluation in simulation and the security/availability balance. The red/blue team moves to11 with its redundant monitoring/Defense Lab reveal removed. Competitors are12, prototype13, reported email evidence14, finance15, market16, adoption17, roadmap18, team19 and finale20. Header numbers, notes, script, coverage and timing references follow that order. Existing price/cost/model inputs, feedback assets and other slide content are retained.

The script is652whitespace-separated words,694with compounds and decimal values split, including Vihaan’s introduction and excluding the full demo.81Node navigation/model tests and13Python tests passed; the navigation tour now reads the actual slide build counts. Speaker/notes equality, prototype/evidence/finance order, three overview columns and explicit RL simulation scope passed. Diff check passed. No product assessment, training run, customer outreach or timed rehearsal was performed.

Live1280×720browser inspection covered the three-column overview, agent entry and Scout spotlight, contribution reveal, Defense Lab entry/final balance state, forward transition to red/blue teams, and rewind restoring Defense Lab build3. All20slides are present. The initial visual inspection found the feedback-loop return path crossing node labels; it was rerouted around the outside. The Vercel preview required sign-in, so the public production URL was used for visual inspection after publication.

## Supplied Defense Lab visual

Added the user's unmodified2380×1556PNG as `public/prototype/defense-lab-recorded.png`. Slide10build4 displays it in a large contained frame after the explanatory diagram. The whole image, including its isolated-test-network/recorded-evaluation label and playback controls, is preserved. It is a static capture of step0, with the defender watching Payments; the image is not treated as a newly executed evaluation or evidence of attack prevention. Narration and the20-slide order remain unchanged. The added image matches the source SHA-256 exactly.81Node navigation/model tests,13Python tests anddiffcheckpass.

## Code reviewer → seven agents → Defense Lab

The latest user request supersedes the screenshot-only Defense Lab reveal. The deck has21slides: overview8, new code reviewer9, seven agents10 and Defense Lab11. Reviewer and Defense Lab screenshots each stay beside three short explanatory points, with click highlights. The supplied code-review image is preserved byte-for-byte as `public/prototype/code-review-intent.png`; its ownership-check example connects codebase context and intended behavior with behavioral tests and security handoff. Defense Lab explains24/7code-change monitoring, RL strategy training in simulation and the availability tradeoff beside the recorded network image. No new product execution is claimed.

The rest of the pitch content is retained with updated numbers. Narration now has696compound-split words and653whitespace-separated words, including Vihaan's introduction; all21spoken notes match it.81Node navigation/model tests and13Python tests passed, including revised ordering and screenshot/explanation checks. The new PNG's SHA-256 matches the supplied file; diff check passed. Financial-model inputs and exported forecast values were not changed.

## Proof-first product details and Defense Lab evaluation

Slide11 now uses animated comparison bars and large result cards, with the supplied screenshot as supporting context rather than a screenshot-only build. The full results are visible from entry; three clicks highlight compromise, uptime and containment. Metrics were checked against the existing product protocol-v1 table, not rerun:1500held-out simulated episodes,7.1%compromise versus100%no defense,94.4%simulated service uptime,25.6steps mean containment versus158.3rules. The75%false-disruption tradeoff, recommendations-only scope and simulation caveat are visible and spoken. Methodology and confidence intervals are recorded in `docs/defense-lab-evidence.md`.

Slides8–12 include intended behavior from docs/comments/tests, a reproducible test, minimal repair, role-limited tools, isolated app copies, proof handoff and human approval. Docker versus local-driver isolation is clarified in reference notes. Slide5 states the daily-change/review-capacity problem without asserting unsupported prevalence. Narration is shortened to682compound-split words,643whitespace words including Vihaan's handoff; all21notes and speaker assignments match. Financial-model files remain unchanged.

81Node tests and13Python tests passed. On production at1280×720, reviewer9 and Defense Lab11 were visually inspected; all explanation/result containers had equal client/scroll heights and widths, so no overflow was detected. Defense Lab's three builds advanced into12correctly. The proof caption on12was raised after inspecting the transient navigation controls. No product assessments, model evaluations or timed rehearsal were executed by this editor.
