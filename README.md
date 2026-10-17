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
