import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { makeStyles } from '@mui/styles';
import { Card, CardActionArea, CardContent, CardMedia, Typography, IconButton, Button, Box, Grid } from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import axios from './axiosInstance';

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
    marginBottom: theme.spacing(2),
  },
  link: {
    textDecoration: 'none',
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
    marginTop: theme.spacing(2), // Increase the top margin
    marginBottom: theme.spacing(2), // Increase the bottom margin
  },
  bookExcerpts: {
    marginTop: theme.spacing(2), // Increase the top margin
    marginBottom: theme.spacing(2), // Increase the bottom margin
    fontStyle: 'italic', // Add italic style to the excerpts text
  },
}));

const BookDetail = () => {
  const classes = useStyles();
  const { id } = useParams();
  const [bookDetail, setBookDetails] = useState(null);

  useEffect(() => {
    fetchBookDetails();
  }, []);

  const fetchBookDetails = async () => {
    try {
      const response = await axios.get(`/api/books/${id}`);
      setBookDetails(response.data);
    } catch (error) {
      console.error('获取书籍详情失败:', error);
    }
  };

  const handleDelete = async (book) => {
    try {
      console.log('删除书籍信息:', book);
      await axios.delete(`/api/books/${book._id}`);
      console.log('删除书籍信息成功:', book);
      fetchBookDetails();
    } catch (error) {
      console.error('删除书籍信息失败:', error);
    }
  };

  const handleEdit = (book) => {
    console.log('编辑书籍信息:', book);
    // onEdit(book);
  };

  if (!bookDetail) {
    return <div>Loading...</div>;
  }
  const imageHost = 'http://localhost:5555';
  const imageUrl = `${imageHost}/${bookDetail.pic}`;
  const bookDetailsPath = `/dashboard/books/${bookDetail._id}`;
  return (
    <Card key={bookDetail._id} className={classes.bookCardContainer}>
      {bookDetail.title}
      <CardActionArea className={classes.actionArea}>
        <div>
          <div key={`div1_${bookDetail._id}`} className={classes.bookCard}>
            <img className={classes.bookCover} src={imageUrl} alt={bookDetail.name} />
            <div className={classes.bookDetails}>
              <Typography variant="h5" component="h2">
                {bookDetail.title}
              </Typography>
              <Typography variant="body2" color="textSecondary">
                编号：{bookDetail._id}
              </Typography>
              <Typography variant="body2" color="textSecondary">
                书籍id：{bookDetail._id}
              </Typography>
              <Typography variant="body2" color="textSecondary">
                作者：{bookDetail.authors}
              </Typography>
              <Typography variant="body2" color="textSecondary">
                出版信息：{bookDetail.publisherInfo}
              </Typography>
              <Typography variant="body2" color="textSecondary">
                ISBN：{bookDetail.isbn}
              </Typography>

              <Typography variant="body2" color="textSecondary">
                评分：{bookDetail.rating}
              </Typography>
              <Typography variant="body2" color="textSecondary">
                阅读状态：{bookDetail.readingStatus}
              </Typography>
              <Typography variant="body2" color="textSecondary">
                阅读进度：{bookDetail.readingProgress}
              </Typography>
            </div>
            <div className={classes.bookActions}>
              <IconButton aria-label="删除" color="secondary" onClick={() => handleDelete(bookDetail)}>
                <DeleteIcon />
              </IconButton>
              <IconButton aria-label="编辑" color="primary" onClick={() => handleEdit(bookDetail)}>
                <EditIcon />
              </IconButton>
            </div>
          </div>
          <div key={`div2_${bookDetail._id}`} className={classes.bookCard}>
            <div className={classes.bookDetails}>
              <Typography variant="body2" color="textSecondary">
                标签：{bookDetail.tags}
              </Typography>
              <Typography variant="body2" color="textSecondary">
                专题：{bookDetail.topics}
              </Typography>
              <Typography variant="body2" color="textSecondary" className={classes.bookReview}>
                书评：{bookDetail.reviews}
              </Typography>
              <Typography variant="body2" color="textSecondary" className={classes.bookExcerpts}>
                书摘：{bookDetail.excerpts}
              </Typography>
              <Typography variant="body2" color="textSecondary">
                阅读日期：{bookDetail.purchaseYear}
              </Typography>
              <Typography variant="body2" color="textSecondary">
                出版日期：{bookDetail.publicationYear}
              </Typography>
            </div>
          </div>
        </div>
      </CardActionArea>
    </Card>
  );
};

export default BookDetail;
