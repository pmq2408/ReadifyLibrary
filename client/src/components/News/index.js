import React, { useEffect, useState } from "react";
import Button from "../Button/Button";
import { useNavigate } from "react-router-dom";
import "./News.scss";
import { FaNewspaper, FaCalendarAlt, FaArrowRight } from "react-icons/fa";

function News() {
  const [newsItems, setNewsItems] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchNews = async () => {
      setIsLoading(true);
      try {
        const response = await fetch(
          `${process.env.REACT_APP_API_URL}/news/list`
        );
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }
        const data = await response.json();
        setNewsItems(data.data);
      } catch (error) {
        console.error("Error fetching news:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchNews();
  }, []);

  const handleClick = (id) => {
    navigate(`/news/news-detail/${id}`);
  };

  const formatDate = (dateString) => {
    const options = { year: "numeric", month: "long", day: "numeric" };
    return new Date(dateString).toLocaleDateString("vi-VN", options);
  };

  // Check if the news item is less than 3 days old
  const isNewItem = (createdAt) => {
    const newsDate = new Date(createdAt);
    const today = new Date();
    const diffTime = Math.abs(today - newsDate);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays <= 3;
  };

  // Strip HTML tags for preview
  const stripHtml = (html) => {
    const tmp = document.createElement("DIV");
    tmp.innerHTML = html;
    return tmp.textContent || tmp.innerText || "";
  };

  return (
    <div className="news-section">
      <div className="container">
        <div className="news-header">
          <div className="news-title">
            <FaNewspaper className="news-icon" />
            <h2>Tin tức thư viện</h2>
          </div>
          <p className="news-subtitle">
            Cập nhật những thông tin mới nhất từ thư viện FPT
          </p>
        </div>

        {isLoading ? (
          <div className="news-loading">
            <div className="spinner-border text-primary" role="status">
              <span className="visually-hidden">Loading...</span>
            </div>
            <p>Đang tải tin tức...</p>
          </div>
        ) : (
          <>
            <div className="news-grid">
              {Array.isArray(newsItems) && newsItems.length > 0 ? (
                newsItems.slice(-3).map((item) => (
                  <div
                    key={item._id}
                    className="news-card"
                    onClick={() => handleClick(item._id)}
                  >
                    <div className="news-card-image">
                      <img
                        src={`${
                          process.env.REACT_APP_API_URL
                        }/news/thumbnail/${item.thumbnail.split("/").pop()}`}
                        alt={item.title}
                      />
                      {isNewItem(item.createdAt) && (
                        <div className="news-tag">Mới</div>
                      )}
                    </div>
                    <div className="news-card-content">
                      <div className="news-date">
                        <FaCalendarAlt /> {formatDate(item.createdAt)}
                      </div>
                      <h3 className="news-card-title">{item.title}</h3>
                      <p className="news-card-excerpt">
                        {stripHtml(item.content).substring(0, 120)}
                        {stripHtml(item.content).length > 120 ? "..." : ""}
                      </p>
                      <div className="news-card-footer">
                        <span className="read-more">
                          Đọc tiếp <FaArrowRight />
                        </span>
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <div className="news-empty">
                  <p>Không có tin tức nào.</p>
                </div>
              )}
            </div>

            {newsItems.length > 3 && (
              <div className="news-footer">
                <button
                  className="view-more-btn"
                  onClick={() => navigate("/news")}
                >
                  Xem tất cả tin tức <FaArrowRight />
                </button>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}

export default News;
