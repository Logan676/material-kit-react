import React, { useState, useEffect } from 'react';
import { makeStyles } from '@mui/styles';
import { Card, CardActionArea, CardContent, CardMedia, Typography, IconButton, Button, Box, Grid } from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import axios from './axiosInstance';

const useStyles = makeStyles((theme) => ({
  card: {
    display: 'flex',
    width: 500,
    height: 400,
    padding: theme.spacing(2),
    marginBottom: theme.spacing(2),
  },
  cardContent: {
    flex: '1 0 auto',
  },
  cardMedia: {
    width: 100,
    height: 100,
    borderRadius: 10,
    border: '1px solid #ccc',
    padding: 5,
  },
  actionArea: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
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
          <Card key={book._id} className={classes.card}>
            <CardActionArea className={classes.actionArea}>
              <div className={classes.cardContent}>
                <Typography variant="h5" component="h2">
                  {book.title}
                </Typography>
                <CardMedia className={classes.cardMedia} image={imageUrl} title={book.name} />
                <Typography variant="body2" gutterBottom>
                  编号：{index + 1}
                </Typography>
                <Typography variant="body2" color="textSecondary">
                  作者：{book.authors}
                </Typography>
                <Typography variant="body2" color="textSecondary">
                  标签：{book.tags}
                </Typography>
                <Typography variant="body2" color="textSecondary">
                  专题：{book.topics}
                </Typography>
                <Typography variant="body2" color="textSecondary">
                  阅读进度：{book.readingProgress}
                </Typography>
                <Typography variant="body2" color="textSecondary">
                  出版信息：{book.publisherInfo}
                </Typography>
                <Typography variant="body2" color="textSecondary">
                  isbn：{book.isbn}
                </Typography>
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
            </CardActionArea>
            <CardContent>
              <IconButton aria-label="删除" color="secondary" onClick={() => handleDelete(book.name)}>
                <DeleteIcon />
              </IconButton>
              <IconButton aria-label="编辑" color="primary" onClick={() => handleEdit(book.name)}>
                <EditIcon />
              </IconButton>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
};

export default BookList;
