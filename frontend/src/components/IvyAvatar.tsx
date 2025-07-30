import React from 'react';
import { motion, easeInOut } from 'framer-motion';

interface IvyAvatarProps {
  expression: 'smile' | 'surprised' | 'neutral';
  listening: boolean;
  mouthMove: boolean;
  eyePos: { x: number; y: number };
  idle: boolean;
  nodding?: boolean;
  rapidBlink?: boolean;
  className?: string;
}

const IvyAvatar: React.FC<IvyAvatarProps> = ({
  expression,
  listening,
  mouthMove,
  eyePos,
  idle,
  nodding = false,
  rapidBlink = false,
  className = '',
}) => {
  // Clamp utility for eye movement
  const clamp = (val: number, min: number, max: number) => Math.max(min, Math.min(max, val));
  // Clamp the eye position to avoid pupils leaving the eye white
  const clampedEyePos = {
    x: clamp(eyePos.x, -1.5, 1.5),
    y: clamp(eyePos.y, -1.2, 1.2),
  };
  const headVariants = {
    initial: { y: 0 },
    nodding: {
      y: [0, 2, -2, 2, 0],
      transition: { duration: 1, repeat: Infinity, ease: easeInOut },
    },
  };

  const blinkTransition = rapidBlink
    ? { duration: 0.2, repeat: Infinity, repeatDelay: 0.5 }
    : idle
    ? { duration: 2, repeat: Infinity, repeatType: "loop" as const }
    : { duration: 0.3 };

  return (
    <motion.span
      role="img"
      aria-label={`Ivy avatar showing a ${expression} expression`}
      className={`avatar-ivy${listening ? ' avatar-listening' : ''}${idle ? ' avatar-idle' : ''} ${className}`}
      animate={nodding ? 'nodding' : 'initial'}
      variants={headVariants}
    >
      <svg width="48" height="48" viewBox="0 0 48 48" fill="none">
        <ellipse cx="24" cy="40" rx="12" ry="4" fill="#B3EDEB" opacity="0.35" />

        {listening && (
          <ellipse cx="24" cy="24" rx="17" ry="17" fill="#63D7C7" opacity="0.12" />
        )}

        <ellipse cx="24" cy="24" rx="16" ry="16" fill="#FFFAF3" stroke="#63D7C7" strokeWidth="2" />
        <rect x="12" y="14" width="24" height="6" rx="3" fill="#63D7C7" opacity="0.7" />

        {/* Eyes */}
        <g>
          {/* Eye whites - static position */}
          <ellipse cx={18} cy={22} rx="2.2" ry="2.2" fill="#fff" stroke="#1F7368" strokeWidth="1" />
          <ellipse cx={30} cy={22} rx="2.2" ry="2.2" fill="#fff" stroke="#1F7368" strokeWidth="1" />

          {/* Pupils - use motion.g to move pupils smoothly */}
          <motion.g
            animate={{ x: clampedEyePos.x, y: clampedEyePos.y }}
            transition={{ type: "spring", stiffness: 300, damping: 20 }}
          >
            <motion.ellipse
              cx={18}
              cy={22}
              fill="#63D7C7"
              animate={idle || rapidBlink ? { rx: [0.7, 1.1, 0.7], ry: [0.7, 0.2, 0.7] } : { rx: 0.7, ry: 0.7 }}
              transition={{
                rx: blinkTransition,
                ry: blinkTransition,
              }}
            />
          </motion.g>
          <motion.g
            animate={{ x: clampedEyePos.x, y: clampedEyePos.y }}
            transition={{ type: "spring", stiffness: 300, damping: 20 }}
          >
            <motion.ellipse
              cx={30}
              cy={22}
              fill="#63D7C7"
              animate={idle || rapidBlink ? { rx: [0.7, 1.1, 0.7], ry: [0.7, 0.2, 0.7] } : { rx: 0.7, ry: 0.7 }}
              transition={{
                rx: blinkTransition,
                ry: blinkTransition,
              }}
            />
          </motion.g>

          {/* Expressions - static position */}
          {expression === 'smile' && (
            <>
              <ellipse cx={18} cy={22.7} rx="0.5" ry="0.2" fill="#1F7368" />
              <ellipse cx={30} cy={22.7} rx="0.5" ry="0.2" fill="#1F7368" />
            </>
          )}
          {expression === 'surprised' && (
            <>
              <ellipse cx={18} cy={22} rx="0.7" ry="0.7" fill="#1F7368" />
              <ellipse cx={30} cy={22} rx="0.7" ry="0.7" fill="#1F7368" />
            </>
          )}
          {expression === 'neutral' && (
            <>
              <rect x={17.5} y={22.2} width="1" height="0.2" fill="#1F7368" />
              <rect x={29.5} y={22.2} width="1" height="0.2" fill="#1F7368" />
            </>
          )}
        </g>

        {/* Mouth */}
        {!mouthMove && expression === 'smile' && <path d="M19 28 Q24 32 29 28" stroke="#1F7368" strokeWidth="2" fill="none" />}
        {!mouthMove && expression === 'surprised' && <ellipse cx="24" cy="29" rx="2" ry="1.2" fill="#fff" stroke="#63D7C7" strokeWidth="1" />}
        {!mouthMove && expression === 'neutral' && <path d="M20 28 Q24 29 28 28" stroke="#1F7368" strokeWidth="2" fill="none" />}
        {mouthMove && (
          <motion.ellipse
            cx="24"
            cy="30.5"
            rx="3"
            ry="1.2"
            fill="#63D7C7"
            opacity="0.5"
            animate={{
              ry: [1.2, 2, 1.2],
              opacity: [0.5, 0.9, 0.5],
            }}
            transition={{ duration: 0.6, repeat: Infinity }}
          />
        )}

        {/* Ears & Highlight */}
        <ellipse cx="7" cy="24" rx="2.5" ry="4" fill="#63D7C7" opacity="0.7" />
        <ellipse cx="41" cy="24" rx="2.5" ry="4" fill="#63D7C7" opacity="0.7" />
        <ellipse cx="32" cy="16" rx="3" ry="1" fill="#fff" opacity="0.18" />
      </svg>
    </motion.span>
  );
};

export default IvyAvatar;
