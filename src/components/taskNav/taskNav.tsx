import React, { useState, useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { getWorkingTableTask } from '../../redux/actions/taskActions';
import { TextField } from '@material-ui/core';
import { createStyles, Theme, makeStyles } from '@material-ui/core/styles';
import moment from 'moment';
import { useTypedSelector } from '../../redux/reducer/RootState';
import api from '../../services/api';
import DropMenu from '../common/dropMenu';
import Dialog from '../common/dialog';
import './taskNav.css';
import plusPng from '../../assets/img/plus.png';
import unDragPng from '../../assets/img/undrag.png';
import ellipsisPng from '../../assets/img/ellipsis.png';
import { getGroupTask } from '../../redux/actions/taskActions';
import { setMessage } from '../../redux/actions/commonActions';

interface TaskNavProps {
  avatar?: any;
  name: string;
  role: string | number;
  colorIndex: number;
  taskNavArray: any;
  taskNavWidth: number | string;
  setChooseLabelKey?: any;
  chooseLabelKey?: string;
  batchTaskArray?: any;
  changeLabelAvatar?: any;
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
  })
);
const TaskNav: React.FC<TaskNavProps> = (prop) => {
  const {
    avatar,
    name,
    role,
    colorIndex,
    taskNavArray,
    taskNavWidth,
    setChooseLabelKey,
    chooseLabelKey,
    batchTaskArray,
    changeLabelAvatar,
  } = prop;
  const classes = useStyles();
  const groupKey = useTypedSelector((state) => state.group.groupKey);
  const headerIndex = useTypedSelector((state) => state.common.headerIndex);
  const user = useTypedSelector((state) => state.auth.user);
  const targetUserInfo = useTypedSelector((state) => state.auth.targetUserInfo);
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

  useEffect(() => {
    if (name) {
      setLabelName(name);
    }
    if (avatar) {
      setLabelAvatar(avatar);
    }
  }, [name, avatar]);
  const BgColorArray = [
    'rgba(48,191,191,0.3)',
    'rgba(0,170,255,0.3)',
    'rgba(143,126,230,0.3)',
    'rgba(179,152,152,0.3)',
    'rgba(242,237,166,0.3)',
  ];
  const taskNavBgColor = colorIndex % 5;
  const addTask = async (groupInfo: any, labelInfo: any) => {
    let addTaskRes: any = await api.task.addTask(
      groupInfo._key,
      groupInfo.groupRole,
      labelInfo._key,
      labelInfo.executorKey
    );
    if (addTaskRes.msg === 'OK') {
      dispatch(setMessage(true, '新增任务成功', 'success'));
      if (headerIndex === 1) {
        dispatch(getWorkingTableTask(1, user._key, 1, [0, 1, 2]));
      } else if (headerIndex === 2) {
        dispatch(getWorkingTableTask(2, targetUserInfo._key, 1, [0, 1, 2]));
      } else if (headerIndex === 3) {
        dispatch(getGroupTask(3, groupKey, '[0,1,2]'));
      }
    } else {
      dispatch(setMessage(true, addTaskRes.msg, 'error'));
    }
  };
  const changeLabelName = (labelInfo: any) => {
    if (labelName !== name) {
      api.group.setCardLabel(labelInfo._key, labelName);
    }
    setLabelNameVisible(false);
  };
  const changeDefaultExecutor = (executorItem: any, labelKey: string) => {
    let key = labelKey ? labelKey : taskNavArray[0]._key;
    let type = labelKey ? 1 : 2;
    api.group.setLabelOrGroupExecutorKey(
      key,
      executorItem ? executorItem.userId : null,
      type
    );
    setLabelAvatar(executorItem.avatar);
    changeLabelAvatar(executorItem, colorIndex);
  };
  const batchAddTask = async () => {
    let batchTaskRes: any = await api.task.batchCard(
      batchAddText,
      taskNavArray[0]._key,
      taskNavArray[1]._key
    );
    if (batchTaskRes.msg === 'OK') {
      dispatch(setMessage(true, '新增成功', 'success'));
      if (headerIndex === 1) {
        dispatch(getWorkingTableTask(1, user._key, 1, [0, 1, 2]));
      } else if (headerIndex === 2) {
        dispatch(getWorkingTableTask(2, targetUserInfo._key, 1, [0, 1, 2]));
      } else if (headerIndex === 3) {
        dispatch(getGroupTask(3, groupKey, '[0,1,2]'));
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
        dispatch(getWorkingTableTask(1, user._key, 1, [0, 1, 2]));
      } else if (headerIndex === 2) {
        dispatch(getWorkingTableTask(2, targetUserInfo._key, 1, [0, 1, 2]));
      } else if (headerIndex === 3) {
        dispatch(getGroupTask(3, groupKey, '[0,1,2]'));
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
          className="taskNav"
          style={{
            backgroundColor: BgColorArray[taskNavBgColor],
            width: taskNavWidth,
            marginRight: headerIndex === 3 ? '15px' : '0px',
          }}
        >
          <div className="taskNav-name-info">
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
                    width: '150px',
                    height: '200px',
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
                          (groupMemberItem: any, groupMemberIndex: number) => {
                            return (
                              <div
                                key={'groupMember' + groupMemberIndex}
                                className="defaultExecutor-info-item"
                                onClick={() => {
                                  changeDefaultExecutor(
                                    groupMemberItem,
                                    taskNavArray[1]._key
                                  );
                                }}
                              >
                                <div className="defaultExecutor-info-avatar">
                                  <img src={groupMemberItem.avatar} alt="" />
                                </div>
                                {groupMemberItem.nickName}
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
              <div
                className="taskNav-name"
                onClick={() => {
                  if (role > 0 && role < 4 && headerIndex === 3) {
                    setLabelNameVisible(true);
                  }
                }}
              >
                {labelName}
                {}
              </div>
            ) : (
              <TextField
                required
                id="outlined-basic"
                variant="outlined"
                label="标题名"
                onChange={(e: any) => {
                  setLabelName(e.target.value);
                }}
                className={classes.input}
                value={labelName}
                onMouseLeave={() => {
                  changeLabelName(taskNavArray[1]);
                }}
              />
            )}
          </div>
          {!taskNavArray[1]._key ? (
            <img
              src={unDragPng}
              alt=""
              style={{ width: '17px', height: '20px' }}
            />
          ) : null}

          {role > 0 && role < 4 ? (
            <div className="taskNav-name-info">
              <div
                className="icon-container"
                onClick={() => {
                  addTask(taskNavArray[0], taskNavArray[1]);
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
