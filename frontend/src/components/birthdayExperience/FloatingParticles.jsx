import { useState } from 'react';

const SYMBOLS = ['💖', '💕', '🌸', '✨', '💫', '🌟', '💝', '🌺', '🦋', '⭐'];

/** Deterministic pseudo-random based on index so values are stable across renders. */
function seededValue(index, multiplier, offset, mod) {
  return ((index * multiplier + offset) % mod) / mod;
}

export default function FloatingParticles({ count = 16 }) {
  const [particles] = useState(() =>
    Array.from({ length: count }, (_, i) => ({
      id: i,
      symbol: SYMBOLS[i % SYMBOLS.length],
      left: `${4 + seededValue(i, 37, 5, 100) * 90}%`,
      top: `${4 + seededValue(i, 53, 11, 100) * 88}%`,
      delay: `${seededValue(i, 23, 0, 100) * 5}s`,
      duration: `${4.5 + seededValue(i, 17, 3, 100) * 4}s`,
      size: `${0.75 + (i % 4) * 0.18}rem`,
      opacity: 0.3 + (i % 3) * 0.12,
    }))
  );

  return (
    <div
      className="pointer-events-none fixed inset-0 overflow-hidden"
      aria-hidden="true"
    >
      {particles.map((p) => (
        <span
          key={p.id}
          className="absolute bday-float select-none"
          style={{
            left: p.left,
            top: p.top,
            fontSize: p.size,
            animationDelay: p.delay,
            animationDuration: p.duration,
            opacity: p.opacity,
          }}
        >
          {p.symbol}
        </span>
      ))}
    </div>
  );
}
