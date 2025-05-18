import React, { useState } from 'react';
import { useParams } from 'react-router-dom';
import questionsData from '../constants/questions.json';
import { getDetailedFeature } from '../constants/officialFeatures';
import { Question, DetailedDiagnosisResult, DetailedFeatureInfo } from '../types';

/**
 * Component showing 21 questions for the selected classification.
 * Answers are stored locally and a subtype (-1/-2) is derived
 * from the number of "Yes" answers.
 */

const THRESHOLD = 11; // simple yes count threshold

function formatQuestion(text: string) {
  const parts = text.split(/(?<=[。?!?])/);
  return parts.map((line, idx) => (
    <React.Fragment key={idx}>
      {line.trim()}
      {idx < parts.length - 1 && <br />}
    </React.Fragment>
  ));
}

const DetailedQuestionnaire: React.FC = () => {
  const { category } = useParams<{ category: string }>();
  const questions: Question[] =
    (questionsData as any)[category as string] || [];

  const [answers, setAnswers] = useState<(boolean | undefined)[]>(
    Array(questions.length).fill(undefined)
  );
  const [index, setIndex] = useState(0);
  const [result, setResult] = useState<DetailedDiagnosisResult | null>(null);
  const [error, setError] = useState('');

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
    const info: DetailedFeatureInfo | null = getDetailedFeature(finalKey);
    if (info) {
      // info already contains only the selected subtype data
      setResult({ category: finalKey, ...info, subType });
      setError('');
    } else {
      setError('結果情報が見つかりません。');
    }
  };

  if (result) {
    const VIDEO_MAP: Record<string, string> = {
      'MARI_α-1': 'Mari_alpha_1.mp4',
      'MARI_α-2': 'Mari_alpha_2.mp4',
      'MARI_β-1': 'Mari_beta_1.mp4',
      'MARI_β-2': 'Mari_beta_2.mp4',
      'AKARI_α-1': 'Akari_alpha_1.mp4',
      'AKARI_α-2': 'Akari_alpha_2.mp4',
    };

    const normalizeKey = (key: string) =>
      key.replace(/\s+/g, '').toUpperCase();

    const videoFile = VIDEO_MAP[normalizeKey(result.category)];
    const videoPath = videoFile ? `/movie/${videoFile}` : '';
    return (
      <div data-testid="final-result" className="final-result">
        {videoFile ? (
          <video
            src={videoPath}
            autoPlay
            loop
            muted
            playsInline
          />
        ) : (
          <img src="/movie/default_poster.jpg" alt="no video" />
        )}
        <div className="result-text">
          <h3>{result.category}</h3>
          <p>{result.catch}</p>
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
          <p>{result.baseDescription}</p>
          <h4>{result.variantTitle}</h4>
          <p>{result.variantDescription}</p>
          <h4>{result.subTitle}</h4>
          <p>{result.subDescription}</p>
        </div>
      </div>
    );
  }

  const q = questions[index];
  return (
    <div>
      <div className="question-block">
        <p className="question-text">{formatQuestion(q.question)}</p>
        <div className="radio-group">
          <label>
            <input
              type="radio"
              name={`q${q.id}`}
              checked={answers[index] === true}
              onChange={() => handleSelect(true)}
            />{' '}
            {q.optionYes}
          </label>
          <label>
            <input
              type="radio"
              name={`q${q.id}`}
              checked={answers[index] === false}
              onChange={() => handleSelect(false)}
            />{' '}
            {q.optionNo}
          </label>
        </div>
      </div>
      <div className="nav-buttons">
        <button onClick={prev} disabled={index === 0} data-testid="back">
          Back
        </button>
        {index < questions.length - 1 && (
          <button
            onClick={next}
            disabled={answers[index] === undefined}
            data-testid="next"
          >
            Next
          </button>
        )}
        {index === questions.length - 1 && (
          <button
            onClick={finish}
            disabled={answers[index] === undefined}
            data-testid="finish"
          >
            結果を見る
          </button>
        )}
      </div>
      {error && <p className="error-text">{error}</p>}
    </div>
  );
};

export default DetailedQuestionnaire;
