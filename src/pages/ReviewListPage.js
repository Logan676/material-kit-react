import React, { useEffect, useState } from 'react';
import { makeStyles } from '@mui/styles';
import { Box, Button, Grid, Typography, Card, CardActionArea, CardContent, IconButton } from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import axios from './axiosInstance';

const useStyles = makeStyles((theme) => ({
  card: {
    display: 'flex',
    // height: 200,
    padding: theme.spacing(2),
    marginBottom: theme.spacing(2),
    alignItems: 'center', // Align items vertically in the card
  },
  cardTitle: {
    fontWeight: 'bold',
    fontSize: '1.2rem', // Increase font size for the title
    marginBottom: theme.spacing(1), // Add some space below the title
  },
  cardContent: {
    flex: 1,
    fontSize: '1rem', // Adjust font size for the content
    marginBottom: theme.spacing(1),
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

const ReviewListPage = () => {
  const classes = useStyles();

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
    <Box p={3}>
      <Typography variant="h4">书评列表</Typography>
      <div>
        <Typography variant="body1" gutterBottom>
          总共有 {reviews.length} 条书评，已过滤的无效内容
        </Typography>
        {reviews
          ?.filter((review) => {
            return review.content !== '没写';
          })
          .map((review, index) => {
            return (
              <Card key={review._id} className={classes.card}>
                <CardActionArea className={classes.actionArea}>
                  <CardContent>
                    <Typography className={classes.cardTitle}>{`《${review.bookTitle}》`}</Typography>
                    <Typography className={classes.cardContent}>{review.content}</Typography>
                    <Typography className={classes.cardContent}>创建时间: {review.createdAt}</Typography>
                    <Typography className={classes.cardContent}>更新时间: {review.updatedAt}</Typography>
                  </CardContent>
                  <IconButton aria-label="删除" color="secondary" onClick={() => handleDeleteReview(review._id)}>
                    <DeleteIcon />
                  </IconButton>
                </CardActionArea>
              </Card>
            );
          })}
      </div>
    </Box>
  );
};

export default ReviewListPage;
