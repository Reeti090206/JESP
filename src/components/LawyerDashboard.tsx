import React, { useState } from 'react';
import { useCase, CaseState } from '@/context/CaseContext';
import { Eye, Signature, CheckCircle2, FileLock2, Info, Clock, Lock } from 'lucide-react';
import TimerView from './TimerView';
import CaseTimeline from './CaseTimeline';

export default function LawyerDashboard() {
  const { cases, signEvidence } = useCase();
  const [selectedCaseId, setSelectedCaseId] = useState<string | null>(null);
  const [viewing, setViewing] = useState(false);
  const [signing, setSigning] = useState(false);

  // Focus on cases awaiting lawyer
  const awaitingCases = cases.filter(c => c.status === 'awaiting_lawyer');
  const activeCase = awaitingCases.find(c => c.id === selectedCaseId) || awaitingCases[0];

  const lockedCases = cases.filter(c => c.status === 'locked' || c.status === 'revealed' || c.status === 'closed');

  const handleSign = async () => {
    if (!activeCase) return;
    setSigning(true);
    await signEvidence(activeCase.id);
    setSigning(false);
    setViewing(false);
    setSelectedCaseId(null);
  };

  if (awaitingCases.length === 0 && lockedCases.length === 0) {
    return (
      <div style={{ textAlign: 'center', padding: '100px 0', color: 'var(--text-secondary)' }}>
        <Clock size={64} style={{ margin: '0 auto 20px', opacity: 0.5 }} />
        <h2>No pending evidence</h2>
        <p>Waiting for the Hospital Authority to upload medical documents.</p>
      </div>
    );
  }

  return (
    <div>
      <h2 style={{ marginBottom: '24px', display: 'flex', alignItems: 'center', gap: '12px' }}>
        <Info color="var(--warning)" /> Required Signatures
      </h2>

      {awaitingCases.length > 0 && (
        <div style={{ display: 'flex', gap: '12px', marginBottom: '24px', overflowX: 'auto' }}>
          {awaitingCases.map(c => (
            <button 
              key={c.id} 
              className="btn-secondary" 
              style={{ 
                borderColor: activeCase?.id === c.id ? 'var(--accent-gold)' : 'var(--border-color)',
                color: activeCase?.id === c.id ? 'var(--accent-gold)' : 'var(--text-secondary)'
              }}
              onClick={() => { setSelectedCaseId(c.id); setViewing(false); }}
            >
              {c.title}
            </button>
          ))}
        </div>
      )}

      {activeCase && (
        <div style={{ marginBottom: '40px' }}>
          {!viewing ? (
            <div className="card card-gold-border">
              <div className="card-header">
                Case: {activeCase.title}
              </div>
              <p style={{ color: 'var(--text-secondary)', marginBottom: '16px' }}>
                Evidence: {activeCase.evidence?.fileName}
              </p>

              <div style={{ display: 'flex', gap: '16px', marginTop: '24px' }}>
                <button className="btn-secondary" onClick={() => setViewing(true)}>
                  <Eye size={20} /> View Report
                </button>
                <button className="btn-primary" onClick={handleSign}>
                  <Signature size={20} /> Sign Evidence
                </button>
              </div>
            </div>
          ) : (
            <div className="card">
              <div className="card-header">
                Evidence Viewer (Read-Only Preview)
                <button className="btn-secondary" onClick={() => setViewing(false)} style={{ padding: '6px 12px' }}>Close</button>
              </div>
              
              <div style={{ display: 'flex', gap: '40px' }}>
                <div style={{ flex: 2, background: 'rgba(255,255,255,0.05)', borderRadius: '12px', padding: '40px', minHeight: '400px', display: 'flex', alignItems: 'center', justifyContent: 'center', border: '1px solid var(--border-color)' }}>
                  <div style={{ textAlign: 'center', color: 'var(--text-secondary)' }}>
                    <FileLock2 size={64} style={{ margin: '0 auto 20px', opacity: 0.5 }} />
                    <h3>{activeCase.evidence?.fileName}</h3>
                    <p>Decrypted temporary preview for signing authority.</p>
                  </div>
                </div>

                <div style={{ flex: 1 }}>
                  <div className="verification-panel">
                    <h4 style={{ marginBottom: '16px', color: 'var(--accent-gold)' }}>Verification Panel</h4>
                    <div className="verification-item">
                      <div className="verification-icon success"><CheckCircle2 size={14} /></div>
                      <span>Hospital Upload Verified</span>
                    </div>
                    <div className="verification-item">
                      <div className="verification-icon success"><CheckCircle2 size={14} /></div>
                      <span>File Integrity Verified</span>
                    </div>
                    <div className="verification-item">
                      <div className="verification-icon success"><CheckCircle2 size={14} /></div>
                      <span>Case ID Linked</span>
                    </div>
                  </div>

                  <button 
                    className="btn-primary" 
                    style={{ width: '100%', marginTop: '30px', padding: '16px' }} 
                    onClick={handleSign}
                    disabled={signing}
                  >
                    {signing ? 'Signing and Locking...' : 'Sign Medical Evidence'}
                  </button>
                  <p style={{ marginTop: '16px', fontSize: '0.85rem', color: 'var(--warning)', textAlign: 'center' }}>
                    ⭐ Immediately after signature, <br/>evidence automatically locks.
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {lockedCases.length > 0 && (
        <div style={{ borderTop: '1px solid var(--border-color)', paddingTop: '40px' }}>
          <h2 style={{ marginBottom: '24px' }}>Previously Signed & Locked Cases</h2>
          
          <div className="card-grid">
            {lockedCases.map(c => (
              <div key={c.id} className="card card-light" style={{ padding: '24px', border: '1px solid var(--border-color)' }}>
                <div className="card-header" style={{ marginBottom: '16px' }}>
                  <span style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '1rem' }}>
                    <Lock size={16} color="var(--accent-gold)" /> Evidence Locked
                  </span>
                  <span className={`status-badge status-${c.status === 'locked' ? 'locked' : 'closed'}`}>
                    {c.status === 'locked' ? 'Locked For Court' : c.status.replace('_', ' ').toUpperCase()}
                  </span>
                </div>
                <div style={{ marginBottom: '16px' }}>
                  <strong>{c.title}</strong>
                  <p style={{ fontSize: '0.85rem', marginTop: '8px', color: 'var(--text-secondary)' }}>
                    Your signature applied successfully.
                  </p>
                </div>
                {c.status === 'locked' && c.timeRemaining && <TimerView timeRemaining={c.timeRemaining} />}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
