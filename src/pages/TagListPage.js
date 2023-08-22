import React, { useState, useEffect } from 'react';
import { makeStyles } from '@mui/styles';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import Box from '@mui/material/Box';
import Divider from '@mui/material/Divider';
import Grid from '@mui/material/Grid';
import Typography from '@mui/material/Typography';
import { Link } from 'react-router-dom';
import axios from './axiosInstance';
import './App.css';
import { countBookIds } from './utils';

const useStyles = makeStyles((theme) => ({
  tagContainer: {
    marginTop: theme.spacing(2),
  },
  tag: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: theme.spacing(1, 2),
    backgroundColor: '#fff',
    borderRadius: theme.spacing(1),
    marginBottom: theme.spacing(1),
    width: '100%',
    boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
    transition: 'box-shadow 0.3s ease',
    '&:hover': {
      boxShadow: '0 4px 8px rgba(0, 0, 0, 0.2)',
    },
    color: 'black',
  },
  tagText: {
    marginRight: theme.spacing(2),
    color: 'black',
  },
  link: {
    textDecoration: 'none',
  },
}));
const TagListPage = () => {
  const classes = useStyles();

  const [tagInput, setTagInput] = useState('');
  const [savedTags, setSavedTags] = useState([]);
  const [error, setError] = useState(null);

  // 在组件加载时获取已保存的标签
  useEffect(() => {
    fetchSavedTags();
  }, []);

  const handleTagInputChange = (event) => {
    setTagInput(event.target.value);
  };

  const handleTagSubmit = async () => {
    if (tagInput.trim() === '') {
      // 不允许空标签
      return;
    }
    const requestData = { tag: tagInput };
    try {
      const response = await axios.post('/api/tags', requestData);
      console.log('Tag saved:', response.data); // 服务器返回的保存成功信息
      setTagInput(''); // 清空输入框
      fetchSavedTags(); // 获取最新的已保存标签
      setError(null);
    } catch (error) {
      console.error('标签提交出错:', error);
      setError(`标签提交失败：${error.message}`);
    }
  };

  const handleKeyPress = (event) => {
    if (event.key === 'Enter') {
      handleTagSubmit();
    }
  };

  const fetchSavedTags = () => {
    axios
      .get('/api/tags')
      .then((response) => {
        console.log('查询到的标签:', response.data);
        setSavedTags(response.data);
      })
      .catch((error) => {
        console.error('Error fetching saved tags:', error);
      });
  };
  return (
    <Box p={3}>
      <Typography variant="h4" gutterBottom>
        标签管理
      </Typography>
      <Box my={3}>
        <Grid container direction="column" alignItems="flex-start">
          <Typography variant="body1" gutterBottom>
            总共有 {savedTags.length} 个标签
          </Typography>
          <div className={classes.tagContainer}>
            {savedTags.map((tag) => {
              const bookListPath = `/dashboard/booklist/${tag._id}?from=tags`;
              return (
                <Link key={tag._id} to={bookListPath} className={classes.link}>
                  <div key={tag._id} className={classes.tag}>
                    <Typography className={classes.tagText}>{tag.tag}</Typography>
                    <Typography>关联书籍 {countBookIds(tag.bookId)} 本</Typography>
                  </div>
                </Link>
              );
            })}
          </div>
        </Grid>
      </Box>
    </Box>
  );
};

export default TagListPage;