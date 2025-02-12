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
    <>
      <hr style={{ height: "5px" }} />
      <footer className="footer d-flex justify-content-around pt-2" >
        <div>
          <p><strong>FPT UNIVERSITY LIBRARY</strong></p>
          <p><FaLocationArrow /> <span></span>
            Phòng 107 tòa nhà Delta, Trường Đại học FPT, Khu CNC Hòa Lạc,</p>
          <span className="ms-3">Km29 Đại Lộ Thăng Long, Thạch Thất, Hà Nội</span>
          <p className="mt-2"><MdEmail /> <span></span>
            thuvien_fu_hoalac@fpt.edu.vn
          </p>
          <p><FaPhoneAlt />
            <span></span> 02466 805 912
          </p>
        </div>
        <div>
          <h5>FOLLOW US</h5>
          <div className="d-flex justify-content-around fs-4">
            <p><FaFacebook />
            </p>
            <p><FaYoutube /></p>
            <p><FaTwitter /></p>
          </div>

        </div>
        <div>
          <h5>WEBSITE ACCESS STATISTICS
          </h5>
          <p><FaSmile /> Online: 309
          </p>
          <p><FaUser /> Today: 13305
          </p>
          <p><FaCalendarDays /> Yesterday: 21546
          </p>
          <p><MdCalendarMonth /> This month: 166963
          </p>
          <p><MdCalendarMonth /> Last month: 329623
          </p>
          <p><FcStatistics /> All: 7221262
          </p>
        </div>
      </footer>
    </>

  );
}

export default Footer;
