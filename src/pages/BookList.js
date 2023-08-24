import React, { useState, useEffect } from 'react';
import { makeStyles } from '@mui/styles';
import { Card, CardActionArea, CardContent, CardMedia, Typography, IconButton, Button, Box, Grid } from '@mui/material';
import { Link } from 'react-router-dom';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import axios from './axiosInstance';
import { imageHost } from './utils';

const useStyles = makeStyles((theme) => ({
  header: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: theme.spacing(2),
  },
  lineStyle: {
    display: 'flex',
    color: 'black',
    // justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: theme.spacing(2),
  },
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
  bookTextContainer: {
    color: 'black',
    marginBottom: theme.spacing(2),
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

const BookList = ({ refresh, entityId, from }) => {
  const classes = useStyles();
  const [books, setBooks] = useState([]);
  const [listStyle, setListStyle] = useState('card'); // 默认是卡片样式

  useEffect(() => {
    fetchBooks();
  }, [refresh, from, entityId]);

  const fetchBooks = async () => {
    try {
      if (from === 'publishers' || from === 'authors' || from === 'tags' || from === 'topics') {
        const response = await axios.get(`/api/${from}/${entityId}`);
        const bookIds = response.data.bookId.split(',');
        const bookObjects = await fetchBookObjects(bookIds);
        console.log('bookObjects:', bookObjects);
        setBooks(bookObjects);
        return;
      }

      const response = await axios.get('/api/books');

      // 将购买年份转换为时间戳并按照时间戳排序
      // const sortedBooks = response.data.sort((a, b) => {
      //   const timestampA = getTimestampFromPurchaseYear(a.purchaseYear);
      //   const timestampB = getTimestampFromPurchaseYear(b.purchaseYear);
      //   return timestampB - timestampA;
      // });

      setBooks(response.data);
    } catch (error) {
      console.error('获取书籍信息失败:', error);
    }
  };

  // 在合适的位置定义一个函数，用于将购买年份字符串转换为时间戳
  const getTimestampFromPurchaseYear = (purchaseYear) => {
    const [year, month, day] = purchaseYear.split('-').map(Number);
    return new Date(year, month - 1, day).getTime(); // 月份从0开始，需要减1
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
  const toggleListStyle = () => {
    setListStyle(listStyle === 'card' ? 'text' : 'card');
  };

  return (
    <div>
      <div className={classes.header}>
        <Typography variant="body1" gutterBottom>
          总共有 {books.length} 本书
        </Typography>
        <Button variant="outlined" onClick={toggleListStyle}>
          切换列表样式
        </Button>
      </div>
      {books.map((book, index) => {
        const imageUrl = `${imageHost}/${book.pic}`;
        const bookDetailsPath = `/dashboard/bookbrowse/${book._id}`;
        return (
          <Link key={book._id} to={bookDetailsPath} className={classes.link}>
            {listStyle === 'card' ? (
              <Card key={book._id} className={classes.bookCardContainer}>
                <CardActionArea className={classes.actionArea}>
                  <div>
                    <div key={`div1_${book._id}`} className={classes.bookCard}>
                      <img className={classes.bookCover} src={imageUrl} alt={book.name} />
                      <div className={classes.bookDetails}>
                        <Typography variant="h5" component="h2">
                          {index + 1}. 《{book.title}》
                        </Typography>
                        <Typography variant="body2" color="textSecondary">
                          作者：{book.authors}
                        </Typography>
                        <Typography variant="body2" color="textSecondary">
                          书评：{book.reviews}
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
            ) : (
              <div key={book._id} className={classes.lineStyle}>
                <Typography variant="body2" component="body2">
                  {index + 1}.
                </Typography>
                <Typography variant="body2" component="body2">
                  《{book.title}》
                </Typography>
              </div>
            )}
          </Link>
        );
      })}
    </div>
  );
};

export default BookList;
