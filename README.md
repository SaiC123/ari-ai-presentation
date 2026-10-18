# Ari AI: HackATL Presentation

An animated, 15-slide HTML pitch for Ari AI.

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
- `docs/hackatl-master-presentation-prompt.md`: original design brief; later revisions are reflected in the HTML.

Customer-evidence placeholders, fictional founder figures, scripted prototype conditions, and forecasts are labeled in the deck and supporting notes.

## Deploy

This repository is a static site. Vercel serves the `public` directory with no build step. To deploy from a connected Vercel account:

```sh
vercel --prod
```

Edit `public/index.html` and redeploy to publish changes.

## Four-AI coordination

Every AI editor must read [AGENTS.md](AGENTS.md) and follow the [shared coordination protocol](coordination/README.md). Run the setup command in each clone, acquire the shared GitHub write lock before editing, and post BEFORE/AFTER messages. Keep the lock through push and deployment. This prevents participating editors from replacing each other's presentation changes.

## Monthly pilot forecast

Slide 12's forecast starts with five free Month 1 pilots and advances one month per click through Month 12. The active month highlights new accounts, conversion, churn and cash impact. Intake/churn are editable assumptions; conversion is a disclosed trial proxy. See `docs/pilot-forecast.md`. Run `node --test tests/pilot-forecast.test.cjs tests/presentation-navigation.test.cjs`.
## Prototype evidence slide

Slide 6 now advances from the customer profile to two evidence boxes, then to an enlarged email with its reported test result highlighted. Five supplied screenshots and their provenance are documented in `docs/prototype-feedback.md`. VC feedback remains pending. Run `python3 -m unittest discover -s tests -p test_prototype_feedback.py` to check the evidence assets and attribution.
