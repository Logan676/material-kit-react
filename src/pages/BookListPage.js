import React from 'react';
import { Box, Typography } from '@mui/material';
import { useParams, useLocation } from 'react-router-dom';
import BookList from './BookList';

const BookListPage = () => {
  const { id } = useParams();
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const from = searchParams.get('from');

  return (
    <Box p={3}>
      <Typography variant="h4">书籍列表</Typography>
      <Box my={3}>
        <BookList from={from} entityId={id} />
      </Box>
    </Box>
  );
};

export default BookListPage;
