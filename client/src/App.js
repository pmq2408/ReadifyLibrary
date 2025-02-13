// src/App.js
import { BrowserRouter, Routes, Route } from "react-router-dom";

import { NewsPage } from "./pages/Homepage/NewsPage";
import { RulesPage } from "./pages/Homepage/RulesPage";
import { StatisticsPage } from "./pages/Homepage/StatisticsPage";

import "./App.css";

function App() {
  return (
    <BrowserRouter>
      <Routes>
       
 

          <Route path="News" element={<NewsPage />} />
          <Route path="Rules" element={<RulesPage />} />
          <Route path="Statistics" element={<StatisticsPage />} />


      </Routes>
    </BrowserRouter>
  );
}

export default App;
