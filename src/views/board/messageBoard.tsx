import React, { useState, useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { Button } from '@material-ui/core';
import _ from 'lodash';
import moment from 'moment';
import { useTypedSelector } from '../../redux/reducer/RootState';
import './messageBoard.css';
import api from '../../services/api';
import { setChooseKey } from '../../redux/actions/taskActions';
import { setMessage, setUnMessageNum } from '../../redux/actions/commonActions';
import { changeMessageMusic } from '../../redux/actions/authActions';

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
import messageType11Png from '../../assets/img/messageType11.png';
import messageType12Png from '../../assets/img/messageType12.png';

import messageunFinishPng from '../../assets/img/messageunFinish.png';
import messageFinishPng from '../../assets/img/messageFinish.png';
import messageButtonPng from '../../assets/svg/messageButton.svg';
import messageHandPng from '../../assets/img/messageHand.png';
import messageunHandPng from '../../assets/img/messageunHand.png';
import Loading from '../../components/common/loading';
import TaskInfo from '../../components/taskInfo/taskInfo';
interface MessageBoardProps {
  type?: string;
}

const MessageBoard: React.FC<MessageBoardProps> = (prop) => {
  const { type } = prop;
  const dispatch = useDispatch();
  const user = useTypedSelector((state) => state.auth.user);
  // const headerIndex = useTypedSelector((state) => state.common.headerIndex);
  const unMessageNum = useTypedSelector((state) => state.common.unMessageNum);

  const socket = useTypedSelector((state) => state.auth.socket);
  const [messagePage, setMessagePage] = useState(1);
  const [messageTotal, setMessageTotal] = useState(0);
  const [messageArray, setMessageArray] = useState<any>([]);
  const [socketObj, setSocketObj] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [taskInfoShow, setTaskInfoShow] = useState(false);

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
    messageType11Png,
    messageType12Png,
    messageType12Png,
  ];
  useEffect(() => {
    if (user && user._key) {
      getMessage(messagePage);
    }
  }, [user]);
  useEffect(() => {
    if (socket) {
      socket.on('notice', (data: any) => {
        dispatch(setUnMessageNum(unMessageNum + 1));
        setSocketObj({ data: JSON.parse(data) });
      });
    }
  }, [socket]);
  useEffect(() => {
    if (socketObj) {
      console.log(socketObj);
      let newMessageArray = _.cloneDeep(messageArray);
      let newSocketObj = _.cloneDeep(socketObj);
      let newMessageTotal = messageTotal;
      newMessageArray.unshift(newSocketObj);
      setMessageArray(newMessageArray);
      setMessageTotal(newMessageTotal + 1);
    }
  }, [socketObj]);
  const getMessage = async (page: number) => {
    let newMessageArray = _.cloneDeep(messageArray);
    setLoading(true);
    let messageRes: any = await api.auth.getMessageList(page, messageLimit);
    if (messageRes.msg === 'OK') {
      setLoading(false);
      newMessageArray.push(...messageRes.result);
      setMessageArray(newMessageArray);
      setMessageTotal(messageRes.totalNumber);
    } else {
      setLoading(false);
      dispatch(setMessage(true, messageRes.msg, 'error'));
    }
  };
  const scrollMessageLoading = async (e: any) => {
    // console.log(e);
    let newPage = messagePage;
    //文档内容实际高度（包括超出视窗的溢出部分）
    let scrollHeight = e.target.scrollHeight;
    //滚动条滚动距离
    let scrollTop = e.target.scrollTop;
    //窗口可视范围高度
    let clientHeight = e.target.clientHeight;
    if (
      clientHeight + scrollTop >= scrollHeight &&
      messageArray.length < messageTotal
    ) {
      newPage = newPage + 1;
      setMessagePage(newPage);
      getMessage(newPage);
    }
  };
  const changeAddMessage = async (
    item: any,
    applyStatus: number,
    index: number
  ) => {
    let newMessageArray = _.cloneDeep(messageArray);
    let messageRes: any = await api.group.changeAddMessage(
      item.userKey,
      item.groupKey,
      applyStatus,
      item.applyKey
    );
    if (messageRes.msg === 'OK') {
      newMessageArray[index].data.applyStatus = applyStatus;
      setMessageArray(newMessageArray);
      setMessageTotal(messageRes.totalNumber);
    } else {
      setLoading(false);
      dispatch(setMessage(true, messageRes.msg, 'error'));
    }
  };
  const checkMsg = async (key: string, index: number) => {
    let newMessageArray = _.cloneDeep(messageArray);
    let messageRes: any = await api.auth.sendReceipt(key);
    if (messageRes.msg === 'OK') {
      dispatch(setMessage(true, '确认成功', 'success'));
      dispatch(changeMessageMusic(true));
      newMessageArray[index].data.applyStatus = 1;
      setMessageArray(newMessageArray);
    } else {
      dispatch(setMessage(true, messageRes.msg, 'error'));
    }
  };
  const checkAllMessage = async () => {
    let newMessageArray = _.cloneDeep(messageArray);
    let messageRes: any = await api.auth.batchSendReceipt();
    if (messageRes.msg === 'OK') {
      dispatch(setMessage(true, '批量确认成功', 'success'));
      newMessageArray = newMessageArray.map((item: any, index: number) => {
        if (item.data.type == 3 || item.data.type == 5) {
          item.data.applyStatus = 1;
        }
        return item;
      });
      setMessageArray(newMessageArray);
    } else {
      dispatch(setMessage(true, messageRes.msg, 'error'));
    }
  };
  return (
    <div className="messageBoard" style={{ width: type ? '100%' : '360px' }}>
      {loading ? <Loading /> : null}
      {!type ? (
        <div className="messageBoard-maintitle">
          <div>提醒</div>
          <Button
            variant="contained"
            color="primary"
            onClick={() => {
              checkAllMessage();
            }}
            style={{ color: '#fff', marginRight: '5px' }}
          >
            批量确认
          </Button>
        </div>
      ) : null}
      <div
        className="messageBoard-item"
        onScroll={scrollMessageLoading}
        style={
          type
            ? { height: 'calc(100% - 10px)', marginTop: '10px' }
            : { height: ' calc(100% - 50px)' }
        }
      >
        {messageArray.map((messageItem: any, messageIndex: number) => {
          return (
            <React.Fragment key={'message' + messageIndex}>
              {messageItem.data.name1 ? (
                <div
                  className="messageBoard-item-item"
                  onClick={() => {
                    console.log(messageItem.data.cardKey);
                    dispatch(setChooseKey(messageItem.data.cardKey));
                    setTaskInfoShow(true);
                  }}
                >
                  <div className="messageBoard-item-img">
                    <img
                      src={messageImgArray[messageItem.data.type - 1]}
                      alt=""
                    />
                  </div>
                  {messageItem.data.type == 3 || messageItem.data.type == 5 ? (
                    <div className="messageBoard-item-container">
                      <div
                        className="messageBoard-item-time"
                        style={{ marginBottom: '2px' }}
                      >
                        <div>
                          {moment(parseInt(messageItem.data.time)).fromNow()}
                        </div>
                        <div style={{ margin: '0px 5px 0px 15px' }}>
                          {messageItem.data.creatorName}
                        </div>
                        <img
                          src={
                            messageItem.data.applyStatus == 1 &&
                            messageItem.data.type == 5
                              ? messageHandPng
                              : messageunHandPng
                          }
                          alt=""
                          style={{
                            width: '11px',
                            height: '10px',
                            marginRight: '5px',
                            marginBottom: '3px',
                          }}
                        />
                        <div>⇀</div>
                        <div style={{ margin: '0px 5px' }}>
                          {messageItem.data.executorName}
                        </div>
                        <img
                          src={
                            messageItem.data.applyStatus == 1 &&
                            messageItem.data.type == 3
                              ? messageHandPng
                              : messageunHandPng
                          }
                          alt=""
                          style={{
                            width: '11px',
                            height: '10px',
                            marginBottom: '3px',
                          }}
                        />
                      </div>
                      <div className="messageBoard-item-time">
                        <div style={{ marginRight: '5px' }}>
                          {messageItem.data.groupName}
                        </div>
                        /
                        <div style={{ marginLeft: '5px' }}>
                          {messageItem.data.labelName}
                        </div>
                      </div>
                      <div
                        className="messageBoard-item-name1"
                        style={{
                          margin:
                            messageItem.data.applyStatus == 1
                              ? '0px'
                              : '10px 0px',
                          color: '#17B881',
                          width:
                            messageItem.data.applyStatus == 1
                              ? '100%'
                              : 'calc(100% - 55px)',
                          minHeight:
                            messageItem.data.applyStatus == 1 ? '0px' : '60px',
                        }}
                      >
                        {messageItem.data.content}
                      </div>
                      <div className="messageBoard-item-task">
                        <img
                          src={
                            messageItem.data.finishPercent == 0
                              ? messageunFinishPng
                              : messageFinishPng
                          }
                          alt=""
                        />
                        <div>{messageItem.data.title}</div>
                        {/* <div
                          className="taskItem-day"
                          style={taskDayColor}                   
                        >
                          <div
                            className="taskItem-time-day"
                            style={{ left: endtime < 10 ? '5px' : '0px' }}
                          >
                            {endtime}
                          </div>
                          <div className="taskItem-time"></div>
                          <div
                            className="taskItem-time-hour"
                            style={{
                              right: taskDetail.hour < 1 ? '5px' : '0px',
                            }}
                          >
                            {taskDetail.hour}
                          </div>
                        </div> */}
                      </div>
                      <div
                        style={{
                          backgroundImage: 'url(' + messageButtonPng + ')',
                          animation:
                            messageItem.data.applyStatus == 1
                              ? 'changeSmall 500ms'
                              : '',
                          animationFillMode:
                            messageItem.data.applyStatus == 1 ? 'forwards' : '',
                        }}
                        className="messageBoard-item-task-button"
                        onClick={(e) => {
                          e.stopPropagation();
                          checkMsg(messageItem._key, messageIndex);
                        }}
                      ></div>
                    </div>
                  ) : (
                    <div className="messageBoard-item-container">
                      <div className="messageBoard-item-time">
                        {moment(parseInt(messageItem.data.time)).fromNow()}
                      </div>
                      <div className="messageBoard-item-name1">
                        {messageItem.data.name1 + ' '}
                        {messageItem.data.action === '确认完成'
                          ? '确认你的'
                          : messageItem.data.action}
                        {messageItem.data.type == 12
                          ? '指派'
                          : messageItem.data.type == 13
                          ? '完成'
                          : ''}
                      </div>
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
                      {messageItem.data.type == 11 ? (
                        <div className="messageBoard-item-button">
                          {messageItem.data.applyStatus ? (
                            <React.Fragment>
                              <Button
                                variant="contained"
                                color="primary"
                                onClick={() => {
                                  changeAddMessage(
                                    messageItem.data,
                                    1,
                                    messageIndex
                                  );
                                }}
                                style={{ color: '#fff', marginRight: '5px' }}
                              >
                                同意
                              </Button>
                              <Button
                                variant="contained"
                                onClick={() => {
                                  changeAddMessage(
                                    messageItem.data,
                                    2,
                                    messageIndex
                                  );
                                }}
                                // style={{ color: '#fff' }}
                              >
                                拒绝
                              </Button>
                            </React.Fragment>
                          ) : (
                            <Button
                              variant="contained"
                              disabled
                              // style={{ color: '#fff' }}
                            >
                              {messageItem.data.applyStatus == 1
                                ? '已拒绝'
                                : '已同意'}
                            </Button>
                          )}
                        </div>
                      ) : null}
                    </div>
                  )}
                </div>
              ) : null}
            </React.Fragment>
          );
        })}
        {/*  */}
      </div>
      {taskInfoShow ? (
        <TaskInfo
          onClose={() => {
            setTaskInfoShow(false);
          }}
        />
      ) : null}
    </div>
  );
};
export default MessageBoard;
