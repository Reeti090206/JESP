"use client";
import React, { useState } from 'react';
import { useCase } from '@/context/CaseContext';
import { ShieldCheck, Scale, FileText, Clock, LogOut, Database, Shield } from 'lucide-react';

import LandingPage from '@/components/LandingPage';
import JudgeDashboard from '@/components/JudgeDashboard';
import HospitalDashboard from '@/components/HospitalDashboard';
import LawyerDashboard from '@/components/LawyerDashboard';
import CourtView from '@/components/CourtView';

export default function Home() {
  const { isConnected, role, walletAddress, disconnectWallet, cases, closeCase } = useCase();
  const [activeTab, setActiveTab] = useState('dashboard');

  if (!isConnected || !role) {
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
        <div className="fade-in">
          <div className="section-header">
            <h2 className="section-title">Case Repository</h2>
            <p className="section-subtitle">Manage and track all ongoing judicial proceedings.</p>
          </div>
          
          {activeCases.length === 0 ? (
            <div className="empty-state">
              <FileText size={48} />
              <p>No active cases found in the repository.</p>
            </div>
          ) : (
            <div className="card-grid">
              {activeCases.map(c => (
                <div key={c.id} className="card hover-glow" style={{ padding: '24px' }}>
                  <div className="card-header" style={{ marginBottom: '16px' }}>
                    <span style={{ fontWeight: 700 }}>{c.title}</span>
                    <span className={`status-badge status-${c.status === 'locked' ? 'locked' : (c.status === 'awaiting_hospital' ? 'awaiting-hospital' : 'court')}`}>
                      {c.status.replace('_', ' ').toUpperCase()}
                    </span>
                  </div>
                  <div className="case-details">
                    <div className="detail-item">
                      <span className="label">VICTIM</span>
                      <span className="value">{c.victim}</span>
                    </div>
                    <div className="detail-item">
                      <span className="label">ACCUSED</span>
                      <span className="value">{c.accused}</span>
                    </div>
                  </div>
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
        <div className="fade-in">
          <div className="section-header">
            <h2 className="section-title">Cryptographic Vault</h2>
            <p className="section-subtitle">Securely locked evidence awaiting official court proceedings.</p>
          </div>

          {lockedCases.length === 0 ? (
            <div className="empty-state">
              <ShieldCheck size={48} />
              <p>No evidence currently residing in the cryptographic vault.</p>
            </div>
          ) : (
            <div className="card-grid">
              {lockedCases.map(c => (
                <div key={c.id} className="card card-gold-border hover-glow" style={{ padding: '24px' }}>
                  <div className="card-header" style={{ marginBottom: '16px' }}>
                    <span style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--accent-gold)' }}>
                      <ShieldCheck size={20} /> Vaulted Evidence
                    </span>
                    <span className="status-badge status-locked">SECURED</span>
                  </div>
                  <div className="case-details">
                    <div className="detail-item">
                      <span className="label">CASE TITLE</span>
                      <span className="value">{c.title}</span>
                    </div>
                    <div className="detail-item">
                      <span className="label">INTEGRITY</span>
                      <span className="value text-success">VERIFIED</span>
                    </div>
                  </div>
                  <p style={{ color: 'var(--text-secondary)', fontSize: '0.85rem', marginTop: '16px', lineHeight: '1.6' }}>
                    This evidence is cryptographically sealed. Access is strictly prohibited until the adjudication timer expires.
                  </p>
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
        <div className="fade-in">
          <div className="section-header">
            <h2 className="section-title">Court Docket</h2>
            <p className="section-subtitle">Scheduled hearings and pending judicial decisions.</p>
          </div>

          {hearingCases.length === 0 ? (
            <div className="empty-state">
              <Clock size={48} />
              <p>The court docket is currently clear. No pending hearings.</p>
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
              {hearingCases.map(c => (
                <div key={c.id}>
                  {c.status === 'revealed' && role === 'judge' ? (
                    <CourtView caseData={c} onCloseCase={closeCase} />
                  ) : (
                    <div className="card hover-glow" style={{ padding: '24px' }}>
                      <div className="card-header" style={{ marginBottom: '24px' }}>
                        <span style={{ fontSize: '1.25rem', fontWeight: 700 }}>{c.title}</span>
                        <div className="status-badge status-court">HEARING SCHEDULED</div>
                      </div>
                      
                      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px' }}>
                        <div className="case-details">
                          <div className="detail-item">
                            <span className="label">SCHEDULED DATE</span>
                            <span className="value text-gold">{c.hearingDate?.toLocaleString()}</span>
                          </div>
                          <div className="detail-item">
                            <span className="label">PROTOCOL STATUS</span>
                            <span className="value">{c.status.replace('_', ' ').toUpperCase()}</span>
                          </div>
                        </div>
                        
                        <div style={{ padding: '16px', background: 'rgba(59, 130, 246, 0.05)', borderRadius: '8px', border: '1px solid rgba(59, 130, 246, 0.1)', display: 'flex', alignItems: 'center', gap: '16px' }}>
                          <Clock className="text-gold" size={32} />
                          <div>
                            <div style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-muted)' }}>SESSION NOTICE</div>
                            <div style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', marginTop: '4px' }}>
                              All parties must be present at the scheduled time with valid credentials.
                            </div>
                          </div>
                        </div>
                      </div>
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
      {/* Enterprise Executive Sidebar */}
      <aside className="sidebar">
        <div className="sidebar-logo">
          <Shield size={24} />
          <span>JESP AUTHORITY</span>
        </div>

        <nav className="sidebar-nav">
          <button
            className={`nav-item ${activeTab === 'dashboard' ? 'active' : ''}`}
            onClick={() => setActiveTab('dashboard')}
          >
            <Database size={20} />
            <span>OPERATIONS</span>
          </button>

          {(role === 'judge' || role === 'hospital') && (
            <button 
              className={`nav-item ${activeTab === 'active_cases' ? 'active' : ''}`}
              onClick={() => setActiveTab('active_cases')}
            >
              <FileText size={20} />
              <span>CASE LEDGER</span>
            </button>
          )}

          {(role === 'judge' || role === 'lawyer') && (
            <button 
              className={`nav-item ${activeTab === 'evidence_lock' ? 'active' : ''}`}
              onClick={() => setActiveTab('evidence_lock')}
            >
              <ShieldCheck size={20} />
              <span>SECURE VAULT</span>
            </button>
          )}

          {(role === 'judge' || role === 'lawyer') && (
            <button 
              className={`nav-item ${activeTab === 'hearings' ? 'active' : ''}`}
              onClick={() => setActiveTab('hearings')}
            >
              <Clock size={20} />
              <span>ADJUDICATION</span>
            </button>
          )}
        </nav>

        <div style={{ marginTop: 'auto', padding: '24px 12px', borderTop: 'var(--border-fine)' }}>
          <button className="nav-item logout-btn" onClick={disconnectWallet}>
            <LogOut size={20} />
            <span>TERMINATE SESSION</span>
          </button>
        </div>
      </aside>

      {/* Modern Main Content */}
      <main className="main-content">
        <header className="header">
          <div className="header-breadcrumb">
            <span>NETWORK</span>
            <span style={{ color: 'var(--accent-gold)', opacity: 0.4, margin: '0 8px' }}>/</span>
            <span style={{ color: 'var(--text-primary)', fontWeight: 600 }}>{activeTab.toUpperCase()}</span>
          </div>

          <div className="header-actions">
            <div className="user-profile">
              <div style={{ textAlign: 'right', marginRight: '4px' }}>
                <div style={{ fontSize: '0.8rem', fontWeight: 700, color: 'var(--text-primary)' }}>{role.toUpperCase()}</div>
                <div style={{ fontSize: '0.65rem', color: 'var(--text-muted)', fontFamily: 'monospace' }}>
                  {walletAddress.slice(0, 10)}...
                </div>
              </div>
              <div className="user-avatar" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.9rem' }}>
                {role.charAt(0).toUpperCase()}
              </div>
            </div>
          </div>
        </header>

        <section className="content-area">
          {renderContent()}
        </section>
      </main>
    </div>
  );
}
