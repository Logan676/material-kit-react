import React, { useEffect, useState } from 'react';
import axios from 'axios';

const BookList = () => {
  const [books, setBooks] = useState([]);

  useEffect(() => {
    fetchBooks();
  }, []);

  const fetchBooks = async () => {
    try {
      const response = await axios.get('/api/books');
      setBooks(response.data);
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div>
      <h1>书籍列表</h1>
      {books.map((book) => (
        <div key={book._id}>
          <h3>{book.title}</h3>
          <p>作者: {book.author}</p>
          {/* 其他书籍信息 */}
        </div>
      ))}
    </div>
  );
};

export default BookList;
