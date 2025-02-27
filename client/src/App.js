import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider, useAuth } from "./Aucontext/Aucontext";
import ListAccount from "./pages/Homepage/listAccount";
import ListRule from "./pages/Homepage/listRule";
import GenreManagement from "./pages/Homepage/listGerne";
import ListBook from "./pages/Homepage/listBookCatalog";
import ListFine from "./pages/Homepage/listFine";
import UserProfile from "./pages/userProfile";
import { Homepage } from "./pages/Homepage/Homepage";
import { BorrowPage } from "./pages/Homepage/BorrowPage";
import { ManageOrder } from "./pages/Homepage/Manage-order";
import { NewsPage } from "./pages/Homepage/NewsPage";
import { RulesPage } from "./pages/Homepage/RulesPage";
import { StatisticsPage } from "./pages/Homepage/StatisticsPage";
import { FinesPage } from "./pages/Homepage/FinesPage";
import { HomeContent } from "./pages/Homepage/HomeContent";
import { BookSearch } from "./pages/BorrowPage/BookSearch";
import { BorrowBook } from "./pages/BorrowPage/BorrowBook";
import { FineBooks } from "./pages/BorrowPage/FineBooks";
import LoginPage from "./pages/Login/Login";
import "./App.css";

const PrivateRoute = ({ element, roles }) => {
  const { user } = useAuth();
  if (!user) return <Navigate to="/login" />;
  if (!roles.includes(user.role)) return <Navigate to="/" />;
  return element;
};

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Routes>
          <Route path="/" element={<Homepage />}>
            <Route index element={<HomeContent />} />
            {/* User Routes */}
            <Route path="booksearch" element={<PrivateRoute element={<BookSearch />} roles={["user"]} />} />
            <Route path="borrowBook" element={<PrivateRoute element={<BorrowBook />} roles={["user"]} />} />
            <Route path="fineBooks" element={<PrivateRoute element={<FineBooks />} roles={["user"]} />} />
            {/* Admin Routes */}
            <Route path="news" element={<PrivateRoute element={<NewsPage />} roles={["admin"]} />} />
            <Route path="rules" element={<PrivateRoute element={<RulesPage />} roles={["admin"]} />} />
            <Route path="statistics" element={<PrivateRoute element={<StatisticsPage />} roles={["admin"]} />} />
            <Route path="fines" element={<PrivateRoute element={<FinesPage />} roles={["admin"]} />} />
            {/* Library Routes */}
            <Route path="listaccount" element={<PrivateRoute element={<ListAccount />} roles={["admin"]} />} />
            <Route path="listrule" element={<PrivateRoute element={<ListRule />} roles={["library"]} />} />
            <Route path="fines-management" element={<PrivateRoute element={<ListFine />} roles={["library"]} />} />
            <Route path="books" element={<PrivateRoute element={<ListBook />} roles={["library"]} />} />
            <Route path="borrow" element={<PrivateRoute element={<BorrowPage />} roles={["library"]} />} />
            <Route path="manageorder" element={<PrivateRoute element={<ManageOrder />} roles={["library"]} />} />
            <Route path="genres" element={<PrivateRoute element={<GenreManagement />} roles={["library"]} />} />
          </Route>
          {/* Public Routes */}
          <Route path="login" element={<LoginPage />} />
          <Route path="profile" element={<UserProfile />} />
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;
