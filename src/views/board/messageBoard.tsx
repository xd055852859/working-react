import React, { useState, useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { Button, Checkbox } from '@material-ui/core';
import _ from 'lodash';
import moment from 'moment';
import { useTypedSelector } from '../../redux/reducer/RootState';
import './messageBoard.css';
import api from '../../services/api';
import {
  setChooseKey,
  changeTaskInfoVisible,
} from '../../redux/actions/taskActions';
import { setMessage } from '../../redux/actions/commonActions';
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

import messageType14Png from '../../assets/img/messageType14.png';
import messageType15Png from '../../assets/img/messageType15.png';
import messageType16Png from '../../assets/img/messageType16.png';
import messageType17Png from '../../assets/img/messageType17.png';
import messageType18Png from '../../assets/img/messageType18.png';
import messageType19Png from '../../assets/img/messageType19.png';
import messageType20Svg from '../../assets/svg/messageType20.svg';
import messageType21Svg from '../../assets/svg/messageType21.svg';
import messageunFinishSvg from '../../assets/svg/messageunFinish.svg';
import messageFinishSvg from '../../assets/svg/messageFinish.svg';
import messageButtonSvg from '../../assets/svg/messageButton.svg';
import messageTimeSvg from '../../assets/svg/messageTime.svg';
import messageHandSvg from '../../assets/svg/messageHand.svg';
import messageunHandSvg from '../../assets/svg/messageunHand.svg';
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
  const socketObj = useTypedSelector((state) => state.common.socketObj);
  const unMessageNum = useTypedSelector((state) => state.common.unMessageNum);
  const [messagePage, setMessagePage] = useState(1);
  const [messageTotal, setMessageTotal] = useState(0);
  const [messageNum, setMessageNum] = useState(0);
  const [messageArray, setMessageArray] = useState<any>([]);
  const [loading, setLoading] = useState(false);
  const [taskInfoShow, setTaskInfoShow] = useState(false);
  const [messageCheck, setMessageCheck] = useState(false);

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
    messageType14Png,
    messageType15Png,
    messageType16Png,
    messageType17Png,
    messageType18Png,
    messageType19Png,
    messageType20Svg,
    messageType21Svg,
  ];
  useEffect(() => {
    if (user && user._key) {
      getMessage(messagePage, messageCheck);
    }
  }, [user]);

  useEffect(() => {
    console.log('socketObj', socketObj);
    if (socketObj) {
      let newMessageArray = _.cloneDeep(messageArray);
      let newSocketObj = _.cloneDeep(socketObj);
      let newMessageTotal = messageTotal;
      newMessageArray.unshift(newSocketObj);
      newMessageArray[0]._key = newSocketObj.data.noticeKey;
      if (newSocketObj.data.type === 3 || newSocketObj.data.type === 5) {
        setMessageNum(messageNum + 1);
      }
      setMessageArray(newMessageArray);
      setMessageTotal(newMessageTotal + 1);
    }
  }, [socketObj]);
  const getMessage = async (page: number, check: boolean) => {
    let newMessageArray: any = [];
    setLoading(true);
    if (page == 1) {
      newMessageArray = [];
    } else {
      newMessageArray = _.cloneDeep(messageArray);
    }
    let messageRes: any = await api.auth.getMessageList(
      page,
      messageLimit,
      check ? 2 : 1
    );
    if (messageRes.msg === 'OK') {
      setLoading(false);
      newMessageArray.push(...messageRes.result);
      setMessageArray(newMessageArray);
      setMessageTotal(messageRes.totalNumber);
      setMessageNum(messageRes.allNotDealNotice35);
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
      clientHeight + scrollTop + 10 >= scrollHeight &&
      messageArray.length < messageTotal
    ) {
      newPage = newPage + 1;
      setMessagePage(newPage);
      getMessage(newPage, messageCheck);
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
    let newMessageNum = messageNum;
    let messageRes: any = await api.auth.sendReceipt(key);
    if (messageRes.msg === 'OK') {
      dispatch(setMessage(true, '签收成功', 'success'));
      dispatch(changeMessageMusic(true));
      newMessageArray[index].data.applyStatus = 1;
      setMessageArray(newMessageArray);
      setMessageNum(newMessageNum - 1);
    } else {
      dispatch(setMessage(true, messageRes.msg, 'error'));
    }
  };
  const checkAllMessage = async () => {
    let newMessageArray = _.cloneDeep(messageArray);
    let messageRes: any = await api.auth.batchSendReceipt();
    if (messageRes.msg === 'OK') {
      dispatch(setMessage(true, '批量签收成功', 'success'));
      newMessageArray = newMessageArray.map((item: any, index: number) => {
        if (item.data.type == 3 || item.data.type == 5) {
          item.data.applyStatus = 1;
        }
        return item;
      });
      setMessageNum(messageRes.result.failureNoticeKeyArray.length);
      setMessageArray(newMessageArray);
    } else {
      dispatch(setMessage(true, messageRes.msg, 'error'));
    }
  };
  return (
    <div className="messageBoard" style={{ width: type ? '100%' : '360px' }}>
      {loading ? <Loading /> : null}
      <div
        className="messageBoard-maintitle"
        style={
          !type ? { borderBottom: '1px solid rgba(216, 216, 216, 0.4)' } : {}
        }
      >
        <div>{!type ? '提醒' : 'null'}</div>
        <div className="messageBoard-mainbutton">
          <div style={{ fontSize: '14px', color: !type ? '#fff' : '#333' }}>
            <Checkbox
              checked={messageCheck}
              onChange={(e: any) => {
                setMessageCheck(e.target.checked);
                setMessagePage(1);
                getMessage(1, e.target.checked);
              }}
              color="primary"
            />
            签收任务
          </div>
          {messageNum ? (
            <Button
              variant="contained"
              color="primary"
              onClick={() => {
                checkAllMessage();
              }}
              style={{ color: '#fff', marginLeft: '10px', height: '30px' }}
            >
              批量签收{' '}
              <span style={{ marginLeft: '5px' }}> ({messageNum}) </span>
            </Button>
          ) : null}
        </div>
      </div>

      <div
        className="messageBoard-item"
        onScroll={scrollMessageLoading}
        style={
          // type && messageNum === 0
          //   ? { height: 'calc(100% - 10px)', marginTop: '10px' }
          { height: ' calc(100% - 50px)' }
        }
      >
        {messageArray.map((messageItem: any, messageIndex: number) => {
          const editRole =
            (messageItem.data.type == 3 &&
              messageItem.data.executorKey !== user._key) ||
            (messageItem.data.type == 5 &&
              messageItem.data.creatorKey !== user._key) ||
            ((messageItem.data.type == 5 || messageItem.data.type == 3) &&
              messageItem.data.applyStatus == 1) ||
            (messageItem.data.type !== 5 && messageItem.data.type !== 3);
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
                  {messageItem.data.cardKey ? (
                    <div
                      className="messageBoard-item-container"
                      onClick={() => {
                        dispatch(setChooseKey(messageItem.data.cardKey));
                        dispatch(changeTaskInfoVisible(true));
                        // setTaskInfoShow(true);
                      }}
                    >
                      <div
                        className="messageBoard-item-time"
                        style={{
                          marginBottom: '2px',
                          justifyContent: 'space-between',
                        }}
                      >
                        <div
                          style={{
                            display: 'flex',
                            alignItems: 'center',
                          }}
                        >
                          <div
                            style={{
                              width: '20px',
                              height: '20px',
                              overflow: 'hidden',
                              borderRadius: '50%',
                              marginRight: '5px',
                            }}
                          >
                            <img
                              src={messageItem.data.groupLogo}
                              alt=""
                              style={{
                                width: '100%',
                                height: '100%',
                                objectFit: 'cover',
                              }}
                            />
                          </div>
                          <div>
                            <span style={{ marginRight: '5px' }}>
                              {messageItem.data.groupName}
                            </span>
                            /
                            <span style={{ marginLeft: '5px' }}>
                              {messageItem.data.labelName
                                ? messageItem.data.labelName
                                : 'ToDo'}
                            </span>
                          </div>
                        </div>
                        <div>
                          {moment(parseInt(messageItem.data.time)).fromNow()}
                        </div>
                      </div>
                      <div className="messageBoard-item-time">
                        <div>{messageItem.data.creatorName}</div>
                        <img
                          src={
                            messageItem.data.finishConfirm ||
                            (messageItem.data.type == 5 &&
                              messageItem.data.applyStatus == 1)
                              ? messageHandSvg
                              : messageunHandSvg
                          }
                          alt=""
                          style={{
                            width: '11px',
                            height: '10px',
                            marginLeft: '5px',
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
                            messageItem.data.assignConfirm ||
                            (messageItem.data.type == 3 &&
                              messageItem.data.applyStatus == 1)
                              ? messageHandSvg
                              : messageunHandSvg
                          }
                          alt=""
                          style={{
                            width: '11px',
                            height: '10px',
                            marginBottom: '3px',
                          }}
                        />
                        <img
                          src={
                            messageItem.data.finishPercent == 0
                              ? messageunFinishSvg
                              : messageFinishSvg
                          }
                          alt=""
                          style={{
                            width: '15px',
                            height: '15px',
                            marginLeft: '8px',
                          }}
                        />
                        <div
                          className="messageBoard-item-taskTime"
                          style={{
                            backgroundImage: 'url(' + messageTimeSvg + ')',
                          }}
                        >
                          <div className="messageBoard-item-day">
                            {messageItem.data
                              ? moment(messageItem.data.taskEndDate)
                                  .endOf('day')
                                  .diff(moment().endOf('day'), 'days') < 0
                                ? Math.abs(
                                    moment(messageItem.data.taskEndDate)
                                      .endOf('day')
                                      .diff(moment().endOf('day'), 'days')
                                  )
                                : Math.abs(
                                    moment(messageItem.data.taskEndDate)
                                      .endOf('day')
                                      .diff(moment().endOf('day'), 'days')
                                  ) + 1
                              : null}
                          </div>
                          <div className="messageBoard-item-hour">
                            {messageItem.data.hour}
                          </div>
                        </div>
                      </div>
                      <div
                        className="messageBoard-item-name1"
                        style={{
                          margin: editRole
                            ? '0px 0px 6px 0px'
                            : '10px 0px 6px 0px',
                          color: editRole ? '#333' : '#17B881',
                          width: editRole ? '100%' : 'calc(100% - 55px)',
                        }}
                      >
                        {messageItem.data.type !== 21
                          ? messageItem.data.name1 +
                            ' ' +
                            messageItem.data.action
                          : messageItem.data.content}
                      </div>
                      {messageItem.data.type !== 21 ? (
                        <div className="messageBoard-item-task">
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
                      ) : null}
                      {(messageItem.data.type == 3 &&
                        messageItem.data.executorKey == user._key) ||
                      (messageItem.data.type == 5 &&
                        messageItem.data.creatorKey === user._key) ? (
                        <div
                          style={{
                            animation:
                              messageItem.data.applyStatus == 1
                                ? 'changeSmall 500ms'
                                : '',
                            animationFillMode:
                              messageItem.data.applyStatus == 1
                                ? 'forwards'
                                : '',
                          }}
                          className="messageBoard-item-task-button"
                          onClick={(e) => {
                            e.stopPropagation();
                            checkMsg(messageItem._key, messageIndex);
                          }}
                        >
                          <img src={messageButtonSvg} alt="" />
                          <div style={{ marginLeft: '5px' }}>签收</div>
                        </div>
                      ) : null}
                    </div>
                  ) : (
                    <div
                      className="messageBoard-item-container"
                      style={{
                        display: 'flex',
                        justifyContent: 'space-between',
                      }}
                    >
                      <div
                        style={{
                          width: '80%',
                        }}
                      >
                        <div className="messageBoard-item-name1">
                          {messageItem.data.name1 + ' '}
                          {messageItem.data.action}
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
                      <div
                        className="messageBoard-item-time"
                        style={{
                          height: '22px',
                        }}
                      >
                        {moment(parseInt(messageItem.data.time)).fromNow()}
                      </div>
                    </div>
                  )}
                </div>
              ) : null}
            </React.Fragment>
          );
        })}
        {/*  */}
      </div>
      {/* {taskInfoShow ? (
        <TaskInfo
          onClose={() => {
            setTaskInfoShow(false);
          }}
          type="new"
        />
      ) : null} */}
    </div>
  );
};
export default MessageBoard;
