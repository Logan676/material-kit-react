import React, { useState, useEffect } from 'react';
import { TextField, Button, Box, Divider, Grid, Typography } from '@mui/material';
import axios from './axiosInstance';
import UploadImage from './UploadImage';
import AuthorList from './AuthorList';

const AuthorForm = () => {
  const [name, setName] = useState('');
  const [selectedImage, setSelectedImage] = useState(null);
  const [nationality, setNationality] = useState('');
  const [representativeWork, setRepresentativeWork] = useState('');
  const [bio, setBio] = useState('');
  const [refreshList, setRefreshList] = useState(false);
  const [error, setError] = useState(null);
  const [selectedAuthor, setSelectedAuthor] = useState(null);

  const handleSelectedAuthor = (author) => {
    setSelectedAuthor(author);
  };

  useEffect(() => {
    if (selectedAuthor) {
      setName(selectedAuthor.name === 'undefined' ? '' : selectedAuthor.name || '');
      setNationality(selectedAuthor.nationality === 'undefined' ? '' : selectedAuthor.nationality || '');
      setRepresentativeWork(
        selectedAuthor.representativeWork === 'undefined' ? '' : selectedAuthor.representativeWork || ''
      );
      setBio(selectedAuthor.bio === 'undefined' ? '' : selectedAuthor.bio || '');
      // You may need to handle the image preview separately, depending on how you store the image data
      console.log('编辑的图片url', selectedAuthor.pic);
    }
  }, [selectedAuthor]);

  const handleAuthorSubmit = async (e) => {
    e.preventDefault();
    const missingFields = [];
    if (!name) missingFields.push('作者名称');
    // if (!selectedImage) missingFields.push('作者图片');
    if (!nationality) missingFields.push('作者国籍');
    if (!representativeWork) missingFields.push('作者代表作');
    if (!bio) missingFields.push('作者生平');
    if (missingFields.length > 0) {
      setError(`请填写以下必填字段: ${missingFields.join(', ')}`);
      return;
    }

    // const response = await axios.get(`/api/authors?name=${encodeURIComponent(name)}`);
    // if (response.data.length > 0) {
    //   setError('Author with the same name already exists.');
    //   return;
    // }

    setError(null);
    const formData = new FormData();
    formData.append('name', name);
    if (selectedImage) {
      formData.append('pic', selectedImage);
    }
    formData.append('nationality', nationality);
    formData.append('representativeWork', representativeWork);
    formData.append('bio', bio);

    try {
      let response;
      if (selectedAuthor) {
        response = await axios.put(`/api/authors/${selectedAuthor._id}`, formData, {
          headers: { 'Content-Type': 'multipart/form-data' },
        });
      } else {
        response = await axios.post('/api/authors', formData, {
          headers: { 'Content-Type': 'multipart/form-data' },
        });
      }

      console.log('作者信息提交成功:', response.data);
      setError(null);
      setName('');
      setSelectedImage(null);
      setNationality('');
      setRepresentativeWork('');
      setBio('');
      setRefreshList(true);
      setSelectedAuthor(null);
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
              label="代表作"
              variant="outlined"
              fullWidth
              value={representativeWork}
              onChange={(e) => setRepresentativeWork(e.target.value)}
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
            <UploadImage
              imageUrl={selectedAuthor ? selectedAuthor.pic : ''}
              onImageSelect={(file) => setSelectedImage(file)}
            />
          </Grid>
          <Grid item xs={12}>
            <Button variant="contained" color="primary" type="submit">
              {selectedAuthor ? '更新作者信息' : '新增作者信息'}
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
        <AuthorList refresh={refreshList} onEdit={handleSelectedAuthor} />
      </Box>
    </Box>
  );
};

export default AuthorForm;
