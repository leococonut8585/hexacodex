import React, { useState } from 'react';
import questionsData from '../constants/questions.json';
import features from '../constants/features.json';
import { CategoryQuestions, AnswerState, DiagnosisResult } from '../types';

const QUESTIONS_PER_PAGE = 5;

const Questionnaire: React.FC = () => {
  const data: CategoryQuestions = questionsData as CategoryQuestions;
  const categories = Object.keys(data);

  // フラットな質問配列（カテゴリー情報を保持）
  const allQuestions = categories.flatMap((cat) =>
    data[cat].map((q) => ({ ...q, category: cat }))
  );

  const [answers, setAnswers] = useState<AnswerState>(() => {
    const state: AnswerState = {};
    categories.forEach((cat) => {
      state[cat] = {};
    });
    return state;
  });
  const [page, setPage] = useState(0);
  const [result, setResult] = useState<DiagnosisResult | null>(null);

  const totalPages = Math.ceil(allQuestions.length / QUESTIONS_PER_PAGE);

  const handleAnswer = (
    category: string,
    qid: number,
    value: boolean
  ) => {
    setAnswers((prev) => ({
      ...prev,
      [category]: { ...prev[category], [qid]: value },
    }));
  };

  const pageQuestions = allQuestions.slice(
    page * QUESTIONS_PER_PAGE,
    (page + 1) * QUESTIONS_PER_PAGE
  );

  const canSubmit = allQuestions.every(
    (q) => answers[q.category][q.id] !== undefined
  );

  const handleSubmit = () => {
    if (!canSubmit) return;
    const scores: Record<string, number> = {};
    categories.forEach((cat) => {
      const ans = answers[cat];
      scores[cat] = Object.values(ans).filter((v) => v).length;
    });
    const best = categories.reduce((a, b) => (scores[a] >= scores[b] ? a : b));
    const info = (features as any)[best];
    setResult({ category: best, catch: info.catch, description: info.description });
  };

  return (
    <div>
      <h2>性格診断</h2>
      {result ? (
        <div data-testid="result">
          <h3>{result.category}</h3>
          <p>{result.catch}</p>
          <p>{result.description}</p>
        </div>
      ) : (
        <div>
          {pageQuestions.map((q) => (
            <div key={`${q.category}-${q.id}`} style={{ marginBottom: '1rem' }}>
              <p>{q.question}</p>
              <label>
                <input
                  type="radio"
                  name={`${q.category}-${q.id}`}
                  onChange={() => handleAnswer(q.category, q.id, true)}
                  checked={answers[q.category][q.id] === true}
                />{' '}
                {q.optionYes}
              </label>
              <label style={{ marginLeft: '1rem' }}>
                <input
                  type="radio"
                  name={`${q.category}-${q.id}`}
                  onChange={() => handleAnswer(q.category, q.id, false)}
                  checked={answers[q.category][q.id] === false}
                />{' '}
                {q.optionNo}
              </label>
            </div>
          ))}
          <div style={{ marginTop: '1rem' }}>
            <button onClick={() => setPage((p) => Math.max(p - 1, 0))} disabled={page === 0}>
              Back
            </button>
            {page < totalPages - 1 && (
              <button
                onClick={() => setPage((p) => Math.min(p + 1, totalPages - 1))}
                style={{ marginLeft: '1rem' }}
              >
                Next
              </button>
            )}
            {page === totalPages - 1 && (
              <button
                onClick={handleSubmit}
                disabled={!canSubmit}
                style={{ marginLeft: '1rem' }}
                data-testid="submit"
              >
                診断する
              </button>
            )}
          </div>
          {!canSubmit && page === totalPages - 1 && (
            <p style={{ color: 'red' }}>未回答の質問があります。</p>
          )}
        </div>
      )}
    </div>
  );
};

export default Questionnaire;
