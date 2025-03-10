import React, { useState, useEffect } from "react";
import axios from "axios";

const AdvancedBookForm = ({ setSearchResults }) => {
  const [catalog, setCatalog] = useState("");
  const [catalogData, setCatalogData] = useState([]);
  const [bookName, setBookName] = useState("");
  const [author, setAuthor] = useState("");
  const [publisher, setPublisher] = useState("");
  const [publicationYear, setPublicationYear] = useState("");
  const [semester, setSemester] = useState("");
  const [subject, setSubject] = useState("");

  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      const response = await axios.get(`${process.env.REACT_APP_API_URL}/book-sets/list`, {
        params: {
          title: bookName,
          author,
          publisher,
          pubYear: publicationYear,
          catalog_id: catalog,
          isTextbook: subject,
        },
      });
      setSearchResults(response.data.data);
    } catch (error) {
      console.error("Error fetching book sets", error);
    }
  };

  useEffect(() => {
    const fetchCatalogs = async () => {
      try {
        const response = await axios.get(`${process.env.REACT_APP_API_URL}/catalogs/list`, {
          params: subject === "1" ? { isTextbook: subject, semester } : {},
        });
        setCatalogData(response.data.data);
      } catch (error) {
        console.error("Error fetching catalog data:", error);
      }
    };
    fetchCatalogs();
  }, [subject, semester]);

  return (
    <div className="advanced-book-form container">
      <form onSubmit={handleSubmit}>
        <h4 className="text-center mb-4">Tìm kiếm sách nâng cao</h4>
        <div className="row g-3">
          {/* Môn học */}
          <div className="col-md-6">
            <select
              className="form-select"
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
            >
              <option value="">Chọn môn học</option>
              <option value="0">Sách tham khảo</option>
              <option value="1">Sách giáo trình</option>
            </select>
          </div>

          {/* Học kỳ */}
          <div className="col-md-6">
            <select
              className="form-select"
              value={semester}
              onChange={(e) => setSemester(e.target.value)}
              disabled={subject !== "1"}
            >
              <option value="">Chọn học kỳ</option>
              {[...Array(9)].map((_, i) => (
                <option key={i + 1} value={i + 1}>Học kỳ {i + 1}</option>
              ))}
            </select>
          </div>

          {/* Bộ sách */}
          <div className="col-12">
            <select
              className="form-select"
              value={catalog}
              onChange={(e) => setCatalog(e.target.value)}
            >
              <option value="">Chọn bộ sách</option>
              {catalogData.map((item) => (
                <option key={item._id} value={item._id}>{item.name}</option>
              ))}
            </select>
          </div>
        </div>

        <hr />

        {/* Tên sách */}
        <div className="form-floating mb-3">
          <input
            type="text"
            className="form-control"
            id="book-name"
            placeholder="Tên sách"
            value={bookName}
            onChange={(e) => setBookName(e.target.value)}
          />
          <label htmlFor="book-name">Tên sách</label>
        </div>

        {/* Tác giả */}
        <div className="form-floating mb-3">
          <input
            type="text"
            className="form-control"
            id="author"
            placeholder="Tác giả"
            value={author}
            onChange={(e) => setAuthor(e.target.value)}
          />
          <label htmlFor="author">Tác giả</label>
        </div>

        <div className="row g-3">
          {/* Nhà xuất bản */}
          <div className="col-md-6">
            <div className="form-floating">
              <input
                type="text"
                className="form-control"
                id="publisher"
                placeholder="Nhà xuất bản"
                value={publisher}
                onChange={(e) => setPublisher(e.target.value)}
              />
              <label htmlFor="publisher">Nhà xuất bản</label>
            </div>
          </div>

          {/* Năm xuất bản */}
          <div className="col-md-6">
            <div className="form-floating">
              <input
                type="date"
                className="form-control"
                id="publication-year"
                value={publicationYear}
                onChange={(e) => setPublicationYear(e.target.value)}
              />
              <label htmlFor="publication-year">Năm xuất bản</label>
            </div>
          </div>
        </div>

        <hr />

        {/* Nút tìm kiếm */}
        <div className="text-center">
          <button type="submit" className="btn btn-primary mt-3 w-100">
            Tìm kiếm
          </button>
        </div>
      </form>
    </div>
  );
};

export default AdvancedBookForm;
