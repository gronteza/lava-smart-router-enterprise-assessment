# Lava Smart Router — Enterprise Readiness

**CTO Assignment | 10 min**

---

## Deliverables

1. **Technical & Enterprise Assessment** (6–8 pp): architecture, risks, failure modes, 90-day hardening, non-goals  
2. **Architecture & Retry Hardening** doc: stack, retry/failover behavior, recommended hardening  
3. **Dashboard**: How it works / Why enterprises care / Commercial metrics / Risks (simulated data)  
4. **This presentation**

---

## Reasoning: Why Retry, Health, Observability?

- **Thesis:** For custodians/exchanges, value = reliability. Gaps = hardening under failure.
- **Retry/ban:** Stateless retries up to 10× then bans request hash 6h → reduce storms but allow shorter/scoped ban.
- **Health + circuit breaker:** 5m health default; no per-provider circuit breaker → add breaker + configurable interval.
- **Observability:** Document Prometheus + SLO-style metrics and alerting.
- **Not focusing on:** New chains, new APIs, Kafka/analytics first.

---

## Biggest Hidden Reliability Risk

**No retries for Stateful/CrossValidation + no per-provider circuit breaker**

- Stateful/CrossVal: **one** timeout or bad response → user-visible failure (no retry).
- No circuit breaker → traffic keeps going to failing provider until next 5m health run.
- **Hidden:** Docs say “automatic failover”; in Stateful/CrossVal there is no retry, and bad providers aren’t isolated quickly.

---

## Long-Term Moat

**Double down on:**

1. **Reliability + observability** for custodians/exchanges/wallets  
2. **Multi-chain, single control plane** (one config, one process)  
3. **SLO/runbook culture** (metrics, targets, procedures)

**Not betting the moat on (yet):** ML routing, dynamic pricing, heavy analytics. Reliability and observability first.

---

## Most Likely Catastrophic Incident

**All providers briefly degrade** (e.g. network blip)

1. Health runs every **5m** → traffic still sent to bad providers  
2. **Stateless:** retries exhaust → hashes **banned 6h** → same requests keep failing after blip  
3. **Stateful/CrossVal:** fail on first failure  
4. **No circuit breaker** → no fast isolation  

**Result:** Broad failures + long tail of banned request shapes.  
**Mitigation:** Circuit breaker, shorter health interval, configurable/shorter ban TTL, runbooks.

---

## Next Steps (90-Day Plan)

- **Phase 1 (1–30):** Observability + circuit breaker + health interval  
- **Phase 2 (31–60):** Retry/ban policy (TTL, scope, batch opt-in)  
- **Phase 3 (61–90):** Rate limiting, runbooks, chaos/integration tests  

**Explicit non-goals:** Rebuild in another language; new protocols/chains first; ML/pricing; Kafka before Prometheus solid.

---

## Thank you

**Repo:** `cto-assignment/`  
- `part1-technical-enterprise-assessment.md`  
- `architecture-retry-hardening.md`  
- `dashboard/` (run: `npm install && npm run dev`)  
- `presentation-script.md` / `presentation-slides.md`  

Questions?
