// BookForm.js
import React, { useState } from 'react';
import {
  TextField,
  Button,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Box,
  Divider,
  Grid,
  Typography,
} from '@mui/material';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import { deDE as coreDeDE } from '@mui/material/locale';
import { deDE } from '@mui/x-date-pickers/locales';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { v4 as uuidv4 } from 'uuid';
import axios from './axiosInstance';
import UploadImage from './UploadImage';
import BookList from './BookList';

const BookForm = () => {
  const [bookData, setBookData] = useState({
    title: '',
    authors: [], // Change to an empty array
    tags: [], // Change to an empty array
    topics: [], // Change to an empty array
    readingStatus: '想读',
    readingProgress: '',
    publisherInfo: '', // Update this field based on your actual publisher data
    isbn: '',
    reviews: [], // Change to an empty array
    excerpts: [], // Change to an empty array
    purchaseYear: '',
    publicationYear: '',
    pic: null,
  });

  const [error, setError] = useState(null);
  const [refreshList, setRefreshList] = useState(false);

  const handleInputChange = (event) => {
    const { name, value } = event.target;
    if (name === 'authors' || name === 'tags' || name === 'topics' || name === 'reviews' || name === 'excerpts') {
      // Split the input value based on commas to create an array
      setBookData((prevData) => ({ ...prevData, [name]: value.split(',') }));
    } else {
      setBookData((prevData) => ({ ...prevData, [name]: value }));
    }
  };

  const handleDateChange = (name, date) => {
    setBookData((prevData) => ({ ...prevData, [name]: date }));
  };

  const handleImageSelect = (file) => {
    setBookData((prevData) => ({ ...prevData, pic: file }));
  };

  const convertToArray = (field) => {
    if (typeof field === 'string') {
      return field.split(',').map((item) => item.trim());
    }
    return Array.isArray(field) ? field.map((item) => item.trim()) : [];
  };

  // Function to read a file as a base64-encoded data URL
  const readFileAsDataURL = (file) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result);
      reader.onerror = reject;
      reader.readAsDataURL(file);
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const missingFields = [];
    if (!bookData.title) missingFields.push('书名');
    if (bookData.authors.length === 0) missingFields.push('作者 (逗号分割)');
    if (bookData.tags.length === 0) missingFields.push('标签 (逗号分割)');
    if (bookData.topics.length === 0) missingFields.push('阅读专题 (逗号分割)');
    if (!bookData.readingStatus) missingFields.push('Reading Status');
    if (!bookData.readingProgress) missingFields.push('阅读进度 (%)');
    if (!bookData.publisherInfo) missingFields.push('出版信息');
    if (!bookData.isbn) missingFields.push('ISBN');
    if (bookData.reviews.length === 0) missingFields.push('书评');
    if (bookData.excerpts.length === 0) missingFields.push('书摘');
    if (!bookData.purchaseYear) missingFields.push('购买日期');
    if (!bookData.publicationYear) missingFields.push('出版日期');
    if (!bookData.pic) missingFields.push('图片');

    if (missingFields.length > 0) {
      setError(`请填写以下必填字段: ${missingFields.join(', ')}`);
      return;
    }

    // const response = await axios.get(`/api/books?name=${bookData.title}`);
    // if (response.data.length > 0) {
    //   setError('已经存在同名书.');
    //   return;
    // }

    setError(null);
    try {
      const authorsArray = convertToArray(bookData.authors);
      const tagsArray = convertToArray(bookData.tags);
      const topicsArray = convertToArray(bookData.topics);
      const reviewsArray = convertToArray(bookData.reviews);
      const excerptsArray = convertToArray(bookData.excerpts);

      bookData.authors = authorsArray;
      bookData.tags = tagsArray;
      bookData.topics = topicsArray;
      bookData.reviews = reviewsArray;
      bookData.excerpts = excerptsArray;

      const picFile = bookData.pic; // Assuming bookData.pic is a File object from a file input

      if (picFile) {
        try {
          const picData = await readFileAsDataURL(picFile);
          bookData.pic = picData; // Now pic is converted to a base64-encoded string
        } catch (error) {
          console.error('Error converting pic to string:', error);
          setError('图片转换失败，请重试');
          return;
        }
      }

      const response = await axios.post('/api/books', bookData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      console.log('书籍信息添加成功:', response.data);
      setError(null);
      setBookData({
        title: '',
        authors: [],
        tags: [],
        topics: [],
        readingStatus: '想读',
        readingProgress: '',
        publisherInfo: '',
        isbn: '',
        reviews: [],
        excerpts: [],
        purchaseYear: '',
        publicationYear: '',
        pic: null,
      });
      setRefreshList(true);
    } catch (error) {
      console.error('书籍信息添加失败:', error);
      setError(`书籍信息提交失败：${error.message}`);
    }
  };

  return (
    <Box p={3}>
      <Typography variant="h4">书架管理</Typography>
      <form onSubmit={handleSubmit}>
        <Grid container spacing={2}>
          <Grid item xs={6} sm={3}>
            <TextField
              label="书名"
              name="title"
              value={bookData.title}
              onChange={handleInputChange}
              margin="normal"
              fullWidth
              required
            />
          </Grid>
          <Grid item xs={6} sm={3}>
            <TextField
              label="作者 (逗号分割)"
              name="authors"
              value={bookData.authors}
              onChange={handleInputChange}
              margin="normal"
              fullWidth
              required
            />
          </Grid>
          <Grid item xs={6} sm={3}>
            <TextField
              label="标签 (逗号分割)"
              name="tags"
              margin="normal"
              value={bookData.tags}
              onChange={handleInputChange}
              fullWidth
            />
          </Grid>
          <Grid item xs={6} sm={3}>
            <TextField
              margin="normal"
              label="阅读专题 (逗号分割)"
              name="topics"
              value={bookData.topics}
              onChange={handleInputChange}
              fullWidth
            />
          </Grid>
        </Grid>
        <Grid container spacing={2}>
          <Grid item xs={6} sm={3}>
            <FormControl fullWidth required margin="normal">
              <InputLabel>Reading Status</InputLabel>
              <Select name="readingStatus" value={bookData.readingStatus} onChange={handleInputChange}>
                <MenuItem value="已读">已读</MenuItem>
                <MenuItem value="在阅读">在阅读</MenuItem>
                <MenuItem value="想读">想读</MenuItem>
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={6} sm={3}>
            <TextField
              margin="normal"
              label="阅读进度 (%)"
              name="readingProgress"
              type="number"
              value={bookData.readingProgress}
              onChange={handleInputChange}
              fullWidth
              inputProps={{ min: 0, max: 100 }}
            />
          </Grid>

          <Grid item xs={6} sm={3}>
            <TextField
              label="出版信息"
              name="publisherInfo"
              value={bookData.publisherInfo}
              onChange={handleInputChange}
              margin="normal"
              fullWidth
            />
          </Grid>
          <Grid item xs={6} sm={3}>
            <TextField
              label="ISBN"
              name="isbn"
              margin="normal"
              value={bookData.isbn}
              onChange={handleInputChange}
              fullWidth
              required
            />
          </Grid>
        </Grid>
        <Grid item xs={6} sm={3}>
          <TextField
            label="书摘"
            margin="normal"
            name="excerpts"
            value={bookData.excerpts}
            onChange={handleInputChange}
            fullWidth
          />
        </Grid>
        <Grid item xs={6} sm={3}>
          <TextField
            label="书评"
            margin="normal"
            name="reviews"
            value={bookData.reviews}
            onChange={handleInputChange}
            fullWidth
          />
        </Grid>
        <Grid container spacing={2}>
          <Grid item xs={6} sm={3} mt={3}>
            <LocalizationProvider
              dateAdapter={AdapterDateFns}
              localeText={deDE.components.MuiLocalizationProvider.defaultProps.localeText}
            >
              <DatePicker
                label="购买日期"
                name="purchaseYear"
                views={['year', 'month', 'day']}
                value={bookData.purchaseYear}
                onChange={(date) => handleDateChange('purchaseYear', date)}
                renderInput={(params) => <TextField {...params} margin="normal" />}
              />
            </LocalizationProvider>
          </Grid>
          <Grid item xs={6} sm={3} mt={3}>
            <LocalizationProvider
              dateAdapter={AdapterDateFns}
              localeText={deDE.components.MuiLocalizationProvider.defaultProps.localeText}
            >
              <DatePicker
                label="出版日期"
                name="publicationYear"
                views={['year', 'month', 'day']}
                defaultValue={new Date(2022, 1, 1)}
                value={bookData.publicationYear}
                onChange={(date) => handleDateChange('publicationYear', date)}
                renderInput={(params) => <TextField {...params} margin="normal" />}
              />
            </LocalizationProvider>
          </Grid>
        </Grid>
        <Grid item xs={12}>
          <UploadImage onImageSelect={(file) => handleImageSelect(file)} />
        </Grid>
        <Button variant="contained" color="primary" type="submit">
          新增图书信息
        </Button>
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
        <BookList refresh={refreshList} />
      </Box>
    </Box>
  );
};

export default BookForm;
