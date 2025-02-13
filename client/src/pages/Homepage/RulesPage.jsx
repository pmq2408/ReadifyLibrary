// src/pages/Homepage/RulesPage.js
import React from 'react';

export const RulesPage = () => {
    const rulesList = [
        { id: 1, title: 'Nội quy Thư viện' },
        { id: 2, title: 'Dịch vụ mượn, trả tài liệu' },
        { id: 3, title: 'Hướng dẫn bạn đọc xem sách đang mượn, tự gia hạn sách' },
        { id: 4, title: 'Quy định sử dụng phòng học nhóm trong thư viện' },
        { id: 5, title: 'Hướng dẫn thanh toán phí thư viện' },
        { id: 6, title: 'Xử lý vi phạm nội quy thư viện' }
    ];

    return (
        <div className="p-4 bg-white border rounded-lg shadow-md mt-5" style={{ width: "250%" }}>
            <h2 className="text-lg font-bold mb-4 ">Nội quy Thư viện</h2>
            <table className="w-full border border-gray-300 text-sm">
                <thead className="bg-gray-100 text-gray-700">
                    <tr>
                        <th className="p-2 text-left font-semibold">STT</th>
                        <th className="p-2 text-left font-semibold">Title</th>
                    </tr>
                </thead>
                <tbody>
                    {rulesList.map(({ id, title }) => (
                        <tr key={id} className="border-t border-gray-300 hover:bg-gray-50">
                            <td className="p-2 text-center">{id}</td>
                            <td className="p-2 text-blue-600 font-medium cursor-pointer hover:underline">{title}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};
