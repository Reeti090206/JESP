"use client";
import React, { createContext, useContext, useState, useEffect } from 'react';

export type Role = 'judge' | 'hospital' | 'lawyer' | null;

export type CaseStatus = 
  | 'awaiting_hospital'
  | 'awaiting_lawyer'
  | 'locked'
  | 'revealed'
  | 'closed';

export interface Evidence {
  fileName: string;
  hash: string;
  signature?: string;
}

export interface CaseState {
  id: string;
  title: string;
  victim: string;
  accused: string;
  hearingDate: Date | null;
  status: CaseStatus;
  evidence: Evidence | null;
  hospitalVerified: boolean;
  lawyerVerified: boolean;
  timeRemaining?: { days: number; hours: number; minutes: number; seconds: number } | null;
  outcome?: {
    winner: string;
    settlementAmount?: string;
    description: string;
  };
}

interface CaseContextType {
  role: Role;
  walletAddress: string;
  isConnected: boolean;
  cases: CaseState[];
  connectWallet: (role: Role) => void;
  disconnectWallet: () => void;
  createCase: (title: string, victim: string, accused: string, hearingDate: Date) => void;
  uploadEvidence: (caseId: string, file: File, type: string) => Promise<void>;
  signEvidence: (caseId: string) => Promise<void>;
  closeCase: (caseId: string, outcome: { winner: string, settlementAmount?: string, description: string }) => void;
}

const CaseContext = createContext<CaseContextType | undefined>(undefined);

export const CaseProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [role, setRole] = useState<Role>(null);
  const [walletAddress, setWalletAddress] = useState('');
  const [isConnected, setIsConnected] = useState(false);
  const [cases, setCases] = useState<CaseState[]>([]);

  const connectWallet = (selectedRole: Role) => {
    // Generate mock address
    setWalletAddress('0x' + Math.random().toString(16).slice(2, 42));
    setRole(selectedRole);
    setIsConnected(true);
  };

  const disconnectWallet = () => {
    setIsConnected(false);
    setRole(null);
    setWalletAddress('');
  };

  // Mock AES-GCM and IPFS
  const mockEncryptAndUploadToIPFS = async (file: File) => {
    return new Promise<{ hash: string }>(resolve => {
      setTimeout(() => {
        const mockHash = 'Qm' + Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
        resolve({ hash: mockHash });
      }, 1500);
    });
  };

  const createCase = (title: string, victim: string, accused: string, hearingDate: Date) => {
    const newCase: CaseState = {
      id: Math.random().toString(36).substring(2, 9),
      title,
      victim,
      accused,
      hearingDate,
      status: 'awaiting_hospital',
      evidence: null,
      hospitalVerified: false,
      lawyerVerified: false,
      timeRemaining: null,
    };
    setCases(prev => [...prev, newCase]);
  };

  const uploadEvidence = async (caseId: string, file: File, type: string) => {
    const { hash } = await mockEncryptAndUploadToIPFS(file);
    setCases(prev => prev.map(c => c.id === caseId ? {
      ...c,
      status: 'awaiting_lawyer',
      evidence: { fileName: `${type} - ${file.name}`, hash },
      hospitalVerified: true,
    } : c));
  };

  const signEvidence = async (caseId: string) => {
    return new Promise<void>(resolve => {
      setTimeout(() => {
        setCases(prev => prev.map(c => c.id === caseId ? {
          ...c,
          status: 'locked',
          evidence: c.evidence ? { ...c.evidence, signature: '0x' + Math.random().toString(16).slice(2, 130) } : null,
          lawyerVerified: true,
        } : c));
        resolve();
      }, 1500);
    });
  };

  const closeCase = (caseId: string, outcome: { winner: string, settlementAmount?: string, description: string }) => {
    setCases(prev => prev.map(c => c.id === caseId ? { ...c, status: 'closed', outcome } : c));
  };

  useEffect(() => {
    const interval = setInterval(() => {
      setCases(prev => prev.map(c => {
        if (c.status === 'locked' && c.hearingDate) {
          const now = new Date().getTime();
          const distance = c.hearingDate.getTime() - now;
          if (distance < 0) {
            return { ...c, status: 'revealed', timeRemaining: null };
          }
          return {
            ...c,
            timeRemaining: {
              days: Math.floor(distance / (1000 * 60 * 60 * 24)),
              hours: Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
              minutes: Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60)),
              seconds: Math.floor((distance % (1000 * 60)) / 1000),
            }
          };
        }
        return c;
      }));
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  return (
    <CaseContext.Provider value={{
      role, walletAddress, isConnected, cases,
      connectWallet, disconnectWallet, createCase, uploadEvidence, signEvidence, closeCase
    }}>
      {children}
    </CaseContext.Provider>
  );
};

export const useCase = () => {
  const context = useContext(CaseContext);
  if (context === undefined) throw new Error('useCase must be used within a CaseProvider');
  return context;
};
