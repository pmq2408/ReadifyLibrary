// src/pages/Homepage/NewsPage.js
import React, { useState } from 'react';

export const NewsPage = () => {
    const [newsList, setNewsList] = useState([
        { id: 1, image: 'https://tse4.mm.bing.net/th?id=OIP.OXhQlhan72WakN5SbtYEQAHaGt&pid=Api&P=0&h=180', title: 'Tin tức 1', content: 'Nội dung chi tiết của tin tức 1' },
        { id: 2, image: 'https://tse1.mm.bing.net/th?id=OIP.TTpcOl7--xWqZf2wqslokwHaFJ&pid=Api&P=0&h=180', title: 'Tin tức 2', content: 'Nội dung chi tiết của tin tức 2' }
    ]);
    const [newTitle, setNewTitle] = useState('');
    const [newContent, setNewContent] = useState('');

    const handleAdd = () => {
        const newId = newsList.length ? Math.max(...newsList.map(item => item.id)) + 1 : 1;
        const newNews = { id: newId, image: '', title: newTitle, content: newContent };
        setNewsList([...newsList, newNews]);
        setNewTitle('');
        setNewContent('');
    };

    const handleDelete = (id) => {
        setNewsList(newsList.filter(news => news.id !== id));
    };

    return (
        <div className="p-4 bg-white border rounded-lg shadow-md mt-5" style={{ width: "200%" }}>
            <h2 className="text-lg font-bold mb-4">Quản lý Tin tức</h2>
            <div className="mb-4 flex space-x-2">
                <input value={newTitle} onChange={(e) => setNewTitle(e.target.value)} placeholder="Tiêu đề" className="border px-2 py-1 rounded" />
                <input value={newContent} onChange={(e) => setNewContent(e.target.value)} placeholder="Nội dung" className="border px-2 py-1 rounded" />
                <button onClick={handleAdd} className="bg-green-500 text-white px-3 py-1 rounded hover:bg-green-600">Thêm</button>
            </div>
            <table className="w-full border border-gray-300 rounded-lg text-sm">
                <thead className="bg-gray-100 text-gray-700">
                    <tr>
                        <th className="p-2">#</th>
                        <th className="p-2">Ảnh</th>
                        <th className="p-2">Tiêu đề</th>
                        <th className="p-2">Nội dung</th>
                        <th className="p-2">Hành động</th>
                    </tr>
                </thead>
                <tbody>
                    {newsList.map(({ id, image, title, content }) => (
                        <tr key={id} className="border-t border-gray-300 hover:bg-gray-50">
                            <td className="p-2 text-center">{id}</td>
                            <td className="p-2 text-center"><img src={image} alt={title} className="w-16 h-16 rounded" /></td>
                            <td className="p-2">{title}</td>
                            <td className="p-2 line-clamp-2 max-w-xs">{content}</td>
                            <td className="p-2 text-center">
                                <button className="bg-blue-500 text-white px-2 py-1 rounded mr-1 hover:bg-blue-600">Sửa</button>
                                <button onClick={() => handleDelete(id)} className="bg-red-500 text-white px-2 py-1 rounded hover:bg-red-600">Xóa</button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};
