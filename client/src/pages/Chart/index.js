import React, { useEffect, useState } from "react";
import { AgCharts } from "ag-charts-react";
import axios from "axios";
import { motion } from "framer-motion";
import "./index.css";

function Chart() {
  const [activeTab, setActiveTab] = useState("orders"); // Quản lý tab hiển thị
  const [orderData, setOrderData] = useState(null);
  const [totalOrder, setTotalOrder] = useState(0);
  const [finesData, setFinesData] = useState(null);
  const [totalFines, setTotalFines] = useState(0);
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchChartData = async () => {
      try {
        setLoading(true);
        const [ordersRes, totalOrdersRes, finesRes, totalFinesRes, booksRes] =
          await Promise.all([
            axios.get(
              `${process.env.REACT_APP_API_URL}/orders/chart-order-by-month`
            ),
            axios.get(`${process.env.REACT_APP_API_URL}/orders/getAll`),
            axios.get(
              `${process.env.REACT_APP_API_URL}/fines/chart-fines-by-month`
            ),
            axios.get(`${process.env.REACT_APP_API_URL}/fines/getAll`),
            axios.get(`${process.env.REACT_APP_API_URL}/books/books`),
          ]);

        setOrderData({
          autoSize: true,
          data: ordersRes.data.data.map((item) => ({
            month: `Tháng ${item.month}`,
            count: item.statuses.reduce((acc, s) => acc + s.count, 0),
          })),
          series: [
            {
              type: "bar",
              xKey: "month",
              yKey: "count",
              yName: "Số đơn hàng",
              fill: "#3498db",
              strokeWidth: 0,
              cornerRadius: 6,
              shadow: {
                enabled: true,
                color: "rgba(0,0,0,0.1)",
                xOffset: 0,
                yOffset: 2,
                blur: 4,
              },
            },
            {
              type: "line",
              xKey: "month",
              yKey: "count",
              yName: "Xu hướng đơn hàng",
              stroke: "#2ecc71",
              strokeWidth: 3,
              marker: {
                size: 6,
                fill: "#2ecc71",
                stroke: "#fff",
                strokeWidth: 2,
              },
            },
          ],
          legend: { position: "bottom" },
          theme: {
            palette: {
              fills: ["#3498db", "#2ecc71"],
              strokes: ["#3498db", "#2ecc71"],
            },
          },
        });
        setTotalOrder(totalOrdersRes.data.data.length);

        setFinesData({
          autoSize: true,
          data: finesRes.data.data.map((item) => ({
            month: `Tháng ${item.month}`,
            total: item.totalFinesAmount,
          })),
          series: [
            {
              type: "bar",
              xKey: "month",
              yKey: "total",
              yName: "Tổng tiền phạt",
              fill: "#e74c3c",
              strokeWidth: 0,
              cornerRadius: 6,
              shadow: {
                enabled: true,
                color: "rgba(0,0,0,0.1)",
                xOffset: 0,
                yOffset: 2,
                blur: 4,
              },
            },
            {
              type: "line",
              xKey: "month",
              yKey: "total",
              yName: "Xu hướng tiền phạt",
              stroke: "#f39c12",
              strokeWidth: 3,
              marker: {
                size: 6,
                fill: "#f39c12",
                stroke: "#fff",
                strokeWidth: 2,
              },
            },
          ],
          legend: { position: "bottom" },
          theme: {
            palette: {
              fills: ["#e74c3c", "#f39c12"],
              strokes: ["#e74c3c", "#f39c12"],
            },
          },
        });
        setTotalFines(totalFinesRes.data.data.length);
        setBooks(booksRes.data);
      } catch (error) {
        console.error("Lỗi khi tải dữ liệu:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchChartData();
  }, []);

  const tabs = [
    { key: "orders", label: "🛒 Đơn hàng", color: "#3498db" },
    { key: "fines", label: "💰 Tiền phạt", color: "#e74c3c" },
    { key: "books", label: "📚 Sách", color: "#2ecc71" },
  ];

  return (
    <div className="containerChart fade-in">
      <h1 className="chart-header">📊 Thống kê dữ liệu</h1>

      <div className="tab-navigation">
        {tabs.map((tab) => (
          <button
            key={tab.key}
            className={`tab-button ${activeTab === tab.key ? "active" : ""}`}
            onClick={() => setActiveTab(tab.key)}
            style={activeTab === tab.key ? { backgroundColor: tab.color } : {}}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {loading ? (
        <div className="chart-container">
          <div className="text-center py-8">
            <div className="spinner-border text-primary" role="status">
              <span className="visually-hidden">Đang tải...</span>
            </div>
          </div>
        </div>
      ) : (
        <>
          {activeTab === "orders" && orderData && (
            <div className="chart-container">
              <h2 className="chart-title">🛒 Thống kê đơn hàng theo tháng</h2>
              <div className="chart-stats">
                <div className="stat-card">
                  <div className="stat-value">{totalOrder}</div>
                  <div className="stat-label">Tổng số đơn hàng</div>
                </div>
              </div>
              <AgCharts options={orderData} />
            </div>
          )}

          {activeTab === "fines" && finesData && (
            <div className="chart-container">
              <h2 className="chart-title">💰 Thống kê tiền phạt theo tháng</h2>
              <div className="chart-stats">
                <div className="stat-card">
                  <div className="stat-value">{totalFines}</div>
                  <div className="stat-label">Tổng số đơn phạt</div>
                </div>
              </div>
              <AgCharts options={finesData} />
            </div>
          )}

          {activeTab === "books" && (
            <div className="chart-container">
              <h2 className="chart-title">📚 Thống kê số đầu sách</h2>
              <div className="table-container">
                <table className="data-table">
                  <thead>
                    <tr>
                      <th>📖 Tên sách</th>
                      <th className="text-center">📦 Tổng số</th>
                      <th className="text-center">📚 Sách còn lại</th>
                      <th className="text-right">💲 Giá</th>
                    </tr>
                  </thead>
                  <tbody>
                    {books.length > 0 ? (
                      books.map((book, index) => (
                        <tr key={index}>
                          <td>{book.title}</td>
                          <td className="text-center">{book.totalCopies}</td>
                          <td className="text-center">
                            {book.availableCopies}
                          </td>
                          <td className="text-right">
                            {book.price.toLocaleString()} VND
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan="4" className="text-center">
                          Không có dữ liệu
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
}

export default Chart;
