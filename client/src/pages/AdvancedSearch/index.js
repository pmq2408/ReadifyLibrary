import React, { useState } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import SearchResults from "../../components/SearchResult";
import AdvancedBookForm from "../../components/AdvancedSearchForm/index";
import { FaSearch, FaBook, FaFilter } from "react-icons/fa";
import "./AdvancedSearch.scss";

function AdvancedSearch() {
  const [searchResults, setSearchResults] = useState([]);
  const [isSearching, setIsSearching] = useState(false);
  const [resultCount, setResultCount] = useState(0);
  const [hasSearched, setHasSearched] = useState(false);

  // Hàm xử lý khi nhận kết quả tìm kiếm từ form
  const handleSearchResults = (results) => {
    setIsSearching(true);

    // Giả lập thời gian tìm kiếm (có thể bỏ nếu không cần)
    setTimeout(() => {
      setSearchResults(results);
      setResultCount(results.length);
      setIsSearching(false);
      setHasSearched(true); // Đánh dấu đã thực hiện tìm kiếm
    }, 500);
  };

  return (
    <div className="advanced-search-page">
      <div className="container">
        <div className="advanced-search-header">
          <div className="advanced-search-title">
            <FaSearch className="search-icon" />
            <h2>Tìm kiếm nâng cao</h2>
          </div>
          <p className="advanced-search-subtitle">
            Tìm kiếm sách với nhiều tiêu chí khác nhau để có kết quả chính xác
            nhất
          </p>
        </div>

        <div className="search-form-container">
          <div className="search-form-header">
            <FaFilter className="filter-icon" />
            <h3>Bộ lọc tìm kiếm</h3>
          </div>

          <AdvancedBookForm
            setSearchResults={handleSearchResults}
            setIsSearching={setIsSearching}
          />

          {isSearching && (
            <div className="loading-container">
              <div className="spinner-border text-primary" role="status">
                <span className="visually-hidden">Loading...</span>
              </div>
              <p>Đang tìm kiếm...</p>
            </div>
          )}
        </div>

        {/* Hiển thị kết quả tìm kiếm trực tiếp trên trang */}
        {hasSearched && !isSearching && (
          <div className="search-results-container mt-4">
            <div className="search-results-header">
              <div className="d-flex align-items-center mb-3">
                <FaBook className="me-2" />
                <h3 className="mb-0">Kết quả tìm kiếm</h3>
                <span className="badge bg-primary ms-3">
                  Tìm thấy {resultCount} kết quả
                </span>
              </div>
            </div>

            <div className="search-results-content">
              {searchResults.length > 0 ? (
                <SearchResults books={searchResults} />
              ) : (
                <div className="empty-results text-center py-5">
                  <img
                    src="https://cdn-icons-png.flaticon.com/512/7486/7486754.png"
                    alt="No results"
                    className="empty-image"
                    style={{ maxWidth: "150px" }}
                  />
                  <h4 className="mt-3">Không tìm thấy kết quả nào</h4>
                  <p>Vui lòng thử lại với các tiêu chí tìm kiếm khác</p>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default AdvancedSearch;
