import React, { useState, useEffect } from 'react';
import { TextField, Button, Box, Divider, Grid, Typography } from '@mui/material';
import AuthorList from './AuthorList';

const AuthorListPage = () => {
  return (
    <Box p={3}>
      <Typography variant="h4">作者信息管理</Typography>
      <Box my={3}>
        <AuthorList />
      </Box>
    </Box>
  );
};

export default AuthorListPage;
