import React, { useEffect, useState } from "react";
import { AgCharts } from "ag-charts-react";
import axios from "axios";
import { motion } from "framer-motion";

function Chart() {
    const [activeTab, setActiveTab] = useState("orders"); // Quản lý tab hiển thị
    const [orderData, setOrderData] = useState(null);
    const [totalOrder, setTotalOrder] = useState(0);
    const [finesData, setFinesData] = useState(null);
    const [totalFines, setTotalFines] = useState(0);
    const [books, setBooks] = useState([]);

    useEffect(() => {
        const fetchChartData = async () => {
            try {
                const [ordersRes, totalOrdersRes, finesRes, totalFinesRes, booksRes] = await Promise.all([
                    axios.get(`http://localhost:9999/api/orders/chart-order-by-month`),
                    axios.get(`http://localhost:9999/api/orders/getAll`),
                    axios.get("http://localhost:9999/api/fines/chart-fines-by-month"),
                    axios.get("http://localhost:9999/api/fines/getAll"),
                    axios.get("http://localhost:9999/api/books/books"),
                ]);

                setOrderData({
                    autoSize: true,
                    data: ordersRes.data.data.map(item => ({
                        month: `Tháng ${item.month}`,
                        count: item.statuses.reduce((acc, s) => acc + s.count, 0),
                    })),
                    series: [
                        { type: "bar", xKey: "month", yKey: "count", yName: "Số đơn hàng" },
                        { type: "line", xKey: "month", yKey: "count", yName: "Xu hướng đơn hàng", strokeWidth: 2, marker: { size: 5 } }
                    ],
                });
                setTotalOrder(totalOrdersRes.data.data.length);

                setFinesData({
                    autoSize: true,
                    data: finesRes.data.data.map(item => ({
                        month: `Tháng ${item.month}`,
                        total: item.totalFinesAmount,
                    })),
                    series: [
                        { type: "bar", xKey: "month", yKey: "total", yName: "Tổng tiền phạt" },
                        { type: "line", xKey: "month", yKey: "total", yName: "Xu hướng tiền phạt", strokeWidth: 2, marker: { size: 5 } }
                    ],
                });
                setTotalFines(totalFinesRes.data.data.length);
                setBooks(booksRes.data);
            } catch (error) {
                console.error("Lỗi khi tải dữ liệu:", error);
            }
        };
        fetchChartData();
    }, []);

    return (
        <div className="container mx-auto p-6">
            <motion.h1 className="text-3xl font-bold text-center text-gray-800 mb-8" initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
                📊 Thống kê dữ liệu
            </motion.h1>
            
            {/* Thanh điều hướng */}
            <div className="flex justify-center space-x-4 mb-6">
                {[
                    { key: "orders", label: "🛒 Đơn hàng" },
                    { key: "fines", label: "💰 Tiền phạt" },
                    { key: "books", label: "📚 Sách" }
                ].map(tab => (
                    <button
                        key={tab.key}
                        className={`px-4 py-2 rounded-lg text-blue font-bold ${activeTab === tab.key ? "bg-blue-600" : "bg-gray-400 hover:bg-gray-400"}`}
                        onClick={() => setActiveTab(tab.key)}
                    >
                        {tab.label}
                    </button>
                ))}
            </div>

            {/* Hiển thị nội dung theo tab */}
            {activeTab === "orders" && orderData && (
                <motion.div className="bg-white shadow-xl rounded-xl p-6 border border-gray-200" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.5 }}>
                    <h2 className="text-xl font-semibold text-gray-700 mb-4">🛒 Thống kê đơn hàng theo tháng</h2>
                    <p>Tổng số đơn hàng: {totalOrder}</p>
                    <AgCharts options={orderData} />
                </motion.div>
            )}

            {activeTab === "fines" && finesData && (
                <motion.div className="bg-white shadow-xl rounded-xl p-6 border border-gray-200" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.5 }}>
                    <h2 className="text-xl font-semibold text-gray-700 mb-4">💰 Thống kê tiền phạt theo tháng</h2>
                    <p>Tổng số đơn phạt: {totalFines}</p>
                    <AgCharts options={finesData} />
                </motion.div>
            )}

            {activeTab === "books" && (
                <motion.div className="bg-white shadow-xl rounded-xl p-6 border border-gray-200 mt-6" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.5 }}>
                    <h2 className="text-xl font-semibold text-gray-700 mb-4">📚 Thống kê số đầu sách</h2>
                    <div className="overflow-x-auto">
                        <table className="min-w-full bg-white border border-gray-200">
                            <thead>
                                <tr className="bg-gray-100">
                                    <th className="border px-4 py-2 text-left">📖 Tên sách</th>
                                    <th className="border px-4 py-2 text-center">📦 Tổng số</th>
                                    <th className="border px-4 py-2 text-center">📚 Sách còn lại</th>
                                    <th className="border px-4 py-2 text-right">💲 Giá</th>
                                </tr>
                            </thead>
                            <tbody>
                                {books.length > 0 ? books.map((book, index) => (
                                    <tr key={index} className="hover:bg-gray-50">
                                        <td className="border px-4 py-2">{book.title}</td>
                                        <td className="border px-4 py-2 text-center">{book.totalCopies}</td>
                                        <td className="border px-4 py-2 text-center">{book.availableCopies}</td>
                                        <td className="border px-4 py-2 text-right">{book.price.toLocaleString()} VND</td>
                                    </tr>
                                )) : (
                                    <tr>
                                        <td colSpan="4" className="text-center border px-4 py-2">Không có dữ liệu</td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </motion.div>
            )}
        </div>
    );
}

export default Chart;
