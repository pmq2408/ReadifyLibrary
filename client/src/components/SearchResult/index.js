import React, { useState, useContext, useEffect } from "react";
import axios from "axios";
import AuthContext from "../../contexts/UserContext";
import { toast, ToastContainer } from "react-toastify";
import ReactPaginate from "react-paginate";
import { Modal, Button, Form, Container } from "react-bootstrap";
import "./SearchResults.css";

function SearchResults({ books = [], setBooks }) {
  const { user } = useContext(AuthContext);
  const [selectedBookId, setSelectedBookId] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [borrowDate, setBorrowDate] = useState("");
  const [dueDate, setDueDate] = useState("");
  const [bookSet, setBookSet] = useState(null);
  const [book, setBook] = useState([]);
  const [currentPage, setCurrentPage] = useState(0);
  const [loading, setLoading] = useState(false);
  const itemsPerPage = 10; // Hiển thị 10 sách mỗi trang

  const offset = currentPage * itemsPerPage;
  const sortedBooks = books.sort(
    (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
  );
  const currentBooks = sortedBooks.slice(offset, offset + itemsPerPage);

  // Cập nhật cách lấy ngày hiện tại để đảm bảo đúng ngày theo múi giờ địa phương
  const getToday = () => {
    const date = new Date();
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");
    return `${year}-${month}-${day}`;
  };

  const today = getToday();

  const calculateDueDate = (startDate, daysToAdd) => {
    const date = new Date(startDate);
    date.setDate(date.getDate() + daysToAdd);
    return date.toISOString().slice(0, 10);
  };

  const openBorrowModal = async (bookId) => {
    setSelectedBookId(bookId);
    setLoading(true);
    try {
      const response = await axios.get(
        `http://localhost:9999/api/book-sets/available/${bookId}`
      );
      setBookSet(response.data.bookSet);
      setBook(response.data.availableBooks);
      setShowModal(true);
      // Luôn lấy ngày hiện tại mới nhất khi mở modal
      const currentToday = getToday();
      setBorrowDate(currentToday);
      setDueDate(calculateDueDate(currentToday, 14));
    } catch (error) {
      console.error("Lỗi khi lấy dữ liệu sách:", error);
      toast.error("Lỗi khi lấy dữ liệu sách.");
    }
    setLoading(false);
  };

  const handleBorrowDateChange = (e) => {
    const newBorrowDate = e.target.value;
    setBorrowDate(newBorrowDate);
    setDueDate(calculateDueDate(newBorrowDate, 14));
  };

  const handleBorrowSubmit = async () => {
    setLoading(true);
    try {
      const firstBook = book[0];
      const response = await axios.post(
        `http://localhost:9999/api/orders/create-borrow/${firstBook._id}`,
        {
          book_id: firstBook._id,
          userId: user.id,
          borrowDate: borrowDate,
          dueDate: dueDate,
        }
      );
      if (response.status === 200) {
        toast.success("Đã mượn sách thành công!");
        setShowModal(false);
      } else {
        toast.error(response.data.data.message);
      }
    } catch (error) {
      const message = error.response?.data?.message || "Đã xảy ra lỗi.";
      toast.error(message);
    }
    setLoading(false);
  };

  const closeModal = () => {
    setShowModal(false);
    setBorrowDate("");
    setDueDate("");
  };

  const handlePageClick = (data) => {
    setCurrentPage(data.selected);
  };

  return (
    <Container className="mt-4">
      <ToastContainer />
      {currentBooks.map((book) => (
        <div className="card mb-4 p-3" key={book._id}>
          <div className="row no-gutters">
            <div className="col-md-3">
              <img
                src={
                  book.image
                    ? book.image
                    : "https://www.shutterstock.com/image-vector/default-ui-image-placeholder-wireframes-260nw-1037719192.jpg"
                }
                alt={book.title}
              />
            </div>
            <div className="col-md-9">
              <div className="card-body">
                <h5 className="card-title">{book.title}</h5>
                <p className="card-text">
                  <strong>Tác giả:</strong> {book.author}
                </p>
                <p className="card-text">
                  <strong>Nhà xuất bản:</strong> {book.publisher}
                </p>
                <p className="card-text">
                  <strong>Năm xuất bản:</strong>{" "}
                  {new Date(book.publishedYear).getFullYear()}
                </p>
                <p className="card-text">
                  <strong>ISBN:</strong> {book.isbn}
                </p>
                <p className="card-text">
                  <strong>Tổng số bản:</strong> {book.totalCopies}
                </p>
                <p className="card-text">
                  <strong>Số bản có sẵn:</strong> {book.availableCopies}
                </p>
                {user.role.name !== "admin" &&
                  user.role.name !== "librarian" && (
                    <button
                      className="btn btn-primary float-end"
                      onClick={() => openBorrowModal(book._id)}
                      disabled={loading}
                    >
                      {loading ? "Đang xử lý..." : "Mượn sách"}
                    </button>
                  )}
              </div>
            </div>
          </div>
        </div>
      ))}

      {books.length > itemsPerPage && (
        <ReactPaginate
          previousLabel={"<"}
          nextLabel={">"}
          breakLabel={"..."}
          pageCount={Math.ceil(books.length / itemsPerPage)}
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

      <Modal show={showModal} onHide={closeModal}>
        <Modal.Header closeButton>
          <Modal.Title>Mượn sách</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group controlId="borrowDate">
              <Form.Label>Ngày mượn</Form.Label>
              <Form.Control
                type="date"
                value={borrowDate}
                min={today}
                onChange={handleBorrowDateChange}
              />
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={closeModal}>
            Hủy
          </Button>
          <Button
            variant="primary"
            onClick={handleBorrowSubmit}
            disabled={loading}
          >
            {loading ? "Đang xử lý..." : "Xác nhận mượn"}
          </Button>
        </Modal.Footer>
      </Modal>
    </Container>
  );
}

export default SearchResults;
