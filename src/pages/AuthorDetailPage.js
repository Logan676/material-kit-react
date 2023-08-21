import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { Typography, Box } from '@mui/material';
import AuthorForm from './AuthorForm';
import axios from './axiosInstance';

const AuthorDetailPage = () => {
  const { id } = useParams();
  const [authorDetail, setAuthorDetail] = useState(null);

  useEffect(() => {
    fetchAuthorDetails();
  }, []);

  const fetchAuthorDetails = async () => {
    try {
      const response = await axios.get(`/api/authors/${id}`);
      console.log('获取作者详情成功:', response);
      setAuthorDetail(response.data);
    } catch (error) {
      console.error('获取作者详情失败:', error);
    }
  };

  if (!authorDetail) {
    return <div>Loading...</div>;
  }

  return (
    <Box p={3}>
      <Typography variant="h4">作者详情</Typography>
      <Box my={3}>
        <AuthorForm selectedAuthor={authorDetail} />
      </Box>
    </Box>
  );
};

export default AuthorDetailPage;
