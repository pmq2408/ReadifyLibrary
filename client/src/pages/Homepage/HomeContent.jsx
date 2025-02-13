import React, { useState } from 'react';

export const HomeContent = () => {
    const [searchTerm, setSearchTerm] = useState('');

    const handleSearch = () => {
        alert(`Đang tìm kiếm sách: ${searchTerm}`);
    };

    const newsList = [
        { id: 1, title: 'Thông báo nâng cấp hệ thống', description: 'Nâng cấp hệ thống tìm kiếm thư viện FPT để cải thiện trải nghiệm.', image: "https://tse3.mm.bing.net/th?id=OIP.uHg9sCIUCaJEYqLdIJBmEQHaHa&pid=Api&P=0&h=180" },
        { id: 2, title: 'Hội thảo về thông tin số', description: 'Thư viện FPT tổ chức hội thảo về khai thác thông tin số.', image: "https://tse3.mm.bing.net/th?id=OIP.uHg9sCIUCaJEYqLdIJBmEQHaHa&pid=Api&P=0&h=180" },
        { id: 3, title: 'Lịch mượn sách Fall 2024', description: 'Thông báo lịch mượn sách giáo trình học kỳ Fall 2024.', image: "https://tse3.mm.bing.net/th?id=OIP.uHg9sCIUCaJEYqLdIJBmEQHaHa&pid=Api&P=0&h=180" }
    ];

    return (
        <div className="p-8 space-y-8 bg-gray-50 min-h-screen">
            {/* Search Section */}
            <div className="flex items-center gap-4">
                <input
                    type="text"
                    placeholder="Tìm kiếm sách..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="px-4 py-2 border rounded-lg w-full text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <button
                    onClick={handleSearch}
                    className="bg-blue-500 text-white px-5 py-2 rounded-lg hover:bg-blue-600 transition-all"
                >
                    Tìm kiếm
                </button>
            </div>

            {/* News Section */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {newsList.map((news) => (
                    <div key={news.id} className="bg-white rounded-2xl shadow-md border p-5 relative transition-transform transform hover:scale-105">
                        <span className="absolute top-2 left-2 bg-red-500 text-white text-xs font-bold px-2 py-1 rounded-full">
                            New
                        </span>
                        <img src={news.image} alt={news.title} className="w-50 h-48 object-cover rounded-t-lg" />
                        <h3 className="text-xl font-semibold mb-2 text-gray-800">
                            {news.title}
                        </h3>
                        <p className="text-sm text-gray-600 mb-3">
                            {news.description}
                        </p>
                    </div>
                ))}
            </div>

            {/* Video Section */}
            <p className="text-2xl font-semibold px-4 pt-4 pb-2">Video giới thiệu</p>
            <div className="bg-white rounded-2xl shadow-lg overflow-hidden flex justify-between">
                <iframe
                    className=" aspect-video border-t m-3  border-gray-200"
                    src="https://www.youtube.com/embed/dQw4w9WgXcQ"
                    allowFullScreen
                    style={{ width: "40%" }}
                ></iframe>
                <div>
                    <p className="text-2xl font-bold mb-2 text-gray-800 mt-2">Hướng dẫn sử dụng thư viện FPT</p>
                    <p className="text-base text-gray-700 mb-4">Chào mừng bạn đến với thư viện Đại học FPT! Dưới đây là hướng dẫn chi tiết về cách sử dụng các dịch vụ của thư viện.</p>
                    <button className="bg-green-500 text-white px-4 py-2 rounded-lg font-medium hover:bg-green-600 transition">Xem thêm</button>
                </div>
            </div>
        </div>
    );
};