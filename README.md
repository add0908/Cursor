# EV Comparison — Zeekr 7X · BYD Sealion 7 · BMW iX1

A single-page, side-by-side comparison of five electric SUVs:

| Brand | Model | Trim |
| ----- | ----- | ---- |
| Zeekr | 7X | RWD (base) |
| Zeekr | 7X | Performance AWD |
| BYD | Sealion 7 | Premium (base) |
| BYD | Sealion 7 | Performance AWD |
| BMW | iX1 | xDrive30 |

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
- `data.js` — the vehicle dataset (`VEHICLES`, `SPEC_GROUPS`)

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
