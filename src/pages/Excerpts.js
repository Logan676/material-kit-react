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
    marginBottom: theme.spacing(2), // Add some space below the title
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

const Excerpts = () => {
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
        .map((excerpt, index) => (
          <Card key={excerpt._id} className={classes.card}>
            <CardActionArea className={classes.actionArea}>
              <CardContent>
                <Typography className={classes.cardTitle}>{`《${excerpt.bookTitle}》`}</Typography>
                <Typography className={classes.cardContent}>{excerpt.content}</Typography>
                <Typography className={classes.cardContent}>创建时间: {excerpt.createdAt}</Typography>
                <Typography className={classes.cardContent}>更新时间: {excerpt.updatedAt}</Typography>
              </CardContent>
            </CardActionArea>
            <IconButton aria-label="删除" color="secondary" onClick={() => handleDeleteExcerpt(excerpt._id)}>
              <DeleteIcon />
            </IconButton>
          </Card>
        ))}
    </Box>
  );
};

export default Excerpts;
