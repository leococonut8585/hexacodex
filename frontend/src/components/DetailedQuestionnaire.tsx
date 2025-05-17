import React, { useState } from 'react';
import { useParams } from 'react-router-dom';
import questionsData from '../constants/questions.json';
import features from '../constants/features.json';
import { Question, DetailedDiagnosisResult, Features } from '../types';

/**
 * Component showing 21 questions for the selected classification.
 * Answers are stored locally and a subtype (-1/-2) is derived
 * from the number of "Yes" answers.
 */

const THRESHOLD = 11; // simple yes count threshold

const DetailedQuestionnaire: React.FC = () => {
  const { category } = useParams<{ category: string }>();
  const questions: Question[] =
    (questionsData as any)[category as string] || [];

  const [answers, setAnswers] = useState<(boolean | undefined)[]>(
    Array(questions.length).fill(undefined)
  );
  const [index, setIndex] = useState(0);
  const [result, setResult] = useState<DetailedDiagnosisResult | null>(null);

  if (!category) return <p>カテゴリが指定されていません。</p>;

  const handleSelect = (value: boolean) => {
    const newAns = [...answers];
    newAns[index] = value;
    setAnswers(newAns);
  };

  const next = () => {
    if (answers[index] === undefined) return;
    setIndex((i) => Math.min(i + 1, questions.length - 1));
  };

  const prev = () => {
    setIndex((i) => Math.max(i - 1, 0));
  };

  const finish = () => {
    if (answers.some((a) => a === undefined)) return;
    const yes = answers.filter((a) => a).length;
    const subType = yes >= THRESHOLD ? '1' : '2';
    const finalKey = `${category}-${subType}`;
    const info = (features as Features)[finalKey];
    setResult({ category: finalKey, catch: info.catch, description: info.description, subType });
  };

  if (result) {
    return (
      <div data-testid="final-result">
        <h3>{result.category}</h3>
        <p>{result.catch}</p>
        <p>{result.description}</p>
      </div>
    );
  }

  const q = questions[index];
  return (
    <div>
      <p>{q.question}</p>
      <div>
        <label>
          <input
            type="radio"
            name={`q${q.id}`}
            checked={answers[index] === true}
            onChange={() => handleSelect(true)}
          />{' '}
          {q.optionYes}
        </label>
        <label style={{ marginLeft: '1rem' }}>
          <input
            type="radio"
            name={`q${q.id}`}
            checked={answers[index] === false}
            onChange={() => handleSelect(false)}
          />{' '}
          {q.optionNo}
        </label>
      </div>
      <div style={{ marginTop: '1rem' }}>
        <button onClick={prev} disabled={index === 0} data-testid="back">
          Back
        </button>
        {index < questions.length - 1 && (
          <button
            onClick={next}
            disabled={answers[index] === undefined}
            style={{ marginLeft: '1rem' }}
            data-testid="next"
          >
            Next
          </button>
        )}
        {index === questions.length - 1 && (
          <button
            onClick={finish}
            disabled={answers[index] === undefined}
            style={{ marginLeft: '1rem' }}
            data-testid="finish"
          >
            結果を見る
          </button>
        )}
      </div>
    </div>
  );
};

export default DetailedQuestionnaire;
