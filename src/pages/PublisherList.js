import React, { useState, useEffect } from 'react';
import { makeStyles } from '@mui/styles';
import { Card, CardActionArea, CardContent, CardMedia, Typography, IconButton, Button, Box, Grid } from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import axios from './axiosInstance';
import { countBookIds } from './utils';

const useStyles = makeStyles((theme) => ({
  card: {
    display: 'flex',
    width: 500,
    height: 130,
    padding: theme.spacing(2),
    marginBottom: theme.spacing(2),
  },
  cardContent: {
    flex: '1 0 auto',
  },
  cardMedia: {
    width: 100,
    height: 100,
    borderRadius: 10,
    border: '1px solid #ccc',
    padding: 5,
  },
  actionArea: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
}));

const PublisherList = ({ refresh, onEdit }) => {
  const classes = useStyles();
  const [publishers, setPublishers] = useState([]);

  useEffect(() => {
    fetchPublishers();
  }, [refresh]);

  const fetchPublishers = async () => {
    try {
      const response = await axios.get('/api/publishers');
      setPublishers(response.data);
    } catch (error) {
      console.error('Error fetching publishers:', error);
    }
  };

  const handleDelete = async (publisher) => {
    try {
      console.log('删除出版社', publisher);
      await axios.delete(`/api/publishers/${publisher._id}`);
      console.log('删除出版社成功:', publisher);
      fetchPublishers();
    } catch (error) {
      console.error('删除出版社失败:', error);
    }
  };

  const handleEdit = (publisher) => {
    console.log('编辑', publisher);
    onEdit(publisher);
  };

  const imageHost = 'http://localhost:5555';

  return (
    <div>
      <Typography variant="h5" gutterBottom>
        出版社列表
      </Typography>
      <Typography variant="body1" gutterBottom>
        总共有 {publishers.length} 家出版社
      </Typography>
      {publishers.map((publisher, index) => {
        const imageUrl = `${imageHost}/${publisher.pic}`;
        return (
          <Card key={publisher._id} className={classes.card}>
            <CardActionArea className={classes.actionArea}>
              <div className={classes.cardContent}>
                <Typography variant="h5" component="h2">
                  {publisher.name}
                </Typography>
                <Typography variant="body2" gutterBottom>
                  编号：{index + 1}
                </Typography>
                <Typography variant="body2" color="textSecondary">
                  引用次数 {countBookIds(publisher.bookId)}
                </Typography>
                <Typography variant="body2" color="textSecondary">
                  重要出版作品：{publisher.representativeWork}
                </Typography>
                <Typography variant="body2" color="textSecondary">
                  出版社简介：{publisher.introduction}
                </Typography>
              </div>
              <CardMedia className={classes.cardMedia} image={imageUrl} title={publisher.name} />
            </CardActionArea>
            <CardContent>
              <IconButton aria-label="删除" color="secondary" onClick={() => handleDelete(publisher)}>
                <DeleteIcon />
              </IconButton>
              <IconButton aria-label="编辑" color="primary" onClick={() => handleEdit(publisher)}>
                <EditIcon />
              </IconButton>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
};

export default PublisherList;
