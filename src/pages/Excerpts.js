import React, { useEffect, useState } from 'react';
import { Button, Container, Grid, Typography } from '@mui/material';
import axios from './axiosInstance';

const Excerpts = () => {
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
    <Container>
      <Typography variant="h4" gutterBottom>
        书摘列表
      </Typography>
      <Grid container spacing={2}>
        {excerpts.map((excerpt, index) => (
          <Grid item xs={12} md={6} key={excerpt._id}>
            <div>
              <Typography variant="h6">{excerpt.bookId}</Typography>
              <Typography>{excerpt.bookTitle}</Typography>
              <Typography>{excerpt.content}</Typography>
              <Button variant="outlined" color="primary" onClick={() => handleDeleteExcerpt(excerpt._id)}>
                删除
              </Button>
            </div>
          </Grid>
        ))}
      </Grid>
    </Container>
  );
};

export default Excerpts;
