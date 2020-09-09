import React, { useState, useEffect } from 'react';
import './workingReport.css';
import { useTypedSelector } from '../../redux/reducer/RootState';
import { createStyles, makeStyles, Theme } from '@material-ui/core/styles';
import { TextField, Button } from '@material-ui/core';
import { useDispatch } from 'react-redux';
import { setMessage } from '../../redux/actions/commonActions';
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
  const headerIndex = useTypedSelector((state) => state.common.headerIndex);
  const [dateArray, setDateArray] = useState<any>([]);
  const [diaryList, setDiaryList] = useState<any>([]);
  const [diaryIndex, setDiaryIndex] = useState(0);
  const [diaryKey, setDiaryKey] = useState(0);
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
  const [personObj, setPersonObj] = useState<any>(null);
  const [personArray, setPersonArray] = useState<any>([]);
  const [personIndex, setPersonIndex] = useState(0);
  const commentLimit = 10;

  useEffect(() => {}, [user]);
  // async getData(page, limit) {
  //   this.diaryList = [];
  //   let startTime = this.$moment(new Date())
  //     .subtract(1, "days")
  //     .startOf("day")
  //     .valueOf();
  //   let endTime = this.$moment(new Date())
  //     .subtract(1, "days")
  //     .endOf("day")
  //     .valueOf();
  //   if (this.groupType != 3) {
  //     let obj = {};
  //     if (this.groupType == 1) {
  //       obj = {
  //         curPage: page,
  //         perPage: limit,
  //       };
  //     } else if (this.groupType == 2) {
  //       obj = {
  //         targetUKey: this.targetUInfo._key,
  //         startTime: startTime,
  //         endTime: endTime,
  //       };
  //     }
  //     let res = await api.auth.getDiaryList(obj);
  //     if (res.msg == "OK") {
  //       res.result.forEach((item) => {
  //         if (item.content) {
  //           this.diaryList.push(item);
  //         }
  //       });
  //       if (this.groupType == 2) {
  //         this.contentState = true;
  //         this.setContent(this.diaryList[0]);
  //       }
  //       this.total = res.totalNumber;
  //     } else {
  //       this.$message.error(res.msg);
  //     }
  //   }
  // },
  // async setContent(item) {
  //   item.content = item.content
  //     .replace("[已延期]", "一、已延期")
  //     .replace("[今日计划]", "二、计划(昨日)")
  //     .replace("[今日成果]", "三、跟踪(成果)")
  //     .replace("[指派]", "四、指派")
  //     .replace("[明日计划]", "五、明日计划")
  //     .replace("[PN]", "六、PN")
  //     .replace("[随记]", "七、随记");
  //   this.contentItem = item;
  //   this.contentState = true;
  //   console.log(this.contentItem.note);
  //   this.getCommentList(this.commentPage, this.commentLimit);
  // },
  const chooseDiary = async (index: number) => {
    // this.diaryIndex = index;
    // this.positive = "";
    // this.negative = "";
    // this.note = "";
    // this.commentPage = 1;
    // if (this.groupType != 3) {
    //   await this.getDiaryList(
    //     this.dateArray[index].start,
    //     this.dateArray[index].end
    //   );
    // }
    // this.getDiaryNote(this.dateArray[index].start);
  };
  // choosePerson(key, index) {
  //   this.diaryList = [];
  //   this.dayCanlendarArray = [];
  //   this.personArray = [];
  //   this.diaryKey = key;
  //   this.personIndex = index;
  // },
  // async getData(taskArray) {
  //   this.dateArray = [];
  //   this.dayCanlendarArray = [];
  //   let arr = [];

  //   for (let i = 30; i > 0; i--) {
  //     arr.push({
  //       start: this.$moment().subtract(i, "days").startOf("day").valueOf(),
  //       end: this.$moment().subtract(i, "days").endOf("day").valueOf(),
  //     });
  //   }
  //   taskArray = this._.flatten(taskArray).filter((item, index) => {
  //     return (
  //       item.taskEndDate >= arr[0].start &&
  //       item.taskEndDate < arr[arr.length - 1].end
  //     );
  //   });
  //   taskArray.forEach((taskItem, taskIndex) => {
  //     if (taskItem.executorKey) {
  //       this.personObj[taskItem.executorKey] = {
  //         key: taskItem.executorKey,
  //         avatar: taskItem.executorAvatar,
  //         name: taskItem.executorName,
  //       };
  //     }
  //   });
  //   this.personArray = Object.values(this.personObj);
  //   let personIndex = this._.findIndex(this.personArray, {
  //     key: this.diaryKey,
  //   });
  //   console.log(this.diaryKey);
  //   console.log(this.personArray);
  //   if (personIndex == -1) {
  //     this.personIndex = 0;
  //     this.diaryKey = this.personArray[0].key;
  //   } else {
  //     this.personIndex = personIndex;
  //   }
  //   arr.forEach((item, index) => {
  //     this.dateArray[index] = {
  //       arr: [],
  //       date: this.formatTime(item.start),
  //       start: item.start,
  //       end: item.end,
  //     };
  //     taskArray.forEach((taskItem, taskIndex) => {
  //       if (
  //         taskItem.taskEndDate >= item.start &&
  //         taskItem.taskEndDate < item.end &&
  //         this.diaryKey == taskItem.executorKey
  //       ) {
  //         this.dateArray[index].arr.push(taskItem);
  //       }
  //     });
  //   });
  //   // this.dateArray.forEach((item, index) => {});
  //   this.dateArray = this.dateArray.reverse();
  //   this.dateArray = this.dateArray.filter((item, index) => {
  //     return item.arr.length > 0;
  //   });
  //   this.dateArray.forEach((item, index) => {
  //     this.dayCanlendarArray[index] = {};
  //     item.arr.forEach((taskItem, taskIndex) => {
  //       if (taskItem.executorKey) {
  //         if (!this.dayCanlendarArray[index][taskItem.executorKey]) {
  //           this.dayCanlendarArray[index][taskItem.executorKey] = [];
  //         }
  //         this.dayCanlendarArray[index][taskItem.executorKey].push(taskItem);
  //       }
  //     });
  //   });
  //   console.log("?????????",this.groupType);
  //   if (this.groupType != 3) {
  //     await this.getDiaryList(
  //       this.$moment().subtract(1, "days").startOf("day").valueOf(),
  //       this.$moment().subtract(1, "days").endOf("day").valueOf()
  //     );
  //   }
  //   this.getDiaryNote(this.$moment().subtract(1, "days").startOf("day").valueOf());
  // },
  // async getDiaryNote(startTime) {
  //   let noteRes = await api.task.getNote({
  //     targetUKey: this.diaryKey,
  //     startTime: startTime,
  //     type: 2,
  //   });
  //   if (noteRes.msg == "OK") {
  //     this.positive = noteRes.result.positive;
  //     this.negative = noteRes.result.negative;
  //     this.note = noteRes.result.note;
  //   } else {
  //     if (noteRes.msg == "无该成就/风险/随记") {
  //       await api.task.setNote({
  //         startTime: this.$moment().startOf("day").valueOf(),
  //         type: 2,
  //         positive: "",
  //         negative: "",
  //         note: "",
  //         positiveClose: "",
  //         negativeClose: "",
  //         noteClose: "",
  //       });
  //     } else {
  //       this.$message.error(noteRes.msg);
  //     }
  //   }
  // },
  // async getDiaryList(startTime, endTime) {
  //   let res = await api.auth.getDiaryList({
  //     targetUKey:
  //       this.groupType == 1 ? this.user._key : this.targetUInfo._key,
  //     startTime: startTime,
  //     endTime: endTime,
  //   });
  //   if (res.msg == "OK") {
  //     if (res.result.length > 0) {
  //       this.contentKey = res.result[0]._key;
  //     }
  //   } else {
  //     this.$message.error(res.msg);
  //   }
  // },
  // async getCommentList(page, limit) {
  //   let res = await api.message.getClockInCommentList({
  //     clockInKey: this.contentKey,
  //     curPage: page,
  //     perPage: limit,
  //   });
  //   if (res.msg == "OK") {
  //     this.commentList.push(...res.result);
  //     console.log(this.commentList);
  //     this.commentTotal = res.totalNumber;
  //   } else {
  //     this.$message.error(res.msg);
  //   }
  // },
  const scrollCommentLoading = (e: any) => {
    //文档内容实际高度（包括超出视窗的溢出部分）
    let scrollHeight = e.target.scrollHeight;
    //滚动条滚动距离
    let scrollTop = e.target.scrollTop;
    //窗口可视范围高度
    let clientHeight = e.target.clientHeight;
    // if (
    //   clientHeight + scrollTop >= scrollHeight &&
    //   this.commentList.length < this.commentTotal
    // ) {
    //   this.commentPage = this.commentPage + 1;
    //   this.getCommentList(this.commentPage, this.commentLimit);
    // }
  };
  // onChange(current) {
  //   this.page = current;
  //   this.getData(this.page, this.limit);
  // },
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
    // let res = await api.message.addClockInComment({
    //   clockInKey: this.contentKey,
    //   content: this.comment,
    // });
    // if (res.msg == "OK") {
    //   this.$message.success("评论成功");
    //   this.comment = "";
    //   this.commentList.unshift(res.result);
    // } else {
    //   this.$message.error(res.msg);
    // }
  };
  const deleteComment = (item: any, index: number) => {
    // let that = this;
    // Modal.confirm({
    //   title: "提示消息",
    //   content: "是否确认要删除该评论",
    //   okText: "确认",
    //   cancelText: "取消",
    //   async onOk() {
    //     let res = await api.message.deleteClockInComment({
    //       clockInCommentKey: item._key,
    //     });
    //     if (res.msg == "OK") {
    //       that.$message.success("删除成功");
    //       that.commentList.splice(index, 1);
    //     } else {
    //       that.$message.error(res.msg);
    //     }
    //   },
    // });
  };
  // formatTime(time) {
  //   let week = this.$moment(time).day();
  //   let timeStr = "";
  //   switch (week) {
  //     case 1:
  //       timeStr = "周一 ";
  //       break;
  //     case 2:
  //       timeStr = "周二 ";
  //       break;
  //     case 3:
  //       timeStr = "周三 ";
  //       break;
  //     case 4:
  //       timeStr = "周四 ";
  //       break;
  //     case 5:
  //       timeStr = "周五 ";
  //       break;
  //     case 6:
  //       timeStr = "周六 ";
  //       break;
  //     case 0:
  //       timeStr = "周日 ";
  //       break;
  //   }
  //   return [timeStr, moment(time).format("M.DD")];
  // },
  return (
    <div className="workingTableReport">
      <div className="diary">
        <div className="diary-bg">
          <div className="diary-menu">
            <div className="diary-menu-title">目录</div>
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
                  <div>{{ positive }}</div>
                  <div>{{ negative }}</div>
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
                    <div className="diary-comment-like">
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
                    </div>
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
                    v-model="comment"
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
        {/* <DropMenu>
      <div class="diary-avatar">
        <img src={personArray[personIndex]|defaultPerson} alt />
      </div>
      <div slot="overlay">
        <dov v-for="(item,index) in personArray" key={'person'+index}>
          <div class="diary-avatar" onClick={choosePerson(item.key,index)}>
            <img src={item|defaultPerson} alt />
          </div>
        </div>
      </div>
    </DropMenu> */}
      </div>
    </div>
  );
};
export default WorkingReport;
