import React, { useEffect, useState } from "react";
import { Bar, Line } from "react-chartjs-2";
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, PointElement, LineElement, Title, Tooltip, Legend } from "chart.js";
import axios from "axios";
import { motion } from "framer-motion";

// Register Chart.js components
ChartJS.register(CategoryScale, LinearScale, BarElement, PointElement, LineElement, Title, Tooltip, Legend);

function Chart() {
    const [orderData, setOrderData] = useState({ labels: [], datasets: [] });
    const [totalOrder, setTotalOrder] = useState(0);
    const [finesData, setFinesData] = useState({ labels: [], datasets: [] });
    const [totalFines, setTotalFines] = useState(0);

    useEffect(() => {
        axios.get(`${process.env.REACT_APP_API_URL}/orders/chart-order-by-month`)
            .then((res) => {
                const monthlyData = res.data.data;
                const labels = monthlyData.map((item) => `Tháng ${item.month}`);
                const statuses = Array.from(new Set(monthlyData.flatMap((item) => item.statuses.map((status) => status.status))));

                const datasets = statuses.map((status) => ({
                    label: status,
                    data: monthlyData.map((month) => {
                        const statusData = month.statuses.find((s) => s.status === status);
                        return statusData ? statusData.count : 0;
                    }),
                    backgroundColor: `rgba(${Math.floor(Math.random() * 255)}, ${Math.floor(Math.random() * 255)}, ${Math.floor(Math.random() * 255)}, 0.6)`,
                    borderColor: "rgba(75, 192, 192, 1)",
                    borderWidth: 1,
                }));

                setOrderData({ labels, datasets });
            })
            .catch((error) => console.error("Error fetching order stats:", error));
    }, []);

    useEffect(() => {
        axios.get(`${process.env.REACT_APP_API_URL}/orders/getAll`)
            .then((res) => setTotalOrder(res.data.data.length))
            .catch((error) => console.error("Error fetching total orders:", error));
    }, []);

    useEffect(() => {
        axios.get("http://localhost:9999/api/fines/chart-fines-by-month")
            .then((res) => {
                const monthlyData = res.data.data;
                const labels = monthlyData.map((item) => `Tháng ${item.month}`);
                const data = monthlyData.map((item) => item.totalFinesAmount);

                setFinesData({
                    labels,
                    datasets: [{
                        label: "Tổng tiền phạt",
                        data,
                        borderColor: "rgba(75, 192, 192, 1)",
                        backgroundColor: "rgba(75, 192, 192, 0.2)",
                        tension: 0.4,
                        fill: true,
                    }],
                });
            })
            .catch((error) => console.error("Error fetching fines stats:", error));
    }, []);

    useEffect(() => {
        axios.get("http://localhost:9999/api/fines/getAll")
            .then((res) => setTotalFines(res.data.data.length))
            .catch((error) => console.error("Error fetching total fines:", error));
    }, []);

    const barOptions = {
        responsive: true,
        plugins: {
            legend: { display: true, position: "top" },
            title: { display: true, text: "Thống kê đơn hàng theo tháng" },
        },
        scales: {
            x: { title: { display: true, text: "Tháng" } },
            y: { title: { display: true, text: "Số lượng đơn hàng" }, beginAtZero: true },
        },
    };

    const lineOptions = {
        responsive: true,
        plugins: {
            legend: { display: true, position: "top" },
            title: { display: true, text: "Thống kê phạt theo tháng" },
        },
        scales: {
            x: { title: { display: true, text: "Tháng" } },
            y: { title: { display: true, text: "Tổng tiền phạt" }, beginAtZero: true },
        },
    };

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
                    <h2 className="text-xl font-semibold text-gray-700 mb-4 flex items-center">
                        🛒 Thống kê đơn hàng theo tháng
                    </h2>
                    <p>Tổng số đơn hàng: {totalOrder}</p>
                    <Bar data={orderData} options={barOptions} />
                </motion.div>
                
                {/* Biểu đồ tiền phạt */}
                <motion.div 
                    className="bg-white shadow-xl rounded-xl p-6 border border-gray-200 hover:shadow-2xl transition-shadow duration-300"
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.5, delay: 0.4 }}
                >
                    <h2 className="text-xl font-semibold text-gray-700 mb-4 flex items-center">
                        💰 Thống kê tiền phạt theo tháng
                    </h2>
                    <p>Tổng tiền phạt: {totalFines}</p>
                    <Line data={finesData} options={lineOptions} />
                </motion.div>
            </div>
        </div>
    );
}

export default Chart;
