# ACV Load Board — Recreation Prompt

Build a two-page vehicle transport load board as a self-contained HTML/CSS/JS app (no frameworks, no external dependencies). Brand color is red `#d32f2f`. Background is `#f5f5f5`. Font: system sans-serif.

---

## Page 1: `index.html` — Job List

### Header
White bar, full width. Left: bold red logo "ACV Load Board". Center: nav links "Job List" (active, red underline) and "Manage". Right: user name + red "New" label.

---

### Search / Filter Section
White card with `1px #e0e0e0` border, `6px` radius. Three layers:

**Row 1 — Primary (always visible):**
Flex row with: `Pickup Location` text input, `Delivery Location` text input, red `Search` button. Inputs take equal flex space.

**Divider** — 1px `#e0e0e0` line.

**Row 2 — Quick Filters (always visible):**
Flex row, wraps on small screens. Contains these controls side by side:
- `Transport` select: Any / Open / Enclosed
- `Condition` select: Any / Operable / Inoperable
- `Vehicle Type` select: Any / Car/SUV / Truck / Van
- `Posted Within` select: Any Time / Last 1h / Last 6h / Last 24h / Last 3 days
- `Min $/mi` number input
- `Max $/mi` number input
- `⚙ More Filters` button — outlined, gray, turns red/light-red bg when active. Shows a small red badge pill with count of active advanced filters.

**Active Filters Bar (conditional):**
Light red `#fde9e9` bar below the search section. Shows dismissible pill tags for each active filter ("Transport: Open ✕"). "Clear All" button on the right. Hidden when no filters active.

---

### Advanced Filters — Side Panel
Triggered by "More Filters" button. A `360px` panel slides in from the right (`transform: translateX`) with a dark semi-transparent overlay behind it. Clicking the overlay closes the panel.

Panel has:
- **Header**: "Advanced Filters" title + ✕ close button
- **Scrollable body** with sections (each with an uppercase gray label + bottom border):
  - *Location Radius*: Pickup Radius (mi), Delivery Radius (mi) — 2-col grid
  - *Pickup Date Range*: From date, To date — 2-col grid
  - *Delivery Date Range*: From date, To date — 2-col grid
  - *Route Distance*: Min Miles, Max Miles — 2-col grid
  - *Shipper*: Shipper Name text (full width), then Min Rating select + Booking Type select (2-col)
- **Footer** (border-top): Reset button, Apply Filters (red, flex-grow), Save Search button

---

### Results Header
Between search and results list. Left: "247 available loads" (bold). Right: "Hide Map" / "Show Map" toggle button + Sort dropdown (Newest Posted / Price High→Low / Price Low→High / Distance).

---

### Results Layout
Two-column CSS grid: `1fr 380px`. Collapses to single column when map is hidden (via `.map-hidden` class toggled by the button).

**Left — Load List:**
Stack of load cards, `8px` gap.

**Right — Map Sidebar:**
Sticky, `calc(100vh - 48px)` tall. Light gray `#e8e8e8` background. Centered placeholder text "Interactive Map / 3 loads shown". Three red teardrop map pins with numbers at scattered positions. Hidden on mobile (`display: none`).

---

### Load Card
White card, `1px #e0e0e0` border, `4px` red left border accent, `2px 6px 6px 2px` radius. Hover: subtle shadow. Clicking navigates to `job-details.html`. Layout is a 4-column grid: `110px 1fr 1fr auto`.

**Column 1 — Price:**
- Large bold price ($850), centered
- `$0.40/mi` in small gray text below
- Badge row: `NEW` (blue pill) and/or time ago (`6h ago`, gray pill)

**Column 2 — Vehicle & Route:**
- Vehicle name: "2019 Dodge Charger" (bold, 14px)
- Meta line: "Black Pearl · Operable" (small gray)
- Specs row (small, gray, inline): `VIN 2C3CDXBG3KH541283 · Wt 4,046 lbs · Dim 197"×74"×57"` — labels in lighter gray, values in darker gray
- Route line: "West Palm Beach, FL 33401 `»` Seattle, WA 98101" — arrow is red
- Distance pill: gray `#f5f5f5` rounded pill showing "3,279 mi" below the route line

**Column 3 — Details:**
Label/value pairs in small text:
- `Pickup` Mar 16, 2026
- `Delivery` Mar 18, 2026
- `Transport` Open

**Column 4 — Actions:**
Stacked vertically:
- `Book` — red filled button
- `Negotiate` — red outline button
- Checkbox (accent-color red) at the bottom, used for compare selection

---

### Sample Load Data (3 cards):

| Field | Card 1 | Card 2 | Card 3 |
|---|---|---|---|
| Vehicle | 2019 Dodge Charger | 2020 Tesla Model X | 2018 Jeep Compass |
| Color·Condition | Black Pearl · Operable | Pearl White · Operable | Silver · Inoperable |
| VIN | 2C3CDXBG3KH541283 | 5YJXCDE21LF294817 | 3C4NJCBB5JT382049 |
| Weight | 4,046 lbs | 5,421 lbs | 3,374 lbs |
| Dimensions | 197"×74"×57" | 198"×79"×66" | 173"×72"×65" |
| Price | $850 | $1,200 | $650 |
| $/mi | $0.40/mi | $0.86/mi | $0.83/mi |
| Pickup | West Palm Beach, FL 33401 | Chicago, IL 60601 | Dallas, TX 75201 |
| Delivery | Seattle, WA 98101 | Miami, FL 33101 | Denver, CO 80201 |
| Distance | 3,279 mi | 1,377 mi | 784 mi |
| Pickup Date | Mar 16, 2026 | Mar 15, 2026 | Mar 14, 2026 |
| Delivery Date | Mar 18, 2026 | Mar 17, 2026 | Mar 16, 2026 |
| Transport | Open | Enclosed | Open |
| Badges | NEW · 2h ago | 4h ago | 6h ago |

---

### Compare Bar
Fixed to the bottom of the viewport. Hidden until at least one card checkbox is checked. White bar with top shadow. Left: "N vehicle(s) selected". Right: red "Compare Selected" button (links to `compare.html`) + gray ✕ close button that clears all checkboxes.

---

### JavaScript Behaviors
- Filter state tracked in a `activeFilterMap` object keyed by filter name
- Any filter change calls `applyFilter(key, value)` → updates map → re-renders active filter tags
- Removing a filter tag resets the corresponding input
- Advanced filter changes call `applyAdvancedFilter()` which also updates the badge counter on "More Filters" button
- Map toggle: toggles `.map-hidden` on the results layout, updates button label
- Checkbox: updates compare bar count and show/hide state

---

## Page 2: `compare.html` — Compare Loads

Same header/nav as index.html. Back link "← Back to Board" + page title "Compare Loads".

### Compare Table
Full-width HTML `<table>`. White background, `8px` radius, subtle shadow.

**Header row** (one column per vehicle):
- First column: "Category" label
- Each vehicle column: vehicle name (bold 15px), color·condition (small gray), big red price, small $/mi below

**Body rows** grouped by section. Each section starts with a full-width gray header row (uppercase, small, 11px). Row label column is light gray background.

Sections and rows:
- **Pricing**: Total Pay, Pay per Mile
- **Route**: Pickup (city/zip), Delivery (city/zip), Distance
- **Scheduling**: Pickup Date, Delivery Date, Transport (colored badges: blue=Open, purple=Enclosed)
- **Vehicle Details**: Condition (green=Operable, orange=Inoperable badges), VIN (monospace), Weight, Dimensions

**Best-value highlighting**: The winning cell in each numeric row gets `#2e7d32` green text + a small green `#e8f5e9` pill badge saying "Best", "Shortest", "Lightest", etc.

**Action row** (last row): Book (red filled) + Negotiate (red outline) buttons stacked per column.

---

## Design Tokens
- Brand red: `#d32f2f`, hover: `#b71c1c`
- Light red bg: `#fde9e9`
- Border: `#e0e0e0`
- Text primary: `#333`
- Text secondary: `#666`, `#999`
- Input focus ring: `0 0 0 2px rgba(211,47,47,0.1)`
- Font: `-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif`
- Border radius: `6px` (cards, inputs, buttons), `3px` (badges)
