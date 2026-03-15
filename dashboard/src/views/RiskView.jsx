import React from 'react'

export default function RiskView() {
  return (
    <>
      <div className="card">
        <h2>Hidden reliability risks</h2>
        <p>Key risks identified for enterprise production:</p>
        <ul>
          <li><strong>No retries for Stateful/CrossValidation</strong> — one bad provider or timeout fails the request; no circuit breaker to isolate bad providers.</li>
          <li><strong>6h retry ban (Stateless)</strong> — after exhausting retries, identical requests are blocked from retry for 6 hours; transient outages can lock out request shapes.</li>
          <li><strong>5-minute health cadence</strong> — slow detection of provider outages; traffic can keep hitting a dead provider until the next health run.</li>
          <li><strong>Batch requests never retried</strong> — exchanges using batch RPC get no failover for the whole batch on first failure.</li>
        </ul>
      </div>

      <div className="card">
        <h2>Most likely catastrophic incident</h2>
        <p>All providers briefly degrade (e.g. network blip or upstream outage). Health checks run only every 5m, so the router keeps sending traffic to bad providers. Stateless requests exhaust retries and get banned for 6h; Stateful/CrossVal requests fail immediately. Without a per-provider circuit breaker, traffic is not isolated from failing providers until the next health run. Result: broad user-visible failures and delayed recovery.</p>
      </div>
    </>
  )
}
