import React, { useState } from 'react';
import { useCase } from '@/context/CaseContext';
import { PlusCircle } from 'lucide-react';

export default function JudgeDashboard() {
  const { createCase, cases } = useCase();
  const [title, setTitle] = useState('');
  const [victim, setVictim] = useState('');
  const [accused, setAccused] = useState('');
  const [hearingDateStr, setHearingDateStr] = useState('');

  const handleCreate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!hearingDateStr) return;
    const date = new Date(hearingDateStr);
    createCase(title, victim, accused, date);
    setTitle('');
    setVictim('');
    setAccused('');
    setHearingDateStr('');
  };

  const activeCases = cases.filter(c => c.status !== 'closed');
  const lockedCases = cases.filter(c => c.status === 'locked' || c.status === 'revealed');

  return (
    <div className="fade-in">
      <h2 className="section-title" style={{ marginBottom: '32px' }}>System Administration</h2>
      
      <div className="card-grid">
        <div className="card">
          <div className="card-header">
            <span>COMMAND: CREATE CASE</span>
            <PlusCircle size={20} color="var(--accent-gold)" />
          </div>
          <form onSubmit={handleCreate}>
            <div className="input-group">
              <label className="input-label">Case Protocol Title</label>
              <input 
                type="text" 
                className="input-field"
                placeholder="e.g. State v. John Doe [Forensic]"
                value={title} 
                onChange={e => setTitle(e.target.value)} 
                required 
              />
            </div>
            <div className="input-group">
              <label className="input-label">Plaintiff / Victim</label>
              <input 
                type="text" 
                className="input-field"
                placeholder="Full Name"
                value={victim} 
                onChange={e => setVictim(e.target.value)} 
                required 
              />
            </div>
            <div className="input-group">
              <label className="input-label">Defendant / Accused</label>
              <input 
                type="text" 
                className="input-field"
                placeholder="Full Name"
                value={accused} 
                onChange={e => setAccused(e.target.value)} 
                required 
              />
            </div>
            <div className="input-group">
              <label className="input-label">Scheduled Hearing</label>
              <input 
                type="datetime-local" 
                className="input-field"
                value={hearingDateStr} 
                onChange={e => setHearingDateStr(e.target.value)} 
                required 
              />
            </div>
            <button type="submit" className="btn-primary" style={{ width: '100%', marginTop: '8px' }}>
              Initialize Ledger Case
            </button>
          </form>
        </div>

        <div className="card card-accent">
          <div className="card-header">
            <span>NETWORK STATUS</span>
            <div className="status-indicator"></div>
          </div>
          <div className="stats-grid">
            <div className="stat-box">
              <div className="stat-value">{activeCases.length}</div>
              <div className="stat-label">ACTIVE NODES</div>
            </div>
            <div className="stat-box">
              <div className="stat-value" style={{ color: 'var(--status-success)' }}>{lockedCases.length}</div>
              <div className="stat-label">LOCKED VAULTS</div>
            </div>
          </div>
          
          {cases.filter(c => c.status === 'closed' && c.outcome).length > 0 && (
            <div className="highlight-box">
              <div className="highlight-label">LATEST PROTOCOL TERMINATION</div>
              {(() => {
                const lastClosed = [...cases].reverse().find(c => c.status === 'closed' && c.outcome);
                return lastClosed ? (
                  <div>
                    <div className="highlight-title">
                      {lastClosed.outcome?.winner === 'Settlement Reached' ? lastClosed.outcome?.settlementAmount : lastClosed.outcome?.winner}
                    </div>
                    <div className="highlight-subtitle">
                      Ledger ID: {lastClosed.id.toUpperCase()}
                    </div>
                  </div>
                ) : null;
              })()}
            </div>
          )}
          
          <div style={{ marginTop: 'auto', paddingTop: '24px', fontSize: '0.8rem', color: 'var(--text-muted)' }}>
            System operating at 100% capacity. All evidence packets are cryptographically secured.
          </div>
        </div>
      </div>
    </div>
  );
}
