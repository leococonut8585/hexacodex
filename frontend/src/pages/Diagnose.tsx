import React, { useState } from "react";
import axios from "axios";

function Diagnose() {
  const [year, setYear] = useState("");
  const [month, setMonth] = useState("");
  const [day, setDay] = useState("");
  const [result, setResult] = useState<any>(null);
  const [error, setError] = useState("");

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

  return (
  <div>
    <h2>診断フォーム</h2>
    <form onSubmit={handleSubmit}>
      <input type="number" placeholder="年" value={year} onChange={(e) => setYear(e.target.value)} required />
      <input type="number" placeholder="月" value={month} onChange={(e) => setMonth(e.target.value)} required />
      <input type="number" placeholder="日" value={day} onChange={(e) => setDay(e.target.value)} required />
      <button type="submit">診断する</button>
    </form>

    {error && <p style={{ color: "red" }}>{error}</p>}
    {result && (
      <div style={{ marginTop: "1rem" }}>
        <h3>診断結果:</h3>
        <pre>{JSON.stringify(result, null, 2)}</pre>
      </div>
    )}
  </div>
);
}

export default Diagnose;

