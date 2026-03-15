# Lava Smart Router — Value & Observability Dashboard

Lightweight dashboard prototype for the CTO assignment: **what the Smart Router does technically**, **why enterprise customers care**, and **what metrics matter commercially**. Data is simulated.

## Run locally

```bash
npm install
npm run dev
```

Open [http://localhost:5173](http://localhost:5173).

## Build

```bash
npm run build
npm run preview   # serve dist/
```

## Views

| Tab | Content |
|-----|--------|
| **How It Works** | Request path (User → ChainListener → StateMachine → RelayProcessor → providers), selection modes (Stateless / Stateful / CrossValidation), retry vs no-retry behavior. |
| **Why Enterprises Care** | Uptime, failover, single control plane, compliance/audit. |
| **Commercial Metrics** | Simulated request volume, success rate, p99 latency, failover events, provider mix; maps to Prometheus metrics (`lava_consumer_total_relays_serviced`, `lava_consumer_total_errored`, latency gauges). |
| **Reliability Risks** | Hidden risks (no retries for Stateful/CrossVal, 6h retry ban, 5m health, batch no-retry) and most likely catastrophic incident scenario. |

## Stack

- React 18 + Vite 5
- Recharts for charts
- No backend; all data is simulated in the client
