import React, { useState, useEffect } from 'react';
import { useTypedSelector } from '../../redux/reducer/RootState';
import './chat.css';
import api from '../../services/api';
interface ChatProps {}

const Chat: React.FC<ChatProps> = (prop) => {
  const user = useTypedSelector((state) => state.auth.user);
  const headerIndex = useTypedSelector((state) => state.common.headerIndex);
  const [url, setUrl] = useState('');
  useEffect(() => {
    if (user) {
      setUrl(
        api.ROCKET_CHAT_URL + '/login?chatToken=' + user.rocketChat.authToken
      );
    }
  }, [user]);

  return (
    <div
      className="chat-iframe"
      style={
        headerIndex === 4
          ? { width: '100%', height: '100%', opacity: 1 }
          : { opacity: 0 }
      }
    >
      <iframe src={url} style={{ height: '100%', width: '100%' }}></iframe>
    </div>
  );
};
export default Chat;
