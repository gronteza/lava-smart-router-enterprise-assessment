    # Smart Router: Architecture & Retry Hardening

**Purpose:** Technical note on how the Smart Router fits in the stack, current retry and failover behavior, and recommended hardening for enterprise use.

---

## 1. Architecture: Where the Smart Router Fits

### 1.1 Stack Overview

```
┌─────────────────────────────────────────────────────────────────────────┐
│                         Clients (dApps, Wallets, Exchanges)              │
└─────────────────────────────────────────────────────────────────────────┘
                                      │
                                      ▼
┌─────────────────────────────────────────────────────────────────────────┐
│                    Lava Smart Router (lavap rpcsmartrouter)              │
│  ┌──────────────┐  ┌─────────────────────┐  ┌────────────────────────┐  │
│  │ ChainListener│  │ RelayStateMachine   │  │ RelayProcessor         │  │
│  │ (JSON-RPC,   │→ │ (Stateless/Stateful/│→ │ (task channel, results, │  │
│  │  REST, gRPC) │  │  CrossValidation)   │  │  consistency)          │  │
│  └──────────────┘  └─────────────────────┘  └────────────────────────┘  │
│         │                      │                         │                │
│         │                      ▼                         ▼                │
│         │             ┌────────────────┐    ┌────────────────────────┐  │
│         │             │ SessionManager │    │ ProviderOptimizer       │  │
│         │             │ + UsedProviders│    │ (QoS, strategy)         │  │
│         │             └────────────────┘    └────────────────────────┘  │
└─────────│──────────────────────────────────────│────────────────────────┘
          │                                      │
          ▼                                      ▼
┌─────────────────────┐              ┌─────────────────────────────────────┐
│ Optional cache (BE)  │              │ Static providers → Backup providers  │
└─────────────────────┘              │ (Alchemy, Infura, self-hosted, etc.) │
                                      └─────────────────────────────────────┘
```

- **Config:** YAML defines endpoints (chain-id, api-interface, network-address), static-providers, and backup-providers. No on-chain pairing.
- **Request path:** ChainListener parses the request → state machine chooses selection mode and retry policy → RelayProcessor drives provider calls → response (or error) returned. Optional cache and Prometheus/Kafka are out-of-band to the core relay path.

### 1.2 Key Code Paths

| Layer | Location |
|-------|----------|
| Entry, config, endpoints | `protocol/rpcsmartrouter/rpcsmartrouter.go` |
| Per-request relay, SendRelay | `protocol/rpcsmartrouter/rpcsmartrouter_server.go` |
| Retry and selection mode | `protocol/rpcsmartrouter/smartrouter_relay_state_machine.go` |
| Retry ban cache | `protocol/lavaprotocol/relay_retries_manager.go` |
| Selection constants (batch retry off) | `protocol/relaycore/selection.go` |

---

## 2. Current Retry and Failover Behavior

### 2.1 Selection Modes

- **Stateless:** One provider per attempt; on failure, the state machine may retry (new provider or same with new state) up to `MaximumNumberOfTickerRelayRetries` (10). Retries stop on unsupported method or if the request is a batch (when `DisableBatchRequestRetry` is true).
- **Stateful:** All top providers are queried in parallel; first/best result wins. **No retries.**
- **CrossValidation:** Multiple providers are queried; result is chosen by agreement threshold. **No retries.**

### 2.2 Retry “Ban” (RelayRetriesManager)

After a Stateless relay exhausts retries, the request hash is added to a ristretto cache with TTL **6 hours** (`RetryEntryTTL`). Any subsequent identical request (same hash) will not trigger retries until the entry expires. This avoids retry storms but can block legitimate retries after transient outages.

### 2.3 Batch Requests

Batch JSON-RPC is not retried by default (`DisableBatchRequestRetry == true`). One failure fails the whole batch.

### 2.4 Health Checks

Provider health is probed on a fixed interval (default **5 minutes**). Until the next run, failing providers can still receive traffic. There is no per-request or failure-count-based circuit breaker.

### 2.5 Timeouts

Processing timeout is derived from chain block time and request type and applied via context. When the context is cancelled (timeout), the state machine either retries (Stateless) or returns failure (Stateful/CrossValidation).

---

## 3. Recommended Hardening

### 3.1 Per-Provider Circuit Breaker

- **What:** After N consecutive failures (or error rate above a threshold) for a given provider, stop sending it traffic for a cooldown period (e.g. 30–60s). After cooldown, allow one probe request; on success, resume normal selection.
- **Why:** Reduces impact of flaky or degraded providers and speeds effective failover without waiting for the 5m health check.
- **Where:** Integrate with provider selection (e.g. in or beside `ConsumerSessionManager` / optimizer) so that providers in “open” state are excluded from selection.

### 3.2 Health Check Interval

- **What:** Make the health check interval configurable (already done) and consider a shorter default for enterprise (e.g. 1m), with docs that shorter intervals increase probe load.
- **Why:** 5m is too slow for custodians and exchanges; faster detection improves failover behavior.

### 3.3 Retry and Ban Policy

- **What:** (1) Make retry cap and RelayRetriesManager TTL configurable; consider a shorter TTL (e.g. 15–30m) or a scope that is per-provider or per-request-id so that transient failures do not ban a request shape for 6h. (2) Optionally add exponential backoff between retries. (3) For batch, document the “no retry” behavior and consider an opt-in flag for operators who accept the risk.
- **Why:** Balances protection against retry storms with the need to recover quickly after transient issues.

### 3.4 Metrics and SLOs

- **What:** Document existing Prometheus metrics (e.g. `lava_consumer_total_relays_serviced`, `lava_consumer_total_errored`, latency, per-provider). Add SLO-style metrics (e.g. error rate, p99 latency) and optional alerting rules.
- **Why:** Enterprises need to run to a target (e.g. 99.9% success, p99 &lt; 2s) and to debug incidents using the same metrics the router already exposes.

### 3.5 Rate Limiting / Backpressure

- **What:** Optional per-client or per-chain rate limiting or connection backpressure at the router to avoid stampedes when a provider recovers or when many requests hit the same provider after cache expiry.
- **Why:** Reduces thundering-herd effects and stabilizes latency under bursty load.

---

## 4. Summary

| Area | Current | Recommended |
|------|---------|-------------|
| Circuit breaker | None | Per-provider failure threshold + cooldown |
| Health interval | 5m default | Configurable; consider 1m default for enterprise |
| Retry ban | 6h TTL, global hash | Configurable TTL; consider shorter and/or narrower scope |
| Batch retry | Off | Document; optional opt-in flag |
| Observability | Prometheus metrics exist | Document + SLO-style metrics and alerting |
| Backpressure | None | Optional per-client/per-chain limits |

Implementing circuit breaker and health/retry tuning first gives the highest impact for enterprise reliability; observability and backpressure can follow in the same 90-day window as in the main assessment document.

---

*End of Architecture & Retry Hardening document*
