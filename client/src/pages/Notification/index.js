import { useState, useEffect, useContext } from "react";
import axios from "axios";
import { Container } from "react-bootstrap";
import AuthContext from "../../contexts/UserContext";
import ReactPaginate from "react-paginate";
import { FaBell, FaCalendarAlt, FaSearch, FaFilter } from "react-icons/fa";
import { BiMessageDetail } from "react-icons/bi";
import "./Notification.scss";

function Notification() {
  const { user } = useContext(AuthContext);
  const [notifications, setNotifications] = useState([]);
  const [currentPage, setCurrentPage] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterType, setFilterType] = useState("");
  const notificationsPerPage = 8;

  useEffect(() => {
    const fetchNotifications = async () => {
      setIsLoading(true);
      try {
        const response = await axios.get(
          `http://localhost:9999/api/notifications/get/${user.id}`
        );
        const sortedNotifications = response.data.data.sort(
          (a, b) => new Date(b.date) - new Date(a.date)
        );
        setNotifications(sortedNotifications);

        // Mark all notifications as read
        await axios.put(
          `http://localhost:9999/api/notifications/markAsRead/${user.id}`
        );
      } catch (error) {
        console.error("Error fetching notifications:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchNotifications();
  }, [user.id]);

  const getNotificationInfo = (type) => {
    switch (type) {
      case "Received":
        return {
          color: "#e0f7fa",
          label: "Đã nhận",
          icon: <i className="fas fa-book"></i>,
          description: "Sách đã được nhận thành công",
        };
      case "Returned":
        return {
          color: "#c8e6c9",
          label: "Đã trả",
          icon: <i className="fas fa-undo"></i>,
          description: "Sách đã được trả thành công",
        };
      case "Pending":
        return {
          color: "#fff9c4",
          label: "Đang chờ",
          icon: <i className="fas fa-clock"></i>,
          description: "Yêu cầu đang chờ xử lý",
        };
      case "Approved":
        return {
          color: "#ffecb3",
          label: "Đã duyệt",
          icon: <i className="fas fa-check-circle"></i>,
          description: "Yêu cầu đã được duyệt",
        };
      case "Overdue":
        return {
          color: "#ffcdd2",
          label: "Quá hạn",
          icon: <i className="fas fa-exclamation-circle"></i>,
          description: "Sách đã quá hạn trả",
        };
      case "Canceled":
        return {
          color: "#ef9a9a",
          label: "Đã hủy",
          icon: <i className="fas fa-times-circle"></i>,
          description: "Yêu cầu đã bị hủy",
        };
      case "Reminder":
        return {
          color: "#dcedc8",
          label: "Nhắc nhở",
          icon: <i className="fas fa-bell"></i>,
          description: "Nhắc nhở về sách sắp đến hạn",
        };
      case "Rejected":
        return {
          color: "#ef9a9a",
          label: "Bị từ chối",
          icon: <i className="fas fa-ban"></i>,
          description: "Yêu cầu đã bị từ chối",
        };
      case "Fines":
        return {
          color: "#ef9a9a",
          label: "Phạt",
          icon: <i className="fas fa-money-bill"></i>,
          description: "Thông báo về khoản phạt",
        };
      case "Lost":
        return {
          color: "#ef9a9a",
          label: "Mất",
          icon: <i className="fas fa-search"></i>,
          description: "Sách đã bị báo mất",
        };
      case "Renew":
        return {
          color: "#e0f7fa",
          label: "Gia hạn",
          icon: <i className="fas fa-redo"></i>,
          description: "Yêu cầu gia hạn sách",
        };
      case "Borrow":
        return {
          color: "#e0f7fa",
          label: "Mượn",
          icon: <i className="fas fa-hand-holding"></i>,
          description: "Yêu cầu mượn sách",
        };
      default:
        return {
          color: "#ffffff",
          label: "Không xác định",
          icon: <i className="fas fa-question-circle"></i>,
          description: "Thông báo khác",
        };
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffTime = Math.abs(now - date);
    const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays === 0) {
      const hours = date.getHours();
      const minutes = date.getMinutes();
      return `Hôm nay, ${hours}:${minutes < 10 ? "0" + minutes : minutes}`;
    } else if (diffDays === 1) {
      return "Hôm qua";
    } else if (diffDays < 7) {
      return `${diffDays} ngày trước`;
    } else {
      return date.toLocaleDateString("vi-VN", {
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
      });
    }
  };

  // Filter notifications based on search term and type filter
  const filteredNotifications = notifications.filter((notif) => {
    const matchesSearch = notif.message
      .toLowerCase()
      .includes(searchTerm.toLowerCase());
    const matchesType = filterType === "" || notif.type === filterType;
    return matchesSearch && matchesType;
  });

  const pageCount = Math.ceil(
    filteredNotifications.length / notificationsPerPage
  );
  const displayedNotifications = filteredNotifications.slice(
    currentPage * notificationsPerPage,
    (currentPage + 1) * notificationsPerPage
  );

  const handlePageClick = (event) => {
    setCurrentPage(event.selected);
  };

  // Get unique notification types for filter dropdown
  const notificationTypes = [
    ...new Set(notifications.map((notif) => notif.type)),
  ];

  return (
    <div className="notification-page">
      <Container>
        <div className="notification-header">
          <div className="notification-title">
            <FaBell className="notification-icon" />
            <h2>Thông báo của bạn</h2>
          </div>
          <p className="notification-subtitle">
            Xem tất cả thông báo và cập nhật từ hệ thống
          </p>
        </div>

        <div className="notification-filters">
          <div className="search-box">
            <FaSearch className="search-icon" />
            <input
              type="text"
              placeholder="Tìm kiếm thông báo..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="search-input"
            />
          </div>

          <div className="filter-box">
            <FaFilter className="filter-icon" />
            <select
              value={filterType}
              onChange={(e) => setFilterType(e.target.value)}
              className="filter-select"
            >
              <option value="">Tất cả thông báo</option>
              {notificationTypes.map((type) => (
                <option key={type} value={type}>
                  {getNotificationInfo(type).label}
                </option>
              ))}
            </select>
          </div>
        </div>

        {isLoading ? (
          <div className="loading-container">
            <div className="spinner-border text-primary" role="status">
              <span className="visually-hidden">Loading...</span>
            </div>
            <p>Đang tải thông báo...</p>
          </div>
        ) : displayedNotifications.length > 0 ? (
          <div className="notification-list">
            {displayedNotifications.map((notif) => {
              const { color, label, icon } = getNotificationInfo(notif.type);
              return (
                <div
                  key={notif._id}
                  className="notification-card"
                  style={{ borderLeftColor: color }}
                >
                  <div
                    className="notification-type"
                    style={{ backgroundColor: color }}
                  >
                    {icon}
                    <span>{label}</span>
                  </div>
                  <div className="notification-content">
                    <div className="notification-message">
                      <BiMessageDetail className="message-icon" />
                      <p>{notif.message}</p>
                    </div>
                    <div className="notification-date">
                      <FaCalendarAlt className="date-icon" />
                      <span>{formatDate(notif.date)}</span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="empty-state">
            <img
              src="https://cdn-icons-png.flaticon.com/512/2645/2645890.png"
              alt="No notifications"
              className="empty-image"
            />
            <h3>Không có thông báo nào</h3>
            <p>
              Bạn chưa có thông báo nào hoặc không có thông báo phù hợp với tìm
              kiếm
            </p>
          </div>
        )}

        {pageCount > 1 && (
          <div className="pagination-container">
            <ReactPaginate
              previousLabel={"←"}
              nextLabel={"→"}
              breakLabel={"..."}
              pageCount={pageCount}
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
      </Container>
    </div>
  );
}

export default Notification;
