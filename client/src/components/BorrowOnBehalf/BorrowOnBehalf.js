import React, { useState, useContext } from "react";
import {
  Form,
  Input,
  DatePicker,
  Button,
  message,
  Card,
  Spin,
  AutoComplete,
} from "antd";
import axios from "axios";
import moment from "moment";
import "./BorrowOnBehalf.css";
import AuthContext from "../../contexts/UserContext";
import debounce from "lodash/debounce";

const BorrowOnBehalf = () => {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [studentInfo, setStudentInfo] = useState(null);
  const [searchingStudent, setSearchingStudent] = useState(false);
  const [searchingBook, setSearchingBook] = useState(false);
  const [bookInfo, setBookInfo] = useState(null);
  const [bookOptions, setBookOptions] = useState([]);
  const { user } = useContext(AuthContext);

  console.log("Current user:", user); // Debug user info

  // Kiểm tra xem người dùng có phải là thủ thư không
  const isLibrarian = true; // Tạm thời bỏ qua kiểm tra role vì đã có ProtectedRoute

  console.log("Is Librarian:", isLibrarian); // Debug librarian check

  // Hàm lấy token từ localStorage
  const getAuthHeader = () => {
    const token = localStorage.getItem("accessToken");
    return {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    };
  };

  const handleStudentCodeSearch = async (studentCode) => {
    if (!studentCode) return;

    try {
      setSearchingStudent(true);
      // Bước 1: Lấy userID từ mã sinh viên
      const userResponse = await axios.get(
        `http://localhost:9999/api/user/getByCode/${studentCode}`,
        getAuthHeader()
      );

      if (userResponse.data && userResponse.data.data) {
        const userID = userResponse.data.data.userID;

        // Bước 2: Lấy thông tin chi tiết của sinh viên từ userID
        const userDetailResponse = await axios.get(
          `http://localhost:9999/api/user/get/${userID}`,
          getAuthHeader()
        );

        if (userDetailResponse.data && userDetailResponse.data.data) {
          setStudentInfo(userDetailResponse.data.data);
          message.success("Tìm thấy sinh viên!");
        } else {
          setStudentInfo(null);
          message.error("Không thể lấy thông tin chi tiết sinh viên!");
        }
      } else {
        setStudentInfo(null);
        message.error("Không tìm thấy sinh viên với mã này!");
      }
    } catch (error) {
      setStudentInfo(null);
      message.error(
        "Không thể tìm thấy sinh viên: " +
          (error.response?.data?.message || "Đã có lỗi xảy ra")
      );
    } finally {
      setSearchingStudent(false);
    }
  };

  const handleBookSearch = debounce(async (searchText) => {
    if (!searchText) {
      setBookOptions([]);
      return;
    }

    try {
      setSearchingBook(true);
      const response = await axios.get(
        `http://localhost:9999/api/books/search?searchTerm=${encodeURIComponent(
          searchText
        )}`,
        getAuthHeader()
      );

      if (response.data && response.data.data) {
        setBookOptions(response.data.data);
      }
    } catch (error) {
      message.error(
        "Không thể tìm kiếm sách: " +
          (error.response?.data?.message || "Đã có lỗi xảy ra")
      );
    } finally {
      setSearchingBook(false);
    }
  }, 500);

  const onBookSelect = (value, option) => {
    setBookInfo(option.book);
    form.setFieldsValue({
      bookId: option.value,
    });
  };

  const onFinish = async (values) => {
    if (!studentInfo) {
      message.error("Vui lòng tìm kiếm sinh viên trước!");
      return;
    }

    try {
      setLoading(true);
      const { bookId, borrowDate, dueDate } = values;

      // Gọi API mượn sách với token xác thực
      const response = await axios.post(
        `http://localhost:9999/api/orders/librarian-borrow/${bookId}`,
        {
          userId: studentInfo._id,
          borrowDate: borrowDate.format("YYYY-MM-DD"),
          dueDate: dueDate.format("YYYY-MM-DD"),
          librarianId: user.id,
        },
        getAuthHeader()
      );

      if (response.data.data) {
        message.success("Mượn sách thành công!");
        // Reset tất cả state và form
        form.resetFields();
        setStudentInfo(null);
        setBookInfo(null);
        setBookOptions([]);
        // Cập nhật lại số lượng sách có sẵn
        if (bookInfo && bookInfo.availableCopies > 0) {
          const updatedOptions = bookOptions.map((option) => {
            if (option.value === bookId) {
              const newAvailableCopies = option.book.availableCopies - 1;
              return {
                ...option,
                label: `${option.book.title} - Mã sách: ${option.value} (Còn ${newAvailableCopies} quyển)`,
                book: {
                  ...option.book,
                  availableCopies: newAvailableCopies,
                },
              };
            }
            return option;
          });
          setBookOptions(updatedOptions);
        }
      }
    } catch (error) {
      message.error(
        error.response?.data?.message || "Có lỗi xảy ra khi mượn sách!"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="borrow-onbehalf-container">
      {!isLibrarian ? (
        <Card>
          <div style={{ textAlign: "center" }}>
            <h2>Không có quyền truy cập</h2>
            <p>Bạn cần có quyền thủ thư để sử dụng chức năng này.</p>
          </div>
        </Card>
      ) : (
        <Card title="Mượn sách hộ sinh viên" className="borrow-onbehalf-card">
          <Form form={form} layout="vertical" onFinish={onFinish}>
            <Form.Item
              name="studentCode"
              label="Mã sinh viên"
              rules={[
                { required: true, message: "Vui lòng nhập mã sinh viên!" },
              ]}
            >
              <Input.Search
                placeholder="Nhập mã sinh viên (VD: HE002)"
                loading={searchingStudent}
                onSearch={handleStudentCodeSearch}
                enterButton="Tìm kiếm"
              />
            </Form.Item>

            {studentInfo && (
              <div className="student-info">
                <h3>Thông tin sinh viên:</h3>
                <p>
                  <strong>Họ tên:</strong> {studentInfo.fullName}
                </p>
                <p>
                  <strong>Mã số:</strong> {studentInfo.code}
                </p>
                <p>
                  <strong>Email:</strong> {studentInfo.email}
                </p>
              </div>
            )}

            <Form.Item
              name="bookId"
              label="Tìm sách"
              rules={[{ required: true, message: "Vui lòng chọn sách!" }]}
            >
              <AutoComplete
                placeholder="Nhập tên sách để tìm kiếm"
                options={bookOptions}
                onSearch={handleBookSearch}
                onSelect={onBookSelect}
                disabled={!studentInfo}
                loading={searchingBook}
                style={{ width: "100%" }}
              />
            </Form.Item>

            {bookInfo && (
              <div className="book-info">
                <h3>Thông tin sách:</h3>
                <p>
                  <strong>Mã sách:</strong> {bookInfo.identifier_code}
                </p>
                <p>
                  <strong>Tên sách:</strong> {bookInfo.title}
                </p>
                <p>
                  <strong>Tác giả:</strong> {bookInfo.author}
                </p>
                <p>
                  <strong>Trạng thái:</strong> {bookInfo.status}
                </p>
              </div>
            )}

            <Form.Item
              name="borrowDate"
              label="Ngày mượn"
              rules={[{ required: true, message: "Vui lòng chọn ngày mượn!" }]}
            >
              <DatePicker
                style={{ width: "100%" }}
                disabled={!studentInfo}
                disabledDate={(current) =>
                  current && current < moment().startOf("day")
                }
              />
            </Form.Item>

            <Form.Item
              name="dueDate"
              label="Ngày trả"
              rules={[{ required: true, message: "Vui lòng chọn ngày trả!" }]}
            >
              <DatePicker
                style={{ width: "100%" }}
                disabled={!studentInfo}
                disabledDate={(current) => {
                  const borrowDate = form.getFieldValue("borrowDate");
                  return (
                    current &&
                    (current < moment().startOf("day") ||
                      (borrowDate && current < borrowDate) ||
                      (borrowDate &&
                        current > borrowDate.clone().add(14, "days")))
                  );
                }}
              />
            </Form.Item>

            <Form.Item>
              <Button
                type="primary"
                htmlType="submit"
                loading={loading}
                disabled={!studentInfo || !bookInfo}
                block
              >
                Xác nhận mượn sách
              </Button>
            </Form.Item>
          </Form>
        </Card>
      )}
    </div>
  );
};

export default BorrowOnBehalf;
