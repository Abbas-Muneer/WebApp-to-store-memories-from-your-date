const SYMBOLS = ['💖', '✨', '💕', '🌸', '💫', '⭐', '🌟', '💝'];

// 8 directions at 45° steps
const DIRECTIONS = SYMBOLS.map((_, i) => {
  const rad = ((i * 45) * Math.PI) / 180;
  return {
    bx: Math.round(Math.cos(rad) * 90),
    by: Math.round(Math.sin(rad) * 90),
  };
});

/**
 * Radial burst of emojis that fly outward from the card center on correct answers.
 * Position this inside a `position: relative` container.
 */
export default function BurstEmojis({ active }) {
  if (!active) return null;

  return (
    <div
      className="pointer-events-none absolute inset-0 overflow-visible"
      aria-hidden="true"
      style={{ zIndex: 10 }}
    >
      {SYMBOLS.map((sym, i) => (
        <span
          key={i}
          className="bday-burst select-none text-xl"
          style={{
            left: '50%',
            top: '45%',
            '--bx': `${DIRECTIONS[i].bx}px`,
            '--by': `${DIRECTIONS[i].by}px`,
            animationDelay: `${i * 30}ms`,
            animationDuration: '850ms',
          }}
        >
          {sym}
        </span>
      ))}
    </div>
  );
}
