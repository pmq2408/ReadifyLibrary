import { useEffect, useState } from "react";
import axios from "axios";
import Table from "react-bootstrap/Table";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "bootstrap/dist/css/bootstrap.min.css";
import ReactPaginate from "react-paginate";
import "./index.css";

function ListFines() {
  const [fines, setFines] = useState([]);
  const [userCode, setUserCode] = useState("");
  const [status, setStatus] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchFines();
  }, []);

  const fetchFines = async () => {
    try {
      setLoading(true);
      const response = await axios.get(
        "https://readifylibrary.onrender.com/api/fines/getAll"
      );
      const sortedFines = response.data.data.sort(
        (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
      );
      setFines(sortedFines);
    } catch (error) {
      toast.error("Không thể tải dữ liệu phạt.");
      console.error("Lỗi khi lấy dữ liệu phạt:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleSearchByUserCode = async () => {
    if (!userCode.trim()) {
      toast.warning("Vui lòng nhập mã người dùng");
      return;
    }

    try {
      setLoading(true);
      const response = await axios.get(
        `https://readifylibrary.onrender.com/api/fines/by-code/${userCode}`
      );
      const sortedFines = response.data.data.sort(
        (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
      );
      setFines(sortedFines);
      setCurrentPage(1);
    } catch (error) {
      toast.error("Không thể tải dữ liệu phạt.");
      console.error("Lỗi khi tìm kiếm dữ liệu phạt:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleSearchByStatus = async (selectedStatus) => {
    try {
      setLoading(true);
      const url = selectedStatus
        ? `https://readifylibrary.onrender.com/api/fines/filter-by-status/${selectedStatus}`
        : "https://readifylibrary.onrender.com/api/fines/getAll";
      const response = await axios.get(url);
      const sortedFines = response.data.data.sort(
        (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
      );
      setFines(sortedFines);
      setCurrentPage(1);
    } catch (error) {
      toast.error("Không thể tải dữ liệu phạt.");
      console.error("Lỗi khi tìm kiếm dữ liệu phạt:", error);
    } finally {
      setLoading(false);
    }
  };

  const getStatusBadgeClass = (status) => {
    switch (status) {
      case "Pending":
        return "status-badge status-pending";
      case "Paid":
        return "status-badge status-paid";
      case "Overdue":
        return "status-badge status-overdue";
      default:
        return "status-badge";
    }
  };

  const getConditionText = (condition) => {
    const conditions = {
      Lost: "Mất",
      Hard: "Hư hỏng nặng",
      Medium: "Hư hỏng vừa",
      Light: "Hư hỏng nhẹ",
      Good: "Tốt",
    };
    return conditions[condition] || "N/A";
  };

  const getReasonText = (fine) => {
    if (fine.reason === "Paid") return "Đã thanh toán";
    if (fine.reason === "Pending") return "Chưa thanh toán";
    if (fine.reason === "Overdue") return "Quá hạn";
    return fine.fineReason_id?.reasonName || "N/A";
  };

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = fines.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(fines.length / itemsPerPage);

  const handlePageClick = (data) => {
    setCurrentPage(data.selected + 1);
  };

  return (
    <div className="list-fines-container">
      <ToastContainer />
      <h1 className="chart-header">📋 Danh sách phạt</h1>

      <div className="search-section row">
        <div className="col-md-8">
          <div className="d-flex gap-3">
            <input
              type="text"
              className="form-control search-input"
              placeholder="Tìm theo mã người dùng"
              value={userCode}
              onChange={(e) => setUserCode(e.target.value)}
              onKeyPress={(e) => e.key === "Enter" && handleSearchByUserCode()}
            />
            <button
              className="btn search-button"
              onClick={handleSearchByUserCode}
            >
              🔍 Tìm kiếm
            </button>
          </div>
        </div>
        <div className="col-md-4">
          <select
            className="form-select status-select"
            value={status}
            onChange={(e) => {
              setStatus(e.target.value);
              handleSearchByStatus(e.target.value);
            }}
          >
            <option value="">🔄 Tất cả trạng thái</option>
            <option value="Pending">⏳ Chưa thanh toán</option>
            <option value="Paid">✅ Đã thanh toán</option>
            <option value="Overdue">⚠️ Quá hạn</option>
          </select>
        </div>
      </div>

      {loading ? (
        <div className="text-center py-5">
          <div className="spinner-border text-primary" role="status">
            <span className="visually-hidden">Đang tải...</span>
          </div>
        </div>
      ) : (
        <>
          <div className="table-responsive">
            <Table className="fines-table">
              <thead>
                <tr>
                  <th>#</th>
                  <th>📚 Tựa sách</th>
                  <th>👤 Mã người dùng</th>
                  <th>📝 Tình trạng sách</th>
                  <th>💰 Tổng tiền phạt</th>
                  <th>🔄 Trạng thái</th>
                  <th>ℹ️ Lý do phạt</th>
                </tr>
              </thead>
              <tbody>
                {currentItems.length === 0 ? (
                  <tr>
                    <td colSpan="7" className="text-center py-4">
                      Không tìm thấy dữ liệu
                    </td>
                  </tr>
                ) : (
                  currentItems.map((fine, index) => (
                    <tr key={fine._id}>
                      <td>{indexOfFirstItem + index + 1}</td>
                      <td>{fine.book_id?.bookSet_id?.title || "N/A"}</td>
                      <td>{fine.user_id?.code || "N/A"}</td>
                      <td>{getConditionText(fine.book_id?.condition)}</td>
                      <td>
                        {new Intl.NumberFormat("vi-VN", {
                          style: "currency",
                          currency: "VND",
                        }).format(fine.totalFinesAmount)}
                      </td>
                      <td>
                        <span className={getStatusBadgeClass(fine.status)}>
                          {fine.status}
                        </span>
                      </td>
                      <td>{getReasonText(fine)}</td>
                    </tr>
                  ))
                )}
              </tbody>
            </Table>
          </div>

          <ReactPaginate
            previousLabel={"←"}
            nextLabel={"→"}
            breakLabel={"..."}
            pageCount={totalPages}
            marginPagesDisplayed={2}
            pageRangeDisplayed={5}
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
        </>
      )}
    </div>
  );
}

export default ListFines;
