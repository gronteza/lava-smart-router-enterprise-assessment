import React from 'react'

export default function TechnicalView() {
  return (
    <>
      <div className="card">
        <h2>Request path</h2>
        <p>Every RPC request flows through the Smart Router as follows:</p>
        <div className="flow-diagram">
          User/dApp Request<br />
          &nbsp;&nbsp;↓<br />
          Smart Router (lavap rpcsmartrouter) — listens per chain/API<br />
          &nbsp;&nbsp;↓<br />
          ChainListener (JSON-RPC | REST | TendermintRPC | gRPC)<br />
          &nbsp;&nbsp;↓<br />
          SendRelay → ProcessRelaySend<br />
          &nbsp;&nbsp;↓<br />
          SmartRouterRelayStateMachine (selection mode + retry policy)<br />
          &nbsp;&nbsp;↓<br />
          relaycore.RelayProcessor → Provider selection (QoS, strategy)<br />
          &nbsp;&nbsp;↓<br />
          Static providers → on failure → Backup providers<br />
          &nbsp;&nbsp;↓<br />
          Optional cache → Response to user
        </div>
      </div>

      <div className="card">
        <h2>Selection modes</h2>
        <ul>
          <li><strong>Stateless:</strong> Single provider per attempt; on failure, retries up to 10 times (new provider or state). Stops on unsupported method or batch request (when batch retry is disabled).</li>
          <li><strong>Stateful:</strong> All top providers queried in parallel; first/best result wins. <strong>No retries.</strong></li>
          <li><strong>CrossValidation:</strong> Multiple providers queried; result by agreement threshold. <strong>No retries.</strong></li>
        </ul>
      </div>

      <div className="card">
        <h2>Retry vs no-retry</h2>
        <p>Retries are only applied in Stateless mode. After exhausting retries, the request hash is “banned” in RelayRetriesManager (6h TTL) so identical requests are not retried. Stateful and CrossValidation never retry—one timeout or bad response fails the request.</p>
      </div>
    </>
  )
}
