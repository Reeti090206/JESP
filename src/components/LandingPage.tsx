import React, { useState } from 'react';
import { useCase, Role } from '@/context/CaseContext';
import { Shield, UploadCloud, FileSignature, Lock, Scale, Clock } from 'lucide-react';

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
    <div className="landing-container">
      <div style={{ marginBottom: '20px' }}>
        <Scale size={80} color="var(--accent-gold)" />
      </div>
      <h1 className="landing-title">Secure Judicial Medical Evidence System</h1>
      <p className="landing-subtitle">
        Prevent medical evidence forgery in criminal and custody cases using cryptographic locking. 
        Ensure immutable chain-of-custody from the hospital straight to the courtroom.
      </p>

      <div className="features-list">
        <div className="feature-item">
          <UploadCloud size={16} /> Hospital Verified Upload
        </div>
        <div className="feature-item">
          <FileSignature size={16} /> Lawyer Auth Signature
        </div>
        <div className="feature-item">
          <Lock size={16} /> Automatic Evidence Locking
        </div>
        <div className="feature-item">
          <Clock size={16} /> Court Hearing Timer
        </div>
      </div>

      {showRoleSelect && (
        <div className="role-selector">
          <button 
            className={`role-btn ${selectedRole === 'judge' ? 'active' : ''}`}
            onClick={() => setSelectedRole('judge')}
          >
            Judge
          </button>
          <button 
            className={`role-btn ${selectedRole === 'hospital' ? 'active' : ''}`}
            onClick={() => setSelectedRole('hospital')}
          >
            Hospital Authority
          </button>
          <button 
            className={`role-btn ${selectedRole === 'lawyer' ? 'active' : ''}`}
            onClick={() => setSelectedRole('lawyer')}
          >
            Victim's Lawyer
          </button>
        </div>
      )}

      <button className="btn-primary" onClick={handleConnect} style={{ fontSize: '1.2rem', padding: '16px 32px' }}>
        <Shield size={24} />
        {showRoleSelect ? "Sign In with Wallet" : "Connect Wallet"}
      </button>

      <p style={{ marginTop: '24px', color: 'var(--text-muted)', fontSize: '0.9rem' }}>
        Web3 Authentication using MetaMask
      </p>
    </div>
  );
}
