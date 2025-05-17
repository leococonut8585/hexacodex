import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { getInitialFeature } from "../constants/officialFeatures";
import { ApiDiagnosis, FeatureInfo } from "../types";

/**
 * Birthdate form that triggers backend calculation and
 * shows the primary classification result. A button links
 * to the subtype question flow.
 */

function Diagnose() {
  const [year, setYear] = useState("");
  const [month, setMonth] = useState("");
  const [day, setDay] = useState("");
  const [result, setResult] = useState<ApiDiagnosis | null>(null);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setResult(null);
    try {
      const res = await axios.post("http://localhost:8000/diagnose", {
        year: parseInt(year),
        month: parseInt(month),
        day: parseInt(day),
      });
      setResult(res.data);
    } catch (err: any) {
      setError("診断に失敗しました。サーバーが起動しているか確認してください。");
    }
  };

  const featureKey = result?.jumeri || result?.star_type;
  const featureInfo: FeatureInfo | null = featureKey
    ? getInitialFeature(featureKey)
    : null;

  return (
    <div>
      <h2>診断フォーム</h2>
      <form onSubmit={handleSubmit}>
        <input
          type="number"
          placeholder="年"
          value={year}
          onChange={(e) => setYear(e.target.value)}
          required
        />
        <input
          type="number"
          placeholder="月"
          value={month}
          onChange={(e) => setMonth(e.target.value)}
          required
        />
        <input
          type="number"
          placeholder="日"
          value={day}
          onChange={(e) => setDay(e.target.value)}
          required
        />
        <button type="submit">診断する</button>
      </form>
      {error && <p className="error-text">{error}</p>}
      {result && featureInfo && (
        <div className="result-section">
          <h3>{featureKey}</h3>
          {featureInfo.acronyms && (
            <ul>
              {featureInfo.acronyms.map((a, idx) => (
                <li key={idx}>
                  {a.letter}: {a.meaning_en}
                </li>
              ))}
            </ul>
          )}
          {featureInfo.componentAcronyms && (
            <div>
              {featureInfo.componentAcronyms.map((c, idx) => (
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
          <p>{featureInfo.catch}</p>
          <p>{featureInfo.description}</p>
          <button
            onClick={() => navigate(`/questions/${featureKey}`)}
            className="result-next"
          >
            さらに本質を探るための質問に進む
          </button>
        </div>
      )}
    </div>
  );
}

export default Diagnose;

