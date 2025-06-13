import { useState, useEffect, useContext } from "react";
import axios from "axios";
import { Container, Button, Modal } from "react-bootstrap";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import AuthContext from "../../contexts/UserContext";
import ReactPaginate from "react-paginate";
import {
  FaMoneyBillWave,
  FaQrcode,
  FaCheckCircle,
  FaTimesCircle,
  FaHourglassHalf,
  FaSearch,
} from "react-icons/fa";
import "./Fines.scss";

function formatCurrency(amount) {
  return new Intl.NumberFormat("vi-VN", {
    style: "currency",
    currency: "VND",
  }).format(amount);
}

function Fines() {
  const { user } = useContext(AuthContext);
  const [fines, setFines] = useState([]);
  const [selectedFines, setSelectedFines] = useState([]);
  const [selectAll, setSelectAll] = useState(false);
  const [transactionCode, setTransactionCode] = useState("");
  const [showQRCode, setShowQRCode] = useState(false);
  const [totalAmount, setTotalAmount] = useState(0);
  const [pollingIntervalId, setPollingIntervalId] = useState(null);
  const [timeoutId, setTimeoutId] = useState(null);
  const [currentPage, setCurrentPage] = useState(0);
  const [paymentSuccessful, setPaymentSuccessful] = useState(false);
  const [isSuccessToastShown, setIsSuccessToastShown] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const finesPerPage = 10;

  useEffect(() => {
    const code = `TX${Date.now()}${Math.random().toString(36).substring(2)}`;
    setTransactionCode(code);

    const fetchFines = () => {
      setIsLoading(true);
      axios
        .get(`${process.env.REACT_APP_API_URL}/fines/by-user/${user.id}`)
        .then((response) => {
          setFines(response.data.data);
          setIsLoading(false);
        })
        .catch((error) => {
          console.error(
            "Error fetching fines:",
            error.response?.data || error.message
          );
          toast.error("Failed to load fines. Please try again later.");
          setIsLoading(false);
        });
    };

    fetchFines();

    const intervalId = setInterval(fetchFines, 5000);

    return () => clearInterval(intervalId);
  }, [user.id]);

  const handleSelectAll = () => {
    setSelectedFines(
      selectAll
        ? []
        : fines.filter((fine) => fine.status !== "Paid").map((fine) => fine._id)
    );
    setSelectAll(!selectAll);
  };

  const handleSelectFine = (fineId) => {
    setSelectedFines((prevSelected) =>
      prevSelected.includes(fineId)
        ? prevSelected.filter((id) => id !== fineId)
        : [...prevSelected, fineId]
    );
  };

  const handlePay = () => {
    setPaymentSuccessful(false);
    setIsSuccessToastShown(false);
    const total = fines
      .filter((fine) => selectedFines.includes(fine._id))
      .reduce((sum, fine) => sum + fine.totalFinesAmount, 0);
    setTotalAmount(total);
    setShowQRCode(true);

    const intervalId = setInterval(checkPayment, 5000);
    setPollingIntervalId(intervalId);

    const timeout = setTimeout(() => {
      clearInterval(intervalId);
      setShowQRCode(false);
      toast.error("Hết thời gian chờ thanh toán. Vui lòng thử lại.");
    }, 300000);
    setTimeoutId(timeout);
  };

  const checkPayment = () => {
    if (paymentSuccessful) return;

    axios
      .post(
        `${process.env.REACT_APP_API_URL}/fines/check-payment/${transactionCode}`,
        {
          fineId: selectedFines,
        }
      )
      .then((response) => {
        if (response.data.message === "OK") {
          setPaymentSuccessful(true);
          clearInterval(pollingIntervalId);
          clearTimeout(timeoutId);
          setShowQRCode(false);

          if (isSuccessToastShown === false) {
            toast.success("Thanh toán thành công");
            setIsSuccessToastShown(true);
          }
        }
      })
      .catch((error) => {
        console.error(
          "Error in checkPayment:",
          error.response?.data || error.message
        );
      });
  };

  useEffect(() => {
    return () => {
      clearInterval(pollingIntervalId);
      clearTimeout(timeoutId);
    };
  }, [pollingIntervalId, timeoutId]);

  const filteredFines = fines.filter(
    (fine) =>
      fine.user_id?.fullName
        ?.toLowerCase()
        .includes(searchTerm.toLowerCase()) ||
      (fine.reason || fine.fineReason_id?.reasonName || "")
        .toLowerCase()
        .includes(searchTerm.toLowerCase())
  );

  const totalPages = Math.ceil(filteredFines.length / finesPerPage);

  const handlePageClick = (data) => {
    setCurrentPage(data.selected);
  };

  const currentFines = filteredFines.slice(
    currentPage * finesPerPage,
    (currentPage + 1) * finesPerPage
  );

  const calculateTotalSelectedAmount = () => {
    return fines
      .filter((fine) => selectedFines.includes(fine._id))
      .reduce((sum, fine) => sum + fine.totalFinesAmount, 0);
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case "Pending":
        return (
          <span className="status-badge pending">
            <FaHourglassHalf /> Đang chờ
          </span>
        );
      case "Paid":
        return (
          <span className="status-badge paid">
            <FaCheckCircle /> Đã thanh toán
          </span>
        );
      default:
        return (
          <span className="status-badge unknown">
            <FaTimesCircle /> Không xác định
          </span>
        );
    }
  };

  return (
    <div className="fines-container">
      <ToastContainer
        position="top-right"
        autoClose={3000}
        hideProgressBar={false}
      />

      <div className="fines-header">
        <div className="fines-title">
          <FaMoneyBillWave className="fines-icon" />
          <h2>Quản lý tiền phạt</h2>
        </div>
        <p className="fines-subtitle">
          Xem và thanh toán các khoản phạt của bạn
        </p>
      </div>

      <div className="fines-actions">
        <div className="search-box">
          <FaSearch className="search-icon" />
          <input
            type="text"
            placeholder="Tìm kiếm theo tên hoặc lý do..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="search-input"
          />
        </div>

        <div className="payment-section">
          {selectedFines.length > 0 && (
            <div className="selected-amount">
              <span>Tổng tiền đã chọn:</span>
              <span className="amount">
                {formatCurrency(calculateTotalSelectedAmount())}
              </span>
            </div>
          )}
          <Button
            className="payment-button"
            variant="primary"
            onClick={handlePay}
            disabled={selectedFines.length === 0}
            title={
              selectedFines.length === 0
                ? "Chọn ít nhất 1 phạt để thanh toán"
                : "Thanh toán"
            }
          >
            <FaQrcode /> Thanh toán
          </Button>
        </div>
      </div>

      {isLoading ? (
        <div className="loading-container">
          <div className="spinner-border text-primary" role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
          <p>Đang tải dữ liệu...</p>
        </div>
      ) : filteredFines.length > 0 ? (
        <div className="fines-table-container">
          <table className="fines-table">
            <thead>
              <tr>
                <th className="checkbox-column">
                  <div className="custom-checkbox">
                    <input
                      id="select-all"
                      type="checkbox"
                      checked={selectAll}
                      onChange={handleSelectAll}
                    />
                    <label htmlFor="select-all"></label>
                  </div>
                </th>
                <th>STT</th>
                <th>Người bị phạt</th>
                <th>Lý do</th>
                <th>Số tiền phạt</th>
                <th>Trạng thái</th>
              </tr>
            </thead>
            <tbody>
              {currentFines.map((fine, index) => (
                <tr
                  key={fine._id}
                  className={fine.status === "Paid" ? "paid-row" : ""}
                >
                  <td className="checkbox-column">
                    {fine.status === "Pending" && (
                      <div className="custom-checkbox">
                        <input
                          id={`fine-${fine._id}`}
                          type="checkbox"
                          checked={selectedFines.includes(fine._id)}
                          onChange={() => handleSelectFine(fine._id)}
                        />
                        <label htmlFor={`fine-${fine._id}`}></label>
                      </div>
                    )}
                  </td>
                  <td>{currentPage * finesPerPage + index + 1}</td>
                  <td>{fine.user_id.fullName}</td>
                  <td className="reason-cell">
                    {fine.reason ||
                      fine.fineReason_id?.reasonName ||
                      "Không có lý do"}
                  </td>
                  <td className="amount-cell">
                    {formatCurrency(fine.totalFinesAmount)}
                  </td>
                  <td>{getStatusBadge(fine.status)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <div className="empty-state">
          <img
            src="https://cdn-icons-png.flaticon.com/512/4076/4076432.png"
            alt="No fines"
            className="empty-image"
          />
          <h3>Không có khoản phạt nào</h3>
          <p>Bạn không có khoản phạt nào cần thanh toán</p>
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

      <Modal
        show={showQRCode}
        onHide={() => setShowQRCode(false)}
        centered
        className="qr-modal"
      >
        <Modal.Header closeButton>
          <Modal.Title>Quét mã QR để thanh toán</Modal.Title>
        </Modal.Header>
        <Modal.Body className="text-center">
          <div className="payment-info">
            <h4>
              Tổng số tiền:{" "}
              <span className="highlight">{formatCurrency(totalAmount)}</span>
            </h4>
            <p className="transaction-code">Mã giao dịch: {transactionCode}</p>
          </div>
          <div className="qr-container">
            <img
              src={`https://img.vietqr.io/image/MB-99240899999-compact2.png?amount=${totalAmount}&addInfo=start${transactionCode}end&accountName=Readify`}
              alt="QR Code for Payment"
              className="qr-code"
            />
          </div>
          <div className="payment-instructions">
            <p>1. Mở ứng dụng ngân hàng trên điện thoại</p>
            <p>2. Quét mã QR hoặc chuyển khoản thủ công</p>
            <p>3. Nhập chính xác số tiền và nội dung chuyển khoản</p>
            <p>4. Xác nhận và hoàn tất thanh toán</p>
          </div>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowQRCode(false)}>
            Đóng
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
}

export default Fines;
