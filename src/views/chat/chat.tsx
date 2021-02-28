import React, { useState, useEffect, useRef } from 'react';
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
import moment from 'moment';
interface ChatProps {
  chatType?: any;
}

const Chat: React.FC<ChatProps> = (prop) => {
  const { chatType } = prop;
  const dispatch = useDispatch();
  const user = useTypedSelector((state) => state.auth.user);
  const headerIndex = useTypedSelector((state) => state.common.headerIndex);
  const chatState = useTypedSelector((state) => state.common.chatState);
  const groupKey = useTypedSelector((state) => state.group.groupKey);
  const targetUserKey = useTypedSelector((state) => state.auth.targetUserKey);
  const groupInfo = useTypedSelector((state) => state.group.groupInfo);
  const memberArray = useTypedSelector((state) => state.member.memberArray);
  const mainGroupKey = useTypedSelector((state) => state.auth.mainGroupKey);
  const showChatState = useTypedSelector((state) => state.common.showChatState);
  // const unChatNum = useTypedSelector((state) => state.common.unChatNum);
  const [url, setUrl] = useState('');
  const [clickType, setClickType] = useState(true);
  let chatRef = useRef<any>(null);
  let unDistory = true;
  useEffect(() => {
    if (user) {
      setUrl(
        api.ROCKET_CHAT_URL + '/login?chatToken=' + user.rocketChat.authToken
        //  +
        // '&newTime=' +
        // moment().valueOf()
      );
      window.addEventListener('message', handlerIframeEvent);
    }
    return () => {
      if (chatRef.current) {
        clearInterval(chatRef.current);
      }
    };
  }, []);

  useEffect(() => {
    if (
      ((headerIndex === 2 && memberArray) ||
        (headerIndex === 3 && groupInfo)) &&
      chatType
    ) {
      goChat();
    }
    return () => {
      unDistory = false;
    };
    // dispatch(setChatState(false));
  }, [headerIndex, groupKey, targetUserKey, groupInfo, memberArray, url]);
  useEffect(() => {
    if (chatState) {
      chatRef.current = setTimeout(goChat, 2000);
    }
    // dispatch(setChatState(false));
  }, [showChatState]);
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
        dispatch(setUnChatNum(e.data.data));
        // setUnReadNum(unReadNum + e.data.data.unread);
        break;
      // default:null;
    }
  };
  const goChat = async () => {
    const dom: any = document.querySelector('#chat');
    if (dom) {
      if (headerIndex === 2) {
        const privatePerson =
          memberArray[_.findIndex(memberArray, { userId: targetUserKey })];
        if (privatePerson) {
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
            if (unDistory) {
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
          }
        }
      } else if (headerIndex === 3) {
        dom.contentWindow.postMessage(
          {
            externalCommand: 'go',
            path: '/group/' + groupInfo.groupUUID,
          },
          '*'
        );
      }
    }
  };
  return (
    <React.Fragment>
      <div
        className="chat-iframe  animate__animated animate__slideInRight"
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
          id="chat"
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
    </React.Fragment>
  );
};
export default Chat;