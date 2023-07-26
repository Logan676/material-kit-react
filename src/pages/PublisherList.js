import React, { useState, useEffect } from 'react';
import { makeStyles } from '@mui/styles';
import { Card, CardActionArea, CardContent, CardMedia, Typography, IconButton } from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import axios from './axiosInstance';

const useStyles = makeStyles((theme) => ({
  card: {
    display: 'flex',
    marginBottom: theme.spacing(2),
  },
  cardContent: {
    flex: '1 0 auto',
  },
  cardMedia: {
    width: 200,
    height: 200,
  },
  actionArea: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
}));

const PublisherList = ({ refresh }) => {
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

  const handleDelete = async (name) => {
    const encodedName = encodeURIComponent(name);
    try {
      console.log(`handleDelete:${name}`);
      await axios.delete(`/api/publishers/${encodedName}`);
      console.log(`delete:${name}`);
      fetchPublishers();
    } catch (error) {
      console.error('Failed to delete publisher:', error);
    }
  };

  const handleEdit = (id) => {
    // Implement the edit functionality here
    console.log('Editing publisher with ID:', id);
  };

  return (
    <div>
      <Typography variant="h5" gutterBottom>
        出版社列表
      </Typography>
      <Typography variant="body1" gutterBottom>
        总共有 {publishers.length} 家出版社
      </Typography>
      {publishers.map((publisher, index) => (
        <Card key={publisher._id} className={classes.card}>
          <CardActionArea className={classes.actionArea}>
            <div className={classes.cardContent}>
              <Typography variant="h6" gutterBottom>
                编号：{index + 1}
              </Typography>
              <Typography variant="h5" component="h2">
                {publisher.name}
              </Typography>
              <Typography variant="body2" color="textSecondary">
                重要出版作品：{publisher.representativeWork}
              </Typography>
            </div>
            <CardMedia className={classes.cardMedia} image={publisher.pic} title={publisher.name} />
          </CardActionArea>
          <CardContent>
            <IconButton aria-label="删除" color="secondary" onClick={() => handleDelete(publisher.name)}>
              <DeleteIcon />
            </IconButton>
            <IconButton aria-label="编辑" color="primary" onClick={() => handleEdit(publisher.name)}>
              <EditIcon />
            </IconButton>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};

export default PublisherList;
