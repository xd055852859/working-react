import React, { useState, useEffect } from 'react';
import { useTypedSelector } from '../../redux/reducer/RootState';
import { useDispatch } from 'react-redux';
import { setChatState } from '../../redux/actions/commonActions';
import './chat.css';
import api from '../../services/api';
import closePng from '../../assets/img/close.png';
interface ChatProps {}

const Chat: React.FC<ChatProps> = (prop) => {
  const dispatch = useDispatch();
  const user = useTypedSelector((state) => state.auth.user);
  const headerIndex = useTypedSelector((state) => state.common.headerIndex);
  const chatState = useTypedSelector((state) => state.common.chatState);
  const [url, setUrl] = useState('');
  useEffect(() => {
    if (user) {
      setUrl(
        api.ROCKET_CHAT_URL + '/login?chatToken=' + user.rocketChat.authToken
      );
      // window.addEventListener("message", handlerIframeEvent);
    }
  }, [user]);

  return (
    <div
      className="chat-iframe"
      style={
        headerIndex === 4
          ? {
              opacity: 1,
              left: '320px',
              top: '0px',
            }
          : chatState
          ? {
              width: '650px',
              height: '500px',
              opacity: 1,
              left: '390px',
              top: '60px',
              zIndex: 15,
            }
          : { opacity: 0 }
      }
    >
      <iframe src={url} style={{ height: '100%', width: '100%' }}></iframe>
      {chatState?<img src={closePng} className="chat-close" onClick={()=>{dispatch(setChatState(false))}} />:null}
    </div>
  );
};
export default Chat;
