import { useEffect, useRef, useState } from 'react';
import AnswerButton from './AnswerButton';
import BurstEmojis from './BurstEmojis';

/**
 * A single quiz card.  Gets a fresh key from the parent on each question change,
 * so the mount animation (bday-card-in) always replays.
 *
 * Shake replay trick: we alternate between two identical CSS animation names
 * (bday-soft-shake-a / bday-soft-shake-b) so the browser restarts the
 * animation even when the previous one just finished.
 */
export default function QuestionCard({
  question,
  onAnswer,
  feedback,
  feedbackMsg,
  selectedOption,
  currentIndex,
  total,
  showBurst,
}) {
  const [isShaking, setIsShaking] = useState(false);
  const [shakeCount, setShakeCount] = useState(0);
  const shakeTimerRef = useRef(null);

  useEffect(() => {
    if (feedback === 'wrong') {
      setShakeCount((c) => c + 1);
      setIsShaking(true);
      clearTimeout(shakeTimerRef.current);
      shakeTimerRef.current = setTimeout(() => setIsShaking(false), 700);
    }
  }, [feedback]);

  useEffect(() => () => clearTimeout(shakeTimerRef.current), []);

  const shakeClass = isShaking
    ? shakeCount % 2 === 0
      ? 'bday-soft-shake-a'
      : 'bday-soft-shake-b'
    : '';

  // Correct state glow applied via inline transition on box-shadow
  const glowStyle =
    feedback === 'correct'
      ? {
          boxShadow:
            '0 0 40px rgba(244,114,182,0.55), 0 8px 48px rgba(192,132,252,0.35)',
          transition: 'box-shadow 0.35s ease',
        }
      : { transition: 'box-shadow 0.35s ease' };

  return (
    <div className={shakeClass}>
      <div
        className="romantic-card bday-card-in question-card-wrap relative"
        style={{ padding: '1.75rem 1.5rem', ...glowStyle }}
      >
        {/* ── Progress hearts ── */}
        <div
          className="mb-5 flex items-center justify-center gap-1.5"
          aria-label={`Question ${currentIndex + 1} of ${total}`}
        >
          {Array.from({ length: total }).map((_, i) => (
            <span
              key={i}
              className="select-none text-base leading-none"
              style={{ opacity: i <= currentIndex ? 1 : 0.28 }}
            >
              {i < currentIndex ? '💖' : i === currentIndex ? '💕' : '🤍'}
            </span>
          ))}
          <span className="ml-2 text-xs font-medium text-vault-muted">
            {currentIndex + 1} / {total}
          </span>
        </div>

        {/* ── Question text ── */}
        <h2 className="question-text text-center font-semibold text-vault-ink">
          {question.text}
        </h2>

        {/* ── Answer options ── */}
        <div className="mt-5 grid grid-cols-2 gap-3">
          {question.options.map((option) => (
            <AnswerButton
              key={option}
              option={option}
              isSelected={selectedOption === option}
              feedback={feedback}
              onClick={() => onAnswer(option)}
              disabled={feedback === 'correct'}
            />
          ))}
        </div>

        {/* ── Feedback message ── */}
        {feedbackMsg && (
          <p
            className={`mt-4 text-center text-sm font-semibold ${
              feedback === 'correct' ? 'text-pink-600' : 'text-rose-500'
            }`}
          >
            {feedbackMsg}
          </p>
        )}

        {/* ── Burst on correct ── */}
        <BurstEmojis active={showBurst} />
      </div>
    </div>
  );
}
