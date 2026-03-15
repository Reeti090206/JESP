import React from 'react';
import { Check, Clock, ShieldAlert, FileText, Lock } from 'lucide-react';
import { CaseState } from '@/context/CaseContext';

export default function CaseTimeline({ caseData }: { caseData: CaseState }) {
  const { status, hospitalVerified, lawyerVerified } = caseData;

  const milestones = [
    { label: 'Case Created', icon: <Check size={14} />, done: true, active: status === 'awaiting_hospital' },
    { label: 'Medical Report Uploaded', icon: <FileText size={14} />, done: hospitalVerified, active: status === 'awaiting_lawyer' },
    { label: 'Victim Lawyer Signed', icon: <FileSignatureIcon size={14} />, done: lawyerVerified, active: status === 'locked' && !lawyerVerified },
    { label: 'Evidence Automatically Locked', icon: <Lock size={14} />, done: status === 'locked' || status === 'revealed' || status === 'closed', active: status === 'locked' },
    { label: 'Awaiting Court Hearing', icon: <Clock size={14} />, done: status === 'revealed' || status === 'closed', active: status === 'locked' },
    { label: 'Revealed In Court', icon: <ShieldAlert size={14} />, done: status === 'closed', active: status === 'revealed' },
    { label: 'Case Closed', icon: <Check size={14} />, done: status === 'closed', active: false },
  ];

  return (
    <div className="timeline">
      {milestones.map((m, idx) => (
        <div key={idx} className={`timeline-item ${m.done ? 'completed' : ''} ${m.active ? 'active' : ''}`}>
          <div className="timeline-icon">
            {m.icon}
          </div>
          <div className="timeline-content">
            <h4 className="timeline-title">{m.label}</h4>
            {m.active && <span className="timeline-time">In Progress...</span>}
            {m.done && <span className="timeline-time">Completed ✓</span>}
            {(!m.done && !m.active) && <span className="timeline-time">Pending</span>}
          </div>
        </div>
      ))}
    </div>
  );
}

function FileSignatureIcon({ size }: { size: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M20 19.5v.5a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h5.5"/>
      <path d="m11 12 3 3 7-7"/>
      <path d="M14 2v4a2 2 0 0 0 2 2h4"/>
    </svg>
  );
}
