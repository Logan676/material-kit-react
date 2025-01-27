import React, { useState } from 'react';
import { TextField, Button, Box, Grid, Typography, Divider } from '@mui/material';
import AddPhotoAlternateIcon from '@mui/icons-material/AddPhotoAlternate';

const UploadImage = ({ onImageSelect }) => {
  const [imagePreview, setImagePreview] = useState(null);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    onImageSelect(file);

    // Display image preview
    const reader = new FileReader();
    reader.onloadend = () => {
      setImagePreview(reader.result);
    };
    reader.readAsDataURL(file);
  };

  return (
    // <Box>
    //   {selectedImage ? (
    //     <>
    //       <Typography variant="subtitle1">Selected Image:</Typography>
    //       <img src={URL.createObjectURL(selectedImage)} alt="Selected" style={{ maxWidth: '100%', marginBottom: 10 }} />
    //       <Button onClick={handleRemoveImage} variant="contained" color="secondary">
    //         Remove Image
    //       </Button>
    //     </>
    //   ) : (
    //     <>
    //       <label htmlFor="image-upload-button">
    //         <input
    //           accept="image/*"
    //           style={{ display: 'none' }}
    //           id="image-upload-button"
    //           type="file"
    //           onChange={handleImageChange}
    //         />
    //         <Button variant="contained" component="span">
    //           Upload Image
    //         </Button>
    //       </label>
    //     </>
    //   )}
    // </Box>
    <Box mt={2}>
      <Grid container spacing={3}>
        {/* Other input fields */}
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
  );
};

export default UploadImage;
