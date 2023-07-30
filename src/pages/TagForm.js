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
