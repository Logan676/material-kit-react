import React, { useState, useEffect } from 'react';
import { makeStyles } from '@mui/styles';
import { Card, CardActionArea, CardContent, CardMedia, Typography, IconButton, Button, Box, Grid } from '@mui/material';
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
    // marginBottom: theme.spacing(2),
  },
  singleLineStyle: {
    padding: theme.spacing(1),
    // marginBottom: theme.spacing(2),
  },
  singleLineContent: {
    display: 'flex',
    color: 'black',
    justifyContent: 'space-between',
  },
  singleLineText: {
    // flexGrow: 1,
    color: 'black',
  },
  singleLineActions: {
    marginLeft: theme.spacing(2),
  },
  card: {
    display: 'flex',
    width: 500,
    height: 150,
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

const PublisherList = ({ refresh, onEdit }) => {
  const classes = useStyles();
  const [publishers, setPublishers] = useState([]);
  const [isCardStyle, setIsCardStyle] = useState(false);

  useEffect(() => {
    fetchPublishers();
  }, [refresh]);

  const fetchPublishers = async () => {
    try {
      const response = await axios.get('/api/publishers');
      // 按照 bookId 长度进行降序排序
      const sortedPublishers = response.data.slice().sort((a, b) => {
        const aBookIdLength = a.bookId.split(',').length;
        const bBookIdLength = b.bookId.split(',').length;
        // 降序排序：将 b 放在前面以排在 a 前面
        return bBookIdLength - aBookIdLength;
      });
      setPublishers(sortedPublishers);
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

  return (
    <div>
      <div className={classes.header}>
        <Typography variant="body1" gutterBottom>
          总共有 {publishers.length} 家出版社
        </Typography>
        <Button variant="outlined" onClick={() => setIsCardStyle(!isCardStyle)}>
          切换列表样式
        </Button>
      </div>
      {publishers.map((publisher, index) => {
        const imageUrl = `${imageHost}/${publisher.pic}`;
        const publisherPath = `/dashboard/publisher/${publisher._id}`;
        return (
          <Link key={publisher._id} to={publisherPath} className={classes.link}>
            {isCardStyle ? (
              // 第一种样式（卡片样式）
              <Card key={publisher._id} className={classes.card}>
                <CardActionArea className={classes.actionArea}>
                  <div className={classes.cardContent}>
                    <Typography variant="h5" component="h2">
                      {index + 1}. {publisher.name}
                    </Typography>
                    <Typography variant="body2" color="textSecondary">
                      关联书籍 {countBookIds(publisher.bookId)} 本
                    </Typography>
                    <Typography variant="body2" color="textSecondary">
                      重要出版作品：{publisher.representativeWork}
                    </Typography>
                    <Typography variant="body2" color="textSecondary">
                      出版社简介：{publisher.introduction}
                    </Typography>
                  </div>
                  <CardMedia className={classes.cardMedia} image={imageUrl} title={publisher.name} />
                  <CardContent>
                    <IconButton aria-label="删除" color="secondary" onClick={() => handleDelete(publisher)}>
                      <DeleteIcon />
                    </IconButton>
                  </CardContent>
                </CardActionArea>
              </Card>
            ) : (
              // 第二种样式（单行样式）
              <div className={classes.singleLineStyle}>
                <div className={classes.singleLineContent}>
                  <Typography variant="body2" component="h2">
                    {index + 1}. {publisher.name}
                  </Typography>
                  <Typography variant="body2" color="textSecondary">
                    关联书籍 {countBookIds(publisher.bookId)} 本
                  </Typography>
                </div>
              </div>
            )}
          </Link>
        );
      })}
    </div>
  );
};

export default PublisherList;
