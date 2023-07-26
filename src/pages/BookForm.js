// BookForm.js
import React, { useState } from 'react';
import { TextField, Button, FormControl, InputLabel, Select, MenuItem, Box } from '@mui/material';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import { deDE as coreDeDE } from '@mui/material/locale';
import { deDE } from '@mui/x-date-pickers/locales';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
// date-fns
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
// or for dayjs
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { v4 as uuidv4 } from 'uuid'; // Import uuidv4 to generate unique IDs
import axios from 'axios';

const BookForm = () => {
  const [bookData, setBookData] = useState({
    id: uuidv4(), // Generate unique ID for the book
    authors: '',
    isbn: '',
    reviews: '',
    excerpts: '',
    title: '',
    purchaseYear: null, // Use null for date pickers to support calendar dates
    publicationYear: null, // Use null for date pickers to support calendar dates
    publisherInfo: '',
    readingStatus: '想读',
    readingProgress: '',
    tags: '',
    topics: '',
  });

  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setBookData((prevData) => ({ ...prevData, [name]: value }));
  };

  const handleDateChange = (name, date) => {
    setBookData((prevData) => ({ ...prevData, [name]: date }));
  };

  const handleSubmit = () => {
    // Send the bookData to your backend or API using axios
    axios
      .post('/api/books', bookData)
      .then((response) => {
        console.log('Book data submitted successfully:', response.data);
        // Add any success handling or navigation logic here
      })
      .catch((error) => {
        console.error('Error submitting book data:', error);
        // Add error handling logic here
      });
  };

  return (
    <div>
      <h1>Enter Book Information</h1>
      <form>
        <Box mb={2}>
          <TextField
            label="Book Title"
            name="title"
            value={bookData.title}
            onChange={handleInputChange}
            fullWidth
            required
          />
        </Box>
        <Box mb={2}>
          <TextField
            label="Authors (comma-separated)"
            name="authors"
            value={bookData.authors}
            onChange={handleInputChange}
            fullWidth
            required
          />
        </Box>
        <Box mb={2}>
          <TextField label="ISBN" name="isbn" value={bookData.isbn} onChange={handleInputChange} fullWidth required />
        </Box>
        <Box mb={2}>
          <TextField
            label="Reviews (comma-separated)"
            name="reviews"
            value={bookData.reviews}
            onChange={handleInputChange}
            fullWidth
          />
        </Box>
        <Box mb={2}>
          <TextField
            label="Excerpts (comma-separated)"
            name="excerpts"
            value={bookData.excerpts}
            onChange={handleInputChange}
            fullWidth
          />
        </Box>
        <Box mb={2}>
          <FormControl fullWidth required>
            <InputLabel>Reading Status</InputLabel>
            <Select name="readingStatus" value={bookData.readingStatus} onChange={handleInputChange}>
              <MenuItem value="已读">已读</MenuItem>
              <MenuItem value="在阅读">在阅读</MenuItem>
              <MenuItem value="想读">想读</MenuItem>
            </Select>
          </FormControl>
        </Box>
        <Box mb={2}>
          <TextField
            label="Reading Progress (%)"
            name="readingProgress"
            type="number"
            value={bookData.readingProgress}
            onChange={handleInputChange}
            fullWidth
            inputProps={{ min: 0, max: 100 }} // Ensure the input only accepts numeric values between 0 and 100
          />
        </Box>
        <Box mb={2}>
          <TextField
            label="Tags (comma-separated)"
            name="tags"
            value={bookData.tags}
            onChange={handleInputChange}
            fullWidth
          />
        </Box>
        <Box mb={2}>
          <TextField
            label="Topics (comma-separated)"
            name="topics"
            value={bookData.topics}
            onChange={handleInputChange}
            fullWidth
          />
        </Box>
        <Box mb={2}>
          {/* <DatePicker
            label="Purchase Year"
            name="purchaseYear"
            value={bookData.purchaseYear}
            onChange={(date) => handleDateChange('purchaseYear', date)}
            renderInput={(params) => <TextField {...params} />}
          /> */}

          <LocalizationProvider
            dateAdapter={AdapterDateFns}
            localeText={deDE.components.MuiLocalizationProvider.defaultProps.localeText}
          >
            <DatePicker
              label="Purchase Year"
              name="purchaseYear"
              views={['year', 'month', 'day']}
              value={bookData.purchaseYear}
              onChange={(date) => handleDateChange('purchaseYear', date)}
              renderInput={(params) => <TextField {...params} />}
            />
          </LocalizationProvider>
        </Box>
        <Box mb={2}>
          {/* <DatePicker
            label="Publication Year"
            name="publicationYear"
            value={bookData.publicationYear}
            onChange={(date) => handleDateChange('publicationYear', date)}
            renderInput={(params) => <TextField {...params} />}
          /> */}
          <LocalizationProvider
            dateAdapter={AdapterDateFns}
            localeText={deDE.components.MuiLocalizationProvider.defaultProps.localeText}
          >
            <DatePicker
              label="Publication Year"
              name="publicationYear"
              views={['year', 'month', 'day']}
              defaultValue={new Date(2022, 1, 1)}
              value={bookData.publicationYear}
              onChange={(date) => handleDateChange('publicationYear', date)}
              renderInput={(params) => <TextField {...params} />}
            />
          </LocalizationProvider>
        </Box>
        <Box mb={2}>
          <TextField
            label="Publisher Info"
            name="publisherInfo"
            value={bookData.publisherInfo}
            onChange={handleInputChange}
            fullWidth
          />
        </Box>
        <Button variant="contained" color="primary" onClick={handleSubmit}>
          Submit
        </Button>
      </form>
    </div>
  );
};

export default BookForm;
