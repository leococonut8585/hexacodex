// src/App.tsx

import React from "react";
import { Routes, Route, Link } from "react-router-dom";
import Home from "./pages/Home";
import Diagnose from "./pages/Diagnose";

function App() {
  return (
    <div>
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
        {/* 必要なら他のRouteも追加 */}
      </Routes>
    </div>
  );
}

export default App;
