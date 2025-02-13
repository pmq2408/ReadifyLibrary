import React, { useState } from 'react';
import { Link } from 'react-router-dom';

export const BookSearch = () => {
    const [books, setBooks] = useState([
        { id: 1, title: 'Dune', author: 'Frank Herbert', borrowed: false },
        { id: 2, title: '1984', author: 'George Orwell', borrowed: false },
        { id: 3, title: 'Brave New World', author: 'Aldous Huxley', borrowed: false },
        { id: 4, title: 'The Great Gatsby', author: 'F. Scott Fitzgerald', borrowed: false },
        { id: 5, title: 'To Kill a Mockingbird', author: 'Harper Lee', borrowed: false },
        { id: 6, title: 'Moby-Dick', author: 'Herman Melville', borrowed: false },
        { id: 7, title: 'Pride and Prejudice', author: 'Jane Austen', borrowed: false },
        { id: 8, title: 'The Catcher in the Rye', author: 'J.D. Salinger', borrowed: false },
        { id: 9, title: 'Lord of the Flies', author: 'William Golding', borrowed: false },
        { id: 10, title: 'Fahrenheit 451', author: 'Ray Bradbury', borrowed: false }
    ]);
    const [search, setSearch] = useState('');

    const handleBorrow = (id) => {
        setBooks(books.map(book => book.id === id ? { ...book, borrowed: !book.borrowed } : book));
    };

    const filteredBooks = books.filter(book =>
        book.title.toLowerCase().includes(search.toLowerCase()) ||
        book.author.toLowerCase().includes(search.toLowerCase())
    );

    return (
        <div className="p-6">
            <h2 className="text-2xl font-bold mb-4">Danh sách Sách</h2>
            <input
                type="text"
                placeholder="Tìm kiếm sách..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="mb-4 p-2 border rounded w-full"
            />
            <Link to="../"><button className='bg-purple-500 text-white px-5 py-2 rounded-lg hover:bg-blue-600 transition-all'>Home</button></Link>
            <Link to="/booksearch"><button className='bg-red-500 text-white px-5 py-2 rounded-lg hover:bg-blue-600 transition-all'>Danh sách sách</button></Link>
            <Link to="/borrowBook"><button className='bg-blue-500 text-white px-5 py-2 rounded-lg hover:bg-blue-600 transition-all'>Danh sách sách đã mượn</button></Link>
            <Link to="/fineBooks"><button className='ml-2 bg-green-500 text-white px-5 py-2 rounded-lg hover:bg-blue-600 transition-all'>Tiền phạt</button></Link>

            <ul className="space-y-4">
                {filteredBooks.length > 0 ? (
                    filteredBooks.map(({ id, title, author, borrowed }) => (
                        <li key={id} className="flex justify-between items-center p-4 border rounded-lg shadow">
                            <div>
                                <h3 className="text-lg font-bold">{title}</h3>
                                <p className="text-sm text-gray-600">Tác giả: {author}</p>
                            </div>
                            <button
                                onClick={() => handleBorrow(id)}
                                className={`px-4 py-2 rounded-lg text-white ${borrowed ? 'bg-gray-500' : 'bg-blue-500 hover:bg-blue-600'}`}
                            >
                                {borrowed ? 'Đã Mượn' : 'Mượn Sách'}
                            </button>
                        </li>
                    ))
                ) : (
                    <p className="text-gray-500">Không tìm thấy sách phù hợp.</p>
                )}
            </ul>
        </div>
    );
};