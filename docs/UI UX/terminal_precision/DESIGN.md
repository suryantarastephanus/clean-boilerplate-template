---
name: Terminal Precision
colors:
    surface: '#131316'
    surface-dim: '#131316'
    surface-bright: '#39393c'
    surface-container-lowest: '#0e0e11'
    surface-container-low: '#1b1b1e'
    surface-container: '#1f1f22'
    surface-container-high: '#2a2a2d'
    surface-container-highest: '#353438'
    on-surface: '#e4e1e6'
    on-surface-variant: '#c3c6d7'
    inverse-surface: '#e4e1e6'
    inverse-on-surface: '#303033'
    outline: '#8d90a0'
    outline-variant: '#434655'
    surface-tint: '#b4c5ff'
    primary: '#b4c5ff'
    on-primary: '#002a78'
    primary-container: '#2563eb'
    on-primary-container: '#eeefff'
    inverse-primary: '#0053db'
    secondary: '#4edea3'
    on-secondary: '#003824'
    secondary-container: '#00a572'
    on-secondary-container: '#00311f'
    tertiary: '#ffb95f'
    on-tertiary: '#472a00'
    tertiary-container: '#996100'
    on-tertiary-container: '#ffeedd'
    error: '#ffb4ab'
    on-error: '#690005'
    error-container: '#93000a'
    on-error-container: '#ffdad6'
    primary-fixed: '#dbe1ff'
    primary-fixed-dim: '#b4c5ff'
    on-primary-fixed: '#00174b'
    on-primary-fixed-variant: '#003ea8'
    secondary-fixed: '#6ffbbe'
    secondary-fixed-dim: '#4edea3'
    on-secondary-fixed: '#002113'
    on-secondary-fixed-variant: '#005236'
    tertiary-fixed: '#ffddb8'
    tertiary-fixed-dim: '#ffb95f'
    on-tertiary-fixed: '#2a1700'
    on-tertiary-fixed-variant: '#653e00'
    background: '#131316'
    on-background: '#e4e1e6'
    surface-variant: '#353438'
typography:
    display-total:
        fontFamily: JetBrains Mono
        fontSize: 48px
        fontWeight: '700'
        lineHeight: 52px
        letterSpacing: -0.04em
    display-total-mobile:
        fontFamily: JetBrains Mono
        fontSize: 32px
        fontWeight: '700'
        lineHeight: 36px
        letterSpacing: -0.03em
    headline-lg:
        fontFamily: Inter
        fontSize: 24px
        fontWeight: '600'
        lineHeight: 28px
        letterSpacing: -0.02em
    headline-sm:
        fontFamily: Inter
        fontSize: 18px
        fontWeight: '600'
        lineHeight: 22px
        letterSpacing: -0.01em
    body-md:
        fontFamily: Inter
        fontSize: 14px
        fontWeight: '400'
        lineHeight: 18px
        letterSpacing: 0em
    body-sm:
        fontFamily: Inter
        fontSize: 12px
        fontWeight: '400'
        lineHeight: 16px
        letterSpacing: 0em
    data-lg:
        fontFamily: JetBrains Mono
        fontSize: 20px
        fontWeight: '600'
        lineHeight: 24px
        letterSpacing: -0.02em
    data-md:
        fontFamily: JetBrains Mono
        fontSize: 14px
        fontWeight: '500'
        lineHeight: 18px
        letterSpacing: -0.01em
    data-sm:
        fontFamily: JetBrains Mono
        fontSize: 11px
        fontWeight: '500'
        lineHeight: 14px
        letterSpacing: 0em
    label-key:
        fontFamily: JetBrains Mono
        fontSize: 12px
        fontWeight: '700'
        lineHeight: 14px
        letterSpacing: 0.06em
rounded:
    sm: 0.125rem
    DEFAULT: 0.25rem
    md: 0.375rem
    lg: 0.5rem
    xl: 0.75rem
    full: 9999px
spacing:
    gutter: 0.5rem
    gutter-tablet: 0.375rem
    margin: 0.75rem
    margin-tablet: 0.5rem
    space-xs: 0.25rem
    space-sm: 0.375rem
    space-md: 0.5rem
    space-lg: 0.75rem
    space-xl: 1rem
---

## Brand & Style

This design system is engineered for rapid, high-throughput retail checkout environments where latency, cognitive fatigue, and mis-taps directly impact store performance. The visual identity reflects industrial utility, tactical responsiveness, and unwavering clarity. It discards decorative ornamentation in favor of instant visual hierarchy, precise spatial chunking, and deterministic color codes.

The style combines **Tactile Precision** and **Information Density**:

- **Tone:** Professional, unflinching, alert, and utilitarian.
- **Audience:** Retail cashiers, inventory clerks, and floor managers operating under sustained physical and cognitive tempo across 8-hour shifts.
- **Emotional Impact:** High-speed confidence, muscle-memory predictability, zero ambiguity under fluorescent convenience-store lighting.

## Colors

The system uses a calibrated dark-mode default to prevent eye strain during long shifts while maximizing contrast for critical optical targets (barcodes, pricing, action triggers).

### Color Hierarchy & Roles

- **Base Canvas (`#09090b`):** The lowest layer, grounding non-interactive viewports.
- **Surface Elevation (`#18181b`):** Primary panel layer for operational tiles, order lines, and input clusters.
- **Surface High (`#27272a`):** Active selections, secondary keypads, and card containers.
- **Borders & Dividers (`#3f3f46`):** Precision 1px grid strokes defining tap zones and transaction rows.
- **Text Primary (`#ffffff`):** Strict high-contrast copy for SKU names, prices, and totals.
- **Text Muted (`#a1a1aa`):** Barcode subtexts, unit metrics, and metadata.
- **Primary Electric Blue (`#2563eb`):** The tactical execution color. Used strictly for checkout progression, active payment tenders, and primary confirmations.
- **Emerald Accent (`#10b981`):** Applied to finalized transactions, successful scanner reads, matched discounts, and cash drawer triggers.
- **Warm Amber (`#f59e0b`):** Reserved for promotions, manual price overrides, low inventory alerts, and verification holds.
- **Destructive Crimson (`#ef4444`):** Exclusive to line-voids, transaction cancellation, drawer balance shortfalls, and error states. Never used decoratively.

## Typography

The type stack pairs **Inter** for scanning textual SKU labels and UI controls with **JetBrains Mono** for numerical values, inventory quantities, prices, and shortcut markers.

- **Tabular Alignment:** JetBrains Mono enforces consistent character widths, guaranteeing numerical columns line up precisely at decimal points without visual drift.
- **Hierarchy Rules:** Running register totals use `display-total` to remain readable up to 2 meters away from the cashwrap. SKU titles utilize compact `body-md` with tightly clamped line-heights to fit dual lines within dense row layouts.

## Layout & Spacing

The viewport implements a dedicated **Split-Engine Grid** structured specifically for retail counter dynamics:

- **Desktop Layout (Wide Screens, 1080p+):** Fixed 60/40 Split.
    - **Left Rail (40% width, min 420px):** Transaction ledger, order lines, running subtotal, discount indicators, and execution CTA dock.
    - **Right Grid (60% width):** High-velocity touch panel, quick-catalog categories, numerical payment keypad, and search/barcode inputs.
- **Tablet Layout (Landscape 10"–12"):** Adaptive 50/50 Split. Item grid tiles scale down; padding tightens via `space-sm` and `gutter-tablet` to retain at least 16 quick-pick items above the fold.
- **Touch Targets:** While interior spacing is ultra-compact (`space-xs` and `space-sm`), active touch targets never drop below 44px x 44px to eliminate register entry errors.

## Elevation & Depth

This system intentionally eliminates traditional blurred drop shadows, which introduce optical softness and decrease boundary recognition on touch terminals. Visual hierarchy is established via **Tonal Stratification** and **High-Contrast Structural Outlines**:

- **Ground Level (`#09090b`):** Canvas background.
- **Panel Elevation 1 (`#18181b`):** 1px solid `#27272a` boundary. Used for the ledger frame and catalog background.
- **Interactive Component Elevation 2 (`#27272a`):** Interactive tiles, order rows, and inputs. Distinct 1px border (`#3f3f46`) ensures touch targets remain separated.
- **Active / Pressed State:** Physical inset border (2px solid `#2563eb` or `#ffffff`) with an instant 0ms background step-up to `#3f3f46`.
- **Modals / Critical Overrides:** Surface `#18181b` encased in an uncompromising 2px solid `#3f3f46` perimeter over a 75% opacity `#000000` hard backdrop blackout.

## Shapes

The design uses tight, near-brutalist geometry with a calibrated corner curve of `0.25rem` (4px).

- **Corners:** Kept sharp to maximize pixel utility and screen real estate on crowded displays.
- **Pills and Circles:** Strictly prohibited for functional containers. Circular treatments are permitted solely for terminal status indicator dots (e.g., scale online, scanner active, cash drawer connected).

## Components

### Buttons & Keypad Actuators

- **Primary Checkout Key:** Full-bleed base within the ledger rail. Background `#2563eb`, high-contrast white text, `label-key` hotkey marker (`ENTER / SPACE`), height 56px.
- **Quick-Pay Cash Buttons:** Distinct green-tinted baseline `#10b981` with black bold text for pre-set amounts (Exact, $10, $20, $50, $100).
- **Secondary Actions:** Solid `#27272a` tile with `#f4f4f5` text, 1px `#3f3f46` border. Hover/Tap activates instant switch to `#3f3f46`.
- **Destructive Line-Void:** Compact button with `#ef4444` border and text; active press floods `#ef4444` with white text.

### Ledger Order Row

- Height clamped at 48px per row.
- Left block: Quantity badge (solid `#27272a`, `data-md`), SKU description, item options/weight subtext.
- Right block: Tabular price (`data-md`) and instant delete strike trigger (`#ef4444`).
- Alternating subtle line separators: 1px `#27272a`.
- Selected Row: Surface shifts to `#27272a` with an electric blue 3px left-edge bar indicator.

### Quick-Pick Grid Tiles

- Aspect ratio 1:1 or 4:3 compact cards.
- Dark zinc background (`#18181b`), subtle `#27272a` border.
- Layout: Top-right displays price in `data-sm` emerald `#10b981`. Bottom displays SKU title clamped to 2 lines. High visual focus on inventory abbreviation letters.

### Input & Barcode Fields

- Monospaced typography default.
- Background `#09090b` with continuous high-visibility 1px `#3f3f46` border.
- Active scan focus: 2px solid `#2563eb` outline, blinking block cursor. Never displays default browser outline rings.

### Notification & Shift Indicators

- Compact chips floating in system bar.
- Status indicator dots: 6px solid circular indicators (Emerald for scanner synced, Crimson for disconnected scale, Amber for terminal in offline-buffer mode).
