import React, { useState, useEffect } from 'react';
import { TextField, Button, Box, Grid, Typography, Divider } from '@mui/material';
import AddPhotoAlternateIcon from '@mui/icons-material/AddPhotoAlternate';
import axios from './axiosInstance';
import PublisherList from './PublisherList';

const PublisherForm = () => {
  const [name, setName] = useState('');
  const [selectedImage, setSelectedImage] = useState(null);
  const [representativeWork, setRepresentativeWork] = useState('');
  const [introduction, setIntroduction] = useState('');
  const [error, setError] = useState(null); // 添加异常信息状态变量
  const [imagePreview, setImagePreview] = useState(null);
  const [refreshList, setRefreshList] = useState(false);
  const [selectedPublisher, setSelectedPublisher] = useState(null);

  const imageHost = 'http://localhost:5555';

  const handleSelectedPublisher = (publisher) => {
    setSelectedPublisher(publisher);
  };
  useEffect(() => {
    if (selectedPublisher) {
      setName(selectedPublisher.name);
      setRepresentativeWork(selectedPublisher.representativeWork);
      setIntroduction(selectedPublisher.introduction);
      // You may need to handle the image preview separately, depending on how you store the image data
      if (selectedPublisher.pic) {
        setImagePreview(`${imageHost}/${selectedPublisher.pic}`);
        // 下载图片并且设置
        // setSelectedImage();
      }
    }
  }, [selectedPublisher]);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    setSelectedImage(file);

    // Display image preview
    const reader = new FileReader();
    reader.onloadend = () => {
      setImagePreview(reader.result);
    };
    reader.readAsDataURL(file);
  };

  const handleSubmit = async () => {
    const missingFields = [];
    if (!name) missingFields.push('出版社名称');
    if (!selectedImage) missingFields.push('出版社图片');
    if (!representativeWork) missingFields.push('重要出版作品');
    if (!introduction) missingFields.push('出版社简介');

    if (missingFields.length > 0) {
      setError(`请填写以下必填字段: ${missingFields.join(', ')}`);
      return;
    }

    const formData = new FormData();
    formData.append('name', name);
    formData.append('pic', selectedImage);
    formData.append('representativeWork', representativeWork);
    formData.append('introduction', introduction);

    try {
      let response;
      if (selectedPublisher) {
        // If selectedPublisher is not null, it means we are in edit mode and should use PUT request
        const formData = new FormData();
        formData.append('name', name);
        if (selectedImage) {
          formData.append('pic', selectedImage);
        }
        formData.append('representativeWork', representativeWork);
        formData.append('introduction', introduction);

        response = await axios.put(`/api/publishers/${selectedPublisher._id}`, formData, {
          headers: { 'Content-Type': 'multipart/form-data' },
        });
      } else {
        response = await axios.post('/api/publishers', formData, {
          headers: { 'Content-Type': 'multipart/form-data' },
        });
      }

      console.log('出版社信息提交成功:', response.data);
      setError(null); // 清除错误信息
      setName('');
      setSelectedImage(null);
      setRepresentativeWork('');
      setIntroduction('');
      setImagePreview(null);
      setRefreshList(true);
      setSelectedPublisher(null);
    } catch (error) {
      console.error('出版社信息提交出错:', error);
      // 添加错误处理逻辑
      setError(`出版社信息提交失败：${error.message}`);
    }
  };

  return (
    <Box p={3}>
      <Typography variant="h4">输入出版社信息</Typography>
      <form>
        <Box mt={2}>
          <TextField
            label="出版社名称"
            name="publisherName"
            value={name}
            onChange={(e) => setName(e.target.value)}
            fullWidth
            required
          />
        </Box>
        <Box mt={2}>
          <TextField
            label="重要出版作品（用逗号分隔）"
            name="importantWorks"
            value={representativeWork}
            onChange={(e) => setRepresentativeWork(e.target.value)}
            fullWidth
          />
        </Box>
        <Box mt={2}>
          <TextField
            label="简介"
            name="introduction"
            value={introduction}
            onChange={(e) => setIntroduction(e.target.value)}
            fullWidth
          />
        </Box>
        <Box mt={2}>
          <Grid container spacing={3}>
            <Grid item xs={12} sm={6}>
              <label htmlFor="upload-image">
                {imagePreview ? (
                  <img
                    src={imagePreview}
                    alt="Publisher"
                    style={{
                      width: '100%',
                      maxWidth: 100,
                      height: 'auto',
                      cursor: 'pointer',
                      borderRadius: 10,
                      border: '1px solid #ccc',
                      padding: 5,
                    }}
                  />
                ) : (
                  <AddPhotoAlternateIcon
                    style={{
                      width: '100%',
                      maxWidth: 100,
                      fontSize: 100,
                      color: 'rgba(0, 0, 0, 0.3)',
                      cursor: 'pointer',
                    }}
                  />
                )}
                <input
                  type="file"
                  id="upload-image"
                  style={{ display: 'none' }}
                  accept="image/*"
                  onChange={handleImageChange}
                />
              </label>
            </Grid>
          </Grid>
        </Box>
        <Box mt={2}>
          <Button variant="contained" color="primary" onClick={handleSubmit}>
            {selectedPublisher ? '更新' : '提交'}
          </Button>
        </Box>

        {error && (
          <Box mt={2}>
            <Typography variant="body1" color="error">
              {error}
            </Typography>
          </Box>
        )}
      </form>
      {/* 添加标题和分隔线 */}
      <Box my={3}>
        <Divider />
      </Box>
      <PublisherList refresh={refreshList} onEdit={handleSelectedPublisher} />
    </Box>
  );
};

export default PublisherForm;
