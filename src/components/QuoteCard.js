import React from 'react';
import { makeStyles } from '@mui/styles';
import { Card, CardContent, Typography, CardActions, Button } from '@mui/material';
import FormatQuoteIcon from '@mui/icons-material/FormatQuote';

const useStyles = makeStyles((theme) => ({
  card: {
    display: 'flex',
    // height: 200,
    // padding: theme.spacing(2),
    // marginBottom: theme.spacing(2),
    alignItems: 'center', // Align items vertically in the card
  },
}));

const QuoteCard = ({ text, author }) => {
  const classes = useStyles();
  return (
    <div>
      <CardContent>
        <Typography variant="body3" component="div">
          <FormatQuoteIcon /> {text}
        </Typography>
        <Typography variant="subtitle2" color="text.secondary" sx={{ textAlign: 'right', marginTop: 0 }}>
          - {author}
        </Typography>
      </CardContent>
    </div>
  );
};

export default QuoteCard;
