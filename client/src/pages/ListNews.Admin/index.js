import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast, ToastContainer } from "react-toastify";
import ReactPaginate from "react-paginate";
import { Modal, Button } from "react-bootstrap";
import "./index.css";
const ListNews = () => {
  const navigate = useNavigate();
  const [newsData, setNewsData] = useState([]);
  const [message, setMessage] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(5);
  const [showModal, setShowModal] = useState(false);
  const [newsIdToDelete, setNewsIdToDelete] = useState(null);

  useEffect(() => {
    const fetchNews = async () => {
      try {
        const response = await fetch(
          `${process.env.REACT_APP_API_URL}/news/list`
        );
        const data = await response.json();
        setNewsData(data.data);
      } catch (error) {
        console.error("Error fetching news:", error);
        toast.error("Error fetching news");
      }
    };

    fetchNews();
  }, []);

  const handleDelete = async () => {
    try {
      const response = await fetch(
        `${process.env.REACT_APP_API_URL}/news/delete/${newsIdToDelete}`,
        {
          method: "DELETE",
        }
      );
      setNewsData((prevNewsData) =>
        prevNewsData.filter((news) => news._id !== newsIdToDelete)
      );
      toast.success("Xóa tin tức thành công");
    } catch (error) {
      console.error("Error deleting news:", error);
      toast.error("Xóa tin tức thất bại");
    } finally {
      setShowModal(false);
    }
  };

  const handleShowModal = (id) => {
    setNewsIdToDelete(id);
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
  };

  const handleUpdate = (id) => {
    navigate(`/list-news-admin/update-news/${id}`);
  };

  const handleCreateNew = () => {
    navigate("/list-news-admin/create-news");
  };

  const handleDetail = (id) => {
    navigate(`/news/news-detail/${id}`);
  };

  const getLimitedContent = (content, limit = 50) => {
    if (content.length > limit) {
      return content.substring(0, limit) + "...";
    }
    return content;
  };

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const sortedNewsData = [...newsData].sort(
    (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
  );
  const currentItems = sortedNewsData.slice(indexOfFirstItem, indexOfLastItem);

  const totalPages = Math.ceil(newsData.length / itemsPerPage);

  const handlePageClick = (data) => {
    setCurrentPage(data.selected + 1);
  };

  return (
    <div className="list-news-container">
      <ToastContainer />
      <div className="header">
        <h2 className="m-0 text-center" style={{ color: "black" }}>
          Quản lý tin tức
        </h2>
        <button
          className="create-news-button"
          onClick={handleCreateNew}
          title="Tạo tin mới"
        >
          <i className="fa fa-plus me-2" aria-hidden="true"></i>
          Tạo tin mới
        </button>
      </div>

      {message && (
        <div
          className={`alert ${
            message.includes("successfully") ? "alert-success" : "alert-danger"
          }`}
        >
          {message}
        </div>
      )}

      <div className="table-responsive">
        <table className="table">
          <thead>
            <tr>
              <th style={{ width: "5%" }}>#</th>
              <th style={{ width: "15%" }}>Ảnh</th>
              <th style={{ width: "25%" }}>Tiêu đề</th>
              <th style={{ width: "35%" }}>Nội dung</th>
              <th style={{ width: "20%" }}>Hành động</th>
            </tr>
          </thead>
          <tbody>
            {currentItems.length > 0 ? (
              currentItems.map((news, index) => (
                <tr key={news._id}>
                  <td>{(currentPage - 1) * itemsPerPage + index + 1}</td>
                  <td>
                    <img
                      src={`${
                        process.env.REACT_APP_API_URL
                      }/news/thumbnail/${news.thumbnail.split("/").pop()}`}
                      className="news-thumbnail"
                      alt={news.title}
                      loading="lazy"
                    />
                  </td>
                  <td className="text-start">
                    <div className="fw-medium">{news.title}</div>
                  </td>
                  <td className="text-start">
                    <div
                      className="content-preview"
                      dangerouslySetInnerHTML={{
                        __html: getLimitedContent(news.content, 100),
                      }}
                    />
                  </td>
                  <td>
                    <div className="action-buttons">
                      <button
                        className="btn btn-success"
                        onClick={() => handleUpdate(news._id)}
                        title="Cập nhật"
                      >
                        <i className="fa fa-pencil" aria-hidden="true"></i>
                      </button>
                      <button
                        className="btn btn-primary"
                        onClick={() => handleDetail(news._id)}
                        title="Xem chi tiết"
                      >
                        <i className="fa fa-eye" aria-hidden="true"></i>
                      </button>
                      <button
                        className="btn btn-danger"
                        onClick={() => handleShowModal(news._id)}
                        title="Xóa"
                      >
                        <i className="fa fa-trash" aria-hidden="true"></i>
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="5" className="text-center py-4">
                  <div className="text-muted">Không tìm thấy tin tức nào</div>
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      <ReactPaginate
        previousLabel={<i className="fa fa-chevron-left"></i>}
        nextLabel={<i className="fa fa-chevron-right"></i>}
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

      <Modal show={showModal} onHide={handleCloseModal}>
        <Modal.Header closeButton>
          <Modal.Title>Xác nhận xóa</Modal.Title>
        </Modal.Header>
        <Modal.Body>Bạn có chắc chắn muốn xóa tin tức này?</Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleCloseModal}>
            Hủy
          </Button>
          <Button variant="danger" onClick={handleDelete}>
            Xóa
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default ListNews;
