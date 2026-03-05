import { useState } from 'react';
import type { QuizQuestion, ChapterId } from '../../types';
import { useProgress } from '../../context/ProgressContext';

interface QuizBlockProps {
  question: QuizQuestion;
  chapterId: ChapterId;
  quizIdx: number;
}

const LETTERS = ['A', 'B', 'C', 'D'];

export default function QuizBlock({ question, chapterId, quizIdx }: QuizBlockProps) {
  const { recordQuizAnswer, addXP, answeredQuizzes } = useProgress();
  const key = `${chapterId}-${quizIdx}`;
  const savedAnswer = key in answeredQuizzes ? answeredQuizzes[key] : null;

  const [selected, setSelected] = useState<number | null>(savedAnswer);

  const handleSelect = (idx: number) => {
    if (selected !== null) return;
    setSelected(idx);
    recordQuizAnswer(chapterId, quizIdx, idx);
    if (idx === question.correct) {
      addXP(25);
    }
  };

  return (
    <div className="quiz-block">
      <div className="quiz-question">{question.question}</div>
      <div className="quiz-sub">{question.sub}</div>
      <div className="quiz-options">
        {question.options.map((opt, idx) => {
          let cls = 'quiz-option';
          if (selected !== null) {
            cls += ' disabled';
            if (idx === question.correct) cls += ' correct';
            else if (idx === selected) cls += ' wrong';
          }
          return (
            <button key={idx} className={cls} onClick={() => handleSelect(idx)}>
              <span className="option-letter">{LETTERS[idx]}</span>
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
