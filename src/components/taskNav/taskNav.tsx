import React, { useState, useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { getWorkingTableTask } from '../../redux/actions/taskActions';
import { Button, Tooltip, Chip, IconButton } from '@material-ui/core';
import { createStyles, Theme, makeStyles } from '@material-ui/core/styles';
import moment from 'moment';
import { useTypedSelector } from '../../redux/reducer/RootState';
import api from '../../services/api';
import DropMenu from '../common/dropMenu';
import Dialog from '../common/dialog';
import Loading from '../common/loading';
import './taskNav.css';
import plusPng from '../../assets/img/plus.png';
import unDragPng from '../../assets/img/undrag.png';
import ellipsisPng from '../../assets/img/ellipsis.png';
import defaultPersonPng from '../../assets/img/defaultPerson.png';
import checkPersonPng from '../../assets/img/checkPerson.png';
import urlSvg from '../../assets/svg/url.svg';
import { getGroupTask, setChooseKey } from '../../redux/actions/taskActions';
import { setMessage } from '../../redux/actions/commonActions';
import { changeCreateMusic } from '../../redux/actions/authActions';

interface TaskNavProps {
  avatar?: any;
  executorKey?: any;
  name: string;
  role: string | number;
  colorIndex: number;
  taskNavArray: any;
  taskNavWidth: number | string;
  setChooseLabelKey?: any;
  chooseLabelKey?: string;
  batchTaskArray?: any;
  changeLabelAvatar?: any;
  arrlength?: number;
  taskNavTask?: any;
}
const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    input: {
      width: '250px',
      color: '#fff',
      '& .MuiInput-formControl': {
        marginTop: '0px',
      },
      '& .MuiOutlinedInput-input': {
        padding: '10px 14px',
        borderColor: '#fff',
        color: '#fff',
      },
      '& .MuiInputLabel-formControl': {
        marginTop: '-10px',
        color: '#fff',
      },
    },
    chip: {
      backgroundColor: 'rgba(255,255,255,0.24)',
      color: '#fff',
      marginLeft: '3px',
    },
  })
);
const TaskNav: React.FC<TaskNavProps> = (prop) => {
  const {
    avatar,
    executorKey,
    name,
    role,
    colorIndex,
    taskNavArray,
    taskNavWidth,
    setChooseLabelKey,
    chooseLabelKey,
    batchTaskArray,
    changeLabelAvatar,
    taskNavTask,
    arrlength,
  } = prop;
  const classes = useStyles();
  const groupKey = useTypedSelector((state) => state.group.groupKey);
  const headerIndex = useTypedSelector((state) => state.common.headerIndex);
  const mainGroupKey = useTypedSelector((state) => state.auth.mainGroupKey);
  const user = useTypedSelector((state) => state.auth.user);
  const targetUserInfo = useTypedSelector((state) => state.auth.targetUserInfo);
  const filterObject = useTypedSelector((state) => state.task.filterObject);
  const groupMemberArray = useTypedSelector(
    (state) => state.member.groupMemberArray
  );
  const dispatch = useDispatch();
  const [labelName, setLabelName] = useState('');
  const [labelNameVisible, setLabelNameVisible] = useState(false);
  const [labelAvatar, setLabelAvatar] = useState('');
  const [batchVisible, setBatchVisible] = useState(false);
  const [avatarVisible, setAvatarVisible] = useState(false);
  const [batchAddVisible, setBatchAddVisible] = useState(false);
  const [batchAddText, setBatchAddText] = useState('');
  const [deleteVisible, setDeleteVisible] = useState(false);
  const [loading, setLoading] = useState(false);
  const [addTaskVisible, setAddTaskVisible] = useState(false);
  const [taskTypeVisible, setTaskTypeVisible] = useState(false);

  const [addInput, setAddInput] = useState('');
  const [unFinsihNum, setUnFinsihNum] = useState(0);
  const [taskTypeIndex, setTaskTypeIndex] = useState(0);
  const [allNum, setAllNum] = useState(0);
  const [moveState, setMoveState] = useState(false);
  const [urlInput, setUrlInput] = useState('');
  const color = [
    '#6FD29A',
    '#21ABE4',
    '#F5A623',
    '#FB8444',
    '#FF5D5B',
    '#9F33FE',
  ];
  const backgroundColor = [
    '#DAF6E6',
    '#D8ECFF',
    '#FBE6C4',
    '#FFDDCC',
    '#FFE3DE',
    '#F3E5FF',
  ];
  const taskTypeArr = [
    { name: '建议', id: 1 },
    { name: '强烈建议', id: 2 },
    { name: '错误', id: 3 },
    { name: '严重错误', id: 4 },
    { name: '致命错误', id: 5 },
    { name: '顶级优先', id: 10 },
  ];

  useEffect(() => {
    if (avatar) {
      setLabelAvatar(avatar);
    }
  }, [avatar]);
  useEffect(() => {
    if (name) {
      setLabelName(name);
    }
  }, [name]);
  useEffect(() => {
    if (taskNavTask) {
      let unfinishNum = 0;
      let allNum = 0;
      taskNavTask.forEach((item: any, index: number) => {
        if (item.show) {
          if (item.finishPercent === 0) {
            unfinishNum++;
          }
          allNum++;
        }
      });
      setUnFinsihNum(unfinishNum);
      setAllNum(allNum);
    }
  }, [taskNavTask]);

  const BgColorArray = [
    'rgba(48,191,191,0.3)',
    'rgba(0,170,255,0.3)',
    'rgba(143,126,230,0.3)',
    'rgba(179,152,152,0.3)',
    'rgba(242,237,166,0.3)',
  ];
  const taskNavBgColor = colorIndex % 5;
  const addTask = async (groupInfo: any, labelInfo: any) => {
    let obj: any = {};
    if (addInput == '') {
      setAddTaskVisible(false);
      return;
    }
    if (mainGroupKey == groupInfo._key) {
      labelInfo.executorKey = user._key;
    }
    if (urlInput) {
      obj = {
        url:
          urlInput.indexOf('http://') !== -1 ||
          urlInput.indexOf('https://') !== -1
            ? urlInput
            : 'http://' + urlInput,
      };
    }
    setLoading(true);
    let addTaskRes: any = await api.task.addTask({
      groupKey: groupInfo._key,
      groupRole: groupInfo.groupRole,
      taskType: taskTypeArr[taskTypeIndex].id,
      labelKey: labelInfo._key,
      executorKey: labelInfo.executorKey,
      title: addInput,
      extraData: obj,
    });
    if (addTaskRes.msg === 'OK') {
      if (
        filterObject.creatorKey ||
        filterObject.executorKey ||
        filterObject.groupKey ||
        filterObject.filterType.indexOf('今天') === -1
      ) {
        dispatch(setMessage(true, '新建成功,请清除过滤项后查看', 'warning'));
      } else {
        dispatch(setMessage(true, '新增任务成功', 'success'));
      }
      dispatch(changeCreateMusic(true));
      dispatch(setChooseKey(addTaskRes.result._key));
      if (headerIndex === 1) {
        dispatch(getWorkingTableTask(1, user._key, 1, [0, 1, 2, 10]));
      } else if (headerIndex === 2) {
        dispatch(
          getWorkingTableTask(
            user._key === targetUserInfo._key ? 4 : 2,
            targetUserInfo._key,
            1,
            [0, 1, 2, 10]
          )
        );
      } else if (headerIndex === 3) {
        dispatch(getGroupTask(3, groupKey, '[0,1,2,10]'));
      }
      setAddTaskVisible(false);
      setAddInput('');
      setLoading(false);
    } else {
      setLoading(false);
      dispatch(setMessage(true, addTaskRes.msg, 'error'));
    }
  };
  const changeLabelName = (labelInfo: any, groupInfo: any) => {
    console.log(labelInfo, groupInfo);
    if (labelName !== name) {
      if (labelInfo._key) {
        api.group.setCardLabel(labelInfo._key, labelName, labelInfo.taskType);
      } else {
        api.group.setCardLabel(
          labelInfo._key,
          labelName,
          groupInfo.taskType,
          groupInfo._key
        );
      }
    }
    setLabelNameVisible(false);
  };
  const changeDefaultExecutor = (executorItem: any, labelKey: string) => {
    let key = labelKey ? labelKey : taskNavArray[0]._key;
    let type = labelKey ? 1 : 2;
    let targetKey = '';
    if (executorItem.userId === executorKey) {
      targetKey = '';
      setLabelAvatar(defaultPersonPng);
      changeLabelAvatar(
        {
          executorKey: '',
          executorAvatar: '',
          executorNickName: '',
        },
        colorIndex
      );
    } else {
      targetKey = executorItem ? executorItem.userId : null;
      setLabelAvatar(executorItem.avatar);
      changeLabelAvatar(executorItem, colorIndex);
    }
    api.group.setLabelOrGroupExecutorKey(key, targetKey, type);
  };
  const changeDefaultTaskType = (taskType: number) => {
    let key = taskNavArray[1]._key
      ? taskNavArray[1]._key
      : taskNavArray[0]._key;
    let newlabelName = labelName;
    if (headerIndex !== 3) {
      newlabelName = labelName.split(' / ')[1];
    }
    console.log(newlabelName);
    if (taskNavArray[1]._key) {
      api.group.setCardLabel(key, newlabelName, taskType);
    } else {
      api.group.setCardLabel(key, newlabelName, taskType, taskNavArray[0]._key);
    }
  };
  const batchAddTask = async () => {
    let batchTaskRes: any = await api.task.batchCard(
      batchAddText,
      taskNavArray[0]._key,
      taskNavArray[1]._key
    );
    if (batchTaskRes.msg === 'OK') {
      dispatch(setMessage(true, '新增成功', 'success'));
      dispatch(changeCreateMusic(true));
      if (headerIndex === 1) {
        dispatch(getWorkingTableTask(1, user._key, 1, [0, 1, 2, 10]));
      } else if (headerIndex === 2) {
        dispatch(
          getWorkingTableTask(
            user._key === targetUserInfo._key ? 4 : 2,
            targetUserInfo._key,
            1,
            [0, 1, 2, 10]
          )
        );
      } else if (headerIndex === 3) {
        dispatch(getGroupTask(3, groupKey, '[0,1,2,10]'));
      }
      setBatchAddVisible(false);
    } else {
      dispatch(setMessage(true, batchTaskRes.msg, 'error'));
    }
  };
  const deleteLabel = async () => {
    let deleteLabelRes: any = await api.task.deleteTaskLabel(
      taskNavArray[0]._key,
      taskNavArray[1]._key
    );
    if (deleteLabelRes.msg === 'OK') {
      dispatch(setMessage(true, '删除成功', 'success'));
      if (headerIndex === 1) {
        dispatch(getWorkingTableTask(1, user._key, 1, [0, 1, 2, 10]));
      } else if (headerIndex === 2) {
        dispatch(
          getWorkingTableTask(
            user._key === targetUserInfo._key ? 4 : 2,
            targetUserInfo._key,
            1,
            [0, 1, 2, 10]
          )
        );
      } else if (headerIndex === 3) {
        dispatch(getGroupTask(3, groupKey, '[0,1,2,10]'));
      }
      setBatchAddVisible(false);
    } else {
      dispatch(setMessage(true, deleteLabelRes.msg, 'error'));
    }
  };
  return (
    <React.Fragment>
      {taskNavArray && taskNavArray[0] && taskNavArray[1] ? (
        <div
          className="taskNav-container"
          style={{
            height:
              (taskNavArray[1]._key + '' == chooseLabelKey ||
                taskNavArray[0]._key + '' == chooseLabelKey) &&
              addTaskVisible
                ? '172px'
                : '60px',
          }}
        >
          <div
            className="taskNav"
            style={{
              backgroundColor: BgColorArray[taskNavBgColor],
              width: taskNavWidth,
              marginRight: headerIndex === 3 ? '15px' : '0px',
            }}
          >
            {loading ? (
              <Loading loadingWidth="60px" loadingHeight="60px" />
            ) : null}
            <div
              className="taskNav-name-info"
              style={{
                maxWidth: 'calc(100% - 55px)',
              }}
            >
              {avatar ? (
                <div
                  className="taskNav-avatar"
                  onClick={() => {
                    if (role > 0 && role < 4 && headerIndex === 3) {
                      setChooseLabelKey(
                        taskNavArray[1]._key
                          ? taskNavArray[1]._key
                          : taskNavArray[0]._key
                      );
                      setAvatarVisible(true);
                    }
                  }}
                >
                  <img src={labelAvatar} alt="" />
                  <DropMenu
                    visible={
                      (taskNavArray[1]._key === chooseLabelKey ||
                        taskNavArray[0]._key === chooseLabelKey) &&
                      avatarVisible
                    }
                    dropStyle={{
                      width: '80%',
                      height: '350px',
                      top: '45px',
                      color: '#333',
                    }}
                    onClose={() => {
                      setChooseLabelKey('');
                      setAvatarVisible(false);
                    }}
                    title={'设置默认执行人'}
                  >
                    <div className="defaultExecutor-info">
                      {groupMemberArray
                        ? groupMemberArray.map(
                            (
                              groupMemberItem: any,
                              groupMemberIndex: number
                            ) => {
                              return (
                                <div
                                  key={'groupMember' + groupMemberIndex}
                                  className="defaultExecutor-info-item"
                                  style={{ justifyContent: 'space-between' }}
                                  onClick={() => {
                                    changeDefaultExecutor(
                                      groupMemberItem,
                                      taskNavArray[1]._key
                                    );
                                  }}
                                >
                                  <div className="defaultExecutor-info-left">
                                    <div className="defaultExecutor-info-avatar">
                                      <img
                                        src={
                                          groupMemberItem.avatar
                                            ? groupMemberItem.avatar +
                                              '?imageMogr2/auto-orient/thumbnail/80x'
                                            : defaultPersonPng
                                        }
                                        alt=""
                                      />
                                    </div>
                                    {groupMemberItem.nickName}
                                  </div>
                                  {executorKey === groupMemberItem.userId ? (
                                    <img
                                      src={checkPersonPng}
                                      alt=""
                                      style={{
                                        width: '20px',
                                        height: '12px',
                                      }}
                                    />
                                  ) : null}
                                </div>
                              );
                            }
                          )
                        : null}
                    </div>
                  </DropMenu>
                </div>
              ) : null}
              {!labelNameVisible ? (
                <Tooltip
                  title={
                    labelName.split('_')[1] !== '副本' &&
                    labelName.split('_')[1]
                      ? labelName.split('_')[0] + '/' + labelName.split('/')[1]
                      : labelName
                  }
                >
                  <div
                    className="taskNav-name"
                    onClick={() => {
                      if (role > 0 && role < 4 && headerIndex === 3) {
                        setLabelNameVisible(true);
                      }
                    }}
                  >
                    {labelName.split('_')[1] !== '副本' &&
                    labelName.split('_')[1]
                      ? labelName.split('_')[0] + '/' + labelName.split('/')[1]
                      : labelName}
                  </div>
                </Tooltip>
              ) : (
                <input
                  // variant="outlined"
                  placeholder="请输入标题名"
                  onChange={(e: any) => {
                    setLabelName(e.target.value);
                  }}
                  className="taskNav-input"
                  value={labelName}
                  onBlur={() => {
                    changeLabelName(taskNavArray[1], taskNavArray[0]);
                  }}
                />
              )}
              {unFinsihNum || allNum ? (
                <Chip
                  size="small"
                  label={unFinsihNum + ' / ' + allNum}
                  className={classes.chip}
                />
              ) : null}
            </div>

            {!taskNavArray[1]._key ? (
              <img
                src={unDragPng}
                alt=""
                style={{ width: '17px', height: '20px' }}
              />
            ) : null}

            {role > 0 && role < 5 ? (
              <div className="taskNav-name-info">
                <div
                  className="icon-container"
                  onClick={() => {
                    if (headerIndex !== 3) {
                      setChooseLabelKey(
                        taskNavArray[1]._key
                          ? taskNavArray[1]._key
                          : taskNavArray[0]._key
                      );
                      setAddTaskVisible(true);
                    }
                  }}
                >
                  <img src={plusPng} className="taskNav-name-plus" />
                </div>
                <div
                  className="icon-container"
                  onClick={() => {
                    setChooseLabelKey(
                      taskNavArray[1]._key
                        ? taskNavArray[1]._key
                        : taskNavArray[0]._key
                    );
                    setBatchVisible(true);
                    if (taskNavArray && taskNavArray[1]._key) {
                      let taskType = taskNavArray[1]._key
                        ? taskNavArray[1].taskType
                        : taskNavArray[0].taskType;
                      taskTypeArr.forEach((item: any, index: number) => {
                        if (item.id === taskType) {
                          setTaskTypeIndex(index);
                        }
                      });
                    }
                  }}
                >
                  <img src={ellipsisPng} className="taskNav-name-ellipsis" />
                </div>
                <DropMenu
                  visible={
                    (taskNavArray[1]._key + '' == chooseLabelKey ||
                      taskNavArray[0]._key + '' == chooseLabelKey) &&
                    batchVisible
                  }
                  dropStyle={{
                    width: '150px',
                    top: '45px',
                    left: '190px',
                    color: '#333',
                  }}
                  onClose={() => {
                    setChooseLabelKey('');
                    setBatchVisible(false);
                  }}
                  title={'设置频道'}
                >
                  <div className="taskNav-set">
                    {role > 0 && role < 4 ? (
                      <div onClick={batchTaskArray}>归档全部已完成任务</div>
                    ) : null}
                    {role > 0 && role < 4 ? (
                      <div
                        onClick={() => {
                          setTaskTypeVisible(true);
                        }}
                        style={{
                          color: color[taskTypeIndex],
                          backgroundColor: backgroundColor[taskTypeIndex],
                        }}
                      >
                        任务类型
                      </div>
                    ) : null}
                    <div
                      onClick={() => {
                        setBatchAddVisible(true);
                      }}
                    >
                      批量导入
                    </div>
                    {role > 0 && role < 3 && taskNavArray[1]._key ? (
                      <div
                        onClick={() => {
                          setDeleteVisible(true);
                        }}
                      >
                        删除频道
                      </div>
                    ) : null}
                  </div>
                </DropMenu>
                <DropMenu
                  visible={taskTypeVisible}
                  onClose={() => {
                    setTaskTypeVisible(false);
                  }}
                  // title={'默认任务类型'}
                  dropStyle={{
                    width: '82px',
                    height: '228px',
                    left: '341px',
                    top: '150px',
                    zIndex: 5,
                  }}
                >
                  {taskTypeArr.map((taskTypeItem, taskTypeIndex) => {
                    return (
                      <div
                        key={'taskType' + taskTypeIndex}
                        className="taskNav-taskType"
                        style={{
                          color: color[taskTypeIndex],
                          backgroundColor: backgroundColor[taskTypeIndex],
                        }}
                        onClick={() => {
                          setTaskTypeIndex(taskTypeIndex);
                          setTaskTypeVisible(false);
                          changeDefaultTaskType(taskTypeItem.id);
                        }}
                      >
                        {taskTypeItem.name}
                      </div>
                    );
                  })}
                </DropMenu>
                {/* <DropMenu
                visible={addTaskVisible}
                dropStyle={{
                  width: '100%',
                  top: '60px',
                  left: '0px',
                  color: '#333',
                }}
                onClose={() => {
                  setAddTaskVisible(false);
                  setAddInput('');
                }}
                title={'新增任务'}
              >
                
              </DropMenu> */}
              </div>
            ) : null}
            <Dialog
              visible={batchAddVisible}
              onClose={() => {
                setBatchAddVisible(false);
              }}
              onOK={() => {
                batchAddTask();
              }}
              title={'批量导入'}
              dialogStyle={{ width: '500px', height: '450px' }}
            >
              <div className="taskNav-textarea-container">
                <textarea
                  value={batchAddText}
                  onChange={(e: any) => {
                    setBatchAddText(e.target.value);
                  }}
                  className="taskNav-textarea"
                ></textarea>
              </div>
            </Dialog>
            <Dialog
              visible={deleteVisible}
              onClose={() => {
                setDeleteVisible(false);
              }}
              onOK={() => {
                deleteLabel();
                setDeleteVisible(false);
              }}
              title={'删除频道'}
              dialogStyle={{ width: '300px', height: '200px' }}
            >
              <div className="deleteLabel-container">是否删除该频道</div>
            </Dialog>
          </div>
          {(taskNavArray[1]._key + '' == chooseLabelKey ||
            taskNavArray[0]._key + '' == chooseLabelKey) &&
          addTaskVisible &&
          headerIndex !== 3 ? (
            <div className="taskItem-plus-title taskNav-plus-title">
              <div className="taskItem-plus-input">
                <input
                  // required
                  placeholder="任务标题"
                  value={addInput}
                  autoComplete="off"
                  onChange={(e) => {
                    setAddInput(e.target.value);
                  }}
                  style={{ fontSize: '14px' }}
                />
              </div>
              <div
                className="taskItem-plus-button"
                style={{ marginTop: '10px' }}
              >
                <div className="taskNav-url">
                  <IconButton
                    color="primary"
                    component="span"
                    onClick={() => {
                      setMoveState(true);
                    }}
                  >
                    <img
                      src={urlSvg}
                      alt=""
                      style={{ height: '25px', width: '25px' }}
                    />
                  </IconButton>

                  <input
                    className="taskNav-url-input"
                    value={urlInput}
                    onChange={(e: any) => {
                      setUrlInput(e.target.value);
                    }}
                    placeholder="请输入链接地址"
                    style={
                      moveState
                        ? {
                            animation: 'urlOut 500ms',
                            animationFillMode: 'forwards',
                          }
                        : {}
                    }
                  />
                </div>
                <Button
                  onClick={() => {
                    setChooseLabelKey('');
                    setAddTaskVisible(false);
                    setAddInput('');
                    setMoveState(false);
                  }}
                  style={{ marginRight: '10px', color: '#efefef' }}
                >
                  取消
                </Button>
                {addInput && !loading ? (
                  <Button
                    variant="contained"
                    color="primary"
                    onClick={() => {
                      addTask(taskNavArray[0], taskNavArray[1]);
                    }}
                    style={{ marginLeft: '10px', color: '#fff' }}
                  >
                    确定
                  </Button>
                ) : (
                  <Button
                    variant="contained"
                    disabled
                    style={{ marginLeft: '10px', color: '#fff' }}
                  >
                    确定
                  </Button>
                )}
              </div>
            </div>
          ) : null}
        </div>
      ) : null}
    </React.Fragment>
  );
};
TaskNav.defaultProps = {
  avatar: null,
  name: '',
  role: 0,
  colorIndex: 0,
  taskNavArray: null,
  taskNavWidth: '',
  setChooseLabelKey: null,
  chooseLabelKey: '',
  batchTaskArray: null,
};
export default TaskNav;
