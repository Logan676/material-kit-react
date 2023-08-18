import React, { useState } from 'react';
import { Typography, Divider, Box } from '@mui/material';
import PublisherList from './PublisherList';

const PublisherPage = () => {
  return (
    <Box p={3}>
      <Typography variant="h4" gutterBottom>
        出版社列表
      </Typography>
      <Box my={3}>
        <PublisherList />
      </Box>
    </Box>
  );
};

export default PublisherPage;
