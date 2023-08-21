import React, { useState, useEffect } from 'react';
import { makeStyles } from '@mui/styles';
import { Card, CardActionArea, CardContent, CardMedia, Typography, IconButton, Button, Box, Grid } from '@mui/material';
import { Link } from 'react-router-dom';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import axios from './axiosInstance';
import { imageHost } from './utils';

const useStyles = makeStyles((theme) => ({
  bookCardContainer: {
    // maxWidth: 600,
    padding: theme.spacing(2),
    marginBottom: theme.spacing(2),
    borderRadius: 10, // Set the desired border radius value
    boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)', // Add a subtle box shadow
  },
  bookCard: {
    display: 'flex',
    alignItems: 'flex-start',
    // width: 100,
    padding: theme.spacing(0),
    // marginBottom: theme.spacing(2),
  },
  link: {
    textDecoration: 'none',
  },
  bookCover: {
    flex: '0 0 auto',
    marginRight: theme.spacing(2),
    width: 60, // Set the width of the book cover based on 1536 × 2048 aspect ratio
    height: 80, // Set the height of the book cover based on 1536 × 2048 aspect ratio
    borderRadius: 10,
    border: '1px solid #ccc',
    padding: 5,
  },
  bookDetails: {
    flex: '1 1 auto',
    display: 'flex',
    flexDirection: 'column',
  },
  bookActions: {
    flex: '0 0 auto',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'flex-end',
  },
  bookReview: {
    marginTop: theme.spacing(2),
    marginBottom: theme.spacing(2),
  },
  bookExcerpts: {
    marginTop: theme.spacing(2),
    marginBottom: theme.spacing(2),
    fontStyle: 'italic',
  },
}));

const BookList = ({ refresh, type, entityId }) => {
  const classes = useStyles();
  const [books, setBooks] = useState([]);

  useEffect(() => {
    fetchBooks();
  }, [refresh, type, entityId]);

  const fetchBooks = async () => {
    try {
      if (type === 'publishers' || type === 'authors' || type === 'tags' || type === 'topics') {
        const response = await axios.get(`/api/${type}/${entityId}`);
        const bookIds = response.data.bookIds.split(',');
        const bookObjects = await fetchBookObjects(bookIds);
        setBooks(bookObjects);
        return;
      }

      const response = await axios.get('/api/books');
      setBooks(response.data);
    } catch (error) {
      console.error('获取书籍信息失败:', error);
    }
  };

  const fetchBookObjects = async (bookIds) => {
    const bookObjects = await Promise.all(bookIds.map((id) => fetchBookDetails(id)));
    return bookObjects.filter((book) => book !== null);
  };

  const fetchBookDetails = async (bookId) => {
    try {
      const response = await axios.get(`/api/books/${bookId}`);
      return response.data;
    } catch (error) {
      console.error('获取书籍详情失败:', error);
      return null;
    }
  };

  const handleDelete = async (book) => {
    try {
      console.log('删除书籍信息:', book);
      await axios.delete(`/api/books/${book._id}`);
      console.log('删除书籍信息成功:', book);
      fetchBooks();
    } catch (error) {
      console.error('删除书籍信息失败:', error);
    }
  };

  const handleEdit = (book) => {
    console.log('编辑书籍信息:', book);
    // 这里的编辑是空实现，通过整个卡片的link来跳转到编辑页面
  };

  return (
    <div>
      <Typography variant="body1" gutterBottom>
        总共有 {books.length} 本书
      </Typography>
      {books.map((book, index) => {
        const imageUrl = `${imageHost}/${book.pic}`;
        const bookDetailsPath = `/dashboard/bookbrowse/${book._id}`;
        return (
          <Link key={book._id} to={bookDetailsPath} className={classes.link}>
            <Card key={book._id} className={classes.bookCardContainer}>
              <CardActionArea className={classes.actionArea}>
                <div>
                  <div key={`div1_${book._id}`} className={classes.bookCard}>
                    <img className={classes.bookCover} src={imageUrl} alt={book.name} />
                    <div className={classes.bookDetails}>
                      <Typography variant="h5" component="h2">
                        {book.title}
                      </Typography>
                      <Typography variant="body2" color="textSecondary">
                        作者：{book.authors}
                      </Typography>
                      <Typography variant="body2" color="textSecondary">
                        出版信息：{book.publisherInfo}
                      </Typography>
                    </div>
                    <div className={classes.bookActions}>
                      <IconButton aria-label="删除" color="secondary" onClick={() => handleDelete(book)}>
                        <DeleteIcon />
                      </IconButton>
                      <IconButton aria-label="编辑" color="primary" onClick={() => handleEdit(book)}>
                        <EditIcon />
                      </IconButton>
                    </div>
                  </div>
                </div>
              </CardActionArea>
            </Card>
          </Link>
        );
      })}
    </div>
  );
};

export default BookList;
