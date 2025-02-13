import React from 'react';
import { Link } from 'react-router-dom';

export const BorrowBook = () => {
    const data = [
        {
            id: 1,
            title: 'Giáo trình kỹ thuật lập trình C căn bản và nâng cao',
            borrowDate: '2/13/2025',
            returnDate: '2/27/2025',
            status: 'Chờ duyệt',
            bookId: '201.IT101.7741',
            renewCount: 0
        }
    ];

    return (
        <div className="p-6">
            <select className="mb-4 p-2 border rounded">
                <option value="all">Tất cả</option>
            </select>
            <Link to="../"><button className='bg-purple-500 text-white px-5 py-2 rounded-lg hover:bg-blue-600 transition-all'>Home</button></Link>
            <Link to="/booksearch"><button className='bg-red-500 text-white px-5 py-2 rounded-lg hover:bg-blue-600 transition-all'>Danh sách sách</button></Link>
            <Link to="/borrowBook"><button className='bg-blue-500 text-white px-5 py-2 rounded-lg hover:bg-blue-600 transition-all'>Danh sách sách đã mượn</button></Link>
            <Link to="/fineBooks"><button className='ml-2 bg-green-500 text-white px-5 py-2 rounded-lg hover:bg-blue-600 transition-all'>Tiền phạt</button></Link>

            <table className="w-full border-collapse border border-gray-300">
                <thead className="bg-gray-100">
                    <tr>
                        <th className="border p-2">ID</th>
                        <th className="border p-2">Tên sách</th>
                        <th className="border p-2">Ngày mượn</th>
                        <th className="border p-2">Ngày hẹn trả</th>
                        <th className="border p-2">Trạng thái</th>
                        <th className="border p-2">Mã định danh sách</th>
                        <th className="border p-2">Số lần gia hạn</th>
                        <th className="border p-2">Hành động</th>
                    </tr>
                </thead>
                <tbody>
                    {data.map(({ id, title, borrowDate, returnDate, status, bookId, renewCount }) => (
                        <tr key={id} className="border">
                            <td className="border p-2 text-center">{id}</td>
                            <td className="border p-2">{title}</td>
                            <td className="border p-2">{borrowDate}</td>
                            <td className="border p-2">{returnDate}</td>
                            <td className="border p-2 text-yellow-500">{status}</td>
                            <td className="border p-2">{bookId}</td>
                            <td className="border p-2 text-center">{renewCount}</td>
                            <td className="border p-2 flex justify-center space-x-2">
                                <button className="bg-blue-500 text-white px-2 py-1 rounded">👁️</button>
                                <button className="bg-red-500 text-white px-2 py-1 rounded">❌</button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};