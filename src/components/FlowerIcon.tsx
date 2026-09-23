import React from 'react';
import { MoodType } from '../types';

interface FlowerIconProps {
  mood: MoodType;
  size?: number;
  className?: string;
}

export const FlowerIcon: React.FC<FlowerIconProps> = ({ mood, size = 32, className = '' }) => {
  if (mood === 'happy') {
    // Red/coral miniature dahlia flower with layered petals and golden center
    return (
      <svg
        width={size}
        height={size}
        viewBox="0 0 48 48"
        className={`filter drop-shadow-[0_2px_4px_rgba(200,30,60,0.3)] ${className}`}
      >
        <defs>
          <radialGradient id="happyGrad" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#ff7b96" />
            <stop offset="65%" stopColor="#e83658" />
            <stop offset="100%" stopColor="#ab1234" />
          </radialGradient>
          <radialGradient id="centerYellow" cx="40%" cy="40%" r="60%">
            <stop offset="0%" stopColor="#fff3a1" />
            <stop offset="50%" stopColor="#ffb300" />
            <stop offset="100%" stopColor="#c77700" />
          </radialGradient>
        </defs>
        {/* Layer 1: Outer Petals (12 petals) */}
        {Array.from({ length: 12 }).map((_, i) => {
          const angle = (i * 360) / 12;
          return (
            <ellipse
              key={`outer-${i}`}
              cx="24"
              cy="7"
              rx="4.5"
              ry="8"
              fill="url(#happyGrad)"
              transform={`rotate(${angle} 24 24)`}
              opacity="0.9"
            />
          );
        })}
        {/* Layer 2: Mid Petals (10 petals) */}
        {Array.from({ length: 10 }).map((_, i) => {
          const angle = (i * 360) / 10 + 18;
          return (
            <ellipse
              key={`mid-${i}`}
              cx="24"
              cy="11"
              rx="3.8"
              ry="6.5"
              fill="#f14166"
              transform={`rotate(${angle} 24 24)`}
            />
          );
        })}
        {/* Layer 3: Inner Petals (8 petals) */}
        {Array.from({ length: 8 }).map((_, i) => {
          const angle = (i * 360) / 8 + 10;
          return (
            <ellipse
              key={`inner-${i}`}
              cx="24"
              cy="15"
              rx="3"
              ry="5"
              fill="#fb5d7f"
              transform={`rotate(${angle} 24 24)`}
            />
          );
        })}
        {/* Flower Center */}
        <circle cx="24" cy="24" r="5.5" fill="url(#centerYellow)" />
        <circle cx="23" cy="23" r="2.5" fill="#ffe066" opacity="0.6" />
      </svg>
    );
  }

  if (mood === 'neutral') {
    // Golden yellow miniature sunflower / dahlia with amber petals
    return (
      <svg
        width={size}
        height={size}
        viewBox="0 0 48 48"
        className={`filter drop-shadow-[0_2px_4px_rgba(200,140,20,0.3)] ${className}`}
      >
        <defs>
          <radialGradient id="neutralGrad" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#ffea78" />
            <stop offset="65%" stopColor="#f5b324" />
            <stop offset="100%" stopColor="#c78000" />
          </radialGradient>
          <radialGradient id="neutralCenter" cx="40%" cy="40%" r="60%">
            <stop offset="0%" stopColor="#e59316" />
            <stop offset="60%" stopColor="#a35700" />
            <stop offset="100%" stopColor="#5c3000" />
          </radialGradient>
        </defs>
        {/* Outer petals */}
        {Array.from({ length: 12 }).map((_, i) => {
          const angle = (i * 360) / 12;
          return (
            <ellipse
              key={`outer-${i}`}
              cx="24"
              cy="7"
              rx="4.5"
              ry="8"
              fill="url(#neutralGrad)"
              transform={`rotate(${angle} 24 24)`}
            />
          );
        })}
        {/* Mid petals */}
        {Array.from({ length: 10 }).map((_, i) => {
          const angle = (i * 360) / 10 + 15;
          return (
            <ellipse
              key={`mid-${i}`}
              cx="24"
              cy="11"
              rx="3.8"
              ry="6"
              fill="#fbc337"
              transform={`rotate(${angle} 24 24)`}
            />
          );
        })}
        {/* Center */}
        <circle cx="24" cy="24" r="5.5" fill="url(#neutralCenter)" />
        <circle cx="23" cy="23" r="2.5" fill="#fcd34d" opacity="0.5" />
      </svg>
    );
  }

  // Sad / Tired: Deep magenta/lavender purple flower
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 48 48"
      className={`filter drop-shadow-[0_2px_4px_rgba(140,50,180,0.3)] ${className}`}
    >
      <defs>
        <radialGradient id="sadGrad" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="#df9eff" />
          <stop offset="65%" stopColor="#aa5bd8" />
          <stop offset="100%" stopColor="#671994" />
        </radialGradient>
        <radialGradient id="sadCenter" cx="40%" cy="40%" r="60%">
          <stop offset="0%" stopColor="#ffe57f" />
          <stop offset="50%" stopColor="#f59e0b" />
          <stop offset="100%" stopColor="#7c2d12" />
        </radialGradient>
      </defs>
      {/* Outer petals */}
      {Array.from({ length: 12 }).map((_, i) => {
        const angle = (i * 360) / 12;
        return (
          <ellipse
            key={`outer-${i}`}
            cx="24"
            cy="7"
            rx="4.5"
            ry="8"
            fill="url(#sadGrad)"
            transform={`rotate(${angle} 24 24)`}
          />
        );
      })}
      {/* Mid petals */}
      {Array.from({ length: 10 }).map((_, i) => {
        const angle = (i * 360) / 10 + 18;
        return (
          <ellipse
            key={`mid-${i}`}
            cx="24"
            cy="11"
            rx="3.8"
            ry="6"
            fill="#b872e6"
            transform={`rotate(${angle} 24 24)`}
          />
        );
      })}
      {/* Center */}
      <circle cx="24" cy="24" r="5" fill="url(#sadCenter)" />
    </svg>
  );
};
