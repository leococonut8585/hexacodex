import React, { useState } from 'react';
import questionsData from '../constants/questions.json';
import features from '../constants/features.json';
import { CategoryQuestions, AnswerState, DiagnosisResult } from '../types';

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
  const [index, setIndex] = useState(0);
  const [result, setResult] = useState<DiagnosisResult | null>(null);

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

  const currentQuestion = allQuestions[index];

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
          <div key={`${currentQuestion.category}-${currentQuestion.id}`} style={{ marginBottom: '1rem' }}>
            <p>{currentQuestion.question}</p>
            <label>
              <input
                type="radio"
                name={`${currentQuestion.category}-${currentQuestion.id}`}
                onChange={() => handleAnswer(currentQuestion.category, currentQuestion.id, true)}
                checked={answers[currentQuestion.category][currentQuestion.id] === true}
              />{' '}
              {currentQuestion.optionYes}
            </label>
            <label style={{ marginLeft: '1rem' }}>
              <input
                type="radio"
                name={`${currentQuestion.category}-${currentQuestion.id}`}
                onChange={() => handleAnswer(currentQuestion.category, currentQuestion.id, false)}
                checked={answers[currentQuestion.category][currentQuestion.id] === false}
              />{' '}
              {currentQuestion.optionNo}
            </label>
          </div>
          <div style={{ marginTop: '1rem' }}>
            <button onClick={() => setIndex((i) => Math.max(i - 1, 0))} disabled={index === 0}>
              Back
            </button>
            {index < allQuestions.length - 1 && (
              <button
                onClick={() => setIndex((i) => Math.min(i + 1, allQuestions.length - 1))}
                style={{ marginLeft: '1rem' }}
                disabled={answers[currentQuestion.category][currentQuestion.id] === undefined}
                data-testid="next"
              >
                Next
              </button>
            )}
            {index === allQuestions.length - 1 && (
              <button
                onClick={handleSubmit}
                disabled={!canSubmit || answers[currentQuestion.category][currentQuestion.id] === undefined}
                style={{ marginLeft: '1rem' }}
                data-testid="submit"
              >
                結果を見る
              </button>
            )}
          </div>
          {!canSubmit && index === allQuestions.length - 1 && (
            <p style={{ color: 'red' }}>未回答の質問があります。</p>
          )}
        </div>
      )}
    </div>
  );
};

export default Questionnaire;
