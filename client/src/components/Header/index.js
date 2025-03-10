import React, { useContext, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify'; // Import toast
import AuthContext from '../../contexts/UserContext';
import './Header.scss';

function Header() {
    const { user, logout } = useContext(AuthContext); // Use context for user info
    const navigate = useNavigate();
    const [isDropdownVisible, setIsDropdownVisible] = useState(false); // State to toggle dropdown

    // Hide dropdown initially when the user logs in
    useEffect(() => {
        setIsDropdownVisible(false);
    }, [user]);

    const handleLogout = () => {
        logout(); // Perform logout
        navigate('/login');
        toast("Đăng xuất thành công");
    };

    const handleProfileClick = () => {
        navigate(`/profile/${user.id}`); // Navigate to profile page
    };

    const toggleDropdown = () => {
        setIsDropdownVisible(!isDropdownVisible); // Toggle dropdown visibility
    };

    const handleLogoClick = () => {
        navigate('/'); // Navigate to homepage
    };

    return (
        <div>
            <header className="header">
                <div className="logo" onClick={handleLogoClick} style={{ cursor: 'pointer' }}>
                    <img src="https://library.fpt.edu.vn/Uploads/HN/images/opac-logo/logo.png" alt="Logo" />
                </div>
                <div className="mt-2">
                    <h1>Welcome to <strong style={{
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
                    {user ? (
                        <div className="profile-container">
                            <div className="profile-dropdown">
                                <img
                                    src={user.profilePicture || "https://static.vecteezy.com/system/resources/thumbnails/020/911/731/small/profile-icon-avatar-icon-user-icon-person-icon-free-png.png"}
                                    alt="Profile"
                                    className="profile-pic"
                                    onClick={toggleDropdown}
                                />
                                {isDropdownVisible && (
                                    <div className="dropdown-content">
                                        <button onClick={handleProfileClick}>Thông tin cá nhân</button>
                                        <button onClick={handleLogout}>Đăng xuất</button>
                                    </div>
                                )}
                            </div>
                        </div>
                    ) : null}
                </div>
            </header>
            <hr style={{ height: "5px", color: 'black' }} />
        </div>


    );
}

export default Header;
