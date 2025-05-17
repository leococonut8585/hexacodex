// src/App.tsx

import React from "react";
import { Routes, Route, Link } from "react-router-dom";
import Home from "./pages/Home";
import Diagnose from "./pages/Diagnose";
import Personality from "./pages/Personality";
import MatrixBackground from "./components/MatrixBackground";

function App() {
  return (
    <div>
      <MatrixBackground />
      {/* グローバルナビゲーション */}
      <nav>
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
        <Route path="/personality" element={<Personality />} />
        <Route path="/questions/:category" element={<Personality />} />
        {/* 必要なら他のRouteも追加 */}
      </Routes>
    </div>
  );
}

export default App;
