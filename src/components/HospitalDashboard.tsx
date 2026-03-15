import React, { useState } from 'react';
import { useCase, CaseState } from '@/context/CaseContext';
import { ShieldAlert, UploadCloud, FileLock2, AlertCircle } from 'lucide-react';

export default function HospitalDashboard() {
  const { cases, uploadEvidence } = useCase();
  const [selectedCaseId, setSelectedCaseId] = useState<string | null>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [reportType, setReportType] = useState('Post-Mortem');
  const [isUploading, setIsUploading] = useState(false);

  const awaitingCases = cases.filter(c => c.status === 'awaiting_hospital');
  const activeCase = awaitingCases.find(c => c.id === selectedCaseId) || awaitingCases[0];

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) setSelectedFile(e.target.files[0]);
  };

  const handleDragOver = (e: React.DragEvent) => e.preventDefault();
  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    if (e.dataTransfer.files && e.dataTransfer.files[0]) setSelectedFile(e.dataTransfer.files[0]);
  };

  const handleUpload = async () => {
    if (!selectedFile || !activeCase) return;
    setIsUploading(true);
    await uploadEvidence(activeCase.id, selectedFile, reportType);
    setIsUploading(false);
    setSelectedFile(null);
    setSelectedCaseId(null);
  };

  const newlyUploadedCases = cases.filter(c => c.hospitalVerified && c.status === 'awaiting_lawyer');

  if (awaitingCases.length === 0) {
    return (
      <div style={{ textAlign: 'center', padding: '100px 0', color: 'var(--text-secondary)' }}>
        <ShieldAlert size={64} style={{ margin: '0 auto 20px', opacity: 0.5 }} />
        <h2>No pending cases found</h2>
        <p>A judge must assign a case before you can upload evidence.</p>
        
        {newlyUploadedCases.length > 0 && (
          <div style={{ marginTop: '40px' }}>
            <h3 style={{ marginBottom: '16px' }}>Recently Uploaded (Awaiting Lawyer)</h3>
            <div className="card-grid">
              {newlyUploadedCases.map(c => (
                <div key={c.id} className="card card-light" style={{ padding: '20px', textAlign: 'left' }}>
                  <strong>{c.title}</strong>
                  <p style={{ fontSize: '0.85rem', marginTop: '8px' }}>Hash: {c.evidence?.hash.slice(0, 12)}...</p>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    );
  }

  return (
    <div>
      <h2 style={{ marginBottom: '24px' }}>Assigned Cases for Upload</h2>

      <div style={{ display: 'flex', gap: '12px', marginBottom: '24px', overflowX: 'auto' }}>
        {awaitingCases.map(c => (
          <button 
            key={c.id} 
            className="btn-secondary" 
            style={{ 
              borderColor: activeCase?.id === c.id ? 'var(--accent-gold)' : 'var(--border-color)',
              color: activeCase?.id === c.id ? 'var(--accent-gold)' : 'var(--text-secondary)'
            }}
            onClick={() => setSelectedCaseId(c.id)}
          >
            {c.title}
          </button>
        ))}
      </div>

      {activeCase && (
        <div className="card-grid">
          <div className="card card-gold-border" style={{ gridColumn: 'span 2' }}>
            <div className="card-header">
              Upload Medical Evidence
              <span className="status-badge status-awaiting-hospital">Awaiting Hospital Upload</span>
            </div>
            
            <div style={{ padding: '20px', background: 'rgba(59, 130, 246, 0.05)', borderRadius: '8px', border: '1px solid rgba(59, 130, 246, 0.2)', marginBottom: '24px' }}>
              <h3 style={{ fontSize: '1.2rem', marginBottom: '8px' }}>Case: {activeCase.title}</h3>
              <p style={{ color: 'var(--text-secondary)' }}>Victim: {activeCase.victim} | Accused: {activeCase.accused}</p>
            </div>

            <div style={{ display: 'flex', gap: '40px' }}>
              <div style={{ flex: 1 }}>
                <div className="input-group">
                  <label className="input-label">Medical Report Type</label>
                  <select 
                    className="input-field" 
                    value={reportType} 
                    onChange={(e) => setReportType(e.target.value)}
                  >
                    <option>Post-Mortem</option>
                    <option>DNA</option>
                    <option>Injury Examination</option>
                  </select>
                </div>

                <div 
                  className="file-drop-area" 
                  onDragOver={handleDragOver} 
                  onDrop={handleDrop}
                >
                  {!selectedFile ? (
                    <>
                      <UploadCloud size={48} color="var(--text-secondary)" style={{ margin: '0 auto 16px' }} />
                      <p style={{ fontSize: '1.1rem', marginBottom: '8px' }}>Drag and Drop File Here</p>
                      <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', marginBottom: '16px' }}>or</p>
                      
                      <label className="btn-secondary" style={{ display: 'inline-block', cursor: 'pointer' }}>
                        Browse Files
                        <input type="file" style={{ display: 'none' }} onChange={handleFileChange} />
                      </label>
                    </>
                  ) : (
                    <>
                      <FileLock2 size={48} color="var(--accent-gold)" style={{ margin: '0 auto 16px' }} />
                      <p style={{ fontSize: '1.1rem', marginBottom: '8px' }}>{selectedFile.name}</p>
                      <p style={{ color: 'var(--success)', fontSize: '0.9rem' }}>Ready for encryption and upload</p>
                      <button className="btn-secondary" style={{ marginTop: '16px', padding: '6px 16px' }} onClick={() => setSelectedFile(null)}>Remove</button>
                    </>
                  )}
                </div>

                <button 
                  className="btn-primary" 
                  style={{ width: '100%', marginTop: '24px', opacity: !selectedFile || isUploading ? 0.5 : 1 }}
                  disabled={!selectedFile || isUploading}
                  onClick={handleUpload}
                >
                  {isUploading ? 'Encrypting & Uploading...' : 'Upload Medical Evidence'}
                </button>
              </div>
              
              <div style={{ flex: 1, display: 'flex', flexDirection: 'column', padding: '24px', background: 'rgba(0,0,0,0.2)', borderRadius: '12px' }}>
                <h4 style={{ marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <AlertCircle size={20} color="var(--accent-gold)" /> backend operations
                </h4>
                <ul style={{ color: 'var(--text-secondary)', fontSize: '0.95rem', lineHeight: '2' }}>
                  <li>1. Local SHA-256 generation</li>
                  <li>2. <strong>AES-GCM Document Encryption</strong></li>
                  <li>3. <strong>Upload to IPFS network</strong></li>
                  <li>4. Link Evidence Hash to Case ID</li>
                  <li>5. Transfer Access Rights</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
