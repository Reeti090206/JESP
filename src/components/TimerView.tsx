import React from 'react';

export default function TimerView({ timeRemaining }: { timeRemaining: { days: number; hours: number; minutes: number; seconds: number } | null | undefined }) {
  if (!timeRemaining) return null;

  return (
    <div className="timer-section">
      <h3 style={{ color: 'var(--text-secondary)', fontWeight: 500 }}>Hearing Countdown Active</h3>
      
      <div className="timer-digits">
        {isNaN(timeRemaining.days) ? '00:00:00:00' : (
          <>
            {String(timeRemaining.days).padStart(2, '0')}:
            {String(timeRemaining.hours).padStart(2, '0')}:
            {String(timeRemaining.minutes).padStart(2, '0')}:
            {String(timeRemaining.seconds).padStart(2, '0')}
          </>
        )}
      </div>
      
      <div className="timer-labels">
        <span>Days</span>
        <span>Hours</span>
        <span>Minutes</span>
        <span>Seconds</span>
      </div>

      {timeRemaining.days === 0 && timeRemaining.hours < 24 && (
        <div style={{ background: 'rgba(239, 68, 68, 0.2)', color: '#f87171', padding: '8px', borderRadius: '4px', display: 'inline-block', marginTop: '16px' }}>
          Less than 24 Hours Left For Hearing
        </div>
      )}
    </div>
  );
}
