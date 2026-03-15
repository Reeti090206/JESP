import React, { useState } from 'react';
import { useCase, Role } from '@/context/CaseContext';
import { Shield, UploadCloud, FileSignature, Lock, Scale, Clock, Gavel, Landmark, Stethoscope, ShieldCheck, History, Briefcase } from 'lucide-react';

export default function LandingPage() {
  const { connectWallet } = useCase();
  const [showRoleSelect, setShowRoleSelect] = useState(false);
  const [selectedRole, setSelectedRole] = useState<Role>('judge');

  const handleConnect = () => {
    if (showRoleSelect) {
      connectWallet(selectedRole);
    } else {
      setShowRoleSelect(true);
    }
  };

  return (
    <div className="landing-container fade-in">
      <div className="landing-badge">
        ENTERPRISE GRADE SECURITY // NODE 02.15
      </div>
      
      <h1 className="landing-title">Justice <br/>Authority</h1>
      <p className="landing-subtitle">
        Secure Forensic Evidence Management System. <br/>
        Unified cryptographic chain-of-custody for judicial and medical institutions.
      </p>

      {!showRoleSelect ? (
        <>
          <div className="features-list">
            <div className="feature-item">
              <Landmark size={24} /> 
              <span>Judicial Oversight</span>
            </div>
            <div className="feature-item">
              <ShieldCheck size={24} /> 
              <span>Verified Repositories</span>
            </div>
            <div className="feature-item">
              <Lock size={24} /> 
              <span>Cryptographic Audits</span>
            </div>
            <div className="feature-item">
              <History size={24} /> 
              <span>Immutable History</span>
            </div>
          </div>

          <button className="btn-primary" onClick={handleConnect} style={{ padding: '16px 48px', fontWeight: 600 }}>
            Establish Secure Access
          </button>
        </>
      ) : (
        <div className="fade-in" style={{ width: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
          <div className="role-selector">
            <button 
              className={`role-btn ${selectedRole === 'judge' ? 'active' : ''}`}
              onClick={() => setSelectedRole('judge')}
            >
              <Scale size={32} />
              <span>JUDICIAL AUTHORITY</span>
            </button>
            <button 
              className={`role-btn ${selectedRole === 'hospital' ? 'active' : ''}`}
              onClick={() => setSelectedRole('hospital')}
            >
              <Stethoscope size={32} />
              <span>MEDICAL OFFICIAL</span>
            </button>
            <button 
              className={`role-btn ${selectedRole === 'lawyer' ? 'active' : ''}`}
              onClick={() => setSelectedRole('lawyer')}
            >
              <Briefcase size={32} />
              <span>LEGAL COUNSEL</span>
            </button>
          </div>

          <button className="btn-primary" onClick={handleConnect} style={{ padding: '16px 48px', fontWeight: 600 }}>
            Continue as {selectedRole?.toUpperCase()}
          </button>
          
          <button 
            className="text-muted" 
            onClick={() => setShowRoleSelect(false)}
            style={{ marginTop: '24px', fontSize: '0.85rem', background: 'none', border: 'none', color: 'var(--text-muted)', textDecoration: 'underline', cursor: 'pointer' }}
          >
            Go Back
          </button>
        </div>
      )}

      <footer style={{ marginTop: '80px', borderTop: 'var(--border-fine)', paddingTop: '32px', width: '100%', maxWidth: '800px' }}>
        <p style={{ color: 'var(--text-muted)', fontSize: '0.75rem', letterSpacing: '0.05em', fontWeight: 500 }}>
          CERTIFIED CRYPTOGRAPHIC PROTOCOL // ACCELERATED ADJUDICATION SYSTEM
        </p>
      </footer>
    </div>
  );
}
