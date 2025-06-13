import React, { useState, useEffect, useContext } from "react";
import { Modal, Button } from "react-bootstrap";
import axios from "axios";
import AuthContext from "../../contexts/UserContext";
import { toast, ToastContainer } from "react-toastify";
import ReactPaginate from "react-paginate";
import "./index.css";

function ManageReturn() {
  const [studentCode, setStudentCode] = useState("");
  const [identityCode, setIdentityCode] = useState("");
  const [bookList, setBookList] = useState([]);
  const [currentPage, setCurrentPage] = useState(0);
  const [showReturnModal, setShowReturnModal] = useState(false);
  const [selectedBook, setSelectedBook] = useState(null);
  const [returnDetails, setReturnDetails] = useState({
    condition: "Good",
    condition_detail: "",
    returnDate: new Date().toISOString().split("T")[0],
    fine_reason: "",
  });
  const itemsPerPage = 10;
  const { user } = useContext(AuthContext);

  // Hàm lấy ngày hiện tại theo múi giờ địa phương
  const getToday = () => {
    const date = new Date();
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");
    return `${year}-${month}-${day}`;
  };

  // Cập nhật tất cả trạng thái có sử dụng ngày hiện tại
  const initialFormState = {
    condition: "Good",
    condition_detail: "",
    returnDate: getToday(),
  };

  const getConditionText = (condition) => {
    switch (condition) {
      case "Light":
        return "hư hỏng không đáng kể";
      case "Medium":
        return "hư hỏng nhẹ";
      case "Hard":
        return "hư hỏng nặng";
      case "Lost":
        return "mất sách";
      default:
        return "tốt";
    }
  };

  useEffect(() => {
    // Fetch all orders initially
    fetchBooks();
    // Set up interval to refresh data every 5 seconds
    const interval = setInterval(fetchBooks, 5000);
    return () => clearInterval(interval);
  }, []);

  const fetchBooks = async () => {
    try {
      let response;
      if (studentCode) {
        const userData = await axios.get(
          `${process.env.REACT_APP_API_URL}/user/getByCode/${studentCode}`
        );
        const userID = userData.data.data.userID;
        response = await axios.get(
          `${process.env.REACT_APP_API_URL}/orders/by-user/${userID}`
        );
      } else if (identityCode) {
        response = await axios.get(
          `${process.env.REACT_APP_API_URL}/orders/by-identifier-code/${identityCode}`
        );
      } else {
        response = await axios.get(
          `${process.env.REACT_APP_API_URL}/orders/getAll`
        );
      }
      const data = response.data.data || [];
      const formattedData = Array.isArray(data) ? data : [data];

      // Lấy thông tin chi tiết cho mỗi đơn hàng
      const ordersWithDetails = await Promise.all(
        formattedData.map(async (order) => {
          const detailResponse = await axios.get(
            `${process.env.REACT_APP_API_URL}/orders/by-order/${order._id}`
          );
          return detailResponse.data.data;
        })
      );

      setBookList(
        ordersWithDetails
          .filter((book) => book.status === "Received")
          .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
      );
    } catch (error) {
      toast.error(error.response?.data?.message || "Có lỗi xảy ra");
      setBookList([]);
    }
  };

  const handleSearchByStudentCode = () => {
    if (!studentCode) {
      toast.error("Vui lòng nhập mã sinh viên");
      return;
    }
    setIdentityCode("");
    fetchBooks();
  };

  const handleSearchByIdentityCode = () => {
    if (!identityCode) {
      toast.error("Vui lòng nhập mã định danh sách");
      return;
    }
    setStudentCode("");
    fetchBooks();
  };

  const handleCloseModal = () => {
    setShowReturnModal(false);
    setReturnDetails({
      condition: "Good",
      condition_detail: "",
      returnDate: getToday(),
      fine_reason: "",
    });
  };

  const handleReturn = (book) => {
    setSelectedBook(book);
    setReturnDetails({
      condition: "Good",
      condition_detail: "",
      returnDate: getToday(),
      fine_reason: "",
    });
    setShowReturnModal(true);
  };

  const handleConfirmReturn = async () => {
    if (!selectedBook || !selectedBook.book_id || !selectedBook._id) {
      toast.error("Thông tin sách không hợp lệ");
      return;
    }

    try {
      // 1. Lấy thông tin lý do phạt
      let penaltyReason = null;
      if (returnDetails.condition !== "Good") {
        const penaltyTypeMap = {
          Light: "PN2", // Hư hỏng nhẹ
          Medium: "PN3", // Hư hỏng vừa
          Hard: "PN4", // Hư hỏng nặng
          Lost: "PN5", // Mất sách
        };

        try {
          // Lấy tất cả lý do phạt và tìm lý do phù hợp
          const penaltyResponse = await axios.get(
            `${process.env.REACT_APP_API_URL}/penalty-reasons/getAll`
          );

          if (penaltyResponse.data && penaltyResponse.data.data) {
            const allPenalties = penaltyResponse.data.data;
            penaltyReason = allPenalties.find(
              (penalty) =>
                penalty.type === penaltyTypeMap[returnDetails.condition]
            );

            if (!penaltyReason) {
              // Nếu không tìm thấy, tạo một lý do phạt mặc định
              penaltyReason = {
                _id: "default",
                type: penaltyTypeMap[returnDetails.condition],
                penaltyAmount:
                  returnDetails.condition === "Light"
                    ? 10
                    : returnDetails.condition === "Medium"
                    ? 30
                    : returnDetails.condition === "Hard"
                    ? 70
                    : 100,
                reasonName: `Sách bị ${getConditionText(
                  returnDetails.condition
                )}`,
              };
            }
          } else {
            throw new Error("Không thể lấy danh sách lý do phạt");
          }
        } catch (error) {
          console.error("Error fetching penalty reason:", error);
          // Tạo lý do phạt mặc định thay vì dừng xử lý
          penaltyReason = {
            _id: "default",
            type: penaltyTypeMap[returnDetails.condition],
            penaltyAmount:
              returnDetails.condition === "Light"
                ? 10
                : returnDetails.condition === "Medium"
                ? 30
                : returnDetails.condition === "Hard"
                ? 70
                : 100,
            reasonName: `Sách bị ${getConditionText(returnDetails.condition)}`,
          };
          toast.warning("Sử dụng lý do phạt mặc định");
        }
      }

      // Sử dụng API trả sách tích hợp thay vì các API riêng lẻ
      try {
        // Chuẩn bị payload cho API trả sách
        const returnPayload = {
          userId: selectedBook.created_by._id,
          returnDate: returnDetails.returnDate,
          createBy: user.id,
          updateBy: user.id,
          book_condition: returnDetails.condition,
          fine_reason:
            returnDetails.fine_reason ||
            `Sách bị ${getConditionText(returnDetails.condition)}`,
        };

        console.log("Return payload:", returnPayload);

        // Gọi API trả sách
        const returnResponse = await axios.post(
          `${process.env.REACT_APP_API_URL}/orders/return/${selectedBook._id}`,
          returnPayload
        );

        console.log("Return response:", returnResponse.data);

        if (returnResponse.data) {
          // Tính toán tổng tiền phạt nếu có
          let fineAmount = 0;
          if (
            returnResponse.data.finesApplied &&
            returnResponse.data.finesApplied.length > 0
          ) {
            fineAmount = returnResponse.data.finesApplied.reduce(
              (total, fine) => total + (fine.amount || 0),
              0
            );
          }

          // Tạo thông báo cho người mượn
          const notificationMessage =
            returnDetails.condition === "Good"
              ? `Sách "${selectedBook.book_id?.bookSet_id?.title}" đã được trả thành công.`
              : returnDetails.condition === "Lost"
              ? `Sách "${
                  selectedBook.book_id?.bookSet_id?.title
                }" được ghi nhận đã mất. ${
                  fineAmount > 0
                    ? `Bạn bị phạt ${fineAmount.toLocaleString(
                        "vi-VN"
                      )}đ. Vui lòng kiểm tra mục Tiền phạt.`
                    : ""
                }`
              : `Sách "${
                  selectedBook.book_id?.bookSet_id?.title
                }" được ghi nhận ${getConditionText(
                  returnDetails.condition
                )}. ${
                  fineAmount > 0
                    ? `Bạn bị phạt ${fineAmount.toLocaleString(
                        "vi-VN"
                      )}đ. Vui lòng kiểm tra mục Tiền phạt.`
                    : ""
                }`;

          await axios.post(
            `${process.env.REACT_APP_API_URL}/notifications/create`,
            {
              userId: selectedBook.created_by._id,
              orderId: selectedBook._id,
              type:
                returnDetails.condition === "Good"
                  ? "Returned"
                  : returnDetails.condition === "Lost"
                  ? "Lost"
                  : "Fines",
              message: notificationMessage,
            }
          );

          toast.success(
            returnDetails.condition === "Lost"
              ? "Đã ghi nhận sách bị mất và tạo phiếu phạt!"
              : returnDetails.condition === "Good"
              ? "Trả sách thành công!"
              : `Đã ghi nhận sách bị ${getConditionText(
                  returnDetails.condition
                )} và tạo phiếu phạt!`
          );
          handleCloseModal();
          fetchBooks();
        } else {
          throw new Error("Không nhận được phản hồi từ API trả sách");
        }
      } catch (error) {
        console.error("Error using return API:", error);

        // Nếu API trả sách tích hợp thất bại, thực hiện các bước riêng lẻ
        // 2. Cập nhật tình trạng sách
        await axios.put(
          `${process.env.REACT_APP_API_URL}/books/update/${selectedBook.book_id._id}`,
          {
            condition: returnDetails.condition,
            condition_detail: returnDetails.condition_detail,
            status:
              returnDetails.condition === "Lost" ? "Destroyed" : "Available",
          }
        );

        // 3. Nếu sách bị hư hỏng hoặc mất, tạo phiếu phạt
        let fineAmount = 0;
        if (penaltyReason && penaltyReason._id) {
          try {
            const finePayload = {
              user_id: selectedBook.created_by._id,
              book_id: selectedBook.book_id._id,
              order_id: selectedBook._id,
              fineReason_id: penaltyReason._id,
              createBy: user.id,
              updateBy: user.id,
              reason:
                returnDetails.fine_reason ||
                `Sách bị ${getConditionText(returnDetails.condition)}`,
            };

            const fineResponse = await axios.post(
              `${process.env.REACT_APP_API_URL}/fines/create`,
              finePayload
            );

            fineAmount = fineResponse.data.data.totalFinesAmount;
          } catch (fineError) {
            console.error("Error creating fine:", fineError);
            toast.error("Không thể tạo phiếu phạt");
          }
        }

        // 4. Cập nhật trạng thái đơn hàng thành "Returned" hoặc "Lost" tùy thuộc vào tình trạng sách
        const orderStatus =
          returnDetails.condition === "Lost" ? "Lost" : "Returned";
        await axios.put(
          `${process.env.REACT_APP_API_URL}/orders/change-status/${selectedBook._id}`,
          {
            status: orderStatus,
            updated_by: user.id,
            returnDate: returnDetails.returnDate,
          }
        );

        // 5. Tạo thông báo cho người mượn
        const notificationMessage =
          returnDetails.condition === "Good"
            ? `Sách "${selectedBook.book_id?.bookSet_id?.title}" đã được trả thành công.`
            : returnDetails.condition === "Lost"
            ? `Sách "${
                selectedBook.book_id?.bookSet_id?.title
              }" được ghi nhận đã mất. ${
                fineAmount > 0
                  ? `Bạn bị phạt ${fineAmount.toLocaleString(
                      "vi-VN"
                    )}đ. Vui lòng kiểm tra mục Tiền phạt.`
                  : ""
              }`
            : `Sách "${
                selectedBook.book_id?.bookSet_id?.title
              }" được ghi nhận ${getConditionText(returnDetails.condition)}. ${
                fineAmount > 0
                  ? `Bạn bị phạt ${fineAmount.toLocaleString(
                      "vi-VN"
                    )}đ. Vui lòng kiểm tra mục Tiền phạt.`
                  : ""
              }`;

        await axios.post(
          `${process.env.REACT_APP_API_URL}/notifications/create`,
          {
            userId: selectedBook.created_by._id,
            orderId: selectedBook._id,
            type:
              returnDetails.condition === "Good"
                ? "Returned"
                : returnDetails.condition === "Lost"
                ? "Lost"
                : "Fines",
            message: notificationMessage,
          }
        );

        toast.success(
          returnDetails.condition === "Lost"
            ? "Đã ghi nhận sách bị mất và tạo phiếu phạt!"
            : returnDetails.condition === "Good"
            ? "Trả sách thành công!"
            : `Đã ghi nhận sách bị ${getConditionText(
                returnDetails.condition
              )} và tạo phiếu phạt!`
        );
        handleCloseModal();
        fetchBooks();
      }
    } catch (error) {
      console.error("Error in handleConfirmReturn:", error);
      toast.error(
        error.response?.data?.message || "Có lỗi xảy ra khi trả sách"
      );
    }
  };

  const handlePageClick = (data) => {
    setCurrentPage(data.selected);
  };

  const offset = currentPage * itemsPerPage;
  const currentItems = bookList.slice(offset, offset + itemsPerPage);

  return (
    <div className="manage-return-container mt-4">
      <ToastContainer position="top-right" autoClose={3000} />
      <h2 className="mb-4">Quản Lý Trả Sách</h2>

      <div className="search-section row mb-4">
        <div className="col-md-6">
          <div className="input-group">
            <input
              type="text"
              className="form-control search-input"
              placeholder="Nhập mã sinh viên"
              value={studentCode}
              onChange={(e) => setStudentCode(e.target.value)}
            />
            <button
              className="btn btn-primary search-button"
              onClick={handleSearchByStudentCode}
            >
              <i className="fa fa-search"></i> Tìm theo mã sinh viên
            </button>
          </div>
        </div>

        <div className="col-md-6">
          <div className="input-group">
            <input
              type="text"
              className="form-control search-input"
              placeholder="Nhập mã định danh sách"
              value={identityCode}
              onChange={(e) => setIdentityCode(e.target.value)}
            />
            <button
              className="btn btn-primary search-button"
              onClick={handleSearchByIdentityCode}
            >
              <i className="fa fa-search"></i> Tìm theo mã sách
            </button>
          </div>
        </div>
      </div>

      <table className="table table-striped">
        <thead>
          <tr>
            <th>STT</th>
            <th>Tên sách</th>
            <th>Mã định danh</th>
            <th>Người mượn</th>
            <th>Ngày mượn</th>
            <th>Ngày hẹn trả</th>
            <th>Hành động</th>
          </tr>
        </thead>
        <tbody>
          {currentItems.length > 0 ? (
            currentItems.map((book, index) => (
              <tr key={book._id}>
                <td>{offset + index + 1}</td>
                <td>{book.book_id?.bookSet_id?.title}</td>
                <td>{book.book_id?.identifier_code}</td>
                <td>{book.created_by?.fullName}</td>
                <td>{new Date(book.borrowDate).toLocaleDateString()}</td>
                <td>{new Date(book.dueDate).toLocaleDateString()}</td>
                <td>
                  <button
                    className="btn btn-primary btn-sm me-2"
                    onClick={() => handleReturn(book)}
                  >
                    Trả sách
                  </button>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="7" className="text-center">
                Không có sách nào cần trả
              </td>
            </tr>
          )}
        </tbody>
      </table>

      {bookList.length > itemsPerPage && (
        <ReactPaginate
          previousLabel={"<"}
          nextLabel={">"}
          breakLabel={"..."}
          pageCount={Math.ceil(bookList.length / itemsPerPage)}
          marginPagesDisplayed={2}
          pageRangeDisplayed={5}
          onPageChange={handlePageClick}
          containerClassName={"pagination justify-content-center"}
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
      )}

      <Modal
        show={showReturnModal}
        onHide={handleCloseModal}
        backdrop="static"
        keyboard={false}
      >
        <Modal.Header closeButton>
          <Modal.Title>Trả Sách</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <div className="form-group mb-3">
            <label>Tên sách</label>
            <input
              type="text"
              className="form-control"
              value={selectedBook?.book_id?.bookSet_id?.title || ""}
              disabled
            />
          </div>
          <div className="form-group mb-3">
            <label>Tình trạng sách</label>
            <select
              className="form-control"
              value={returnDetails.condition}
              onChange={(e) =>
                setReturnDetails({
                  ...returnDetails,
                  condition: e.target.value,
                })
              }
            >
              <option value="Good">Tốt (Không bị phạt)</option>
              <option value="Light">
                Hư hỏng không đáng kể (Phạt 10% giá sách)
              </option>
              <option value="Medium">Hư hỏng nhẹ (Phạt 30% giá sách)</option>
              <option value="Hard">Hư hỏng nặng (Phạt 70% giá sách)</option>
              <option value="Lost">Mất sách (Phạt 100% giá sách)</option>
            </select>
            <small className="text-muted">
              {returnDetails.condition === "Good" &&
                "Sách trong tình trạng tốt, không có hư hỏng"}
              {returnDetails.condition === "Light" &&
                "Sách có vết xước nhỏ hoặc vết bẩn có thể tẩy được"}
              {returnDetails.condition === "Medium" &&
                "Sách có trang bị rách nhỏ hoặc bị ghi chú"}
              {returnDetails.condition === "Hard" &&
                "Sách bị hư hỏng nghiêm trọng, không thể sử dụng"}
              {returnDetails.condition === "Lost" &&
                "Sách bị mất hoặc không thể hoàn trả"}
            </small>
          </div>
          <div className="form-group mb-3">
            <label>Mô tả tình trạng</label>
            <textarea
              className="form-control"
              rows="3"
              value={returnDetails.condition_detail}
              onChange={(e) =>
                setReturnDetails({
                  ...returnDetails,
                  condition_detail: e.target.value,
                })
              }
              placeholder="Mô tả chi tiết tình trạng sách (vị trí hư hỏng, mức độ, ...)"
            />
          </div>
          <div className="form-group mb-3">
            <label>Ngày trả</label>
            <input
              type="date"
              className="form-control"
              value={returnDetails.returnDate}
              onChange={(e) =>
                setReturnDetails({
                  ...returnDetails,
                  returnDate: e.target.value,
                })
              }
            />
          </div>
          <div className="form-group mb-3">
            <label>Lý do phạt (nếu có)</label>
            <textarea
              className="form-control"
              rows="2"
              value={returnDetails.fine_reason}
              onChange={(e) =>
                setReturnDetails({
                  ...returnDetails,
                  fine_reason: e.target.value,
                })
              }
              placeholder="Nhập lý do phạt nếu sách bị hư hỏng hoặc trả muộn"
            />
          </div>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleCloseModal}>
            Đóng
          </Button>
          <Button variant="primary" onClick={handleConfirmReturn}>
            Xác nhận trả sách
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
}

export default ManageReturn;
