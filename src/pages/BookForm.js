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
import { format, isValid } from 'date-fns';
import { v4 as uuidv4 } from 'uuid';
import axios from './axiosInstance';
import UploadImage from './UploadImage';
import BookList from './BookList';

const BookForm = () => {
  const [title, setTitle] = useState('论语');
  const [authors, setAuthors] = useState('孔子');
  const [tags, setTags] = useState('文学经典');
  const [topics, setTopics] = useState('经典阅读');
  const [readingStatus, setReadingStatus] = useState('想读');
  const [readingProgress, setReadingProgress] = useState(0);
  const [publisherInfo, setPublisherInfo] = useState('中华书局');
  const [isbn, setIsbn] = useState('111');
  const [reviews, setReviews] = useState('经典');
  const [excerpts, setExcerpts] = useState('学而时习之不亦说乎');
  const [purchaseYear, setPurchaseYear] = useState(null);
  const [publicationYear, setPublicationYear] = useState(null);
  const [selectedImage, setSelectedImage] = useState(null);

  const [error, setError] = useState(null);
  const [refreshList, setRefreshList] = useState(false);

  const formatDateToString = (date) => {
    if (!date) return '';
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const missingFields = [];
    if (!title) missingFields.push('书名');
    if (!authors) missingFields.push('作者 (逗号分割)');
    if (!tags) missingFields.push('标签 (逗号分割)');
    if (!topics) missingFields.push('阅读专题 (逗号分割)');
    if (!readingStatus) missingFields.push('阅读状态');
    if (!publisherInfo) missingFields.push('出版信息');
    if (!isbn) missingFields.push('ISBN');
    if (!reviews) missingFields.push('书评');
    if (!excerpts) missingFields.push('书摘');
    if (!purchaseYear) missingFields.push('购买日期');
    if (!publicationYear) missingFields.push('出版日期');
    if (!selectedImage) missingFields.push('图片');

    if (missingFields.length > 0) {
      // setError(`请填写以下必填字段: ${missingFields.join(', ')}`);
      // return;
    }

    // const response = await axios.get(`/api/books?name=${bookData.title}`);
    // if (response.data.length > 0) {
    //   setError('已经存在同名书.');
    //   return;
    // }

    setError(null);
    try {
      const formData = new FormData();
      formData.append('title', title);
      formData.append('authors', authors);
      formData.append('tags', tags);
      formData.append('topics', topics);
      formData.append('readingStatus', readingStatus);
      formData.append('readingProgress', readingProgress);
      formData.append('publisherInfo', publisherInfo);
      formData.append('isbn', isbn);
      formData.append('purchaseYear', formatDateToString(purchaseYear));
      formData.append('publicationYear', formatDateToString(publicationYear));
      formData.append('reviews', reviews);
      formData.append('excerpts', excerpts);
      if (selectedImage) {
        formData.append('pic', selectedImage);
      }

      const resTags = addTags(tags);
      console.log('标签信息添加成功:', resTags.data);

      const resTopics = addTopics(topics);
      console.log('专题信息添加成功:', resTopics.data);

      const resPublisher = addPublishers(publisherInfo);
      console.log('出版信息添加成功:', resPublisher.data);

      const resAuthor = addAuthors(authors);
      console.log('作者信息添加成功:', resAuthor.data);

      const response = await axios.post('/api/books', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });

      console.log('书籍信息添加成功:', response.data);
      setError(null);
      setRefreshList(true);
      setTitle('');
      setAuthors('');
      setTags('');
      setTopics('');
      setReadingStatus('想读');
      setReadingProgress(0);
      setPublisherInfo('');
      setIsbn('');
      setReviews('');
      setExcerpts('');
      setPurchaseYear(null);
      setPublicationYear(null);
      setSelectedImage(null);
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
              onChange={(e) => setTitle(e.target.value)}
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
              onChange={(e) => setAuthors(e.target.value)}
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
              onChange={(e) => setTags(e.target.value)}
              fullWidth
            />
          </Grid>
          <Grid item xs={6} sm={3}>
            <TextField
              margin="normal"
              label="阅读专题 (逗号分割)"
              name="topics"
              value={topics}
              onChange={(e) => setTopics(e.target.value)}
              fullWidth
            />
          </Grid>
        </Grid>
        <Grid container spacing={2}>
          <Grid item xs={6} sm={3}>
            <FormControl fullWidth required margin="normal">
              <InputLabel>Reading Status</InputLabel>
              <Select name="readingStatus" value={readingStatus} onChange={(e) => setReadingStatus(e.target.value)}>
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
              onChange={(e) => setReadingProgress(e.target.value)}
              fullWidth
              inputProps={{ min: 0, max: 100 }}
            />
          </Grid>

          <Grid item xs={6} sm={3}>
            <TextField
              label="出版信息"
              name="publisherInfo"
              value={publisherInfo}
              onChange={(e) => setPublisherInfo(e.target.value)}
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
              onChange={(e) => setIsbn(e.target.value)}
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
            onChange={(e) => setExcerpts(e.target.value)}
            fullWidth
          />
        </Grid>
        <Grid item xs={6} sm={3}>
          <TextField
            label="书评"
            margin="normal"
            name="reviews"
            value={reviews}
            onChange={(e) => setReviews(e.target.value)}
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
                onChange={(date) => setPurchaseYear(date)}
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
                onChange={(date) => setPublicationYear(date)}
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

async function addTags(tags) {
  const requestData = { tag: tags };
  const response = await axios.post('/api/tags', requestData);
  return response;
}

async function addTopics(topics) {
  const requestData = { topic: topics };
  const response = await axios.post('/api/topics', requestData);
  return response;
}

async function addPublishers(publishers) {
  const requestData = { name: publishers };
  const response = await axios.post('/api/publishers', requestData);
  return response;
}

async function addAuthors(authors) {
  const formData = new FormData();
  formData.append('name', encodeURIComponent(authors));
  const response = await axios.post('/api/authors', formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  });
  return response;
}
