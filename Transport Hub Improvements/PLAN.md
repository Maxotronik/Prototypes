# Transport Hub Build Plan

## Problem
Monolithic single-file HTML becomes expensive to regenerate as it grows. Claude rewrites the entire file on every change, causing timeouts and 400 errors on long responses.

## Solution: Modular File Architecture

Split the project into focused files. Each file is small enough to be generated or edited independently. No single write operation exceeds a safe output size.

---

## File Structure

```
Transport Hub Improvements/
├── index.html          # Shell only — loads CSS + JS, renders layout skeleton
├── styles/
│   ├── base.css        # Variables, reset, typography, body
│   ├── layout.css      # Header, container, grid structure
│   ├── table.css       # Vehicle list table + rows + pagination
│   ├── cards.css       # Stepper, badges, status, ETA cells
│   ├── modal.css       # Modal shell, header, body sections
│   └── map.css         # Map container + route + markers
├── components/
│   ├── notifications.js  # Notification panel logic
│   ├── table.js          # Table rendering + filtering + search
│   ├── modal.js          # Modal open/close + section rendering
│   └── map.js            # Simulated map + route + live marker
└── data/
    └── mock.js           # All sample vehicle data in one place
```

---

## Build Sequence

Each step is a single, bounded task. Complete and verify one before starting the next.

### Step 1 — Base & Layout
- `base.css`: CSS variables, reset, typography
- `layout.css`: header, container, stats grid, controls row
- `index.html` shell: loads all files, renders skeleton

### Step 2 — Data Layer
- `data/mock.js`: all vehicle objects with realistic status scenarios
- Covers all 4 statuses, multiple origin types, operable flags

### Step 3 — Vehicle Table
- `table.css`: table structure, row styles, ETA cell, status badges
- `cards.css`: stepper, badges, vehicle info cell
- `components/table.js`: render, filter by status, search, pagination

### Step 4 — Modal Shell + Order Info
- `modal.css`: modal overlay, content, header, section layout
- `components/modal.js`: open/close, populate from vehicle object
- Sections: Order Info, Vehicle Details, Documents, Addresses, Contacts

### Step 5 — Status Stepper (Full)
- Inside `modal.js`: full 4-stage stepper with timestamps
- Handles all 4 status states dynamically from vehicle data

### Step 6 — Map Component
- `map.css`: map container, route line, markers, labels
- `components/map.js`: simulated route visualization, pulsing live marker
- Scoped to the modal — no external API dependency

### Step 7 — Notifications
- `components/notifications.js`: notification panel, badge count, event list
- Tied to vehicle status changes in mock data

### Step 8 — Polish & Responsive
- Review across steps, tighten spacing, test responsive breakpoints
- Final pass on transitions and micro-interactions

---

## Rules During Build

1. **Never rewrite a whole file when editing** — always use targeted edits
2. **Keep each JS component under ~150 lines** — split if it grows larger
3. **All data lives in `mock.js`** — components never hardcode data
4. **Build one step at a time** — verify in browser before moving forward
5. **CSS files stay scoped** — no cross-file specificity conflicts
