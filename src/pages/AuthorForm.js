import React, { useState } from 'react';
import { TextField, Button, Box, Divider, Grid, Typography } from '@mui/material';
import axios from './axiosInstance';
import UploadImage from './UploadImage';
import AuthorList from './AuthorList';

const AuthorForm = () => {
  const [name, setName] = useState('');
  const [pic, setPic] = useState(null);
  const [nationality, setNationality] = useState('');
  const [representativeWork, setRepresentativeWork] = useState('');
  const [bio, setBio] = useState('');
  const [refreshList, setRefreshList] = useState(false);
  const [error, setError] = useState(null);

  const handleAuthorSubmit = async (e) => {
    e.preventDefault();

    if (!name || !pic || !nationality || !representativeWork || !bio) {
      setError('请填写所有必填字段');
      return;
    }

    const response = await axios.get(`/api/authors?name=${encodeURIComponent(name)}`);
    if (response.data.length > 0) {
      setError('Author with the same name already exists.');
      return;
    }

    setError(null);
    const formData = new FormData();
    formData.append('name', encodeURIComponent(name));
    formData.append('pic', pic);
    formData.append('nationality', encodeURIComponent(nationality));
    formData.append('representativeWork', encodeURIComponent(representativeWork));
    formData.append('bio', encodeURIComponent(bio));

    try {
      const response = await axios.post('/api/authors', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });

      console.log('作者信息提交成功:', response.data);
      setError(null);
      setName('');
      setPic(null);
      setNationality('');
      setRepresentativeWork('');
      setBio('');
      setRefreshList(true);
    } catch (error) {
      console.error('作者信息提交出错:', error);
      // Handle error
      setError(`作者信息提交失败：${error.message}`);
    }
  };

  return (
    <Box p={3}>
      <Typography variant="h4">作者信息管理</Typography>
      <form onSubmit={handleAuthorSubmit}>
        <Grid container spacing={2}>
          <Grid item xs={12} mt={2}>
            <TextField
              label="名字"
              variant="outlined"
              fullWidth
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              label="国籍"
              variant="outlined"
              fullWidth
              value={nationality}
              onChange={(e) => setNationality(e.target.value)}
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              label="代表作" // New attribute
              variant="outlined"
              fullWidth
              value={representativeWork}
              onChange={(e) => setRepresentativeWork(e.target.value)} // New attribute
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              label="生平简介"
              variant="outlined"
              multiline
              rows={4}
              fullWidth
              value={bio}
              onChange={(e) => setBio(e.target.value)}
            />
          </Grid>
          <Grid item xs={12}>
            <UploadImage onImageSelect={(file) => setPic(file)} />
          </Grid>
          <Grid item xs={12}>
            <Button variant="contained" color="primary" type="submit">
              新增作者信息
            </Button>
          </Grid>
        </Grid>
        {error && (
          <Box mt={2}>
            <Typography variant="body1" color="error">
              {error}
            </Typography>
          </Box>
        )}
      </form>
      <Box my={3}>
        <Divider />
        <AuthorList refresh={refreshList} />
      </Box>
    </Box>
  );
};

export default AuthorForm;
