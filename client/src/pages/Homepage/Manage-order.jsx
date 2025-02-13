// src/pages/Homepage/BorrowPage.js
import React, { useState } from 'react';

export const ManageOrder = () => {
    const [searchTerm, setSearchTerm] = useState('');
    const borrowList = [
        { id: 'SV001', name: 'Nguyễn Văn A', book: 'React Basics', borrowDate: '2024-01-10', returnDate: '2024-02-10', status: 'Chưa trả' },
        { id: 'SV002', name: 'Trần Thị B', book: 'JavaScript Advanced', borrowDate: '2024-01-15', returnDate: '2024-02-15', status: 'Đã trả' },
        { id: 'SV003', name: 'Lê Văn C', book: 'Node.js Essentials', borrowDate: '2024-01-20', returnDate: '2024-02-20', status: 'Chưa trả' },
        { id: 'SV003', name: 'Lê Văn C', book: 'Node.js Essentials', borrowDate: '2024-01-20', returnDate: '2024-02-20', status: 'Chưa trả' },
        { id: 'SV003', name: 'Lê Văn C', book: 'Node.js Essentials', borrowDate: '2024-01-20', returnDate: '2024-02-20', status: 'Chưa trả' },
        { id: 'SV003', name: 'Lê Văn C', book: 'Node.js Essentials', borrowDate: '2024-01-20', returnDate: '2024-02-20', status: 'Chưa trả' },
        { id: 'SV003', name: 'Lê Văn C', book: 'Node.js Essentials', borrowDate: '2024-01-20', returnDate: '2024-02-20', status: 'Chưa trả' },
    ];

    const filteredBorrows = borrowList.filter(({ name, id }) =>
        `${name} ${id}`.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="p-6 max-w-6xl mx-auto">
            <h2 className="text-3xl font-bold mb-5 text-indigo-700">Quản lý Trả Sách</h2>
            <input
                type="text"
                placeholder="Tìm kiếm theo mã hoặc tên sinh viên..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="p-3 border rounded mb-5 w-full shadow"
            />
            <table className="border border-collapse border-gray-400 table-auto" style={{ width: "170%" }}>
                <thead className="bg-indigo-600 text-white">
                    <tr>
                        {['Mã SV', 'Tên SV', 'Tên Sách', 'Ngày Mượn', 'Ngày Hẹn Trả', 'Trạng Thái'].map((header, index) => (
                            <th key={index} className="p-3 border-r border-gray-500 text-center text-base font-semibold">
                                {header}
                            </th>
                        ))}
                    </tr>
                </thead>
                <tbody>
                    {filteredBorrows.length ? (
                        filteredBorrows.map(({ id, name, book, borrowDate, returnDate, status }) => (
                            <tr key={id} className="border-b border-gray-400 hover:bg-gray-100">
                                {[id, name, book, borrowDate, returnDate, status].map((value, idx) => (
                                    <td key={idx} className="p-3 border-r border-gray-400 text-center">
                                        {value}
                                    </td>
                                ))}
                            </tr>
                        ))
                    ) : (
                        <tr>
                            <td colSpan="6" className="p-5 text-center text-gray-500">Không tìm thấy kết quả</td>
                        </tr>
                    )}
                </tbody>
            </table>
        </div>
    );
};