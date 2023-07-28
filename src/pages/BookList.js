import React, { useState, useEffect } from 'react';
import { makeStyles } from '@mui/styles';
import { Card, CardActionArea, CardContent, CardMedia, Typography, IconButton, Button, Box, Grid } from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import axios from './axiosInstance';

const useStyles = makeStyles((theme) => ({
  bookCardContainer: {
    maxWidth: 600,
    padding: theme.spacing(2),
    marginBottom: theme.spacing(2),
    borderRadius: 10, // Set the desired border radius value
  },
  bookCard: {
    display: 'flex',
    alignItems: 'flex-start',
    width: 500,
    padding: theme.spacing(0),
    marginBottom: theme.spacing(2),
  },
  bookCover: {
    flex: '0 0 auto',
    marginRight: theme.spacing(2),
    width: 153.6, // Set the width of the book cover based on 1536 × 2048 aspect ratio
    height: 204.8, // Set the height of the book cover based on 1536 × 2048 aspect ratio
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
  },
}));

const BookList = ({ refresh }) => {
  const classes = useStyles();
  const [books, setBooks] = useState([]);

  useEffect(() => {
    fetchBooks();
  }, [refresh]);

  const fetchBooks = async () => {
    try {
      const response = await axios.get('/api/books');
      setBooks(response.data);
      console.log(response.data);
    } catch (error) {
      console.error('获取书籍信息失败:', error);
    }
  };

  const handleDelete = async (name) => {
    try {
      console.log(`handleDelete:${name}`);
      await axios.delete(`/api/authors/${name}`);
      console.log(`delete:${name}`);
      fetchBooks();
    } catch (error) {
      console.error('删除书籍信息失败:', error);
    }
  };

  const handleEdit = (id) => {
    console.log('编辑书籍信息ID:', id);
  };

  const imageHost = 'http://localhost:5555';

  return (
    <div>
      <Typography variant="h5" gutterBottom>
        书籍列表
      </Typography>
      <Typography variant="body1" gutterBottom>
        总共有 {books.length} 本书
      </Typography>
      {books.map((book, index) => {
        const imageUrl = `${imageHost}/${book.pic}`;
        return (
          <Card key={book._id} className={classes.bookCardContainer}>
            <CardActionArea className={classes.actionArea}>
              <div>
                <div key={book._id} className={classes.bookCard}>
                  <img className={classes.bookCover} src={imageUrl} alt={book.name} />
                  <div className={classes.bookDetails}>
                    <Typography variant="h5" component="h2">
                      {book.title}
                    </Typography>
                    <Typography variant="body2" color="textSecondary">
                      编号：{index + 1}
                    </Typography>
                    <Typography variant="body2" color="textSecondary">
                      作者：{book.authors}
                    </Typography>
                    <Typography variant="body2" color="textSecondary">
                      出版信息：{book.publisherInfo}
                    </Typography>
                    <Typography variant="body2" color="textSecondary">
                      ISBN：{book.isbn}
                    </Typography>
                    <Typography variant="body2" color="textSecondary">
                      标签：{book.tags}
                    </Typography>
                    <Typography variant="body2" color="textSecondary">
                      专题：{book.topics}
                    </Typography>
                    <Typography variant="body2" color="textSecondary">
                      阅读状态：{book.readingStatus}
                    </Typography>
                    <Typography variant="body2" color="textSecondary">
                      阅读进度：{book.readingProgress}
                    </Typography>
                  </div>
                  <div className={classes.bookActions}>
                    <IconButton aria-label="删除" color="secondary" onClick={() => handleDelete(book.name)}>
                      <DeleteIcon />
                    </IconButton>
                    <IconButton aria-label="编辑" color="primary" onClick={() => handleEdit(book.name)}>
                      <EditIcon />
                    </IconButton>
                  </div>
                </div>
                <div key={book._id} className={classes.bookCard}>
                  <div className={classes.bookDetails}>
                    <Typography variant="body2" color="textSecondary">
                      书评：{book.reviews}
                    </Typography>
                    <Typography variant="body2" color="textSecondary">
                      书摘：{book.excerpts}
                    </Typography>
                    <Typography variant="body2" color="textSecondary">
                      购买日期：{book.purchaseYear}
                    </Typography>
                    <Typography variant="body2" color="textSecondary">
                      出版日期：{book.publicationYear}
                    </Typography>
                  </div>
                </div>
              </div>
            </CardActionArea>
          </Card>
        );
      })}
    </div>
  );
};

export default BookList;
