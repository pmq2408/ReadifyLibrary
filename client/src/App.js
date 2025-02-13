import ListAccount from "./pages/listAccount";
import { BrowserRouter, Route, Routes, Navigate } from "react-router-dom";
import ListRule from "./pages/listRule";
import GenreManagement from "./pages/listGerne";
import ListBook from "./pages/listBookCatalog";
import ListFine from "./pages/listFine";// src/App.js

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
    <Route path="/listaccount" element={<ListAccount/>} />
    <Route path="/listrule" element={<ListRule />} />
    <Route path="/books" element={<ListBook/>} />
    <Route path="/genres" element={<GenreManagement />} />
    <Route path="/fines" element={<ListFine />} />
    </Routes>
    </BrowserRouter>
  );
}

export default App;
