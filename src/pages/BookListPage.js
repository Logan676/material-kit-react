import React from 'react';
import { Box, Typography } from '@mui/material';
import BookList from './BookList';

const BookListPage = () => {
  return (
    <Box p={3}>
      <Typography variant="h4">书籍列表</Typography>
      <Box my={3}>
        <BookList />
      </Box>
    </Box>
  );
};

export default BookListPage;
