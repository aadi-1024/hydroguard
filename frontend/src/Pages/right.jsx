import { useEffect, useState } from 'react';
import chatbotImg from '../assets/aichatbotpic.png';
import './right.css';
import axios from 'axios';

const Right = () => {
  const [notifications, setNotifications] = useState([]);

  useEffect(() => {
    const fetchNotifications = async () => {
      try {
        const response = await axios.get('http://0.0.0.0:8080/notification', {
          params: { limit: 10, offset: 0 },
        });
    
        setNotifications(response.data.data.slice(0, 3)); 
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

  return (
    <div className="right">
      <div className="noti">
        <h1 className="txt">Notifications</h1>
        
        <ul>
          {notifications.map((notif, index) => (
            <li key={index}>
              <p>{notif.content}</p>
              <small className="notification-time">{formatDate(notif.created_at)}</small> {/* Display time */}
            </li>
          ))}
        </ul>
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
