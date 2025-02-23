import React from 'react'
import { FaBalanceScale, FaClipboardList, FaHome, FaMoneyBillWave, FaTags, FaUserCog } from "react-icons/fa";
import { GiReturnArrow } from "react-icons/gi";
import { FaBook } from "react-icons/fa";
import { IoNewspaperOutline } from "react-icons/io5";
import { FcRules } from "react-icons/fc";
import { FcStatistics } from "react-icons/fc";
import { FaMoneyBill } from "react-icons/fa";
import { Link, useLocation } from 'react-router-dom';

export const Sidebars = () => {
    const location = useLocation();

    const isActive = (path) =>
        location.pathname === path
            ? 'bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 w-100 text-wrap text-center text-black font-bold rounded-lg'
            : 'bg-transparent text-black';
    return (
        <div className='bg-gray-300 h-full p-8 rounded-md mt-2 flex flex-col space-y-5 cursor-pointer'>
            <Link to="/">
                <p className={`flex items-center gap-2 ${isActive("/")}`}><FaHome /> Trang chủ</p>
            </Link>
            <Link to="Borrow">
                <p className={`flex items-center gap-2 ${isActive("/Borrow")}`}> <GiReturnArrow />Quản lí mượn sách</p>
            </Link>
            <Link to="ManageOrder">
                <p className={`flex items-center gap-2 ${isActive("/ManageOrder")}`}><FaBook /> Quản lí trả sách</p>

            </Link>
            <Link to="News">
                <p className={`flex items-center gap-2 ${isActive("/News")}`}><IoNewspaperOutline />Quản lí tin tức</p>
            </Link>
            <Link to="Rules">
                <p className={`flex items-center gap-2 ${isActive("/Rules")}`}><FcRules />Quy định</p>
            </Link>
            <Link to="Statistics">
    <p className={`flex items-center gap-2 ${isActive("/Statistics")}`}>
        <FcStatistics />Thống kê
    </p>
</Link>
<Link to="Fines">
    <p className={`flex items-center gap-2 ${isActive("/Fines")}`}>
        <FaMoneyBillWave />Danh sách tiền phạt
    </p>
</Link>
<Link to="listaccount">
    <p className={`flex items-center gap-2 ${isActive("/listaccount")}`}>
        <FaUserCog />Quản lí tài khoản
    </p>
</Link>
<Link to="listrule">
    <p className={`flex items-center gap-2 ${isActive("/listrule")}`}>
        <FaClipboardList />Quản lí quy định
    </p>
</Link>
<Link to="fines-management">
    <p className={`flex items-center gap-2 ${isActive("/fines-management")}`}>
        <FaBalanceScale />Quản lí phạt
    </p>
</Link>
<Link to="books">
    <p className={`flex items-center gap-2 ${isActive("/books")}`}>
        <FaBook />Quản lí sách
    </p>
</Link>
<Link to="genres">
    <p className={`flex items-center gap-2 ${isActive("/genres")}`}>
        <FaTags />Quản lí thể loại sách
    </p>
</Link>

        </div >
    )
}
