import React, { useState, useEffect } from 'react'; // useEffect を追加
import { useParams, useNavigate } from 'react-router-dom'; // useParams, useNavigate を追加
import questionsData from '../constants/questions.json';
// import { getInitialFeature } from '../constants/officialFeatures'; // 不要になる可能性
import { CategoryQuestions, AnswerState, Question } from '../types'; // Question 型をインポート, DiagnosisResult, FeatureInfo削除

function formatQuestion(text: string) {
  const parts = text.split(/(?<=[。?!?])/);
  return parts.map((line, idx) => (
    <React.Fragment key={idx}>
      {line.trim()}
      {idx < parts.length - 1 && <br />}
    </React.Fragment>
  ));
}

const Questionnaire: React.FC = () => {
  const { initial_type } = useParams<{ initial_type: string }>();
  const navigate = useNavigate();

  const data: CategoryQuestions = questionsData as CategoryQuestions;

  const [currentQuestions, setCurrentQuestions] = useState<Question[]>([]);
  const [currentCategory, setCurrentCategory] = useState<string>("");

  useEffect(() => {
    if (initial_type && data[initial_type]) {
      // `category`プロパティを各質問オブジェクトに追加
      setCurrentQuestions(data[initial_type].map(q => ({ ...q, category: initial_type })));
      setCurrentCategory(initial_type);
    } else {
      setCurrentQuestions([]);
      setCurrentCategory("");
      // Consider navigating to an error page or showing a more specific error
    }
  }, [initial_type, data]);

  const [answers, setAnswers] = useState<AnswerState>(() => {
    const state: AnswerState = {};
    // Initialize for all possible categories in questions.json, or just for currentCategory if preferred
    Object.keys(data).forEach((cat) => {
      state[cat] = {};
    });
    return state;
  });

  const [index, setIndex] = useState(0);
  // const [result, setResult] = useState<DiagnosisResult | null>(null); // Removed

  const handleAnswer = (
    // category: string, // No longer needed as direct param, use currentCategory
    qid: number,
    value: boolean
  ) => {
    if (!currentCategory) return;
    setAnswers((prev) => ({
      ...prev,
      [currentCategory]: { ...prev[currentCategory], [qid]: value },
    }));
  };

  const currentQuestion = currentQuestions[index];

  const canSubmit = currentCategory && currentQuestions.length > 0 && currentQuestions.every(
    (q) => answers[currentCategory] && answers[currentCategory][q.id] !== undefined
  );

  const handleSubmit = () => {
    if (!canSubmit || !initial_type || !currentCategory) return;

    const categoryAnswers = answers[currentCategory];
    const yesCount = Object.values(categoryAnswers).filter((v) => v).length;

    const subType = yesCount >= Math.ceil(currentQuestions.length / 2) ? '1' : '2';
    const finalKey = `${initial_type}-${subType}`;

    navigate(`/personality/${finalKey}`);
  };

  if (!initial_type || !data[initial_type]) {
    return <div>指定されたタイプの質問が見つかりません。診断をやり直してください。</div>;
  }

  if (currentQuestions.length === 0 && initial_type && data[initial_type]) {
    // This case means useEffect has run, but somehow questions are still empty.
    // Could be a brief moment before state update, or an actual issue.
    // For now, a simple loading or rely on the above error.
    return <div>質問を読み込んでいます...</div>;
  }

  if (!currentQuestion) {
     // This might happen if currentQuestions is empty and index is 0
     if (currentQuestions.length === 0) {
        return <div>このタイプには利用可能な質問がありません。</div>
     }
     return <div>質問の読み込みエラー。</div>;
  }

  return (
    <div>
      <h2>{initial_type} タイプ診断</h2>
      {/* Result display removed */}
      <div>
        <div
          key={`${currentCategory}-${currentQuestion.id}`}
          className="question-block"
        >
          <p className="question-text">
            {formatQuestion(currentQuestion.question)}
          </p>
          <div className="radio-group">
            <label>
              <input
                type="radio"
                name={`${currentCategory}-${currentQuestion.id}`}
                onChange={() =>
                  handleAnswer(currentQuestion.id, true)
                }
                checked={
                  answers[currentCategory] && answers[currentCategory][currentQuestion.id] === true
                }
              />{' '}
              {currentQuestion.optionYes}
            </label>
            <label>
              <input
                type="radio"
                name={`${currentCategory}-${currentQuestion.id}`}
                onChange={() =>
                  handleAnswer(currentQuestion.id, false)
                }
                checked={
                  answers[currentCategory] && answers[currentCategory][currentQuestion.id] === false
                }
              />{' '}
              {currentQuestion.optionNo}
            </label>
          </div>
        </div>
        <div className="nav-buttons">
          <button onClick={() => setIndex((i) => Math.max(i - 1, 0))} disabled={index === 0}>
            戻る
          </button>
          {index < currentQuestions.length - 1 && (
            <button
              onClick={() =>
                setIndex((i) => Math.min(i + 1, currentQuestions.length - 1))
              }
              disabled={
                !(answers[currentCategory] && answers[currentCategory][currentQuestion.id] !== undefined)
              }
              data-testid="next"
            >
              次へ
            </button>
          )}
          {index === currentQuestions.length - 1 && (
            <button
              onClick={handleSubmit}
              disabled={!canSubmit} // canSubmit already checks the current question's answer
              data-testid="submit"
            >
              結果を見る
            </button>
          )}
        </div>
        {!canSubmit && index === currentQuestions.length - 1 && (
          <p className="error-text">すべての質問に回答してください。</p>
        )}
      </div>
    </div>
  );
};

export default Questionnaire;
