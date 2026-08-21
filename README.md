# EV Comparison — Zeekr 7X · BYD Sealion 7 · Tesla Model Y · Mercedes EQA · BMW iX1 · Audi Q6 e-tron

A single-page, side-by-side comparison of ten electric SUVs:

| Brand | Model | Trim |
| ----- | ----- | ---- |
| Zeekr | 7X | RWD (base) |
| Zeekr | 7X | Long Range RWD |
| Zeekr | 7X | Performance AWD |
| BYD | Sealion 7 | Premium (base) |
| BYD | Sealion 7 | Performance AWD |
| Tesla | Model Y | RWD |
| Tesla | Model Y | Long Range AWD |
| Mercedes-Benz | EQA 250+ | FWD |
| BMW | iX1 | xDrive30 |
| Audi | Q6 e-tron | quattro |

The page compares **specs, features and indicative pricing** across pricing,
performance, battery/range/charging, dimensions/practicality and
comfort/technology.

## Running it

It's a static site with no build step and no dependencies. Open `index.html`
directly, or serve the folder:

```bash
python3 -m http.server 8000
# then visit http://localhost:8000
```

## Files

- `index.html` — page structure
- `styles.css` — styling (dark, responsive)
- `app.js` — renders the cards and comparison table from the dataset
- `data.js` — the vehicle dataset (`VEHICLES`, `SPEC_GROUPS`) — **edit here**
- `build.js` — inlines the CSS/JS into a single self-contained file
- `ev-comparison.html` — generated single-file version (open directly, works offline)

## Single-file version

`ev-comparison.html` bundles the CSS, data and JavaScript into one file with no
dependencies — handy for opening directly (double-click) or sharing. It is
**generated**, so don't edit it by hand. After changing any source file, run:

```bash
node build.js
```

This regenerates `ev-comparison.html` from `index.html` + `styles.css` +
`data.js` + `app.js`, so the multi-file and single-file versions stay in sync.

## Features

- Summary cards per vehicle with headline price / power / 0–100 / range
- Grouped comparison table (sticky header + sticky spec-label column)
- **Highlight best values** toggle — flags the strongest value per row
  (higher power/range, lower price/0–100 time, etc.)
- **Only show rows that differ** toggle — hides identical rows
- Fully responsive; horizontal scroll on small screens

## Data & caveats

Figures are manufacturer / WLTP claims collated from public sources
(manufacturer sites, EV-Database, EVKX, zecar) as of mid-2025. Prices are
indicative **Australian RRP (AUD, before on-road costs)** shown so all five
models can be compared like-for-like — local pricing, range, trim names and
standard equipment vary by market. Always confirm current specs and pricing
with the manufacturer before purchase.

To edit the data, update `data.js` — no other changes are needed.
