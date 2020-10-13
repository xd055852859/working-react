import React, { useState, useEffect } from 'react';
import { useTypedSelector } from '../../redux/reducer/RootState';
import { useDispatch } from 'react-redux';
import {
  setChatState,
  setUnChatNum,
  setMessage,
} from '../../redux/actions/commonActions';
import './chat.css';
import _ from 'lodash';
import api from '../../services/api';
import closePng from '../../assets/img/close.png';
interface ChatProps {}

const Chat: React.FC<ChatProps> = (prop) => {
  const dispatch = useDispatch();
  const user = useTypedSelector((state) => state.auth.user);
  const headerIndex = useTypedSelector((state) => state.common.headerIndex);
  const chatState = useTypedSelector((state) => state.common.chatState);
  const groupKey = useTypedSelector((state) => state.group.groupKey);
  const targetUserKey = useTypedSelector((state) => state.auth.targetUserKey);
  const groupInfo = useTypedSelector((state) => state.group.groupInfo);
  const memberArray = useTypedSelector((state) => state.member.memberArray);
  const mainGroupKey = useTypedSelector((state) => state.auth.mainGroupKey);
  // const unChatNum = useTypedSelector((state) => state.common.unChatNum);
  const [url, setUrl] = useState('');
  const [clickType, setClickType] = useState(true);

  useEffect(() => {
    if (user) {
      setUrl(
        api.ROCKET_CHAT_URL + '/login?chatToken=' + user.rocketChat.authToken
      );
      window.addEventListener('message', handlerIframeEvent);
      if (
        (headerIndex === 2 && memberArray) ||
        (headerIndex === 3 && groupInfo)
      ) {
        console.log('xxxxxxxxxxxxxxxxxxxxxx');
        goChat();
      }
    }
  }, [user]);
  useEffect(() => {
    if (
      (headerIndex === 2 && memberArray) ||
      (headerIndex === 3 && groupInfo)
    ) {
      console.log('xxxxxxxxxxxxxxxxxxxxxx');
      goChat();
    }
    // dispatch(setChatState(false));
  }, [headerIndex, groupKey, targetUserKey, groupInfo, memberArray]);
  useEffect(() => {
    if (headerIndex === 2 || headerIndex === 3) {
      setClickType(false);
    } else {
      setClickType(true);
    }
  }, [headerIndex]);
  const handlerIframeEvent = (e: any) => {
    switch (e.data.eventName) {
      case 'unread-changed':
        if (isNaN(e.data.data)) {
          e.data.data = 0;
        }
        console.log(e.data);
        dispatch(setUnChatNum(e.data.data));
        // setUnReadNum(unReadNum + e.data.data.unread);
        break;
      // default:null;
    }
  };
  const goChat = async () => {
    const dom: any = document.querySelector('iframe');
    if (headerIndex === 2) {
      const privatePerson =
        memberArray[_.findIndex(memberArray, { userId: targetUserKey })];
      const privateChatRId = privatePerson.privateChatRId;
      if (privateChatRId) {
        dom.contentWindow.postMessage(
          {
            externalCommand: 'go',
            path: '/direct/' + privateChatRId,
          },
          '*'
        );
      } else {
        let chatRes: any = await api.member.getPrivateChatRId(
          mainGroupKey,
          targetUserKey
        );
        if (chatRes.msg === 'OK') {
          dom.contentWindow.postMessage(
            {
              externalCommand: 'go',
              path: '/direct/' + chatRes.result,
            },
            '*'
          );
        } else {
          dispatch(setMessage(true, chatRes.msg, 'error'));
        }
      }
    } else if (headerIndex === 3) {
      dom.contentWindow.postMessage(
        {
          externalCommand: 'go',
          path: '/channel/' + groupInfo.groupUUID,
        },
        '*'
      );
    }
  };
  return (
    <div
      className="chat-iframe"
      style={
        // headerIndex === 4
        //   ? {
        //       opacity: 1,
        //       left: '320px',
        //       top: '0px',
        //     }
        // :
        chatState
          ? !clickType
            ? {
                width: '420px',
              }
            : {
                width: '600px',
              }
          : { opacity: 0, width: '0px', height: '0px' }
      }
    >
      <iframe
        src={url}
        className="chat"
        style={
          !clickType
            ? {
                left: '-180px',
              }
            : {
                left: '0px',
              }
        }
      ></iframe>
      <div
        className="chat-more"
        onClick={() => {
          setClickType(!clickType);
        }}
        style={
          !clickType
            ? {
                left: '10px',
              }
            : {
                left: '192px',
              }
        }
      ></div>
      {chatState ? (
        <img
          src={closePng}
          className="chat-close"
          onClick={() => {
            dispatch(setChatState(false));
          }}
        />
      ) : null}
    </div>
  );
};
export default Chat;
