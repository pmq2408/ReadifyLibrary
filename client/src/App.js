// src/App.js
import { BrowserRouter, Routes, Route } from "react-router-dom";
import ListAccount from "./pages/Homepage/listAccount";
import ListRule from "./pages/Homepage/listRule";
import GenreManagement from "./pages/Homepage/listGerne";
import ListBook from "./pages/Homepage/listBookCatalog";
import ListFine from "./pages/Homepage/listFine";
import { Homepage } from "./pages/Homepage/Homepage";
import { BorrowPage } from "./pages/Homepage/BorrowPage";
import { ManageOrder } from "./pages/Homepage/Manage-order";
import { NewsPage } from "./pages/Homepage/NewsPage";
import { RulesPage } from "./pages/Homepage/RulesPage";
import { StatisticsPage } from "./pages/Homepage/StatisticsPage";
import { FinesPage } from "./pages/Homepage/FinesPage";
import { HomeContent } from "./pages/Homepage/HomeContent";
import "./App.css";
import { BookSearch } from "./pages/BorrowPage/BookSearch";
import { BorrowBook } from "./pages/BorrowPage/BorrowBook";
import { FineBooks } from "./pages/BorrowPage/FineBooks";
import Profile from "./pages/userProfile";

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
        <Route path="/booksearch" element={<BookSearch />} />
        <Route path="/borrowBook" element={<BorrowBook />} />
        <Route path="/fineBooks" element={<FineBooks />} />

      

      </Routes>
    </BrowserRouter>
  );
}

export default App;
