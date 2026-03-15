"use client";
import React, { useState } from 'react';
import { useCase } from '@/context/CaseContext';
import { ShieldCheck, Scale, FileText, Clock, LogOut, Database } from 'lucide-react';

import LandingPage from '@/components/LandingPage';
import JudgeDashboard from '@/components/JudgeDashboard';
import HospitalDashboard from '@/components/HospitalDashboard';
import LawyerDashboard from '@/components/LawyerDashboard';
import CourtView from '@/components/CourtView';

export default function Home() {
  const { isConnected, role, walletAddress, disconnectWallet, cases, closeCase } = useCase();
  const [activeTab, setActiveTab] = useState('dashboard');

  if (!isConnected) {
    return <LandingPage />;
  }

  const renderContent = () => {
    if (activeTab === 'dashboard') {
      return (
        <>
          {role === 'judge' && <JudgeDashboard />}
          {role === 'hospital' && <HospitalDashboard />}
          {role === 'lawyer' && <LawyerDashboard />}
        </>
      );
    }

    if (activeTab === 'active_cases') {
      const activeCases = cases.filter(c => c.status !== 'closed');
      return (
        <div>
          <h2 style={{ marginBottom: '24px' }}>Active Cases ({activeCases.length})</h2>
          {activeCases.length === 0 ? <p style={{ color: 'var(--text-secondary)' }}>No active cases.</p> : (
            <div className="card-grid">
              {activeCases.map(c => (
                <div key={c.id} className="card card-light" style={{ padding: '24px' }}>
                  <div className="card-header" style={{ marginBottom: '16px' }}>
                    <span>{c.title}</span>
                    <span className={`status-badge status-${c.status === 'locked' ? 'locked' : 'awaiting-hospital'}`}>
                      {c.status.replace('_', ' ').toUpperCase()}
                    </span>
                  </div>
                  <p><strong>Victim:</strong> {c.victim}</p>
                  <p><strong>Accused:</strong> {c.accused}</p>
                </div>
              ))}
            </div>
          )}
        </div>
      );
    }

    if (activeTab === 'evidence_lock') {
      const lockedCases = cases.filter(c => c.status === 'locked' || c.status === 'revealed');
      return (
        <div>
          <h2 style={{ marginBottom: '24px' }}>Evidence Lock</h2>
          {lockedCases.length === 0 ? <p style={{ color: 'var(--text-secondary)' }}>No evidence currently locked.</p> : (
            <div className="card-grid">
              {lockedCases.map(c => (
                <div key={c.id} className="card card-gold-border" style={{ padding: '24px' }}>
                  <div className="card-header" style={{ marginBottom: '16px' }}>
                    <span style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <ShieldCheck size={20} color="var(--accent-gold)" /> Evidence Locked
                    </span>
                  </div>
                  <p style={{ marginBottom: '16px' }}><strong>Case:</strong> {c.title}</p>
                  <p style={{ color: 'var(--text-secondary)' }}>Status: Cryptographically secured. Cannot be modified or viewed until the hearing timer expires.</p>
                </div>
              ))}
            </div>
          )}
        </div>
      );
    }

    if (activeTab === 'hearings') {
      const hearingCases = cases.filter(c => c.status !== 'closed' && c.hearingDate);
      return (
        <div>
          <h2 style={{ marginBottom: '24px' }}>Court Hearings & Adjudication</h2>
          {hearingCases.length === 0 ? <p style={{ color: 'var(--text-secondary)' }}>No scheduled hearings.</p> : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
              {hearingCases.map(c => (
                <div key={c.id}>
                  {c.status === 'revealed' && role === 'judge' ? (
                    <CourtView caseData={c} onCloseCase={closeCase} />
                  ) : (
                    <div className="card card-light" style={{ padding: '24px' }}>
                      <div className="card-header" style={{ marginBottom: '16px' }}>
                        <span>{c.title}</span>
                        <Clock size={20} color="var(--accent-blue)" />
                      </div>
                      <p><strong>Hearing Date:</strong> {c.hearingDate?.toLocaleString()}</p>
                      <p style={{ color: 'var(--text-secondary)', marginTop: '8px' }}>
                        Status: {c.status.replace('_', ' ').toUpperCase()}
                      </p>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      );
    }

    return null;
  };

  return (
    <div className="dashboard-layout">
      {/* Sidebar */}
      <aside className="sidebar">
        <div className="sidebar-logo">
          <Scale size={28} />
          <span>Balance of Justice</span>
        </div>
        <nav className="sidebar-nav">
          <button
            className={`nav-item ${activeTab === 'dashboard' ? 'active' : ''}`}
            onClick={() => setActiveTab('dashboard')}
            style={{ width: '100%', textAlign: 'left', background: 'transparent', border: 'none', cursor: 'pointer' }}
          >
            <Database size={20} />
            <span>Dashboard</span>
          </button>
          <button
            className={`nav-item ${activeTab === 'active_cases' ? 'active' : ''}`}
            onClick={() => setActiveTab('active_cases')}
            style={{ width: '100%', textAlign: 'left', background: 'transparent', border: 'none', cursor: 'pointer' }}
          >
            <FileText size={20} />
            <span>Active Cases</span>
          </button>
          <button
            className={`nav-item ${activeTab === 'evidence_lock' ? 'active' : ''}`}
            onClick={() => setActiveTab('evidence_lock')}
            style={{ width: '100%', textAlign: 'left', background: 'transparent', border: 'none', cursor: 'pointer' }}
          >
            <ShieldCheck size={20} />
            <span>Evidence Lock</span>
          </button>
          <button
            className={`nav-item ${activeTab === 'hearings' ? 'active' : ''}`}
            onClick={() => setActiveTab('hearings')}
            style={{ width: '100%', textAlign: 'left', background: 'transparent', border: 'none', cursor: 'pointer' }}
          >
            <Clock size={20} />
            <span>Hearings</span>
          </button>
        </nav>
      </aside>

      {/* Main Content */}
      <main className="main-content">
        <header className="header">
          <div className="header-title">
            {role === 'judge' && 'Judge Dashboard'}
            {role === 'hospital' && 'Hospital Dashboard'}
            {role === 'lawyer' && 'Lawyer Dashboard'}
          </div>
          <div className="header-actions">
            <div className="wallet-badge">
              Connected: {walletAddress.slice(0, 6)}...{walletAddress.slice(-4)}
            </div>
            <button
              className="btn-secondary"
              style={{ padding: '6px 12px', border: 'none' }}
              onClick={disconnectWallet}
              title="Disconnect"
            >
              <LogOut size={20} />
            </button>
          </div>
        </header>

        <section className="content-area">
          {renderContent()}
        </section>
      </main>
    </div>
  );
}
