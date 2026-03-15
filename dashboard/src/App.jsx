import React, { useState } from 'react'
import TechnicalView from './views/TechnicalView'
import EnterpriseView from './views/EnterpriseView'
import MetricsView from './views/MetricsView'
import RiskView from './views/RiskView'
import './App.css'

const TABS = [
  { id: 'technical', label: 'How It Works' },
  { id: 'enterprise', label: 'Why Enterprises Care' },
  { id: 'metrics', label: 'Commercial Metrics' },
  { id: 'risk', label: 'Reliability Risks' },
]

export default function App() {
  const [activeTab, setActiveTab] = useState('technical')

  return (
    <div className="app">
      <header className="header">
        <h1 className="logo">Lava Smart Router</h1>
        <p className="tagline">Value & Observability Dashboard</p>
        <nav className="tabs">
          {TABS.map(({ id, label }) => (
            <button
              key={id}
              className={`tab ${activeTab === id ? 'active' : ''}`}
              onClick={() => setActiveTab(id)}
            >
              {label}
            </button>
          ))}
        </nav>
      </header>
      <main className="main">
        {activeTab === 'technical' && <TechnicalView />}
        {activeTab === 'enterprise' && <EnterpriseView />}
        {activeTab === 'metrics' && <MetricsView />}
        {activeTab === 'risk' && <RiskView />}
      </main>
    </div>
  )
}
