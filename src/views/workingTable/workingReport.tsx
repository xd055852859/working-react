import React, { useState, useEffect } from 'react';
import './workingReport.css';
import { useTypedSelector } from '../../redux/reducer/RootState';
import { createStyles, makeStyles, Theme } from '@material-ui/core/styles';
import { TextField, Button } from '@material-ui/core';
import { useDispatch } from 'react-redux';
import { setMessage } from '../../redux/actions/commonActions';
import { getWorkingTableTask } from '../../redux/actions/taskActions';
import _ from 'lodash';
import api from '../../services/api';
import moment from 'moment';
// import replyPng from '../../assets/img/replyDiary.png';
import deletePng from '../../assets/img/deleteDiary.png';
import commentPng from '../../assets/img/comment.png';
// import likePng from '../../assets/img/like.png';
// import unlikePng from '../../assets/img/unlike.png';
// import clickNumberPng from '../../assets/img/clickNumber.png';
import DropMenu from '../../components/common/dropMenu';
import defaultPersonPng from '../../assets/img/defaultPerson.png';
// import Editor from '../../components/common/Editor';
import Task from '../../components/task/task';

export interface WorkingReportProps {
  headerType?: boolean;
}

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      margin: '-10px 0px',
    },
    input: {
      width: '80%',
      color: '#fff',
      '& .MuiInput-formControl': {
        marginTop: '0px',
        borderColor: '#fff',
      },
      '& .MuiOutlinedInput-input': {
        padding: '10px 14px',
        borderColor: '#fff',
        // color: '#fff',
      },
      '& .MuiInputLabel-formControl': {
        marginTop: '-10px',
        // color: '#fff',
      },
    },
    button: {
      backgroundColor: '#17B881',
      color: '#fff',
    },
    datePicker: {
      '& .MuiInput-formControl': {
        marginLeft: '5px',
      },
    },
  })
);
const WorkingReport: React.FC<WorkingReportProps> = (props) => {
  const { headerType } = props;
  const dispatch = useDispatch();
  const classes = useStyles();
  const user = useTypedSelector((state) => state.auth.user);
  const theme = useTypedSelector((state) => state.auth.theme);
  const targetUserInfo = useTypedSelector((state) => state.auth.targetUserInfo);
  const headerIndex = useTypedSelector((state) => state.common.headerIndex);
  const mainGroupKey = useTypedSelector((state) => state.auth.mainGroupKey);
  const taskArray = useTypedSelector((state) => state.task.taskArray);
  const workingTaskArray = useTypedSelector(
    (state) => state.task.workingTaskArray
  );
  const [dateArray, setDateArray] = useState<any>([]);
  const [diaryList, setDiaryList] = useState<any>([]);
  const [diaryIndex, setDiaryIndex] = useState(0);
  const [diaryKey, setDiaryKey] = useState<any>(null);
  const [comment, setComment] = useState('');
  const [positive, setPositive] = useState('');
  const [negative, setNegative] = useState('');
  const [note, setNote] = useState('');
  const [commentList, setCommentList] = useState<any>([]);
  const [dayCanlendarArray, setDayCanlendarArray] = useState<any>([]);
  const [commentPage, setCommentPage] = useState(1);
  const [commentTotal, setCommentTotal] = useState(0);
  const [contentItem, setContentItem] = useState<any>(null);
  const [contentState, setContentState] = useState(false);
  const [contentKey, setContentKey] = useState(0);
  const [isLike, setIsLike] = useState(false);
  const [personObj, setPersonObj] = useState<any>({});
  const [personArray, setPersonArray] = useState<any>([{}]);
  const [personIndex, setPersonIndex] = useState(0);
  const commentLimit = 10;

  useEffect(() => {
    if (user && user._key) {
      if (!headerType) {
        if (headerIndex == 3 && taskArray && !headerType) {
          getData(taskArray);
        } else if (headerIndex == 1 && workingTaskArray) {
          getDiaryList(
            moment().subtract(theme.fileDay, 'days').startOf('day').valueOf(),
            moment().endOf('day').valueOf()
          );
        } else if (
          headerIndex == 2 &&
          workingTaskArray &&
          targetUserInfo &&
          !headerType
        ) {
          getDiaryList(
            moment().subtract(theme.fileDay, 'days').startOf('day').valueOf(),
            moment().endOf('day').valueOf()
          );
        }
      } else {
        getDiaryList(
          moment().subtract(theme.fileDay, 'days').startOf('day').valueOf(),
          moment().endOf('day').valueOf()
        );
      }
    }
  }, [user, workingTaskArray, taskArray, targetUserInfo]);
  useEffect(() => {
    if (user && user._key && headerType) {
      dispatch(getWorkingTableTask(1, user._key, 1, [0, 1, 2,10], theme.fileDay));
    }
  }, [headerType]);
  const chooseDiary = async (index: number) => {
    setDiaryIndex(index);
    setContentKey(dateArray[index]._key);
    setPositive('');
    setNegative('');
    setNote('');
    setCommentPage(1);
    setCommentList([]);
    setComment('');
    if (headerIndex != 3) {
      getDiaryNote(dateArray[index].start, diaryKey);
      if (dateArray[index]._key) {
        getCommentList(1, dateArray[index]._key);
      }
    }
  };
  const choosePerson = (key: string, index: number) => {
    setDiaryKey(key);
    setPersonIndex(index);
    getData(taskArray, null, key);
  };
  const getData = async (
    taskArray: any,
    diaryList?: any,
    chooseDiaryKey?: string | number
  ) => {
    let newDateArray: any = [];
    let newDayCanlendarArray: any = [];
    let newPersonObj = _.cloneDeep(personObj);
    let newPersonArray = _.cloneDeep(personArray);
    let newDiaryKey: string | number = '';
    let arr: any = [];
    for (let i = theme.fileDay; i >= 0; i--) {
      arr.push({
        start: moment().subtract(i, 'days').startOf('day').valueOf(),
        end: moment().subtract(i, 'days').endOf('day').valueOf(),
      });
    }
    taskArray = taskArray.filter((item: any, index: number) => {
      return (
        item.taskEndDate >= arr[0].start &&
        item.taskEndDate <= arr[arr.length - 1].end
      );
    });
    taskArray.forEach((taskItem: any, taskIndex: number) => {
      if (taskItem.executorKey) {
        newPersonObj[taskItem.executorKey] = {
          key: taskItem.executorKey,
          avatar: taskItem.executorAvatar,
          name: taskItem.executorName,
        };
      }
    });
    newPersonArray = Object.values(newPersonObj);
    if (headerIndex == 3 && !headerType) {
      if (chooseDiaryKey) {
        setDiaryKey(chooseDiaryKey);
        newDiaryKey = chooseDiaryKey;
      } else {
        setDiaryKey('全部');
        newDiaryKey = '全部';
      }
    } else if (headerIndex == 1 || headerType) {
      setDiaryKey(user._key);
      newDiaryKey = user._key;
    } else if (headerIndex == 2) {
      setDiaryKey(targetUserInfo._key);
      newDiaryKey = targetUserInfo._key;
    }
    console.log(taskArray);
    arr.forEach((item: any, index: number) => {
      newDateArray[index] = {
        creatorArr: [],
        executorArr: [],
        date: formatTime(item.start),
        start: item.start,
        end: item.end,
      };
      taskArray.forEach((taskItem: any, taskIndex: number) => {
        if (
          taskItem.taskEndDate >= item.start &&
          taskItem.taskEndDate <= item.end
        ) {
          if (newDiaryKey == '全部') {
            newDateArray[index].executorArr.push(taskItem);
          } else if (newDiaryKey == taskItem.executorKey) {
            newDateArray[index].executorArr.push(taskItem);
          } else if (
            newDiaryKey == taskItem.creatorKey &&
            taskItem.executorKey != taskItem.creatorKey
          ) {
            newDateArray[index].creatorArr.push(taskItem);
          }
        }
      });
    });
    // this.dateArray.forEach((item, index) => {});
    newDateArray = newDateArray.reverse();
    newDateArray = newDateArray.filter((item: any, index: number) => {
      return item.executorArr.length > 0;
    });
    // if (newDiaryKey != '全部') {
    newDateArray.forEach((item: any, index: number) => {
      newDayCanlendarArray[index] = {};
      item.executorArr.forEach((taskItem: any, taskIndex: number) => {
        if (taskItem.executorKey) {
          if (!newDayCanlendarArray[index][taskItem.executorKey]) {
            newDayCanlendarArray[index][taskItem.executorKey] = {};
          }
          if (
            newDayCanlendarArray[index][taskItem.executorKey] &&
            !newDayCanlendarArray[index][taskItem.executorKey].executorArr
          ) {
            newDayCanlendarArray[index][taskItem.executorKey].executorArr = [];
          }
          newDayCanlendarArray[index][taskItem.executorKey].executorArr.push(
            taskItem
          );
        }
      });
      item.creatorArr.forEach((taskItem: any, taskIndex: number) => {
        if (taskItem.creatorKey) {
          if (!newDayCanlendarArray[index][taskItem.creatorKey]) {
            newDayCanlendarArray[index][taskItem.creatorKey] = {};
          }
          if (
            newDayCanlendarArray[index][taskItem.creatorKey] &&
            !newDayCanlendarArray[index][taskItem.creatorKey].creatorArr
          ) {
            newDayCanlendarArray[index][taskItem.creatorKey].creatorArr = [];
          }
          newDayCanlendarArray[index][taskItem.creatorKey].creatorArr.push(
            taskItem
          );
        }
      });
      if (headerIndex !== 3) {
        diaryList.forEach((diaryItem: any, diaryIndex: number) => {
          if (diaryItem.startTime == item.start) {
            item._key = diaryItem._key;
          }
        });
      }
    });
    // api.auth.getDiaryList(
    //   headerIndex === 1 ? user._key : targetUserInfo._key,
    //   moment().subtract(1, 'days').startOf('day').valueOf(),
    //   moment().subtract(1, 'days').endOf('day').valueOf()
    // );
    getDiaryNote(moment().startOf('day').valueOf(), newDiaryKey);
    setDateArray(newDateArray);
    setDayCanlendarArray(newDayCanlendarArray);
    newPersonArray.unshift({ key: '全部', avatar: '', name: '全部' });
    setPersonArray(newPersonArray);
    console.log(newDateArray);
    console.log(newDayCanlendarArray);
    console.log(newPersonArray);
  };
  const getDiaryNote = async (startTime: number, diaryKey: any) => {
    console.log('???????????', moment(startTime).format('YYYY-MM-DD'));
    if (diaryKey) {
      let noteRes: any = await api.auth.getNote(diaryKey, startTime);
      if (noteRes.msg == 'OK') {
        setPositive(noteRes.result.positive);
        setNegative(noteRes.result.negative);
        setNote(noteRes.result.note);
      } else {
        if (noteRes.msg == '无该成就/风险/随记') {
          await api.auth.setNote({
            startTime: moment().startOf('day').valueOf(),
            type: 2,
            positive: '',
            negative: '',
            note: '',
            positiveClose: '',
            negativeClose: '',
            noteClose: '',
          });
        } else {
          dispatch(setMessage(true, noteRes.msg, 'error'));
        }
      }
    }
  };
  const getDiaryList = async (startTime: number, endTime: number) => {
    let res: any = await api.auth.getDiaryList(
      headerIndex == 1 || headerType ? user._key : targetUserInfo._key,
      startTime,
      endTime
    );
    if (res.msg == 'OK') {
      setDiaryList(res.result);
      if (res.result.length > 0) {
        if (res.result[0]._key) {
          setContentKey(res.result[0]._key);
          getCommentList(1, res.result[0]._key);
        }
      }
      getData(_.flatten(workingTaskArray), res.result);
    } else {
      dispatch(setMessage(true, res.msg, 'error'));
    }
  };
  const getCommentList = async (page: number, contentKey: number | string) => {
    let newCommentList = _.cloneDeep(commentList);
    setCommentPage(page);
    if (page == 1) {
      newCommentList = [];
    }
    let res: any = await api.auth.getClockInCommentList(
      contentKey,
      page,
      commentLimit
    );
    if (res.msg == 'OK') {
      newCommentList.push(...res.result);
      setCommentList(newCommentList);
      setCommentTotal(res.totalNumber);
    } else {
      dispatch(setMessage(true, res.msg, 'error'));
    }
  };
  const scrollCommentLoading = (e: any) => {
    let newCommentPage = commentPage;
    //文档内容实际高度（包括超出视窗的溢出部分）
    let scrollHeight = e.target.scrollHeight;
    //滚动条滚动距离
    let scrollTop = e.target.scrollTop;
    //窗口可视范围高度
    let clientHeight = e.target.clientHeight;
    if (
      clientHeight + scrollTop >= scrollHeight &&
      commentList.length < commentTotal
    ) {
      newCommentPage = newCommentPage + 1;
      getCommentList(commentPage, contentKey);
    }
  };
  const getAllReport = (dayCanlendarItem: any, dayCanlendarIndex: number) => {
    let dom: any = [];
    for (let dayKey in dayCanlendarItem) {
      dom.push(
        <React.Fragment key={'day' + dayKey}>
          <div className="diaryall-subtitle">
            <div className="diaryall-subtitle-img">
              <img
                src={
                  dayCanlendarItem[dayKey].executorArr[0].executorAvatar
                    ? dayCanlendarItem[dayKey].executorArr[0].executorAvatar
                    : defaultPersonPng
                }
                alt=""
              />
            </div>
            <div>{dayCanlendarItem[dayKey].executorArr[0].executorName}</div>
          </div>
          <div className="diary-container-title">1. 执行任务</div>
          {dayCanlendarItem[dayKey].executorArr.map(
            (item: any, index: number) => {
              return (
                <div
                  key={'allDate' + index}
                  className="diary-container-item"
                  // onClick={() => {
                  //   setDiaryIndex(diaryIndex);
                  // }}
                >
                  <Task
                    taskItem={item}
                    timeSetStatus={
                      index > dayCanlendarItem[dayKey].executorArr.length - 3
                    }
                  />
                </div>
              );
            }
          )}
          <div className="diary-container-title">2. 创建任务</div>
          {dayCanlendarItem[dayKey].creatorArr &&
          dayCanlendarItem[dayKey].creatorArr.length > 0
            ? dayCanlendarItem[dayKey].creatorArr.map(
                (item: any, index: number) => {
                  return (
                    <div
                      key={'allDate' + index}
                      className="diary-container-item"
                      // onClick={() => {
                      //   setDiaryIndex(diaryIndex);
                      // }}
                    >
                      <Task
                        taskItem={item}
                        timeSetStatus={
                          index > dayCanlendarItem[dayKey].creatorArr.length - 3
                        }
                      />
                    </div>
                  );
                }
              )
            : null}
        </React.Fragment>
      );
    }
    return dom;
  };
  const likeDiary = async (num: number) => {
    // let res = await api.task.likeClockIn({
    //   clockInKey: this.contentItem._key,
    //   likeNumber: num,
    // });
    // if (res.msg == "OK") {
    //   if (num > 0) {
    //     this.$message.success("点赞成功");
    //     this.isLike = true;
    //   } else if (num < 0) {
    //     this.$message.success("取消点赞");
    //     this.isLike = false;
    //   }
    // } else {
    //   this.$message.error(res.msg);
    // }
    // this.contentItem.likeNumber = this.contentItem.likeNumber + num;
  };
  const saveNote = async () => {
    let noteRes: any = await api.auth.setNote({
      startTime: dateArray[diaryIndex].start,
      type: 2,
      positive: positive,
      negative: negative,
      note: note,
    });
    if (noteRes.msg === 'OK') {
      dispatch(setMessage(true, '随记保存成功', 'success'));
    } else {
      dispatch(setMessage(true, noteRes.msg, 'error'));
    }
  };

  const addComment = async () => {
    let newCommentList = _.cloneDeep(commentList);
    let res: any = await api.auth.addClockInComment(contentKey, comment);
    if (res.msg === 'OK') {
      dispatch(setMessage(true, '评论成功', 'success'));
      setComment('');
      newCommentList.unshift(res.result);
      setCommentList(newCommentList);
    } else {
      dispatch(setMessage(true, res.msg, 'error'));
    }
  };
  const deleteComment = async (item: any, index: number) => {
    let newCommentList = _.cloneDeep(commentList);
    let res: any = await api.auth.deleteClockInComment(item._key);
    if (res.msg == 'OK') {
      dispatch(setMessage(true, '删除成功', 'success'));
      newCommentList.splice(index, 1);
      setCommentList(newCommentList);
    } else {
      dispatch(setMessage(true, res.msg, 'error'));
    }
  };
  const formatTime = (time: number) => {
    let week = moment(time).day();
    let timeStr = '';
    switch (week) {
      case 1:
        timeStr = '周一 ';
        break;
      case 2:
        timeStr = '周二 ';
        break;
      case 3:
        timeStr = '周三 ';
        break;
      case 4:
        timeStr = '周四 ';
        break;
      case 5:
        timeStr = '周五 ';
        break;
      case 6:
        timeStr = '周六 ';
        break;
      case 0:
        timeStr = '周日 ';
        break;
    }
    return [timeStr, moment(time).format('M.DD')];
  };
  const addTask = async () => {
    let addTaskRes: any = await api.task.addTask(
      mainGroupKey,
      1,
      null,
      user._key,
      '',
      '',
      0,
      2,
      0,
      0,
      dateArray[diaryIndex].end
    );
    if (addTaskRes.msg === 'OK') {
      dispatch(setMessage(true, '新增任务成功', 'success'));
      dispatch(getWorkingTableTask(1, user._key, 1, [0, 1, 2,10], theme.fileDay));
    } else {
      dispatch(setMessage(true, addTaskRes.msg, 'error'));
    }
  };
  return (
    <div className="diary">
      <div className="diary-bg">
        <div className="diary-menu">
          <div className="diary-menu-title">目录</div>
          <div className="diary-menu-container">
            {dateArray.map((item: any, index: number) => {
              return (
                <React.Fragment key={'date' + index}>
                  {diaryKey !== '全部' ? (
                    <div
                      className="diary-menu-item"
                      onClick={() => {
                        chooseDiary(index);
                      }}
                      style={{
                        backgroundColor:
                          diaryIndex == index ? 'rgb(229, 231, 234)' : '',
                      }}
                    >
                      <span style={{ marginRight: '10px' }}>
                        {item.date[0]}
                      </span>
                      <span>{item.date[1]}</span>
                      <span>({item.executorArr.length})</span>
                    </div>
                  ) : (
                    <a href={'#diaryall' + index} className="diary-menu-item">
                      <span style={{ marginRight: '10px' }}>
                        {item.date[0]}
                      </span>
                      <span>{item.date[1]}</span>
                      <span>({item.executorArr.length})</span>
                    </a>
                  )}
                </React.Fragment>
              );
            })}
          </div>
        </div>
        {dayCanlendarArray.length > 0 ? (
          <div className="diary-container">
            {headerIndex != 3 ? (
              <h2>
                一、任务看板
                {headerIndex === 1 || headerType ? (
                  <React.Fragment>
                    <Button
                      variant="contained"
                      color="primary"
                      onClick={() => {
                        saveNote();
                      }}
                      className="save-button"
                    >
                      保存
                    </Button>
                    <Button
                      variant="contained"
                      color="primary"
                      onClick={() => {
                        addTask();
                      }}
                      className="save-button"
                    >
                      添加任务
                    </Button>
                  </React.Fragment>
                ) : null}
              </h2>
            ) : null}
            {diaryKey !== '全部' ? (
              <React.Fragment>
                <div className="diary-container-title">1. 执行任务</div>
                {dayCanlendarArray[diaryIndex][diaryKey] &&
                dayCanlendarArray[diaryIndex][diaryKey].executorArr &&
                dayCanlendarArray[diaryIndex][diaryKey].executorArr.length > 0
                  ? dayCanlendarArray[diaryIndex][diaryKey].executorArr.map(
                      (taskItem: any, taskIndex: number) => {
                        return (
                          <div
                            key={'date' + taskIndex}
                            className="diary-container-item"
                            // onClick={() => {
                            //   setDiaryIndex(diaryIndex);
                            // }}
                          >
                            <Task
                              taskItem={taskItem}
                              timeSetStatus={
                                taskIndex >
                                dayCanlendarArray[diaryIndex][diaryKey]
                                  .executorArr.length -
                                  3
                              }
                            />
                          </div>
                        );
                      }
                    )
                  : null}
                <div className="diary-container-title">2. 创建任务</div>
                {dayCanlendarArray[diaryIndex][diaryKey] &&
                dayCanlendarArray[diaryIndex][diaryKey].creatorArr &&
                dayCanlendarArray[diaryIndex][diaryKey].creatorArr.length > 0
                  ? dayCanlendarArray[diaryIndex][diaryKey].creatorArr.map(
                      (taskItem: any, taskIndex: number) => {
                        return (
                          <div
                            key={'date' + taskIndex}
                            className="diary-container-item"
                            // onClick={() => {
                            //   setDiaryIndex(diaryIndex);
                            // }}
                          >
                            <Task
                              taskItem={taskItem}
                              timeSetStatus={
                                taskIndex >
                                dayCanlendarArray[diaryIndex][diaryKey]
                                  .creatorArr.length -
                                  3
                              }
                            />
                          </div>
                        );
                      }
                    )
                  : null}
              </React.Fragment>
            ) : (
              <React.Fragment>
                {dayCanlendarArray.map(
                  (dayCanlendarItem: any, dayCanlendarIndex: number) => {
                    return (
                      <div>
                        <a
                          id={'diaryall' + dayCanlendarIndex}
                          className="diaryall-a"
                        ></a>
                        <div className="diaryall-title">
                          {moment(dateArray[dayCanlendarIndex].start).format(
                            'YYYY年MM月DD日'
                          )}
                        </div>
                        {getAllReport(dayCanlendarItem, dayCanlendarIndex)}
                      </div>
                    );
                  }
                )}
              </React.Fragment>
            )}

            {headerIndex != 3 || headerType ? (
              <React.Fragment>
                <h2>二、工作日志</h2>
                <div className="diary-content-pn">
                  <div className="diary-content-tab">
                    <div>成绩</div>
                    <div>审视</div>
                  </div>
                  <div className="diary-content-info">
                    {headerIndex == 1 || headerType ? (
                      <textarea
                        value={positive}
                        placeholder="成绩,收获,价值创造"
                        className="diary-content-textarea"
                        onChange={(e) => {
                          setPositive(e.target.value);
                        }}
                      />
                    ) : (
                      <div className="diary-content-textarea">{positive}</div>
                    )}
                    {headerIndex == 1 || headerType ? (
                      <textarea
                        value={negative}
                        placeholder="困难，挑战，潜在问题"
                        className="diary-content-textarea"
                        onChange={(e) => {
                          setNegative(e.target.value);
                        }}
                      />
                    ) : (
                      <div className="diary-content-textarea">{negative}</div>
                    )}
                  </div>
                </div>
                <h2>三、随记</h2>
                {headerIndex == 1 || headerType ? (
                  <textarea
                    value={note}
                    placeholder="随记"
                    className="diary-textarea"
                    onChange={(e) => {
                      setNote(e.target.value);
                    }}
                  />
                ) : (
                  <div className="diary-textarea">{note}</div>
                )}
                {/* 可能不存在打卡key */}
                {contentKey ? (
                  <React.Fragment>
                    <div className="diary-comment">
                      <div className="diary-comment-title">
                        <div className="diary-comment-icon">
                          <img src={commentPng} alt="" />
                          评论
                        </div>
                        {/* <div className="diary-comment-like">
                      {contentItem.isLike ? (
                        <img
                          src={likePng}
                          alt=""
                          onClick={() => {
                            likeDiary(-1);
                          }}
                        />
                      ) : (
                        <img
                          src={unlikePng}
                          alt=""
                          onClick={() => {
                            likeDiary(1);
                          }}
                        />
                      )}
                      点赞 {contentItem.likeNumber}
                    </div> */}
                      </div>
                      {commentList.length > 0 ? (
                        <div
                          className="diary-comment-info"
                          onScroll={scrollCommentLoading}
                        >
                          {commentList.map(
                            (commentItem: any, commentIndex: number) => {
                              return (
                                <div
                                  className="diary-comment-item"
                                  key={commentIndex}
                                >
                                  <div className="diary-comment-item-avatar">
                                    <img src={commentItem.avatar} alt="" />
                                  </div>
                                  <div className="diary-comment-item-info">
                                    <div className="diary-comment-item-nickName">
                                      {commentItem.nickName}
                                    </div>
                                    <div className="diary-comment-item-content">
                                      {commentItem.content}
                                    </div>
                                  </div>
                                  {commentItem.userKey == user._key ? (
                                    <div
                                      className="diary-comment-item-reply"
                                      onClick={() => {
                                        deleteComment(
                                          commentItem,
                                          commentIndex
                                        );
                                      }}
                                    >
                                      <div className="diary-comment-delete-icon">
                                        <img src={deletePng} alt="" />
                                      </div>
                                      <div className="diary-comment-reply-title">
                                        删除
                                      </div>
                                    </div>
                                  ) : null}
                                </div>
                              );
                            }
                          )}
                        </div>
                      ) : null}
                    </div>

                    <div className="diary-comment-button">
                      <TextField
                        placeholder="我要评论......"
                        style={{ width: '90%' }}
                        onChange={(e: any) => {
                          setComment(e.target.value);
                        }}
                        value={comment}
                        onKeyDown={(e: any) => {
                          if (e.keyCode === 13) {
                            addComment();
                          }
                        }}
                      />
                      <Button
                        variant="contained"
                        color="primary"
                        style={{ marginRight: '10px' }}
                        className={classes.button}
                        onClick={() => {
                          addComment();
                        }}
                      >
                        发送
                      </Button>
                    </div>
                  </React.Fragment>
                ) : null}
              </React.Fragment>
            ) : null}
          </div>
        ) : null}
      </div>

      <DropMenu
        visible={headerIndex === 3 && !headerType}
        dropStyle={{
          width: '45px',
          maxHeight: '800px',
          top: '108px',
          left: 'calc(100% - 50px)',
          color: '#333',
          position: 'fixed',
          zIndex: 5,
          padding: '5px',
          boxSizing: 'border-box',
          overflow: 'auto',
        }}
      >
        <React.Fragment>
          {personArray.length > 0 ? (
            <React.Fragment>
              {personArray.map((item: any, index: number) => {
                return (
                  <React.Fragment key={'person' + index}>
                    {index == 0 ? (
                      <div
                        className="diary-avatar"
                        onClick={() => {
                          choosePerson(item.key, index);
                        }}
                        style={
                          item.key === diaryKey
                            ? {
                                backgroundColor: '#17B881',
                                color: '#fff',
                              }
                            : {}
                        }
                      >
                        全部
                      </div>
                    ) : (
                      <div
                        className="diary-avatar"
                        onClick={() => {
                          choosePerson(item.key, index);
                        }}
                        style={
                          item.key === diaryKey
                            ? {
                                border: '2px solid #17B881',
                              }
                            : {}
                        }
                      >
                        <img src={item.avatar} alt="" />
                      </div>
                    )}
                  </React.Fragment>
                );
              })}
            </React.Fragment>
          ) : null}
        </React.Fragment>
      </DropMenu>
    </div>
  );
};
export default WorkingReport;
