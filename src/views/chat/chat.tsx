import React, { useState, useEffect, useRef } from 'react';
import './chat.css';
import { useTypedSelector } from '../../redux/reducer/RootState';
import { useDispatch } from 'react-redux';
import _ from 'lodash';
import api from '../../services/api';

import {
  setChatState,
  setUnChatNum,
  setMessage,
} from '../../redux/actions/commonActions';

import closePng from '../../assets/img/close.png';
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
  const [url, setUrl] = useState('');
  const [clickType, setClickType] = useState(true);
  let chatRef = useRef<any>(null);
let unDistory = useRef<any>(null);   unDistory.current=true;
  useEffect(() => {
    if (user) {
      setUrl(
        api.ROCKET_CHAT_URL + '/login?chatToken=' + user.rocketChat.authToken
      );
      window.addEventListener('message', handlerIframeEvent);
    }
  }, [user]);

  useEffect(() => {
    if (
      (headerIndex === 2 && memberArray) ||
      (headerIndex === 3 && groupInfo)
    ) {
      goChat();
    }
    return () => {
      // unDistory.current = false;
    };
    // dispatch(setChatState(false));
  }, [headerIndex, groupKey, targetUserKey, groupInfo, memberArray, url]);
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
        break;
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
            if (unDistory.current) {
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
