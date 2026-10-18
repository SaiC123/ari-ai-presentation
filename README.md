# Ari AI: HackATL Presentation

An animated, 18-slide HTML pitch for Ari AI.

## Present

Open the deployed site or `public/index.html` in a browser.

- Click or press Right Arrow, Space, or Enter to reveal the next step.
- Press Left Arrow or Backspace to rewind.
- Press N for speaker notes and F for fullscreen.
- Home and End navigate to the first and last slides.
- Slide URLs support a hash, such as `/#6`.

Fonts and Chart.js load from public CDNs, so an internet connection is needed.

## Files

- `public/index.html`: the presentation, styles, animations, and notes.
- `public/ari-ant-mark.png`: the Ari ant brand asset.
- `docs/hackatl-pitch-source-inventory.md`: sources and forecast assumptions.
- `docs/hackatl-evidence-needed.md`: remaining customer-validation evidence.
- `docs/hackatl-master-presentation-prompt.md`: current design brief and canonical source links.

Hypothetical founder figures, reported feedback, scripted prototype conditions, and forecasts are labeled in the deck and supporting notes.

## Deploy

This repository is a static site. Vercel serves the `public` directory with no build step. To deploy from a connected Vercel account:

```sh
vercel --prod
```

Edit `public/index.html` and redeploy to publish changes.

## Four-AI coordination

Every AI editor must read [AGENTS.md](AGENTS.md) and follow the [shared coordination protocol](coordination/README.md). Run the setup command in each clone, acquire the shared GitHub write lock before editing, and post BEFORE/AFTER messages. Keep the lock through push and deployment. This prevents participating editors from replacing each other's presentation changes.

## Monthly pilot forecast

Slide13 restores the user-approved42newpaid/month scenario with a citation directly below it: ChartMogul median24months to1,000B2Bsubscribers.42=round(1000/24) is a derived planning target, not a published monthly average or acquisition guarantee. ConditionalcashcoverageM2,recoveryM3,32Founderaccountthreshold;team-suppliedcosts retained. See docs/pilot-forecast.md.
## Prototype evidence slide

Slide6 shows the customer profile, slide7 the Ari logo, slides8–10 the solution and comparison, and slide11 the prototype workflow/verification. Slide12 follows with the five-email gallery and enlarged email with its reported result highlighted. Financials remain slide13. Five supplied screenshots and their provenance are documented in `docs/prototype-feedback.md`. VC feedback remains pending. Run `python3 -m unittest discover -s tests -p test_prototype_feedback.py` to check the evidence assets and attribution.

## Current pitch references

The18-slide deck has a438-word [speaker-script draft](docs/speaker-script.md), [pilot plan](docs/pilot-plan.md), [research checks](docs/research-validation.md), [cost sensitivities](docs/economic-sensitivity.md) and [originality disclosure](docs/originality-disclosure.md). [Exact rubric coverage](docs/presentation-coverage.md) and [remaining evidence](docs/hackatl-evidence-needed.md) are consolidated; forecasts and reported feedback are not measured traction.
