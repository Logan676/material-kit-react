import React, { useEffect, useState } from 'react';
import { Box, Button, Grid, Typography, Card, CardActionArea, CardContent, IconButton } from '@mui/material';
import { makeStyles } from '@mui/styles';
import DeleteIcon from '@mui/icons-material/Delete';
import { format } from 'date-fns';
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

const ExcerptListPage = () => {
  const classes = useStyles();
  const [excerpts, setExcerpts] = useState([]);

  useEffect(() => {
    fetchExcerpts();
  }, []);

  const fetchExcerpts = async () => {
    try {
      const response = await axios.get('/api/excerpts');
      setExcerpts(response.data.excerpts);
    } catch (error) {
      console.error('获取书摘列表失败：', error);
    }
  };

  const handleDeleteExcerpt = async (id) => {
    try {
      await axios.delete(`/api/excerpts/${id}`);
      fetchExcerpts();
    } catch (error) {
      console.error('删除书摘失败：', error);
    }
  };

  return (
    <Box p={3}>
      <Typography variant="h4">书摘列表</Typography>
      <div>
        <Typography variant="body1" gutterBottom>
          总共有 {excerpts.length} 条书摘，已过滤的无效内容
        </Typography>
      </div>
      {excerpts
        .filter((excerpt) => {
          return excerpt.content !== '无';
        })
        .map((excerpt, index) => {
          const formattedUpdatedAt = format(new Date(excerpt.updatedAt), 'yyyy-MM-dd HH:mm:ss');
          return (
            <Card className={classes.card} key={excerpt._id}>
              <div className={classes.cardActions}>
                <div className={classes.quoteCardContainer}>
                  <QuoteCard text={excerpt.content} author={`《${excerpt.bookTitle}》`} />
                </div>
                <IconButton
                  aria-label="删除"
                  color="secondary"
                  onClick={() => handleDeleteExcerpt(excerpt._id)}
                  className={classes.deleteButton}
                >
                  <DeleteIcon />
                </IconButton>
              </div>
              <div className={classes.cardContent}>
                <Typography className={classes.smallText}>
                  {excerpt.chapter} 页码: {excerpt.page}
                </Typography>
                <Typography className={classes.smallText}>更新时间: {formattedUpdatedAt}</Typography>
              </div>
            </Card>
          );
        })}
    </Box>
  );
};

export default ExcerptListPage;
