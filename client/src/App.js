// src/App.js
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Homepage } from "./pages/Homepage/Homepage";
import { BorrowPage } from "./pages/Homepage/BorrowPage";
import { ManageOrder } from "./pages/Homepage/Manage-order";
import { NewsPage } from "./pages/Homepage/NewsPage";
import { RulesPage } from "./pages/Homepage/RulesPage";
import { StatisticsPage } from "./pages/Homepage/StatisticsPage";
import { FinesPage } from "./pages/Homepage/FinesPage";
import { HomeContent } from "./pages/Homepage/HomeContent"; // Thêm trang mặc định
import "./App.css";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Homepage />}>
          <Route index element={<HomeContent />} />

          <Route path="borrow" element={<BorrowPage />} />
          <Route path="ManageOrder" element={<ManageOrder />} />
          <Route path="News" element={<NewsPage />} />
          <Route path="Rules" element={<RulesPage />} />
          <Route path="Statistics" element={<StatisticsPage />} />
          <Route path="Fines" element={<FinesPage />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
