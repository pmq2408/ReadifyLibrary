import ListAccount from "./pages/listAccount";
import { BrowserRouter, Route, Routes, Navigate } from "react-router-dom";
import ListRule from "./pages/listRule";
import GenreManagement from "./pages/listGerne";
import ListBook from "./pages/listBookCatalog";
import ListFine from "./pages/listFine";

function App() {
  return (
    <BrowserRouter>
    <Routes>
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
