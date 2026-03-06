import { useState, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { CHAPTERS } from '../chapters';
import { useProgress } from '../context/ProgressContext';
import { seededShuffle } from '../utils/shuffle';
import type { ChapterId } from '../types';

const PICK_PER_CHAPTER = 3;
const PASS_RATIO = 0.75;
const LETTERS = ['A', 'B', 'C', 'D'];

const EXAM_SEL_KEY = 'jscours_exam_sel';
const EXAM_ANS_KEY = 'jscours_exam_ans';
const EXAM_SEED_KEY = 'jscours_exam_seed';

interface ExamQuestion {
  chapterId: ChapterId;
  quizIdx: number;
}

function pickExamQuestions(): ExamQuestion[] {
  const result: ExamQuestion[] = [];
  for (const ch of CHAPTERS) {
    if (ch.id === 'home' || typeof ch.id !== 'number' || !ch.quiz || ch.quiz.length === 0) continue;
    const indices = Array.from({ length: ch.quiz.length }, (_, i) => i);
    for (let i = indices.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [indices[i], indices[j]] = [indices[j], indices[i]];
    }
    indices.slice(0, Math.min(PICK_PER_CHAPTER, ch.quiz.length)).forEach(quizIdx => {
      result.push({ chapterId: ch.id as number, quizIdx });
    });
  }
  return result;
}

function loadExamState(): { sel: ExamQuestion[] | null; ans: Record<number, number>; seed: number } {
  try {
    const sel = JSON.parse(localStorage.getItem(EXAM_SEL_KEY) ?? 'null') as ExamQuestion[] | null;
    const ans = JSON.parse(localStorage.getItem(EXAM_ANS_KEY) ?? '{}') as Record<number, number>;
    const seed = parseInt(localStorage.getItem(EXAM_SEED_KEY) ?? '0', 10) || Math.floor(Math.random() * 2 ** 31);
    return { sel, ans, seed };
  } catch {
    return { sel: null, ans: {}, seed: Math.floor(Math.random() * 2 ** 31) };
  }
}

const EXPECTED_TOTAL = CHAPTERS.reduce((acc, ch) => {
  if (ch.id === 'home' || typeof ch.id !== 'number' || !ch.quiz || ch.quiz.length === 0) return acc;
  return acc + Math.min(PICK_PER_CHAPTER, ch.quiz.length);
}, 0);

export default function ExamView() {
  const { completedChapters } = useProgress();
  const totalChapters = CHAPTERS.filter(ch => ch.id !== 'home').length;
  const isUnlocked = completedChapters.size >= totalChapters;

  const [started, setStarted] = useState(() => {
    const { sel } = loadExamState();
    return sel !== null && sel.length === EXPECTED_TOTAL;
  });

  const [questions, setQuestions] = useState<ExamQuestion[]>(() => {
    const { sel } = loadExamState();
    return sel && sel.length === EXPECTED_TOTAL ? sel : [];
  });
  const [answers, setAnswers] = useState<Record<number, number>>(() => loadExamState().ans);
  const [seed, setSeed] = useState<number>(() => loadExamState().seed);

  const startExam = useCallback(() => {
    const newQuestions = pickExamQuestions();
    const newSeed = Math.floor(Math.random() * 2 ** 31);
    localStorage.setItem(EXAM_SEL_KEY, JSON.stringify(newQuestions));
    localStorage.setItem(EXAM_ANS_KEY, '{}');
    localStorage.setItem(EXAM_SEED_KEY, String(newSeed));
    setQuestions(newQuestions);
    setAnswers({});
    setSeed(newSeed);
    setStarted(true);
  }, []);

  const handleAnswer = useCallback((examIdx: number, originalIdx: number) => {
    setAnswers(prev => {
      if (examIdx in prev) return prev;
      const next = { ...prev, [examIdx]: originalIdx };
      localStorage.setItem(EXAM_ANS_KEY, JSON.stringify(next));
      return next;
    });
  }, []);

  const restartExam = useCallback(() => {
    localStorage.removeItem(EXAM_SEL_KEY);
    localStorage.removeItem(EXAM_ANS_KEY);
    localStorage.removeItem(EXAM_SEED_KEY);
    setStarted(false);
    setQuestions([]);
    setAnswers({});
  }, []);

  // Locked screen
  if (!isUnlocked) {
    return (
      <div className="exam-locked-screen">
        <div className="exam-lock-icon">🔒</div>
        <h2>Validation des connaissances</h2>
        <p>Complète tous les chapitres pour débloquer l'examen final.</p>
        <div className="exam-lock-progress">{completedChapters.size} / {totalChapters} chapitres complétés</div>
        <Link to="/" className="btn btn-secondary" style={{ display: 'inline-flex', marginTop: '24px' }}>
          ← Retour au cours
        </Link>
      </div>
    );
  }

  // Start screen
  if (!started) {
    return (
      <div className="exam-start-screen">
        <div className="exam-start-icon">🎓</div>
        <h2>Examen final</h2>
        <p className="exam-start-desc">
          3 questions aléatoires par chapitre ({PICK_PER_CHAPTER * totalChapters} questions au total).<br />
          Score minimum pour valider : 75%.
        </p>
        <button className="btn btn-primary" style={{ marginTop: '8px' }} onClick={startExam}>
          Commencer l'examen →
        </button>
        <Link to="/" className="btn btn-secondary" style={{ display: 'inline-flex', marginTop: '12px' }}>
          ← Retour au cours
        </Link>
      </div>
    );
  }

  const answeredCount = Object.keys(answers).length;
  const allAnswered = answeredCount >= questions.length;

  const score = questions.reduce((acc, q, examIdx) => {
    const chapter = CHAPTERS.find(ch => ch.id === q.chapterId);
    if (!chapter?.quiz) return acc;
    const question = chapter.quiz[q.quizIdx];
    if (!question) return acc;
    return acc + (answers[examIdx] === question.correct ? 1 : 0);
  }, 0);

  const passThreshold = Math.ceil(questions.length * PASS_RATIO);
  const passed = score >= passThreshold;

  return (
    <div className="exam-view">
      <div className="exam-header">
        <h1 className="exam-title">🎓 Examen final</h1>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <div className="exam-progress-info">{answeredCount} / {questions.length} réponses</div>
          <button className="quiz-retry-btn" onClick={restartExam}>🔄 Recommencer</button>
        </div>
      </div>

      {questions.map((q, examIdx) => {
        const chapter = CHAPTERS.find(ch => ch.id === q.chapterId);
        if (!chapter?.quiz) return null;
        const question = chapter.quiz[q.quizIdx];
        if (!question) return null;
        const selected = examIdx in answers ? answers[examIdx] : null;

        const shuffledOptions = seededShuffle(
          question.options.map((opt, i) => ({ opt, originalIdx: i })),
          seed ^ (examIdx * 1000 + q.quizIdx)
        );

        const handleSelect = (shuffledIdx: number) => {
          if (selected !== null) return;
          handleAnswer(examIdx, shuffledOptions[shuffledIdx].originalIdx);
        };

        return (
          <div key={examIdx} className="quiz-block">
            <div className="exam-q-num">Question {examIdx + 1} / {questions.length}</div>
            <div className="exam-q-chapter">{chapter.icon} {chapter.title}</div>
            <div className="quiz-question">{question.question}</div>
            {question.sub && <div className="quiz-sub">{question.sub}</div>}
            <div className="quiz-options">
              {shuffledOptions.map(({ opt, originalIdx }, shuffledIdx) => {
                let cls = 'quiz-option';
                if (selected !== null) {
                  cls += ' disabled';
                  if (originalIdx === question.correct) cls += ' correct';
                  else if (originalIdx === selected) cls += ' wrong';
                }
                return (
                  <button key={originalIdx} className={cls} onClick={() => handleSelect(shuffledIdx)}>
                    <span className="option-letter">{LETTERS[shuffledIdx]}</span>
                    {opt}
                  </button>
                );
              })}
            </div>
            {selected !== null && (() => {
              const isCorrect = selected === question.correct;
              const explanationBody = question.explanation.replace(/^✅[^!]*!\s*/u, '');
              const feedbackText = isCorrect ? question.explanation : `❌ Mauvaise réponse. ${explanationBody}`;
              return (
                <div className={`quiz-feedback show ${isCorrect ? 'correct-fb' : 'wrong-fb'}`}>
                  {feedbackText}
                </div>
              );
            })()}
          </div>
        );
      })}

      {allAnswered && (
        <div className={`exam-result ${passed ? 'passed' : 'failed'}`}>
          <div className="exam-result-icon">{passed ? '🏆' : '📚'}</div>
          <div className="exam-result-score">{score} / {questions.length}</div>
          <div className="exam-result-label">
            {passed ? "Félicitations ! Vous avez validé l'examen." : 'Continuez à réviser et réessayez.'}
          </div>
          <button className="btn btn-secondary" style={{ marginTop: '8px' }} onClick={restartExam}>
            🔄 Recommencer l'examen
          </button>
        </div>
      )}
    </div>
  );
}
