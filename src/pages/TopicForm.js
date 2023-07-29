import React, { useState, useEffect } from 'react';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import Box from '@mui/material/Box';
import Divider from '@mui/material/Divider';
import Grid from '@mui/material/Grid';
import Typography from '@mui/material/Typography';
import axios from './axiosInstance';
import './App.css';

const TopicForm = () => {
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
  // 随机专题阅读标签数组
  const randomSpecialTags = [
    '科技前沿',
    '历史人物',
    '自然生态',
    '未来趋势',
    '创意设计',
    '人文社科',
    '职业发展',
    '健康养生',
    '美食烹饪',
    '旅行探险',
    '灵感心情',
    '影视娱乐',
    '时尚潮流',
    '文学艺术',
    '音乐乐评',
    '体育竞技',
    '家居装饰',
    '汽车机械',
    '宠物养护',
    '星座运势',
  ];

  const handleSubmit = async () => {
    const numOfTagsToAdd = 200; // 要添加的标签数量
    const tagPrefix = '专题标签_'; // 标签文本前缀

    // 创建一个用于存储请求的数组
    const requests = [];

    for (let i = 0; i < numOfTagsToAdd; i += 1) {
      // Use '+=' instead of '++'
      // 随机选择专题阅读标签文本
      const randomIndex = Math.floor(Math.random() * randomSpecialTags.length);
      const randomTag = `${tagPrefix}${randomSpecialTags[randomIndex]}`;

      // 准备请求数据
      const requestData = { topic: randomTag };
      requests.push(axios.post('/api/topics', requestData));
    }

    try {
      // 使用 Promise.all 同时执行所有请求
      await Promise.all(requests);
      console.log('专题阅读标签保存成功');
      setError(null);
    } catch (error) {
      console.error('专题阅读标签提交出错:', error);
      setError(`专题阅读标签提交失败：${error.message}`);
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
        setSavedTopics(response.data);
      })
      .catch((error) => {
        console.error('Error fetching saved topics:', error);
      });
  };
  return (
    <Box p={3}>
      <Typography variant="h5" gutterBottom>
        专题管理
      </Typography>
      <Box>
        <TextField
          label="输入专题"
          value={topicInput}
          onChange={handleInputChange}
          onKeyPress={handleKeyPress}
          fullWidth
          variant="outlined"
          margin="normal"
        />
        <Button variant="contained" onClick={handleSubmit} fullWidth>
          保存专题
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
            <Typography variant="h6">已保存的专题</Typography>
          </Grid>
          <Typography variant="body2" gutterBottom>
            总共有 {savedTopics.length} 个专题
          </Typography>
          <div className="tag-container">
            {savedTopics.map((topic) => (
              <Grid item key={topic._id} className="tag">
                <Typography>{topic.topic}</Typography>
              </Grid>
            ))}
          </div>
        </Grid>
      </Box>
    </Box>
  );
};

export default TopicForm;
