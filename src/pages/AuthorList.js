import React, { useState, useEffect } from 'react';
import { makeStyles } from '@mui/styles';
import {
  Card,
  CardActionArea,
  CardContent,
  CardMedia,
  Typography,
  IconButton,
  Button,
  Box,
  Grid,
  Divider,
} from '@mui/material';
import { Link } from 'react-router-dom';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import axios from './axiosInstance';
import { countBookIds, imageHost } from './utils';

const useStyles = makeStyles((theme) => ({
  header: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  singleLineStyle: {
    padding: theme.spacing(1),
  },
  singleLineContent: {
    display: 'flex',
    color: 'black',
    justifyContent: 'space-between',
  },
  singleLineText: {
    color: 'black',
  },
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
  link: {
    textDecoration: 'none',
  },
}));

const AuthorList = ({ refresh, onEdit }) => {
  const classes = useStyles();

  const [authors, setAuthors] = useState([]);
  const [isCardStyle, setIsCardStyle] = useState(false);

  useEffect(() => {
    fetchAuthors();
  }, [refresh]);

  const fetchAuthors = async () => {
    try {
      const response = await axios.get('/api/authors');
      console.log('获取作者信息:', response);
      // 按照 bookId 长度降序排序
      const sortedAuthors = response.data.slice().sort((a, b) => {
        return b.bookId.length - a.bookId.length;
      });
      setAuthors(sortedAuthors);
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
  return (
    <div>
      <div className={classes.header}>
        <Typography variant="body1" gutterBottom>
          总共有 {authors.length} 位作者
        </Typography>
        <Button variant="outlined" onClick={() => setIsCardStyle(!isCardStyle)}>
          切换列表样式
        </Button>
      </div>
      {authors.map((author, index) => {
        const imageUrl = `${imageHost}/${author.pic}`;
        const authorPath = `/dashboard/authors/${author._id}`;
        return (
          <Link key={author._id} to={authorPath} className={classes.link}>
            {isCardStyle ? (
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
                      关联书籍 {countBookIds(author.bookId)} 本
                    </Typography>
                    <Typography variant="body2" color="textSecondary">
                      国家：{author.nationality}
                    </Typography>
                    <Typography variant="body2" color="textSecondary">
                      作者生平：{author.bio}
                    </Typography>
                  </div>
                  <CardMedia className={classes.cardMedia} image={imageUrl} title={author.name} />
                  <CardContent>
                    <IconButton aria-label="删除" color="secondary" onClick={() => handleDelete(author)}>
                      <DeleteIcon />
                    </IconButton>
                    <IconButton aria-label="编辑" color="primary" onClick={() => handleEdit(author)}>
                      <EditIcon />
                    </IconButton>
                  </CardContent>
                </CardActionArea>
              </Card>
            ) : (
              <div className={classes.singleLineStyle}>
                <div className={classes.singleLineContent}>
                  <Typography variant="body2" component="h2">
                    {index + 1}. {author.name}
                  </Typography>
                  <Typography variant="body2" color="textSecondary">
                    关联书籍 {countBookIds(author.bookId)} 本
                  </Typography>
                </div>
                <Divider />
              </div>
            )}
          </Link>
        );
      })}
    </div>
  );
};

export default AuthorList;
