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
const TopicListPage = () => {
  const classes = useStyles();

  const [topicInput, setTopicInput] = useState('');
  const [savedTopics, setSavedTopics] = useState([]);
  const [error, setError] = useState(null);

  // 在组件加载时获取已保存的标签
  useEffect(() => {
    fetchSavedTopics();
  }, []);

  const handleInputChange = (event) => {
    setTopicInput(event.target.value);
  };

  const handleSubmit = async () => {
    if (topicInput.trim() === '') {
      // 不允许空标签
      return;
    }
    const requestData = { topic: topicInput };
    try {
      const response = await axios.post('/api/topics', requestData);
      console.log('Topic saved:', response.data); // 服务器返回的保存成功信息
      setTopicInput(''); // 清空输入框
      fetchSavedTopics(); // 获取最新的已保存专题
      setError(null);
    } catch (error) {
      console.error('专题提交出错:', error);
      setError(`专题提交失败：${error.message}`);
    }
  };

  const handleKeyPress = (event) => {
    if (event.key === 'Enter') {
      handleSubmit();
    }
  };

  const fetchSavedTopics = () => {
    axios
      .get('/api/topics')
      .then((response) => {
        console.log('查询到的专题:', response.data);
        // 按照 bookId 长度进行降序排序
        const sortedTopics = response.data.slice().sort((a, b) => {
          const aBookIdLength = a.bookId.split(',').length;
          const bBookIdLength = b.bookId.split(',').length;
          // 降序排序：将 b 放在前面以排在 a 前面
          return bBookIdLength - aBookIdLength;
        });
        setSavedTopics(sortedTopics);
      })
      .catch((error) => {
        console.error('Error fetching saved topics:', error);
      });
  };
  return (
    <Box p={3}>
      <Typography variant="h4" gutterBottom>
        专题管理
      </Typography>
      <Box my={3}>
        <Grid container direction="column" alignItems="flex-start">
          <Typography variant="body1" gutterBottom>
            总共有 {savedTopics.length} 个专题
          </Typography>
          <div className={classes.tagContainer}>
            {savedTopics.map((topic) => {
              const bookListPath = `/dashboard/booklist/${topic._id}?from=topics`;
              return (
                <Link key={topic._id} to={bookListPath} className={classes.link}>
                  <Grid item key={topic._id} className={classes.tag}>
                    <Typography className={classes.tagText}>{topic.topic}</Typography>
                    <Typography>关联书籍 {countBookIds(topic.bookId)} 本</Typography>
                  </Grid>
                </Link>
              );
            })}
          </div>
        </Grid>
      </Box>
    </Box>
  );
};

export default TopicListPage;
