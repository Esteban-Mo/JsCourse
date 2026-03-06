import { useMemo } from 'react';
import type { QuizQuestion, ChapterId } from '../../types';
import { useProgress } from '../../context/ProgressContext';
import { seededShuffle } from '../../utils/shuffle';

interface QuizBlockProps {
  question: QuizQuestion;
  chapterId: ChapterId;
  quizIdx: number;
}

const LETTERS = ['A', 'B', 'C', 'D'];

export default function QuizBlock({ question, chapterId, quizIdx }: QuizBlockProps) {
  const { recordQuizAnswer, addXP, answeredQuizzes, shuffleSeed } = useProgress();
  const key = `${chapterId}-${quizIdx}`;

  // Dériver l'état directement du contexte → se remet à null automatiquement après resetProgress
  const selected = key in answeredQuizzes ? answeredQuizzes[key] : null;

  // Mélange déterministe : stable pendant la session, change à chaque reset
  const shuffledOptions = useMemo(() => {
    const numId = typeof chapterId === 'number' ? chapterId : 0;
    const seed = shuffleSeed ^ (numId * 1000 + quizIdx);
    return seededShuffle(
      question.options.map((opt, i) => ({ opt, originalIdx: i })),
      seed
    );
  }, [shuffleSeed, chapterId, quizIdx, question.options]);

  const handleSelect = (shuffledIdx: number) => {
    if (selected !== null) return;
    const originalIdx = shuffledOptions[shuffledIdx].originalIdx;
    recordQuizAnswer(chapterId, quizIdx, originalIdx);
    if (originalIdx === question.correct) addXP(25);
  };

  return (
    <div className="quiz-block">
      <div className="quiz-question">{question.question}</div>
      <div className="quiz-sub">{question.sub}</div>
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
      {selected !== null && (
        <div className={`quiz-feedback show ${selected === question.correct ? 'correct-fb' : 'wrong-fb'}`}>
          {question.explanation}
        </div>
      )}
    </div>
  );
}
