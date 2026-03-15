import React from 'react';
import { useCase, CaseState } from '@/context/CaseContext';
import { ShieldAlert, CheckCircle2, LockOpen, FileText, Anchor } from 'lucide-react';

export default function CourtView({ caseData, onCloseCase }: { caseData: CaseState, onCloseCase: (id: string, outcome: { winner: string, settlementAmount?: string, description: string }) => void }) {
  const { role } = useCase();

  return (
    <div className="card card-gold-border">
      <div className="card-header" style={{ borderBottom: '1px solid var(--border-color)', paddingBottom: '16px', marginBottom: '24px' }}>
        <span style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <LockOpen size={24} color="var(--success)" /> Courtroom Evidence View
        </span>
        <span className="status-badge status-court">Revealed In Court</span>
      </div>

      <div style={{ display: 'flex', gap: '40px' }}>
        {/* Left Side: Document Viewer */}
        <div style={{ flex: 2, background: 'var(--bg-card-light)', color: 'var(--text-dark)', borderRadius: '12px', padding: '40px', minHeight: '500px', display: 'flex', flexDirection: 'column', border: '1px solid var(--border-light)' }}>
          <div style={{ borderBottom: '1px solid var(--border-light)', paddingBottom: '16px', marginBottom: '24px', display: 'flex', alignItems: 'center', gap: '12px' }}>
            <FileText size={24} color="var(--accent-blue)" />
            <h3 style={{ fontSize: '1.2rem', margin: 0, fontWeight: 600 }}>{caseData.evidence?.fileName}</h3>
            <span style={{ marginLeft: 'auto', fontSize: '0.85rem', color: 'var(--text-muted)' }}>
              Decrypted by Judge's Access Key
            </span>
          </div>
          
          <div style={{ flex: 1, border: '1px dashed #cbd5e1', borderRadius: '8px', padding: '24px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <p style={{ textAlign: 'center', color: 'var(--text-muted)', lineHeight: '1.8' }}>
              <span style={{ fontSize: '1.5rem', fontWeight: 600, display: 'block', marginBottom: '16px' }}>Medical Record Content</span>
              This section displays the decrypted post-mortem, DNA, or injury report.<br />
              It has been securely unlocked automatically as the countdown reached zero.
            </p>
          </div>
        </div>

        {/* Right Side: Verification Panel */}
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
          <div className="verification-panel" style={{ background: 'rgba(255, 255, 255, 0.05)', border: '1px solid var(--border-color)', marginBottom: '24px' }}>
            <h4 style={{ marginBottom: '16px', color: 'var(--accent-gold)', borderBottom: '1px solid var(--border-color)', paddingBottom: '12px' }}>
              Verification Log
            </h4>
            <div className="verification-item">
              <div className="verification-icon success"><CheckCircle2 size={14} /></div>
              <span>Hospital Authority Upload Verified</span>
            </div>
            <div className="verification-item">
              <div className="verification-icon success"><CheckCircle2 size={14} /></div>
              <span>Victim Lawyer Signature Verified</span>
            </div>
            <div className="verification-item">
              <div className="verification-icon success"><CheckCircle2 size={14} /></div>
              <span>Evidence Integrity Verified</span>
            </div>
            <div className="verification-item">
              <div className="verification-icon success"><CheckCircle2 size={14} /></div>
              <span>Court Record Timestamp Validated</span>
            </div>
          </div>

          <div style={{ 
            marginTop: 'auto', 
            background: 'linear-gradient(135deg, rgba(245,176,65,0.2) 0%, rgba(0,0,0,0) 100%)', 
            padding: '24px', 
            borderRadius: '12px', 
            border: '1px solid rgba(245,176,65,0.3)',
            textAlign: 'center'
          }}>
            <ShieldAlert size={48} color="var(--accent-gold)" style={{ margin: '0 auto 16px' }} />
            <span style={{ fontSize: '0.9rem', fontWeight: 600, color: 'var(--accent-gold)', letterSpacing: '1px' }}>
              VERIFIED JUDICIAL MEDICAL EVIDENCE
            </span>
          </div>

          {role === 'judge' && (
            <div style={{ marginTop: '24px', background: 'rgba(255,255,255,0.02)', padding: '24px', borderRadius: '12px', border: '1px solid var(--border-color)' }}>
              <h4 style={{ marginBottom: '16px' }}>Case Outcome Declaration</h4>
              <div className="input-group">
                <label className="input-label">Winner / Ruling</label>
                <select className="input-field" id="case-winner" defaultValue="State / Prosecution">
                  <option>State / Prosecution</option>
                  <option>Defendant</option>
                  <option>Settlement Reached</option>
                  <option>Dismissed</option>
                </select>
              </div>
              <div className="input-group">
                <label className="input-label">Settlement Amount / Fine (Optional)</label>
                <input type="text" id="case-settlement" className="input-field" placeholder="e.g. $3,600,000 or N/A" />
              </div>
              <div className="input-group">
                <label className="input-label">Summary Remarks</label>
                <input type="text" id="case-desc" className="input-field" placeholder="e.g. Defendant found guilty" />
              </div>

              <button 
                className="btn-primary" 
                style={{ width: '100%', marginTop: '12px', padding: '16px' }}
                onClick={() => {
                  const winner = (document.getElementById('case-winner') as HTMLSelectElement).value;
                  const settlementAmount = (document.getElementById('case-settlement') as HTMLInputElement).value;
                  const description = (document.getElementById('case-desc') as HTMLInputElement).value;
                  onCloseCase(caseData.id, { winner, settlementAmount, description: description || 'No summary provided.' });
                }}
              >
                <Anchor size={20} /> Close Case and Archive
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
