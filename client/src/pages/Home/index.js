import React, { useState, useEffect } from "react";
import Search from "../../components/Search";
import News from "../../components/News";
import Button from "../../components/Button/Button";
import SearchResults from "../../components/SearchResult";
import {
  FaBook,
  FaVideo,
  FaInfoCircle,
  FaArrowRight,
  FaSearch,
} from "react-icons/fa";
import "./Home.scss";

function Home() {
  const [searchResults, setSearchResults] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Giả lập thời gian tải trang
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 800);

    return () => clearTimeout(timer);
  }, []);

  if (isLoading) {
    return (
      <div className="page-loader">
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="home-page">
      <div className="hero-section">
        <div className="container">
          <div className="hero-content">
            <h1 className="hero-title">Thư viện FPT University</h1>
            <p className="hero-subtitle">
              Khám phá kho tàng tri thức với hàng nghìn đầu sách và tài liệu học
              tập
            </p>
            <div className="hero-search">
              <Search setSearchResults={setSearchResults} />
            </div>
          </div>
        </div>
      </div>

      {!searchResults.length ? (
        <>
          <section className="features-section">
            <div className="container">
              <div className="row">
                <div className="col-md-4 mb-4">
                  <div className="feature-card">
                    <div className="feature-icon">
                      <FaBook />
                    </div>
                    <h3>Kho sách phong phú</h3>
                    <p>
                      Hơn 10,000 đầu sách và tài liệu học tập đa dạng lĩnh vực
                    </p>
                  </div>
                </div>
                <div className="col-md-4 mb-4">
                  <div className="feature-card">
                    <div className="feature-icon">
                      <FaSearch />
                    </div>
                    <h3>Tìm kiếm dễ dàng</h3>
                    <p>
                      Hệ thống tìm kiếm thông minh giúp bạn nhanh chóng tìm thấy
                      tài liệu cần thiết
                    </p>
                  </div>
                </div>
                <div className="col-md-4 mb-4">
                  <div className="feature-card">
                    <div className="feature-icon">
                      <FaInfoCircle />
                    </div>
                    <h3>Hỗ trợ 24/7</h3>
                    <p>
                      Đội ngũ thủ thư luôn sẵn sàng hỗ trợ bạn mọi lúc mọi nơi
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </section>

          <section className="news-section">
            <div className="container">
              <News />
            </div>
          </section>

          <section className="content-section">
            <div className="container">
              <div className="row align-items-center">
                <div className="col-lg-6 mb-4 mb-lg-0">
                  <div className="video-container">
                    <h2 className="section-title">
                      <FaVideo className="section-icon" />
                      Video giới thiệu
                    </h2>
                    <div className="video-wrapper">
                      <iframe
                        width="100%"
                        height="315"
                        src="https://www.youtube.com/embed/gDG3lA2XVuE"
                        title="YouTube video player"
                        frameBorder="0"
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                        allowFullScreen
                      ></iframe>
                    </div>
                  </div>
                </div>
                <div className="col-lg-6">
                  <div className="library-guide">
                    <h2 className="section-title">
                      <FaInfoCircle className="section-icon" />
                      Hướng dẫn sử dụng thư viện
                    </h2>
                    <p className="guide-text">
                      Chào mừng bạn đến với thư viện Đại học FPT! Thư viện của
                      chúng tôi cung cấp nhiều dịch vụ và tài nguyên để hỗ trợ
                      việc học tập và nghiên cứu của bạn.
                    </p>
                    <ul className="guide-list">
                      <li>Quy trình mượn và trả sách</li>
                      <li>Cách tìm kiếm tài liệu hiệu quả</li>
                      <li>Sử dụng không gian học tập</li>
                      <li>Truy cập cơ sở dữ liệu trực tuyến</li>
                    </ul>
                    <div className="guide-button">
                      <Button
                        text="Xem hướng dẫn chi tiết"
                        link="/list-rule-user"
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </section>

          <section className="cta-section">
            <div className="container">
              <div className="cta-content">
                <h2>Bạn cần hỗ trợ?</h2>
                <p>Đội ngũ thủ thư của chúng tôi luôn sẵn sàng giúp đỡ bạn</p>
                <Button text="Liên hệ ngay" link="/contact" />
              </div>
            </div>
          </section>
        </>
      ) : (
        <div className="search-results-section">
          <div className="container">
            <div className="search-results-header">
              <h2>Kết quả tìm kiếm</h2>
              <button
                className="clear-search-btn"
                onClick={() => setSearchResults([])}
              >
                Quay lại trang chủ
              </button>
            </div>
            <SearchResults books={searchResults} />
          </div>
        </div>
      )}
    </div>
  );
}

export default Home;
