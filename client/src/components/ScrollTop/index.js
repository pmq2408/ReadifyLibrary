import React, { useState, useEffect } from "react";
import { Button } from "react-bootstrap";

function ScrollTop() {
  const [isVisible, setIsVisible] = useState(false);
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [accessToken, setAccessToken] = useState(null);

  useEffect(() => {
    // Lấy token từ localStorage
    const token = localStorage.getItem("accessToken");
    setAccessToken(token);
  }, []);

  // Hàm cuộn lên đầu trang
  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  // Theo dõi vị trí cuộn để hiển thị nút cuộn lên
  useEffect(() => {
    const toggleVisibility = () => {
      setIsVisible(window.pageYOffset > 100);
    };

    window.addEventListener("scroll", toggleVisibility);
    return () => window.removeEventListener("scroll", toggleVisibility);
  }, []);

  return (
    <div>
      {/* Nút cuộn lên (chỉ hiện khi cuộn qua 100px) */}
      {isVisible && (
        <Button
          onClick={scrollToTop}
          variant="primary"
          className="position-fixed"
          style={{
            bottom: "20px",
            right: "80px",
            zIndex: "1000",
            borderRadius: "50%",
            width: "50px",
            height: "50px",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            opacity: "0.8",
          }}
        >
          <i className="fa fa-arrow-up"></i>
        </Button>
      )}

      {/* Nút mở chat (chỉ hiển thị nếu có token) */}
      {accessToken && (
        <>
          <Button
            onClick={() => setIsChatOpen(!isChatOpen)}
            variant="success"
            className="position-fixed"
            style={{
              bottom: "20px",
              right: "20px",
              zIndex: "1000",
              borderRadius: "50%",
              width: "50px",
              height: "50px",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <i className="fa fa-comments"></i>
          </Button>

          {/* Khung chat */}
          {isChatOpen && (
            <div
              className="position-fixed"
              style={{
                bottom: "80px",
                right: "20px",
                width: "350px",
                height: "450px",
                background: "white",
                boxShadow: "0px 4px 6px rgba(0, 0, 0, 0.1)",
                borderRadius: "10px",
                overflow: "hidden",
                zIndex: "1000",
              }}
            >
              <iframe
                title="Copilot Chat"
                src="https://Copilot1-znQ8EK.ai.copilot.live"
                style={{ width: "100%", height: "100%", border: "none" }}
                loading="lazy"
                allow="microphone; camera; speaker; clipboard-read; clipboard-write; geolocation;"
              ></iframe>
            </div>
          )}
        </>
      )}
    </div>
  );
}

export default ScrollTop;
