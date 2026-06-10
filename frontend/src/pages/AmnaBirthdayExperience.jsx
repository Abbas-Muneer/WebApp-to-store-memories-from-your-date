import { useCallback, useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import FloatingParticles from '../components/birthdayExperience/FloatingParticles';
import QuestionCard from '../components/birthdayExperience/QuestionCard';
import { useBirthdayAudio } from '../hooks/useBirthdayAudio';
import { getUser } from '../utils/auth';
import {
  clearBirthdayExperiencePending,
  setBirthdayExperienceCompleted,
} from '../utils/birthdayExperience';

// ─── Questions ───────────────────────────────────────────────────────────────

const CORRECT_MSGS = [
  'Correct darling 🥺💚',
  'You know us too well 💖',
  'Exactlyyy 💕',
  'My smart girl 🥺✨',
];
const WRONG_MSGS = [
  'Nooo baby 😭',
  'How could you forget thisss 🥺',
  'Try again cutie 😭💖',
  'Almosttt, think again 🥺',
];

const QUESTIONS = [
  {
    id: 1,
    text: 'What did we eat on our first proper date? 🍝',
    options: ['Pasta', 'Burgers', 'Pizza', 'Shawarma'],
    correct: 'Pasta',
    correctMsgs: CORRECT_MSGS,
    wrongMsgs: WRONG_MSGS,
  },
  {
    id: 2,
    text: 'Who is more romantic? 😌',
    options: ['Me', 'You', 'Both', 'None'],
    correct: 'Me',
    correctMsgs: ['Correct darling 😉😘', 'Exactlyyy 😉😘'],
    wrongMsgs: WRONG_MSGS,
  },
  {
    id: 3,
    text: "What's our favourite go-to spot? 🌊",
    options: ['Theatre', 'Beach', 'Restaurant', 'None'],
    correct: 'Beach',
    correctMsgs: CORRECT_MSGS,
    wrongMsgs: WRONG_MSGS,
  },
  {
    id: 4,
    text: "What's my favourite dish? 🍽️",
    options: ['Naan and Tikka', 'French Toast', 'Pasta', 'Lamprais from Amma Nisa'],
    correct: 'French Toast',
    correctMsgs: CORRECT_MSGS,
    wrongMsgs: WRONG_MSGS,
  },
  {
    id: 5,
    text: 'How much do I love you? 🥺',
    options: ['A lot', 'Too much', 'Infinite', 'More than food'],
    allCorrect: true,
    correctMsgs: ['Correct… but still not enough to describe it 💖'],
    wrongMsgs: [],
  },
  {
    id: 6,
    text: 'Ready to relive our memories together? ✨',
    options: ['Always', 'YESSS', 'Obviously', 'Take me there already'],
    allCorrect: true,
    isFinal: true,
    correctMsgs: [],
    wrongMsgs: [],
  },
];

function pick(arr) {
  return arr[Math.floor(Math.random() * arr.length)];
}

// ─── Component ───────────────────────────────────────────────────────────────

export default function AmnaBirthdayExperience() {
  const navigate = useNavigate();
  const user = getUser();
  const { startBg, playCorrect, playWrong, playFinal, fadeBg, stopBg, toggleMute, isMuted } =
    useBirthdayAudio();

  // 'intro' | 'quiz' | 'final'
  const [phase, setPhase] = useState('intro');
  const [introExiting, setIntroExiting] = useState(false);

  const [questionIndex, setQuestionIndex] = useState(0);
  const [feedback, setFeedback] = useState(null); // null | 'correct' | 'wrong'
  const [feedbackMsg, setFeedbackMsg] = useState('');
  const [selectedOption, setSelectedOption] = useState(null);
  const [showBurst, setShowBurst] = useState(false);

  const timerRef = useRef(null);

  // Stop audio on unmount (e.g. back-navigation)
  useEffect(() => () => stopBg(), [stopBg]);

  // Cleanup pending timer on unmount
  useEffect(() => () => clearTimeout(timerRef.current), []);

  // ── Intro → Quiz transition ──────────────────────────────────────────────
  const handleOpenWorld = useCallback(() => {
    startBg();
    setIntroExiting(true);
    timerRef.current = setTimeout(() => {
      setIntroExiting(false);
      setPhase('quiz');
    }, 520);
  }, [startBg]);

  // ── Answer handler ───────────────────────────────────────────────────────
  const handleAnswer = useCallback(
    (option) => {
      if (feedback === 'correct') return; // debounce while advancing

      const q = QUESTIONS[questionIndex];
      const isCorrect = q.allCorrect || option === q.correct;
      setSelectedOption(option);

      // ── Final question (Q6) ─ go straight to cinematic transition ──────
      if (q.isFinal) {
        playFinal();
        setShowBurst(true);
        timerRef.current = setTimeout(() => {
          if (user?.email) {
            setBirthdayExperienceCompleted(user.email);
            clearBirthdayExperiencePending();
          }
          setPhase('final');
          fadeBg();
          timerRef.current = setTimeout(() => {
            navigate('/home', { replace: true });
          }, 2700);
        }, 750);
        return;
      }

      // ── Correct ────────────────────────────────────────────────────────
      if (isCorrect) {
        const msg = pick(q.correctMsgs);
        setFeedback('correct');
        setFeedbackMsg(msg);
        setShowBurst(true);
        playCorrect();

        timerRef.current = setTimeout(() => {
          setFeedback(null);
          setFeedbackMsg('');
          setSelectedOption(null);
          setShowBurst(false);
          setQuestionIndex((i) => i + 1);
        }, 1400);
        return;
      }

      // ── Wrong ──────────────────────────────────────────────────────────
      const msg = pick(q.wrongMsgs);
      setFeedback('wrong');
      setFeedbackMsg(msg);
      playWrong();

      timerRef.current = setTimeout(() => {
        setFeedback(null);
        setFeedbackMsg('');
        setSelectedOption(null);
      }, 1050);
    },
    [feedback, questionIndex, playCorrect, playWrong, playFinal, fadeBg, navigate, user]
  );

  // ─── Render ────────────────────────────────────────────────────────────────
  return (
    <div
      className="bday-bg relative overflow-x-hidden"
      style={{ minHeight: '100dvh' }}
    >
      {/* Dreamy background blobs */}
      <div className="pointer-events-none fixed inset-0 overflow-hidden" aria-hidden="true">
        <div className="absolute left-1/4 top-1/4 h-72 w-72 -translate-x-1/2 -translate-y-1/2 rounded-full bg-pink-200/40 blur-3xl" />
        <div className="absolute right-1/4 top-2/3 h-56 w-56 rounded-full bg-purple-200/35 blur-3xl" />
        <div className="absolute bottom-16 left-2/3 h-64 w-64 rounded-full bg-rose-200/30 blur-3xl" />
      </div>

      <FloatingParticles count={16} />

      {/* ── Mute button (shown once music starts) ── */}
      {phase !== 'intro' && (
        <button
          onClick={toggleMute}
          aria-label={isMuted ? 'Unmute music' : 'Mute music'}
          className="fixed z-50 rounded-full bg-white/65 px-3 py-2 text-lg shadow-soft backdrop-blur-sm transition hover:bg-white/85 active:scale-95"
          style={{
            top: 'max(1rem, calc(env(safe-area-inset-top, 0px) + 0.75rem))',
            right: 'max(1rem, calc(env(safe-area-inset-right, 0px) + 0.75rem))',
          }}
        >
          {isMuted ? '🔇' : '🔊'}
        </button>
      )}

      {/* ── Centred content wrapper with safe-area padding ── */}
      <div
        className="flex flex-col items-center justify-center px-4 text-center"
        style={{
          minHeight: '100dvh',
          paddingTop: 'max(2.5rem, calc(env(safe-area-inset-top, 0px) + 1.5rem))',
          paddingBottom: 'max(2.5rem, calc(env(safe-area-inset-bottom, 0px) + 1.5rem))',
        }}
      >
        {/* ═══════════════ INTRO ═══════════════ */}
        {(phase === 'intro' || introExiting) && (
          <div
            className={`flex w-full max-w-sm flex-col items-center gap-5 transition-opacity duration-500 ${
              introExiting ? 'pointer-events-none opacity-0' : 'opacity-100'
            }`}
          >
            {/* Badge */}
            <span
              className="bday-fade-up romantic-pill px-4 py-1.5 text-sm font-semibold"
              style={{ animationDelay: '0ms' }}
            >
              AMNA ❤️
            </span>

            {/* Heading */}
            <h1
              className="bday-fade-up font-semibold text-vault-ink"
              style={{
                fontSize: 'clamp(1.65rem, 7vw, 2.4rem)',
                lineHeight: 1.2,
                animationDelay: '320ms',
              }}
            >
              Happy Birthday Amna ✨
            </h1>

            {/* Subtitle */}
            <p
              className="bday-fade-up text-vault-muted"
              style={{
                fontSize: 'clamp(0.95rem, 4vw, 1.1rem)',
                animationDelay: '650ms',
              }}
            >
              I made something for us…
            </p>

            {/* CTA button */}
            <button
              className="bday-fade-up romantic-primary mt-1 px-8 py-4 text-base font-semibold"
              style={{
                animationDelay: '1080ms',
                fontSize: 'clamp(0.88rem, 4vw, 1rem)',
                minHeight: '52px',
                touchAction: 'manipulation',
                WebkitTapHighlightColor: 'transparent',
              }}
              onClick={handleOpenWorld}
            >
              Open our little world 💌
            </button>
          </div>
        )}

        {/* ═══════════════ QUIZ ════════════════ */}
        {phase === 'quiz' && (
          <QuestionCard
            key={questionIndex}
            question={QUESTIONS[questionIndex]}
            onAnswer={handleAnswer}
            feedback={feedback}
            feedbackMsg={feedbackMsg}
            selectedOption={selectedOption}
            currentIndex={questionIndex}
            total={QUESTIONS.length}
            showBurst={showBurst}
          />
        )}

        {/* ═══════════════ FINAL ═══════════════ */}
        {phase === 'final' && (
          <div className="flex flex-col items-center gap-6 bday-card-in">
            <span className="bday-twinkle text-6xl">💖</span>

            <h1
              className="font-semibold text-vault-ink"
              style={{
                fontSize: 'clamp(1.5rem, 6.5vw, 2.2rem)',
                lineHeight: 1.3,
              }}
            >
              Welcome to our little world 💖
            </h1>

            <p className="text-vault-muted" style={{ fontSize: 'clamp(0.9rem, 4vw, 1rem)' }}>
              Taking you there now…
            </p>

            <div className="flex gap-3 text-3xl">
              {['💕', '🌸', '✨', '🌟', '💝'].map((e, i) => (
                <span
                  key={i}
                  className="bday-twinkle select-none"
                  style={{ animationDelay: `${i * 160}ms` }}
                >
                  {e}
                </span>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
