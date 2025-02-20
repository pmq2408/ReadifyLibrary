import React, { useEffect, useState } from "react";
import { Bar } from "react-chartjs-2";
import { Line } from "react-chartjs-2";
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, PointElement, LineElement, Title, Tooltip, Legend } from "chart.js";

// Register necessary Chart.js components
ChartJS.register(CategoryScale, LinearScale, BarElement, PointElement, LineElement, Title, Tooltip, Legend);

export const StatisticsPage = () => {
    const [barChartData, setBarChartData] = useState({ labels: [], datasets: [] });
    const [lineChartData, setLineChartData] = useState({ labels: [], datasets: [] });
    const [totalOrder, setTotalOrder] = useState(30);  // Hardcoded total order value
    const [totalFines, setTotalFines] = useState(0);

    useEffect(() => {
        // Hardcoded data for Bar Chart
        const monthlyData = [
            { month: 1, statuses: [{ status: "Completed", count: 10 }, { status: "Pending", count: 5 }] },
            { month: 2, statuses: [{ status: "Completed", count: 8 }, { status: "Pending", count: 6 }] },
            { month: 3, statuses: [{ status: "Completed", count: 12 }, { status: "Pending", count: 4 }] },
            { month: 4, statuses: [{ status: "Completed", count: 15 }, { status: "Pending", count: 3 }] },
            { month: 5, statuses: [{ status: "Completed", count: 9 }, { status: "Pending", count: 5 }] },
            { month: 6, statuses: [{ status: "Completed", count: 13 }, { status: "Pending", count: 2 }] },
        ];

        const barLabels = monthlyData.map((item) => `Month ${item.month}`);
        const statuses = Array.from(new Set(monthlyData.flatMap((item) => item.statuses.map((status) => status.status))));

        const barDatasets = statuses.map((status) => ({
            label: status,
            data: monthlyData.map((month) => {
                const statusData = month.statuses.find((s) => s.status === status);
                return statusData ? statusData.count : 0;
            }),
            backgroundColor: "rgba(`${Math.floor(Math.random() * 255)}`, `${Math.floor(Math.random() * 255)}`, `${Math.floor(Math.random() * 255)}`, 0.6)",
            borderColor: "rgba(75, 192, 192, 1)",
            borderWidth: 1,
        }));

        setBarChartData({ labels: barLabels, datasets: barDatasets });

        // Hardcoded data for Line Chart (Fines)
        const monthlyFinesData = [
            { month: 1, totalFinesAmount: 500 },
            { month: 2, totalFinesAmount: 450 },
            { month: 3, totalFinesAmount: 700 },
            { month: 4, totalFinesAmount: 600 },
            { month: 5, totalFinesAmount: 850 },
            { month: 6, totalFinesAmount: 500 },
        ];

        const lineLabels = monthlyFinesData.map((item) =>` Month ${item.month}`);
        const lineData = monthlyFinesData.map((item) => item.totalFinesAmount);

        setLineChartData({
            labels: lineLabels,
            datasets: [
                {
                    label: "Tổng tiền phạt",
                    data: lineData,
                    borderColor: "rgba(75, 192, 192, 1)",
                    backgroundColor: "rgba(75, 192, 192, 0.2)",
                    tension: 0.4,
                    fill: true,
                },
            ],
        });

        setTotalFines(5000); // Hardcoded total fines value
    }, []);

    const barChartOptions = {
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

    const lineChartOptions = {
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
        <div style={styles.container}>
            <h1 style={styles.title}>Trang Thống Kê</h1>
            <div style={styles.statsRow}>
                <p style={styles.totalText}>Tổng số đơn hàng: <span style={styles.highlightText}>{totalOrder}</span></p>
                <p style={styles.totalText}>Tổng tiền phạt: <span style={styles.highlightText}>{totalFines}</span></p>
            </div>
            <div style={styles.chartContainer}>
                <div style={styles.chart}>
                    <Bar data={barChartData} options={barChartOptions} />
                </div>
                <div style={styles.chart}>
                    <Line data={lineChartData} options={lineChartOptions} />
                </div>
            </div>
        </div>
    );
};

// CSS in JS styles
const styles = {
    container: {
        padding: "20px",
        textAlign: "center",
        fontFamily: "'Arial', sans-serif",
    },
    title: {
        fontSize: "2rem",
        fontWeight: "bold",
        color: "#333",
        marginBottom: "20px",
    },
    statsRow: {
        display: "flex",
        justifyContent: "center",
        gap: "40px",
        marginBottom: "20px",
    },
    totalText: {
        fontSize: "1.5rem",
        fontWeight: "normal",
        color: "#333",
    },
    highlightText: {
        fontWeight: "bold",
        color: "#2a9d8f",
    },
    chartContainer: {
        display: "flex",
        justifyContent: "space-around",
        gap: "20px",
        padding: "20px",
    },
    chart: {
        width: "45%",
        minWidth: "300px",
    },
};