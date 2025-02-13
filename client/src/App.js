// src/App.js
import { BrowserRouter, Routes, Route } from "react-router-dom";
import ListAccount from "./pages/listAccount";
import ListRule from "./pages/listRule";
import GenreManagement from "./pages/listGerne";
import ListBook from "./pages/listBookCatalog";
import ListFine from "./pages/listFine";
import { Homepage } from "./pages/Homepage/Homepage";
import { BorrowPage } from "./pages/Homepage/BorrowPage";
import { ManageOrder } from "./pages/Homepage/Manage-order";
import { NewsPage } from "./pages/Homepage/NewsPage";
import { RulesPage } from "./pages/Homepage/RulesPage";
import { StatisticsPage } from "./pages/Homepage/StatisticsPage";
import { FinesPage } from "./pages/Homepage/FinesPage";
import { HomeContent } from "./pages/Homepage/HomeContent";
import "./App.css";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Homepage Routes */}
        <Route path="/" element={<Homepage />}>
          <Route index element={<HomeContent />} />
          <Route path="borrow" element={<BorrowPage />} />
          <Route path="manageorder" element={<ManageOrder />} />
          <Route path="news" element={<NewsPage />} />
          <Route path="rules" element={<RulesPage />} />
          <Route path="statistics" element={<StatisticsPage />} />
          <Route path="fines" element={<FinesPage />} />
        </Route>

        {/* Management Routes */}
        <Route path="/listaccount" element={<ListAccount />} />
        <Route path="/listrule" element={<ListRule />} />
        <Route path="/books" element={<ListBook />} />
        <Route path="/genres" element={<GenreManagement />} />
        <Route path="/fines-management" element={<ListFine />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
