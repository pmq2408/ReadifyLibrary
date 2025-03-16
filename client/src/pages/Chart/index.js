import React, { useEffect, useState } from "react";
import { AgCharts } from "ag-charts-react";
import axios from "axios";
import { motion } from "framer-motion";

function Chart() {
    const [orderData, setOrderData] = useState(null);
    const [totalOrder, setTotalOrder] = useState(0);
    const [finesData, setFinesData] = useState(null);
    const [totalFines, setTotalFines] = useState(0);

    useEffect(() => {
        const fetchChartData = async () => {
            try {
                const [ordersRes, totalOrdersRes, finesRes, totalFinesRes] = await Promise.all([
                    axios.get(`http://localhost:9999/api/orders/chart-order-by-month`),
                    axios.get(`http://localhost:9999/api/orders/getAll`),
                    axios.get("http://localhost:9999/api/fines/chart-fines-by-month"),
                    axios.get("http://localhost:9999/api/fines/getAll"),
                ]);

                // Xử lý dữ liệu đơn hàng
                const orderChartData = ordersRes.data.data.map(item => ({
                    month: `Tháng ${item.month}`,
                    count: item.statuses.reduce((acc, s) => acc + s.count, 0),
                }));

                setOrderData({
                    autoSize: true,
                    data: orderChartData,
                    series: [
                        { type: "bar", xKey: "month", yKey: "count", yName: "Số đơn hàng" },
                        { type: "line", xKey: "month", yKey: "count", yName: "Xu hướng đơn hàng", strokeWidth: 2, marker: { size: 5 } }
                    ],
                });

                setTotalOrder(totalOrdersRes.data.data.length);

                // Xử lý dữ liệu tiền phạt
                const finesChartData = finesRes.data.data.map(item => ({
                    month: `Tháng ${item.month}`,
                    total: item.totalFinesAmount,
                }));

                setFinesData({
                    autoSize: true,
                    data: finesChartData,
                    series: [
                        { type: "bar", xKey: "month", yKey: "total", yName: "Tổng tiền phạt" },
                        { type: "line", xKey: "month", yKey: "total", yName: "Xu hướng tiền phạt", strokeWidth: 2, marker: { size: 5 } }
                    ],
                });

                setTotalFines(totalFinesRes.data.data.length);
            } catch (error) {
                console.error("Lỗi khi tải dữ liệu:", error);
            }
        };

        fetchChartData();
    }, []);

    return (
        <div className="container mx-auto p-6">
            <motion.h1 
                className="text-3xl font-bold text-center text-gray-800 mb-8"
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
            >
                📊 Thống kê dữ liệu
            </motion.h1>

            <div className="grid grid-cols-2 gap-8">
                {/* Biểu đồ đơn hàng */}
                <motion.div 
                    className="bg-white shadow-xl rounded-xl p-6 border border-gray-200 hover:shadow-2xl transition-shadow duration-300"
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.5, delay: 0.2 }}
                >
                    <h2 className="text-xl font-semibold text-gray-700 mb-4">
                        🛒 Thống kê đơn hàng theo tháng 
                    </h2>
                    <p>Tổng số đơn hàng: {totalOrder}</p>
                    {orderData ? <AgCharts options={orderData} /> : <p>Đang tải dữ liệu...</p>}
                </motion.div>

                {/* Biểu đồ tiền phạt */}
                <motion.div 
                    className="bg-white shadow-xl rounded-xl p-6 border border-gray-200 hover:shadow-2xl transition-shadow duration-300"
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.5, delay: 0.4 }}
                >
                    <h2 className="text-xl font-semibold text-gray-700 mb-4">
                        💰 Thống kê tiền phạt theo tháng 
                    </h2>
                    <p>Tổng số đơn phạt: {totalFines}</p>
                    {finesData ? <AgCharts options={finesData} /> : <p>Đang tải dữ liệu...</p>}
                </motion.div>
            </div>
        </div>
    );
}

export default Chart;
