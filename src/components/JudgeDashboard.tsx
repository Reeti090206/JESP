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
    <div>
      <h2 style={{ marginBottom: '24px' }}>Judge Dashboard Overview</h2>
      
      <div className="card-grid">
        <div className="card">
          <div className="card-header">
            <PlusCircle size={24} color="var(--accent-gold)" />
            Create New Case
          </div>
          <form onSubmit={handleCreate}>
            <div className="input-group">
              <label className="input-label">Case Title</label>
              <input 
                type="text" 
                className="input-field"
                value={title} 
                onChange={e => setTitle(e.target.value)} 
                required 
              />
            </div>
            <div className="input-group">
              <label className="input-label">Victim Name</label>
              <input 
                type="text" 
                className="input-field"
                value={victim} 
                onChange={e => setVictim(e.target.value)} 
                required 
              />
            </div>
            <div className="input-group">
              <label className="input-label">Accused Name</label>
              <input 
                type="text" 
                className="input-field"
                value={accused} 
                onChange={e => setAccused(e.target.value)} 
                required 
              />
            </div>
            <div className="input-group">
              <label className="input-label">Hearing Date & Time</label>
              <input 
                type="datetime-local" 
                className="input-field"
                value={hearingDateStr} 
                onChange={e => setHearingDateStr(e.target.value)} 
                required 
              />
            </div>
            <button type="submit" className="btn-primary" style={{ width: '100%', marginTop: '10px' }}>
              Create Case & Notify Parties
            </button>
          </form>
        </div>

        <div className="card" style={{ background: 'url("/background_pillars.png") center/cover', position: 'relative' }}>
          <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to top, rgba(27, 32, 44, 0.9) 0%, rgba(27, 32, 44, 0.1) 100%)', borderRadius: '12px' }}></div>
          <div style={{ position: 'relative', zIndex: 1, height: '100%', display: 'flex', flexDirection: 'column', justifyContent: 'flex-end' }}>
            <h3 style={{ fontSize: '1.5rem', marginBottom: '8px' }}>System Overview</h3>
            <p style={{ color: 'var(--text-secondary)', marginBottom: '16px' }}>Cryptographic verification statistics.</p>
            <div style={{ display: 'flex', gap: '20px' }}>
              <div style={{ background: 'rgba(0,0,0,0.5)', padding: '16px', borderRadius: '8px', flex: 1 }}>
                <div style={{ fontSize: '2rem', color: 'var(--accent-gold)', fontWeight: 'bold' }}>{activeCases.length}</div>
                <div style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>Active Cases</div>
              </div>
              <div style={{ background: 'rgba(0,0,0,0.5)', padding: '16px', borderRadius: '8px', flex: 1 }}>
                <div style={{ fontSize: '2rem', color: 'var(--success)', fontWeight: 'bold' }}>{lockedCases.length}</div>
                <div style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>Locked Evidence</div>
              </div>
            </div>
            
            {cases.filter(c => c.status === 'closed' && c.outcome).length > 0 && (
              <div style={{ marginTop: '20px', background: 'rgba(245, 176, 65, 0.1)', border: '1px solid rgba(245, 176, 65, 0.3)', padding: '16px', borderRadius: '8px' }}>
                <h4 style={{ color: 'var(--accent-gold)', marginBottom: '8px' }}>Case Highlights</h4>
                {(() => {
                  const lastClosed = [...cases].reverse().find(c => c.status === 'closed' && c.outcome);
                  return lastClosed ? (
                    <div>
                      <div style={{ fontSize: '1.5rem', fontWeight: 'bold', color: 'white', marginBottom: '4px' }}>
                        {lastClosed.outcome?.settlementAmount || lastClosed.outcome?.winner}
                      </div>
                      <div style={{ fontSize: '0.9rem', color: 'var(--text-secondary)' }}>
                        {lastClosed.outcome?.winner === 'Settlement Reached' ? 'Settlement Reached' : `${lastClosed.outcome?.winner} Ruling`}
                      </div>
                      <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginTop: '4px' }}>
                        {lastClosed.outcome?.description}
                      </div>
                    </div>
                  ) : null;
                })()}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
