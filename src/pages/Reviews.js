import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Button, Container, Grid, Typography } from '@mui/material';

const Reviews = () => {
  const [reviews, setReviews] = useState([]);

  useEffect(() => {
    fetchReviews();
  }, []);

  const fetchReviews = async () => {
    try {
      const response = await axios.get('/api/reviews');
      setReviews(response.data.excerpts);
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
        {reviews.map((review) => (
          <Grid item xs={12} md={6} key={review._id}>
            <div>
              <Typography variant="h6">{review.bookTitle}</Typography>
              <Typography>{review.content}</Typography>
              <Button variant="outlined" color="primary" onClick={() => handleDeleteReview(review._id)}>
                删除
              </Button>
            </div>
          </Grid>
        ))}
      </Grid>
    </Container>
  );
};

export default Reviews;
