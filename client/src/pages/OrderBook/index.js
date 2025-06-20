import React, { useState, useEffect, useContext } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import AuthContext from "../../contexts/UserContext";
function BookSetDetail() {
  const { bookId } = useParams(); // Lấy bookSetId từ URL
  const navigate = useNavigate(); // Dùng để điều hướng đến trang mượn sách
  const { user } = useContext(AuthContext);
  const [bookSet, setBookSet] = useState(null); // Lưu trữ thông tin bộ sách
  const [books, setBooks] = useState([]); // Lưu trữ danh sách các quyển sách

  // Lấy dữ liệu chi tiết của bộ sách từ API
  useEffect(() => {
    const fetchBookSetDetails = async () => {
      try {
        const response = await axios.get(
          `${process.env.REACT_APP_API_URL}/book-sets/available/${bookId}`
        );
        setBookSet(response.data.bookSet); // Lưu thông tin bộ sách
        setBooks(response.data.books); // Lưu danh sách các quyển sách
      } catch (error) {
        console.error("Error fetching book set details:", error);
      }
    };

    fetchBookSetDetails();
  }, [bookId]);

  // Hàm lấy ngày hiện tại theo múi giờ địa phương
  const getToday = () => {
    const date = new Date();
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");
    return `${year}-${month}-${day}`;
  };

  // Hàm tính ngày hẹn trả (n ngày sau ngày mượn)
  const calculateDueDate = (startDate, daysToAdd) => {
    const date = new Date(startDate);
    date.setDate(date.getDate() + daysToAdd);
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");
    return `${year}-${month}-${day}`;
  };

  // Hàm xử lý khi người dùng nhấn "Borrow this book"
  const handleBorrowClick = async () => {
    if (books.length > 0) {
      const firstBook = books[0]; // Lấy quyển sách đầu tiên trong danh sách
      const today = getToday();
      const dueDate = calculateDueDate(today, 14); // 14 ngày từ ngày hiện tại

      try {
        await axios.post(
          `${process.env.REACT_APP_API_URL}/orders/create-borrow/${firstBook._id}`,
          {
            book_id: firstBook._id,
            userId: user.id,
            borrowDate: today,
            dueDate: dueDate,
          }
        );
        // Điều hướng đến trang danh sách sách đã mượn sau khi hoàn thành
        navigate(`/list-book-borrowed`);
      } catch (error) {
        console.error("Error borrowing the book:", error);
      }
    }
  };

  return (
    <div className="container my-5">
      {bookSet ? (
        <>
          {/* Hiển thị thông tin bộ sách */}
          <h3>{bookSet.title}</h3>
          <p>
            <strong>Author:</strong> {bookSet.author}
          </p>
          <p>
            <strong>Publisher:</strong> {bookSet.publisher}
          </p>
          <p>
            <strong>Published Year:</strong>{" "}
            {new Date(bookSet.publishedYear).getFullYear()}
          </p>
          <p>
            <strong>Physical Description:</strong> {bookSet.physicalDescription}
          </p>
          <p>
            <strong>Total Copies:</strong> {bookSet.totalCopies}
          </p>
          <p>
            <strong>Available Copies:</strong> {bookSet.availableCopies}
          </p>

          {/* Hiển thị danh sách các quyển sách */}
          <h4>Books in this set:</h4>
          {books.length > 0 ? (
            <ul className="list-group">
              {books.map((book, index) => (
                <li key={book._id} className="list-group-item">
                  <p>
                    <strong>Book Identifier Code:</strong>{" "}
                    {book.identifier_code}
                  </p>
                  <p>
                    <strong>Condition:</strong> {book.condition}
                  </p>
                </li>
              ))}
            </ul>
          ) : (
            <p>No books available.</p>
          )}

          {books.length > 0 && (
            <button
              className="btn btn-primary mt-3"
              onClick={handleBorrowClick}
            >
              Borrow this book
            </button>
          )}
        </>
      ) : (
        <p>Loading book set details...</p>
      )}
    </div>
  );
}

export default BookSetDetail;
