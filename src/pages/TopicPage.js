import React, { useEffect, useState } from 'react';
import axios from 'axios';

const TopicPage = () => {
  const [books, setBooks] = useState([]);
  const [filteredBooks, setFilteredBooks] = useState([]);
  const [selectedTag, setSelectedTag] = useState('');

  useEffect(() => {
    fetchBooks();
  }, []);

  const fetchBooks = async () => {
    try {
      const response = await axios.get('/api/books');
      setBooks(response.data);
      setFilteredBooks(response.data);
    } catch (error) {
      console.error(error);
    }
  };

  const filterBooksByTag = (tag) => {
    if (tag === selectedTag) {
      setSelectedTag('');
      setFilteredBooks(books);
    } else {
      setSelectedTag(tag);
      const filtered = books.filter((book) => book.tag === tag);
      setFilteredBooks(filtered);
    }
  };

  return (
    <div>
      <h1>专题页面</h1>
      <div>
        <h3>标签:</h3>
        <ul>
          <li onClick={() => filterBooksByTag('tag1')}>Tag 1</li>
          <li onClick={() => filterBooksByTag('tag2')}>Tag 2</li>
          {/* 其他标签 */}
        </ul>
      </div>
      <div>
        <h3>过滤后的书籍:</h3>
        {filteredBooks.map((book) => (
          <div key={book._id}>
            <h4>{book.title}</h4>
            <p>作者: {book.author}</p>
            {/* 其他书籍信息 */}
          </div>
        ))}
      </div>
    </div>
  );
};

export default TopicPage;
