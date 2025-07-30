import React, { useEffect, useState } from 'react';
import './ChatWidgetAnimations.css';

// Corrected: Removed ": React.FC"
const TypingIndicator = () => {
  // Corrected: Removed the type annotation "<'delay' | 'pulse'>"
  const [phase, setPhase] = useState('delay'); 
  
  useEffect(() => {
    const delayTimer = setTimeout(() => setPhase('pulse'), 700); // match CSS delay
    return () => clearTimeout(delayTimer);
  }, []);

  return (
    <div className={`typing-indicator${phase === 'delay' ? ' delay' : ' pulse'}`}>
      <span className="dot" />
      <span className="dot" />
      <span className="dot" />
    </div>
  );
};

export default TypingIndicator;
