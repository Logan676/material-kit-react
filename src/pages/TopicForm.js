import React, { useState, useEffect } from 'react';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import Box from '@mui/material/Box';
import Divider from '@mui/material/Divider';
import Grid from '@mui/material/Grid';
import Typography from '@mui/material/Typography';
import axios from './axiosInstance';

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
          {savedTopics.map((topic) => (
            <Grid item key={topic._id}>
              <Typography>{topic.topic}</Typography>
            </Grid>
          ))}
        </Grid>
      </Box>
    </Box>
  );
};

export default TopicForm;
