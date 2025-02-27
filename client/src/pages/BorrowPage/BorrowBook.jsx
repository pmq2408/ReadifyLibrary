import React, { useState } from 'react';

export const BorrowBook = () => {
    const [books, setBooks] = useState([
        {
            id: 1,
            title: 'Giáo trình kỹ thuật lập trình C căn bản và nâng cao',
            borrowDate: '02/13/2025',
            returnDate: '02/27/2025',
            status: 'Chờ duyệt',
            bookId: '201.IT101.7741',
            renewCount: 0
        },
        {
            id: 2,
            title: 'Lập trình Java cơ bản',
            borrowDate: '02/10/2025',
            returnDate: '02/24/2025',
            status: 'Đã duyệt',
            bookId: '201.IT102.8532',
            renewCount: 1
        },
        {
            id: 3,
            title: 'Cấu trúc dữ liệu và giải thuật',
            borrowDate: '02/05/2025',
            returnDate: '02/19/2025',
            status: 'Đã trả',
            bookId: '201.IT103.9123',
            renewCount: 2
        }
    ]);

    const handleRenew = (id) => {
        setBooks(books.map(book => book.id === id ? { ...book, renewCount: book.renewCount + 1 } : book));
    };

    const handleCancel = (id) => {
        setBooks(books.filter(book => book.id !== id));
    };

    return (
        <div className="p-6">
            <h2 className="text-2xl font-bold mb-4">Danh sách Sách Đã Mượn</h2>
            <table className="w-full border-collapse border border-gray-300">
                <thead className="bg-gray-100">
                    <tr>
                        <th className="border p-2">ID</th>
                        <th className="border p-2">Tên sách</th>
                        <th className="border p-2">Ngày mượn</th>
                        <th className="border p-2">Ngày hẹn trả</th>
                        <th className="border p-2">Trạng thái</th>
                        <th className="border p-2">Mã sách</th>
                        <th className="border p-2">Số lần gia hạn</th>
                        <th className="border p-2">Hành động</th>
                    </tr>
                </thead>
                <tbody>
                    {books.map(({ id, title, borrowDate, returnDate, status, bookId, renewCount }) => (
                        <tr key={id} className="border">
                            <td className="border p-2 text-center">{id}</td>
                            <td className="border p-2">{title}</td>
                            <td className="border p-2">{borrowDate}</td>
                            <td className="border p-2">{returnDate}</td>
                            <td className={`border p-2 ${status === 'Đã trả' ? 'text-green-500' : status === 'Chờ duyệt' ? 'text-yellow-500' : 'text-blue-500'}`}>{status}</td>
                            <td className="border p-2">{bookId}</td>
                            <td className="border p-2 text-center">{renewCount}</td>
                            <td className="border p-2 flex justify-center space-x-2">
                                <button onClick={() => handleRenew(id)} className="bg-blue-500 text-white px-3 py-1 rounded">🔄 Gia hạn</button>
                                <button onClick={() => handleCancel(id)} className="bg-red-500 text-white px-3 py-1 rounded">❌ Hủy</button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};
