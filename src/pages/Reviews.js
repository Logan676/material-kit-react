import React, { useEffect, useState } from 'react';
import { Button, Container, Grid, Typography } from '@mui/material';
import axios from './axiosInstance';

const Reviews = () => {
  const [reviews, setReviews] = useState([]);

  useEffect(() => {
    fetchReviews();
  }, []);

  const fetchReviews = async () => {
    try {
      console.log('获取书评列表');
      const response = await axios.get('/api/reviews');
      console.log('获取书评列表成功', response.data);
      setReviews(response.data.reviews);
    } catch (error) {
      console.error('获取书评列表失败：', error);
    }
  };

  const handleDeleteReview = async (id) => {
    try {
      await axios.delete(`/api/reviews/${id}`);
      fetchReviews();
    } catch (error) {
      console.error('删除书评失败：', error);
    }
  };

  return (
    <Container>
      <Typography variant="h4" gutterBottom>
        书评列表
      </Typography>
      <Grid container spacing={2}>
        {reviews?.map((review, index) => {
          return (
            <Grid item xs={12} md={6} key={review._id}>
              <div>
                <Typography variant="h6">{review.bookId}</Typography>
                <Typography>{review.bookTitle}</Typography>
                <Typography>{review.content}</Typography>
                <Button variant="outlined" color="primary" onClick={() => handleDeleteReview(review._id)}>
                  删除
                </Button>
              </div>
            </Grid>
          );
        })}
      </Grid>
    </Container>
  );
};

export default Reviews;
