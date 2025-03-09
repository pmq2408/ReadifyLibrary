import React from "react";
import Search from "../../components/Search";
import News from "../../components/News";
import Button from '../../components/Button/Button'
import { useState } from "react";
import SearchResults from "../../components/SearchResult";

function Home() {
  const [searchResults, setSearchResults] = useState([]);

  return (
    <div className="container home">
      <Search setSearchResults={setSearchResults} />

      <SearchResults books={searchResults} />

      {searchResults?.length === 0 && (
        <>
          <News />

          {/* Các phần khác của trang chủ */}
          <div className="container mb-5">
            <div className="row">
              <div className="col-md-6">
                <h2>Video giới thiệu</h2>
                <div className="embed-responsive embed-responsive-16by9">
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
              <div className="col-md-6">
                <div className="library-guide">
                  <h2>Hướng dẫn sử dụng thư viện FPT</h2>
                  <p>
                    Chào mừng bạn đến với thư viện Đại học FPT! Dưới đây là hướng
                    dẫn chi tiết về cách sử dụng các dịch vụ của thư viện.
                  </p>
                  <Button text="Xem thêm" link="/list-rule-user" />
                </div>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
}

export default Home;
