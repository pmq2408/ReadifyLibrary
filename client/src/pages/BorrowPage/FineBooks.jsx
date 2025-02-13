import React from 'react';
import { Link } from 'react-router-dom';

export const FineBooks = () => {
    const fines = [
        { id: 1, title: 'Giáo trình kỹ thuật lập trình C', fineAmount: '50,000 VND', dueDate: '2/27/2025', status: 'Chưa thanh toán' },
        { id: 2, title: 'Lập trình Java nâng cao', fineAmount: '30,000 VND', dueDate: '2/20/2025', status: 'Đã thanh toán' }
    ];

    return (
        <div className="p-6">
            <h2 className="text-2xl font-bold mb-4">Danh sách tiền phạt</h2>
            <Link to="../"><button className='bg-purple-500 text-white px-5 py-2 rounded-lg hover:bg-blue-600 transition-all'>Home</button></Link>

            <Link to="/booksearch"><button className='bg-red-500 text-white px-5 py-2 rounded-lg hover:bg-blue-600 transition-all'>Danh sách sách</button></Link>

            <Link to="/borrowBook"><button className='bg-blue-500 text-white px-5 py-2 rounded-lg hover:bg-blue-600 transition-all'>Danh sách sách đã mượn</button></Link>
            <Link to="/fineBooks"><button className='ml-2 bg-green-500 text-white px-5 py-2 rounded-lg hover:bg-blue-600 transition-all'>Tiền phạt</button></Link>

            <table className="w-full border-collapse border border-gray-300">
                <thead className="bg-gray-100">
                    <tr>
                        <th className="border p-2">ID</th>
                        <th className="border p-2">Tên sách</th>
                        <th className="border p-2">Số tiền phạt</th>
                        <th className="border p-2">Ngày quá hạn</th>
                        <th className="border p-2">Trạng thái</th>
                    </tr>
                </thead>
                <tbody>
                    {fines.map(({ id, title, fineAmount, dueDate, status }) => (
                        <tr key={id} className="border">
                            <td className="border p-2 text-center">{id}</td>
                            <td className="border p-2">{title}</td>
                            <td className="border p-2 text-center">{fineAmount}</td>
                            <td className="border p-2 text-center">{dueDate}</td>
                            <td className={`border p-2 text-center ${status === 'Chưa thanh toán' ? 'text-red-500' : 'text-green-500'}`}>{status}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};
