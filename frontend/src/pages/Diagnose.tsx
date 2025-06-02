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
      const res = await axios.post(`${process.env.REACT_APP_API_URL}/diagnose`, {
        year: parseInt(year),
        month: parseInt(month),
        day: parseInt(day),
      });
      // setResult(res.data); // No longer needed to display result on this page

      const diagnosisResult: ApiDiagnosis = res.data;
      const featureKey = diagnosisResult.jumeri || diagnosisResult.star_type;

      if (featureKey) {
        navigate(`/questions/${featureKey}`);
      } else {
        setError("診断結果から特徴キーを取得できませんでした。");
      }
    } catch (err: any) {
      setError("診断に失敗しました。サーバーが起動しているか確認してください。");
    }
  };

  // featureKey and featureInfo are no longer needed here as results are not displayed on this page.

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
      {/* Result display section is removed as per requirements */}
    </div>
  );
}

export default Diagnose;

