import React from 'react'

export default function EnterpriseView() {
  return (
    <>
      <div className="card">
        <h2>Uptime and failover</h2>
        <p>Enterprises need predictable RPC availability. The Smart Router provides:</p>
        <ul>
          <li><strong>Static + backup providers</strong> — automatic failover when primaries fail, without on-chain pairing.</li>
          <li><strong>QoS-based routing</strong> — traffic goes to the best-performing provider; health checks and optimizer drive selection.</li>
          <li><strong>Single control plane</strong> — one config and one process for multiple chains and API types (JSON-RPC, REST, gRPC).</li>
        </ul>
      </div>

      <div className="card">
        <h2>Control and compliance</h2>
        <p>Custodians, exchanges, and wallet providers care about:</p>
        <ul>
          <li><strong>Known infrastructure</strong> — only configured providers are used; no surprise third parties.</li>
          <li><strong>Auditability</strong> — metrics (Prometheus, optional Kafka) show which providers were used, when, and how they performed.</li>
          <li><strong>No wallet required</strong> — no blockchain pairing or staking; pure config-driven operation.</li>
        </ul>
      </div>

      <div className="card">
        <h2>What matters commercially</h2>
        <p>Success rate, latency (p50/p95/p99), failover events, and provider mix directly affect user experience and SLOs. The dashboard Metrics view shows these; in production they map to Prometheus metrics such as <code>lava_consumer_total_relays_serviced</code>, <code>lava_consumer_total_errored</code>, and latency gauges.</p>
      </div>
    </>
  )
}
