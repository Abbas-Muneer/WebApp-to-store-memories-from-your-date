/**
 * A single answer option button for the birthday quiz.
 *
 * Visual states:
 *  - Normal:           glassmorphism pill, pink border
 *  - Selected correct: green-pink gradient glow
 *  - Selected wrong:   soft rose tint (never harsh red)
 *  - Peer (feedback active but not selected): dimmed
 */
export default function AnswerButton({ option, isSelected, feedback, onClick, disabled }) {
  let extraClass = '';
  if (isSelected && feedback === 'correct') {
    extraClass = 'answer-correct';
  } else if (isSelected && feedback === 'wrong') {
    extraClass = 'answer-wrong';
  } else if (feedback && !isSelected) {
    extraClass = 'opacity-60';
  }

  return (
    <button
      type="button"
      className={`answer-btn ${extraClass}`}
      onClick={onClick}
      disabled={disabled}
    >
      {option}
    </button>
  );
}
