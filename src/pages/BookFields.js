import React, { useState, useEffect } from 'react';
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
  Rating,
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
import { makeStyles } from '@mui/styles';
import axios from './axiosInstance';
import UploadImage from './UploadImage';
import { imageHost } from './utils';

const useStyles = makeStyles((theme) => ({
  formContainer: {
    padding: theme.spacing(3),
  },
  ratingContainer: {
    display: 'flex',
    alignItems: 'center',
    gap: theme.spacing(1),
    marginTop: theme.spacing(2), // Increase the top margin
    marginBottom: theme.spacing(2), // Increase the bottom margin
  },
  submitButton: {
    marginTop: theme.spacing(3),
  },
}));

const BookFields = ({ selectedBook }) => {
  const classes = useStyles();

  const defaultDate = new Date(2000, 0, 1);
  const [title, setTitle] = useState('');
  const [authors, setAuthors] = useState('');
  const [tags, setTags] = useState('');
  const [topics, setTopics] = useState('');
  const [readingStatus, setReadingStatus] = useState('想读');
  const [readingProgress, setReadingProgress] = useState(0);
  const [publisherInfo, setPublisherInfo] = useState('');
  const [isbn, setIsbn] = useState('');
  const [reviews, setReviews] = useState('');
  const [excerpts, setExcerpts] = useState('');
  const [purchaseYear, setPurchaseYear] = useState(defaultDate);
  const [publicationYear, setPublicationYear] = useState(defaultDate);
  const [rating, setRating] = useState(0);
  const [selectedImage, setSelectedImage] = useState(null);

  const [error, setError] = useState(null);
  const [refreshList, setRefreshList] = useState(false);
  //   const [selectedBook, setSelectedBook] = useState(null);

  const formatDateToString = (date) => {
    if (!date) return '';
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  };
  useEffect(() => {
    if (selectedBook) {
      setTitle(selectedBook.title === 'undefined' ? '' : selectedBook.title || '');
      setAuthors(selectedBook.authors === 'undefined' ? '' : selectedBook.authors || '');
      setTags(selectedBook.tags === 'undefined' ? '' : selectedBook.tags || '');
      setTopics(selectedBook.topics === 'undefined' ? '' : selectedBook.topics || '');
      setReadingStatus(selectedBook.readingStatus === 'undefined' ? '' : selectedBook.readingStatus || '想读');
      setReadingProgress(selectedBook.readingProgress === 'undefined' ? 0 : selectedBook.readingProgress || 0);
      setPublisherInfo(selectedBook.publisherInfo === 'undefined' ? '' : selectedBook.publisherInfo || '');
      setIsbn(selectedBook.isbn === 'undefined' ? '' : selectedBook.isbn || '');
      setReviews(selectedBook.reviews === 'undefined' ? '' : selectedBook.reviews || '');
      setExcerpts(selectedBook.excerpts === 'undefined' ? '' : selectedBook.excerpts || '');
      setPurchaseYear(selectedBook.purchaseYear === 'undefined' ? null : new Date(selectedBook.purchaseYear) || null);
      setPublicationYear(
        selectedBook.publicationYear === 'undefined' ? null : new Date(selectedBook.publicationYear) || null
      );
      setRating(selectedBook.rating === 'undefined' ? 0 : selectedBook.rating || 0);
      setSelectedImage(selectedBook.pic === 'undefined' ? null : `${imageHost}/${selectedBook.pic}` || null);

      console.log('rating', rating);
    }
  }, [selectedBook]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    try {
      let response;
      if (selectedBook) {
        const requestData = {
          title,
          authors,
          tags,
          topics,
          readingStatus,
          readingProgress,
          publisherInfo,
          isbn,
          purchaseYear: formatDateToString(purchaseYear),
          publicationYear: formatDateToString(publicationYear),
          reviews,
          excerpts,
          rating,
        };
        response = await axios.put(`/api/books/${selectedBook._id}`, requestData, {
          headers: { 'Content-Type': 'application/json' },
        });
      } else {
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
        formData.append('rating', rating);
        if (selectedImage) {
          // formData.append('pic', selectedImage);
        }
        response = await axios.post('/api/books', formData, {
          headers: { 'Content-Type': 'multipart/form-data' },
        });
      }

      console.log('书籍信息更新成功:', response.data);

      const resTags = addTags(tags, response.data._id);
      console.log('标签信息更新成功:', resTags);

      const resTopics = addTopics(topics, response.data._id);
      console.log('专题信息更新成功:', resTopics);

      const resPublisher = addPublishers(publisherInfo, response.data._id);
      console.log('出版信息更新成功:', resPublisher);

      const resAuthor = addAuthors(authors, response.data._id);
      console.log('作者信息更新成功:', resAuthor);

      const resExcerpt = addExcerpts(excerpts, response.data._id, title);
      console.log('书摘更新成功:', resExcerpt);

      const resReview = addReviews(reviews, response.data._id, title);
      console.log('书评更新成功:', resReview);

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
      setRating(0);
      setSelectedImage(null);
      //   setSelectedBook(null);
    } catch (error) {
      console.error('书籍信息添加失败:', error);
      setError(`书籍信息提交失败：${error.message}`);
    }
  };

  return (
    <Box p={0}>
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
              <InputLabel>阅读状态</InputLabel>
              <Select name="readingStatus" value={readingStatus} onChange={(e) => setReadingStatus(e.target.value)}>
                <MenuItem value="读过">读过</MenuItem>
                <MenuItem value="在读">在读</MenuItem>
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
              label="出版社"
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

          <Grid item xs={6} sm={3} className={classes.ratingContainer}>
            <Typography component="legend">评分:</Typography>
            <Rating name="rating" value={rating} precision={0.5} onChange={(event, newValue) => setRating(newValue)} />
          </Grid>
        </Grid>
        <Grid item xs={6} sm={3}>
          <TextField
            label="书摘（只允许新增，不允许编辑）"
            margin="normal"
            name="excerpts"
            value={excerpts}
            onChange={(e) => setExcerpts(e.target.value)}
            fullWidth
          />
        </Grid>
        <Grid item xs={6} sm={3}>
          <TextField
            label="书评（只允许新增，不允许编辑）"
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
                label="出版日期"
                name="publicationYear"
                views={['year', 'month', 'day']}
                value={publicationYear}
                onChange={(date) => setPublicationYear(date)}
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
                label="阅读日期"
                name="purchaseYear"
                views={['year', 'month', 'day']}
                value={purchaseYear}
                onChange={(date) => setPurchaseYear(date)}
                renderInput={(params) => <TextField {...params} margin="normal" />}
              />
            </LocalizationProvider>
          </Grid>
        </Grid>
        <Grid item xs={12}>
          <UploadImage imageUrl={selectedImage} onImageSelect={(file) => setSelectedImage(file)} />
        </Grid>
        <Divider />
        <Grid mt={5}>
          <Button variant="contained" color="primary" type="submit">
            {selectedBook ? '更新图书信息' : '新增图书信息'}
          </Button>
          {error && (
            <Box mt={2}>
              <Typography variant="body1" color="error">
                {error}
              </Typography>
            </Box>
          )}
        </Grid>
      </form>
    </Box>
  );
};

export default BookFields;

async function addTags(tags, bookId) {
  // 将逗号分隔的多个tag字符串转换为数组
  const tagArray = tags.split(',');

  // 依次请求接口并等待每个请求的完成
  const promises = tagArray.map(async (tag) => {
    const requestData = { tag: tag.trim(), bookId }; // 去除tag前后的空格
    try {
      const response = await axios.post('/api/tags', requestData);
      return response;
    } catch (error) {
      // 处理请求错误，你可以选择抛出异常或者进行其他错误处理
      console.error(`Error adding tag "${tag}":`, error);
      return null;
    }
  });

  // 用来保存每个tag请求的结果
  const responses = await Promise.all(promises);

  // 返回所有请求的结果数组
  return responses;
}

async function addTopics(topics, bookId) {
  // 将逗号分隔的多个topic字符串转换为数组
  const topicArray = topics.split(',');

  // 依次请求接口并等待每个请求的完成
  const promises = topicArray.map(async (topic) => {
    const requestData = { topic: topic.trim(), bookId }; // 去除topic前后的空格
    try {
      const response = await axios.post('/api/topics', requestData);
      return response;
    } catch (error) {
      // 处理请求错误，你可以选择抛出异常或者进行其他错误处理
      console.error(`Error adding topic "${topic}":`, error);
      return null;
    }
  });

  // 用来保存每个topic请求的结果
  const responses = await Promise.all(promises);

  // 返回所有请求的结果数组
  return responses;
}

async function addPublishers(publishers, bookId) {
  // 将逗号分隔的多个出版商名称字符串转换为数组
  const publisherArray = publishers.split(',');

  // 依次请求接口并等待每个请求的完成
  const promises = publisherArray.map(async (publisher) => {
    const requestData = { name: publisher.trim(), bookId }; // 去除出版商名称前后的空格
    try {
      const response = await axios.post('/api/publishers', requestData);
      return response;
    } catch (error) {
      // 处理请求错误，你可以选择抛出异常或者进行其他错误处理
      console.error(`Error adding publisher "${publisher}":`, error);
      return null;
    }
  });

  // 用来保存每个出版商请求的结果
  const responses = await Promise.all(promises);

  // 返回所有请求的结果数组
  return responses;
}

async function addAuthors(authors, bookId) {
  // 将逗号分隔的多个作者名称字符串转换为数组
  const authorArray = authors.split(',');

  // 依次请求接口并等待每个请求的完成
  const promises = authorArray.map(async (author) => {
    const formData = new FormData();
    formData.append('name', author.trim()); // 去除作者名称前后的空格
    formData.append('bookId', bookId);

    try {
      const response = await axios.post('/api/authors', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      return response;
    } catch (error) {
      // 处理请求错误，你可以选择抛出异常或者进行其他错误处理
      console.error(`Error adding author "${author}":`, error);
      return null;
    }
  });

  // 用来保存每个作者请求的结果
  const responses = await Promise.all(promises);

  // 返回所有请求的结果数组
  return responses;
}

async function addReviews(review, bookId, bookTitle) {
  try {
    const newReviewData = {
      bookId,
      bookTitle,
      content: review,
    };
    const response = await axios.post('/api/reviews', newReviewData);
    console.log('添加书评成功', response.data);
  } catch (error) {
    console.error('添加书评失败：', error);
  }
}

async function addExcerpts(excerpt, bookId, bookTitle) {
  try {
    const newExcerptData = {
      bookId,
      bookTitle,
      content: excerpt,
    };
    const response = await axios.post('/api/excerpts', newExcerptData);
    console.log('添加书摘成功', response.data);
  } catch (error) {
    console.error('添加书摘失败：', error);
  }
}
