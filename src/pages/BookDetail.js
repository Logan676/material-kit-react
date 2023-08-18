import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { makeStyles } from '@mui/styles';
import { Card, CardActionArea, CardContent, CardMedia, Typography, IconButton, Button, Box, Grid } from '@mui/material';
import BookFields from './BookFields';
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
    width: 135, // Set the width of the book cover based on 1536 × 2048 aspect ratio
    height: 197, // Set the height of the book cover based on 1536 × 2048 aspect ratio
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
      console.log('获取书籍详情:', response);
      setBookDetails(response.data);
    } catch (error) {
      console.error('获取书籍详情失败:', error);
    }
  };

  if (!bookDetail) {
    return <div>Loading...</div>;
  }
  const imageHost = 'http://localhost:5555';
  const imageUrl = `${imageHost}/${bookDetail.pic}`;
  return (
    <Box p={3}>
      <Typography variant="h4">书籍详情</Typography>
      <Box my={3}>
        <BookFields selectedBook={bookDetail} />
      </Box>
    </Box>
  );
};

export default BookDetail;
