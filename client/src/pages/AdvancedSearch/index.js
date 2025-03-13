import React, { useState } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import { Modal, Button } from "react-bootstrap";
import SearchResults from "../../components/SearchResult";
import AdvancedBookForm from "../../components/AdvancedSearchForm/index";
import { FaSearch, FaBook, FaFilter, FaTimes } from "react-icons/fa";
import "./AdvancedSearch.scss";

function AdvancedSearch() {
  const [searchResults, setSearchResults] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [isSearching, setIsSearching] = useState(false);
  const [resultCount, setResultCount] = useState(0);

  // Hàm xử lý khi nhận kết quả tìm kiếm từ form
  const handleSearchResults = (results) => {
    setIsSearching(true);

    // Giả lập thời gian tìm kiếm (có thể bỏ nếu không cần)
    setTimeout(() => {
      setSearchResults(results);
      setResultCount(results.length);
      setIsSearching(false);
      setShowModal(true); // Luôn hiển thị modal khi có kết quả tìm kiếm
    }, 500);
  };

  // Hàm đóng modal
  const handleCloseModal = () => {
    setShowModal(false);
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
      </div>

      {/* Modal hiển thị kết quả tìm kiếm */}
      <Modal
        show={showModal}
        onHide={handleCloseModal}
        dialogClassName="search-results-modal"
        size="xl"
      >
        <Modal.Header>
          <Modal.Title>
            <div className="modal-title-container">
              <div className="modal-title-icon">
                <FaBook />
              </div>
              <div className="modal-title-text">Kết quả tìm kiếm</div>
            </div>
          </Modal.Title>
          <div className="result-count-badge">
            Tìm thấy {resultCount} kết quả
          </div>
          <Button
            variant="link"
            onClick={handleCloseModal}
            className="close-button"
          >
            <FaTimes />
          </Button>
        </Modal.Header>
        <Modal.Body>
          {searchResults.length > 0 ? (
            <SearchResults books={searchResults} />
          ) : (
            <div className="empty-results">
              <img
                src="https://cdn-icons-png.flaticon.com/512/7486/7486754.png"
                alt="No results"
                className="empty-image"
              />
              <h4>Không tìm thấy kết quả nào</h4>
              <p>Vui lòng thử lại với các tiêu chí tìm kiếm khác</p>
            </div>
          )}
        </Modal.Body>
      </Modal>
    </div>
  );
}

export default AdvancedSearch;
