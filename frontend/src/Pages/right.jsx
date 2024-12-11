import { useEffect, useState } from 'react';
import chatbotImg from '../assets/aichatbotpic.png';
import './right.css';
import axios from 'axios';
import { Paper, Typography } from '@mui/material';
import { Grid2, Button } from '@mui/material';

const Right = () => {
  const [notifications, setNotifications] = useState([]);

  useEffect(() => {
    const fetchNotifications = async () => {
      try {
        const response = await axios.get('http://0.0.0.0:8080/notification?read=false', {
          params: { limit: 10, offset: 0, read: "false" },
        });

        setNotifications(response.data.data);
      } catch (error) {
        console.error('Error fetching notifications:', error);
      }
    };

    fetchNotifications();
  }, []);

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleString(); // Adjust date format as per your preference
  };

  const markAsRead = function (id) {
    return async () => {
      try {
        const response = await axios.get(`http://0.0.0.0:8080/notification/read/${id}`, {});
        if (response.status == 200) {
          const n = notifications.filter((item) => item.id !== id )
          setNotifications(n);
        }
      } catch (error) {
        console.error('Error marking as reads:', error);
      }
    }
  };

  return (
    <div className="right">
      <div className="noti">
        <h1 className="txt">Notifications</h1>

        <>
        {notifications.map((notif, index) => (
            <Paper className='notification' key={index}>
              <Grid2 container spacing={0}>
                <Grid2 size={8}>
                  <Typography variant='subtitle2' sx={{ fontWeight: 'bold' }}>{notif.content}</Typography>
                  <Typography variant='body2'>{formatDate(notif.created_at)}</Typography>
                </Grid2>
                <Grid2 size={4} display="flex" justifyContent="center" alignItems="center">
                  <Button onClick={markAsRead(notif.id)} variant='contained' sx={{ backgroundColor: '#274C77', color: 'white', '&:hover': { backgroundColor: '#385D88' } }}>Read</Button>
                </Grid2>
              </Grid2>
            </Paper>
        ))}
        </>
      </div>
      <div className="chatbot">
        <h1 className="txt">HydroGaurd AI ChatBuddy</h1>
        <p className='stxt'>#Ask Your Doubts</p>
        <img className='chatimg' src={chatbotImg} alt="Bot" />
      </div>
    </div>
  );
};

export default Right;
