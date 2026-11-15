# First-Step Coach UI Refactor

Refactor the First-Step Coach frontend into a modular React and TypeScript web application that blends an airy pastel grid backdrop with a luminous sky gradient, rounded minimalist surfaces, light and dark mode support, tactile animations, subtle haptic feedback, and a collapsible completed steps trail—while keeping the existing `/api/chat` coaching contract unchanged.

## User Review & Critical Decisions

> [!IMPORTANT]
> All Phase 1 clarifying choices are locked in below and override any conflicting initial defaults. The existing `/api/chat` client request format and response handling are preserved without modifying or adding backend files.

- **Platform & Implementation**: Modular React and TypeScript web application inside the existing Vite workspace for live preview across mobile and desktop resolutions.
- **Visual Direction**: Blended composition combining the airy misty pastel grid and centered rounded prompt surface from Reference 2 with the soft atmospheric sky-to-canvas gradient and crisp typographic contrast from Reference 1.
- **Backend Preservation**: Client-side coaching calls continue targeting `POST /api/chat` with the exact existing message payload (`model: 'openai/gpt-oss-20b'`, `temperature: 0.7`, `max_tokens: 120`) and `localStorage` persistence key (`firstStepCoachState`).
- **Scope & Enhancements**: Includes a persistent Light/Dark mode toggle and a collapsible Completed Steps Trail alongside the core goal input, active action card, "I'm stuck", "Did it", and "Start over" controls—with zero AI flavor text.

## 1. Overview & Core Concept

- **What It Does**: Presents a distraction-free coaching interface that turns any learning goal into one concrete sub-30-minute action at a time, lets users shrink overwhelming steps or advance forward, and keeps a collapsible trail of completed actions.
- **Target Audience & Context**: Learners on desktop and mobile browsers who want immediate momentum without overwhelming roadmaps, cluttered dashboards, or visual noise.
- **Key Value**: Transforms the static single-dark-card HTML utility into an adaptable, tactile, accessible dual-theme workspace with smooth state transitions and clear visual hierarchy.

## 2. User Experience & Visual Design

- **Key User Flows**:
  1. **Zero State (Goal Entry)**: User lands on an expansive pastel-grid and soft-gradient canvas anchored by the centered First-Step Coach hero heading and a generous, floating rounded composer (`"What do you want to learn?"`) with a tactile `Start` button.
  2. **Active Coaching State**: Submitting a goal smoothly transitions the composer into the Focused Action Card showing unboxed step metadata (`Current Action · Step N`), the concise action prompt, and two ergonomic action buttons (`I'm stuck` and `Did it`), plus `Start over` recovery.
  3. **Collapsible Completed Steps Trail**: As steps are completed or shrunk, a compact disclosure toggle directly beneath the active card reveals or hides the chronological trail of prior steps and actions without crowding the primary focal area.
  4. **Light & Dark Mode Switching**: A single header theme toggle transitions surfaces, grid hairlines, gradients, and high-contrast typography seamlessly between luminous pastel daylight and deep midnight slate, persisted across sessions.

- **Visual Identity & Theme**:
  - *Aesthetic Direction*: Minimalist calm utility—luminous sky gradients, fine architectural grid texture, generous rounded geometry (`24px`–`28px` containers, `14px`–`16px` controls), and tactile surface restraint.
  - *Color Palette & Dual-Theme Tokens*:
    - **Light Mode (60-30-10)**: Dominant off-white canvas (`--bg-canvas: #F8FAFF`) washed with a soft top pastel sky-to-periwinkle radial gradient (`#DBEAFE` → `#EEF2FF` → `#F8FAFF`) and subtle grid lines (`rgba(59, 130, 246, 0.06)`); elevated translucent surface (`--surface-card: rgba(255, 255, 255, 0.86)`) with crisp hairline borders (`rgba(15, 23, 42, 0.08)`); high-contrast ink (`#0F172A` primary, `#475569` secondary); muted sky-cobalt accent (`#2563EB`) strictly on primary CTAs and focus rings.
    - **Dark Mode (60-30-10)**: Deep midnight slate canvas (`--bg-canvas: #060B18`) washed with a twilight indigo atmospheric bloom (`#172554` → `#0B132B` → `#060B18`) and subtle nocturnal grid lines (`rgba(148, 163, 184, 0.06)`); elevated translucent surface (`--surface-card: rgba(15, 23, 42, 0.72)`) with hairline border (`rgba(255, 255, 255, 0.09)`); crisp high-contrast ink (`#F8FAFC` primary, `#94A3B8` secondary); soft periwinkle accent (`#60A5FA` / `#3B82F6`) for primary actions.
  - *Typography & Hierarchy*: `Plus Jakarta Sans` for display title and card prompts (`text-wrap: balance`, tight `-0.025em` tracking), `DM Sans` for body copy and controls, and `JetBrains Mono` (`tabular-nums`) for step counters. Clean unboxed metadata separators (`·`) instead of pill capsules.
  - *Component Styling & Layout*: Responsive full-viewport canvas (`375px` mobile ergonomics with $\ge 44\text{px}$ touch hitboxes expanding cleanly to balanced `1440px` desktop proportions), single-level card elevation, concentric corner radii ($r_{\text{inner}} = r_{\text{outer}} - \text{padding}$), and Tailwind v4 `@custom-variant dark (&:where(.dark, .dark *));` pairing on every element.

- **Interactive Feedback & Motion**:
  - *Tactile Motion*: Spring-eased card transitions (`cubic-bezier(0.16, 1, 0.3, 1)`, $\le 200\text{ms}$ press micro-interactions on `transform` and `opacity` only), smooth height-free disclosure animation for the step trail, and full `prefers-reduced-motion` support.
  - *Subtle Haptic Feedback*: Unified haptic feedback utility triggering `navigator.vibrate` micro-pulses (light tap on theme toggle/trail expand, crisp confirmation double-pulse on `"Did it"`, soft single pulse on `"I'm stuck"`) with graceful no-op fallback on unsupported desktop browsers.
  - *States & Accessibility*: Visible `focus-visible` outlines, `aria-live="polite"` announcements on new coaching steps, inline spinner feedback during `/api/chat` requests, and a clean bottom toast for validation or network errors.

## 3. Key Product Decisions & Trade-Offs

- **Decision 1: Preserve Existing `/api/chat` Contract Without Backend Changes**
  - *Chosen Approach*: Keep all coaching requests routed to `POST /api/chat` with the exact payload structure and `localStorage` state schema from the original HTML file, isolating the API client in a dedicated typed module.
  - *Why*: Respects the explicit constraint to leave the backend untouched while making the frontend modular, type-safe, and easy to maintain.
  - *Alternatives Considered*: Creating a new Express/Gemini route was skipped per user instruction.

- **Decision 2: CSS Grid & Atmospheric Radial Gradient Over Heavy Raster Assets**
  - *Chosen Approach*: Render the subtle pastel grid, soft sky-indigo bloom, and dual-theme transitions with layered CSS gradients and compositor-friendly styling.
  - *Why*: Adapts instantaneously between Light and Dark modes, stays razor-sharp at every device resolution, and eliminates asset loading flicker.
  - *Alternatives Considered*: Static background images would introduce dual-theme contrast mismatches and resolution scaling artifacts.

- **Decision 3: Progressive Disclosure for Completed Steps Trail**
  - *Chosen Approach*: Keep the primary card strictly focused on the single active action, placing completed/shrunk steps inside a collapsed-by-default expandable trail beneath the card.
  - *Why*: Preserves the core "No roadmaps. Just one tiny action." philosophy while giving learners visibility into their momentum when desired.
  - *Alternatives Considered*: Always-visible sidebars or multi-card timelines would distract from the single-step focus.

## 4. Technical Architecture & Data Strategy *(Technical Reference)*

- **Architecture & Component Diagram**:

```text
┌──────────────────────────────────────────────────────────────────────┐
│                         Application Shell                            │
│  ┌──────────────────────┐  ┌───────────────────┐  ┌───────────────┐  │
│  │  Theme State (Light  │  │  Coach State Hook │  │ Haptic Engine │  │
│  │  / Dark + System)    │  │  (localStorage +  │  │ (Vibration    │  │
│  └──────────┬───────────┘  │   /api/chat)      │  │  API wrapper) │  │
│             │              └─────────┬─────────┘  └───────┬───────┘  │
└─────────────┼────────────────────────┼────────────────────┼──────────┘
              ▼                        ▼                    ▼
┌──────────────────────────────────────────────────────────────────────┐
│                     Themed Atmospheric Canvas                        │
│  ┌────────────────────────────────────────────────────────────────┐  │
│  │ Minimal Top Bar: [First-Step Coach]            [Theme Toggle]  │  │
│  └────────────────────────────────────────────────────────────────┘  │
│  ┌────────────────────────────────────────────────────────────────┐  │
│  │ Focal Workspace                                                │  │
│  │  • Zero State  ──► Goal Composer ("What do you want to learn?")│  │
│  │  • Active Step ──► Action Card ("I'm stuck" / "Did it")        │  │
│  │  • Step Trail  ──► Collapsible History List (completed/shrunk) │  │
│  │  • Footer      ──► "Start over" Reset Action                   │  │
│  └────────────────────────────────────────────────────────────────┘  │
│  ┌────────────────────────────────────────────────────────────────┐  │
│  │ Accessible Toast Notification (validation & API errors)        │  │
│  └────────────────────────────────────────────────────────────────┘  │
└──────────────────────────────────────────────────────────────────────┘
```

- **Data Model & State**:
  - *Coach State*: `{ goal: string, currentStep: string, stepNumber: number, history: HistoryEntry[] }` persisted to `localStorage` under `firstStepCoachState`, where each history entry records `{ action: 'start' | 'didIt' | 'next' | 'stuck' | 'shrink', step: string }`.
  - *Theme State*: `'light' | 'dark'` synchronized with `.dark` on `document.documentElement` and persisted in `localStorage`, defaulting to the user's `prefers-color-scheme`.

- **Interactive Component & State Mapping**:
  - *Goal Composer*: Validates non-empty input (showing an accessible toast + subtle error haptic on empty submit), triggers `POST /api/chat` for Step 1, disables controls with inline spinner while pending, and transitions smoothly to the Active Action Card.
  - *Active Action Card*: `"Did it"` archives the active step, increments `stepNumber`, triggers a confirmation haptic, and requests the next tiny step; `"I'm stuck"` records a stuck event, triggers a gentle haptic, and requests a smaller micro-step without incrementing `stepNumber`.
  - *Collapsible Trail*: Filters `history` into readable step milestones (`Completed` / `Refined`), toggles open/closed with accessible `aria-expanded` state and tactile haptic tap.
  - *Start Over Action*: Clears active goal, step, and history back to zero state while keeping the user's selected Light/Dark theme intact.
