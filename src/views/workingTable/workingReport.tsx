import React, { useState, useEffect } from 'react';
import './workingReport.css';
import { useTypedSelector } from '../../redux/reducer/RootState';
import { createStyles, makeStyles, Theme } from '@material-ui/core/styles';
import { TextField, Button } from '@material-ui/core';
import { useDispatch } from 'react-redux';
import { setMessage } from '../../redux/actions/commonActions';
import _ from 'lodash';
import api from '../../services/api';
import moment from 'moment';
import replyPng from '../../assets/img/replyDiary.png';
import deletePng from '../../assets/img/deleteDiary.png';
import commentPng from '../../assets/img/comment.png';
import likePng from '../../assets/img/like.png';
import unlikePng from '../../assets/img/unlike.png';
import clickNumberPng from '../../assets/img/clickNumber.png';
import DropMenu from '../../components/common/dropMenu';
import Editor from '../../components/common/Editor';
import Task from '../../components/task/task';

export interface WorkingReportProps {}

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
  const dispatch = useDispatch();
  const classes = useStyles();
  const user = useTypedSelector((state) => state.auth.user);
  const targetUserInfo = useTypedSelector((state) => state.auth.targetUserInfo);
  const headerIndex = useTypedSelector((state) => state.common.headerIndex);
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
  const [personArray, setPersonArray] = useState<any>([]);
  const [personIndex, setPersonIndex] = useState(0);
  const commentLimit = 10;

  useEffect(() => {
    if (user && user._key) {
      if (headerIndex == 3 && taskArray) {
        getData(taskArray);
      } else if (headerIndex == 1 && workingTaskArray) {
        getData(_.flatten(workingTaskArray));
      } else if (headerIndex == 2 && workingTaskArray && targetUserInfo) {
        getData(_.flatten(workingTaskArray));
      }
    }
  }, [user, workingTaskArray, taskArray, targetUserInfo]);
  useEffect(() => {
    if (contentKey) {
      if (headerIndex != 3) {
        getCommentList(commentPage);
      }
    }
  }, [contentKey]);
  const chooseDiary = async (index: number) => {
    setDiaryIndex(index);
    setPositive('');
    setNegative('');
    setNote('');
    setCommentPage(1);
    if (headerIndex != 3) {
      getDiaryList(dateArray[index].start, dateArray[index].end);
    }
    getDiaryNote(dateArray[index].start);
  };
  const choosePerson = (key: string, index: number) => {
    setDiaryKey(key);
    setPersonIndex(index);
    // getData(taskArray, key);
  };
  const getData = async (taskArray: any, chooseDiaryKey?: string | number) => {
    let newDateArray: any = [];
    let newDayCanlendarArray: any = [];
    let newPersonObj = _.cloneDeep(personObj);
    let newPersonArray = _.cloneDeep(personArray);
    let newDiaryKey: string | number = '';
    let arr: any = [];
    for (let i = 30; i > 0; i--) {
      arr.push({
        start: moment().subtract(i, 'days').startOf('day').valueOf(),
        end: moment().subtract(i, 'days').endOf('day').valueOf(),
      });
    }
    console.log('arr', arr);
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
    if (headerIndex == 3) {
      if (chooseDiaryKey) {
        setDiaryKey(chooseDiaryKey);
        newDiaryKey = chooseDiaryKey;
      } else if (newPersonArray[0]) {
        setDiaryKey(newPersonArray[0].key);
        newDiaryKey = newPersonArray[0].key;
      }
    } else if (headerIndex == 1) {
      setDiaryKey(user._key);
      newDiaryKey = user._key;
    } else if (headerIndex == 2) {
      setDiaryKey(targetUserInfo._key);
      newDiaryKey = targetUserInfo._key;
    }
    arr.forEach((item: any, index: number) => {
      newDateArray[index] = {
        arr: [],
        date: formatTime(item.start),
        start: item.start,
        end: item.end,
      };
      taskArray.forEach((taskItem: any, taskIndex: number) => {
        if (
          taskItem.taskEndDate >= item.start &&
          taskItem.taskEndDate <= item.end &&
          newDiaryKey == taskItem.executorKey
        ) {
          newDateArray[index].arr.push(taskItem);
        }
      });
    });
    // this.dateArray.forEach((item, index) => {});
    newDateArray = newDateArray.reverse();
    newDateArray = newDateArray.filter((item: any, index: number) => {
      return item.arr.length > 0;
    });
    newDateArray.forEach((item: any, index: number) => {
      newDayCanlendarArray[index] = {};
      item.arr.forEach((taskItem: any, taskIndex: number) => {
        if (taskItem.executorKey) {
          if (!newDayCanlendarArray[index][taskItem.executorKey]) {
            newDayCanlendarArray[index][taskItem.executorKey] = [];
          }
          newDayCanlendarArray[index][taskItem.executorKey].push(taskItem);
        }
      });
    });
    // api.auth.getDiaryList(
    //   headerIndex === 1 ? user._key : targetUserInfo._key,
    //   moment().subtract(1, 'days').startOf('day').valueOf(),
    //   moment().subtract(1, 'days').endOf('day').valueOf()
    // );
    if (headerIndex != 3) {
      getDiaryList(
        moment().subtract(1, 'days').startOf('day').valueOf(),
        moment().subtract(1, 'days').endOf('day').valueOf()
      );
    }
    getDiaryNote(moment().subtract(1, 'days').startOf('day').valueOf());
    console.log('newPersonArray', newPersonArray);
    console.log('newDateArray', newDateArray);
    console.log('newDayCanlendarArray', newDayCanlendarArray);
    setDateArray(newDateArray);
    setDayCanlendarArray(newDayCanlendarArray);
    setPersonArray(newPersonArray);
  };
  const getDiaryNote = async (startTime: number) => {
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
  };
  const getDiaryList = async (startTime: number, endTime: number) => {
    let res: any = await api.auth.getDiaryList(
      headerIndex == 1 ? user._key : targetUserInfo._key,
      startTime,
      endTime
    );
    if (res.msg == 'OK') {
      if (res.result.length > 0) {
        setContentKey(res.result[0]._key);
      }
    } else {
      dispatch(setMessage(true, res.msg, 'error'));
    }
  };
  const getCommentList = async (page: number) => {
    let newCommentList = _.cloneDeep(commentList);
    setCommentPage(page);
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
      getCommentList(commentPage);
    }
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
  const addComment = async () => {
    let newCommentList = _.cloneDeep(commentList);
    let res: any = await api.auth.addClockInComment(contentKey, comment);
    if (res.msg === 'OK') {
      dispatch(setMessage(true, '评论成功', 'success'));
      newCommentList.unshift(res.result);
      setComment('');
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
  return (
    <div className="diary">
      <div className="diary-bg">
        <div className="diary-menu">
          <div className="diary-menu-title">目录</div>
          <div className="diary-menu-container">
            {dateArray.map((item: any, index: number) => {
              return (
                <div
                  key={'date' + index}
                  className="diary-menu-item"
                  onClick={() => {
                    chooseDiary(index);
                  }}
                  style={{
                    backgroundColor:
                      diaryIndex == index ? 'rgb(229, 231, 234)' : '',
                  }}
                >
                  <span style={{ marginRight: '10px' }}>{item.date[0]}</span>
                  <span>{item.date[1]}</span>
                  <span>({item.arr.length})</span>
                </div>
              );
            })}
          </div>
        </div>
        {dayCanlendarArray.length > 0 ? (
          <div className="diary-container">
            <h2>一、今日任务</h2>
            {dayCanlendarArray[diaryIndex][diaryKey].map(
              (taskItem: any, taskIndex: number) => {
                return (
                  <div
                    key={'date' + taskIndex}
                    className="diary-container-item"
                    onClick={() => {
                      setDiaryIndex(diaryIndex);
                    }}
                  >
                    <Task taskItem={taskItem} />
                  </div>
                );
              }
            )}

            <h2>二、PN</h2>
            <div className="diary-content-pn">
              <div className="diary-content-tab">
                <div>正面：利好、收获</div>
                <div>负正：利空、风险、压力</div>
              </div>
              <div className="diary-content-info">
                <div>{positive}</div>
                <div>{negative}</div>
              </div>
            </div>
            <h2>三、随记</h2>
            {/* <Editor /> */}
            {headerIndex != 3 ? (
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
                                  deleteComment(commentItem, commentIndex);
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
            ) : null}
            {headerIndex != 3 ? (
              <div className="diary-comment-button" v-if="groupType != 3">
                <TextField
                  placeholder="我要评论......"
                  style={{ width: '90%' }}
                  onChange={(e: any) => {
                    setComment(e.target.value);
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
            ) : null}
          </div>
        ) : null}
      </div>

      <DropMenu
        visible={headerIndex === 3}
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
                  <div
                    className="diary-avatar"
                    onClick={() => {
                      choosePerson(item.key, index);
                    }}
                    key={'person' + index}
                    style={
                      item.key === diaryKey
                        ? {
                            backgroundColor: '#f0f0f0',
                          }
                        : {}
                    }
                  >
                    <img src={item.avatar} alt="" />
                  </div>
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
