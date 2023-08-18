import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { makeStyles } from '@mui/styles';
import { Card, CardActionArea, CardContent, CardMedia, Typography, IconButton, Button, Box, Grid } from '@mui/material';
import PublisherInfoForm from './PublisherInfoForm';
import axios from './axiosInstance';

const PublisherDetailPage = () => {
  const { id } = useParams();
  const [publisherDetail, setPublisherDetails] = useState(null);

  useEffect(() => {
    fetchPublisherDetails();
  }, []);

  const fetchPublisherDetails = async () => {
    try {
      const response = await axios.get(`/api/publishers/${id}`);
      console.log('获取出版社详情:', response);
      setPublisherDetails(response.data);
    } catch (error) {
      console.error('获取出版社详情失败:', error);
    }
  };

  if (!publisherDetail) {
    return <div>Loading...</div>;
  }

  return (
    <Box p={3}>
      <Typography variant="h4">出版社详情</Typography>
      <Box my={3}>
        <PublisherInfoForm selectedPublisher={publisherDetail} />
      </Box>
    </Box>
  );
};

export default PublisherDetailPage;
