// src/pages/Homepage/FinesPage.js
import React from 'react';

export const FinesPage = () => {
    const finesList = [
        { id: 1, title: 'Hành Trang Lập Trình', userId: 'U001', condition: 'Tốt', amount: '41.100 ₫', status: 'Đã thanh toán', reason: 'Hư hỏng nhẹ' },
        { id: 2, title: 'Những người khốn khổ', userId: 'U002', condition: 'Tốt', amount: '80.000 ₫', status: 'Đã thanh toán', reason: 'Quá hạn' },
        { id: 3, title: 'Những người khốn khổ', userId: 'U002', condition: 'Hư hỏng nặng', amount: '300.000 ₫', status: 'Chưa thanh toán', reason: 'Không thể đọc' },
        { id: 4, title: '48 Nguyên Tắc Quyền Lực', userId: 'U003', condition: 'Tốt', amount: '80.000 ₫', status: 'Đã thanh toán', reason: 'Mất sách' }
    ];

    return (
        <div className="p-4 bg-white border border-r rounded-lg shadow-lg mt-4" style={{ width: "1250px" }}>
            <h2 className="text-xl font-bold mb-4 text-center">Danh sách phạt</h2>
            <table className="w-full border border-gray-300 text-sm">
                <thead className="bg-gray-200 text-gray-700">
                    <tr>
                        <th className="p-2">STT</th>
                        <th className="p-2">Tựa sách</th>
                        <th className="p-2">Mã người dùng</th>
                        <th className="p-2">Tình trạng sách</th>
                        <th className="p-2">Tổng tiền phạt</th>
                        <th className="p-2">Trạng thái</th>
                        <th className="p-2">Lý do phạt</th>
                    </tr>
                </thead>
                <tbody>
                    {finesList.map(({ id, title, userId, condition, amount, status, reason }) => (
                        <tr key={id} className="border-t border-gray-300 hover:bg-gray-50">
                            <td className="p-2 text-center">{id}</td>
                            <td className="p-2 font-medium text-blue-600 cursor-pointer hover:underline">{title}</td>
                            <td className="p-2 text-center">{userId}</td>
                            <td className="p-2 text-center">{condition}</td>
                            <td className="p-2 text-center font-semibold">{amount}</td>
                            <td className={`p-2 text-center font-medium ${status === 'Chưa thanh toán' ? 'text-red-500' : 'text-green-500'}`}>{status}</td>
                            <td className="p-2">{reason}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};
