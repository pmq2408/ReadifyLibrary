import React, { useState, useEffect, useContext } from "react";
import "./ListBookBorrowed.scss";
import { Link } from "react-router-dom";
import axios from "axios";
import AuthContext from "../../contexts/UserContext";
import "font-awesome/css/font-awesome.min.css";
import ReactPaginate from "react-paginate";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import ConfirmLostBookModal from "../../components/confirmLostBookModal/ConfirmLostBookModal";
import {
  FaSearch,
  FaFilter,
  FaBook,
  FaCalendarAlt,
  FaExclamationTriangle,
} from "react-icons/fa";
import { BiReset } from "react-icons/bi";

function ListBookBorrowed() {
  const navigate = useNavigate();
  const [borrowedBooks, setBorrowedBooks] = useState([]);
  const [currentPage, setCurrentPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [statusFilter, setStatusFilter] = useState("");
  const [showConfirmLostModal, setShowConfirmLostModal] = useState(false);
  const [selectedOrderId, setSelectedOrderId] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [isLoading, setIsLoading] = useState(true);

  const { user, token } = useContext(AuthContext);

  useEffect(() => {
    const fetchBorrowedBooks = async () => {
      if (!user) return;
      setIsLoading(true);

      try {
        const response = await axios.get(
          `http://localhost:9999/api/orders/by-user/${user.id}?page=${
            currentPage + 1
          }&status=${statusFilter}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        const sortedBooks = response.data.data.sort(
          (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
        );
        setBorrowedBooks(sortedBooks);
        setTotalPages(response.data.totalPages);
      } catch (err) {
        console.error(err);
        toast.error("Không thể tải danh sách sách đã mượn");
      } finally {
        setIsLoading(false);
      }
    };

    fetchBorrowedBooks();
    const intervalId = setInterval(fetchBorrowedBooks, 5000);

    return () => clearInterval(intervalId);
  }, [user, token, currentPage, statusFilter]);

  const handlePageClick = (data) => {
    setCurrentPage(data.selected);
  };

  const handleReportLostBook = (orderId) => {
    setSelectedOrderId(orderId);
    setShowConfirmLostModal(true);
  };

  const confirmReportLostBook = async () => {
    setShowConfirmLostModal(false);

    try {
      await axios.put(
        `http://localhost:9999/api/orders/report-lost/${selectedOrderId}`,
        { userId: user.id, updated_by: user.id },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      toast.success("The book has been successfully reported as lost.");

      const response = await axios.get(
        `http://localhost:9999/api/orders/by-user/${user.id}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setBorrowedBooks(response.data.data);
    } catch (err) {
      console.error(err);
      toast.error("Failed to report the book as lost. Please try again.");
    }
  };

  const handleCancelOrder = async (orderId) => {
    try {
      await axios.put(
        `http://localhost:9999/api/orders/change-status/${orderId}`,
        { status: "Canceled", updated_by: user.id },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      toast.success("Đơn hàng đã được hủy thành công.");
    } catch (err) {
      const message = err.response?.data?.message || "Đã xảy ra lỗi.";
      console.error(err);
      toast.error(message);
    }
  };

  const handleRenewBook = async (orderId) => {
    navigate(`/renew-book/${orderId}`);
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "Received":
        return "status-received";
      case "Pending":
        return "status-pending";
      case "Canceled":
        return "status-canceled";
      case "Lost":
        return "status-lost";
      case "Returned":
        return "status-returned";
      case "Returned-Damaged":
        return "status-damaged";
      case "Returned-Lost":
        return "status-lost";
      case "Renew Pending":
        return "status-pending";
      default:
        return "status-default";
    }
  };

  const getDetailedStatus = (order) => {
    if (order.status === "Returned" && order.book_id?.condition) {
      switch (order.book_id.condition) {
        case "Light":
          return "Hư hỏng nhẹ (đã trả)";
        case "Medium":
          return "Hư hỏng vừa (đã trả)";
        case "Hard":
          return "Hư hỏng nặng (đã trả)";
        case "Lost":
          return "Mất sách";
        default:
          return "Đã trả";
      }
    }

    switch (order.status) {
      case "Pending":
        return "Chờ duyệt";
      case "Rejected":
        return "Từ chối mượn";
      case "Received":
        return "Đã nhận";
      case "Canceled":
        return "Đã hủy";
      case "Lost":
        return "Mất sách";
      case "Returned":
        return "Đã trả";
      case "Renew Pending":
        return "Đang gia hạn";
      case "Approved":
        return "Đã duyệt";
      default:
        return "Không xác định";
    }
  };

  const getConditionClass = (condition) => {
    switch (condition) {
      case "Good":
        return "condition-good";
      case "Light":
        return "condition-light";
      case "Medium":
        return "condition-medium";
      case "Hard":
        return "condition-hard";
      case "Lost":
        return "condition-lost";
      default:
        return "condition-default";
    }
  };

  const filteredBooks = borrowedBooks.filter(
    (order) =>
      order.book_id?.bookSet_id?.title
        ?.toLowerCase()
        .includes(searchTerm.toLowerCase()) ||
      order.book_id?.identifier_code
        ?.toLowerCase()
        .includes(searchTerm.toLowerCase())
  );

  const resetFilters = () => {
    setStatusFilter("");
    setSearchTerm("");
    setCurrentPage(0);
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("vi-VN", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    });
  };

  const isOverdue = (dueDate) => {
    return new Date(dueDate) < new Date();
  };

  return (
    <div className="borrowed-books-container">
      <div className="page-header">
        <h2 className="page-title">
          <FaBook className="page-icon" /> Sách đã mượn
        </h2>
        <p className="page-description">Tất cả sách bạn đã mượn từ thư viện</p>
      </div>

      <div className="filter-section">
        <div className="search-box">
          <FaSearch className="search-icon" />
          <input
            type="text"
            placeholder="Tìm kiếm theo tên sách hoặc mã định danh..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="search-input"
          />
        </div>

        <div className="filter-controls">
          <div className="filter-select-container">
            <FaFilter className="filter-icon" />
            <select
              className="filter-select"
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
            >
              <option value="">Tất cả trạng thái</option>
              <option value="Appoved">Đã duyệt</option>
              <option value="Rejected">Từ chối mượn</option>
              <option value="Pending">Chờ duyệt</option>
              <option value="Received">Đã nhận</option>
              <option value="Canceled">Đã hủy</option>
              <option value="Lost">Đã mất</option>
              <option value="Returned">Đã trả</option>
              <option value="Renew Pending">Đang gia hạn</option>
            </select>
          </div>
          <button className="reset-button" onClick={resetFilters}>
            <BiReset /> Đặt lại
          </button>
        </div>
      </div>

      {isLoading ? (
        <div className="loading-container">
          <div className="spinner-border text-primary" role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
          <p>Đang tải dữ liệu...</p>
        </div>
      ) : filteredBooks.length > 0 ? (
        <div className="table-responsive">
          <table className="book-table">
            <thead>
              <tr>
                <th>STT</th>
                <th>Tên sách</th>
                <th>Ngày mượn</th>
                <th>Ngày hẹn trả</th>
                <th>Trạng thái</th>
                <th>Tình trạng sách</th>
                <th>Mã định danh</th>
                <th>Số lần gia hạn</th>
                <th>Hành động</th>
              </tr>
            </thead>
            <tbody>
              {filteredBooks.map((order, index) => (
                <tr
                  key={order._id}
                  className={
                    isOverdue(order.dueDate) && order.status === "Received"
                      ? "overdue-row"
                      : ""
                  }
                >
                  <td>{index + 1}</td>
                  <td className="book-title-cell">
                    {order.book_id?.bookSet_id?.title || "Unknown Title"}
                  </td>
                  <td>{formatDate(order.borrowDate)}</td>
                  <td className="due-date-cell">
                    {formatDate(order.dueDate)}
                    {isOverdue(order.dueDate) &&
                      order.status === "Received" && (
                        <div className="overdue-badge">
                          <FaExclamationTriangle /> Quá hạn
                        </div>
                      )}
                  </td>
                  <td>
                    <span
                      className={`status-badge ${getStatusColor(order.status)}`}
                    >
                      {getDetailedStatus(order)}
                    </span>
                  </td>
                  <td>
                    <span
                      className={`condition-badge ${getConditionClass(
                        order.book_id?.condition
                      )}`}
                    >
                      {order.book_id?.condition === "Good" ||
                      !order.book_id?.condition
                        ? "Tốt"
                        : order.book_id?.condition === "Light"
                        ? "Hư hỏng nhẹ"
                        : order.book_id?.condition === "Medium"
                        ? "Hư hỏng vừa"
                        : order.book_id?.condition === "Hard"
                        ? "Hư hỏng nặng"
                        : order.book_id?.condition === "Lost"
                        ? "Mất sách"
                        : "Không xác định"}
                    </span>
                    {order.book_id?.condition_detail &&
                      order.book_id.condition !== "Good" && (
                        <div className="condition-detail">
                          {order.book_id.condition_detail}
                        </div>
                      )}
                  </td>
                  <td>{order.book_id?.identifier_code}</td>
                  <td>{order.renewalCount}</td>
                  <td>
                    <div className="action-buttons">
                      {order.status === "Received" && (
                        <>
                          <button
                            onClick={() => handleReportLostBook(order._id)}
                            className="action-button report-lost-button"
                            title="Báo mất sách"
                          >
                            <img
                              width="20"
                              height="20"
                              src="https://img.icons8.com/hatch/64/quest.png"
                              alt="quest"
                            />
                          </button>

                          <button
                            className="action-button renew-button"
                            title="Gia hạn sách"
                            onClick={() => handleRenewBook(order._id)}
                          >
                            <img
                              width="20"
                              height="20"
                              src="https://img.icons8.com/ios/50/renew-subscription.png"
                              alt="renew-subscription"
                            />
                          </button>
                        </>
                      )}

                      <Link
                        to={`/list-book-borrowed/order-book-detail/${order._id}`}
                        className="action-button view-button"
                        title="Xem chi tiết"
                      >
                        <img
                          width="20"
                          height="20"
                          src="https://img.icons8.com/ios/30/visible--v1.png"
                          alt="visible--v1"
                        />
                      </Link>

                      {order.status === "Pending" && (
                        <button
                          onClick={() => handleCancelOrder(order._id)}
                          className="action-button cancel-button"
                          title="Hủy đơn hàng"
                        >
                          <img
                            width="20"
                            height="20"
                            src="https://img.icons8.com/ios/30/cancel.png"
                            alt="cancel"
                          />
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <div className="empty-state">
          <img
            src="https://cdn-icons-png.flaticon.com/512/5445/5445197.png"
            alt="No books found"
            className="empty-image"
          />
          <h3>Không tìm thấy sách nào</h3>
          <p>Không có sách nào phù hợp với tiêu chí tìm kiếm của bạn</p>
        </div>
      )}

      {totalPages > 1 && (
        <div className="pagination-container">
          <ReactPaginate
            previousLabel={"←"}
            nextLabel={"→"}
            breakLabel={"..."}
            pageCount={totalPages}
            marginPagesDisplayed={2}
            pageRangeDisplayed={3}
            onPageChange={handlePageClick}
            containerClassName={"pagination"}
            pageClassName={"page-item"}
            pageLinkClassName={"page-link"}
            previousClassName={"page-item"}
            previousLinkClassName={"page-link"}
            nextClassName={"page-item"}
            nextLinkClassName={"page-link"}
            breakClassName={"page-item"}
            breakLinkClassName={"page-link"}
            activeClassName={"active"}
          />
        </div>
      )}

      <ConfirmLostBookModal
        show={showConfirmLostModal}
        onClose={() => setShowConfirmLostModal(false)}
        onConfirm={confirmReportLostBook}
      />
    </div>
  );
}

export default ListBookBorrowed;
