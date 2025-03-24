import React from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import "./Footer.scss";
import { MdEmail } from "react-icons/md";
import { FaLocationArrow } from "react-icons/fa6";
import { FaPhoneAlt } from "react-icons/fa";
import { FaFacebook } from "react-icons/fa";
import { FaYoutube } from "react-icons/fa";
import { FaTwitter } from "react-icons/fa";
import { FaSmile } from "react-icons/fa";
import { FaUser } from "react-icons/fa";
import { FaCalendarDays } from "react-icons/fa6";
import { MdCalendarMonth } from "react-icons/md";
import { FcStatistics } from "react-icons/fc";

function Footer() {
  return (
    <footer className="footer py-4 mt-5">
      <div className="container">
        <div className="row">
          <div className="col-lg-4 mb-4 mb-lg-0">
            <h4 className="footer-title">FPT UNIVERSITY LIBRARY</h4>
            <ul className="footer-contact">
              <li>
                <FaLocationArrow className="footer-icon" />
                <div>
                  <p className="mb-0">
                    Phòng 107 tòa nhà Delta, Trường Đại học FPT,
                  </p>
                  <p className="mb-0">
                    Khu CNC Hòa Lạc, Km29 Đại Lộ Thăng Long,
                  </p>
                  <p className="mb-0">Thạch Thất, Hà Nội</p>
                </div>
              </li>
              <li>
                <MdEmail className="footer-icon" />
                <p className="mb-0">thuvien_fu_hoalac@fpt.edu.vn</p>
              </li>
              <li>
                <FaPhoneAlt className="footer-icon" />
                <p className="mb-0">02466 805 912</p>
              </li>
            </ul>
          </div>

          <div className="col-lg-4 mb-4 mb-lg-0">
            <h4 className="footer-title">FOLLOW US</h4>
            <div className="social-icons">
              <a
                href="https://www.facebook.com/FPTU.HCM"
                target="_blank"
                rel="noopener noreferrer"
                className="social-icon"
              >
                <FaFacebook />
              </a>
              <a
                href="https://www.youtube.com/channel/UCfNrlxNgcTZDJ3jZeSSSJxg"
                target="_blank"
                rel="noopener noreferrer"
                className="social-icon"
              >
                <FaYoutube />
              </a>
              <a
                href="https://twitter.com/fptu_hcm"
                target="_blank"
                rel="noopener noreferrer"
                className="social-icon"
              >
                <FaTwitter />
              </a>
            </div>

            <div className="mt-4">
              <h5 className="footer-subtitle">OPENING HOURS</h5>
              <p className="mb-1">
                <strong>Weekdays:</strong> 08:15 - 21:00
              </p>
              <p className="mb-1">
                <strong>Weekend:</strong> 08:00 - 12:00 & 13:00 - 17:00
              </p>
            </div>
          </div>

          <div className="col-lg-4">
            <h4 className="footer-title">WEBSITE STATISTICS</h4>
            <div className="stats-container">
              <div className="stat-item">
                <FaSmile className="stat-icon" />
                <div>
                  <p className="stat-label">Online</p>
                  <p className="stat-value">309</p>
                </div>
              </div>
              <div className="stat-item">
                <FaUser className="stat-icon" />
                <div>
                  <p className="stat-label">Today</p>
                  <p className="stat-value">13,305</p>
                </div>
              </div>
              <div className="stat-item">
                <FaCalendarDays className="stat-icon" />
                <div>
                  <p className="stat-label">Yesterday</p>
                  <p className="stat-value">21,546</p>
                </div>
              </div>
              <div className="stat-item">
                <MdCalendarMonth className="stat-icon" />
                <div>
                  <p className="stat-label">This month</p>
                  <p className="stat-value">166,963</p>
                </div>
              </div>
              <div className="stat-item">
                <FcStatistics className="stat-icon" />
                <div>
                  <p className="stat-label">All time</p>
                  <p className="stat-value">7,221,262</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="footer-bottom mt-4 pt-3">
          <p className="text-center mb-0">
            © {new Date().getFullYear()} FPT University Library. All rights
            reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
