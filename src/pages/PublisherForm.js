// PublisherForm.js
import React, { useState } from 'react';
import { TextField, Button, Box, Typography } from '@mui/material';
import { ImageFileResizer } from 'react-image-file-resizer'; // Import the image file resizer
import ReactCrop from 'react-image-crop'; // Import the react-image-crop
import 'react-image-crop/dist/ReactCrop.css'; // Import the styles for react-image-crop
import axios from 'axios';

const PublisherForm = ({ updatePublishers }) => {
  const [publisherData, setPublisherData] = useState({
    publisherName: '',
    importantWorks: '',
    imageUrl: '',
  });
  const [crop, setCrop] = useState({
    unit: '%',
    width: 50,
    aspect: 16 / 9,
  });
  const [imageSrc, setImageSrc] = useState(null);

  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setPublisherData((prevData) => ({ ...prevData, [name]: value }));
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      // Resize and crop the image
      ImageFileResizer.imageFileResizer(
        file,
        1080, // Max width
        1920, // Max height
        'JPEG', // Output format
        100, // Image quality
        0, // Rotation
        (uri) => {
          setImageSrc(uri);
        },
        'base64', // Output type (base64, blob, uri, raw)
        1080, // Max file size in bytes
        1920 // Max file size in bytes
      );
    }
  };

  const handleSubmit = () => {
    // Send the publisherData and imageSrc to your backend or API using axios
    // ...
  };

  return (
    <div>
      <h1>输入出版社信息</h1>
      <form>
        <Box mb={2}>
          <TextField
            label="出版社名称"
            name="publisherName"
            value={publisherData.publisherName}
            onChange={handleInputChange}
            fullWidth
            required
          />
        </Box>
        <Box mb={2}>
          <TextField
            label="重要出版作品（用逗号分隔）"
            name="importantWorks"
            value={publisherData.importantWorks}
            onChange={handleInputChange}
            fullWidth
          />
        </Box>
        <Box mb={2}>
          <input accept="image/*" type="file" onChange={handleImageChange} />
        </Box>
        {imageSrc && (
          <Box mb={2}>
            <Typography variant="h6">图片裁剪</Typography>
            <ReactCrop src={imageSrc} crop={crop} onChange={(newCrop) => setCrop(newCrop)} />
          </Box>
        )}
        <Button variant="contained" color="primary" onClick={handleSubmit}>
          提交
        </Button>
      </form>
    </div>
  );
};

export default PublisherForm;
