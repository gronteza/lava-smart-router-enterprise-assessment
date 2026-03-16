# Lava Smart Router Enterprise Readiness Assessment

This folder contains all deliverables for the Magma CTO assignment (Parts 1 and 2).

## Scope

This assessment is based on publicly available Lava repositories and documentation.
The focus is enterprise readiness for custodians, exchanges, and wallet infrastructure providers,
with emphasis on reliability, failure isolation, and observability.

## Quick Review Guide

1. Read the presentation slides for the 10-minute summary
2. Review the technical assessment PDF
3. Open the dashboard screenshots or run the dashboard locally

## Part 1 — Technical & Enterprise Assessment

| Deliverable | File |
|-------------|------|
| Structured document (6–8 pages) | [Smart Router Enterprise Readiness_ Technical & Enterprise Assessment.pdf](./docs/Smart%20Router%20Enterprise%20Readiness_%20Technical%20&%20Enterprise%20Assessment.pdf) |

Includes: system architecture, 3–5 critical technical risks, failure modes under production stress, prioritized 90-day hardening plan, and what not to focus on initially. Code-level references to the Lava repo (e.g. `protocol/rpcsmartrouter/`, `protocol/lavaprotocol/relay_retries_manager.go`, `protocol/relaycore/selection.go`).

---

## Part 2 — Value & Observability Dashboard

| Deliverable | Location |
|-------------|----------|
| Architecture & Retry Hardening document | [Smart Router_ Architecture & Retry Hardening.pdf](./docs/Smart%20Router_%20Architecture%20&%20Retry%20Hardening.pdf) |
| Dashboard (prototype) | [dashboard/](./dashboard/) |
| Dashboard README & screenshots | [dashboard/README.md](./dashboard/README.md), [SCREENSHOTS](./dashboard/screenshots/) |
| 10-minute presentation slides | [Lava Smart Router Enterprise Readiness.pptx](./presentation/Lava%20Smart%20Router%20Enterprise%20Readiness.pptx) |

### Running the dashboard

```bash
cd dashboard
npm install
npm run dev
```

Open http://localhost:5173. Use the tabs: **How It Works**, **Why Enterprises Care**, **Commercial Metrics**, **Reliability Risks**. Data is simulated. For submission, capture 2–4 screenshots per SCREENSHOTS.md and place them in `dashboard/screenshots/`.

