// src/App.tsx

import React from "react";
import { Routes, Route, Link } from "react-router-dom";
import Home from "./pages/Home";
import Diagnose from "./pages/Diagnose";
import Personality from "./pages/Personality";
import Questionnaire from "./components/Questionnaire"; // Added import
import MatrixBackground from "./components/MatrixBackground";

function App() {
  return (
    <div>
      <MatrixBackground />
      <div className="main-container">
        {/* グローバルナビゲーション */}
        <nav className="global-nav">
          <ul>
            <li>
              <Link to="/">ホーム</Link>
            </li>
            <li>
              <Link to="/diagnose">診断</Link>
            </li>
          </ul>
        </nav>

        {/* ルーティング定義 */}
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/diagnose" element={<Diagnose />} />
          {/* <Route path="/questions/:category" element={<Personality />} /> */} {/* Removed/Commented out */}
          <Route path="/questionnaire/:initial_type" element={<Questionnaire />} />
          <Route path="/personality/:finalKey" element={<Personality />} /> {/* Changed to accept finalKey */}
          {/* 必要なら他のRouteも追加 */}
        </Routes>
      </div>
    </div>
  );
}

export default App;
