import React, { useState, useEffect, useRef } from 'react';
import './groupTableTree.css';
import { useTypedSelector } from '../../redux/reducer/RootState';
import { createStyles, makeStyles, Theme } from '@material-ui/core/styles';
import { editTask } from '../../redux/actions/taskActions';
import { setMessage } from '../../redux/actions/commonActions';
import { useDispatch } from 'react-redux';
import { Button, TextField } from '@material-ui/core';
import Editor from '../../components/common/Editor';
import Loading from '../../components/common/loading';
import Table from '../../components/tree/table';
import Link from '../../components/tree/link';
// import Draw from '../../components/common/draw';
import Comment from '../../components/comment/comment';
import Markdown from '../../components/tree/markDown/Markdown';
import DrawView from '../../components/tree/DrawView';
import DrawEditor from '../../components/tree/Topology';
import Book from '../../components/tree/book';
import fullscreenSvg from '../../assets/svg/fullscreen.svg';
import DropMenu from '../../components/common/dropMenu';

import moment from 'moment';
import _ from 'lodash';
import api from '../../services/api';
interface GroupTableTreeInfoProps {
  targetItem: any;
  fullType: string;
  editable: boolean;
  editInfoType: string;
  changeContent: Function;
  changeTargetContent: Function;
  changeEditable:Function
}
const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      width: '142px',
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
    disbutton: {
      backgroundColor: 'rgba(255,255,255,0.4)',
    },
    datePicker: {
      '& .MuiInput-formControl': {
        marginLeft: '5px',
      },
    },
  })
);
const GroupTableTreeInfo: React.FC<GroupTableTreeInfoProps> = (props) => {
  const {
    targetItem,
    fullType,
    editInfoType,
    editable,
    changeContent,
    changeTargetContent,
    changeEditable
  } = props;
  const dispatch = useDispatch();
  const classes = useStyles();
  const [content, setContent] = useState<any>('');
  const [targetNode, setTargetNode] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [commentIndex, setCommentIndex] = useState(0);
  const [taskCommentTotal, setTaskCommentTotal] = useState<any>(null);
  const [taskHistoryArray, setTaskHistoryArray] = useState<any>([]);
  const [taskHistoryTotal, setTaskHistoryTotal] = useState<any>(null);
  const [taskHistoryPage, setTaskHistoryPage] = useState(1);
  const [taskCommentArray, setTaskCommentArray] = useState<any>([]);
  const [taskCommentPage, setTaskCommentPage] = useState(1);
  const [commentInput, setCommentInput] = useState('');
  const [isEdit, setIsEdit] = useState(false);
  const containerRef: React.RefObject<any> = useRef();
  const taskLimit = 10;
  let unDistory = true;
  useEffect(() => {
    if (!targetNode || targetItem._key !== targetNode._key) {
      getTaskItem(targetItem._key);
    }
    return () => {
      unDistory = false;
    };
  }, [targetItem]);
  const getTaskItem = async (key: string) => {
    setLoading(true);
    let taskItemRes: any = await api.task.getTaskInfo(key);
    if (unDistory) {
      if (taskItemRes.msg === 'OK') {
        let taskInfo = _.cloneDeep(taskItemRes.result);
        setLoading(false);
        if (taskInfo.content || taskInfo.type !== 10) {
          setContent(taskInfo.content);
        } else {
          setContent('<p>备注信息:</p>');
        }
        if (taskInfo.type === 11) {
          taskInfo.content = taskInfo.content.replace('<p>', '');
          taskInfo.content = taskInfo.content.replace('</p>', '');
          taskInfo.content = taskInfo.content.replace(
            '<p data-f-id="pbf" style="text-align: center; font-size: 14px; margin-top: 30px; opacity: 0.65; font-family: sans-serif;">Powered by <a href="https://www.froala.com/wysiwyg-editor?pb=1" title="Froala Editor">Froala Editor</a></p>',
            ''
          );
        }
        setTargetNode(taskInfo);
        getHistoryList(taskHistoryPage, taskInfo);
        getCommentList(taskHistoryPage, taskInfo);
      } else {
        setLoading(false);
        dispatch(setMessage(true, taskItemRes.msg, 'error'));
      }
    }
  };
  const changeTaskContent = (value: any) => {
    let newTargetNode = _.cloneDeep(targetNode);
    let content = '';
    if (value) {
      content = value;
    } else if (newTargetNode.type === 10) {
      content = '<p>备注信息:</p>';
    }
    newTargetNode.content = content;
    setTargetNode(newTargetNode);
    setContent(content);
    changeTargetContent(content);
    if (newTargetNode.type === 11) {
      changeContent(content);
    }
  };
  const getCommentList = async (page: number, taskInfo: any) => {
    let newCommentArray = _.cloneDeep(taskCommentArray);
    if (page == 1) {
      newCommentArray = [];
    }
    let commentRes: any = await api.task.getTaskComment(
      taskInfo._key,
      page,
      taskLimit
    );
    if (unDistory) {
      if (commentRes.msg === 'OK') {
        newCommentArray.push(...commentRes.result);
        setTaskCommentArray(newCommentArray);
        setTaskCommentTotal(commentRes.totalNumber);
      } else {
        dispatch(setMessage(true, commentRes.msg, 'error'));
      }
    }
  };
  const saveCommentMsg = async () => {
    let newCommentArray = _.cloneDeep(taskCommentArray);
    let newCommentTotal = taskCommentTotal;
    if (commentInput !== '') {
      //保存
      let saveRes: any = await api.task.addComment(
        targetNode._key,
        commentInput
      );
      if (saveRes.msg === 'OK') {
        dispatch(setMessage(true, '评论成功', 'success'));
        newCommentArray.push(saveRes.result);
        newCommentTotal = newCommentTotal + 1;
        setTaskCommentArray(newCommentArray);
        setTaskCommentTotal(newCommentTotal);
        setCommentInput('');
      } else {
        dispatch(setMessage(true, saveRes.msg, 'error'));
      }
    }
  };
  const deleteCommentMsg = async (commentIndex: number, commentkey: string) => {
    let newCommentArray = _.cloneDeep(taskCommentArray);
    let newCommentTotal = taskCommentTotal;
    let deleteRes: any = await api.task.deleteComment(commentkey);
    if (deleteRes.msg === 'OK') {
      dispatch(setMessage(true, '删除评论成功', 'success'));
      newCommentArray.splice(commentIndex, 1);
      newCommentTotal = newCommentTotal - 1;
      setTaskCommentArray(newCommentArray);
      setTaskCommentTotal(newCommentTotal);
    } else {
      dispatch(setMessage(true, deleteRes.msg, 'error'));
    }
  };
  const getHistoryList = async (page: number, taskInfo: any) => {
    let newHistoryArray = _.cloneDeep(taskHistoryArray);
    if (page == 1) {
      newHistoryArray = [];
    }
    let historyRes: any = await api.task.getTaskHistory(
      taskInfo._key,
      page,
      taskLimit
    );
    if (unDistory) {
      if (historyRes.msg === 'OK') {
        newHistoryArray.push(...historyRes.result);
        setTaskHistoryArray(newHistoryArray);
        setTaskHistoryTotal(historyRes.totalNumber);
      } else {
        dispatch(setMessage(true, historyRes.msg, 'error'));
      }
    }
  };
  const scrollCommentLoading = async (e: any) => {
    let page = taskCommentPage;
    //文档内容实际高度（包括超出视窗的溢出部分）
    let scrollHeight = e.target.scrollHeight;
    //滚动条滚动距离
    let scrollTop = e.target.scrollTop;
    //窗口可视范围高度
    let clientHeight = e.target.clientHeight;
    if (
      clientHeight + scrollTop >= scrollHeight &&
      taskCommentArray.length < taskCommentTotal
    ) {
      page = page + 1;
      setTaskCommentPage(page);
      getCommentList(page, targetNode);
    }
  };
  const scrollHistoryLoading = async (e: any) => {
    let page = taskHistoryPage;
    //文档内容实际高度（包括超出视窗的溢出部分）
    let scrollHeight = e.target.scrollHeight;
    //滚动条滚动距离
    let scrollTop = e.target.scrollTop;
    //窗口可视范围高度
    let height = e.target.clientHeight;
    if (
      height + scrollTop >= scrollHeight &&
      taskHistoryArray.length < taskHistoryTotal
    ) {
      page = page + 1;
      setTaskHistoryPage(page);
      getHistoryList(page, targetNode);
    }
  };
  const changeInput = (e: any) => {
    setCommentInput(e.target.value);
    // setEditState(true);
  };
  return (
    <React.Fragment>
      {targetNode ? (
        <React.Fragment>
          <div className="groupTableTreeInfo-container" ref={containerRef}>
            {loading ? (
              <Loading loadingHeight="90px" loadingWidth="90px" />
            ) : null}
            {targetNode.type === 10 ? (
              <React.Fragment>
                <Editor
                  editorHeight={
                    containerRef.current?.offsetHeight
                      ? containerRef.current.offsetHeight
                      : '800px'
                  }
                  data={content}
                  onChange={changeTaskContent}
                  editable={editable}
                  fullType={fullType}
                />
              </React.Fragment>
            ) : null}
            {targetNode.type === 11 ? (
              editable ? (
                <DrawEditor
                  //@ts-ignore
                  targetNode={targetNode}
                  onChange={changeTaskContent}
                  changeEditable={changeEditable}
                  />
              ) : (
                <DrawView
                  //@ts-ignore
                  targetNode={targetNode}
                  // onChange={changeContent}
                />
              )
            ) : null}
            {targetNode.type === 12 ? <Table node={targetNode} /> : null}
            {targetNode.type === 13 ? (
              <Markdown
                targetData={targetNode}
                onChange={changeTaskContent}
                editable={editable}
              />
            ) : null}
            {targetNode.type === 14 ? (
              <Link targetData={targetNode} onChange={changeContent} />
            ) : null}
            {targetNode.type === 15 ? (
              <Book
                targetData={targetNode}
                onChange={changeContent}
                fullType={fullType}
              />
            ) : null}
            <div className="taskInfo-comment">
              <div className="taskInfo-comment-tabs">
                <div
                  className="taskInfo-comment-tabs-item"
                  onClick={() => {
                    setCommentIndex(0);
                  }}
                  style={
                    commentIndex === 0
                      ? {
                          borderBottom: '1px solid #17B881',
                          color: '#17B881',
                        }
                      : {}
                  }
                >
                  评论({taskCommentTotal})
                </div>
                <div
                  className="taskInfo-comment-tabs-item"
                  onClick={() => {
                    setCommentIndex(1);
                  }}
                  style={
                    commentIndex === 1
                      ? {
                          borderBottom: '1px solid #17B881',
                          color: '#17B881',
                        }
                      : {}
                  }
                >
                  历史({taskHistoryTotal})
                </div>
              </div>
              {commentIndex === 0 ? (
                <React.Fragment>
                  <div
                    className="taskInfo-comment-tab"
                    onScroll={scrollCommentLoading}
                  >
                    {taskCommentArray.map(
                      (commentItem: any, commentIndex: number) => {
                        return (
                          <Comment
                            commentItem={commentItem}
                            commentIndex={commentIndex}
                            key={'comment' + commentIndex}
                            commentClick={deleteCommentMsg}
                          />
                        );
                      }
                    )}
                  </div>
                </React.Fragment>
              ) : (
                <div
                  className="taskInfo-comment-tab"
                  onScroll={scrollHistoryLoading}
                >
                  {taskHistoryArray.map(
                    (historyItem: any, historyIndex: number) => {
                      return (
                        <div
                          key={'history' + historyIndex}
                          className="taskInfo-comment-historyLog"
                        >
                          <div className="taskInfo-comment-avatar">
                            <img
                              src={historyItem.etc && historyItem.etc.avatar}
                              alt=""
                            />
                          </div>
                          <div className="taskInfo-comment-info">
                            <div>
                              {moment(
                                parseInt(historyItem.createTime)
                              ).fromNow()}
                            </div>
                            <div style={{ fontSize: '12px', color: '#8091a0' }}>
                              {historyItem.log}
                            </div>
                          </div>
                          {/* {historyItem.log} */}
                        </div>
                      );
                    }
                  )}
                </div>
              )}
            </div>
          </div>
        </React.Fragment>
      ) : null}
      <div className="taskInfo-comment-input">
        <TextField
          required
          id="outlined-basic"
          variant="outlined"
          label="评论"
          className={classes.input}
          onChange={changeInput}
          value={commentInput}
          onKeyDown={(e: any) => {
            if (e.keyCode === 13) {
              saveCommentMsg();
            }
          }}
          onFocus={() => {
            setIsEdit(true);
          }}
          onBlur={() => {
            setIsEdit(false);
          }}
        />
        {commentInput ? (
          <Button
            variant="contained"
            color="primary"
            className={classes.button}
            onClick={() => {
              saveCommentMsg();
            }}
          >
            发布
          </Button>
        ) : (
          <Button variant="contained" className={classes.disbutton} disabled>
            发布
          </Button>
        )}
      </div>
    </React.Fragment>
  );
};
GroupTableTreeInfo.defaultProps = {};
export default GroupTableTreeInfo;
