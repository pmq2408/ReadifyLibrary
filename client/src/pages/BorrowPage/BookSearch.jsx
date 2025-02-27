import React, { useState } from 'react';

export const BookSearch = () => {
    const [books, setBooks] = useState([
        { id: 1, title: 'Dune', author: 'Frank Herbert', quantity: 2, image: 'https://ph-test-11.slatic.net/p/0c7cc8f1fea1ea5b0714aa62ba45fd10.jpg', description: 'A science fiction novel about politics and power.' },
        { id: 2, title: '1984', author: 'George Orwell', quantity: 1, image: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQzoLINi5V0eP2ckXAxW4bFwAUbwlQNXfOvyOFZ35YhXEIoEO7L9rQEX9SVk6GTlUzhNHnC&s', description: 'A dystopian novel about totalitarian government control.' },
        { id: 3, title: 'Brave New World', author: 'Aldous Huxley', quantity: 0, image: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRAOhVs4pNGT2YDvb1zD3Bfa28u0bmHN6_C0NLTeoTkR1El1-O08zMeaN9YY-j3GwK65rlbtg&s', description: 'A futuristic novel about a seemingly perfect but controlled world.' }
    ]);
    const [search, setSearch] = useState('');
    const [selectedBook, setSelectedBook] = useState(null);
    const [message, setMessage] = useState('');

    const handleBorrow = (id) => {
        setBooks(books.map(book =>
            book.id === id
                ? book.quantity > 0
                    ? { ...book, quantity: book.quantity - 1 }
                    : book
                : book
        ));

        const book = books.find(book => book.id === id);
        if (book.quantity > 0) {
            setMessage('📚 Mượn sách thành công!');
        } else {
            setMessage('⚠️ Sách đã hết!');
        }

        setTimeout(() => setMessage(''), 3000);
        setSelectedBook(null);
    };

    const filteredBooks = books.filter(book =>
        book.title.toLowerCase().includes(search.toLowerCase()) ||
        book.author.toLowerCase().includes(search.toLowerCase())
    );

    return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 p-4">
            <div className="w-full  bg-white p-6 rounded-lg shadow-lg" style={{ width: "1250px" }}>
                <h2 className="text-2xl font-bold mb-4 text-center">Danh sách Sách</h2>
                <input
                    type="text"
                    placeholder="Tìm kiếm sách..."
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    className="mb-6 p-2 border rounded-lg w-full"
                />
                {message && <p className="text-center text-lg font-semibold text-blue-600">{message}</p>}
                <ul className="space-y-4">
                    {filteredBooks.length > 0 ? (
                        filteredBooks.map(({ id, title, author, image, quantity }) => (
                            <li key={id} className="flex items-center p-4 border rounded-lg shadow-md cursor-pointer" onClick={() => setSelectedBook(id)}>
                                <img src={image} alt={title} className="w-16 h-16 mr-4 rounded" />
                                <div className="flex-1">
                                    <h3 className="text-lg font-bold">{title}</h3>
                                    <p className="text-gray-600">Tác giả: {author}</p>
                                    <p className="text-gray-600">Số lượng: {quantity}</p>
                                </div>
                            </li>
                        ))
                    ) : (
                        <p className="text-gray-500 text-center">Không tìm thấy sách phù hợp.</p>
                    )}
                </ul>
            </div>
            {selectedBook && (
                <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
                    <div className="bg-white p-6 rounded-lg shadow-lg max-w-md w-full">
                        <h3 className="text-xl font-bold mb-4">{books.find(book => book.id === selectedBook).title}</h3>
                        <p className="mb-4">{books.find(book => book.id === selectedBook).description}</p>
                        <button onClick={() => handleBorrow(selectedBook)}
                            className={`px-4 py-2 rounded-lg text-white text-lg transition-all duration-300 ${books.find(book => book.id === selectedBook).quantity > 0 ? 'bg-blue-500 hover:bg-blue-600' : 'bg-gray-500'}`}
                            disabled={books.find(book => book.id === selectedBook).quantity === 0}
                        >
                            {books.find(book => book.id === selectedBook).quantity > 0 ? 'Mượn Sách' : 'Sách Đã Hết'}
                        </button>
                        <button onClick={() => setSelectedBook(null)} className="ml-4 text-gray-700">Đóng</button>
                    </div>
                </div>
            )}
        </div>
    );
};
