import React, { useEffect, useState } from 'react';
import { makeStyles } from '@mui/styles';
import { Box, Button, Grid, Typography, Card, CardActionArea, CardContent, IconButton } from '@mui/material';
import { format } from 'date-fns';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import QuoteCard from '../components/QuoteCard';
import axios from './axiosInstance';

const useStyles = makeStyles((theme) => ({
  card: {
    display: 'flex',
    flexDirection: 'column',
    position: 'relative',
    marginBottom: '1rem',
  },
  cardContent: {
    position: 'absolute',
    bottom: 0,
    right: 50,
    fontStyle: 'italic',
    color: 'gray',
    fontSize: '0.5rem',
    marginBottom: '1rem',
  },
  cardActions: {
    display: 'flex',
    justifyContent: 'space-between', // Horizontal space between items
    alignItems: 'flex-start',
    marginTop: '1rem',
    marginBottom: '3rem',
  },
  quoteCardContainer: {
    flex: 1, // Take available space
  },
  deleteButton: {
    alignSelf: 'flex-end',
  },
  locationTag: {
    alignSelf: 'flex-end', // Align to the right
    color: 'gray',
    fontSize: '0.8rem',
    marginBottom: '1rem',
    right: 50,
  },
  smallText: {
    fontSize: '10px', // Adjust the font size as needed
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
            const formattedUpdatedAt = format(new Date(review.updatedAt), 'yyyy-MM-dd HH:mm:ss');
            return (
              <Card className={classes.card} key={review._id}>
                <div className={classes.cardActions}>
                  <div className={classes.quoteCardContainer}>
                    <QuoteCard text={review.content} author={`《${review.bookTitle}》`} />
                  </div>
                  <IconButton
                    aria-label="删除"
                    color="secondary"
                    onClick={() => handleDeleteReview(review._id)}
                    className={classes.deleteButton}
                  >
                    <DeleteIcon />
                  </IconButton>
                </div>
                <div className={classes.cardContent}>
                  <Typography className={classes.smallText}>所在位置: {review.location}</Typography>
                  <Typography className={classes.smallText}>更新时间: {formattedUpdatedAt}</Typography>
                </div>
              </Card>
            );
          })}
      </div>
    </Box>
  );
};

export default ReviewListPage;
