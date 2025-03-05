import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { FaUsersCog } from "react-icons/fa";
import { useAuth } from '../../Aucontext/Aucontext'; // Import useAuth để kiểm tra trạng thái đăng nhập
import './Header.css';

export const Header = () => {
    const [isDropdownVisible, setIsDropdownVisible] = useState(false);
    const { user, logout } = useAuth(); // Lấy thông tin user và hàm logout

    const toggleDropdown = () => {
        setIsDropdownVisible(!isDropdownVisible);
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

                <div className="header-icons">
                    <div className="profile-container">
                        <div className="profile-dropdown">
                            <p className="text-3xl cursor-pointer" onClick={toggleDropdown}>
                                <FaUsersCog />
                            </p>
                            {isDropdownVisible && (
                                <div className="dropdown-content">
                                    {user ? (
                                        <>
                                            <Link to="/profile">
                                                <button>Thông tin cá nhân</button>
                                            </Link>
                                            <button onClick={logout}>Đăng xuất</button>
                                        </>
                                    ) : (
                                        <Link to="/login">
                                            <button>Đăng nhập</button>
                                        </Link>
                                    )}
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </header>
            <hr style={{ height: "5px", color: 'black' }} className='mt-6' />
        </div>
    );
};
