import React, { useState } from 'react';
import questionsData from '../constants/questions.json';
import { getInitialFeature } from '../constants/officialFeatures';
import { CategoryQuestions, AnswerState, DiagnosisResult, FeatureInfo } from '../types';

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
    const info: FeatureInfo | null = getInitialFeature(best);
    if (info) {
      setResult({
        category: best,
        catch: info.catch,
        description: info.description,
        acronyms: info.acronyms,
        componentAcronyms: info.componentAcronyms,
      });
    }
  };

  return (
    <div>
      <h2>性格診断</h2>
      {result ? (
        <div data-testid="result">
          <h3>{result.category}</h3>
          {result.acronyms && (
            <ul>
              {result.acronyms.map((a, idx) => (
                <li key={idx}>
                  {a.letter}: {a.meaning_en}
                </li>
              ))}
            </ul>
          )}
          {result.componentAcronyms && (
            <div>
              {result.componentAcronyms.map((c, idx) => (
                <div key={idx}>
                  <h4>{c.baseTypeNameJp}</h4>
                  <ul>
                    {c.keywords.map((k, i) => (
                      <li key={i}>
                        {k.letter}: {k.meaning_en}
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          )}
          <p>{result.catch}</p>
          <p>{result.description}</p>
        </div>
      ) : (
        <div>
          <div
            key={`${currentQuestion.category}-${currentQuestion.id}`}
            style={{
              marginBottom: '1rem',
              textAlign: 'center',
            }}
          >
            <p style={{ fontSize: '1.25rem', fontWeight: 'bold' }}>
              {currentQuestion.question}
            </p>
            <div
              style={{
                marginTop: '0.5rem',
                display: 'flex',
                justifyContent: 'center',
                gap: '1.5rem',
              }}
            >
              <label>
                <input
                  type="radio"
                  name={`${currentQuestion.category}-${currentQuestion.id}`}
                  onChange={() =>
                    handleAnswer(currentQuestion.category, currentQuestion.id, true)
                  }
                  checked={
                    answers[currentQuestion.category][currentQuestion.id] === true
                  }
                />{' '}
                {currentQuestion.optionYes}
              </label>
              <label>
                <input
                  type="radio"
                  name={`${currentQuestion.category}-${currentQuestion.id}`}
                  onChange={() =>
                    handleAnswer(currentQuestion.category, currentQuestion.id, false)
                  }
                  checked={
                    answers[currentQuestion.category][currentQuestion.id] === false
                  }
                />{' '}
                {currentQuestion.optionNo}
              </label>
            </div>
          </div>
          <div
            style={{
              marginTop: '1rem',
              display: 'flex',
              justifyContent: 'center',
              gap: '1rem',
            }}
          >
            <button onClick={() => setIndex((i) => Math.max(i - 1, 0))} disabled={index === 0}>
              Back
            </button>
            {index < allQuestions.length - 1 && (
              <button
                onClick={() =>
                  setIndex((i) => Math.min(i + 1, allQuestions.length - 1))
                }
                disabled={
                  answers[currentQuestion.category][currentQuestion.id] === undefined
                }
                data-testid="next"
              >
                Next
              </button>
            )}
            {index === allQuestions.length - 1 && (
              <button
                onClick={handleSubmit}
                disabled={!canSubmit || answers[currentQuestion.category][currentQuestion.id] === undefined}
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
