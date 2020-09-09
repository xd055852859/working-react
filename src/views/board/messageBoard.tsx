import React, { useState, useEffect } from 'react';
import { useDispatch } from 'react-redux';
import _ from 'lodash';
import moment from 'moment';
import { useTypedSelector } from '../../redux/reducer/RootState';
import './messageBoard.css';
import api from '../../services/api';
import { setMessage } from '../../redux/actions/commonActions';
import messageType1Png from '../../assets/img/messageType1.png';
import messageType2Png from '../../assets/img/messageType2.png';
import messageType3Png from '../../assets/img/messageType3.png';
import messageType4Png from '../../assets/img/messageType4.png';
import messageType5Png from '../../assets/img/messageType5.png';
import messageType6Png from '../../assets/img/messageType6.png';
import messageType7Png from '../../assets/img/messageType7.png';
import messageType8Png from '../../assets/img/messageType8.png';
import messageType9Png from '../../assets/img/messageType9.png';
import messageType10Png from '../../assets/img/messageType10.png';
interface MessageBoardProps {}

const MessageBoard: React.FC<MessageBoardProps> = (prop) => {
  const dispatch = useDispatch();
  const user = useTypedSelector((state) => state.auth.user);
  const socket = useTypedSelector((state) => state.auth.socket);
  const [messagePage, setMessagePage] = useState(1);
  const [messageTotal, setMessageTotal] = useState(0);
  const [messageArray, setMessageArray] = useState<any>([]);
  const [socketObj, setSocketObj] = useState<any>(null);
  const messageLimit = 10;
  const messageImgArray = [
    messageType1Png,
    messageType2Png,
    messageType3Png,
    messageType4Png,
    messageType5Png,
    messageType6Png,
    messageType7Png,
    messageType8Png,
    messageType9Png,
    messageType10Png,
  ];
  useEffect(() => {
    if (user && user._key) {
      getMessage(messagePage, messageLimit);
    }
  }, [user]);
  useEffect(() => {
    if (socket) {
      console.log(socket);
      socket.on('notice', (data: any) => {
        setSocketObj({ data: JSON.parse(data) });
      });
    }
  }, [socket]);
  useEffect(() => {
    if (socketObj) {
      let newMessageArray = _.cloneDeep(messageArray);
      let newSocketObj = _.cloneDeep(socketObj);
      console.log(newSocketObj);
      let newMessageTotal = messageTotal;
      console.log(messageArray);
      newMessageArray.unshift(newSocketObj);
      setMessageArray(newMessageArray);
      setMessageTotal(newMessageTotal + 1);
    }
  }, [socketObj]);
  const getMessage = async (page: number, limit: number) => {
    let newMessageArray = _.cloneDeep(messageArray);
    let messageRes: any = await api.auth.getMessageList(page, limit);
    if (messageRes.msg === 'OK') {
      newMessageArray.push(...messageRes.result);
      setMessageArray(newMessageArray);
      setMessageTotal(messageRes.totalNumber);
    } else {
      dispatch(setMessage(true, messageRes.msg, 'error'));
    }
  };
  return (
    <div className="messageBoard">
      <div className="messageBoard-maintitle">提醒</div>
      <div className="messageBoard-item">
        {messageArray.map((messageItem: any, messageIndex: number) => {
          return (
            <React.Fragment key={'message' + messageIndex}>
              {messageItem.data.name1 ? (
                <div className="messageBoard-item-item">
                  <div className="messageBoard-item-img">
                    <img
                      src={messageImgArray[messageItem.data.type - 1]}
                      alt=""
                    />
                  </div>
                  <div className="messageBoard-item-container">
                    <div className="messageBoard-item-time">
                      {moment(parseInt(messageItem.data.time)).fromNow()}
                    </div>
                    <div className="messageBoard-item-name1">
                      {messageItem.data.name1} {messageItem.data.action}
                    </div>
                    {/* <div className="messageBoard-item-action">
                     
                    </div> */}
                    {messageItem.data.name2 ? (
                      <div className="messageBoard-item-name2">
                        {messageItem.data.name2}
                      </div>
                    ) : null}
                    {messageItem.data.commentContent ? (
                      <div className="messageBoard-item-commentContent">
                        {messageItem.data.commentContent}
                      </div>
                    ) : null}
                  </div>
                </div>
              ) : null}
            </React.Fragment>
          );
        })}
        {/*  */}
      </div>
    </div>
  );
};
export default MessageBoard;
