import React from "react";
import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import Diagnose from "./pages/Diagnose";

function Home() {
  return <div>ようこそ Hexa Codex へ</div>;
}

function App() {
  return (
    <Router>
      <div>
        <h1>Hexa Codex</h1>
        <nav>
          <Link to="/">Home</Link> | <Link to="/diagnose">診断する</Link>
        </nav>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/diagnose" element={<Diagnose />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
