import React, { useMemo } from 'react'
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
  Cell,
  PieChart,
  Pie,
  Legend,
} from 'recharts'

// Simulated time series: last 24 "periods" (e.g. 5-min buckets)
function useSimulatedSeries() {
  return useMemo(() => {
    const now = Date.now()
    const periodMs = 5 * 60 * 1000
    const data = []
    for (let i = 23; i >= 0; i--) {
      const t = new Date(now - i * periodMs)
      const base = 8000 + Math.sin(i / 4) * 1500
      const errors = Math.floor(base * (0.002 + 0.001 * (i % 5)))
      data.push({
        time: t.toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' }),
        requests: Math.round(base),
        errors,
        successRate: ((base - errors) / base * 100).toFixed(2),
        latencyP99: 180 + Math.sin(i / 3) * 40,
      })
    }
    return data
  }, [])
}

// Simulated failover events
const failoverEvents = [
  { chain: 'ETH1', provider: 'alchemy-primary', at: '14:32', reason: 'timeout' },
  { chain: 'ETH1', provider: 'infura-primary', at: '13:18', reason: '5xx' },
  { chain: 'OSMOSIS', provider: 'self-hosted-1', at: '12:05', reason: 'timeout' },
]

// Simulated provider mix (share of requests)
const providerMix = [
  { name: 'alchemy-primary', value: 42, color: '#5b9bd5' },
  { name: 'infura-primary', value: 35, color: '#6bbf8a' },
  { name: 'quicknode-primary', value: 15, color: '#e5b567' },
  { name: 'backup-alchemy', value: 8, color: '#8b92a6' },
]

export default function MetricsView() {
  const series = useSimulatedSeries()
  const latest = series[series.length - 1]
  const avgSuccessRate = series.reduce((a, d) => a + parseFloat(d.successRate), 0) / series.length
  const avgLatency = (series.reduce((a, d) => a + d.latencyP99, 0) / series.length).toFixed(0)

  return (
    <>
      <div className="card">
        <h2>Key metrics (simulated)</h2>
        <p className="card-sub">Maps to Prometheus: lava_consumer_total_relays_serviced, lava_consumer_total_errored, latency gauges.</p>
        <div className="metric-grid">
          <div className="metric-card">
            <div className="value">{latest?.requests?.toLocaleString() ?? 0}</div>
            <div className="label">Requests (last 5m)</div>
          </div>
          <div className="metric-card success">
            <div className="value">{avgSuccessRate.toFixed(2)}%</div>
            <div className="label">Avg success rate</div>
          </div>
          <div className="metric-card">
            <div className="value">{avgLatency} ms</div>
            <div className="label">Avg p99 latency</div>
          </div>
          <div className="metric-card warning">
            <div className="value">{failoverEvents.length}</div>
            <div className="label">Failover events (today)</div>
          </div>
        </div>
      </div>

      <div className="card">
        <h2>Request volume & errors (24 × 5m)</h2>
        <ResponsiveContainer width="100%" height={260}>
          <AreaChart data={series} margin={{ top: 8, right: 8, left: 0, bottom: 0 }}>
            <defs>
              <linearGradient id="reqGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#5b9bd5" stopOpacity={0.4} />
                <stop offset="100%" stopColor="#5b9bd5" stopOpacity={0} />
              </linearGradient>
            </defs>
            <XAxis dataKey="time" tick={{ fontSize: 11, fill: 'var(--text-muted)' }} />
            <YAxis tick={{ fontSize: 11, fill: 'var(--text-muted)' }} />
            <Tooltip
              contentStyle={{ background: 'var(--surface)', border: '1px solid var(--border)' }}
              labelStyle={{ color: 'var(--text)' }}
            />
            <Area type="monotone" dataKey="requests" stroke="var(--accent)" fill="url(#reqGrad)" name="Requests" />
          </AreaChart>
        </ResponsiveContainer>
      </div>

      <div className="card">
        <h2>p99 latency (ms) by period</h2>
        <ResponsiveContainer width="100%" height={220}>
          <BarChart data={series} margin={{ top: 8, right: 8, left: 0, bottom: 0 }}>
            <XAxis dataKey="time" tick={{ fontSize: 11, fill: 'var(--text-muted)' }} />
            <YAxis tick={{ fontSize: 11, fill: 'var(--text-muted)' }} />
            <Tooltip
              contentStyle={{ background: 'var(--surface)', border: '1px solid var(--border)' }}
            />
            <Bar dataKey="latencyP99" name="p99 (ms)" fill="#3d6b94" radius={[4, 4, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>

      <div className="card">
        <h2>Provider mix (request share %)</h2>
        <ResponsiveContainer width="100%" height={240}>
          <PieChart>
            <Pie
              data={providerMix}
              dataKey="value"
              nameKey="name"
              cx="50%"
              cy="50%"
              outerRadius={80}
              label={({ name, value }) => `${name}: ${value}%`}
            >
              {providerMix.map((entry, index) => (
                <Cell key={index} fill={entry.color} />
              ))}
            </Pie>
            <Tooltip
              contentStyle={{ background: 'var(--surface)', border: '1px solid var(--border)' }}
              formatter={(value) => [`${value}%`, 'Share']}
            />
            <Legend />
          </PieChart>
        </ResponsiveContainer>
      </div>

      <div className="card">
        <h2>Recent failover events</h2>
        <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.9rem' }}>
          <thead>
            <tr style={{ borderBottom: '1px solid var(--border)', color: 'var(--text-muted)' }}>
              <th style={{ textAlign: 'left', padding: '0.5rem 0' }}>Chain</th>
              <th style={{ textAlign: 'left', padding: '0.5rem 0' }}>Provider</th>
              <th style={{ textAlign: 'left', padding: '0.5rem 0' }}>Time</th>
              <th style={{ textAlign: 'left', padding: '0.5rem 0' }}>Reason</th>
            </tr>
          </thead>
          <tbody>
            {failoverEvents.map((e, i) => (
              <tr key={i} style={{ borderBottom: '1px solid var(--border)' }}>
                <td style={{ padding: '0.5rem 0' }} className="mono">{e.chain}</td>
                <td style={{ padding: '0.5rem 0' }}>{e.provider}</td>
                <td style={{ padding: '0.5rem 0' }}>{e.at}</td>
                <td style={{ padding: '0.5rem 0' }}>{e.reason}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  )
}
