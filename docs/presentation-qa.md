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
