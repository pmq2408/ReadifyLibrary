import React, { useState } from 'react';

export const FineBooks = () => {
    const [fines, setFines] = useState([
        { id: 1, title: 'Giáo trình kỹ thuật lập trình C', fineAmount: 50000, dueDate: '2025-02-27', status: 'Chưa thanh toán', reason: 'Trả sách trễ 5 ngày', bookId: '201.IT101.7741' },
        { id: 2, title: 'Lập trình Java nâng cao', fineAmount: 30000, dueDate: '2025-02-20', status: 'Đã thanh toán', reason: 'Trả sách trễ 3 ngày', bookId: '201.IT101.8923' },
        { id: 3, title: 'Lập trình Python từ cơ bản', fineAmount: 70000, dueDate: '2025-02-15', status: 'Chưa thanh toán', reason: 'Trả sách trễ 7 ngày', bookId: '201.IT101.9987' }
    ]);

    const [filter, setFilter] = useState('all');
    const [selectedFines, setSelectedFines] = useState([]);

    const handlePayment = (id) => {
        setFines(fines.map(fine => fine.id === id ? { ...fine, status: 'Đã thanh toán' } : fine));
        setSelectedFines(selectedFines.filter(fineId => fineId !== id));
        alert('Thanh toán thành công!');
    };

    const handleSelect = (id) => {
        setSelectedFines(prev => prev.includes(id) ? prev.filter(fineId => fineId !== id) : [...prev, id]);
    };

    const filteredFines = fines.filter(fine => filter === 'all' || fine.status === filter);
    const totalFine = selectedFines.reduce((sum, id) => sum + (fines.find(f => f.id === id)?.fineAmount || 0), 0);

    return (
        <div className="p-6">
            <h2 className="text-2xl font-bold mb-4">Danh sách tiền phạt</h2>
            <div className="flex justify-between mb-4">
                <select value={filter} onChange={(e) => setFilter(e.target.value)} className="p-2 border rounded">
                    <option value="all">Tất cả</option>
                    <option value="Chưa thanh toán">Chưa thanh toán</option>
                    <option value="Đã thanh toán">Đã thanh toán</option>
                </select>
                {selectedFines.length > 0 && (
                    <button onClick={() => selectedFines.forEach(handlePayment)} className="bg-green-500 text-white px-4 py-2 rounded">
                        Thanh toán {totalFine.toLocaleString()} VND
                    </button>
                )}
            </div>
            <table className="w-full border-collapse border border-gray-300">
                <thead className="bg-gray-100">
                    <tr>
                        <th className="border p-2">Chọn</th>
                        <th className="border p-2">ID</th>
                        <th className="border p-2">Tên sách</th>
                        <th className="border p-2">Số tiền phạt</th>
                        <th className="border p-2">Ngày quá hạn</th>
                        <th className="border p-2">Trạng thái</th>
                        <th className="border p-2">Chi tiết</th>
                    </tr>
                </thead>
                <tbody>
                    {filteredFines.map(({ id, title, fineAmount, dueDate, status, reason, bookId }) => (
                        <tr key={id} className="border">
                            <td className="border p-2 text-center">
                                <input type="checkbox" checked={selectedFines.includes(id)} onChange={() => handleSelect(id)} disabled={status === 'Đã thanh toán'} />
                            </td>
                            <td className="border p-2 text-center">{id}</td>
                            <td className="border p-2">{title}</td>
                            <td className="border p-2 text-center">{fineAmount.toLocaleString()} VND</td>
                            <td className="border p-2 text-center">{dueDate}</td>
                            <td className={`border p-2 text-center ${status === 'Chưa thanh toán' ? 'text-red-500' : 'text-green-500'}`}>{status}</td>
                            <td className="border p-2 text-center">
                                <button onClick={() => alert(`Lý do: ${reason}\nMã sách: ${bookId}`)} className="bg-blue-500 text-white px-2 py-1 rounded">🔍</button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};