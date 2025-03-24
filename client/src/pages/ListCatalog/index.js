import React, { useEffect, useState, useContext } from "react";
import { Modal, Button } from "react-bootstrap";
import ReactPaginate from "react-paginate";
import AuthContext from "../../contexts/UserContext";
import axios from "axios";
import { toast, ToastContainer } from "react-toastify";

const CatalogList = () => {
  const { user } = useContext(AuthContext);
  const [catalogData, setCatalogData] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [currentCatalogId, setCurrentCatalogId] = useState(null);
  const [newCatalog, setNewCatalog] = useState({
    name: "",
    code: "",
    major: "",
    semester: "",
    isTextbook: 0,
    createdBy: "",
  });
  const [fileSelected, setFileSelected] = useState(null);
  const [filters, setFilters] = useState({
    major: "",
    isTextbook: "",
    semester: "",
  });
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [catalogToDelete, setCatalogToDelete] = useState(null);
  const [selectedCatalogForImport, setSelectedCatalogForImport] = useState(null);

  useEffect(() => {
    const fetchCatalogs = async () => {
      try {
        const response = await fetch("http://localhost:9999/api/catalogs/list");
        if (!response.ok) throw new Error("Failed to fetch catalog data");
        const data = await response.json();
        
        // Sort the data by createdAt in descending order
        const sortedData = data.data.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
        
        setCatalogData(sortedData);
        setFilteredData(sortedData);
      } catch (error) {
        console.error("Error fetching catalog data:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchCatalogs();
  }, []);

  useEffect(() => {
    applyFilters();
  }, [filters, catalogData]);

  const applyFilters = () => {
    const { major, isTextbook, semester } = filters;
    const filtered = catalogData.filter((item) => {
      return (
        (major ? item?.major === major : true) &&
        (isTextbook ? item?.isTextbook?.toString() === isTextbook : true) &&
        (semester ? item?.semester?.toString() === semester : true)
      );
    });
    setFilteredData(filtered);
  };

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters((prevFilters) => ({
      ...prevFilters,
      [name]: value,
    }));
    setCurrentPage(1);
  };

  const handleFileChange = (e, catalogId) => {
    setFileSelected(e.target.files[0]);
    setSelectedCatalogForImport(catalogId);
  };

  const importBookset = async (id) => {
    if (!fileSelected) {
      toast.error("Vui lòng chọn tệp để nhập");
      return;
    }
    try {
      const formData = new FormData();
      formData.append("catalog_id", id);
      formData.append("createdBy", user.id);
      formData.append("file", fileSelected);

      await axios.post(`http://localhost:9999/api/book-sets/import`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      setFileSelected(null);
      toast.success("Thêm thành công!");
    } catch (error) {
      console.error("Error importing bookset:", error);
      toast.error("Có lỗi xảy ra khi nhập tệp.");
    }
  };

  const handleUpdate = (id) => {
    const catalogToUpdate = catalogData.find((catalog) => catalog._id === id);
    setNewCatalog({
      name: catalogToUpdate.name,
      code: catalogToUpdate.code,
      major: catalogToUpdate.major,
      semester: catalogToUpdate.semester,
      isTextbook: catalogToUpdate.isTextbook,
      createdBy: user.id,
    });
    setCurrentCatalogId(id);
    setIsEditMode(true);
    setShowModal(true);
  };

  const handleDelete = (id) => {
    setCatalogToDelete(id);
    setShowDeleteModal(true);
  };

  const confirmDelete = async () => {
    try {
      const response = await fetch(`http://localhost:9999/api/catalogs/delete/${catalogToDelete}`, {
        method: "DELETE",
      });
      if (!response.ok) throw new Error(`Failed to delete catalog: ${response.statusText}`);
      setCatalogData((prevCatalogs) => prevCatalogs.filter((catalog) => catalog._id !== catalogToDelete));
    } catch (error) {
      console.error("Error deleting catalog:", error);
    } finally {
      setShowDeleteModal(false);
      setCatalogToDelete(null);
    }
  };

  const handleCreateNewCatalog = () => {
    setNewCatalog({ name: "", code: "", major: "", semester: "", isTextbook: 0, createdBy: user.id });
    setIsEditMode(false);
    setShowModal(true);
  };

  const handleSubmitCatalog = async (e) => {
    e.preventDefault();
    const endpoint = isEditMode
      ? `http://localhost:9999/api/catalogs/update/${currentCatalogId}`
      : "http://localhost:9999/api/catalogs/create";
    const method = isEditMode ? "PUT" : "POST";

    try {
      const response = await fetch(endpoint, {
        method: method,
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(newCatalog),
      });
      const responseData = await response.json();
      if (!response.ok) {
        throw new Error(responseData.message || `Failed to ${isEditMode ? "update" : "create"} catalog`);
      }
      const savedCatalog = responseData;
      if (isEditMode) {
        setCatalogData((prevData) =>
          prevData.map((catalog) => (catalog._id === currentCatalogId ? savedCatalog : catalog))
        );
      } else {
        setCatalogData([...catalogData, savedCatalog]);
      }
      setShowModal(false);
      setNewCatalog({ name: "", code: "", major: "", semester: "", isTextbook: 0, createdBy: user.id });
      toast.success(responseData.message || "Cập nhật thành công");
    } catch (error) {
      console.error(`Error ${isEditMode ? "updating" : "creating"} catalog:`, error);
      toast.error(error.message);
    }
  };

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setNewCatalog((prevCatalog) => ({
      ...prevCatalog,
      [name]: type === "checkbox" ? (checked ? 1 : 0) : value,
    }));
  };

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredData.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(filteredData.length / itemsPerPage);

  const handlePageChange = (selectedPage) => {
    setCurrentPage(selectedPage.selected + 1);
  };

  return (
    <div className="container mt-4">
      <ToastContainer />
      <div className="d-flex justify-content-between my-3 row">
        <div className="col-10 d-flex">
          <select
            name="major"
            value={filters.major}
            onChange={handleFilterChange}
            className="form-select mx-1"
          >
            <option value="">Tất cả chuyên ngành</option>
            <option value="SE">Công nghệ thông tin</option>
            <option value="KT">Cơ khí</option>
          </select>

          <select
            name="isTextbook"
            value={filters.isTextbook}
            onChange={handleFilterChange}
            className="form-select mx-1"
          >
            <option value="">Tất cả loại</option>
            <option value="1">Sách giáo trình</option>
            <option value="0">Sách tham khảo</option>
          </select>

          <select
            name="semester"
            value={filters.semester}
            onChange={handleFilterChange}
            className="form-select mx-1"
          >
            <option value="">Tất cả học kỳ</option>
            {[...Array(9).keys()].map((_, i) => (
              <option key={i + 1} value={i + 1}>{i + 1}</option>
            ))}
          </select>
        </div>
        <div className="col-2 d-flex justify-content-end">
          <button className="btn btn-primary" title="Tạo mới" onClick={handleCreateNewCatalog}>
            <i className="fa fa-plus" aria-hidden="true"></i>
          </button>
        </div>
      </div>

      {loading ? (
        <div>Đang tải dữ liệu...</div>
      ) : (
        <table className="table table-bordered mt-4">
          <thead>
            <tr>
              <th>ID</th>
              <th>Tên loại sách</th>
              <th>Mã loại sách</th>
              <th>Chuyên ngành</th>
              <th>Học kỳ</th>
              <th>Sách giáo khoa</th>
              <th>Hành động</th>
            </tr>
          </thead>
          <tbody>
            {currentItems.length > 0 ? (
              currentItems.map((catalog, index) => (
                <tr key={catalog._id}>
                  <td>{index + 1}</td>
                  <td>{catalog.name}</td>
                  <td>{catalog.code}</td>
                  <td>{catalog.major}</td>
                  <td>{catalog.semester}</td>
                  <td>{catalog.isTextbook ? "Yes" : "No"}</td>
                  <td>
                    <input
                      type="file"
                      accept=".csv, .xlsx"
                      onChange={(e) => handleFileChange(e, catalog._id)}
                      style={{ display: "none" }}
                      id={`file-input-${catalog._id}`}
                    />
                    <button
                      className="btn btn-primary mr-2"
                      title="Nhập"
                      onClick={() => document.getElementById(`file-input-${catalog._id}`).click()}
                    >
                      <i className="fa fa-upload" aria-hidden="true"></i>
                    </button>
                    {fileSelected && selectedCatalogForImport === catalog._id && (
                      <button
                        className="btn btn-primary mr-2"
                        onClick={() => importBookset(catalog._id)}
                      >
                        Import
                      </button>
                    )}
                    <button
                      className="btn btn-success mr-2"
                      title="Sửa"
                      onClick={() => handleUpdate(catalog._id)}
                      style={{ marginLeft: "10px" }}
                    >
                      <i className="fa fa-pencil-square-o" aria-hidden="true"></i>
                    </button>
                    <button
                      className="btn btn-danger"
                      title="Xóa"
                      onClick={() => handleDelete(catalog._id)}
                      style={{ marginLeft: "10px" }}
                    >
                      <i className="fa fa-trash" aria-hidden="true"></i>
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="7" className="text-center">
                  Không có dữ liệu
                </td>
              </tr>
            )}
          </tbody>
        </table>
      )}
      <div className="pagination float-end mb-4">
        {filteredData.length > 10 && (
          <ReactPaginate
            previousLabel={"<"}
            nextLabel={">"}
            breakLabel={"..."}
            pageCount={totalPages}
            marginPagesDisplayed={2}
            pageRangeDisplayed={5}
            onPageChange={handlePageChange}
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
      </div>

      {/* Modal for creating or updating catalog */}
      <Modal show={showModal} onHide={() => setShowModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>{isEditMode ? "Cập nhật" : "Tạo mới"}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <form onSubmit={handleSubmitCatalog}>
            <div className="form-group">
              <label htmlFor="name">Tên sách</label>
              <input
                type="text"
                className="form-control"
                id="name"
                name="name"
                value={newCatalog.name}
                onChange={handleInputChange}
                required
              />
            </div>
            <div className="form-group">
              <label htmlFor="code">Mã sách</label>
              <input
                type="number"
                className="form-control"
                id="code"
                name="code"
                value={newCatalog.code}
                onChange={handleInputChange}
                required
              />
            </div>
            <div className="form-group" style={{ display: "flex", alignItems: "center", margin: "10px" }}>
              <label htmlFor="isTextbook" style={{ marginRight: "10px" }}>Sách giáo trình</label>
              <input
                type="checkbox"
                id="isTextbook"
                name="isTextbook"
                checked={newCatalog.isTextbook === 1}
                onChange={handleInputChange}
              />
            </div>
            {newCatalog.isTextbook === 1 && (
              <>
                <div className="form-group">
                  <label htmlFor="major">Chuyên ngành</label>
                  <select
                    name="major"
                    value={newCatalog.major}
                    onChange={handleInputChange}
                    className="form-select"
                    required
                  >
                    <option value="">Chọn chuyên ngành</option>
                    <option value="SE">Công nghệ thông tin</option>
                    <option value="KT">Cơ khí</option>
                  </select>
                </div>
                <div className="form-group">
                  <label htmlFor="semester">Học kỳ</label>
                  <select
                    name="semester"
                    value={newCatalog.semester}
                    onChange={handleInputChange}
                    className="form-select"
                    required
                  >
                    <option value="">Chọn học kỳ</option>
                    {[...Array(9).keys()].map((_, i) => (
                      <option key={i + 1} value={i + 1}>{i + 1}</option>
                    ))}
                  </select>
                </div>
              </>
            )}
            <Button className="mt-3" variant="primary" type="submit">
              {isEditMode ? "Cập nhật" : "Lưu"}
            </Button>
          </form>
        </Modal.Body>
      </Modal>

      <Modal show={showDeleteModal} onHide={() => setShowDeleteModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Xác nhận xóa</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          Bạn có chắc chắn muốn xóa danh mục này không?
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowDeleteModal(false)}>
            Hủy
          </Button>
          <Button variant="danger" onClick={confirmDelete}>
            Xóa
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default CatalogList;
