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
  const [title, setTitle] = useState('');
  const [authors, setAuthors] = useState([]);
  const [tags, setTags] = useState([]);
  const [topics, setTopics] = useState([]);
  const [readingStatus, setReadingStatus] = useState('想读');
  const [readingProgress, setReadingProgress] = useState('');
  const [publisherInfo, setPublisherInfo] = useState('');
  const [isbn, setIsbn] = useState('');
  const [reviews, setReviews] = useState([]);
  const [excerpts, setExcerpts] = useState([]);
  const [purchaseYear, setPurchaseYear] = useState('');
  const [publicationYear, setPublicationYear] = useState('');
  const [selectedImage, setSelectedImage] = useState(null);

  const [error, setError] = useState(null);
  const [refreshList, setRefreshList] = useState(false);

  const handleInputChange = (event) => {
    const { name, value } = event.target;
    if (name === 'authors' || name === 'tags' || name === 'topics' || name === 'reviews' || name === 'excerpts') {
      // Split the input value based on commas to create an array
      const arrayValue = value.split(',');
      switch (name) {
        case 'authors':
          setAuthors(arrayValue);
          break;
        case 'tags':
          setTags(arrayValue);
          break;
        case 'topics':
          setTopics(arrayValue);
          break;
        case 'reviews':
          setReviews(arrayValue);
          break;
        case 'excerpts':
          setExcerpts(arrayValue);
          break;
        default:
          break;
      }
    } else {
      switch (name) {
        case 'title':
          setTitle(value);
          break;
        case 'readingStatus':
          setReadingStatus(value);
          break;
        case 'readingProgress':
          setReadingProgress(value);
          break;
        case 'publisherInfo':
          setPublisherInfo(value);
          break;
        case 'isbn':
          setIsbn(value);
          break;
        case 'purchaseYear':
          setPurchaseYear(value);
          break;
        case 'publicationYear':
          setPublicationYear(value);
          break;
        default:
          break;
      }
    }
  };
  const handleDateChange = (name, date) => {
    switch (name) {
      case 'purchaseYear':
        setPurchaseYear(date);
        break;
      case 'publicationYear':
        setPublicationYear(date);
        break;
      default:
        break;
    }
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
    if (!title) missingFields.push('书名');
    if (authors.length === 0) missingFields.push('作者 (逗号分割)');
    if (tags.length === 0) missingFields.push('标签 (逗号分割)');
    if (topics.length === 0) missingFields.push('阅读专题 (逗号分割)');
    if (!readingStatus) missingFields.push('Reading Status');
    if (!readingProgress) missingFields.push('阅读进度 (%)');
    if (!publisherInfo) missingFields.push('出版信息');
    if (!isbn) missingFields.push('ISBN');
    if (reviews.length === 0) missingFields.push('书评');
    if (excerpts.length === 0) missingFields.push('书摘');
    if (!purchaseYear) missingFields.push('购买日期');
    if (!publicationYear) missingFields.push('出版日期');
    if (!selectedImage) missingFields.push('图片');

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
      let picData = null;
      if (selectedImage) {
        picData = await readFileAsDataURL(selectedImage);
      }

      const response = await axios.post('/api/books', {
        title,
        authors,
        tags,
        topics,
        readingStatus,
        readingProgress,
        publisherInfo,
        isbn,
        reviews,
        excerpts,
        purchaseYear,
        publicationYear,
        pic: picData,
      });
      console.log('书籍信息添加成功:', response.data);
      setError(null);
      setTitle('');
      setAuthors([]);
      setTags([]);
      setTopics([]);
      setReadingStatus('想读');
      setReadingProgress('');
      setPublisherInfo('');
      setIsbn('');
      setReviews([]);
      setExcerpts([]);
      setPurchaseYear('');
      setPublicationYear('');
      setSelectedImage(null);
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
              value={title}
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
              value={authors}
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
              value={tags}
              onChange={handleInputChange}
              fullWidth
            />
          </Grid>
          <Grid item xs={6} sm={3}>
            <TextField
              margin="normal"
              label="阅读专题 (逗号分割)"
              name="topics"
              value={topics}
              onChange={handleInputChange}
              fullWidth
            />
          </Grid>
        </Grid>
        <Grid container spacing={2}>
          <Grid item xs={6} sm={3}>
            <FormControl fullWidth required margin="normal">
              <InputLabel>Reading Status</InputLabel>
              <Select name="readingStatus" value={readingStatus} onChange={handleInputChange}>
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
              value={readingProgress}
              onChange={handleInputChange}
              fullWidth
              inputProps={{ min: 0, max: 100 }}
            />
          </Grid>

          <Grid item xs={6} sm={3}>
            <TextField
              label="出版信息"
              name="publisherInfo"
              value={publisherInfo}
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
              value={isbn}
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
            value={excerpts}
            onChange={handleInputChange}
            fullWidth
          />
        </Grid>
        <Grid item xs={6} sm={3}>
          <TextField
            label="书评"
            margin="normal"
            name="reviews"
            value={reviews}
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
                value={purchaseYear}
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
                value={publicationYear}
                onChange={(date) => handleDateChange('publicationYear', date)}
                renderInput={(params) => <TextField {...params} margin="normal" />}
              />
            </LocalizationProvider>
          </Grid>
        </Grid>
        <Grid item xs={12}>
          <UploadImage onImageSelect={(file) => setSelectedImage(file)} />
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
