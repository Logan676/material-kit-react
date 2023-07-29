import React, { useState, useEffect } from 'react';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import Box from '@mui/material/Box';
import Divider from '@mui/material/Divider';
import Grid from '@mui/material/Grid';
import Typography from '@mui/material/Typography';
import axios from './axiosInstance';
import './App.css';

const TagForm = () => {
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

  // 随机书籍标签数组
  const randomBookTags = [
    '小说',
    '历史',
    '科幻',
    '悬疑',
    '言情',
    '漫画',
    '哲学',
    '经济学',
    '心理学',
    '科学',
    '编程',
    '设计',
    '文学',
    '传记',
    '教育',
    '健康',
    '旅行',
    '摄影',
    '艺术',
    '美食',
    '家居',
    '时尚',
    '音乐',
  ];

  const handleTagSubmit = async () => {
    const numOfTagsToAdd = 200; // 要添加的标签数量
    const tagPrefix = '图书标签_'; // 标签文本前缀

    // 创建一个用于存储请求的数组
    const requests = [];

    for (let i = 0; i < numOfTagsToAdd; i += 1) {
      // 随机选择书籍标签文本
      const randomIndex = Math.floor(Math.random() * randomBookTags.length);
      const randomTag = `${tagPrefix}${randomBookTags[randomIndex]}`;

      // 准备请求数据
      const requestData = { tag: randomTag };
      requests.push(axios.post('/api/tags', requestData));
    }

    try {
      // 使用 Promise.all 同时执行所有请求
      await Promise.all(requests);
      console.log('标签保存成功');
      fetchSavedTags(); // 刷新已保存的标签
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
      <Typography variant="h5" gutterBottom>
        标签管理
      </Typography>
      <Box>
        <TextField
          label="输入标签"
          value={tagInput}
          onChange={handleTagInputChange}
          onKeyPress={handleKeyPress}
          fullWidth
          variant="outlined"
          margin="normal"
        />
        <Button variant="contained" onClick={handleTagSubmit} fullWidth>
          保存标签
        </Button>
        {error && (
          <Box mt={2}>
            <Typography variant="body1" color="error">
              {error}
            </Typography>
          </Box>
        )}
        <Divider style={{ margin: '16px 0' }} />
        <Grid container direction="column" alignItems="flex-start">
          <Grid item>
            <Typography variant="h6">已保存的标签</Typography>
          </Grid>
          <Typography variant="body2" gutterBottom>
            总共有 {savedTags.length} 个标签
          </Typography>
          <div className="tag-container">
            {' '}
            {/* Add a container for the tags */}
            {savedTags.map((tag) => (
              <div key={tag._id} className="tag">
                <Typography>{tag.tag}</Typography>
              </div>
            ))}
          </div>
        </Grid>
      </Box>
    </Box>
  );
};

export default TagForm;
