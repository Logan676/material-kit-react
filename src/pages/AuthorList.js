import React, { useState, useEffect } from 'react';
import { makeStyles } from '@mui/styles';
import { Card, CardActionArea, CardContent, CardMedia, Typography, IconButton, Button, Box, Grid } from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import axios from './axiosInstance';

const useStyles = makeStyles((theme) => ({
  card: {
    display: 'flex',
    width: 500,
    height: 200,
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

const AuthorList = ({ refresh, onEdit }) => {
  const classes = useStyles();
  const [authors, setAuthors] = useState([]);

  useEffect(() => {
    fetchAuthors();
  }, [refresh]);

  const fetchAuthors = async () => {
    try {
      console.log('获取作者信息');
      const response = await axios.get('/api/authors');
      setAuthors(response.data);
      console.log(response.data);
    } catch (error) {
      console.error('获取作者信息失败:', error);
    }
  };

  const handleDelete = async (author) => {
    try {
      console.log('删除作者信息:', author);
      await axios.delete(`/api/authors/${author._id}`);
      console.log('删除作者信息成功:', author);
      fetchAuthors();
    } catch (error) {
      console.error('删除作者信息失败:', error);
    }
  };

  const handleEdit = (author) => {
    console.log('编辑作者信息:', author);
    onEdit(author);
  };

  const imageHost = 'http://localhost:5555';

  return (
    <div>
      <Typography variant="h5" gutterBottom>
        作者列表
      </Typography>
      <Typography variant="body1" gutterBottom>
        总共有 {authors.length} 位作者
      </Typography>
      {authors.map((author, index) => {
        const imageUrl = `${imageHost}/${author.pic}`;
        return (
          <Card key={author._id} className={classes.card}>
            <CardActionArea className={classes.actionArea}>
              <div className={classes.cardContent}>
                <Typography variant="h5" component="h2">
                  {author.name}
                </Typography>
                <Typography variant="body2" gutterBottom>
                  编号：{index + 1}
                </Typography>
                <Typography variant="body2" color="textSecondary">
                  代表作品：{author.representativeWork}
                </Typography>
                <Typography variant="body2" color="textSecondary">
                  国家：{author.nationality}
                </Typography>
                <Typography variant="body2" color="textSecondary">
                  作者生平：{author.bio}
                </Typography>
              </div>
              <CardMedia className={classes.cardMedia} image={imageUrl} title={author.name} />
            </CardActionArea>
            <CardContent>
              <IconButton aria-label="删除" color="secondary" onClick={() => handleDelete(author)}>
                <DeleteIcon />
              </IconButton>
              <IconButton aria-label="编辑" color="primary" onClick={() => handleEdit(author)}>
                <EditIcon />
              </IconButton>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
};

export default AuthorList;
