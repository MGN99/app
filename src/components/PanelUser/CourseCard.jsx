import React from 'react';
import { Card, CardContent, CardActions, Typography, Button, CardMedia } from '@mui/material';

const CourseCard = ({ title, instructor, progress, imageURL, onClick }) => {
  return (
    <Card
      onClick={onClick}
      sx={{
        transition: 'transform 0.2s',
        '&:hover': {
          transform: 'scale(1.05)',
          boxShadow: '0px 8px 16px rgba(0, 0, 0, 0.2)',
        },
        cursor: 'pointer',
        borderRadius: '8px',
        backgroundColor: '#f9f9f9',
        display: 'flex',
        flexDirection: 'column',
        height: '100%',
      }}
    >
      <CardMedia
        component="img"
        height="140"
        image={imageURL || '/placeholder.svg?height=140&width=250'}
        alt={title}
      />
      <CardContent sx={{ flexGrow: 1 }}>
        <Typography variant="h6" component="div" sx={{ fontWeight: 'bold', color: '#333' }}>
          {title}
        </Typography>
        <Typography variant="body2" color="text.secondary">
          Instructor: {instructor}
        </Typography>
      </CardContent>
      <CardActions sx={{ justifyContent: 'flex-end' }}>
        <Button size="small" color="primary">
          Ver detalles
        </Button>
      </CardActions>
    </Card>
  );
};

export default CourseCard;