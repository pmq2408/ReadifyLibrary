// src/pages/Homepage/BorrowPage.js
import React, { useState } from 'react';

export const BorrowPage = () => {
    const [searchTerm, setSearchTerm] = useState('');
    const borrowList = [
        { id: 1, title: 'Hành Trang Lập Trình', borrowDate: '2/9/2025', returnDate: '2/23/2025', code: '101.IT02.3827', status: 'Đã duyệt', condition: 'Tốt' },
        { id: 2, title: 'Chí Phèo', borrowDate: '2/9/2024', returnDate: '2/16/2024', code: '100.VH01.2978', status: 'Đã duyệt', condition: 'Tốt' },
        { id: 4, title: 'Giáo Trình Kỹ Thuật Lập Trình C', borrowDate: '2/9/2025', returnDate: '2/23/2025', code: '201.IT101.9508', status: 'Đã duyệt', condition: 'Tốt' },
        { id: 3, title: 'Giáo Trình Kỹ Thuật Lập Trình C', borrowDate: '2/9/2025', returnDate: '2/23/2025', code: '201.IT101.9508', status: 'Đã duyệt', condition: 'Tốt' },
        { id: 3, title: 'Giáo Trình Kỹ Thuật Lập Trình C', borrowDate: '2/9/2025', returnDate: '2/23/2025', code: '201.IT101.9508', status: 'Đã duyệt', condition: 'Tốt' },
        { id: 3, title: 'Giáo Trình Kỹ Thuật Lập Trình C', borrowDate: '2/9/2025', returnDate: '2/23/2025', code: '201.IT101.9508', status: 'Đã duyệt', condition: 'Tốt' },
        { id: 3, title: 'Giáo Trình Kỹ Thuật Lập Trình C', borrowDate: '2/9/2025', returnDate: '2/23/2025', code: '201.IT101.9508', status: 'Đã duyệt', condition: 'Tốt' },
    ];

    const filteredBorrows = borrowList.filter(item =>
        item.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.code.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="p-4 bg-white border rounded-lg shadow-md" style={{ width: "140%" }}>
            <h2 className="text-3xl font-bold mb-5 text-indigo-700">Quản lý Mượn Sách</h2>

            <div className="flex items-center mb-4">
                <input
                    type="text"
                    placeholder="Nhập mã định danh sách"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="flex-1 px-3 py-2 border rounded mr-2"
                />
                <button className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600">Duyệt</button>
            </div>
            <table className="w-full border border-gray-300 rounded-lg text-sm">
                <thead className="bg-gray-100 text-gray-700">
                    <tr>
                        <th className="p-2">ID</th>
                        <th className="p-2">Tên sách</th>
                        <th className="p-2">Ngày mượn</th>
                        <th className="p-2">Ngày hẹn trả</th>
                        <th className="p-2">Mã định danh</th>
                        <th className="p-2">Trạng thái</th>
                        <th className="p-2">Tình trạng sách</th>
                        <th className="p-2">Hành động</th>
                    </tr>
                </thead>
                <tbody>
                    {filteredBorrows.map(({ id, title, borrowDate, returnDate, code, status, condition }) => (
                        <tr key={id} className="border-t border-gray-300 hover:bg-gray-50">
                            <td className="p-2 text-center">{id}</td>
                            <td className="p-2">{title}</td>
                            <td className="p-2 text-center">{borrowDate}</td>
                            <td className="p-2 text-center">{returnDate}</td>
                            <td className="p-2 text-center">{code}</td>
                            <td className="p-2 text-center text-green-500 font-medium">{status}</td>
                            <td className="p-2 text-center">{condition}</td>
                            <td className="p-2 text-center">
                                <button className="bg-blue-500 text-white px-2 py-1 rounded mr-1 hover:bg-blue-600">✔</button>
                                <button className="bg-red-500 text-white px-2 py-1 rounded hover:bg-red-600">✖</button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};