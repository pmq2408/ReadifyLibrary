import React, { useState, useEffect } from 'react';
import './Header.css';
import { FaUserCog, FaUsersCog } from "react-icons/fa";
import { Link } from 'react-router-dom';

export const Header = () => {
    const [isDropdownVisible, setIsDropdownVisible] = useState(false); // State to toggle dropdown
    const toggleDropdown = () => {
        setIsDropdownVisible(!isDropdownVisible); // Toggle dropdown visibility
    };
    return (
        <div>
            <header className="header">
                <div className="logo" style={{ cursor: 'pointer' }}>
                    <img src="https://library.fpt.edu.vn/Uploads/HN/images/opac-logo/logo.png" alt="Logo" />
                </div>
                <div className="mt-2">
                    <h1 className='text-4xl font-bold'>Welcome to <strong style={{
                        color: "#f3030f", fontWeight: "700", fontSize: "40px", lineHeight: "60px"
                    }}>FPTU Library</strong></h1>
                    <p className='mt-3'><strong style={{ color: "black" }}>Open: 08:15 - 21:00 Weekday | 08:00 - 12:00 & 13:00 - 17:00 Weekend</strong></p>
                </div>

                <div>
                    <h6 style={{
                        color: "#0870b7", fontWeight: "bold"
                    }}>Vietnamese | Login</h6>
                </div>
                <div className="header-icons" >
                    <div className="profile-container">
                        <div className="profile-dropdown">
                            <p
                                className="text-3xl cursor-pointer"
                                onClick={toggleDropdown}
                            ><FaUsersCog /></p>
                            {isDropdownVisible && (
                                <div className="dropdown-content">
                                    
                                        <Link to="/profile">
                                        <button>Thông tin cá nhân</button>
                                        </Link>
                                        
                                    <button>Đăng xuất</button>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </header>
            <hr style={{ height: "5px", color: 'black' }} className='mt-6' />
        </div>
    )
}
