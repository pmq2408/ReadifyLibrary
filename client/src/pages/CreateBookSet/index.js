import React, { useState, useEffect, useContext } from "react";
import { Modal, Button } from "react-bootstrap";
import axios from "axios";
import AuthContext from "../../contexts/UserContext";
import { toast } from "react-toastify";
import ReactPaginate from "react-paginate";
import { useNavigate } from "react-router-dom";

const CreateBookSet = () => {
  const navigate = useNavigate();
  const { user } = useContext(AuthContext);
  const [catalogData, setCatalogData] = useState([]);
  const [image, setImage] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    catalog_id: "",
    isbn: "",
    code: "",
    shelfLocationCode: "",
    title: "",
    author: "",
    publishedYear: new Date().toISOString().split("T")[0],
    publisher: "",
    physicalDescription: "",
    totalCopies: "",
    price: "",
    createdBy: user?.id || "",
  });

  // Fetch catalogs when component mounts
  useEffect(() => {
    const fetchCatalogs = async () => {
      try {
        const response = await axios.get(
          "https://readifylibrary.onrender.com/api/catalogs/list"
        );
        setCatalogData(response.data.data);
      } catch (error) {
        console.error("Error fetching catalog data:", error);
        toast.error("Không thể lấy danh sách danh mục");
      }
    };
    fetchCatalogs();
  }, []);

  // Handle form input changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({ ...prevData, [name]: value }));
  };

  // Handle image selection
  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImage(file);
      setImagePreview(URL.createObjectURL(file));
    }
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    // Create FormData object for multipart/form-data submission
    const data = new FormData();
    Object.keys(formData).forEach((key) => {
      data.append(key, formData[key]);
    });

    if (image) {
      data.append("image", image);
    }

    try {
      const response = await axios.post(
        "https://readifylibrary.onrender.com/api/book-sets/create",
        data,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );
      toast.success(response.data.message || "Tạo bộ sách thành công");
      setTimeout(() => {
        navigate("/list-book-set");
      }, 1000);
    } catch (error) {
      console.error("Error creating book set:", error);
      toast.error(error.response?.data?.message || "Không thể tạo bộ sách");
    } finally {
      setLoading(false);
    }
  };

  // Reset form handler
  const handleReset = () => {
    setFormData({
      catalog_id: "",
      isbn: "",
      code: "",
      shelfLocationCode: "",
      title: "",
      author: "",
      publishedYear: new Date().toISOString().split("T")[0],
      publisher: "",
      physicalDescription: "",
      totalCopies: "",
      price: "",
      createdBy: user?.id || "",
    });
    setImage(null);
    setImagePreview(null);
  };

  return (
    <div className="container">
      <h1 className="my-4 text-center">Tạo bộ sách mới</h1>
      <form onSubmit={handleSubmit}>
        {/* Image Preview and Form Layout */}
        <div className="row">
          {/* Left Column - Image */}
          <div className="col-md-3">
            <div className="border p-3 text-center mb-3">
              {imagePreview ? (
                <img
                  src={imagePreview}
                  alt="Book Preview"
                  className="img-fluid mb-3"
                  style={{
                    maxWidth: "100%",
                    maxHeight: "200px",
                    objectFit: "contain",
                  }}
                />
              ) : (
                <div
                  className="d-flex justify-content-center align-items-center bg-light"
                  style={{ height: "200px", width: "100%" }}
                >
                  <span className="text-muted">Chưa có ảnh</span>
                </div>
              )}
              <div className="mb-3">
                <label htmlFor="imageUpload" className="form-label">
                  Hình ảnh sách
                </label>
                <input
                  type="file"
                  className="form-control"
                  id="imageUpload"
                  accept="image/*"
                  onChange={handleImageChange}
                />
              </div>
            </div>
          </div>

          {/* Right Column - Form Fields */}
          <div className="col-md-9">
            <div className="row">
              {/* Catalog Selection */}
              <div className="col-md-6">
                <div className="mb-3">
                  <label htmlFor="catalog_id" className="form-label">
                    Danh mục:
                  </label>
                  <select
                    className="form-select"
                    name="catalog_id"
                    id="catalog_id"
                    value={formData.catalog_id}
                    onChange={handleInputChange}
                    required
                  >
                    <option value="">Chọn danh mục</option>
                    {catalogData.map((catalog) => (
                      <option key={catalog._id} value={catalog._id}>
                        {catalog.name}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Form Fields */}
              {[
                {
                  label: "ISBN",
                  id: "isbn",
                  type: "text",
                  placeholder: "Nhập mã ISBN",
                },
                {
                  label: "Giá",
                  id: "price",
                  type: "number",
                  placeholder: "Nhập giá sách",
                },
                {
                  label: "Mã sách",
                  id: "code",
                  type: "text",
                  placeholder: "Nhập mã sách",
                },
                {
                  label: "Tên sách",
                  id: "title",
                  type: "text",
                  placeholder: "Nhập tên sách",
                },
                {
                  label: "Tác giả",
                  id: "author",
                  type: "text",
                  placeholder: "Nhập tên tác giả",
                },
                { label: "Năm xuất bản", id: "publishedYear", type: "date" },
                {
                  label: "Nhà xuất bản",
                  id: "publisher",
                  type: "text",
                  placeholder: "Nhập tên nhà xuất bản",
                },
                {
                  label: "Mô tả sách",
                  id: "physicalDescription",
                  type: "text",
                  placeholder: "Nhập mô tả sách",
                },
                {
                  label: "Mã kệ sách",
                  id: "shelfLocationCode",
                  type: "text",
                  placeholder: "Nhập mã kệ sách",
                },
                {
                  label: "Số lượng",
                  id: "totalCopies",
                  type: "number",
                  placeholder: "Nhập số lượng sách",
                },
              ].map(({ label, id, type, placeholder }) => (
                <div className="mb-3 col-md-6" key={id}>
                  <label htmlFor={id} className="form-label">
                    {label}:
                  </label>
                  <input
                    type={type}
                    className="form-control"
                    id={id}
                    name={id}
                    placeholder={placeholder}
                    value={formData[id] || ""}
                    onChange={handleInputChange}
                    required
                  />
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Form Buttons */}
        <div className="d-flex justify-content-center align-items-center mt-3 gap-3">
          <button
            type="button"
            className="btn btn-secondary"
            onClick={handleReset}
          >
            Làm mới
          </button>
          <button type="submit" className="btn btn-primary" disabled={loading}>
            {loading ? (
              <>
                <span
                  className="spinner-border spinner-border-sm me-2"
                  role="status"
                  aria-hidden="true"
                ></span>
                Đang xử lý...
              </>
            ) : (
              "Tạo bộ sách"
            )}
          </button>
        </div>
      </form>
    </div>
  );
};

export default CreateBookSet;
